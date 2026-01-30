import { getDictionary } from '@/locales/dictionaries';
import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import EstimationForm from './EstimationForm';

export default async function EstimationPage() {
  const locale = await getLocaleFromHeaders();
  const dict = await getDictionary(locale);

  return <EstimationForm dict={dict} />;
}
