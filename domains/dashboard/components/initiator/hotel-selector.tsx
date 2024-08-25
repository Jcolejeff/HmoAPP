import { BuildingIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import SelectDropDown from '@/components/ui/select-dropdown';
import { Text } from '@/components/ui/text';

import { Hotel } from '@/types';

import { hotel } from '../../type/initiator';

// import {useRoomType} from '@/domains/room-type/hooks/use-room-type';

export const HotelSelectorDropdown = ({
  onSelect,
  children,
  hotels,
}: {
  onSelect: (hotel: hotel) => void;
  children?: React.ReactNode;
  hotels: hotel[];
}) => {
  const [selectedHotels, setSelectedHotels] = useState<hotel[]>([]);

  // if (!hotels) return <></>;

  return (
    <SelectDropDown
      data={hotels}
      placeholder={'Select Hotel'}
      selectedValues={selectedHotels}
      setSelectedValues={setSelectedHotels}
      onSelectItem={value => onSelect(value)}
      nameKey="hotel_name"
      idKey="id"
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
          <Text weight={'medium'} variant={'secondary'} size={'xs'} className="block truncate hover:text-slate-600">
            {selectedHotels.length > 0 ? selectedHotels[0].hotel_name : <BuildingIcon />}
          </Text>
        </Button>
      )}
    </SelectDropDown>
  );
};
