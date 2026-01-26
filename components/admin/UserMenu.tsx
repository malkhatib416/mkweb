'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminDictionary } from './AdminDictionaryProvider';

interface UserMenuProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const dict = useAdminDictionary();
  const t = dict.admin.auth;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t.signOutSuccess);
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error(t.signOutError);
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-myorange-100 text-white">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.logOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
