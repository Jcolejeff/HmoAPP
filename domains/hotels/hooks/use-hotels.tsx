import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { useHotelContext } from '../context/hotel-context';

import { HotelType } from './create-hotel';

type GetHotelsResponse = {
  total: number;
  items: HotelType[];
  next_page?: string;
  previous_page?: string;
  page: number;
  size: number;
};

const useHotels = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { pagination } = useHotelContext();
  const queryKey = !currentWorkspace
    ? []
    : hotelKeys.list(currentWorkspace.id.toString(), pagination.pageIndex.toString(), pagination.pageSize.toString());

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!currentWorkspace) return;
      return (
        await $http.get<GetHotelsResponse>(`/hotels`, {
          params: {
            organization_id: currentWorkspace.id,
            page: pagination.pageIndex,

            size: pagination.pageSize,
          },
        })
      ).data;
    },
    enabled: !!currentWorkspace,
  });
};

export default useHotels;
