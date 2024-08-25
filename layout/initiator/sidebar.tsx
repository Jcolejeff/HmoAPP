import {
  GitPullRequestCreate,
  LayoutDashboardIcon,
  Minus,
  PlusIcon,
  StarIcon,
  Timer,
  Home,
  Settings,
  MailOpen,
  UserIcon,
  Hotel,
  BarChart3Icon,
  CircleArrowDown,
} from 'lucide-react';
import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils/css';

import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const SIDEBAR_ITEMS = [
  {
    text: 'Dashboard',
    icon: <Home className="text-inherit transition-all duration-200 ease-linear" />,
    href: '/dashboard',
  },

  {
    text: 'Manage department',
    icon: <UserIcon className="text-inherit transition-all duration-200 ease-linear" />,
    href: '/dashboard/departments',
  },

  {
    text: 'Manage Users',
    icon: <CircleArrowDown className="text-inherit transition-all duration-200 ease-linear" />,
    href: '/dashboard/settings/users',
  },
];

export type SidebarItem = (typeof SIDEBAR_ITEMS)[0];

export const SidebarItem = ({ item }: { item: SidebarItem }) => {
  const pathname = usePathname();
  return (
    <Link
      href={item.href}
      className={cn(
        'hover:text-primary-9 cursor group flex items-center justify-start gap-3 whitespace-nowrap rounded-md  px-8 py-3 transition-all duration-300 ease-in-out',
        pathname === item.href ? 'bg-primary-1 font-semibold text-white' : '!hover:shadow-lg  ',
      )}
    >
      {item.icon}
      <Text
        size={'xs'}
        weight={pathname === item.href ? 'semibold' : 'normal'}
        className="text-inherit transition-all duration-200  ease-linear"
      >
        {item.text}
      </Text>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className=" px-2">
        {SIDEBAR_ITEMS.map(item => {
          return <SidebarItem key={crypto.randomUUID()} item={item} />;
        })}
      </div>
    </section>
  );
};

export default Sidebar;