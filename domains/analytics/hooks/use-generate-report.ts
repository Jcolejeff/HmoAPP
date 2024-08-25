import { useMutation } from '@tanstack/react-query';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export type GenerateReportProps = {
  total_requests: boolean;
  pending_requests: boolean;
  approved_requests: boolean;
  top_requesters: boolean;
  top_hotels: boolean;
  total_spend: boolean;
  cancelled_requests: boolean;
  total_departments: boolean;
  travel_count: boolean;
  top_destinations: boolean;
  top_travellers: boolean;
  start_date: string | undefined;
  end_date: string | undefined;
  email: string;
};

export const useGenerateReport = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (items: Partial<GenerateReportProps>) => {
      return $http
        .post('/analytics/reports', {
          ...items,
          organization_id: workspaceId,
        })
        .then(res => res.data);
    },
  });
};
