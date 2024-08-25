import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type HotelContextType = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
};

const HotelContext = createContext({} as HotelContextType);

export const useHotelContext = () => {
  const ctx = useContext(HotelContext);

  if (!ctx) {
    throw new Error('[useHotelContext] must be used within a HotelContextProvider');
  }

  return ctx;
};

const HotelContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, isOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const value = {
    open,
    onOpenChange: isOpen,
    pagination,
    setPagination,
  };

  useEffect(() => {
    // reset create hotel data when modal is closed
    if (!open) {
    }
  }, [open]);

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};

export default HotelContextProvider;
