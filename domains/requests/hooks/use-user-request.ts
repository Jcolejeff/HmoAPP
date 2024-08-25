import { useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { requestKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { GetRequests } from './use-requests';

export const useRequests = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey =
    currentWorkspace && user ? requestKeys.list(currentWorkspace.id.toString(), user.id.toString()) : ['']; // current workspace shouldn't be null at this point, figure this out

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      return (
        await $http.get<GetRequests>('/requests', {
          params: { organization_id: currentWorkspace.id, requester: user.id, approver: user.id },
        })
      ).data.items;
    },
    enabled: !!currentWorkspace && !!user,
  });
};
