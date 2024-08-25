import { Dispatch, SetStateAction } from 'react';

import { RequestItemProps } from '@/domains/requests/type';

export interface TabData {
  key: string;
  label: string;
  count: number | undefined;
}

export type contextType = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isTravelRequestInfoPanelOpen: boolean;
  setIsTravelRequestInfoPanelOpen: Dispatch<SetStateAction<boolean>>;
  selectedManagerRequest: RequestItemProps | null;
  setSelectedManagerRequest: Dispatch<SetStateAction<RequestItemProps | null>>;
};

export interface TravelRequestDetailProps {
  name: string;
  department: string;
  location: string;
  startDate: string;
  endDate: string;
  travelPurpose: string;
  hotel: string;
  roomType: string;
  mealBudget: string;
  transportNeeds: string;
  status: string;
  createdDate: string;
}
