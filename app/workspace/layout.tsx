'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useInvites } from '@/domains/user/hooks/use-invites';
import WorkspaceProvider, { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { workspaces, isLoading } = useWorkspaceContext();
  const { data: invites, isLoading: isInvitesLoading } = useInvites();
  const { user, isUserLoading } = useUserContext();

  useEffect(() => {
    if (window !== undefined && !user && !isUserLoading) {
      router.push('/auth/signin');
    }
  }, [user, isUserLoading, router]);

  //TODO: Fix flicker on /workspace route - Flick shows the org listing page before redirecting if necessary
  useEffect(() => {
    console.log({ workspaces, isLoading });
    if (workspaces && workspaces.length === 0 && isLoading === false) {
      console.log('got here');

      if (isInvitesLoading === false && invites && invites.length === 0) {
        console.log('bout to redirect');
        router.push('/workspace/create');
      }
    }
  }, [workspaces, isLoading, router, isInvitesLoading, invites]);

  if (!isUserLoading && user) {
    return (
      <section>
        <div>{children}</div>
      </section>
    );
  }

  return <></>;
}
