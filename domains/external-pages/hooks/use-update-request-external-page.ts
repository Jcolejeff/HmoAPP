import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { API_URL } from '@/lib/constants';

import { RequestStatus, RequestItemProps as Request } from '@/domains/requests/type';

export interface UpdateRequestPayload {
  id: string;
  organization_id: string;
  status: RequestStatus;
  rejection_reason: string | undefined;
  token: string;
}

export const useUpdateRequestExternalPage = () => {
  return useMutation({
    mutationFn: async (request: UpdateRequestPayload) => {
      return axios
        .put<Request>(
          `${API_URL}/requests/${request.id}`,
          {
            status: request.status,
            rejection_reason: request.rejection_reason,
            organization_id: request.organization_id,
          },
          {
            headers: {
              Authorization: `Bearer ${request.token}`,
            },
            withCredentials: true,
          },
        )
        .then(res => res.data);
    },

    onMutate: updatedRequest => {
      console.log('mutate', { updatedRequest });
    },
    onSuccess: (_, updatedRequest, ctx) => {
      console.log('updated', { updatedRequest });
    },

    onError: (err, updatedRequest, ctx) => {},
  });
};
