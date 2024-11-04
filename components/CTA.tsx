import NavLink from './NavLink';

const CTA = () => (
  <SectionWrapper>
    <div className="custom-screen">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-gray-800 text-3xl font-semibold sm:text-4xl"
          id="oss"
        >
          Vous avez un projet <span className="text-myorange-100"> Web ?</span>
          🚀
        </h2>
        <p className="block mt-3 text-gray-600">
          Contactez-nous via notre formulaire de contact. Nous reviendrons vers
          vous
          <span className="block">
            {' '}
            <span className="text-myorange-100 font-bold">
              en moins de 24 heures !
            </span>
          </span>
        </p>
        <div className="mt-8">
          <NavLink
            href="/nous-contacter"
            className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 "
          >
            Nous contacter
          </NavLink>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const SectionWrapper = ({ children, ...props }: any) => (
  <section {...props} className={`pt-8 pb-20 ${props.className || ''}`}>
    {children}
  </section>
);

export default CTA;
