import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

const useApiKey = () => {
  const { currentWorkspace } = useWorkspaceContext();
  return useMutation({
    mutationFn: async (permissions: string[]) => {
      if (!currentWorkspace) return;

      // return { 'API key': 'dklfjlksdfds', 'App ID': 'ddfknld', permissions: ['for here'] };
      return $http
        .post(`/auth/create-api-key`, { organization_id: currentWorkspace.id, permissions })
        .then(res => res.data as { 'API key': string; 'App ID': string; permissions: string[] });
    },
  });
};

export default useApiKey;
