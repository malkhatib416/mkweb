'use client';

import { Button } from '@/components/ui/button';
import { getServiceLinks } from '@/locales/service-pages';
import { Input } from '@/components/ui/input';
import deDict from '@/locales/dictionaries/de.json';
import enDict from '@/locales/dictionaries/en.json';
import esDict from '@/locales/dictionaries/es.json';
import frDict from '@/locales/dictionaries/fr.json';
import itDict from '@/locales/dictionaries/it.json';
import { isValidLocale, type Locale } from '@/locales/i18n';
import { EMAIL, PHONE } from '@/utils/consts';
import { Linkedin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { toast } from 'react-hot-toast';
import MKWEbLogo from './Icons/MKWebLogo';

const dictionaries = {
  fr: frDict,
  en: enDict,
  de: deDict,
  it: itDict,
  es: esDict,
} satisfies Record<Locale, typeof frDict>;

const SubFooter = ({ locale }: { locale: Locale }) => {
  const date = new Date();
  const dict = dictionaries[locale];

  return (
    <div className="custom-screen">
      <p className="my-6 text-center text-xs text-gray-600 dark:text-slate-400">
        © {date.getFullYear()} MKWeb. {dict.footer.rights}.
      </p>
    </div>
  );
};

const FooterNewsletter = ({
  locale,
  t,
  className,
}: {
  locale: Locale;
  t: typeof frDict.footer;
  className?: string;
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t.newsletterError);
      toast.success(t.newsletterSuccess);
      setEmail('');
    } catch {
      toast.error(t.newsletterError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className ?? 'w-full md:text-left'}>
      <p className="text-gray-600 dark:text-slate-200 font-bold text-lg mb-4 md:mb-0">
        {t.newsletterTitle}
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col sm:flex-row gap-2 max-w-xs"
      >
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {t.newsletterPlaceholder}
        </label>
        <Input
          id="footer-newsletter-email"
          type="email"
          placeholder={t.newsletterPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white dark:bg-slate-800"
          required
        />
        <Button
          type="submit"
          size="sm"
          className="bg-myorange-100 hover:bg-myorange-200 shrink-0"
          disabled={loading}
        >
          {loading ? '…' : t.newsletterButton}
        </Button>
      </form>
    </div>
  );
};

const Footer = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const localeFromPath = pathSegments[0];
  const locale: Locale = isValidLocale(localeFromPath) ? localeFromPath : 'fr';

  const dict: typeof frDict = dictionaries[locale];
  const t = dict.footer;
  const nav = dict.nav;
  const serviceLinks = getServiceLinks(locale);

  return (
    <React.Fragment>
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-600">
        <div className="custom-screen">
          <div className="grid gap-10 py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,1fr)] md:items-start">
            <div className="w-full hidden md:block">
              <Suspense>
                <Link href={`/${locale}/#main`} aria-label="MK-Web home">
                  <MKWEbLogo />
                </Link>

                <div className="mt-8">
                  <p className="text-gray-600 dark:text-slate-200 font-bold text-lg mb-4 md:mb-0">
                    {t.contact}
                  </p>
                  <ul className="text-sm mt-4 flex flex-col gap-4">
                    <li>
                      <Link
                        href={`tel:${PHONE}`}
                        className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out flex items-center md:justify-start gap-2"
                      >
                        <Phone size={16} />
                        {PHONE}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`mailto:${EMAIL}`}
                        className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out flex items-center md:justify-start gap-2"
                      >
                        <Mail size={16} />
                        {EMAIL}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <Link
                    href="https://www.linkedin.com/in/mohamad-alkhatib416/"
                    className="inline-flex items-center justify-center   text-white hover:text-white/50 transition-all duration-200 ease-in-out  bg-[#0e76a8] p-2 rounded-md "
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="w-6 h-6" aria-hidden />
                  </Link>
                  <Link
                    href="https://www.malt.fr/profile/mohamadalkhatib"
                    className="inline-flex items-center justify-center   text-white hover:text-white/50 transition-all duration-200 ease-in-out  bg-[#FC5657] p-2 rounded-md"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Malt profile"
                  >
                    <Image
                      src="/malt.svg"
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                    />
                  </Link>
                  <Link
                    href="https://x.com/AlkhatibM804"
                    className="inline-flex items-center justify-center  text-white hover:text-white/70 transition-all duration-200 ease-in-out  bg-black py-2 px-3 rounded-md "
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X profile"
                  >
                    <span
                      className="text-2xl font-semibold leading-none"
                      aria-hidden
                    >
                      X
                    </span>
                  </Link>
                </div>
              </Suspense>
            </div>
            <div className="w-full md:text-left">
              <p className="text-gray-600 dark:text-slate-200 font-bold text-lg mb-4 md:mb-0">
                {t.links}
              </p>
              <ul className="text-sm mt-4 flex flex-col gap-4">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out"
                  >
                    {t.home}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`/${locale}/blog`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out"
                  >
                    {t.blog}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`/${locale}#contact`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out"
                  >
                    {t.contact}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`/${locale}/mentions-legales`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out"
                  >
                    {t.legalNotice}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:text-left">
              <p className="text-gray-600 dark:text-slate-200 font-bold text-lg mb-4 md:mb-0">
                {nav.services}
              </p>
              <ul className="text-sm mt-4 flex flex-col gap-4">
                {serviceLinks.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:text-left">
              <FooterNewsletter
                locale={locale}
                t={t}
                className="w-full md:text-left"
              />
            </div>
          </div>
        </div>
      </footer>

      <SubFooter locale={locale} />
    </React.Fragment>
  );
};

export default Footer;
