import { useState, useEffect } from 'react';

import { useRequests } from '@/domains/requests/hooks/use-requests';

import { TabData } from '../../dashboard/type/manager';

const useTabsData = ({ size = 10, page = 1 }: { size?: number; page?: number }) => {
  const [tabsData, setTabsData] = useState<TabData[]>([
    { key: 'allRequests', label: 'All Requests', count: 0 },
    { key: 'pendingRequests', label: 'Pending Requests', count: 0 },
    { key: 'approvedRequests', label: 'Approved Requests', count: 0 },
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: request,
    isLoading,
    isPending,
    isError,
  } = useRequests({
    approverId: 0,
    requesterId: 0,
    status: undefined,
    page,
    size,
  });

  useEffect(() => {
    if (!isLoading && request) {
      const data = {
        allRequests: request.total || 0,
        pendingRequests: 10,
        approvedRequests: 10,
      };

      setTabsData(prevTabs =>
        prevTabs.map(tab => ({
          ...tab,
          count: data[tab.key as keyof typeof data],
        })),
      );
      setLoading(false);
    }
  }, [isLoading, request]);

  const handleTabChange = (value: string) => {};

  return {
    tabsData,
    loading: isLoading || loading,
    handleTabChange,
    requests: request?.items || [],
  };
};

export default useTabsData;
