import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { groupMemberKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export type addCoworkers = {
  member_ids: number[];
  deptId: number | string | undefined;
};

export const useAddCoworkersToDepartment = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (data: addCoworkers) => {
      return $http
        .post(`/groups/${data.deptId}/members/add`, {
          member_ids: data.member_ids,
          organization_id: workspaceId,
        })
        .then(res => res.data);
    },
    onMutate: (data: Partial<addCoworkers>) => {
      const queryKey = groupMemberKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<Partial<addCoworkers>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<addCoworkers>[]>(queryKey, oldData => {
        const tempIssue: Partial<addCoworkers> = {
          //   id: (Math.random() * 100).toString(),
          ...data,
        };
        return oldData ? [tempIssue, ...oldData] : [tempIssue];
      });
      return previousData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupMemberKeys.list(workspaceId!.toString()) });
    },
  });
};
