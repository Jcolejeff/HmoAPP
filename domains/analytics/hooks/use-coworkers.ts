import { useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

interface iCoworkers {
  id: number;
  name: string;
  total_requests: number;
  total_spend: number;
  travel_count: number;
}

const useCoworkers = ({ startDate = '', endDate = '' }: { startDate?: string; endDate?: string }) => {
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['analytics-coworkers', currentWorkspace?.id.toString(), `start-${startDate}`, `end-${endDate}`],
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get(`/analytics/coworkers`, {
          params: { organization_id: currentWorkspace.id, start_date: startDate, end_date: endDate },
        })
      ).data;
    },
  });
};

export default useCoworkers;
