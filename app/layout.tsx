import '@/app/globals.css';
import PublicChrome from '@/components/PublicChrome';
import Transition from '@/components/Transition';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { getDictionary } from '@/locales/dictionaries';
import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { isValidLocale } from '@/locales/i18n';
import { APP_NAME, APP_URL, EMAIL, PHONE } from '@/utils/consts';
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
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromHeaders();

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

export default async function RootLayout({ children }: Props) {
  const locale = await getLocaleFromHeaders();

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const GTM_ID = process.env.GTM_ID;

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/MKWeb.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: EMAIL,
      telephone: PHONE,
      contactType: 'customer service',
      availableLanguage: ['French', 'English'],
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="mk-web.fr" />
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@uiw/react-md-editor/markdown-editor.css"
        />
      </head>
      <body className={inter.className}>
        <ReCaptchaProvider>
          <Transition>
            <ThemeProvider>
              <PublicChrome dict={dict}>{children}</PublicChrome>
            </ThemeProvider>
          </Transition>
          <Analytics />
          <Toaster />
          <GoogleAnalytics gaId="G-9NPYEM4FGH" />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
