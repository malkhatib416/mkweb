import CTA from '@/components/CTA';
import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import ServiceShowCase from '@/components/ServiceShowCase';
import About from '@/components/About';
export default function Home() {
  return (
    <>
      <Hero />
      <GradientWrapper />
      <About />
      <GradientWrapper />
      <ServiceShowCase />
      <GradientWrapper />
      <CTA />
    </>
  );
}
