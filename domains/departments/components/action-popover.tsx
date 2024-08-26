import { AxiosError } from 'axios';
import { EllipsisVertical } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';

import processError from '@/lib/error';

import { useManagerRequestContext } from '../../dashboard/context/manager/manager-requests-provider';
import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { useDeleteDepartment } from '../hooks/use-delete-deparment';

import InviteNewCoworkers from './invite-new-coworkers';

interface iActionPopover {
  deptId: string | number;
  setTitle?: (value: string | undefined) => void;
  setDescription?: (value: string | undefined) => void;
  setId?: (value: string | number | undefined) => void;
  title?: string;
  description?: string;
}

const ActionPopOver: React.FC<iActionPopover> = ({ deptId, setTitle, title, description, setDescription, setId }) => {
  const { setIsInviteNewCoworkersModalOpen } = useDepartmentsRequestContext();
  const { mutate: deleteDepartment, isPending } = useDeleteDepartment();
  const {
    onOpenChange,
    setIsEditDepartmentModalOpen,
    setActiveDepartmentTab,
    setCurrentInviteType,
    setIsInviteNewAdminsModalOpen,
  } = useDepartmentsRequestContext();
  const router = useRouter();

  const handleInvite = () => {
    if (setId) setId(deptId);
    setIsInviteNewCoworkersModalOpen(true);
  };

  const handleManageAdmins = () => {
    if (setId) setId(deptId);
    setIsInviteNewAdminsModalOpen(true);
  };

  const handleViewOpenRequests = () => {
    setActiveDepartmentTab('Requests');
    router.push(`departments/${deptId}`);
  };

  const handleEditDepartment = () => {
    if (setTitle) setTitle(title);
    if (setDescription) setDescription(description);
    if (setId) setId(deptId);
    setIsEditDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = () => {
    deleteDepartment(deptId as string, {
      onSuccess: () => {
        toast(`Department Deleted`);
      },
      onError: error => {
        console.log({ error });
        if (error instanceof AxiosError) processError(error);
      },
    });
  };

  const actions = [
    { label: 'Invite new users', className: 'text-black', onClick: handleInvite },
    { label: 'Manage Admins', className: 'text-black', onClick: handleManageAdmins },
    // { label: 'View Open requests', className: 'text-black', onClick: handleViewOpenRequests },
    // { label: 'Edit Department', className: 'text-black', onClick: handleEditDepartment },
    // { label: 'Delete Department', className: 'text-red-500', onClick: handleDeleteDepartment },
  ];

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button onClick={handleTriggerClick}>
            <EllipsisVertical color="gray" size={26} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="mr-[50px] w-48 rounded-md border bg-white p-4 shadow-md">
          <div className="flex flex-col space-y-2">
            {actions.map(action => (
              <button
                key={action.label}
                className={`py-1 text-left transition-all duration-200 ease-in-out hover:rounded-lg hover:bg-background-lighter hover:px-3`}
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  action.onClick();
                }}
              >
                <Text size={'sm'} className={`${action.className}`}>
                  {action.label}
                </Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ActionPopOver;
