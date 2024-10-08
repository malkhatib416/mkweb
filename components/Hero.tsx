'use client';

import Image from 'next/image';
import NavLink from './NavLink';

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28 text-gray-600 h-[85vh] flex items-center justify-center">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
            Transformez Vos Idées En Expériences Exceptionnelles !
          </h1>
          <p className="max-w-xl mx-auto">
            J&apos;accompagne les entreprises dans la création,
            l&apos;optimisation et la maintenance de leurs sites web et
            applications
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/nous-contacter "
              className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 "
            >
              Nous contacter
            </NavLink>
            {/* <NavLink
              target="_blank"
              href="https://github.com/Nutlope/qrGPT"
              className="text-gray-700 border hover:bg-gray-50"
              scroll={false}
            >
              Learn more
            </NavLink> */}
          </div>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 pt-10">
            {/* {heroImages.map((image, idx) => ( */}
            {/* <Image
                key={idx}
                alt="image"
                src={image}
                width={500}
                height={500}
                className="rounded-lg"
              /> */}
            {/* ))} */}
          </div>
        </div>
      </div>
    </section>
  );
}
