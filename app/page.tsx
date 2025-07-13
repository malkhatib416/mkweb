import CTA from '@/components/CTA';
import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import ServiceShowCase from '@/components/ServiceShowCase';
import About from '@/components/About';
import LatestProjects from '@/components/LatestProjects';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <GradientWrapper />
      <ServiceShowCase />
      <LatestProjects />
      <GradientWrapper />
      <CTA />
    </>
  );
}
