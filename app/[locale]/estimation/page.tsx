import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import EstimationForm from './EstimationForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EstimationPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <EstimationForm dict={dict} />;
}
