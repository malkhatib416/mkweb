'use client';

import React from 'react';
import MKWEbLogo from './Icons/MKWebLogo';
import Link from 'next/link';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { Suspense } from 'react';
import { EMAIL, PHONE } from '@/utils/consts';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { isValidLocale, type Locale } from '@/locales/i18n';
import frDict from '@/locales/dictionaries/fr.json';
import enDict from '@/locales/dictionaries/en.json';

const dictionaries = {
  fr: frDict,
  en: enDict,
};

const SubFooter = ({ locale }: { locale: Locale }) => {
  const date = new Date();
  const dict = dictionaries[locale];

  return (
    <div className="custom-screen">
      <p className="my-6 text-center text-xs">
        © {date.getFullYear()} MKWeb. {dict.footer.rights}.
      </p>
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
      <footer className="bg-slate-50">
        <div className="custom-screen">
          <div className="py-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">
            <div className="w-full hidden md:block">
              <Suspense>
                <MKWEbLogo />
                <Link
                  href="https://www.linkedin.com/in/mohamad-alkhatib416/"
                  className=" inline-block text-white hover:text-white/50 transition-all duration-200 ease-in-out mt-4 bg-[#0e76a8] p-1.5 rounded-md me-2"
                  target="_blank"
                >
                  <Linkedin />
                </Link>

                <Link
                  href="https://www.malt.fr/profile/mohamadalkhatib"
                  className="inline-block text-white hover:text-white/50 transition-all duration-200 ease-in-out mt-4 bg-[#FC5657] p-1.5 rounded-md"
                  target="_blank"
                >
                  <Image src="/malt.svg" alt="Malt" width={24} height={24} />
                </Link>
              </Suspense>
            </div>
            <div className="w-full  md:text-left">
              <p className="text-gray-600 font-bold text-lg mb-4 md:mb-0">
                {t.links}
              </p>
              <ul className="text-sm mt-4 flex flex-col gap-4">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                  >
                    {t.home}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/mentions-legales`}
                    className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                  >
                    {t.legalNotice}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}#contact`}
                    className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                  >
                    {t.contact}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full  md:text-left">
              <p className="text-gray-600 font-bold text-lg mb-4 md:mb-0">
                {t.contact}
              </p>
              <ul className="text-sm mt-4 flex flex-col gap-4">
                <li>
                  <Link
                    href={`tel:${PHONE}`}
                    className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                  >
                    <Phone size={16} />
                    {PHONE}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`mailto:${EMAIL}`}
                    className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                  >
                    <Mail size={16} />
                    {EMAIL}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <SubFooter locale={locale} />
    </React.Fragment>
  );
};

export default Footer;
