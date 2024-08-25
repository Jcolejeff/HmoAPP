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
import Spinner from '@/components/ui/spinner';
import { TabsList, Tabs, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import useOnClickOutside from '@/lib/hooks/useClickOutside';
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll';
import { ConnectorFilled, RingFilled } from '@/lib/icons';
import Icon from '@/lib/icons';
import { url } from '@/lib/utils';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import AdditionalNotesTab from '../../dashboard/components/initiator/create-request-modal/additional-notes-tab';
import HotelDetailsTab from '../../dashboard/components/initiator/create-request-modal/hotel-details-tab';
import TravelDetailsTab from '../../dashboard/components/initiator/create-request-modal/travel-details-tab';
import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { useEditDepartment } from '../hooks/use-edit-department';
import { TabsNames } from '../type';

import CreateDepartmentAccomodationDetails from './create-department-accomodation-details';
import CreateDepartmentApprovalPolicy from './create-department-approval-policy';
import CreateDepartmentName from './create-department-name';
import DepartmentInput from './department-input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode | string;
  description?: string;
  editId: string | number | undefined;
}

const EditDepartmentDialog: React.FC<ModalProps> = ({ isOpen, onClose, title, description, editId }) => {
  const [visible, setVisible] = useState<boolean>(isOpen);
  const [editDepartmentName, setEditDepartmentName] = useState<string>('');
  const [editDepartmentDescription, setEditDepartmentDescription] = useState<string>('');
  const {
    isEditDepartmentModalOpen,
    setIsEditDepartmentModalOpen,
    onOpenChange,
    activeTab,
    setActiveTab,
    isEditMode,
    setIsEditMode,
  } = useDepartmentsRequestContext();

  const { mutate, status } = useEditDepartment();
  const { currentWorkspace } = useWorkspaceContext();

  useEffect(() => {
    if (status === 'success') {
      setIsEditDepartmentModalOpen(false);
    }
  }, [status]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [data] = useState<TabsNames[]>(['create-department', 'add-coworkers', 'approval-policy']);
  const [iconList] = useState<string[]>(['RingEmpty', 'RingFilled']);

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
    setIsEditDepartmentModalOpen(false);
  };

  useLockBodyScroll(isEditDepartmentModalOpen);

  useEffect(() => {
    if (title) {
      setEditDepartmentName(String(title));
    }
    setEditDepartmentDescription(description || '');
  }, [title, description]);

  if (!isEditDepartmentModalOpen) return null;

  return (
    <Dialog open={isEditDepartmentModalOpen} onOpenChange={onCloseForm}>
      <DialogContent className="min-w-[750px]">
        <div
          className={`relative m-auto flex w-full max-w-[90%] flex-col rounded-lg px-8 pt-4 md:max-w-[500px] lg:max-w-[700px]`}
        >
          <section className="flex flex-col">
            <section className="flex h-full w-full max-w-[1700px] flex-col items-center gap-8 overflow-scroll">
              <div className="h-full w-full">
                <div className="h-full w-full border-t ">
                  <DepartmentInput
                    departmentNameLabel="DEPARTMENT NAME:"
                    textValue={editDepartmentName}
                    setTextValue={setEditDepartmentName}
                    placeHolder="Enter department name"
                  />
                  <DepartmentInput
                    departmentNameLabel="DEPARTMENT DESCRIPTION:"
                    textValue={editDepartmentDescription}
                    setTextValue={setEditDepartmentDescription}
                    placeHolder="Enter description"
                  />

                  <div className="my-6 flex w-full items-center justify-end gap-4">
                    <button
                      onClick={() => {
                        setIsEditDepartmentModalOpen(false);
                      }}
                      type="button"
                      className="group mt-9 flex w-max items-center justify-center gap-2 rounded-[6px] border px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 md:px-6 md:py-2"
                    >
                      <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
                        {`Cancel`}
                      </Text>
                    </button>

                    <Button
                      onClick={() => {
                        mutate({
                          organization_id: currentWorkspace?.id,
                          name: editDepartmentName,
                          description: editDepartmentDescription,
                          parent_group_id: 0,
                          id: editId,
                        });
                      }}
                      disabled={!editDepartmentName || !editDepartmentDescription}
                      type="submit"
                      className="group mt-9 flex items-center justify-center gap-2 rounded-[6px] px-4 py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3 "
                    >
                      {status === 'pending' ? <Spinner /> : 'Continue'}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
