import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { workspaceKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { WorkspaceInviteStatus } from '@/types';

import { useUserContext } from '../contexts/user-context';

export const useUpdateInvite = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  return useMutation({
    mutationFn: ({ status, invite_token }: { status: WorkspaceInviteStatus; invite_token: string }) =>
      $http
        .put(`/organizations/invites/${invite_token}`, {
          status,
        })
        .then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [user ? user.id : '', 'invites'] });
      queryClient.invalidateQueries({ queryKey: [currentWorkspace?.id, 'invites'] });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
};
