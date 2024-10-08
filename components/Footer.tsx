import React from 'react';
import MKWEbLogo from './Icons/MKWebLogo';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

const SubFooter = () => {
  const date = new Date();

  return (
    <div className="custom-screen">
      <p className="my-6 text-center">
        © {date.getFullYear()} MKWeb. Tous droits réservés.
      </p>
    </div>
  );
};

const Footer = () => (
  <React.Fragment>
    <footer className="bg-slate-50">
      <div className="custom-screen ">
        <div className="mt-10 py-12  items-center justify-between flex">
          <MKWEbLogo />
          <div className="">
            <p className="text-gray-600 font-bold text-lg">Liens</p>
            <ul className="text-sm mt-4  flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                >
                  Acceuil
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
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="">
            <p className="text-gray-600 font-bold text-lg">Contact</p>
            <ul className="text-sm mt-4  flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center gap-2"
                >
                  <Phone size={16} />
                  06 46 77 78 04
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center gap-2"
                >
                  <Mail size={16} />
                  contact@mkweb.fr
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-200 ease-in-out flex items-center gap-2"
                >
                  <MapPin size={16} />
                  <div>
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
