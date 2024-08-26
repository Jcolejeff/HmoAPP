import React from 'react';

import { RoleType } from '@/types';

import { Text } from '../ui/text';

import { Show } from './show-conditionally';

interface RoleGuardProps {
  role: RoleType;
  children: React.ReactNode;
  customFallback?: React.ReactNode;
  isAllowed: boolean;
}
const RoleGuard = ({ children, customFallback, isAllowed }: RoleGuardProps) => {
  return (
    <Show>
      <Show.When isTrue={isAllowed}>{children}</Show.When>
      <Show.Else>
        {customFallback ? (
          customFallback
        ) : (
          <div>
            <Text className="text-center">You are not allowed to view this page</Text>
          </div>
        )}
      </Show.Else>
    </Show>
  );
};

export default RoleGuard;
