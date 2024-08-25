import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosHeaders } from 'axios';
import { toast } from 'sonner';

import { useParams } from 'next/navigation';

import { $http } from '@/lib/http';
import { commentKeys } from '@/lib/react-query/query-keys';

import { FilePreview } from '@/domains/dashboard/components/request-details/comment-upload';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

type EntityName = 'comment' | 'request' | 'department';
type Payload = { entityName: EntityName; entityId: string; files: FilePreview[]; headers?: Record<string, any> };

export const useUploadFiles = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const workspaceId = currentWorkspace?.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ files, entityId, entityName, headers }: Payload) => {
      let formData = new FormData();
      let imageUrls = [];

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i].file, files[i].name);
        imageUrls.push(URL.createObjectURL(files[i].file));
      }

      formData.append('organization_id', workspaceId!.toString());
      formData.append('entity_name', entityName);
      formData.append('entity_id', entityId);
      return $http
        .post(`/files/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(headers ?? {}),
          },
        })
        .then(res => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(workspaceId!.toString()) });
    },
  });
};
