import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { formatDate } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPinIcon, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import Image from 'next/image';

import { Show } from '@/components/shared/show-conditionally';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
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
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';
import { Textarea } from '@/components/ui/textarea';

import processError from '@/lib/error';
import { calculateDaysBetweenDates, url } from '@/lib/utils';

import { TabsNames } from '@/domains/dashboard/type/initiator';
import { CreateRequest, useCreateRequest } from '@/domains/requests/hooks/use-create-request';
import { useUpdateRequest } from '@/domains/requests/hooks/use-update-request';

import { useCreateRequestContext } from '../../../context/initiator/create-request-context';

interface Iprops {
  switchTab: (tab: TabsNames) => void;
  handleComplete: (tab: TabsNames) => void;
  data: TabsNames[];
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setCompleted?: React.Dispatch<React.SetStateAction<string[]>>;
}

const AdditionalNotesTab = ({ switchTab, data: tabData, handleComplete, setModalOpen, setCompleted }: Iprops) => {
  const {
    open,
    onOpenChange,
    createMore,
    setCreateMore,
    setActiveTab,
    createRequestData,
    setCreateRequestData,
    isEditMode,
  } = useCreateRequestContext();
  const [textValue, setTextValue] = React.useState<string>(createRequestData.purpose || '');
  const { mutate: updateRequest, isPending: isUpdateRequestPending } = useUpdateRequest();
  const { mutate, isPending: isCreateRequestPending, isSuccess, isError } = useCreateRequest();
  const [showTransportInput, setShowTransportInput] = React.useState(false);
  const [showMealInput, setShowMealInput] = React.useState(false);
  const [transportValue, setTransportValue] = React.useState(createRequestData.transport || '');
  const [mealValue, setMealValue] = React.useState(createRequestData.meal || '');

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
    setActiveTab('travel-details');
  };

  const onSubmit = async (values: CreateRequest) => {
    try {
      if (isEditMode) {
        delete values.status;
        // for updating a request
        updateRequest(
          {
            ...values,
            transport: transportValue,
            meal: mealValue,
          },
          {
            onSuccess: () => {
              toast(`Request For ${values.hotel} updated successfully`);
              setCreateRequestData({} as CreateRequest);
              setCreateMore(false);
              onCloseForm(false);
            },
            onError: error => {
              console.log({ error });
              if (error instanceof AxiosError) processError(error);
            },
          },
        );
      } else {
        // for creating a request
        mutate(
          {
            ...values,
            other_requests: textValue,
            transport: transportValue,
            meal: mealValue,
          },
          {
            onSuccess: () => {
              toast(`Request For ${values.hotel} created successfully`);
              setCreateRequestData({} as CreateRequest);
              setCreateMore(false);
              onCloseForm(false);
            },
            onError: error => {
              console.log({ error });
              if (error instanceof AxiosError) processError(error);
            },
          },
        );
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) processError(error);
    }
  };

  const studentDetails = [
    {
      name: 'Faculty',
      value: `${createRequestData.hotel}`,
    },
    {
      name: 'Department',

      value: createRequestData.state,
    },
    {
      name: 'Mat Num.',

      value: createRequestData.city,
    },
    {
      name: 'Issue Start date',

      value: createRequestData.start && formatDate(createRequestData.start, 'dd MMMM, yyyy'),
    },
    {
      name: 'Level',
      value: createRequestData.rate,
    },
    {
      name: 'Phone',
      value: createRequestData.room,
    },
  ];

  return (
    <TabsContent value="additional-notes" className="w h-full">
      <Show>
        <Show.When isTrue={isSuccess}>
          <AnimatePresence>
            <motion.div
              initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
              animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
              exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
              className="flex flex-col items-center "
            >
              <Image
                src={url('/images/dashboard/success.png')}
                className="h-[8rem] w-[8rem] object-contain"
                alt="success"
                width={200}
                height={200}
              />
              <Text weight={'semibold'} size={'default'} className="text-black">
                Your request has been sent!
              </Text>

              <div className=" mt-6 flex w-full justify-end border-t pt-3">
                <Button
                  disabled={isCreateRequestPending}
                  onClick={() => {
                    onCloseForm(false);
                  }}
                  type="button"
                  className="shadow-9 group  flex w-max items-center justify-center gap-2 rounded-[6px] border px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-2"
                >
                  <Text className="tracking-[0.4px whitespace-nowrap text-xs font-[500] leading-[24px] text-white">
                    {`Close`}
                  </Text>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Show.When>
        <Show.Else>
          <>
            <div className="additional-notes-height  space-y-4 overflow-scroll rounded-lg bg-primary-4 px-4 py-4  md:px-4">
              <article>
                <div className=" rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                  <Text size={'xs'} className="mb-1 w-full border-b py-4 font-semibold uppercase">
                    Student details
                  </Text>
                  <Table>
                    <TableBody>
                      {studentDetails.map(item => (
                        <TableRow key={item.name} className="border-none ">
                          <TableCell className="flex  gap-1 p-0  py-2">
                            <MapPinIcon className="h-4 w-4 text-text-dim" />

                            <Text size={'xs'} className="text-text-dim">
                              {item.name}
                            </Text>
                          </TableCell>
                          <TableCell className="p-0  text-end">
                            <Text size={'xs'} className="text-text-dim">
                              {item.value}
                            </Text>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className=" rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                  <Text size={'xs'} className="mb-1 w-full  py-4 font-semibold uppercase">
                    Issue description
                  </Text>

                  <Text
                    size={'xs'}
                    className="text-text-dim"
                    dangerouslySetInnerHTML={{
                      __html: createRequestData.purpose ?? 'N/A',
                    }}
                  />
                </div>
              </article>
            </div>

            <div className="flex justify-between gap-4  py-4">
              <Button
                disabled={isCreateRequestPending || isUpdateRequestPending}
                onClick={() => {
                  switchTab(tabData[1]);
                }}
                type="button"
                className="shadow-9 group  flex w-max items-center justify-center gap-2 rounded-[6px] border bg-white px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-2"
              >
                <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
                  {`Previous`}
                </Text>
              </Button>
              <div className="flex gap-4">
                <Button
                  disabled={isCreateRequestPending || isUpdateRequestPending}
                  onClick={() => {
                    onCloseForm(false);
                  }}
                  type="button"
                  className="shadow-9 group  flex w-max items-center justify-center gap-2 rounded-[6px] border bg-white px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-2"
                >
                  <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
                    {`Cancel`}
                  </Text>
                </Button>
                <Button
                  onClick={() => {
                    handleComplete(tabData[2]);
                    onSubmit(createRequestData);
                  }}
                  disabled={isCreateRequestPending || isUpdateRequestPending}
                  type="button"
                  className="px-6 text-xs"
                >
                  {isCreateRequestPending || isUpdateRequestPending ? <Spinner /> : 'Complete'}
                </Button>
              </div>
            </div>
          </>
        </Show.Else>
      </Show>
    </TabsContent>
  );
};

export default AdditionalNotesTab;
