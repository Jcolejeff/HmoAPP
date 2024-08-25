'use client';

import { useEffect } from 'react';

import { cookies } from 'next/headers';

import { $http, addAccessTokenToHttpInstance } from '@/lib/http';

import UserProvider from '@/domains/user/contexts/user-context';
import WorkspaceProvider from '@/domains/workspace/contexts/workspace-context';
import { User } from '@/types';

import './globals.css';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </UserProvider>
  );
};
export default function RootClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if (window !== undefined) {
      addAccessTokenToHttpInstance(localStorage.getItem('access_token') as string);

      /**
       * Refreshes an access token with the refresh token in the cookies.
       * This would throw an error if the request is made without the refresh token
       * @returns
       */
      const refreshAccessToken = async () => {
        return $http
          .get<{ user: User; access_token: string; expires_in: number }>('/auth/refresh-access-token')
          .then(data => {
            localStorage.setItem('access_token', data.data.access_token);
            return data.data;
          })
          .catch(err => Promise.reject(err));
      };
      refreshAccessToken().then(data => {
        // refresh access token at 1000ms (1s) before it expires
        setInterval(
          () => {
            refreshAccessToken();
          },
          data.expires_in * 1000 - 1000,
        );
      });
    }
  }, []);
  return <Providers>{children}</Providers>;
}
