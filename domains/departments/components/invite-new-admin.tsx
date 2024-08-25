import { AxiosError } from 'axios';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Image from 'next/image';

import Chip from '@/components/shared/chip';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

import processError from '@/lib/error';
import { url } from '@/lib/utils';
import { cn } from '@/lib/utils/css';

import { UserSelectorDropdown } from '@/domains/user/components/user-selector-dropdown';
import { useWorkspaceUsers } from '@/domains/workspace/hooks/use-workspace-users';
import { iOrganizationUser, WorkspaceUser } from '@/types';

import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { useAddAdmin } from '../hooks/use-add-admin';
import { useAddCoworkersToDepartment } from '../hooks/use-add-coworkers';
import useFetchDepartmentMembers from '../hooks/use-fetch-department-members';
import { chipItems } from '../static';

import Combobox from './combo-box';
import InviteMemberCombobox from './invite-member-combobox';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode | string;
  deptId: number | string | undefined;
}

const InviteNewAdmin: React.FC<ModalProps> = ({ isOpen, onClose, deptId }) => {
  const { isInviteNewAdminsModalOpen, setIsInviteNewAdminsModalOpen } = useDepartmentsRequestContext();
  const { mutate: addAdminsToDepartment, isPending } = useAddAdmin();
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const { data: dbsn } = useWorkspaceUsers();

  console.log('dbsn', dbsn);

  const { isLoading, data: users } = useFetchDepartmentMembers({
    id: deptId,
  });

  console.log('users', users);

  useEffect(() => {
    if (isOpen) {
      setIsInviteNewAdminsModalOpen(true);
    }
  }, [isOpen]);

  const handleAddUsers = () => {
    addAdminsToDepartment(
      { deptId, approver_ids: selectedUsers.map(user => user.id) },
      {
        onSuccess: () => {
          toast(`Admin Added`);
          setIsInviteNewAdminsModalOpen(false);
        },
        onError: error => {
          console.log({ error });
          if (error instanceof AxiosError) processError(error);
        },
      },
    );
  };

  const handleUserSelect = (value: WorkspaceUser) => {
    const userExists = selectedUsers.some(selectedUser => selectedUser.id === value.id);
    if (!userExists) {
      setSelectedUsers(prev => [...prev, value]);
    }
  };

  const handleuserRemove = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  console.log(selectedUsers);

  if (!isInviteNewAdminsModalOpen) return null;

  return (
    <Dialog open={isInviteNewAdminsModalOpen} onOpenChange={() => setIsInviteNewAdminsModalOpen(false)}>
      <DialogContent className="min-w-[750px]">
        <DialogHeader>
          {/* <DialogTitle>{title}</DialogTitle> */}
          <DialogDescription className="px-10 pt-5">Select Admins to invite to the department.</DialogDescription>
        </DialogHeader>
        <div className="relative m-auto flex w-full max-w-[90%] flex-col rounded-lg px-8 pt-4 md:max-w-[500px] lg:max-w-[700px]">
          <section className="flex flex-col">
            <section className="flex h-full w-full max-w-[1700px] flex-col items-center gap-8 overflow-scroll">
              <div className="h-full w-full">
                <InviteMemberCombobox
                  users={users?.items}
                  onSelect={handleUserSelect}
                  placeholder="Choose an Admins"
                  buttonClassName="w-full my-4"
                  loading={isLoading}
                  innerPlaceholder={'member'}
                />
                <div className="h-full w-full">
                  <div className="my-4 rounded-lg bg-[#F1F5F9] p-4">
                    <div className="mb-3 flex flex-row items-center space-x-3">
                      <Image src={url('/images/dashboard/hugeicons_note.png')} width={20} height={20} alt="note" />
                      <Text size={'sm'} className="font-bold">
                        NOTE:
                      </Text>
                    </div>
                    <Text size={'xs'}>
                      Invite by name is only applicable to Admins who currently have access to the portal. Otherwise,
                      invite by email so they’ll get a link to the portal. To add in bulk, just use commas.
                    </Text>
                  </div>

                  {selectedUsers.length > 0 && (
                    <div>
                      <Text size={'xs'} className="text-gray-400">
                        ADMINS ADDED
                      </Text>
                      <div className="flex">
                        {selectedUsers.map((item, index) => (
                          <Chip
                            key={index}
                            type={'user'}
                            label={`${item.member.first_name} ${item.member.last_name}`}
                            imageUrl={undefined}
                            onRemove={() => handleuserRemove(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="my-4 h-[0.5px] w-full bg-gray-300"></div>
                  <div className="mb-6 flex w-full items-center justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteNewAdminsModalOpen(false)}
                      className="group mt-9 flex w-max items-center justify-center gap-2 rounded-[6px] border px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 md:px-6 md:py-2"
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleAddUsers}
                      disabled={selectedUsers.length === 0 || isPending}
                      className="group mt-9 flex items-center justify-center gap-2 rounded-[6px] px-4 py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3"
                    >
                      {isPending ? <Spinner /> : 'Continue'}
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

export default InviteNewAdmin;
