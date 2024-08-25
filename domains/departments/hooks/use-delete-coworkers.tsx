import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { groupMemberKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { iDepartment } from '../type';

interface DeleteCoworkerPayload {
  member_ids: number[];
}

export const useDeleteCoworkers = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: async (payload: { deptId: string; data: DeleteCoworkerPayload }) =>
      $http
        .post(`/groups/${payload.deptId}/members/remove`, {
          ...payload.data,
          organization_id: workspaceId,
        })
        .then(res => res.data),
    onMutate: async (payload: { deptId: string }) => {
      await queryClient.cancelQueries({ queryKey: groupMemberKeys.list(workspaceId!.toString()) });
      const previousRequests = queryClient.getQueryData(groupMemberKeys.list(workspaceId!.toString()));
      queryClient.setQueryData<iDepartment[]>(groupMemberKeys.list(workspaceId!.toString()), old =>
        old?.filter(department => department.id.toString() !== payload.deptId),
      );
      return { previousRequests };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupMemberKeys.list(workspaceId!.toString()) });
    },
    onError: (err, vars, ctx) => {
      queryClient.setQueryData(groupMemberKeys.list(workspaceId!.toString()), ctx?.previousRequests);
    },
  });
};
