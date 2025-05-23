import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-[#FF7F50] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">
          Page introuvable
        </h2>
        <p className="text-zinc-500 mb-8">
          Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white font-semibold shadow hover:bg-[#FF7F50] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
