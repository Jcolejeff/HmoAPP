import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export interface HotelType {
  id: number;
  hotel_name: string;
  country: string;
  state: string;
  city?: string;
  image?: string;
}

type CreateHotelType = Omit<HotelType, 'id'>;

export const useCreateHotel = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: async (hotel: CreateHotelType) => {
      return $http
        .post('/hotels', {
          ...hotel,
          organization_id: currentWorkspace?.id,
        })
        .then(res => res.data);
    },
    onMutate: (hotel: CreateHotelType) => {
      const queryKey = hotelKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<HotelType[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<HotelType[]>(queryKey, previousData => {
        const tempHotel: HotelType = {
          id: Math.random() * 100,
          ...hotel,
        };
        return previousData ? [tempHotel, ...previousData] : [tempHotel];
      });
      return previousData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKeys.list(workspaceId!.toString()) });
    },
    onError: (_, vars, ctx) => {
      queryClient.setQueryData<HotelType[]>(hotelKeys.list(workspaceId!.toString()), ctx);
    },
  });
};
