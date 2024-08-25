import { Dispatch, SetStateAction } from 'react';

import { WorkspaceUser } from '@/types';

export interface GridToggleProps {
  onListView: () => void;
  onGridView: () => void;
  state: boolean;
}

export interface gridListCard {
  department: string;
  admin: string;
  openRequests: number;
  coworkers: string[];
  onClick: (value: any) => void;
}

export interface iLabelValue {
  label: string;
  value: any;
}

export type TabsNames = 'create-department' | 'add-coworkers' | 'approval-policy';

export interface DepartmentInputProps {
  departmentNameLabel: string;
  textValue: string;
  setTextValue: (value: string) => void;
  placeHolder?: string;
}

export interface iRole {
  id: number;
  name: string;
}

export interface iUserOrg {
  organization_id: number;
  role: iRole;
}

export interface iCreator {
  first_name: string;
  last_name: string;
  email: string;
  unique_id: string | null;
  date_created: string;
  last_updated: string;
  id: number;
  user_orgs: iUserOrg[];
  is_deleted: boolean;
}

export interface iDepartment {
  organization_id: number;
  name: string;
  description: string;
  parent_group_id: number;
  approval_levels: number;
  id: string | number;
  created_by: number;
  date_created: string;
  last_updated: string;
  is_deleted: boolean;
  creator: iCreator;
  open_requests_count?: number;
  onClick: (value: any) => void;
}
