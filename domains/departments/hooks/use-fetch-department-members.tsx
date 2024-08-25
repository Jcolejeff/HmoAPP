import { useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { departmentKeys, groupMemberKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

interface FetchDepartmentsProps {
  id: string | number | undefined;
  size?: number;
  page?: number;
}

const useFetchDepartmentMembers = ({ size = 20, page = 1, id }: FetchDepartmentsProps) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey = currentWorkspace
    ? user
      ? groupMemberKeys.list(currentWorkspace?.id!.toString(), user.id.toString(), id as string)
      : groupMemberKeys.list(currentWorkspace.id.toString(), id as string)
    : [];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      try {
        const response = await $http.get(`/groups/${id}/members`, {
          params: {
            id: id,
            organization_id: currentWorkspace.id,
            size,
            page,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch organization users: ${(error as Error).message}`);
      }
    },
    enabled: !!currentWorkspace && !!user,
  });
};

export default useFetchDepartmentMembers;
