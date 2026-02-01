'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MKWEbLogo = () => {
  const [pastHero, setPastHero] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-wrapper');
      const mainSection = document.querySelector('#main');
      const section = heroSection ?? mainSection;
      if (section) {
        const sectionBottom = section.getBoundingClientRect().bottom;
        setPastHero(sectionBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, searchParams]);

  // Dark mode: use colored logo on dark nav for contrast. Light: white logo at top of home, colored elsewhere.
  const isDark = mounted && resolvedTheme === 'dark';
  const isHomePage =
    pathname === '/' || pathname === '/fr' || pathname === '/en';
  const useWhiteLogo = !isDark && isHomePage && !pastHero;

  const imgPath = useWhiteLogo ? '/logo-white.png' : '/logo.png';

  return (
    <span className="flex items-center gap-3">
      <Image src={imgPath} alt="MK-Web" width={120} height={120} priority />
    </span>
  );
};

export default MKWEbLogo;
