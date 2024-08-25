'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LucidePlus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { SettingsBodyContainer } from '@/components/settings/body-container';
import PageWrapper from '@/components/shared/page-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import processError from '@/lib/error';
import { $http } from '@/lib/http';
import { workspaceKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';
import { useInvites } from '@/domains/user/hooks/use-invites';
import { useOrgInvites } from '@/domains/user/hooks/use-org-invites';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { useWorkspaceUsers } from '@/domains/workspace/hooks/use-workspace-users';

const InviteUserDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [commaSeparatedEmails, setCommaSeparatedEmails] = useState('');
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const sendInvite = () => {
    if (!currentWorkspace) return;

    $http
      .post(`/organizations/${currentWorkspace.id}/invites`, {
        emails: commaSeparatedEmails.split(',').map(email => email.trim()),
      })
      .then(data => {
        toast.success('Invites sent');
        queryClient.invalidateQueries({ queryKey: [currentWorkspace?.id, 'invites'] });
        queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
      })
      .catch(err => (err instanceof AxiosError ? processError(err) : console.error(err)));
    onClose();
    setCommaSeparatedEmails('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal={false}>
      <DialogContent className="min-w-[500px] p-4">
        <Text size={'lg'}>Invite user</Text>
        <Input
          id="email"
          name="email"
          type="email"
          value={commaSeparatedEmails}
          onChange={e => setCommaSeparatedEmails(e.target.value)}
          placeholder={'Enter email'}
          required
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" onClick={() => sendInvite()}>
            Send invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UsersTabContent = () => {
  const { data: users } = useWorkspaceUsers();

  return (
    <ul className="mt-4 space-y-2">
      {users &&
        users.map(user => {
          return (
            <li key={user.id} className="text-black">
              <Card className="w-2/4 rounded-none border-b border-l-0 border-r-0 border-t-0 px-0 shadow-none hover:cursor-pointer hover:bg-slate-50">
                <CardContent className="px-0 py-2">
                  <Text size={'sm'}>
                    {user.user.first_name} {user.user.last_name}
                  </Text>
                </CardContent>
              </Card>
            </li>
          );
        })}
    </ul>
  );
};

const InvitesTabContent = () => {
  const { data: invites } = useOrgInvites();

  return (
    <ul className="space-y-2">
      {invites &&
        invites.map(invite => {
          return (
            <li key={invite.id} className="text-black">
              <Card className="w-2/4 rounded-none border-b border-l-0 border-r-0 border-t-0 px-0 shadow-none hover:cursor-pointer hover:bg-slate-50">
                <CardContent className="flex items-center justify-between px-0 py-2">
                  <Text size={'sm'}>{invite.reciever_email}</Text>
                  <Button disabled variant={'outline'}>
                    Revoke
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
    </ul>
  );
};

const Page = () => {
  const { user } = useUserContext();
  const { currentWorkspace } = useWorkspaceContext();
  const [openInviteModal, setOpenInviteModal] = useState(false);

  return (
    <PageWrapper>
      <InviteUserDialog open={openInviteModal} onClose={() => setOpenInviteModal(false)} />

      <div className="mb-2 flex items-center justify-between">
        <div className="flex w-full justify-between">
          <h1 className="text-1xl font-bold">Manage Users</h1>
        </div>
      </div>
      <Tabs defaultValue="users">
        <TabsList className="flex items-center gap-2 border-b py-3">
          <TabsTrigger
            value="users"
            className="rounded-md px-4 py-2 text-sm hover:bg-neutral-100 aria-selected:bg-neutral-200"
          >
            Users
          </TabsTrigger>

          <TabsTrigger
            value="invites"
            className="rounded-md px-4 py-2 text-sm hover:bg-neutral-100 aria-selected:bg-neutral-200"
          >
            Invites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTabContent />
        </TabsContent>

        <TabsContent value="invites">
          <div className="flex w-full justify-end">
            {/* only show invite user button to org creator */}
            {user?.id === currentWorkspace?.created_by && (
              <Button variant={'ghost'} onClick={() => setOpenInviteModal(true)} className="flex gap-2 rounded border">
                <LucidePlus className="h-4 w-4 text-gray-200" />
                <Text className="text-xs">Invite user</Text>
              </Button>
            )}
          </div>
          <InvitesTabContent />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default Page;
