import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { $http } from '@/lib/http';
import { hotelKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { HotelFromIndexShape as HotelType } from '@/types';

import { useHotelContext } from '../context/hotel-context';

export type GetHotelsResponse = {
  total: number;
  items: HotelType[];
  next_page?: string;
  previous_page?: string;
  page: number;
  size: number;
};
export type UseBrowseMoreHotelsProps = {
  city?: string;
  state?: string;
  country?: string;
  size: number;
  facilities?: string;
  min_price?: number;
  max_price?: number;
  search_value?: string;
};

const useBrowseMoreHotels = ({
  city,
  state,
  country,
  size = 50,
  facilities,
  max_price,
  min_price,
  search_value,
}: UseBrowseMoreHotelsProps) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();

  const { pagination } = useHotelContext();
  const queryKey =
    !currentWorkspace || !user
      ? []
      : hotelKeys.list(
          currentWorkspace.id.toString(),
          'browse-more',
          user.id.toString(),
          city ?? '',
          state ?? '',
          facilities ?? '',
          min_price?.toString() ?? '',
          max_price?.toString() ?? '',
          search_value ?? '',
        );

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;
      return (
        await $http.get<GetHotelsResponse>(`/hotels/index`, {
          params: {
            organization_id: currentWorkspace.id,
            location: city ? city : state ? state : undefined,
            location_type: city ? 'city' : state ? 'state' : undefined,
            page: pagination.pageIndex,
            min_price,
            max_price,
            facilities,
            size,
            search_value,
          },
        })
      ).data.items;
    },
    enabled: !!currentWorkspace && !!user,
  });
};

export default useBrowseMoreHotels;
