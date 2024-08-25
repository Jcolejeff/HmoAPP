import { DialogTitle } from '@radix-ui/react-dialog';
import { AxiosError } from 'axios';
import { formatDate, formatRelative } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, ChevronDown, MapPinIcon, Paperclip, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { start } from 'repl';
import { toast } from 'sonner';

import Link from 'next/link';

import ContentLoader from '@/components/shared/content-loading-screen';
import { Avatar, AvatarFallback, AvatarImage, AvatarRoot } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SelectDropDown from '@/components/ui/select-dropdown';
import Spinner from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

import processError from '@/lib/error';
import { calculateDaysBetweenDates, formatToNaira, url } from '@/lib/utils';
import { cn } from '@/lib/utils/css';
import { getInitialsFromSentence } from '@/lib/utils/string';

import {
  HotelDetail,
  ApproveRequestArgs,
  requestStatus,
  RequestKVDetails,
  ApproveRequestConfirmationDialog,
} from '@/domains/dashboard/components/request-details/request-details';

import { useSingleRequestExternalPage } from '../hooks/use-single-request-external-page';
import { useUpdateRequestExternalPage } from '../hooks/use-update-request-external-page';

interface RequestDetailsExternalPageProps {
  requestId: string;
  organizationId: string;

  token: string;
}

const RequestDetailsExternalPage = ({ requestId, organizationId, token }: RequestDetailsExternalPageProps) => {
  const {
    mutate: updateRequest,
    isPending: isUpdateRequestPending,
    isSuccess: successfullyUpdatedRequest,
  } = useUpdateRequestExternalPage();

  const [openApprovalDialog, setOpenApprovalDialog] = React.useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTheTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = -chatContainerRef.current.scrollHeight;
    }
  };

  const { data, isFetching, isLoading, isError, isSuccess } = useSingleRequestExternalPage({
    organization_id: organizationId,
    id: requestId,
    token,
  });

  const details = data;

  const travelDetails = [
    {
      name: 'Location',
      value: `${details?.city}, ${details?.state}`,
    },
    {
      name: 'Start date',
      value: details?.start && formatDate(details?.start, 'dd MMMM, yyyy'),
    },
    {
      name: 'End date',
      value: details?.end && formatDate(details?.end, 'dd MMMM, yyyy'),
    },

    {
      name: 'Purpose',
      value: details?.purpose,
    },
  ];

  const hotelDetails = [
    {
      name: 'Hotel',
      value: details?.hotel,
    },
    {
      name: 'Room type',
      value: details?.room,
    },
    {
      name: 'Room rice',
      value: `${formatToNaira(details?.rate || 0)}`,
    },
    {
      name: 'Meal',
      value: details?.meal,
    },

    {
      name: 'Transport',
      value: details?.transport,
    },
  ];

  const approveRequest = ({ status, rejectionReason }: ApproveRequestArgs) => {
    if (!requestId) return;

    updateRequest(
      {
        id: requestId,
        status,
        rejection_reason: rejectionReason,
        organization_id: organizationId,
        token,
      },
      {
        onSuccess: data => {
          toast.success('Request Updated Successfully');
          setOpenApprovalDialog(false);
        },
      },
    );
  };

  useEffect(() => {
    scrollToTheTop();
  }, [details]);

  if (successfullyUpdatedRequest) {
    return (
      <div className="flex h-full flex-col items-center  gap-4 py-12">
        <CheckCircle size={60} className="w-24 text-3xl text-green-500" />
        <Text className="text-center text-base font-semibold capitalize">Request Updated Successfully</Text>
        <Link href="/auth/signin" className="block rounded-lg bg-primary-1 p-2 px-6 text-white">
          Continue To Dashboard
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center  gap-4 py-12">
        <Spinner className="text-black" />
        <Text className="text-center text-base font-semibold capitalize">Fetching request details</Text>
      </div>
    );
  }

  if (!isSuccess || !details || isError) {
    return (
      <div className="flex h-full flex-col items-center  gap-4 py-12">
        <Text className="text-center text-base font-semibold capitalize text-red-600">
          An error occurred while fetching request details
        </Text>
        <Text className="text-center text-base font-semibold capitalize ">Go To Your Dashboard To View Request</Text>
        <Link href="/auth/signin" className="block rounded-lg bg-primary-1 p-2 px-6 text-white">
          Login
        </Link>
      </div>
    );
  }
  if (!organizationId || !requestId || !details) {
    return <></>;
  }
  const name = `${details.requester?.first_name || ' '} ${details.requester?.last_name || ' '}`;

  return (
    <ContentLoader isLoading={isLoading}>
      <AnimatePresence>
        <ApproveRequestConfirmationDialog
          open={openApprovalDialog}
          onOpenChange={val => setOpenApprovalDialog(val)}
          onConfirm={approveRequest}
          isUpdateRequestPending={isUpdateRequestPending}
        />

        <motion.div
          initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
          animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
          exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
          className="h-full"
        >
          <div className="  flex h-full flex-col overflow-hidden  rounded-lg border bg-white pb-4   shadow-sm">
            <div className="flex justify-between bg-primary-4 px-2 py-4 shadow-sm ">
              <div className="flex items-center gap-2">
                <div className="flex gap-2 rounded-full bg-secondary-7 px-3 py-2">
                  <Text className="text-base">{getInitialsFromSentence(name)}</Text>
                </div>

                <div className="space-y-[2px]">
                  <Text size={'sm'} className="font-semibold capitalize">
                    {name} - {details.id}
                  </Text>

                  <Text size={'xs'} className="text-text-dim">
                    {details.hotel} / {details.city}, {details.state}
                  </Text>
                </div>
              </div>
            </div>
            <section className="space-y-3 overflow-scroll scroll-smooth px-4" ref={chatContainerRef}>
              {/* SHOW IF REQUEST STATUS IS PENDING */}
              {details.status === 'pending' && (
                <Button
                  variant={'outline'}
                  className="mt-4 w-full rounded-lg bg-lime-600"
                  onClick={() => setOpenApprovalDialog(true)}
                >
                  <Text className="text-white" size={'xs'}>
                    Approve request
                  </Text>
                </Button>
              )}
              <div className=" my-4 flex items-center justify-between gap-1">
                <div className="h-[1px] w-[25%] bg-gray-200" />

                <Text className=" w-fit text-center text-xs text-text-dim">
                  Created: {formatDate(details.date_created!, 'dd MMM, yyyy')}{' '}
                </Text>
                <div className="h-[1px] w-[25%] bg-gray-200" />
              </div>

              <Text
                className={cn('mx-auto w-fit rounded-sm   px-4 py-1 text-xs font-medium capitalize ', {
                  'bg-secondary-5 text-secondary-4': details.status === 'rejected',
                  'bg-green-50 text-green-600': details.status === 'approved',
                  'bg-yellow-100/60 text-yellow-500': details.status === 'pending',
                })}
              >
                Status: {details.status}
              </Text>

              <div className="space-y-4 rounded-lg bg-primary-4  px-4 py-4 md:px-4">
                <Text as="p" className="mb-4 text-sm font-medium text-black">
                  Travel request to {details.city}, {details.state} on the {formatDate(details.start, 'dd MMM, yyyy')}
                </Text>

                <div className="*: flex w-fit gap-1 rounded-full bg-white p-2 shadow-sm">
                  <Calendar className=" h-4 w-4" />
                  <Text className="text-xs text-black">
                    {calculateDaysBetweenDates(details.start, details.end)}{' '}
                    {details.start === details.end ? 'day' : 'days'}
                  </Text>
                </div>

                <article className="space-y-2">
                  <div className="rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                    <Text size={'xs'} className="mb-1 w-full border-b py-4 font-semibold uppercase">
                      Travel details
                    </Text>
                    <RequestKVDetails details={travelDetails} />
                  </div>
                  <div className="rounded-lg border border-b-0 bg-white px-4 pb-2">
                    <Text size={'xs'} className="mb-1 w-full border-b py-4 font-semibold uppercase">
                      Accommodation details
                    </Text>
                    <RequestKVDetails details={hotelDetails} />
                  </div>
                  <div className=" rounded-lg border border-b-0 bg-white px-4 pb-2">
                    <Text size={'xs'} className="mb-1 w-full  border-b py-4 font-semibold uppercase">
                      Additional notes
                    </Text>
                    <Text size={'xs'} className=" my-4 text-text-dim">
                      {details.other_requests}
                    </Text>
                  </div>
                </article>
              </div>

              {/* SHOW IF REQUEST STATUS IS PENDING */}
              {details.status === 'pending' && (
                <Button
                  variant={'outline'}
                  className="mt-4 w-full rounded-lg bg-lime-600"
                  onClick={() => setOpenApprovalDialog(true)}
                >
                  <Text className="text-white" size={'xs'}>
                    Approve request
                  </Text>
                </Button>
              )}
            </section>
          </div>
        </motion.div>
      </AnimatePresence>
    </ContentLoader>
  );
};

export default RequestDetailsExternalPage;
