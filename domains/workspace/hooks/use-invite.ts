import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';

import { WorkspaceInvite } from '@/types';

export const useInvite = () => {
  const { inviteToken } = useParams<{ inviteToken: string }>();

  return useQuery({
    queryKey: [inviteToken],
    queryFn: async () => {
      return (await $http.get<WorkspaceInvite>(`/organizations/invites/${inviteToken}`)).data;
    },
  });
};
