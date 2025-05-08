'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MKWEbLogo = () => {
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-wrapper');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setPastHero(heroBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, searchParams]);

  const imgPath =
    pastHero || pathname !== '/' ? '/logo.png' : '/logo-white.png';

  return (
    <Link href="/#main" className="flex items-center gap-3">
      <Image src={imgPath} alt="logo" width={120} height={120} />
    </Link>
  );
};

export default MKWEbLogo;
