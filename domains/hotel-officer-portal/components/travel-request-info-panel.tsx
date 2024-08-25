import { formatDate } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, MapPinIcon, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { start } from 'repl';

import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage, AvatarRoot } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

import { fadeIn } from '@/lib/motion';
import { url } from '@/lib/utils';

import { RequestKVDetails } from '@/domains/dashboard/components/request-details/request-details';

import ChatBox from '../../dashboard/components/request-details/chat-box';
import TravelRequestInfoPanelApproval from '../../dashboard/components/travel-request-info-panel-approval';
import { useCreateRequestContext } from '../../dashboard/context/initiator/create-request-context';
import { useManagerRequestContext } from '../../dashboard/context/manager/manager-requests-provider';
import { TravelRequestDetailProps } from '../../dashboard/type/manager';

import TravelRequestInfoPanelNotification from './travel-request-info-panel-notification';

const TravelRequestInfoPanel: React.FC<TravelRequestDetailProps> = ({
  name,
  department,
  location,
  startDate,
  endDate,
  travelPurpose,
  hotel,
  roomType,
  mealBudget,
  transportNeeds,
  status,
  createdDate,
}) => {
  const {
    setIsTravelRequestInfoPanelOpen,
    setSelectedManagerRequest,
    selectedManagerRequest,
    isTravelRequestInfoPanelOpen,
    onOpenChange,
  } = useManagerRequestContext();

  const travelDetails = [
    {
      name: 'Location',
      value: `${selectedManagerRequest?.city}, ${selectedManagerRequest?.state}`,
    },
    {
      name: 'Start date',
      value: selectedManagerRequest?.start && formatDate(selectedManagerRequest?.start, 'dd MMMM, yyyy'),
    },
    {
      name: 'End date',
      value: selectedManagerRequest?.end && formatDate(selectedManagerRequest?.end, 'dd MMMM, yyyy'),
    },

    {
      name: 'Purpose',
      value: selectedManagerRequest?.purpose,
    },
  ];

  const hotelDetails = [
    {
      name: 'Hotel',
      value: selectedManagerRequest?.hotel,
    },
    {
      name: 'Room type',
      value: selectedManagerRequest?.room,
    },
    {
      name: 'Meal',
      value: selectedManagerRequest?.meal,
    },

    {
      name: 'Transport',
      value: selectedManagerRequest?.transport,
    },
  ];

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = -chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [isTravelRequestInfoPanelOpen]);

  if (!isTravelRequestInfoPanelOpen) {
    return null;
  }
  return (
    <AnimatePresence>
      {isTravelRequestInfoPanelOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
          animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
          exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
          className="h-full"
        >
          <div className=" sticky top-[2rem] hidden h-fit flex-col overflow-hidden rounded-lg  border bg-white pb-4 shadow-sm   md:flex">
            <div className="flex justify-between bg-primary-4 px-2 py-4 shadow-sm ">
              <div className="flex items-center gap-2">
                <AvatarRoot className="rounded-full" size="md">
                  <>
                    <AvatarImage
                      className="h-full w-full rounded-md object-cover"
                      src="/images/dashboard/Avatar.png"
                      alt="Colm Tuite"
                    />

                    <AvatarFallback>{name}</AvatarFallback>
                  </>
                </AvatarRoot>
                <div className="space-y-[2px]">
                  <Text size={'sm'} className="font-semibold">
                    Travel Request - {selectedManagerRequest && selectedManagerRequest.requester_id}
                  </Text>

                  <Text size={'xs'} className="text-text-dim">
                    {selectedManagerRequest &&
                      `${selectedManagerRequest.hotel} / ${selectedManagerRequest.city} ${selectedManagerRequest.state}, ${selectedManagerRequest.country}.`}
                  </Text>
                </div>
              </div>

              <Button
                variant={'outline'}
                onClick={() => {
                  // setCurrentRequest(null);
                  setIsTravelRequestInfoPanelOpen(false);
                }}
                className=" hover:bg-gray/10 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground right-4 top-4 w-fit border-none p-4 opacity-70 ring-offset-transparent transition-opacity hover:opacity-100 focus:shadow-none focus:outline-none focus:ring focus:ring-[#777979]/20 focus-visible:ring-1 focus-visible:ring-[#777979]/20 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <section className="h-[66vh] space-y-3 overflow-scroll scroll-smooth px-4" ref={chatContainerRef}>
              <div className=" my-4 flex items-center justify-between gap-1">
                <div className="h-[1px] w-[25%] bg-gray-200" />

                <Text className=" w-fit text-center text-xs text-text-dim">
                  Created: {selectedManagerRequest && selectedManagerRequest.start}{' '}
                </Text>
                <div className="h-[1px] w-[25%] bg-gray-200" />
              </div>
              <Text className="mx-auto w-fit rounded-sm  bg-secondary-5 px-4 py-1 text-xs font-medium text-secondary-4">
                Status : {selectedManagerRequest && selectedManagerRequest.status}
              </Text>

              <div className="space-y-4   rounded-lg bg-primary-4  px-4 py-4 md:px-4">
                <Text as="p" className="mb-4 text-sm font-medium text-black">
                  Travel Request to{' '}
                  {selectedManagerRequest &&
                    `${selectedManagerRequest.city} ${selectedManagerRequest.state}, ${selectedManagerRequest.country}`}{' '}
                  on the {selectedManagerRequest && selectedManagerRequest.start}
                </Text>

                <div className="*: flex w-fit gap-1 rounded-full bg-white p-2 shadow-sm">
                  <Calendar className=" h-4 w-4" />
                  <Text className="text-xs text-black">{'3'} Days</Text>
                </div>

                <article>
                  <div className=" rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                    <Text size={'xs'} className="mb-1 w-full border-b py-4 font-semibold uppercase">
                      Travel details
                    </Text>
                    <RequestKVDetails details={travelDetails} />
                  </div>
                  <div className=" rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                    <Text size={'xs'} className="mb-1 w-full border-b py-4 font-semibold uppercase">
                      Accommodation details
                    </Text>
                    <RequestKVDetails details={hotelDetails} />
                  </div>
                  <div className=" rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                    <Text size={'xs'} className="mb-1 w-full  border-b py-4 font-semibold uppercase">
                      Additional notes
                    </Text>
                    <Text size={'xs'} className=" my-4 text-text-dim">
                      I would like a daily budget meal that covers breakfast and dinner only.
                    </Text>
                  </div>
                </article>
              </div>
              <div className="my-5 flex w-full justify-end px-3">
                <div className="flex gap-x-4">
                  <Button className="rounded-lg border bg-transparent text-black" onClick={() => onOpenChange(true)}>
                    <Text size={'xs'}>Cancel Request</Text>
                  </Button>
                  <Button className="rounded-lg border bg-transparent text-black">
                    <Text size={'xs'}>Edit request</Text>
                  </Button>
                  <Button className="rounded-lg bg-primary-4">
                    <Text size={'xs'} className="">
                      Send Reminder
                    </Text>
                  </Button>
                </div>
              </div>

              <div className="my-5 flex w-full justify-end px-3">{/* <TravelRequestInfoPanelApproval /> */}</div>
              <div className="w-full rounded-md py-4 pe-2">
                {/* Top Notification */}
                <div className="flex items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-2 py-2">
                  <div className="flex items-center">
                    <Image
                      src={url('/images/dashboard/Ellipse 9.png')}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-xs text-gray-800">Charles approved this request.</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-2 text-xs text-gray-500">2 mins ago</p>
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                </div>

                <div className="mt-4 flex w-full justify-end">{/* <TravelRequestInfoPanelApproval /> */}</div>
              </div>
            </section>
            {/* <ChatBox /> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TravelRequestInfoPanel;
