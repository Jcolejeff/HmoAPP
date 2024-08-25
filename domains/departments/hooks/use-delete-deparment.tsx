import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams, useRouter } from 'next/navigation';

import { $http } from '@/lib/http';
import { departmentKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { iDepartment } from '../type';

export const useDeleteDepartment = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: async (deptId: string) =>
      $http
        .delete(`/groups/${deptId}`, {
          params: {
            organization_id: workspaceId,
          },
        })
        .then(res => res.data),
    onMutate: async (deptId: string) => {
      await queryClient.cancelQueries({ queryKey: departmentKeys.list(workspaceId!.toString()) });
      const previousRequests = queryClient.getQueryData(departmentKeys.list(workspaceId!.toString()));
      queryClient.setQueryData<iDepartment[]>(departmentKeys.list(workspaceId!.toString()), old =>
        old?.filter(department => department.id.toString() !== deptId),
      );
      return { previousRequests };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.list(workspaceId!.toString()) });
    },
    onError: (err, vars, ctx) => {
      queryClient.setQueryData(departmentKeys.list(workspaceId!.toString()), ctx?.previousRequests);
    },
  });
};
