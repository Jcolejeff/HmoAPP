'use client';

import { ChevronLeft, Plus } from 'lucide-react';
import React from 'react';

import { DataTable } from '@/components/shared/data-table';
import PageWrapper from '@/components/shared/page-wrapper';
import { Button } from '@/components/ui/button';

import CreateHotelModal from '@/domains/hotels/components/create-hotel-modal';
import { columns } from '@/domains/hotels/components/table/columns';
import { useHotelContext } from '@/domains/hotels/context/hotel-context';
import useHotels from '@/domains/hotels/hooks/use-hotels';
import { useRouter } from '@/node_modules/next/navigation';

const Hotel = () => {
  const { open, onOpenChange } = useHotelContext();
  const { pagination, setPagination } = useHotelContext();
  const { data, isPending } = useHotels();
  const router = useRouter();

  return (
    <PageWrapper>
      <CreateHotelModal isOpen={open} title={'Add approved hotel'} onClose={() => onOpenChange(false)} />
      <section className="flex justify-between">
        <h1 className="text-1xl font-bold">Approved hotels</h1>

        <Button
          className="flex items-center space-x-1 rounded border bg-transparent p-2 hover:border-gray-300 hover:bg-gray-100"
          onClick={() => onOpenChange(true)}
        >
          <Plus color="gray" size={16} />
          <span className="text-xs text-gray-700">New Hotel</span>
        </Button>
      </section>
      <section className="table-section mt-4">
        {isPending ? (
          <div>Loading...</div>
        ) : (
          data && (
            <DataTable
              columns={columns}
              data={data.items}
              rowCount={data.total}
              pagination={pagination}
              setPagination={setPagination}
            />
          )
        )}
      </section>
    </PageWrapper>
  );
};

export default Hotel;
