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
              Je génère des leads qualifiés pour les PME de Chartres et
              d'Eure-et-Loir grâce à des sites web ultra-performants.
            </p>
            <p className="mb-4">
              Basé à <strong className="font-bold">Chartres</strong>, je crée
              des sites qui <strong className="font-bold">convertissent</strong>{' '}
              : +35% de taux de remplissage de formulaires, temps de chargement
              &lt; 1.2s, et référencement local optimisé.
            </p>
            <p className="mb-4">
              Mes clients gagnent en moyenne{' '}
              <strong className="font-bold">40% de nouveaux clients</strong> en
              6 mois grâce à une présence en ligne professionnelle et des outils
              de gestion automatisés.
            </p>
            <p>
              De la{' '}
              <strong className="font-bold">création de sites vitrines</strong>{' '}
              aux{' '}
              <strong className="font-bold">
                applications métier sur-mesure
              </strong>
              , je vous accompagne avec maintenance 24/7 et support réactif pour
              sécuriser votre croissance digitale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
