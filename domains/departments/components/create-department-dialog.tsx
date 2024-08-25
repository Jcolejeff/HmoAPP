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

import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll';
import Icon from '@/lib/icons';

import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { TabsNames } from '../type';

import CreateDepartmentAccomodationDetails from './create-department-accomodation-details';
import CreateDepartmentApprovalPolicy from './create-department-approval-policy';
import CreateDepartmentName from './create-department-name';

interface Iprop {
  trigger: JSX.Element;
  triggerClassName?: string;
  title?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode | string;
}

const CreateDepartmentDialog: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const [visible, setVisible] = useState(isOpen);
  const { isCreateDepartmentModalOpen, onOpenChange, activeTab, setActiveTab, isEditMode, setIsEditMode } =
    useDepartmentsRequestContext();

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const [completed, setCompleted] = useState<string[]>([]);
  const [data] = useState<TabsNames[]>(['create-department', 'add-coworkers', 'approval-policy']);
  const [iconList] = useState(['RingEmpty', 'RingFilled'] as any);
  const switchTab = (tab: TabsNames) => {
    setActiveTab(tab);
  };
  const handleComplete = (tab: TabsNames) => {
    setCompleted([...completed, tab]);
  };

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
    setIsEditMode(false);
  };
  useLockBodyScroll(isCreateDepartmentModalOpen);

  if (!isCreateDepartmentModalOpen) return null;
  return (
    <Dialog open={isCreateDepartmentModalOpen} onOpenChange={onCloseForm}>
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
                      className=" items-center space-x-1 rounded-lg "
                    >
                      <Text
                        size={'xs'}
                        weight={'bold'}
                        className="rounded-full bg-black p-1 px-2 text-white"
                        color="white"
                      >
                        1
                      </Text>
                      <Text weight={'medium'} className="" size={'xs'}>
                        Create department
                      </Text>
                    </TabsTrigger>
                    <Icon name={completed.includes(data[0]) ? 'ConnectorFilled' : 'ConnectorNotFilled'} />

                    {/* tab 2 */}
                    <TabsTrigger
                      onClick={() => switchTab(data[1])}
                      value={data[1]}
                      disabled={completed.includes(data[1]) ? false : activeTab === data[1] ? false : true}
                      className="ms-2 items-center space-x-1 rounded-lg"
                    >
                      <Text
                        size={'xs'}
                        weight={'bold'}
                        className="rounded-full bg-black p-1 px-2 text-white"
                        color="white"
                      >
                        2
                      </Text>
                      <Text weight={'medium'} className="" size={'xs'}>
                        Add coworkers
                      </Text>
                    </TabsTrigger>

                    <Icon name={completed.includes(data[1]) ? 'ConnectorFilled' : 'ConnectorNotFilled'} />
                    {/* tab 3 */}

                    <TabsTrigger
                      onClick={() => switchTab(data[2])}
                      disabled={completed.includes(data[2]) ? false : activeTab === data[2] ? false : true}
                      value={data[2]}
                      className="me-2 items-center space-x-1 rounded-lg"
                    >
                      <Text
                        size={'xs'}
                        weight={'bold'}
                        className="rounded-full bg-black p-1 px-2 text-white"
                        color="white"
                      >
                        3
                      </Text>
                      <Text weight={'medium'} className="" size={'xs'}>
                        Approval policy
                      </Text>
                    </TabsTrigger>
                  </TabsList>

                  <CreateDepartmentName switchTab={switchTab} data={data} handleComplete={handleComplete} />

                  <CreateDepartmentAccomodationDetails
                    switchTab={switchTab}
                    data={data}
                    handleComplete={handleComplete}
                  />

                  <CreateDepartmentApprovalPolicy switchTab={switchTab} data={data} handleComplete={handleComplete} />
                </Tabs>
              </div>
            </section>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
