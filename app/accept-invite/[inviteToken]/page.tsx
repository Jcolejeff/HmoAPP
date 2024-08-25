'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { useInvite } from '@/domains/workspace/hooks/use-invite';

const Page = () => {
  const params = useParams<{ inviteToken: string }>();
  const { data: invite, isPending } = useInvite();

  console.log({ params: params.inviteToken, invite });

  if (!isPending && invite) {
    if (invite.reciever_id) {
      // user exists in the app
      window.location.href = `/auth/signin?email=${invite.reciever_email}&token=${invite.token}`;
    } else {
      // user exists in the app
      window.location.href = `/auth/signup?email=${invite.reciever_email}&token=${invite.token}`;
    }
  }
  return <div>Invalid invite</div>;
};

export default Page;
