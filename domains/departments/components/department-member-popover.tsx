import { AxiosError } from 'axios';
import React from 'react';
import { toast } from 'sonner';

import Image from 'next/image';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';

import processError from '@/lib/error';
import { url } from '@/lib/utils';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { useManagerRequestContext } from '../../dashboard/context/manager/manager-requests-provider';
import { useDeleteCoworkers } from '../hooks/use-delete-coworkers';

export interface iDepartmentMemberPopOver {
  coworkerId: {
    member_id: string;
  };
  departmentId: string;
}

const DepartmentMemberPopOver: React.FC<iDepartmentMemberPopOver> = ({ coworkerId, departmentId }) => {
  const { mutate: deleteCoworkers, isPending } = useDeleteCoworkers();

  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id;

  const handleRemoveCoworker = () => {
    const payload = {
      member_ids: [parseInt(coworkerId.member_id)],
    };

    console.log('delete members', { deptId: departmentId, data: payload });

    deleteCoworkers(
      { deptId: departmentId, data: payload },
      {
        onSuccess: () => {
          toast(`Coworker Deleted`);
        },
        onError: error => {
          console.log({ error });
          if (error instanceof AxiosError) processError(error);
        },
      },
    );
  };

  const handleViewOpenCoworkerRequest = () => {
    // Add functionality here
  };

  const actions = [
    { label: 'View Open requests', className: 'text-gray-500', onclick: handleViewOpenCoworkerRequest },
    { label: 'Remove Coworker', className: 'text-red-500 ', onclick: handleRemoveCoworker },
  ];

  const { onOpenChange } = useManagerRequestContext();

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button onClick={handleTriggerClick}>
          <Image src={url('/svg/dashboard/manager/menu-dots-bold.svg')} alt="action" width={26} height={10} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 rounded-md border bg-white p-4 shadow-md">
        <div className="flex flex-col space-y-2">
          {actions.map(action => (
            <button
              key={action.label}
              className={`py-1 text-left transition-all duration-200 ease-in-out hover:rounded-lg hover:bg-background-lighter hover:px-3`}
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                action.onclick();
              }}
            >
              <Text size={'xs'} className={`${action.className}`}>
                {action.label}
              </Text>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DepartmentMemberPopOver;
