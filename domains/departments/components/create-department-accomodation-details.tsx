import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from 'date-fns';
import { Barcode, ChevronDown, Map, MapPin, QrCode, X } from 'lucide-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import Image from 'next/image';

import Chip from '@/components/shared/chip';
import { Button } from '@/components/ui/button';
import CalendarInput from '@/components/ui/calender-input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

import { url } from '@/lib/utils';

import { useCreateRequest } from '@/domains/requests/hooks/use-create-request';
import { useWorkspaceUsers } from '@/domains/workspace/hooks/use-workspace-users';
import { WorkspaceUser } from '@/types';

import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { chipItems } from '../static';
import { TabsNames } from '../type';

import Combobox from './combo-box';
import DepartmentInput from './department-input';

interface Iprops {
  switchTab: (tab: TabsNames) => void;
  handleComplete: (tab: TabsNames) => void;
  data: TabsNames[];
}

const CreateDepartmentAccomodationDetails = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  const { isLoading, data: users } = useWorkspaceUsers();
  const { setCreateDepartmentCoworks, createDepartmentCoworks } = useDepartmentsRequestContext();

  const handleUserSelect = (user: WorkspaceUser) => {
    const userExists = createDepartmentCoworks.some((selectedUser: WorkspaceUser) => selectedUser.id === user.id);
    if (!userExists) {
      setCreateDepartmentCoworks([...createDepartmentCoworks, user]);
    }
  };

  const handleuserRemove = (userId: number) => {
    setCreateDepartmentCoworks(createDepartmentCoworks.filter((user: WorkspaceUser) => user.id !== userId));
  };

  return (
    <TabsContent value="add-coworkers" className="h-full w-full border-t">
      <div className="h-full w-full">
        <Combobox
          users={users}
          onSelect={handleUserSelect}
          placeholder="Choose a coworker"
          buttonClassName="w-full my-4"
          loading={isLoading}
        />

        <div className="my-4 rounded-lg bg-[#F1F5F9] p-4">
          <div className="mb-3 flex flex-row items-center space-x-3">
            <Image src={url('/images/dashboard/hugeicons_note.png')} width={20} height={20} alt="note" />
            <Text size={'sm'} className="font-bold">
              NOTE:
            </Text>
          </div>
          <Text size={'xs'}>
            Invite by name is only applicable to coworkers who currently have access to the portal. Otherwise, invite by
            email so they’ll get a link to the portal. To add in bulk, just use commas.
          </Text>
        </div>

        {createDepartmentCoworks.length > 0 && (
          <div>
            <Text size={'xs'} className="text-gray-400">
              COWORKERS ADDED
            </Text>
            <div className="flex">
              {createDepartmentCoworks.map((item: WorkspaceUser, index: number) => (
                <Chip
                  key={index}
                  type={'user'}
                  label={`${item.user.first_name} ${item.user.last_name}`}
                  imageUrl={undefined}
                  onRemove={() => handleuserRemove(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="my-4 h-[0.5px] w-full bg-gray-300"></div>
        <div className="mb-6 flex w-full items-center justify-end gap-4">
          <button
            onClick={() => {
              switchTab(tabData[0]);
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
              switchTab(tabData[2]);
              handleComplete(tabData[1]);
            }}
            disabled={createDepartmentCoworks.length < 1}
            type="submit"
            className="group mt-9 flex items-center justify-center gap-2 rounded-[6px] px-4 py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3"
          >
            Continue
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default CreateDepartmentAccomodationDetails;
