'use client';

import NavLink from './NavLink';

export default function Hero() {
  return (
    <section className="hero-wrapper" id="hero-wrapper">
      <div className="custom-screen pt-28 text-white h-screen flex items-center justify-center">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-white font-extrabold mx-auto sm:text-6xl">
            Transformez Vos Idées En Expériences{' '}
            <span className="text-myorange-100">Exceptionnelles</span> !
          </h1>
          <p className="max-w-xl mx-auto">
            J&apos;accompagne les entreprises dans la création,
            l&apos;optimisation et la maintenance de leurs sites web et
            applications
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/nous-contacter"
              className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 "
            >
              Demander un devis
            </NavLink>
          </div>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 pt-10"></div>
        </div>
      </div>
    </section>
  );
}
