'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavLink from './NavLink';
import { usePathname, useSearchParams } from 'next/navigation';
import MKWEbLogo from './Icons/MKWebLogo';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { set } from 'react-hook-form';

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Navbar = () => {
  const [state, setState] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const navigation = [
    { title: 'Accueil', path: '/' },
    { title: 'Services', path: '/#services' },
  ];

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleState = () => {
      document.body.classList.remove('overflow-hidden');
      setState(false);
    };

    handleState();

    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-wrapper');
      // not view mobile
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setPastHero(heroBottom <= 0);
      }
    };

    handleScroll();
  }, []);

  useEffect(() => {
    // Add closing the navbar menu when navigating
    const handleState = () => {
      document.body.classList.remove('overflow-hidden');
      setState(false);
    };

    handleState();

    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-wrapper');
      // not view mobile
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setPastHero(heroBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, searchParams]);

  const handleNavMenu = () => {
    setState(!state);
    document.body.classList.toggle('overflow-hidden');
  };

  const linkColor = pastHero ? 'text-black' : 'text-white';
  const hoverColor = pastHero ? 'hover:text-black/80' : 'hover:text-white/80';

  const closeMobileMenu = () => {
    setState(false);
    document.body.classList.remove('overflow-hidden');
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
                className={`${linkColor} ${hoverColor}`}
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
                    className={`duration-150 transition-all ${linkColor} ${hoverColor}`}
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
