import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { requestKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { RequestItemProps as Request } from '../type/index';

export const useSingleRequest = (requestId: number) => {
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: requestKeys.detail(requestId.toString()),
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get<Request>(`/requests/${requestId}`, {
          params: { organization_id: currentWorkspace.id },
        })
      ).data;
    },
    enabled: !!currentWorkspace && !!requestId,
  });
};
