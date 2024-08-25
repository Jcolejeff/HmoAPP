import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { request } from 'http';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { requestKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { RequestItemProps as Request, RequestStatus } from '../type/index';

export interface GetRequests {
  page: number;
  size: number;
  previous_page: string | null;
  next_page: string | null;
  items: Request[];
  total: number;
}

type UseRequestsProps = {
  size?: number;
  page?: number;
  approverId?: number;
  requesterId?: number;
  status?: RequestStatus;
};

export const useRequests = ({ status, approverId, requesterId, size = 10, page = 1 }: UseRequestsProps) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey = currentWorkspace
    ? user
      ? requestKeys.list(
          currentWorkspace?.id!.toString(),
          user.id.toString(),
          approverId ? approverId.toString() : '',
          requesterId ? requesterId.toString() : '',
          status || 'all',
          `size - ${size}`,
          `page - ${page}`,
        )
      : requestKeys.list(currentWorkspace.id.toString())
    : ['']; // current workspace shouldn't be null at this point, figure this out

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      return (
        await $http.get<GetRequests>('/requests', {
          params: {
            organization_id: currentWorkspace.id,
            status,
            approver: approverId,
            requester: requesterId,
            size,
            page,
          },
        })
      ).data;
    },
    placeholderData: keepPreviousData,
    enabled: !!currentWorkspace && !!user,
  });
};
