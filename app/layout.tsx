import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import PlausibleProvider from 'next-plausible';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Transition from '@/components/Transition';
import { ThemeProvider } from '@/components/theme-provider';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

let title = 'MK-Web - Développeur Web Freelance à Chartres';
let description =
  'Développeur Web Freelance à Chartres. Création de sites internet, applications web, référencement et maintenance de sites web.';
let url = 'https://www.mk-web.fr';
let sitename = 'MK-Web';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  robots: 'follow, index',
  keywords: [
    'Développeur Web',
    'Freelance',
    'Chartres',
    'Création de sites internet',
    'Applications web',
    'Référencement',
    'Maintenance de sites web',
    'MK-Web',
    'Agence Web',
    'Webmaster Freelance',
    'Développeur Web Freelance',
    'Développeur Web Chartres',
    'Création de sites internet Chartres',
    'Applications web Chartres',
    'Référencement Chartres',
    'Maintenance de sites web Chartres',
    'Agence Web Chartres',
    'Webmaster Freelance Chartres',
  ],
  openGraph: {
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="mk-web.fr" />
      </head>
      <body className={inter.className}>
        <ReCaptchaProvider>
          <Suspense>
            <Navbar />
          </Suspense>
          <Transition>
            <ThemeProvider>
              <main className="sm:mt-12">{children}</main>
            </ThemeProvider>
          </Transition>
          <ScrollToTopButton />
          <Analytics />
          <Footer />
          <Toaster />
          <GoogleAnalytics gaId="G-9NPYEM4FGH" />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
