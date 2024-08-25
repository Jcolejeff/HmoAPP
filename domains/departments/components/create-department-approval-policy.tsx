import React, { useEffect, useState } from 'react';
import { z } from 'zod';

import Chip from '@/components/shared/chip';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Spinner from '@/components/ui/spinner';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import { useCreateDepartment } from '@/domains/departments/hooks/use-create-department';
import { TabsNames } from '@/domains/departments/type';
import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { useWorkspaceUsers } from '@/domains/workspace/hooks/use-workspace-users';
import { WorkspaceUser } from '@/types';

import { useDepartmentsRequestContext } from '../context/departments-request-provider';

import Combobox from './combo-box';

interface Iprops {
  switchTab: (tab: TabsNames) => void;
  handleComplete: (tab: TabsNames) => void;
  data: TabsNames[];
}

interface IDataItem {
  name: string;
  type: string;
}
const createRequestSchema = z.object({
  room: z.string(),
  location: z.string(),
  start_date: z.date({
    required_error: 'A start date is required',
  }),
  end_date: z.date({
    required_error: 'An end date is required',
  }),
  purpose: z.string(),
  hotel_name: z.string(),
});
type CreateRequestFormFields = z.infer<typeof createRequestSchema>;

const CreateDepartmentApprovalPolicy = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  const {
    onOpenChange,
    createDepartmentName,
    setCreateDepartmentName,
    createDepartmentDescription,
    setCreateDepartmentDescription,
    createDepartmentApprovalPolicy,
    setCreateDepartmentApprovalPolicy,
    createDepartmentAdmins,
    setCreateDepartmentAdmins,
    createDepartmentCoworks,
  } = useDepartmentsRequestContext();

  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const { isLoading, data: users } = useWorkspaceUsers();

  const organizationId = currentWorkspace?.id;
  const { mutate, status } = useCreateDepartment();

  useEffect(() => {
    if (status === 'success') {
      onOpenChange(false);
      setCreateDepartmentName('');
      setCreateDepartmentDescription('');
      setCreateDepartmentApprovalPolicy({ value: 0, label: '' });
    }
  }, [status]);

  const handleAdminSelect = (user: WorkspaceUser) => {
    const adminExists = createDepartmentAdmins.some(selectedUser => selectedUser.id === user.id);
    if (!adminExists) {
      console.log(user);
      setCreateDepartmentAdmins([...createDepartmentAdmins, user]);
    }
  };

  const handleAdminRemove = (userId: number) => {
    setCreateDepartmentAdmins(createDepartmentAdmins.filter(user => user.id !== userId));
  };

  return (
    <TabsContent value="approval-policy" className="h-full w-full ">
      <Text size={'xs'} className="text-gray-400">
        APPROVAL SETTINGS:
      </Text>
      <RadioGroup defaultValue={createDepartmentApprovalPolicy.label} className="mt-2">
        {[
          { label: 'One Coworker to approve', value: 1 },
          { label: 'Two Coworkers to approve', value: 2 },
          { label: 'Three Coworkers to approve', value: 3 },
        ].map((item, index) => (
          <div
            className="mb-2 flex items-center space-x-2"
            key={index}
            onClick={() => setCreateDepartmentApprovalPolicy(item)}
          >
            <RadioGroupItem
              value={item.label}
              id={item.label}
              className="border-black fill-black"
              checked={createDepartmentApprovalPolicy.value === index + 1}
            />
            <Label htmlFor="option-one">
              <Text size={'xs'}>{item.label}</Text>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Combobox
        users={users}
        onSelect={handleAdminSelect}
        placeholder="Choose an admin"
        buttonClassName="w-full my-4"
        loading={isLoading}
      />

      {createDepartmentAdmins.length > 0 && (
        <div>
          <Text size={'xs'} className="text-gray-400">
            ADMINS (APPROVAL MANAGER) ADDED
          </Text>
          {createDepartmentAdmins.map((item, index) => (
            <Chip
              key={index}
              type={'user'}
              label={`${item.user.first_name} ${item.user.last_name}`}
              imageUrl={undefined}
              onRemove={() => handleAdminRemove(item.id)}
            />
          ))}
        </div>
      )}

      <div className="my-4 h-[0.5px] w-full bg-gray-300"></div>
      <div className="mb-6 flex w-full items-center justify-end gap-4">
        <button
          onClick={() => {
            switchTab(tabData[1]);
          }}
          type="button"
          className=" group mt-9 flex w-max items-center justify-center gap-2 rounded-[6px]  border px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 md:px-6 md:py-2"
        >
          <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
            {`Cancel`}
          </Text>
        </button>

        <Button
          onClick={() => {
            mutate({
              organization_id: currentWorkspace?.id,
              name: createDepartmentName,
              description: createDepartmentDescription,
              parent_group_id: 0,
              approval_levels: createDepartmentApprovalPolicy.value,
              approver_ids: [...createDepartmentAdmins.map(wUser => wUser.user_id), user?.id!],
              member_ids: [...createDepartmentCoworks.map(wUser => wUser.user_id), user?.id!],
            });
          }}
          disabled={status === 'pending'}
          type="submit"
          className="group mt-9 flex items-center justify-center gap-2 rounded-[6px] px-4  py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3 "
        >
          {status === 'pending' ? <Spinner /> : 'Continue'}
        </Button>
      </div>
    </TabsContent>
  );
};

export default CreateDepartmentApprovalPolicy;
