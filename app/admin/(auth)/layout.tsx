import { AdminDictionaryProvider } from '@/components/admin/AdminDictionaryProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDictionaryProvider>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AdminDictionaryProvider>
  );
}
