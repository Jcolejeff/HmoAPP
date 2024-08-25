'use client';

import { EyeOff, Link, PlusIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils/css';

import CreateRequestModal from '@/domains/dashboard/components/initiator/create-request-modal';
import TabsWrapper from '@/domains/dashboard/components/initiator/tabs-wrapper';
import RequestSideBar from '@/domains/dashboard/components/request-details/request-details';
import { useCreateRequestContext } from '@/domains/dashboard/context/initiator/create-request-context';
import { useUserContext } from '@/domains/user/contexts/user-context';

const Dashboard = () => {
  const { open, onOpenChange, setOpenHotelSideBar, openHotelSideBar, currentRequest, showRequestDetail } =
    useCreateRequestContext();
  const { user } = useUserContext();

  return (
    <section
      className={cn('relative grid w-full', {
        'grid-cols-1': !showRequestDetail,
        'grid-cols-[4fr_2fr]': showRequestDetail,
        'gap-4': showRequestDetail,
      })}
    >
      <div className="flex  flex-col gap-4">
        <section className=" w-full space-y-4 rounded-md bg-primary-1 bg-[url('/images/dashboard/hero-bg.png')] bg-contain bg-right-bottom bg-no-repeat px-8 py-8 text-white">
          <Text className="text-1xl font-semibold text-white">
            Hello there, {user?.first_name} {user?.last_name} 👋
          </Text>
          <Text className="text-sm font-light text-white ">
            Got an issue that needs to be resolved? Create a new request and we will get back to you as soon as
            possible.
          </Text>
          <Button
            variant={'outline'}
            className="rounded-md bg-white/[0.15] px-4 py-3 text-white shadow-md"
            onClick={() => onOpenChange(true)}
          >
            <Text className="text-sm text-white">Create new request</Text>
            <PlusIcon className="h-4 w-4 " />
          </Button>
        </section>
        <CreateRequestModal isOpen={open} onClose={() => onOpenChange(false)} title="" />

        <TabsWrapper />
      </div>
      {currentRequest && <RequestSideBar />}
    </section>
  );
};

export default Dashboard;
