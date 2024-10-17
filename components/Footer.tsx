import React from 'react';
import MKWEbLogo from './Icons/MKWebLogo';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Suspense } from 'react';

const SubFooter = () => {
  const date = new Date();

  return (
    <div className="custom-screen">
      <p className="my-6 text-center text-xs">
        © {date.getFullYear()} MKWeb. Tous droits réservés.
      </p>
    </div>
  );
};

const Footer = () => (
  <React.Fragment>
    <footer className="bg-slate-50">
      <div className="custom-screen">
        <div className="mt-10 py-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">
          <div className="w-full hidden md:block">
            <Suspense>
              <MKWEbLogo />
            </Suspense>
          </div>
          <div className="w-full  md:text-left">
            <p className="text-gray-600 font-bold text-lg mb-4 md:mb-0">
              Liens
            </p>
            <ul className="text-sm mt-4 flex flex-col gap-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/nous-contacter"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full  md:text-left">
            <p className="text-gray-600 font-bold text-lg mb-4 md:mb-0">
              Contact
            </p>
            <ul className="text-sm mt-4 flex flex-col gap-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                >
                  <Phone size={16} />
                  06 46 77 78 04
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:contact@mk-web.fr"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                >
                  <Mail size={16} />
                  contact@mk-web.fr
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center  md:justify-start gap-2"
                >
                  <MapPin size={16} />
                  <div className="w-full  md:text-left">
                    4 Mail des Petits Clos,
                    <span className="block">28000 Chartres</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>

    <SubFooter />
  </React.Fragment>
);

export default Footer;
