'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { isValidLocale } from '@/locales/i18n';

export default function NotFound() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const localeFromPath = pathSegments[0];
  const currentLocale = isValidLocale(localeFromPath) ? localeFromPath : 'fr';

  const content = {
    fr: {
      title: 'Page introuvable',
      description:
        "Oups ! La page que vous cherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'accueil",
    },
    en: {
      title: 'Page not found',
      description:
        "Oops! The page you're looking for doesn't exist or has been moved.",
      backHome: 'Back to home',
    },
  };

  const t = content[currentLocale];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-[#FF7F50] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">
          {t.title}
        </h2>
        <p className="text-zinc-500 dark:text-slate-400 mb-8">
          {t.description}
        </p>
        <Link
          href={`/${currentLocale}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-myorange-100 text-white font-semibold shadow hover:bg-[#FF7F50] dark:hover:bg-myorange-100/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
