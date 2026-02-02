'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { signOut } from '@/lib/auth-client';
import {
  FileText,
  FolderKanban,
  FolderTree,
  Languages,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Mail,
  MessageSquare,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAdminDictionary } from './AdminDictionaryProvider';

const MENU_BUTTON_CLASS =
  'transition-all duration-200 hover:bg-muted/80 active:scale-[0.98]';
const GROUP_LABEL_CLASS =
  'text-[10px] uppercase tracking-wider text-muted-foreground/70';
const ICON_ACTIVE_CLASS = 'h-4 w-4 shrink-0 text-foreground transition-colors';
const ICON_INACTIVE_CLASS =
  'h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground';

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const SIDEBAR_GROUP_KEYS = [
  'groupMain',
  'groupContent',
  'groupPeople',
  'groupSettings',
] as const;

type SidebarGroupKey = (typeof SIDEBAR_GROUP_KEYS)[number];

type NavGroup = {
  labelKey: SidebarGroupKey;
  items: NavItem[];
};

function isPathActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={MENU_BUTTON_CLASS}
      >
        <Link href={item.href}>
          <Icon
            className={isActive ? ICON_ACTIVE_CLASS : ICON_INACTIVE_CLASS}
            aria-hidden
          />
          <span className={isActive ? 'font-medium text-foreground' : ''}>
            {item.name}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarNavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string | null;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={GROUP_LABEL_CLASS}>
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={isPathActive(pathname, item.href)}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default function AdminSidebar() {
  const dict = useAdminDictionary();
  const pathname = usePathname();
  const router = useRouter();
  const t = dict.admin;

  const navGroups: NavGroup[] = [
    {
      labelKey: 'groupMain',
      items: [
        {
          name: t.sidebar.dashboard,
          href: '/admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      labelKey: 'groupContent',
      items: [
        {
          name: t.sidebar.suggestions,
          href: '/admin/suggestions',
          icon: Lightbulb,
        },
        { name: t.sidebar.blogs, href: '/admin/blogs', icon: FileText },
        {
          name: t.sidebar.categories,
          href: '/admin/categories',
          icon: FolderTree,
        },
        {
          name: t.sidebar.projects,
          href: '/admin/projects',
          icon: FolderKanban,
        },
      ],
    },
    {
      labelKey: 'groupPeople',
      items: [
        { name: t.sidebar.clients, href: '/admin/clients', icon: Users },
        {
          name: t.sidebar.reviews,
          href: '/admin/reviews',
          icon: MessageSquare,
        },
      ],
    },
    {
      labelKey: 'groupSettings',
      items: [
        {
          name: t.sidebar.languages,
          href: '/admin/languages',
          icon: Languages,
        },
        { name: t.sidebar.newsletter, href: '/admin/newsletter', icon: Mail },
      ],
    },
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center gap-2 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-myorange-100 text-white shadow-sm">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
          </div>
          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-foreground">
              {t.brandingTitle}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {t.brandingSubtitle}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarNavGroup
            key={group.labelKey}
            label={t.sidebar[group.labelKey]}
            items={group.items}
            pathname={pathname}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="w-full text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span>{t.auth.signOut}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
