import { getCurrentUser } from '@/lib/auth-utils';
import UserMenu from '@/components/admin/UserMenu';

export default async function AdminTopbar() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 items-center justify-end gap-2">
      {user && <UserMenu user={user} />}
    </div>
  );
}
