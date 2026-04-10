import ServicePageTemplate from '@/components/ServicePageTemplate';
import {
  getAllServiceSlugs,
  getServicePageBySlug,
} from '@/locales/service-pages';
import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import type { Locale } from '@/locales/i18n';
import { APP_URL } from '@/utils/consts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceSlugs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocaleFromHeaders()) as Locale;
  const page = getServicePageBySlug(locale, slug);

  if (!page) {
    return {};
  }

  const canonical = `${APP_URL}/${locale}/services/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = (await getLocaleFromHeaders()) as Locale;
  const page = getServicePageBySlug(locale, slug);

  if (!page) {
    notFound();
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...page.faqMain, ...page.faqAdvanced].map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ServicePageTemplate content={page} locale={locale} />
    </>
  );
}