import { BuildingIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import SelectDropDown from '@/components/ui/select-dropdown';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

import { formatToNaira } from '@/lib/utils';

import { useGetRooms } from '@/domains/hotels/hooks/use-get-rooms';
import { Rooms as RoomType } from '@/domains/hotels/hooks/use-get-rooms';

interface IRoom extends RoomType {
  label: string;
}

export const RoomSelectorDropdown = ({
  onSelect,
  children,
  hotelId,
}: {
  onSelect: (room: RoomType) => void;
  children?: React.ReactNode;
  hotelId: string;
}) => {
  const [selectedRooms, setSelectedRooms] = useState<IRoom[]>([]);
  const { data: Rooms, isLoading } = useGetRooms(hotelId);

  if (isLoading)
    return (
      <div className="flex ">
        <Text weight={'medium'} variant={'secondary'} size={'xs'} className="block truncate py-3 hover:text-slate-600">
          Getting Rooms..
        </Text>
      </div>
    );
  if (!Rooms)
    return (
      <>
        <Text weight={'medium'} variant={'secondary'} size={'xs'} className="block truncate py-3 hover:text-slate-600">
          No Rooms Available
        </Text>
      </>
    );
  // Filter out rooms with no price
  const validRooms = Rooms.filter(room => room.current_price).map(room => ({
    name: room.name,
    label: `${room.name} - ${formatToNaira(room.current_price)}`,
    current_price: room.current_price,
  }));

  return (
    <SelectDropDown
      data={validRooms}
      placeholder={'Search Room Type'}
      selectedValues={selectedRooms}
      setSelectedValues={setSelectedRooms}
      onSelectItem={value => onSelect(value)}
      nameKey="label"
      idKey="current_price"
      asRadio
      isSingleSelect={true}
      withCheckbox={false}
      className="w-[26rem]"
    >
      {children ?? (
        <Button
          className="cursor-default border bg-transparent px-2 py-1 hover:bg-slate-100"
          variant="ghost"
          size="none"
        >
          <Text
            weight={'medium'}
            variant={'secondary'}
            size={'xs'}
            className="block truncate capitalize hover:text-slate-600"
          >
            {selectedRooms.length > 0 ? selectedRooms[0].name : <BuildingIcon />}
          </Text>
        </Button>
      )}
    </SelectDropDown>
  );
};
