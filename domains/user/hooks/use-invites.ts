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

export const useInvites = () => {
  const { user } = useUserContext();

  return useQuery({
    queryKey: [user ? user.id : '', 'invites'],
    queryFn: async () => {
      if (!user) return;
      return (await $http.get<PaginatedWorkspaceInvite>(`/users/${user.id}/invites`)).data.items;
    },
    enabled: !!user,
  });
};
