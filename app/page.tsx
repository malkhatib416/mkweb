import CTA from '@/components/CTA';
import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import ServiceShowCase from '@/components/ServiceShowCase';

export default function Home() {
  return (
    <>
      <Hero />
      <GradientWrapper />
      <ServiceShowCase />
      <GradientWrapper />
      <CTA />
    </>
  );
}
