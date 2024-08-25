import { Dispatch, SetStateAction } from 'react';

import { RoleType, User } from '@/types';

export interface TabData {
  key: string;
  label: string;
  count: number;
}

export interface hotel {
  organization_id: number;
  hotel_name: string;
  state: string;
  city: string;
  country: string;
  id: number;
  is_deleted: boolean;
  date_created: string;
  last_updated: string;
}

interface Role {
  id: number;
  name: RoleType;
}

interface UserOrg {
  organization_id: number;
  role: Role;
}

interface Creator {
  first_name: string;
  last_name: string;
  email: string;
  unique_id: string | null;
  date_created: string;
  last_updated: string;
  id: number;
  user_orgs: UserOrg[];
  is_deleted: boolean;
}

export interface CommentType {
  content: string;
  table_name: string;
  record_id: number;
  parent_id: number;
  organization_id: number;
  id: number;
  date_created: string;
  last_updated: string;
  creator: Creator;
  files: file[];
}
interface file {
  id: number;

  url: string;

  description: null | string;

  created_by: number;
}

export type modalType = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  createMore: boolean;
  setCreateMore: Dispatch<SetStateAction<boolean>>;
};

export type TabsNames = 'additional-notes' | 'travel-details' | 'hotel-details';

export type Location = {
  id: number;
  name: string;
};
