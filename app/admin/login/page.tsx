import { getDictionary } from '@/locales/dictionaries';
import { defaultLocale } from '@/locales/i18n';
import LoginForm from '@/components/admin/LoginForm';

export default async function LoginPage() {
  const dict = await getDictionary(defaultLocale);

  return <LoginForm dict={dict} />;
}
