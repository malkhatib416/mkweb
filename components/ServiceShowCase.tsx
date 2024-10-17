import { Card } from '@/components/ui/card';
import {
  Code,
  ShoppingCart,
  RefreshCw,
  Cog,
  Cloud,
  Lightbulb,
} from 'lucide-react';

export default function ServiceShowCase() {
  const services = [
    {
      icon: <Code className="w-6 h-6 text-myorange-100" />,
      title: 'Création de site internet',
      description:
        'Notre agence de création de site web est spécialisée dans le développement de sites corporate sous WordPress.',
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-myorange-100" />,
      title: 'Création de site e-commerce',
      description:
        'Notre agence web est spécialisée dans la création de site e-commerce avec PrestaShop et Shopify.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-myorange-100" />,
      title: 'Refonte de site internet',
      description:
        'Donnez un nouveau souffle à votre site internet pour de meilleures performances et une expérience utilisateur optimale.',
    },
    {
      icon: <Cog className="w-6 h-6 text-myorange-100" />,
      title: 'Maintenance de site internet',
      description:
        'Assistance professionnelle 24h/24 pour surveiller, mettre à jour et maintenir votre site web',
    },
    {
      icon: <Cloud className="w-6 h-6 text-myorange-100" />,
      title: 'Hébergement web',
      description:
        "Solutions d'hébergement fiables et sécurisées pour assurer la disponibilité constante de votre site",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-myorange-100" />,
      title: 'Recherche et Innovation',
      description:
        'Exploitez les nouvelles technologies émergentes afin de redéfinir les standards et bénéficiez de solutions innovantes.',
    },
  ];

  return (
    <section
      className="custom-screen flex flex-col lg:flex-row items-start justify-between text-gray-600"
      id="services"
    >
      <div className="mb-8 pr-8 w-full md:w-3/4">
        <h2 className="text-4xl font-bold mb-4 text-myorange-200">
          Nos services
        </h2>
        <p className="mb-6 ">
          Que votre objectif soit de créer un site innovant, de lancer une
          boutique en ligne, d&apos;améliorer votre marketing digital ou votre
          SEO, nous sommes à vos côtés. Nous vous proposons des solutions
          efficaces et pérennes qui répondent à vos besoins.
        </p>
        <p className="mb-6 ">
          De plus, nous gérons vos projets de refonte, nous nous chargeons de la
          maintenance et de l&apos;hébergement de vos sites et élaborons des
          stratégies SEO efficaces pour renforcer votre présence en ligne.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="   p-6">
            <div className="mb-4">{service.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-sm ">{service.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
