'use client';

import enDict from '@/locales/dictionaries/en.json';
import frDict from '@/locales/dictionaries/fr.json';
import { isValidLocale, type Locale } from '@/locales/i18n';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import MKWEbLogo from './Icons/MKWebLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

const dictionaries = { fr: frDict, en: enDict } as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? '/';

  // Get locale from pathname
  const locale: Locale = (() => {
    const segment = pathname.split('/')[1];
    return isValidLocale(segment) ? segment : 'fr';
  })();

  const t = dictionaries[locale].nav;

  const links = [
    { href: `/${locale}/#main`, label: t.home },
    { href: `/${locale}/#services`, label: t.services },
    { href: `/${locale}/blog`, label: t.blog },
    { href: `/${locale}/#contact`, label: t.contact },
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Desktop navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-[2rem]">
        <nav className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={`/${locale}/#main`} aria-label="MK-Web home">
              <MKWEbLogo />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-myorange-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href={`/${locale}/estimation`}
                className="ml-3 px-5 py-2 text-[10px] font-mono uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 border border-slate-800 dark:border-white"
              >
                {t.estimation}
              </Link>

              <div className="flex items-center gap-1 pl-3 ml-3 border-l border-slate-200 dark:border-slate-800">
                <ThemeToggle />
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 -mr-2 text-slate-600 dark:text-slate-400"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white dark:bg-slate-950 md:hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        {/* Top bar with logo and close */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <Link
            href={`/${locale}/#main`}
            onClick={() => setIsOpen(false)}
            aria-label="MK-Web home"
          >
            <MKWEbLogo />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-3 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu content */}
        <div
          className={`flex flex-col items-center justify-center gap-8 pt-16 transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-medium text-slate-900 dark:text-slate-100 hover:text-myorange-100 transition-all duration-200 hover:scale-105"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={`/${locale}/estimation`}
            onClick={() => setIsOpen(false)}
            className="px-8 py-3 text-lg font-semibold text-white bg-myorange-100 hover:bg-myorange-200 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {t.estimation}
          </Link>

          <div className="flex items-center gap-4 pt-4">
            <ThemeToggle />
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
