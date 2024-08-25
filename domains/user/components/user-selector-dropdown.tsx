import { ChevronsUpDown, PersonStandingIcon, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import SelectDropDown from '@/components/ui/select-dropdown';
import { Text } from '@/components/ui/text';

import { useWorkspaceUsers } from '@/domains/workspace/hooks/use-workspace-users';
import { WorkspaceUser } from '@/types';

export const UserSelectorDropdown = ({
  selectedUsers,
  onUserSelect,
  children,
  placeholder,
}: {
  selectedUsers?: WorkspaceUser[];
  onUserSelect: (user: WorkspaceUser) => void;
  children?: React.ReactNode;
  placeholder?: string;
}) => {
  const { data: workspaceUsers } = useWorkspaceUsers();

  const [selectedUserValues, setSelectedUserValues] = useState<(WorkspaceUser & { name?: string })[]>(
    selectedUsers?.map(wUser => ({ ...wUser, name: `${wUser.user.first_name} ${wUser.user.last_name}` })) ?? [],
  );

  const deselectUser = (id: number) => {
    setSelectedUserValues(prev => prev.filter(u => u.id !== id));
  };

  if (!workspaceUsers) return <></>;

  return (
    <SelectDropDown
      data={workspaceUsers.map(wUser => ({ ...wUser, name: `${wUser.user.first_name} ${wUser.user.last_name}` }))}
      placeholder={placeholder ? placeholder : 'Select Coworkers'}
      selectedValues={selectedUserValues}
      setSelectedValues={setSelectedUserValues}
      onSelectItem={value => onUserSelect(value)}
      nameKey="name"
      idKey="user_id"
    >
      {children ?? (
        <div className="flex cursor-default flex-col  gap-2">
          <Button
            type="button"
            className="cursor-default border bg-transparent p-1 hover:bg-slate-100"
            variant="ghost"
            size="none"
          >
            <Text weight={'medium'} variant={'secondary'} size={'xs'} className="block truncate hover:text-slate-600">
              {placeholder ? placeholder : 'Select Coworkers'}
            </Text>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
          <div>
            {selectedUserValues.map(user => (
              <Text
                key={user.id}
                weight={'medium'}
                variant={'primary'}
                size={'xs'}
                className="flex w-fit cursor-default gap-2 truncate border bg-transparent px-2 py-1 hover:bg-slate-100 hover:text-slate-600"
              >
                {user.name} <span className="text-[0.5rem]">|</span>
                <X className=" h-4 w-3 cursor-pointer text-gray-400" onClick={() => deselectUser(user.id)} />
              </Text>
            ))}
          </div>
        </div>
      )}
    </SelectDropDown>
  );
};
