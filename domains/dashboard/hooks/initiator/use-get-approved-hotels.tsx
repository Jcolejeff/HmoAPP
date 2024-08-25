import { useQuery } from '@tanstack/react-query';
import { request } from 'http';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { hotel } from '../../type/initiator';

export interface GetApprovedHotels {
  page: number;
  size: number;
  previous_page: string | null;
  next_page: string | null;
  items: hotel[];
  total: number;
}

export const useGetApprovedHotels = (country: string, state: string, city: string, size = 50) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey = currentWorkspace
    ? user
      ? hotelKeys.list(currentWorkspace?.id!.toString(), 'approved-hotels', user.id.toString(), country, state, city)
      : hotelKeys.list(currentWorkspace.id.toString(), 'approved-hotels', country, state, city)
    : [''];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      return (
        await $http.get<GetApprovedHotels>(`/hotels`, {
          params: {
            organization_id: currentWorkspace.id,
            country: country ? country : undefined,
            state: state ? state : undefined,
            city: city ? (city === state ? undefined : city) : undefined,

            size,
          },
        })
      ).data.items;
    },
    enabled: !!currentWorkspace && !!user && !!country && !!state && !!city,
  });
};
