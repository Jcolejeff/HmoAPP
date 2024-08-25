import { z } from 'zod';

export type RoleType = 'Manager' | 'Staff';
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  unique_id: string;
  is_active: boolean;
  date_created: Date;
  last_updated: Date;
  role: RoleType;
}
export type UserOrgs = {
  organization_id: number;
  role: {
    id: number;
    name: RoleType;
  };
}[];

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  created_by: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  role: RoleType;

  creator: User;
}

export type WorkspaceInviteStatus = 'accepted' | 'pending' | 'deleted' | 'rejected' | 'revoked';

export interface WorkspaceInvite {
  id: number;
  organization_id: number;
  token: string;
  inviter_id: number;
  reciever_email: string;
  reciever_id: number;
  status: WorkspaceInviteStatus;
  expires_at: Date;

  organization: Workspace;
}

export interface WorkspaceUser {
  id: number;
  organization_id: number;
  role: RoleType;
  user_id: number;
  user: Partial<User>;

  organization: Partial<Workspace>;
}

export interface Facility {
  id: number;
  name: string;
  organization_id: number;
  description: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;

  creator: User;
  organization: Workspace;
}
export interface Tag {
  created_at: Date;
  description: string | null;
  id: number;
  is_deleted: boolean;
  name: string;
  organization_id: number;
  updated_at: Date;
}
export interface FileObject {
  id: number;
  url: string;
  description: string;
  order: number;
  created_by: number;
}
export interface Asset {
  id: number;
  name: string;
  organization_id: number;
  facility_id: number;
  description: string;
  installed_quantity: number;
  serial_number?: string;
  country: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  spare_quantity: number;
  label: string;
  creator: User;
  added_tags: string[];
  removed_tags: string[];
  tags: Tag[];
  image_urls: string[];
  files: FileObject[];
}

export const issuePrioritySchema = z.enum(['high', 'moderate', 'low', 'no_priority']);
export const issueStatusSchema = z.enum(['todo', 'in_progress', 'ready_for_review', 'done', 'cancelled', 'invalid']);

export type IssuePriority = z.infer<typeof issuePrioritySchema>;
export type IssueStatus = z.infer<typeof issueStatusSchema>;

export interface IssueAssignee {
  id: number;
  team_id?: number;
  user_id?: number;
  assigned_by: number;
  is_primary: boolean;

  assigner: User;
  user?: User;
  team?: Team;
}

export interface ExtraInfo {
  id: number;
  table_name: string;
  record_id: number;
  key_data: string;
  value: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  organization_id: number;
  facility_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  creator: User;
  image_urls: string[];

  assignees?: WorkspaceUser[];
  teams?: Team[];
  assets: Asset[] | null;
  files: FileObject[];
  tags: Tag[];
  extra_infos?: ExtraInfo[];
}
export interface Request {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  organization_id: number;
  facility_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  creator: User;
  image_urls: string[];

  assignees?: WorkspaceUser[];
  teams?: Team[];
  assets: Asset[] | null;
  files: FileObject[];
  tags: Tag[];
  extra_infos?: ExtraInfo[];
}

export interface Team {
  id: number;
  name: string;
  unique_id: string;
  description: string;
  members?: User[];
}

// Testing purpose
export type MaintenanceSchedule = {
  id: number;
  name: string;
  activity: string;
  date: string;
};

export interface RoomType {
  id: number;
  name: string;
}
export interface State {
  id: number;
  name: string;
}
export interface Area {
  id: number;
  name: string;
}
export interface Hotel {
  id: number;
  name: string;
  location: Location[];
  room_types: RoomType[];
}

export interface ChipProps {
  type: 'user' | 'email';
  label: string;
  imageUrl?: string;
  onRemove?: () => void;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface iHook {
  users: User[] | null;
  loading: boolean;
  error: string | null;
}

export interface iOrganizationUser {
  name: string;
  slug: string;
  created_by: number;
  image_url: string | null;
  id: number;
  creator: {
    first_name: string;
    last_name: string;
    email: string;
    unique_id: string | null;
    date_created: string;
    last_updated: string;
    id: number;
    user_orgs: Array<{
      organization_id: number;
      role: {
        id: number;
        name: string;
      };
    }>;
    is_deleted: boolean;
  };
  created_at: string;
  updated_at: string;
}
export interface HotelFromIndexShape {
  business_name: string;
  categories: string[];
  city_facet: string[];
  contact_infos: ContactInfo[];
  country_facet: string[];
  default_currency_code: string;
  driving_instructions: string | null;
  extra_infos: ExtraInfoHotel[];
  facilities: Facilities;
  featured_reviews: any[]; // Assuming no structure for reviews is provided
  geo_location: [string, string];
  id: string;
  is_active: boolean;
  is_deleted: boolean;
  LGA_facet: string[];
  location_obj: LocationObject;
  locations: Location[];
  maxprice: number;
  minprice: number;
  organization_id: string;
  photos: string[];
  ranking5: number;
  ranking6: number;
  rating_avg: number;
  reviews_count: number;
  state_facet: string[];
  status: string;
  street_facet: string[];
  total_products: number;
  unique_id: string;
  unique_url_slug: string;
  url: string;
  user_id: string;
}

interface ContactInfo {
  association_id: string;
  biz_partner_id: string;
  contact_data: string;
  contact_info_id: string;
  contact_tag: string;
  contact_title: string;
  contact_type: string;
  description: string;
  id: string;
  is_deleted: boolean;
  is_primary: boolean;
  phone_country_code: string | 'NULL';
  unique_id: string;
}

interface ExtraInfoHotel {
  key: string;
  value: string;
}

interface Facilities {
  adequate_parking_space: boolean;
  bar_lounge: boolean;
  complimentary_breakfast: boolean;
  free_wifi: boolean;
  gym: boolean;
  restaurants: boolean;
}

interface LocationObject {
  LGA: string[];
  area: string[];
  city: string[];
  country: string[];
  state: string[];
  street: string[];
}

interface Location {
  city: string;
  coordinates: [string, string];
  country: string;
  state: string;
  street: string;
}
