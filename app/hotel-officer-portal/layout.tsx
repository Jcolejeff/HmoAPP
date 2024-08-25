'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

import { WorkspaceSelectorDropdown } from '@/components/shared/workspace-selector-dropdown';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';

import ManagerRequestProvider from '@/domains/dashboard/context/manager/manager-requests-provider';
import { useUserContext } from '@/domains/user/contexts/user-context';
import WorkspaceProvider from '@/domains/workspace/contexts/workspace-context';
import Sidebar from '@/layout/manager/sidebar';
import Topbar from '@/layout/manager/topbar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WorkspaceProvider>
      <ManagerRequestProvider>{children}</ManagerRequestProvider>
    </WorkspaceProvider>
  );
};

const ProfilePicDropDown = () => {
  const { user } = useUserContext();
  const name = `${user?.first_name || ' '} ${user?.first_name || ' '}`;
  const router = useRouter();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div className="flex cursor-pointer items-center justify-center rounded-full bg-neutral-500 px-1 py-1 hover:bg-neutral-400">
          <Avatar className="text-[11px]" image={undefined} name={name} />
        </div>
      </Dropdown.Trigger>

      <Dropdown.Content className="bg-neutral-300">
        <Dropdown.Group>
          <Dropdown.Item onClick={() => router.push('/settings/users')}>
            <Text size="xs">Settings</Text>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item onClick={() => router.push('/auth/signin')}>
            <Text size="xs">Log out</Text>
          </Dropdown.Item>{' '}
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, currentWorkspaceRole } = useUserContext();

  const router = useRouter();

  // useEffect(() => {
  //   if ((!user && !isUserLoading) || currentWorkspaceRole !== 'Manager') {
  //     if (currentWorkspaceRole !== 'Manager') {
  //       toast.error('You do not have permission to access that page');
  //       router.push('/workspace');
  //       return;
  //     }

  //     router.push('/auth/signin');
  //   }
  // }, [user, isUserLoading, router, currentWorkspaceRole]);

  if (true) {
    // if (!isUserLoading && user && currentWorkspaceRole === 'Manager') {
    return (
      <Providers>
        <section className=" ">
          {/* <aside className="bg-green grid  h-[100vh] w-full grid-cols-[1fr_3fr] flex-col  border-r border-r-gray-100">
            <div className="flex flex-col gap-4 py-8 ">
              <div className="-mt-2 flex gap-2 px-4">
                <WorkspaceSelectorDropdown buttonClassName="grow" onWorkspaceSelect={() => null} />

                <ProfilePicDropDown />
              </div>

              <div className="border-b border-b-gray-100 px-8 pb-[0.39rem]"></div>

              <Sidebar />
            </div>
          </aside> */}

          <div className="  ">
            <div className=" py-[1.64rem] shadow-md">
              <Topbar />
            </div>
            <section className="h-full w-full  bg-primary-3 p-8">{children}</section>
          </div>
        </section>
      </Providers>
    );
  }

  return <></>;
}
