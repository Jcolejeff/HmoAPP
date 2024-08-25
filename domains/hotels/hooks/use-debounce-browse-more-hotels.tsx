import { useDebouncedCallback } from 'use-debounce';

import useBrowseMoreHotels, { UseBrowseMoreHotelsProps } from './use-browse-more-hotels';

export const useDebounceBrowseMoreHotels = (data: UseBrowseMoreHotelsProps, delay: number) => {
  const useBrowseMoreHotelQuery = useBrowseMoreHotels(data);

  const debouncedRefetch = useDebouncedCallback(() => {
    useBrowseMoreHotelQuery.refetch();
  }, delay);

  return {
    ...useBrowseMoreHotelQuery,
    debouncedRefetch,
  };
};
