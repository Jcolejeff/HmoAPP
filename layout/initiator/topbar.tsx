'use client';

import { Bell, BellDotIcon, LucidePlus, Search } from 'lucide-react';
import React, { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';

import { $http } from '@/lib/http';
import { url } from '@/lib/utils';
import { capitalizeFirstLetter, capitalizeWordsInSentence, getInitialsFromSentence } from '@/lib/utils/string';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const Topbar = () => {
  const { user } = useUserContext();
  const { currentWorkspace } = useWorkspaceContext();
  const [searchInput, setSearchInput] = useState('');

  const ProfilePicDropDown = () => {
    const { user } = useUserContext();
    const name = `${user?.first_name || ' '} ${user?.last_name || ' '}`;
    const router = useRouter();

    return (
      <Dropdown>
        <Dropdown.Trigger>
          <div className="flex gap-2 rounded-full bg-secondary-7 px-3 py-2">
            <Text className="text-1xl">{getInitialsFromSentence(name)}</Text>
          </div>
        </Dropdown.Trigger>

        <Dropdown.Content className="mt-4 w-[16rem] bg-white p-2 shadow-md ">
          <Dropdown.Group>
            <Dropdown.Item>
              <div className="flex flex-col">
                <Text size="md" weight={'medium'} className="capitalize">
                  {name}
                </Text>
                <Text size="xs" weight={'medium'} className="capitalize" variant={'secondary'}>
                  {currentWorkspace?.name}
                </Text>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => router.push('/dashboard/settings/users')}>
              <div className="flex flex-col">
                <Text size="md" weight={'medium'} className="capitalize">
                  Settings
                </Text>
              </div>
            </Dropdown.Item>
            <Dropdown.Separator className="mx-2  bg-gray-200" />
            <Dropdown.Item onClick={() => router.push('/auth/signin')}>
              <Text size="md" className="text-text-danger">
                Sign out
              </Text>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <section className="flex items-center justify-between  px-8">
      <div className="flex  items-center justify-between gap-6 ">
        <Image src={url('/images/logo.png')} alt="Approval Manager Portal" width={50} height={50} />
        <Text className="whitespace-nowrap font-bold">
          {capitalizeWordsInSentence(currentWorkspace?.name!)} HMO Portal
        </Text>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-full w-full items-center rounded-lg border px-4 py-1  ">
          <Search className="h-full w-4" color="#B1B0B9" />
          <div className="flex-grow">
            <Input
              className="border-0 text-xs shadow-none focus-within:border-0 focus-within:shadow-none focus-within:ring-0 focus:border-0 focus:shadow-none focus:!ring-0 focus-visible:border-0 focus-visible:shadow-none focus-visible:ring-0"
              placeholder="Search for past & present requests"
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <Button variant={'ghost'} className="relative flex gap-2 rounded-full border px-3 py-2">
          <div className="absolute right-3 top-2 h-3 w-3 rounded-full border-2 border-white bg-red-400"></div>
          <Bell className="w-5" />
        </Button>
        <ProfilePicDropDown />
      </div>
    </section>
  );
};

export default Topbar;
