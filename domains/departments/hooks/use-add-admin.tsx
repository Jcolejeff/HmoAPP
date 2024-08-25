import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { departmentKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export type addAdmins = {
  approver_ids: number[];
  deptId: number | string | undefined;
};

export const useAddAdmin = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (data: addAdmins) => {
      return $http
        .post(`/groups/${data.deptId}/approvers/add`, {
          approver_ids: data.approver_ids,
          organization_id: workspaceId,
        })
        .then(res => res.data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.list(workspaceId!.toString()) });
    },
  });
};
