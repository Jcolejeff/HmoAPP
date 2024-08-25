import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

import processError from '@/lib/error';
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll';
import { url } from '@/lib/utils';
import { cn } from '@/lib/utils/css';

import { useGenerateReport } from '../hooks/use-generate-report';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode | string;
  email: string | undefined;
}

type tItems =
  | 'total_requests'
  | 'pending_requests'
  | 'approved_requests'
  | 'top_requesters'
  | 'top_hotels'
  | 'total_spend'
  | 'cancelled_requests'
  | 'total_departments'
  | 'travel_count'
  | 'top_destinations'
  | 'top_travellers'
  | 'all';

const GenerateReportModal: React.FC<ModalProps> = ({ isOpen, onClose, title, email: defaultUserEmail }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setendDate] = useState<Date>();
  const [email, setEmail] = useState<string | undefined>(defaultUserEmail);
  const [success, setSuccess] = useState<boolean>(false);
  const { mutate, status } = useGenerateReport();

  const [checkedItems, setCheckedItems] = useState({
    total_requests: false,
    pending_requests: false,
    approved_requests: false,
    top_requesters: false,
    top_hotels: false,
    total_spend: false,
    cancelled_requests: false,
    total_departments: false,
    travel_count: false,
    top_destinations: false,
    top_travellers: false,
  });

  const onCloseForm = () => {
    setSuccess(false);
    onClose();
  };

  const handleCheckboxChange = (key: keyof typeof checkedItems | tItems) => {
    if (key === 'all') {
      const allChecked = !Object.values(checkedItems).every(Boolean);
      const newCheckedItems: typeof checkedItems = Object.fromEntries(
        Object.keys(checkedItems).map(k => [k, allChecked]),
      ) as typeof checkedItems; // Explicitly typecast the result
      setCheckedItems(newCheckedItems);
    } else {
      setCheckedItems(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const isFormValid = () => {
    const hasSelectedItems = Object.values(checkedItems).some(Boolean);
    return email && startDate && endDate && hasSelectedItems;
  };

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCloseForm}>
      <DialogContent className="min-w-[750px]">
        <div
          className={`relative m-auto flex w-full max-w-[90%] flex-col rounded-lg px-8 pt-4 md:max-w-[500px] lg:max-w-[700px]`}
        >
          <section className="flex flex-col">
            <section className="flex h-full w-full max-w-[1700px] flex-col items-center gap-8 overflow-scroll">
              <div className="h-full w-full">
                <Text size={'md'} className="font-[700]">
                  Generate Report
                </Text>
                <div className="w-100 my-3 h-[0.3px] bg-black bg-gray-200"></div>

                {success ? (
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
                        Your Report has been Generated!
                      </Text>
                      <Text className="mt-2 text-center text-xs leading-5 text-text-dim md:max-w-[30%]">
                        Check your mail! We’ve sent a report to your email!
                      </Text>
                      <div className=" mt-6 flex w-full justify-end border-t pt-3">
                        <Button
                          onClick={onCloseForm}
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
                ) : (
                  <>
                    <div className="mt-4 flex">
                      <div className="border-1 mt-3 flex w-full items-center rounded-lg border border-gray-200 bg-white px-5 py-2">
                        <div className="w-fit">
                          <Text size={'xs'} className="w-full text-nowrap font-bold">
                            {'EMAIL:'}
                          </Text>
                        </div>
                        <div className="ms-3 w-full">
                          <Input
                            type="text"
                            className="border-0"
                            defaultValue={email}
                            onChange={e => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between gap-4">
                        <div className="border-1 mt-3 flex w-full items-center rounded-lg border border-gray-200 bg-white px-5 py-2">
                          <div className="w-fit">
                            <Text size={'xs'} className="w-full text-nowrap font-bold">
                              {'START DATE:'}
                            </Text>
                          </div>
                          <div className="ms-3 w-full border-0 border-none">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full justify-between border-0 p-0 py-2 text-left font-normal',
                                    !startDate && 'text-muted-foreground',
                                  )}
                                >
                                  {startDate ? format(startDate, 'dd-MM-yyyy') : <Text size={'xs'}>dd/mm/yyyy</Text>}
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  initialFocus
                                  className="custom-calendar"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className="border-1 mt-3 flex w-full items-center rounded-lg border border-gray-200 bg-white px-5 py-2">
                          <div className="w-fit">
                            <Text size={'xs'} className="w-full text-nowrap font-bold">
                              {'END DATE:'}
                            </Text>
                          </div>
                          <div className="ms-3 w-full border-0 border-none">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full justify-between border-0 p-0 text-left font-normal',
                                    !endDate && 'text-muted-foreground',
                                  )}
                                >
                                  {endDate ? format(endDate, 'dd-MM-yyyy') : <Text size={'xs'}>dd/mm/yyyy</Text>}
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={endDate}
                                  onSelect={setendDate}
                                  initialFocus
                                  className="custom-calendar"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Text size={'xs'} className="mt-4">
                          What do you want your Report to contain? (Select as many applies)
                        </Text>
                        <div className="mt-4 flex max-h-[220px] flex-col flex-wrap gap-4">
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={Object.values(checkedItems).every(Boolean)}
                              onCheckedChange={() => handleCheckboxChange('all')}
                            />
                            <Text size={'xs'}>All</Text>
                          </label>
                          {Object.keys(checkedItems).map(key => (
                            <label key={key} className="flex items-center space-x-2">
                              <Checkbox
                                checked={checkedItems[key as keyof typeof checkedItems]}
                                onCheckedChange={() => handleCheckboxChange(key as tItems)}
                              />
                              <Text size={'xs'}>{key.replace('_', ' ').toUpperCase()}</Text>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-100 my-3 h-[0.3px] bg-black bg-gray-200"></div>
                    <div className="mb-6 flex w-full items-center justify-end gap-4 p-0">
                      <Button
                        type="button"
                        className="group flex w-max items-center justify-center gap-2 rounded-[6px] border bg-transparent px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 md:px-6 md:py-2"
                        onClick={onCloseForm}
                      >
                        <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
                          {`Back`}
                        </Text>
                      </Button>

                      <Button
                        disabled={!isFormValid() || status === 'pending'}
                        type="submit"
                        className="group flex items-center justify-center gap-2 rounded-[6px] px-4  py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3 "
                        onClick={() => {
                          mutate(
                            {
                              ...checkedItems,
                              start_date: startDate && format(startDate, 'yyyy-MM-dd'),
                              end_date: endDate && format(endDate, 'yyyy-MM-dd'),
                              email,
                            },
                            {
                              onSuccess: () => {
                                setSuccess(true);
                                toast('Your Report has been Generated!');
                              },
                              onError: error => {
                                console.log({ error });
                                if (error instanceof AxiosError) processError(error);
                              },
                            },
                          );
                        }}
                      >
                        {status === 'pending' ? <Spinner /> : 'Continue'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </section>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportModal;
