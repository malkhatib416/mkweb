import React from 'react';
import MKWEbLogo from './Icons/MKWebLogo';
import Link from 'next/link';
import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Suspense } from 'react';
import Image from 'next/image';

const SubFooter = () => {
  const date = new Date();

  return (
    <div className="bg-gray-900">
      <div className="custom-screen">
        <p className="py-8 text-center text-gray-400">
          © {date.getFullYear()} MK-Web. Tous droits réservés. Développé avec ❤️ à Chartres.
        </p>
      </div>
    </div>
  );
};

const SubFooter = () => {
  const date = new Date();

  return (
    <div className="bg-gray-900">
      <div className="custom-screen">
        <p className="py-8 text-center text-gray-400">
          © {date.getFullYear()} MK-Web. Tous droits réservés. Développé avec ❤️ à Chartres.
        </p>
      </div>
    </div>
  );
};

const SubFooter = () => {
  const date = new Date();

  return (
    <div className="bg-gray-900">
      <div className="custom-screen">
        <p className="py-8 text-center text-gray-400">
          © {date.getFullYear()} MK-Web. Tous droits réservés. Développé avec ❤️ à Chartres.
      </p>
      </div>
    </div>
  );
};

const Footer = () => (
  <React.Fragment>
    <footer className="bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="custom-screen">
        <div className="mt-10 py-20 flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-8">
          <div className="w-full hidden md:block">
            <Suspense>
              <MKWEbLogo />
              <p className="text-gray-600 mt-4 max-w-sm leading-relaxed">
                Développeur web freelance passionné, créateur de solutions digitales sur-mesure pour faire grandir votre business.
              </p>
              <Link
                href="https://www.linkedin.com/in/mohamad-alkhatib416/"
                className="inline-block text-white hover:text-white/80 transition-all duration-300 hover:scale-110 mt-6 bg-[#0e76a8] p-3 rounded-xl me-3 shadow-lg hover:shadow-xl"
                target="_blank"
              >
                <Linkedin className="w-5 h-5" />
              </Link>

              <Link
                href="https://www.malt.fr/profile/mohamadalkhatib"
                className="inline-block text-white hover:text-white/80 transition-all duration-300 hover:scale-110 mt-6 bg-[#FC5657] p-3 rounded-xl shadow-lg hover:shadow-xl"
                target="_blank"
              >
                <Image src="/malt.svg" alt="Malt" width={20} height={20} />
              </Link>
            </Suspense>

          </div>
          <div className="w-full md:text-left">
            <p className="text-gray-800 font-bold text-xl mb-6">
              Liens
            </p>
            <ul className="text-base flex flex-col gap-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-myorange-100 transition-all duration-200 font-medium"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-gray-600 hover:text-myorange-100 transition-all duration-200 font-medium"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/nous-contacter"
                  className="text-gray-600 hover:text-myorange-100 transition-all duration-200 font-medium"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:text-left">
            <p className="text-gray-800 font-bold text-xl mb-6">
              Contact
            </p>
            <ul className="text-base flex flex-col gap-4">
              <li>
                <Link
                  href="tel:+33646777804"
                  className="text-gray-600 hover:text-myorange-100 transition-all duration-200 flex items-center md:justify-start gap-3 font-medium"
                >
                  <Phone size={18} className="text-myorange-100" />
                  06 46 77 78 04
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:contact@mk-web.fr"
                  className="text-gray-600 hover:text-myorange-100 transition-all duration-200 flex items-center md:justify-start gap-3 font-medium"
                >
                  <Mail size={18} className="text-myorange-100" />
                  contact@mk-web.fr
                </Link>
              </li>
              <li>
                <div
                  className="text-gray-600 flex items-start md:justify-start gap-3"
                >
                  <MapPin size={18} className="text-myorange-100 mt-1 flex-shrink-0" />
                  <div className="w-full md:text-left">
                    4 Mail des Petits Clos,
                    <span className="block">28000 Chartres</span>
                  </div>
                </div>
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
