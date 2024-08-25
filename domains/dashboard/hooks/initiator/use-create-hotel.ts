import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { hotel } from '../../type/initiator';

export interface CreateHotel
  extends Partial<Omit<hotel, 'created_at' | 'last_updated' | 'date_created' | 'is_deleted' | 'id'>> {}

export const useCreateRequest = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (hotel: CreateHotel) => {
      return $http
        .post('/hotels', {
          ...hotel,
          organization_id: currentWorkspace?.id,
        })
        .then(res => res.data);
    },
    onMutate: hotel => {
      const queryKey = hotelKeys.list(workspaceId!.toString());
      const previousData = queryClient.getQueryData<Partial<hotel>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<hotel>[]>(queryKey, oldData => {
        const tempHotel: Partial<hotel> = {
          id: Math.random() * 100,
          ...hotel,
        };
        return oldData ? [tempHotel, ...oldData] : [tempHotel];
      });
      return previousData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKeys.list(workspaceId!.toString()) });
    },
    onError: (_, vars, ctx) => {
      queryClient.setQueryData<Partial<hotel>[]>(hotelKeys.list(workspaceId!.toString()), ctx);
    },
  });
};
