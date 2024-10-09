import Image from 'next/image';

const About = () => {
  return (
    <section className="pb-16 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <Image
              src="/geek.svg"
              alt="Your Name"
              width={300}
              height={300}
              className="rounded-full"
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <p className="mb-4">
              Freelance basé à <strong className="font-bold">Chartres</strong>,
              j'accompagne les entreprises dans la{' '}
              <strong className="font-bold">création</strong>, l'
              <strong className="font-bold">optimisation</strong> et la{' '}
              <strong className="font-bold">maintenance</strong> de leurs sites
              web et applications.
            </p>
            <p className="mb-4">
              Mon objectif est de fournir des{' '}
              <strong className="font-bold">solutions sur mesure</strong> qui
              répondent parfaitement à vos{' '}
              <strong className="font-bold">besoins spécifiques</strong>.
            </p>
            <p>
              Que ce soit pour l'intégration de{' '}
              <strong className="font-bold">nouvelles fonctionnalités</strong>{' '}
              ou la{' '}
              <strong className="font-bold">
                conception d'expériences utilisateurs fluides
              </strong>
              , je m'assure d'offrir des{' '}
              <strong className="font-bold">performances optimales</strong> et
              une <strong className="font-bold">gestion efficace</strong> de vos
              projets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
