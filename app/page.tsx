import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import ServiceShowCase from '@/components/ServiceShowCase';
import ClientTestimonials from '@/components/ClientTestimonials';
import About from '@/components/About';
import LatestProjects from '@/components/LatestProjects';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <GradientWrapper />
      <ServiceShowCase />
      <ClientTestimonials />
      <GradientWrapper />
      <LatestProjects />
      <FAQ />
      <CTA />
    </>
  );
}
