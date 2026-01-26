import { requireAuth } from '@/lib/auth-utils';
import { getDictionary } from '@/locales/dictionaries';
import { defaultLocale } from '@/locales/i18n';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { AdminDictionaryProvider } from '@/components/admin/AdminDictionaryProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  // Admin uses default locale (can be made locale-aware later)
  const dict = await getDictionary(defaultLocale);

  return (
    <AdminDictionaryProvider dict={dict}>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminTopbar />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminDictionaryProvider>
  );
}
