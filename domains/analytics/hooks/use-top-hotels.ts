import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { analyticsData } from '../types';

interface iTopHotels {
  id: number;
  name: string;
  total_requests: number;
  total_spend: number;
  travel_count: number;
}

const useTopHotels = ({ startDate = '', endDate = '' }: { startDate?: string; endDate?: string }) => {
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['analytics-top-hotels', currentWorkspace?.id.toString(), `start-${startDate}`, `end-${startDate}`],
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get<analyticsData[]>('/analytics/top-hotels', {
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

export default useTopHotels;
