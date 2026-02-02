import About from '@/components/About';
import ContactSection from '@/components/ContactSection';
import FAQ from '@/components/FAQ';
import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import LatestProjects from '@/components/LatestProjects';
import ServiceShowCase from '@/components/ServiceShowCase';
import Testimonials from '@/components/Testimonials';
import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { getSubmittedReviews } from '@/lib/services/project-review.service.server';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

export default async function Home() {
  const locale = (await getLocaleFromHeaders()) as Locale;
  const dict = await getDictionary(locale);
  let dbProjects: Awaited<
    ReturnType<typeof projectServiceServer.getPublished>
  > = [];
  let reviews: Awaited<ReturnType<typeof getSubmittedReviews>> = [];
  try {
    [dbProjects, reviews] = await Promise.all([
      projectServiceServer.getPublished(locale),
      getSubmittedReviews(6),
    ]);
  } catch (e) {
    // DB unreachable (e.g. connection terminated, wrong host when accessing from another device)
    console.error('Home: failed to load projects/reviews', e);
  }
  const reviewItems = reviews.map((r) => ({
    name: r.clientName ?? 'Client',
    title: r.projectTitle ?? '',
    quote: r.reviewText ?? '',
    rating: r.rating ?? undefined,
    avatar: r.clientPhoto ?? undefined,
  }));

  return (
    <>
      <Hero dict={dict} locale={locale} />
      <About dict={dict} />
      <GradientWrapper />
      <ServiceShowCase dict={dict} />
      <GradientWrapper />
      <LatestProjects dict={dict} locale={locale} dbProjects={dbProjects} />
      {reviewItems.length > 0 && (
        <Testimonials dict={dict} items={reviewItems} />
      )}
      {dict.faq ? <FAQ faq={dict.faq} /> : null}
      <ContactSection dict={dict} />
    </>
  );
}
