'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import enDict from '@/locales/dictionaries/en.json';
import frDict from '@/locales/dictionaries/fr.json';
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
};

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
}: {
  locale: Locale;
  t: typeof frDict.footer;
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
    <div className="w-full md:text-left">
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

  const dict = dictionaries[locale];
  const t = dict.footer;

  return (
    <React.Fragment>
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-600">
        <div className="custom-screen">
          <div className="py-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">
            <div className="w-full hidden md:block">
              <Suspense>
                <Link href={`/${locale}/#main`} aria-label="MK-Web home">
                  <MKWEbLogo />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/mohamad-alkhatib416/"
                  className="inline-flex items-center justify-center min-w-12 min-h-12 text-white hover:text-white/50 transition-all duration-200 ease-in-out mt-4 bg-[#0e76a8] p-3 rounded-md me-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-6 h-6" aria-hidden />
                </Link>

                <Link
                  href="https://www.malt.fr/profile/mohamadalkhatib"
                  className="inline-flex items-center justify-center min-w-12 min-h-12 text-white hover:text-white/50 transition-all duration-200 ease-in-out mt-4 bg-[#FC5657] p-3 rounded-md"
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
              </Suspense>
            </div>
            <div className="w-full  md:text-left">
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
                    href={`/${locale}/mentions-legales`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out"
                  >
                    {t.legalNotice}
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
              </ul>
            </div>
            <div className="w-full  md:text-left">
              <p className="text-gray-600 dark:text-slate-200 font-bold text-lg mb-4 md:mb-0">
                {t.contact}
              </p>
              <ul className="text-sm mt-4 flex flex-col gap-4">
                <li>
                  <Link
                    href={`tel:${PHONE}`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                  >
                    <Phone size={16} />
                    {PHONE}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`mailto:${EMAIL}`}
                    className="text-gray-600 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                  >
                    <Mail size={16} />
                    {EMAIL}
                  </Link>
                </li>
              </ul>
            </div>
            <FooterNewsletter locale={locale} t={t} />
          </div>
        </div>
      </footer>

      <SubFooter locale={locale} />
    </React.Fragment>
  );
};

export default Footer;
