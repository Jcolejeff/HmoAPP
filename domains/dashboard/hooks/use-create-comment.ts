import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { commentKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { CommentType } from '../type/initiator';

export interface CreateComment
  extends Partial<Omit<CommentType, 'creator' | 'date_created' | 'last_updated' | 'id' | 'files'>> {}

export const useCreateComment = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (comment: CreateComment) => {
      return $http
        .post('/comments', {
          ...comment,
          organization_id: currentWorkspace?.id,
          table_name: 'request',
        })
        .then(res => res.data);
    },
    onMutate: comment => {
      const queryKey = commentKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<Partial<CommentType>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<CommentType>[]>(queryKey, oldData => {
        const tempComment: Partial<CommentType> = {
          id: Math.random() * 100,
          ...comment,
        };
        return oldData ? [tempComment, ...oldData] : [tempComment];
      });
      return previousData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(workspaceId!.toString()) });
    },
    onError: (_, vars, ctx) => {
      queryClient.setQueryData<Partial<CommentType>[]>(commentKeys.list(workspaceId!.toString()), ctx);
    },
  });
};
