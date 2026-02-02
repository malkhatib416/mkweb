'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import WhatsAppQuickContact from '@/components/WhatsAppQuickContact';
import type { Dictionary } from '@/locales/dictionaries';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

type Props = {
  dict: Dictionary;
  children: React.ReactNode;
};

/**
 * Renders public site chrome (Navbar, Footer, etc.) only when not on an admin route.
 * Admin dashboard has its own layout and should not show the public navbar/sidebar.
 */
export default function PublicChrome({ dict, children }: Props) {
  const pathname = usePathname() ?? '';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <main id="main">{children}</main>
      <ScrollToTopButton />
      <Footer />
      <WhatsAppQuickContact dict={dict} />
    </>
  );
}
