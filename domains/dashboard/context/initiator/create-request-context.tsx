import { useState, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react';

import { RequestItemProps } from '@/domains/requests/type';

import { CreateRequest } from '../../../requests/hooks/use-create-request';
import { TabsNames } from '../../type/initiator';

type CreateRequestContextType = {
  openHotelSideBar: boolean;
  setOpenHotelSideBar: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  createMore: boolean;
  setCreateMore: Dispatch<SetStateAction<boolean>>;
  showRequestDetail: boolean;
  setShowRequestDetail: Dispatch<SetStateAction<boolean>>;
  currentRequest: RequestItemProps | null;
  setCurrentRequest: Dispatch<SetStateAction<RequestItemProps | null>>;
  activeTab: TabsNames;
  setActiveTab: Dispatch<SetStateAction<TabsNames>>;
  createRequestData: CreateRequest;
  setCreateRequestData: Dispatch<SetStateAction<CreateRequest>>;
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
};
const CreateRequestContext = createContext({} as CreateRequestContextType);

export const useCreateRequestContext = () => {
  const ctx = useContext(CreateRequestContext);

  if (!ctx) {
    throw new Error('[useCreateRequest] must be used within a CreateRequestProvider');
  }

  return ctx;
};

const CreateRequestProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, isOpen] = useState(false);
  const [openHotelSideBar, setOpenHotelSideBar] = useState(false);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RequestItemProps | null>(null);
  const [createMore, setCreateMore] = useState(false);
  const [activeTab, setActiveTab] = useState<TabsNames>('travel-details');
  const [createRequestData, setCreateRequestData] = useState<CreateRequest>({} as CreateRequest);
  const [isEditMode, setIsEditMode] = useState(false);
  const value = {
    open,
    onOpenChange: isOpen,
    createMore,
    setCreateMore,
    openHotelSideBar,
    setOpenHotelSideBar,
    showRequestDetail,
    setShowRequestDetail,
    currentRequest,
    setCurrentRequest,
    activeTab,
    setActiveTab,
    createRequestData,
    setCreateRequestData,
    isEditMode,
    setIsEditMode,
  };

  useEffect(() => {
    // reset create request data when modal is closed
    if (!open) {
      setCreateRequestData({} as CreateRequest);
      setIsEditMode(false);
      setActiveTab('travel-details');
    }
  }, [open]);
  return <CreateRequestContext.Provider value={value}>{children}</CreateRequestContext.Provider>;
};

export default CreateRequestProvider;
