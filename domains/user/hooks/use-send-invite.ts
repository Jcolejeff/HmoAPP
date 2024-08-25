import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { workspaceInviteKeys, workspaceKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export const useSendInvite = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emails: string[]) => $http.post(`/organizations/${currentWorkspace?.id}/invites`, { emails }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceInviteKeys.list() });
    },
  });
};

export default useSendInvite;
