import { getCurrentUser } from '@/lib/auth-utils';
import UserMenu from '@/components/admin/UserMenu';

export default async function AdminTopbar() {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </div>
  );
}
