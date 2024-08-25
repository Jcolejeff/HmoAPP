import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { API_URL } from '@/lib/constants';
import { requestKeys } from '@/lib/react-query/query-keys';

import { RequestItemProps as Request } from '@/domains/requests/type';

export interface RequestPayload {
  id: string;
  token: string;
  organization_id: string;
}

export const useSingleRequestExternalPage = (data: RequestPayload) => {
  return useQuery({
    queryKey: requestKeys.detail(data.id.toString()),
    queryFn: async () => {
      return (
        await axios.get<Request>(`${API_URL}/requests/${data.id}`, {
          params: { organization_id: data.organization_id },
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        })
      ).data;
    },
    enabled: !!data.id && !!data.organization_id,
  });
};
