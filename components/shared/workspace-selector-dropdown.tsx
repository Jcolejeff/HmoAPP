import { ChevronDown } from 'lucide-react';
import React, { ComponentPropsWithoutRef } from 'react';

import Link from 'next/link';

import { Dropdown } from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils/css';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { RoleType } from '@/types';

import { Text } from '../ui/text';

type WorkspaceSelectorDropdownProps = {
  currentWorkspace?: object;
  onWorkspaceSelect?: (workspace: object) => void;
  buttonClassName?: string;
} & ComponentPropsWithoutRef<'div'>;

const WorkspaceSelectorDropdown = ({
  buttonClassName,
  onWorkspaceSelect,
  children,
}: WorkspaceSelectorDropdownProps) => {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspaceContext();
  const { userOrgs, currentWorkspaceRole, setCurrentWorkspaceRole } = useUserContext();

  return (
    <Dropdown>
      <Dropdown.Trigger className="grow">
        {children ?? (
          <div
            className={cn(
              'flex h-12 w-full items-center justify-between gap-4 rounded-md bg-secondary-6 px-3',
              buttonClassName,
            )}
          >
            <div
              className={cn(
                'inline-flex h-[22px] w-[22px] items-center justify-center rounded-[16px] bg-gray-300 text-xs uppercase leading-[16px]',
              )}
            >
              {currentWorkspace?.name[0]}
            </div>
            <Text size={'sm'} className="font-semibold capitalize">
              {currentWorkspace?.name}
            </Text>
            <ChevronDown className="h-4 w-4 " />
          </div>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content className="w-[15rem] bg-gray-100">
        {workspaces &&
          workspaces.map(workspace => {
            let role: RoleType = 'Staff';

            if (userOrgs.length >= 1) {
              userOrgs.find(org => org.organization_id === workspace.id);
              role = userOrgs.find(org => org.organization_id === workspace.id)?.role.name as RoleType;
            }
            return (
              <Dropdown.Item
                key={crypto.randomUUID()}
                onClick={() => {
                  setCurrentWorkspaceRole(role);
                  switchWorkspace(workspace);
                }}
                className={cn(workspace.id === currentWorkspace?.id && 'bg-gray-300')}
              >
                {workspace.name && (
                  <div
                    className={cn(
                      'inline-flex h-[22px] w-[22px] items-center justify-center rounded-[16px] bg-gray-300 text-xs uppercase leading-[16px]',
                    )}
                  >
                    {workspace.name[0]}
                  </div>
                )}
                <Text className="whitespace-nowrap pr-2 capitalize" size={'xs'}>
                  {workspace.name}
                </Text>
              </Dropdown.Item>
            );
          })}
        <Dropdown.Item>
          <Link href={'/workspace/create'}>
            <Text size={'xs'}>Create new workspace</Text>
          </Link>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
};

export { WorkspaceSelectorDropdown };
