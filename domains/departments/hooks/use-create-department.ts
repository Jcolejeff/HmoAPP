import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { departmentKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export type CreateDepartmentProps = {
  organization_id: number;
  name: string;
  description: string;
  parent_group_id: number;
  approval_levels: number;
  approver_ids: number[];
  member_ids: number[];
};

export const useCreateDepartment = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (department: Partial<CreateDepartmentProps>) => {
      return $http
        .post('/groups', {
          ...department,
          organization_id: workspaceId,
          requester: Number(user?.id),
        })
        .then(res => res.data);
    },
    onMutate: (department: Partial<CreateDepartmentProps>) => {
      const queryKey = departmentKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<Partial<CreateDepartmentProps>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<CreateDepartmentProps>[]>(queryKey, oldData => {
        const tempIssue: Partial<CreateDepartmentProps> = {
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
      queryClient.setQueryData<Partial<CreateDepartmentProps>[]>(departmentKeys.list(workspaceId!.toString()), ctx);
    },
  });
};
