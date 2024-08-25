import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import React from 'react';

import { DataTable } from '@/components/shared/data-table';
import SecondarySortPopover from '@/components/shared/secondary-sort-pop-over';
import { Text } from '@/components/ui/text';

import useTopTravellers from '../hooks/use-top-travellers';
import { columns } from '../static';
import { analyticsData } from '../types';
import { formatData } from '../util';

interface iTopTraveller {
  startDate: string;
  endDate: string;
}

const TopTravelers: React.FC<iTopTraveller> = ({ startDate, endDate }) => {
  const { data } = useTopTravellers({ startDate, endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd') });
  // const { data } = useTopTravellers({ startDate, endDate });

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="border-1 flex items-center justify-between border-b">
        <Text size={'sm'} className="font-bold">
          Top travelers
        </Text>
        <SecondarySortPopover />
      </div>

      {data && <DataTable columns={columns} data={formatData(data)} rowCount={data.length} />}
    </div>
  );
};

export default TopTravelers;
