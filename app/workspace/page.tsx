'use client';

import { ArrowRightIcon, PlusIcon, X } from 'lucide-react';
import React, { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useInvites } from '@/domains/user/hooks/use-invites';
import { useUpdateInvite } from '@/domains/user/hooks/use-update-invite';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

const ListOrganizations = () => {
  const router = useRouter();
  const { workspaces } = useWorkspaceContext();
  const { data: invites, refetch: refetchInvites } = useInvites();
  const { mutate: updateInvite, isPending } = useUpdateInvite();

  console.log('invites', invites);

  return (
    <section className="m-auto flex h-screen w-fit flex-col justify-center px-6 py-12 sm:max-w-[52rem] md:min-w-[40rem] lg:px-12">
      <div>
        <Text
          size={'2xl'}
          weight={'bold'}
          as={'h2'}
          className="mb-4 text-center leading-9 tracking-tight text-gray-900"
        >
          Choose an organization
        </Text>
        <Text className="text-center text-gray-400">Select an organization to continue</Text>

        <div className="mt-8 flex items-center justify-center gap-1 rounded-md border border-green-200 bg-[#f7fcf9] p-4">
          <span className="rounded-lg text-primary">
            <PlusIcon className="h-4 w-4" />
          </span>
          <Link
            className="flex items-center text-primary hover:cursor-pointer hover:underline"
            href={'/workspace/create'}
          >
            Create a new workspace
          </Link>{' '}
        </div>
      </div>
      <div className="my-5 flex items-center justify-between gap-4">
        <hr className="w-full" />
        <Text className="text-gray-400">Or</Text>
        <hr className="w-full" />
      </div>
      {/* <h2 className="mt-4 text-lg font-bold leading-9 tracking-tight text-gray-900">Existing Organisations</h2> */}
      <section className="grid gap-x-4 gap-y-8 py-4 sm:w-full">
        {workspaces && workspaces.length > 0 ? (
          workspaces.map(workspace => {
            return (
              <div key={crypto.randomUUID()} className="group flex flex-col gap-2">
                <Link
                  className="flex w-full  items-center justify-between border-b border-b-gray-200 py-4 hover:cursor-pointer"
                  href={'/dashboard'}
                  onClick={() => {
                    sessionStorage.setItem('currentWorkspace', JSON.stringify(workspace));
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span> {workspace.name}</span>
                    {/* <span className="text-sm font-light text-gray-400">Your next best managing system</span> */}
                  </div>
                  <span className="flex items-center gap-2 transition duration-300 group-hover:text-primary group-hover:underline">
                    <p>Continue</p>
                    <div className="w-full rounded-full border border-black p-2 group-hover:border-primary-2">
                      <ArrowRightIcon size={'14'} className="" />
                    </div>
                  </span>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">You have no existing workspaces.</p>
        )}
      </section>

      {/* Reminder: Handle UI for invites */}
      <hr className="w-full" />

      <section className="grid gap-x-4 gap-y-8 py-4 sm:w-full">
        {invites &&
          invites.map(invite => {
            console.log('token', invite.token);
            return (
              <div key={crypto.randomUUID()} className="flex flex-col gap-2">
                <section className="flex w-full items-center justify-between gap-2 border-b border-b-gray-50 py-4 font-bold shadow-sm hover:cursor-pointer">
                  <span> {invite?.organization?.name}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      disabled={isPending}
                      onClick={() =>
                        updateInvite(
                          { status: 'accepted', invite_token: invite.token },
                          {
                            onSuccess: () => {
                              refetchInvites();
                            },
                          },
                        )
                      }
                      variant={'default'}
                      className="flex items-center gap-2 transition duration-300 hover:text-primary hover:underline"
                    >
                      <Text className="text-primary-3">Accept</Text>
                      <ArrowRightIcon width={15} className="" />
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() =>
                        updateInvite(
                          { status: 'rejected', invite_token: invite.token },
                          {
                            onSuccess: () => {
                              refetchInvites();
                            },
                          },
                        )
                      }
                      variant={'outline'}
                      className="flex items-center gap-2 transition duration-300 hover:text-primary hover:underline"
                    >
                      <Text>Reject</Text>
                      <X width={15} className="" />
                    </Button>
                  </div>
                </section>
              </div>
            );
          })}
      </section>
    </section>
  );
};

export default ListOrganizations;
