'use client';

import { EyeOff, Link, PlusIcon } from 'lucide-react';
import { T } from 'ramda';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils/css';

import CreateRequestModal from '@/domains/dashboard/components/initiator/create-request-modal';
import TabsWrapper from '@/domains/dashboard/components/initiator/tabs-wrapper';
import RequestSideBar from '@/domains/dashboard/components/request-details/request-details';
import { useCreateRequestContext } from '@/domains/dashboard/context/initiator/create-request-context';
import RequestDetailsExternalPage from '@/domains/external-pages/components/request-details-external-page';
import { useUserContext } from '@/domains/user/contexts/user-context';

const ApproveRequestFromEmail = () => {
  const token = sessionStorage.getItem('token') as string;
  const organizationId = sessionStorage.getItem('organizationId') as string;
  const requestId = sessionStorage.getItem('requestId') as string;
  return (
    <section className="container h-full max-w-xl px-6 py-6">
      <div className="flex  h-full flex-col gap-4">
        <section className=" w-full space-y-4 rounded-md bg-primary-1 bg-[url('/images/dashboard/hero-bg.png')] bg-contain bg-right-bottom bg-no-repeat px-8 py-8 text-white">
          <Text className="text-1xl font-semibold text-white">Hello there, Trave App User</Text>
          <Text className="text-sm font-medium text-white ">
            You have a new travel request that requires your approval
          </Text>
        </section>

        <RequestDetailsExternalPage token={token} organizationId={organizationId} requestId={requestId} />
      </div>
    </section>
  );
};

export default ApproveRequestFromEmail;
