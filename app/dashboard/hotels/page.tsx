'use client';

import { ChevronLeft, Plus } from 'lucide-react';
import React from 'react';

import { DataTable } from '@/components/shared/data-table';
import GoBackButton from '@/components/shared/go-back-button';
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
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <GoBackButton />
      </div>

      <section>
        <CreateHotelModal isOpen={open} title={'Add approved hotel'} onClose={() => onOpenChange(false)} />
        <section className="flex justify-between">
          <h1 className="text-1xl font-bold">Approved Issues</h1>
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
      </section>
    </div>
  );
};

export default Hotel;
