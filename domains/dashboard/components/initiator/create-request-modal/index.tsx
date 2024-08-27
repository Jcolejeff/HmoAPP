'use client';

import React, { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { TabsList, Tabs, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import useOnClickOutside from '@/lib/hooks/useClickOutside';
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll';
import { ConnectorFilled, RingFilled } from '@/lib/icons';
import Icon from '@/lib/icons';
import { url } from '@/lib/utils';

import { TabsNames } from '@/domains/dashboard/type/initiator';

import { useCreateRequestContext } from '../../../context/initiator/create-request-context';

import AdditionalNotesTab from './additional-notes-tab';
import HotelDetailsTab from './hotel-details-tab';

interface Iprop {
  trigger: JSX.Element;
  triggerClassName?: string;
  title?: string;
}
const TravelDetailsTab = dynamic(() => import('./travel-details-tab'), { ssr: false });

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode | string;
}

const CreateRequestModal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const [visible, setVisible] = useState(isOpen);
  const {
    open,
    onOpenChange,
    createMore,
    setCreateMore,
    openHotelSideBar,
    setOpenHotelSideBar,
    activeTab,
    setActiveTab,
    setIsEditMode,
  } = useCreateRequestContext();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [data] = useState<TabsNames[]>(['travel-details', 'hotel-details', 'additional-notes']);
  const [iconList] = useState(['RingEmpty', 'RingFilled'] as any);
  const switchTab = (tab: TabsNames) => {
    setActiveTab(tab);
  };
  const handleComplete = (tab: TabsNames) => {
    setCompleted([...completed, tab]);
  };
  const checkIcon = (tab: string) => {
    if (tab === activeTab) {
      return iconList[0];
    }
    if (completed.includes(tab)) {
      return iconList[1];
    } else {
      return iconList[0];
    }
  };

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
    setIsEditMode(false);
  };

  useLockBodyScroll(open);

  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onCloseForm} modal={false}>
      <DialogContent className="min-w-[750px]">
        <div
          className={`relative m-auto flex w-full max-w-[90%] flex-col rounded-lg px-8 pt-4 md:max-w-[500px] lg:max-w-[700px]`}
        >
          <section className="flex flex-col">
            <section className="flex h-full w-full max-w-[1700px] flex-col items-center gap-8 overflow-scroll">
              <div className="h-full w-full">
                <Tabs defaultValue="travel-details" value={activeTab} className="">
                  <TabsList className="hidden items-center justify-between border border-b border-none border-gray-100 bg-white/50 pb-4 pt-2 lg:flex">
                    {/* tab 1 */}
                    <TabsTrigger
                      value={data[0]}
                      onClick={() => switchTab(data[0])}
                      className=" items-center gap-1 rounded-lg"
                    >
                      <Icon name={checkIcon(data[0])} />
                      <Text weight={'medium'} className="" size={'sm'}>
                        Issue details
                      </Text>
                    </TabsTrigger>
                    <Icon name={completed.includes(data[0]) ? 'ConnectorFilled' : 'ConnectorNotFilled'} />

                    {/* tab 2 */}
                    <TabsTrigger
                      onClick={() => switchTab(data[1])}
                      value={data[1]}
                      disabled={completed.includes(data[1]) ? false : activeTab === data[1] ? false : true}
                      className="items-center gap-1 rounded-lg"
                    >
                      <Icon name={checkIcon(data[1])} />
                      <Text weight={'medium'} className="" size={'sm'}>
                        Student details
                      </Text>
                    </TabsTrigger>

                    <Icon name={completed.includes(data[1]) ? 'ConnectorFilled' : 'ConnectorNotFilled'} />
                    {/* tab 3 */}

                    <TabsTrigger
                      onClick={() => switchTab(data[2])}
                      disabled={completed.includes(data[2]) ? false : activeTab === data[2] ? false : true}
                      value={data[2]}
                      className="items-center gap-1 rounded-lg "
                    >
                      <Icon name={checkIcon(data[2])} />
                      <Text weight={'medium'} className="" size={'sm'}>
                        Review & Submit
                      </Text>
                    </TabsTrigger>
                  </TabsList>

                  <TravelDetailsTab switchTab={switchTab} data={data} handleComplete={handleComplete} />

                  <HotelDetailsTab switchTab={switchTab} data={data} handleComplete={handleComplete} />

                  <AdditionalNotesTab
                    switchTab={switchTab}
                    data={data}
                    setModalOpen={setModalOpen}
                    handleComplete={handleComplete}
                    setCompleted={setCompleted}
                  />
                </Tabs>
              </div>
            </section>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestModal;
