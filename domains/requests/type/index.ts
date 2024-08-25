import { User } from '@/types';

export type RequestApprovals = {
  id: number;
  status: RequestStatus;
  request_id: number;
  position: number;
  approver_id: number;
  date_created: string;
  last_updated: string;

  approver: User;
};

export type RequestState = 'all' | 'pending' | 'approved' | 'rejected' | 'toToBeApproved';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'all';

export interface RequestItemProps {
  id: number;
  requester_id: number;
  purpose: string;
  state: string;
  city: string;
  country: string;
  hotel: string;
  room: string;
  start: string;
  end: string;
  rate: number;
  meal: string | null;
  transport: string | null;
  rejection_reason: string | null;
  other_requests: string | null;
  specialRequests: string[];
  status: RequestStatus;
  messages: number;
  date_created: string;
  last_updated: string;

  requester: User;
  request_approvals: RequestApprovals[];
}
