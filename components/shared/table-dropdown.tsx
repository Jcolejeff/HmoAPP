import { ChevronDown, EllipsisVertical } from 'lucide-react';
import React from 'react';

import { useRouter } from 'next/navigation';

import { useUserContext } from '@/domains/user/contexts/user-context';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dropdown } from '../ui/dropdown-menu';
import { Text } from '../ui/text';

// should infer current user avatar from a useCurrentUserContext()
const TableDropdownMenu = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content className="mt-2 w-[20rem] border bg-white px-0  py-0 shadow-lg transition-all duration-300 ease-linear">
        {children}
      </Dropdown.Content>
    </Dropdown>
  );
};

export default TableDropdownMenu;
