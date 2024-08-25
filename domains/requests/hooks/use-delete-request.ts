import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams, useRouter } from 'next/navigation';

import { $http } from '@/lib/http';
import { requestKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { RequestItemProps as Request } from '../type/index';

export const useDeleteRequest = (requestId: string) => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;
  const router = useRouter();

  return useMutation({
    mutationFn: async () => $http.delete(`/requests/${requestId}`).then(res => res.data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: requestKeys.list(workspaceId!.toString()) });
      const previousRequests = queryClient.getQueryData(requestKeys.list(workspaceId!.toString()));
      queryClient.setQueryData<Request[]>(requestKeys.list(workspaceId!.toString()), old =>
        old?.filter(request => request.id.toString() !== requestId),
      );
      return { previousRequests };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.list(workspaceId!.toString()) });
    },
    onError: (err, vars, ctx) => {
      queryClient.setQueryData(requestKeys.list(workspaceId!.toString()), ctx?.previousRequests);
    },
  });
};
