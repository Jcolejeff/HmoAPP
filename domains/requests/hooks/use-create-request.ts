import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { requestKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { RequestItemProps as Request } from '../type/index';

export interface CreateRequest extends Partial<Request> {}

export const useCreateRequest = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (request: CreateRequest) => {
      return $http
        .post('/requests', {
          ...request,
          organization_id: currentWorkspace?.id,
          requester_id: Number(user?.id!),
          status: 'pending',
        })
        .then(res => res.data);
    },
    onMutate: request => {
      const queryKey = requestKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<Partial<Request>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<Request>[]>(queryKey, oldData => {
        const tempIssue: Partial<Request> = {
          id: Math.random() * 100,
          ...request,
        };
        return oldData ? [tempIssue, ...oldData] : [tempIssue];
      });
      return previousData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.list(workspaceId!.toString()) });
    },
    onError: (_, vars, ctx) => {
      queryClient.setQueryData<Partial<Request>[]>(requestKeys.list(workspaceId!.toString()), ctx);
    },
  });
};
