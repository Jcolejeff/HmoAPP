import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { departmentKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export type EditDepartmentProps = {
  organization_id: number;
  name: string;
  description: string;
  parent_group_id: number;
  approval_levels: number;
  id: string | number;
};

export const useEditDepartment = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (department: Partial<EditDepartmentProps>) => {
      return $http
        .put(`/groups/${department.id}`, {
          ...department,
          organization_id: workspaceId,
          requester: Number(user?.id),
        })
        .then(res => res.data);
    },
    onMutate: (department: Partial<EditDepartmentProps>) => {
      const queryKey = departmentKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<Partial<EditDepartmentProps>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<EditDepartmentProps>[]>(queryKey, oldData => {
        const tempIssue: Partial<EditDepartmentProps> = {
          //   id: (Math.random() * 100).toString(),
          ...department,
        };
        return oldData ? [tempIssue, ...oldData] : [tempIssue];
      });
      return previousData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.list(workspaceId!.toString()) });
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData<Partial<EditDepartmentProps>[]>(departmentKeys.list(workspaceId!.toString()), ctx);
    },
  });
};
