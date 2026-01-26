import { getDictionary } from '@/locales/dictionaries';
import { defaultLocale } from '@/locales/i18n';
import SignupForm from '@/components/admin/SignupForm';

export default async function SignupPage() {
  const dict = await getDictionary(defaultLocale);

  return <SignupForm dict={dict} />;
}
