import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import PlausibleProvider from 'next-plausible';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Transition from '@/components/Transition';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

let title = 'MKWeb - Développeur Web Freelance à Chartres';
let description =
  'Développeur Web Freelance à Chartres. Création de sites internet, applications web, référencement et maintenance de sites web.';
let url = 'https://www.mkweb.fr';
let ogimage = 'https://www.mkweb.fr/og-image.png';
let sitename = 'qrGPT.io';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [ogimage],
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
        <PlausibleProvider domain="mkweb.fr" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <Transition>
          <ThemeProvider>{children}</ThemeProvider>
        </Transition>
        <ScrollToTopButton />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
