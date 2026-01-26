'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderKanban, LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAdminDictionary } from './AdminDictionaryProvider';

export default function AdminSidebar() {
  const dict = useAdminDictionary();
  const pathname = usePathname();
  const router = useRouter();
  const t = dict.admin;

  const navigation = [
    {
      name: t.sidebar.dashboard,
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    { name: t.sidebar.blogs, href: '/admin/blogs', icon: FileText },
    { name: t.sidebar.projects, href: '/admin/projects', icon: FolderKanban },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t.auth.signOutSuccess);
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error(t.auth.signOutError);
      console.error(error);
    }
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-myorange-100">{t.title}</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname?.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${
                            isActive
                              ? 'bg-myorange-100 text-white'
                              : 'text-gray-700 hover:text-myorange-100 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <button
                onClick={handleSignOut}
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600"
              >
                <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                {t.auth.signOut}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
