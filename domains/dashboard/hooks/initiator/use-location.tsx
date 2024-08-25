import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { locationKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { Location } from '../../type/initiator';

export interface GetLocations {
  page: number;
  size: number;
  previous_page: string | null;
  next_page: string | null;
  items: Location[];
  total: number;
}
const locations: Location[] = [
  { id: 1, name: 'Lagos B' },
  { id: 2, name: 'Abuja' },
  { id: 3, name: 'Jos B' },
  { id: 4, name: 'Kwara' },
  { id: 5, name: 'Edo' },
];

export const useSearchLocation = (searchValue: string, size = 20) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user } = useUserContext();
  const queryKey = currentWorkspace
    ? user
      ? locationKeys.list(currentWorkspace?.id!.toString(), user.id.toString(), searchValue)
      : locationKeys.list(currentWorkspace.id.toString(), searchValue)
    : [''];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!currentWorkspace || !user) return;

      // Commented out the actual HTTP request
      // return (
      //   await $http.get<GetLocations>('/locations', {
      //     params: {
      //       organization_id: currentWorkspace.id,
      //       search: searchValue,
      //       size,
      //     },
      //   })
      // ).data.items;

      // Returning dummy locations array
      return locations.filter(location => location.name.toLowerCase().includes(searchValue.toLowerCase()));
    },
    enabled: !!currentWorkspace && !!user,
  });
};
