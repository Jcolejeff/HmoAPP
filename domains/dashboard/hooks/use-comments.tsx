import { useQuery } from '@tanstack/react-query';
import { table } from 'console';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { commentKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { CommentType } from '../type/initiator';

export interface GetCommentType {
  page: number;
  size: number;
  previous_page: string | null;
  next_page: string | null;
  items: CommentType[];
  total: number;
}

export const useComments = (recordId: string, size = 20, tableName = 'request') => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey = currentWorkspace
    ? user
      ? commentKeys.list(currentWorkspace?.id!.toString(), user.id.toString(), recordId)
      : commentKeys.list(currentWorkspace.id.toString(), recordId)
    : [''];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      return (
        await $http.get<GetCommentType>('/comments', {
          params: {
            organization_id: currentWorkspace.id,
            table_name: tableName,
            record_id: recordId,

            size,
          },
        })
      ).data.items;
    },
    enabled: !!currentWorkspace && !!user,
  });
};
