import { GitPullRequestCreate, LayoutDashboardIcon, Minus, PlusIcon, StarIcon, Timer } from 'lucide-react';
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
    icon: (
      <LayoutDashboardIcon className="text-inherit transition-all  duration-200 ease-linear group-hover:text-primary" />
    ),
    href: '/dashboard',
  },
];

export type SidebarItem = (typeof SIDEBAR_ITEMS)[0];

export const SidebarItem = ({ item }: { item: SidebarItem }) => {
  const pathname = usePathname();
  return (
    <Link
      href={item.href}
      className={cn(
        'hover:text-primary-9 group flex cursor-default items-center justify-start gap-3 whitespace-nowrap rounded px-8 py-3 transition-all duration-300 ease-in-out',
        pathname === item.href
          ? 'bg-primary-1 font-semibold text-primary-2'
          : '!hover:shadow-lg !hover:text-black hover:!bg-primary-1',
      )}
    >
      {item.icon}
      <Text size={'sm'} weight={pathname === item.href ? 'semibold' : 'medium'} className="text-inherit">
        {item.text}
      </Text>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="">
        {SIDEBAR_ITEMS.map(item => {
          return <SidebarItem key={crypto.randomUUID()} item={item} />;
        })}
      </div>

      <div>
        <section className="my-2 flex w-full  items-center justify-between " style={{ paddingRight: '2rem' }}>
          <div className="flex items-center gap-2">
            <Minus className="text-gray-300" />
            <Text variant={'secondary'} className=" text-sm font-light uppercase">
              Request
            </Text>
          </div>

          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                    <PlusIcon className="h-4 w-4 text-text-dim" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className={cn(
                    'bg-neutral-750 border-neutral-725 flex items-center justify-between rounded-[4px] py-0',
                  )}
                >
                  Add new
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Sidebar;
