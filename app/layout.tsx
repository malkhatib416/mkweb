import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import PlausibleProvider from 'next-plausible';
import GradientWrapper from '@/components/GradientWrapper';
import { useEffect, useState } from 'react';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Transition from '@/components/Transition';

const inter = Inter({ subsets: ['latin'] });

let title = 'QrGPT - QR Code Generator';
let description = 'Generate your AI QR Code in seconds';
let url = 'https://www.qrgpt.io';
let ogimage = 'https://www.qrgpt.io/og-image.png';
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
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogimage],
    title,
    description,
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
          <main>{children}</main>
        </Transition>
        <ScrollToTopButton />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
