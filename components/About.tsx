import Image from 'next/image';

const About = () => {
  return (
    <section className="pt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <Image
              src="/geek.svg"
              alt="Votre expert web à Chartres"
              width={300}
              height={300}
              className="rounded-full"
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <p className="mb-4 text-lg font-semibold">
              J'aide les entreprises à transformer leurs idées en solutions web
              performantes et sur-mesure.
            </p>
            <p className="mb-4">
              Basé à <strong className="font-bold">Chartres</strong>,
              j'interviens sur la{' '}
              <strong className="font-bold">création</strong>, l'
              <strong className="font-bold">optimisation</strong> et la{' '}
              <strong className="font-bold">maintenance</strong> de sites web et
              d'applications, avec une approche centrée sur l\'utilisateur et la
              performance.
            </p>
            <p className="mb-4">
              Mon objectif : vous offrir des{' '}
              <strong className="font-bold">solutions digitales uniques</strong>
              , parfaitement adaptées à vos besoins et à vos ambitions, pour
              booster votre présence en ligne et faciliter la gestion de vos
              projets.
            </p>
            <p>
              De l'intégration de{' '}
              <strong className="font-bold">fonctionnalités innovantes</strong>{' '}
              à la{' '}
              <strong className="font-bold">
                conception d'expériences utilisateurs fluides
              </strong>
              , je mets mon expertise et ma rigueur au service de votre
              réussite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
