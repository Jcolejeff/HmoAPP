import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

type AnalyticsResponse = {
  departments_count: number;
  users_count: number;
  total_hotels_booked: number;
  total_organization_spend: number;
  total_spend_per_department: Record<string, number>[];
};

const useAnalytics = ({ startDate = '', endDate = '' }: { startDate?: string; endDate?: string }) => {
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['analytics', currentWorkspace?.id.toString(), `start-${startDate}`, `end-${endDate}`],
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get<AnalyticsResponse>('/analytics', {
          params: {
            organization_id: currentWorkspace.id,
            start_date: startDate,
            end_date: endDate,
          },
        })
      ).data;
    },
  });
};

export default useAnalytics;
