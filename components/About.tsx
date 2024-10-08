import Image from 'next/image';

const About = () => {
  return (
    <section className="py-16">
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
            <p>
              Freelance basé à Chartres, j'accompagne les entreprises dans la
              création, l'optimisation et la maintenance de leurs sites web et
              applications.
            </p>

            <p>
              Mon objectif est de fournir des solutions sur mesure qui répondent
              parfaitement à vos besoins spécifiques.
            </p>

            <p>
              Que ce soit pour l'intégration de nouvelles fonctionnalités ou la
              conception d'expériences utilisateurs fluides, je m'assure
              d'offrir des performances optimales et une gestion efficace de vos
              projets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
