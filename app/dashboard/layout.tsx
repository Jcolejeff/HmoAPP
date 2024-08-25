'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

import { WorkspaceSelectorDropdown } from '@/components/shared/workspace-selector-dropdown';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';

import CreateRequestProvider, {
  useCreateRequestContext,
} from '@/domains/dashboard/context/initiator/create-request-context';
import DepartmentsRequestProvider from '@/domains/departments/context/departments-request-provider';
import HotelContextProvider, { useHotelContext } from '@/domains/hotels/context/hotel-context';
import { useUserContext } from '@/domains/user/contexts/user-context';
import WorkspaceProvider, { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import Sidebar from '@/layout/initiator/sidebar';
import Topbar from '@/layout/initiator/topbar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WorkspaceProvider>
      <CreateRequestProvider>
        <DepartmentsRequestProvider>
          <HotelContextProvider>{children}</HotelContextProvider>
        </DepartmentsRequestProvider>
      </CreateRequestProvider>
    </WorkspaceProvider>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, currentWorkspaceRole } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    if (!user && !isUserLoading) {
      router.push('/auth/signin');
    }
  }, [user, isUserLoading, router, currentWorkspaceRole]);

  console.log({ currentWorkspaceRole });
  if (!isUserLoading && user) {
    return (
      <Providers>
        <section className="grid grid-cols-[0.7fr_4fr] scroll-smooth ">
          <aside className="bg-green sticky  left-0 top-0 grid h-[100vh]  w-full  flex-col border-r border-r-gray-100">
            <div className="flex flex-col gap-4 py-[2.1rem] ">
              <div className="-mt-2 mb-11 flex gap-2 px-2">
                <WorkspaceSelectorDropdown buttonClassName="grow" onWorkspaceSelect={() => null} />
              </div>

              <Sidebar />
            </div>
          </aside>

          <div className="  ">
            <div className=" py-[1.64rem] shadow-md">
              <Topbar />
            </div>
            <section className="h-full w-full bg-primary-3 p-8">{children}</section>
          </div>
        </section>
      </Providers>
    );
  }

  return <></>;
}
