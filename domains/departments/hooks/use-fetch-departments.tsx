import { useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { departmentKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

interface FetchDepartmentsProps {
  size?: number;
  page?: number;
}

const useFetchDepartments = ({ size = 20, page = 1 }: FetchDepartmentsProps) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey = currentWorkspace
    ? user
      ? departmentKeys.list(currentWorkspace?.id!.toString(), user.id.toString())
      : departmentKeys.list(currentWorkspace.id.toString())
    : [''];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      try {
        const response = await $http.get('/groups', {
          params: {
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

export default useFetchDepartments;
