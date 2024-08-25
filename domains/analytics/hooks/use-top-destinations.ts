import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { analyticsData } from '../types';

interface iTopDestination {
  id: number;
  name: string;
  total_requests: number;
  total_spend: number;
  travel_count: number;
}

const useTopDestinations = ({ startDate = '', endDate = '' }: { startDate?: string; endDate?: string }) => {
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['analytics-top-destination', currentWorkspace?.id.toString(), `start-${startDate}`, `end-${startDate}`],
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get<analyticsData[]>('/analytics/top-destinations', {
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

export default useTopDestinations;
