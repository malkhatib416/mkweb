import '@/app/globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Transition from '@/components/Transition';
import WhatsAppQuickContact from '@/components/WhatsAppQuickContact';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { getDictionary } from '@/locales/dictionaries';
import { isValidLocale, locales } from '@/locales/i18n';
import { APP_NAME, APP_URL } from '@/utils/consts';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `${APP_URL}/${locale}`,
      siteName: APP_NAME,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${APP_URL}/api/og?title=${encodeURIComponent(
            dict.metadata.title,
          )}&description=${encodeURIComponent(
            dict.metadata.description,
          )}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: dict.metadata.title,
        },
      ],
    },
    alternates: {
      canonical: `${APP_URL}/${locale}`,
      languages: {
        fr: `${APP_URL}/fr`,
        en: `${APP_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const GTM_ID = process.env.GTM_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="mk-web.fr" />
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@uiw/react-md-editor/markdown-editor.css"
        />
      </head>
      <body className={inter.className}>
        <ReCaptchaProvider>
          <Suspense>
            <Navbar />
          </Suspense>
          <Transition>
            <ThemeProvider>{children}</ThemeProvider>
          </Transition>
          <ScrollToTopButton />
          <Analytics />
          <Footer />
          <Toaster />
          <GoogleAnalytics gaId="G-9NPYEM4FGH" />
          <WhatsAppQuickContact dict={dict} />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
