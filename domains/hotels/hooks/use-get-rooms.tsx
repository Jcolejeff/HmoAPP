import { useQuery } from '@tanstack/react-query';
import { request } from 'http';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export interface Rooms {
  name: string;
  current_price: number;
}

export const useGetRooms = (hotelId: string, size = 50) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey =
    !currentWorkspace || !user
      ? ['']
      : hotelKeys.list(currentWorkspace?.id!.toString(), 'get-hotel-rooms', hotelId, user.id.toString());

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      return (
        await $http.get<Rooms[]>(`/hotels/${hotelId}/rooms`, {
          params: {
            organization_id: currentWorkspace.id,

            size,
          },
        })
      ).data;
    },
    enabled: !!currentWorkspace && !!user && !!hotelId,
  });
};
