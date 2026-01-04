'use client';

import Link from 'next/link';
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
  useRef,
} from 'react';
import type { RefObject } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from './NavLink';
import MKWEbLogo from './Icons/MKWebLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { isValidLocale, type Locale } from '@/locales/i18n';
import frDict from '@/locales/dictionaries/fr.json';
import enDict from '@/locales/dictionaries/en.json';
import { X, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
    'fixed top-0 w-full z-50 bg-white border-b border-gray-100';
  const desktopNavLinkClass =
    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-full text-gray-700 transition-colors duration-200 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2';
  
  const menuVariants = {
    closed: {
      opacity: 0,
      y: '-100%',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    open: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header className={headerClassName} onKeyDown={handleKeyDown}>
      <nav className="w-full" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 z-50 relative">
              <Link
                href={`/${currentLocale}/#main`}
                aria-label="MK-Web home"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2 rounded-lg"
                onClick={() => isMenuOpen && closeMenu()}
              >
                <Suspense fallback={<div className="w-32 h-8" />}>
                  <MKWEbLogo />
                </Suspense>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-3">
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
                className="ml-5 inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-myorange-100 hover:bg-myorange-200 rounded-full transition-colors duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2"
              >
                {t.estimation}
              </NavLink>

              <div className="pl-4 ml-4 border-l border-gray-200/70">
                <LanguageSwitcher currentLocale={currentLocale} />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden z-50 relative">
              <button
                ref={menuButtonRef}
                type="button"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls={MOBILE_NAV_ID}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100/40 focus-visible:ring-offset-2"
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
              className="fixed inset-0 z-40 bg-white md:hidden flex flex-col justify-center items-center"
            >
              <div className="w-full max-w-md px-6 py-8 flex flex-col items-center space-y-6">
                {navigation.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className="text-2xl font-medium text-gray-900 hover:text-myorange-100 transition-colors"
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

                <motion.div variants={itemVariants} className="pt-8">
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
