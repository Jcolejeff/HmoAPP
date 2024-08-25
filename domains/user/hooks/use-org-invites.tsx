import { useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { WorkspaceInvite } from '@/types';

import { useUserContext } from '../contexts/user-context';

interface PaginatedWorkspaceInvite {
  items: WorkspaceInvite[];
  page: number;
  size: number;
  total: number;
  previous_page: number;
  next_page: number;
}

export const useOrgInvites = () => {
  const { user } = useUserContext();
  const { currentWorkspace } = useWorkspaceContext();
  return useQuery({
    queryKey: [currentWorkspace ? currentWorkspace.id : '', 'invites'],
    queryFn: async () => {
      if (!user || !currentWorkspace?.id) return;
      return (await $http.get<PaginatedWorkspaceInvite>(`/organizations/${currentWorkspace?.id}/invites`)).data.items;
    },
    enabled: !!user && !!currentWorkspace?.id,
  });
};
