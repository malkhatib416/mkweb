import BlogPage from './_components/blog-page';
import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Blog({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <BlogPage dict={dict} locale={locale as Locale} />;
}
