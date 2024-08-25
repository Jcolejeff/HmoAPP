import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';

import { $http } from '@/lib/http';

import { RoleType, User, UserOrgs } from '@/types';

type UserContextType = {
  user: User | undefined;
  isUserLoading: boolean;
  userOrgs: UserOrgs;
  setUserOrgs: React.Dispatch<React.SetStateAction<UserOrgs>>;
  currentWorkspaceRole: RoleType;
  setCurrentWorkspaceRole: React.Dispatch<React.SetStateAction<RoleType>>;
};

const UserContext = createContext({} as UserContextType);

export const useUserContext = () => {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error('[useUserContext] must be used within a UserProvider');
  }

  return ctx;
};
const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => (await $http.get<User>('/user')).data,
  });
};
// migrate user request to react-query
const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = useCurrentUser();
  const [userOrgs, setUserOrgs] = useState<UserOrgs>([]);
  const [currentWorkspaceRole, setCurrentWorkspaceRole] = useState<RoleType>('Staff');

  return (
    <UserContext.Provider
      value={{
        user: data,
        isUserLoading: isPending,
        setUserOrgs,
        userOrgs,
        setCurrentWorkspaceRole,
        currentWorkspaceRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
