import { AdminDictionaryProvider } from '@/components/admin/AdminDictionaryProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { requireAuth } from '@/lib/auth-utils';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <AdminDictionaryProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
            <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
            <div className="flex flex-1 items-center justify-end">
              <AdminTopbar />
            </div>
          </header>
          <main className="flex-1 overflow-auto py-8">
            <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AdminDictionaryProvider>
  );
}
