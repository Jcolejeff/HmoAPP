import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { Asset } from '@/types';

export const useUploadImage = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const workspaceId = currentWorkspace?.id;
  const { assetId } = useParams();

  return useMutation({
    mutationFn: (formData: FormData) => {
      formData.append('organization_id', workspaceId!.toString());

      return $http
        .post(`/files/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => res.data);
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: assetKeys.list(workspaceId!.toString()) });
      // queryClient.invalidateQueries({ queryKey: assetKeys.detail(assetId.toString()) });
    },
  });
};
