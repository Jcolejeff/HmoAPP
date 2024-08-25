import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';

import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import useCoworkers from '../hooks/use-coworkers';
import useTopDestinations from '../hooks/use-top-destinations';
import useTopHotels from '../hooks/use-top-hotels';
import useTopTravellers from '../hooks/use-top-travellers';
import { columns } from '../static';
import { analyticsData } from '../types';
import { formatData } from '../util';

interface iActivityTable {
  startDate: string;
  endDate: string;
}

type TabLabel = 'Top Travelers' | 'Top Destinations' | 'Top Hotels';

const ActivityTable: React.FC<iActivityTable> = ({ startDate, endDate }) => {
  const { data: TopTravellersData, isLoading: TopTravellersDataLoading } = useTopTravellers({
    startDate,
    endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
  });
  const { data: topDestinationsData, isLoading: topDestinationsDataLoading } = useTopDestinations({
    startDate,
    endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
  });
  const { data: hotelsData, isLoading: hotelsDataLoading } = useTopHotels({
    startDate,
    endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
  });
  // const { data: TopTravellersData, isLoading: TopTravellersDataLoading } = useTopTravellers({ startDate, endDate });
  // const { data: topDestinationsData, isLoading: topDestinationsDataLoading } = useTopDestinations({
  //   startDate,
  //   endDate,
  // });
  // const { data: hotelsData, isLoading: hotelsDataLoading } = useTopHotels({ startDate, endDate });

  const tableTabs: { label: TabLabel }[] = [
    { label: 'Top Destinations' },
    { label: 'Top Travelers' },
    { label: 'Top Hotels' },
  ];

  const [currentTab, setCurrentTab] = useState<TabLabel>('Top Destinations');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);

  // Static data for each tab
  const staticData: Record<TabLabel, { data: analyticsData[] | never; loadState: boolean }> = {
    'Top Travelers': {
      data: TopTravellersData || [],
      loadState: TopTravellersDataLoading,
    },
    'Top Destinations': {
      data: topDestinationsData || [],
      loadState: topDestinationsDataLoading,
    },
    'Top Hotels': {
      data: hotelsData || [],
      loadState: hotelsDataLoading,
    },
  };

  useEffect(() => {
    setIsLoading(staticData[currentTab].loadState);
    setData(staticData[currentTab].data);
  }, [currentTab, TopTravellersData, topDestinationsData, hotelsData]);

  return (
    <div>
      <div className="mb-3 mt-8 flex w-fit rounded-lg">
        {tableTabs.map((tab, index) => (
          <Button
            key={index}
            variant={'ghost'}
            className={`${tab.label === currentTab ? 'bg-black text-white' : ''} rounded-lg px-4 py-2`}
            onClick={() => setCurrentTab(tab.label)}
          >
            <Text size={'xs'} className={`${tab.label === currentTab ? 'text-white' : ''}`}>
              {tab.label}
            </Text>
          </Button>
        ))}
      </div>
      <div className="mb-8 rounded-lg border border-gray-300 bg-white p-4">
        {isLoading ? (
          <div className="py-4 text-center">Loading...</div>
        ) : data.length === 0 ? (
          <div className="py-4 text-center">No data available</div>
        ) : (
          <DataTable columns={columns} data={formatData(data)} rowCount={data.length} />
        )}
      </div>
    </div>
  );
};

export default ActivityTable;
