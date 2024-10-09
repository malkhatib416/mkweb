'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavLink from './NavLink';
import { usePathname, useSearchParams } from 'next/navigation';
import MKWEbLogo from './Icons/MKWebLogo';
import useWindowSize from '@/hooks/useWindowSize';

const Navbar = () => {
  const [state, setState] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [width, height] = useWindowSize();
  const navigation = [
    { title: 'Accueil', path: '/#hero-wrapper' },
    { title: 'Services', path: '/#services' },
  ];

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleState = () => {
    document.body.classList.remove('overflow-hidden');
    setState(false);
  };

  const handleScroll = () => {
    setIsMobile(
      window.matchMedia('(max-width: 767px)').matches ||
        window.matchMedia('(max-width: 1024px)').matches,
    );

    const heroSection = document.querySelector('.hero-wrapper');
    // not view mobile
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      setPastHero(heroBottom <= 0);
    }
  };

  useEffect(() => {
    handleState();
    handleScroll();
  }, []);

  useEffect(() => {
    // Add closing the navbar menu when navigating
    handleState();

    console.log({ width });
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, searchParams, width]);

  const handleNavMenu = () => {
    setState(!state);
    document.body.classList.toggle('overflow-hidden');
  };

  const hoverColor = pastHero ? 'hover:text-black/80' : 'hover:text-white/80';

  const closeMobileMenu = () => {
    setState(false);
    document.body.classList.remove('overflow-hidden');
  };

  const linkColor = (whiteOnMobile = false) => {
    console.log({ whiteOnMobile, isMobile, pastHero });
    if (whiteOnMobile && !pastHero) return 'text-white';

    if (isMobile) return 'text-black';

    if (!isMobile && pastHero) return 'text-black';
    else return 'text-white';

    // const linkColor = isMobile ? 'text-black' : 'text-white';
  };

  return (
    <header className={`fixed top-0 w-full z-10 ${pastHero ? 'bg-white' : ''}`}>
      {/* <ModeToggle /> */}
      <nav
        className={`w-full md:static md:text-sm ${
          state ? 'fixed z-10 h-full' : ''
        }`}
      >
        <div className={`items-center mx-auto md:flex custom-screen`}>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <MKWEbLogo />
            <div className="md:hidden">
              <button
                role="button"
                aria-label="Open the menu"
                className={`${linkColor(true)} ${hoverColor}`}
                onClick={handleNavMenu}
              >
                {state ? (
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
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
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
              state
                ? 'h-screen  fixed -top-8 left-0 w-full pt-12 px-4 bg-white !text-gray-600'
                : 'hidden'
            }`}
          >
            <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0 md:font-medium">
              {navigation.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className={`duration-150 transition-all ${linkColor()} ${hoverColor}`}
                  >
                    <Link href={item.path} className="block">
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <NavLink
                  href="/start"
                  className="block font-medium text-sm text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100-900 md:inline"
                >
                  Nous Contacter
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
