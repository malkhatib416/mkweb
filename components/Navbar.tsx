'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavLink from './NavLink';
import { usePathname, useSearchParams } from 'next/navigation';
import MKWEbLogo from './Icons/MKWebLogo';
import useWindowSize from '@/hooks/useWindowSize';
import { Suspense } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [width] = useWindowSize(); // Automatically detects window size

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigation = [
    { title: 'Accueil', path: '/#main' },
    { title: 'Services', path: '/#services' },
  ];

  const handleState = () => {
    document.body.classList.remove('overflow-hidden');
    setIsMenuOpen(false);
  };

  const handleScroll = () => {
    const heroSection = document.querySelector('.hero-wrapper');
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      setPastHero(heroBottom <= 0);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [width]);

  useEffect(() => {
    handleState(); // Close menu on navigation
  }, [pathname, searchParams]);

  const handleNavMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('overflow-hidden');
  };

  const hoverColor = pastHero ? 'hover:text-black/80' : 'hover:text-white/80';
  const inHomePage = pathname === '/';

  const linkColor = (whiteOnMobile = false) => {
    if (!inHomePage) return 'text-black hover:text-black/80'; // Handle other pages
    if (whiteOnMobile && !pastHero) return 'text-white hover:text-white/80';
    if (width <= 768) return 'text-black hover:text-black/80'; // Handle mobile
    return pastHero
      ? 'text-black hover:text-black/80'
      : 'text-white hover:text-white/80';
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <header
      className={`fixed top-0 w-full z-10 ${pastHero ? 'bg-white shadow-sm' : ''} ${!inHomePage ? 'shadow-sm' : ''}`}
    >
      <nav
        className={`w-full md:static md:text-sm ${isMenuOpen ? 'fixed h-full' : ''}`}
      >
        <div className="items-center mx-auto md:flex custom-screen">
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Suspense>
              <MKWEbLogo />
            </Suspense>
            <div className="md:hidden">
              <button
                role="button"
                aria-label="Toggle menu"
                className={`${linkColor(true)} ${hoverColor}`}
                onClick={handleNavMenu}
              >
                {isMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div
            onClick={closeMobileMenu}
            className={`flex-1 pb-3 mt-8 md:pb-0 md:mt-0 md:block ${
              isMenuOpen
                ? 'h-screen fixed -top-8 left-0 w-full pt-12 px-4 bg-white text-gray-600'
                : 'hidden'
            }`}
          >
            <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0 md:font-medium">
              {navigation.map((item, idx) => (
                <li
                  key={idx}
                  className={`duration-150 transition-all ${linkColor()} `}
                >
                  <Link href={item.path} className="block">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <NavLink
                  href="/nous-contacter"
                  className="block font-medium text-sm text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100-900 md:inline"
                >
                  Demander un devis
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
