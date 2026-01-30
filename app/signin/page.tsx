import { AdminDictionaryProvider } from '@/components/admin/AdminDictionaryProvider';
import LoginForm from '@/components/admin/LoginForm';

export default function SigninPage() {
  return (
    <AdminDictionaryProvider>
      <LoginForm />
    </AdminDictionaryProvider>
  );
}
