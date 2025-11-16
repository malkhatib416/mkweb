import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import ServiceShowCase from '@/components/ServiceShowCase';
import About from '@/components/About';
import LatestProjects from '@/components/LatestProjects';
import FAQ from '@/components/FAQ';
import ContactSection from '@/components/ContactSection';
import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Hero dict={dict} locale={locale as Locale} />
      <About dict={dict} />
      <GradientWrapper />
      <ServiceShowCase dict={dict} />
      <GradientWrapper />
      <LatestProjects dict={dict} locale={locale as Locale} />
      {dict.faq ? <FAQ faq={dict.faq} /> : null}
      <ContactSection dict={dict} />
    </>
  );
}
