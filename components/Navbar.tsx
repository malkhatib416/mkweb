'use client';

import enDict from '@/locales/dictionaries/en.json';
import frDict from '@/locales/dictionaries/fr.json';
import { isValidLocale, type Locale } from '@/locales/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MKWEbLogo from './Icons/MKWebLogo';
import LanguageSwitcher from './LanguageSwitcher';
import NavLink from './NavLink';
import { ThemeToggle } from './ThemeToggle';

const dictionaries = {
  fr: frDict,
  en: enDict,
} as const;

const useBodyScrollLock = (
  isOpen: boolean,
  menuRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      const firstLink = menuRef.current?.querySelector('a');
      firstLink?.focus();
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, menuRef]);
};

// Constants
const MOBILE_NAV_ID = 'mobile-nav';

// Types
interface NavigationItem {
  title: string;
  path: string;
  id: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname() ?? '/';

  // Extract locale from pathname
  const currentLocale: Locale = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const localeFromPath = pathSegments[0];
    return isValidLocale(localeFromPath) ? localeFromPath : 'fr';
  }, [pathname]);

  const dict = dictionaries[currentLocale];
  const t = dict.nav;

  const navigation: NavigationItem[] = useMemo(
    () => [
      {
        title: t.home,
        path: `/${currentLocale}/#main`,
        id: 'home',
      },
      {
        title: t.services,
        path: `/${currentLocale}/#services`,
        id: 'services',
      },
      {
        title: t.blog,
        path: `/${currentLocale}/blog`,
        id: 'blog',
      },
      {
        title: t.contact,
        path: `/${currentLocale}/#contact`,
        id: 'contact',
      },
    ],
    [t, currentLocale],
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    // Return focus to menu button when closing
    menuButtonRef.current?.focus();
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    },
    [isMenuOpen, closeMenu],
  );
  // Manage body scroll and close menu when the route changes
  useBodyScrollLock(isMenuOpen, mobileMenuRef);
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Handle escape key to close menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, closeMenu]);

  const headerClassName =
    'fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-[2rem] transition-all duration-300';
  const desktopNavLinkClass =
    'inline-flex items-center px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-myorange-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2';

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header className={headerClassName} onKeyDown={handleKeyDown}>
      <nav className="w-full px-4 sm:px-6" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 z-50 relative">
            <Link
              href={`/${currentLocale}/#main`}
              aria-label="MK-Web home"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2 rounded-lg block hover:scale-105 transition-transform"
              onClick={() => isMenuOpen && closeMenu()}
            >
              <MKWEbLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={desktopNavLinkClass}
              >
                {item.title}
              </Link>
            ))}

            <NavLink
              href={`/${currentLocale}/estimation`}
              className="ml-4 inline-flex items-center justify-center px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 rounded-full transition-all duration-200 shadow-md dark:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 hover:scale-105 active:scale-95 border border-slate-800 dark:border-white"
            >
              {t.estimation}
            </NavLink>

            <div className="flex items-center gap-2 pl-4 ml-4 border-l border-slate-200 dark:border-slate-800">
              <ThemeToggle />
              <LanguageSwitcher currentLocale={currentLocale} />
            </div>
          </div>
          <div className="md:hidden z-50 relative">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls={MOBILE_NAV_ID}
              className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id={MOBILE_NAV_ID}
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-0 z-40 bg-white dark:bg-slate-950 md:hidden flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-md px-6 py-8 flex flex-col items-center space-y-6">
                {navigation.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className="text-2xl font-medium text-gray-900 dark:text-slate-100 hover:text-myorange-100 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={itemVariants} className="pt-4">
                  <NavLink
                    href={`/${currentLocale}/estimation`}
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-myorange-100 hover:bg-myorange-200 rounded-full transition-colors duration-200 shadow-md"
                  >
                    {t.estimation}
                  </NavLink>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="pt-8 flex items-center gap-4"
                >
                  <ThemeToggle />
                  <LanguageSwitcher currentLocale={currentLocale} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
