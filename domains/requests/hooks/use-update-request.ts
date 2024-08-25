import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { requestKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { RequestItemProps as Request } from '../type/index';

export interface UpdateRequestPayload extends Partial<Omit<Request, 'created_at' | 'last_updated'>> {}

export const useUpdateRequest = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: async (request: UpdateRequestPayload) => {
      return $http
        .put<Request>(`/requests/${request.id}`, {
          ...request,
          organization_id: currentWorkspace?.id,
        })
        .then(res => res.data);
    },

    onMutate: updatedRequest => {
      console.log({ updatedRequest });
      const queryKey = requestKeys.detail(updatedRequest.id!.toString());
      const requestsListQueryKey = requestKeys.list(workspaceId!.toString());
      queryClient.cancelQueries({ queryKey: requestsListQueryKey });

      const previousRequestsList = queryClient.getQueryData<Request[]>(requestsListQueryKey);
      const previousRequest = queryClient.getQueryData<Request>(queryKey);

      // update single
      queryClient.setQueryData<Partial<Request>>(queryKey, requestInCache => {
        return { ...requestInCache, ...updatedRequest };
      });

      // update list
      queryClient.setQueryData<Request[]>(requestsListQueryKey, requestsInCache => {
        return requestsInCache?.map(request => {
          if (request.id?.toString() === updatedRequest.id!.toString()) {
            return { ...request, ...updatedRequest };
          }
          return request;
        });
      });

      return { previousRequestsList, previousRequest };
    },
    onSuccess: (_, updatedRequest, ctx) => {
      const queryKey = requestKeys.detail(updatedRequest.id!.toString());
      const requestsListQueryKey = requestKeys.list(workspaceId!.toString());
      queryClient.invalidateQueries({ queryKey: requestsListQueryKey });
      queryClient.invalidateQueries({ queryKey: queryKey });
    },

    onError: (err, updatedRequest, ctx) => {
      const queryKey = requestKeys.detail(updatedRequest.id!.toString());
      const requestsListQueryKey = requestKeys.list(workspaceId!.toString());

      // rollback in case of error
      queryClient.setQueryData<Request[]>(requestsListQueryKey, ctx?.previousRequestsList);
      queryClient.setQueryData<Request>(queryKey, ctx?.previousRequest);
    },
  });
};
