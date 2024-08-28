import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { ContentType } from '@/types';

import { useHotelContext } from '../context/hotel-context';

import { HotelType } from './create-hotel';

type GetResponse = {
  total: number;
  items: ContentType[];
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
        await $http.get<GetResponse>(`/closeds`, {
          params: {
            organization_id: currentWorkspace.id,
            page: pagination.pageIndex,

            size: 100,
          },
        })
      ).data;
    },
    enabled: !!currentWorkspace,
  });
};

export default useHotels;
