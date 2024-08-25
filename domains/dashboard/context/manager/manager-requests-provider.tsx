import { useState, createContext, useContext, Dispatch, SetStateAction } from 'react';

import { RequestItemProps } from '@/domains/requests/type';

import { contextType } from '../../type/manager';

const ManagerRequestContext = createContext({} as contextType);

export const useManagerRequestContext = () => {
  const ctx = useContext(ManagerRequestContext);

  if (!ctx) {
    throw new Error('[useCreateRequest] must be used within a RejectRequewstProvider');
  }

  return ctx;
};

const ManagerRequestProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTravelRequestInfoPanelOpen, setIsTravelRequestInfoPanelOpen] = useState(false);
  const [selectedManagerRequest, setSelectedManagerRequest] = useState<RequestItemProps | null>(null);

  const value = {
    isOpen,
    onOpenChange: setIsOpen,
    isTravelRequestInfoPanelOpen,
    setIsTravelRequestInfoPanelOpen,
    selectedManagerRequest,
    setSelectedManagerRequest,
  };

  return <ManagerRequestContext.Provider value={value}>{children}</ManagerRequestContext.Provider>;
};

export default ManagerRequestProvider;
