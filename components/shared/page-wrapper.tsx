import React from 'react';

import { useUserContext } from '@/domains/user/contexts/user-context';

import RoleGuard from './check-for-role-to-display-page';
import GoBackButton from './go-back-button';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentWorkspaceRole } = useUserContext();

  return (
    <RoleGuard role="Manager" isAllowed={currentWorkspaceRole === 'Manager'}>
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <GoBackButton />
        </div>

        <section>{children}</section>
      </div>
    </RoleGuard>
  );
};

export default PageWrapper;
