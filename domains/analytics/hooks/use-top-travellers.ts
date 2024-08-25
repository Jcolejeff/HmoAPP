import { useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { analyticsData } from '../types';

const useTopTravellers = ({ startDate = '', endDate = '' }: { startDate?: string; endDate?: string }) => {
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['analytics-top-travellers', currentWorkspace?.id.toString(), `start-${startDate}`, `end-${endDate}`],
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get<analyticsData[]>(`/analytics/top-travellers`, {
          params: { organization_id: currentWorkspace.id, start_date: startDate, end_date: endDate },
        })
      ).data;
    },
  });
};

export default useTopTravellers;
