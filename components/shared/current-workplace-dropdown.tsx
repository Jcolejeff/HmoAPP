import { ChevronDown } from 'lucide-react';
import React from 'react';

import { useRouter } from 'next/navigation';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { AvatarRoot, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dropdown } from '../ui/dropdown-menu';
import { Text } from '../ui/text';

// should infer current user avatar from a useCurrentUserContext()
const CurrentWorkplaceDropdown = ({ children }: { children?: React.ReactNode }) => {
  //const { user } = useUserContext();
  // remove before push
  const user = {
    first_name: ['jeff'],
    last_name: ['ikwuh'],
    email: 'ikwuhjeffery@gmail.com',
  };
  const router = useRouter();
  // const { currentWorkspace, workspaces, switchWorkspace } = useWorkspaceContext();
  // const { data: workspasceUsers } = useWorkspaceUsers(activeWorkspace?.id!);
  // remove before push
  const currentWorkspace = {
    name: 'Workspace',
  };
  const workspaces = [
    {
      name: 'Workspace one',
    },
    {
      name: 'Workspace two',
    },
    {
      name: 'Workspace three',
    },
  ];

  return (
    <Dropdown>
      <Dropdown.Trigger>
        {children ?? (
          //   <WorkspaceSelectorDropdownButton currentWorkspace={currentWorkspace} buttonClassName={buttonClassName} />4
          <div className="flex items-center gap-3">
            <AvatarRoot className="rounded-md">
              <>
                <AvatarImage
                  className="h-full w-full rounded-md object-cover"
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                  alt="Colm Tuite"
                />

                <AvatarFallback>
                  {user?.first_name[0]}
                  {user?.last_name[0]}
                </AvatarFallback>
              </>
            </AvatarRoot>
            <div className="flex items-center gap-4 rounded px-3 font-semibold">
              <Text>{currentWorkspace?.name}</Text>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content className="mt-2 w-[15rem] border bg-white px-0  py-0 shadow-lg transition-all duration-300 ease-linear">
        <Dropdown.Item
          key={crypto.randomUUID()}
          className=" flex cursor-pointer items-center gap-[0.75rem] px-[1.25rem] py-[0.75rem] pt-6 text-[0.9rem] leading-[1.3rem] tracking-[0.01rem] hover:!bg-primary-1"
        >
          <Text className="mb-3 whitespace-nowrap  font-semibold" size={'sm'}>
            {user?.email ?? 'Dorcas'}
            <Text size={'xs'} variant={'secondary'}>
              Organization admin
            </Text>
          </Text>
        </Dropdown.Item>

        <hr />

        <Dropdown.Item
          key={crypto.randomUUID()}
          className=" flex cursor-pointer items-center gap-[0.75rem] px-[1.25rem] py-[0.45rem] text-[0.9rem] leading-[1.3rem] tracking-[0.01rem] hover:!bg-primary-1"
        >
          <Text className="my-3 whitespace-nowrap " size={'sm'}>
            Pause Notifications
          </Text>
        </Dropdown.Item>
        <Dropdown.Item
          key={crypto.randomUUID()}
          className=" flex cursor-pointer items-center gap-[0.75rem] px-[1.25rem] py-[0.45rem] text-[0.9rem] leading-[1.3rem] tracking-[0.01rem] hover:!bg-primary-1"
        >
          <Text className="my-3 whitespace-nowrap " size={'sm'}>
            Edit Profile
          </Text>
        </Dropdown.Item>
        <Dropdown.Item
          key={crypto.randomUUID()}
          className=" flex cursor-pointer items-center gap-[0.75rem] px-[1.25rem] py-[0.45rem] text-[0.9rem] leading-[1.3rem] tracking-[0.01rem] hover:!bg-primary-1"
        >
          <Text className="my-3 whitespace-nowrap " size={'sm'}>
            Manage Preferences
          </Text>
        </Dropdown.Item>

        <hr />
        <Dropdown.Item
          key={crypto.randomUUID()}
          className=" flex cursor-pointer items-center gap-[0.75rem] py-[0.75rem] text-[0.9rem] leading-[1.3rem] tracking-[0.01rem] hover:!bg-primary-1"
        >
          <Button
            variant={'link'}
            onClick={() => router.push('/auth/signin')}
            className=" whitespace-nowrap text-red-500 "
            size={'sm'}
          >
            Log out
          </Button>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default CurrentWorkplaceDropdown;
