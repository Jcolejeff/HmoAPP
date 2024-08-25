import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';
import { workspaceUserKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { WorkspaceUser } from '@/types';

export const useWorkspaceUsers = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryKey = !currentWorkspace ? [] : workspaceUserKeys.list(currentWorkspace.id.toString());

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (await $http.get<WorkspaceUser[]>(`/organizations/${currentWorkspace.id}/users`)).data;
    },
    enabled: !!currentWorkspace,
  });
};
