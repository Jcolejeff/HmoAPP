'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { $http } from '@/lib/http';
import { workspaceKeys } from '@/lib/react-query/query-keys';

import { RoleType, Workspace } from '@/types';

import { useUserContext } from '../../user/contexts/user-context';

interface IWorkspacesRequest {
  page: number;
  size: number;
  total: number;
  items: Workspace[];
  previous_page: string | null;
  next_page: string | null;
}

type WorkspaceContextType = {
  currentWorkspace: Workspace | undefined;
  switchWorkspace: (workspace: Workspace) => void;

  workspaces: Workspace[] | undefined;
  isLoading: boolean;
};

const WorkspaceContext = createContext({} as WorkspaceContextType);

export const useWorkspaceContext = () => {
  const ctx = useContext(WorkspaceContext);

  if (!ctx) {
    throw new Error('[useWorkspaceContext] must be used within a WorkspaceProvider');
  }

  return ctx;
};

const useUserWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: async () => {
      return (await $http.get<IWorkspacesRequest>('/organizations')).data;
    },
  });
};

// migrate user request to react-query
const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = useUserWorkspaces();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>();
  const router = useRouter();

  const switchWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    sessionStorage.setItem('currentWorkspace', JSON.stringify(workspace));
  };

  useEffect(() => {
    const currWorkspaceInSessionStorage = sessionStorage.getItem('currentWorkspace');
    console.log({ currWorkspaceInSessionStorage });
    if (currWorkspaceInSessionStorage) {
      setCurrentWorkspace(JSON.parse(currWorkspaceInSessionStorage) as Workspace);
    } else {
      // router.push('/workspace');
      // need to move this layout to the groups
    }
  }, [router]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces: data?.items,
        currentWorkspace,
        switchWorkspace,
        isLoading: isPending,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider;
