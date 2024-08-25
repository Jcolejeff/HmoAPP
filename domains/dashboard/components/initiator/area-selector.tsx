import { BuildingIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import SelectDropDown from '@/components/ui/select-dropdown';
import { Text } from '@/components/ui/text';

import { Area } from '@/types';

// import {useRoomType} from '@/domains/room-type/hooks/use-room-type';

const Areas = [
  { id: 1, name: 'Lagos' },
  { id: 2, name: 'Jos' },
  { id: 3, name: 'Abuja' },
  { id: 4, name: 'Kogi' },
  { id: 5, name: 'Sokoto' },
];

export const AreaSelectorDropdown = ({
  onSelect,
  children,
}: {
  onSelect: (Area: Area) => void;
  children?: React.ReactNode;
}) => {
  const [selectedArea, setSelectedArea] = useState<Area[]>([]);

  if (!Areas) return <></>;

  return (
    <SelectDropDown
      data={Areas}
      placeholder={'Pick Area'}
      selectedValues={selectedArea}
      setSelectedValues={setSelectedArea}
      onSelectItem={value => onSelect(value)}
      nameKey="name"
      idKey="id"
      asRadio
      isSingleSelect={true}
      withCheckbox={false}
      className="z-[1000] w-48"
    >
      {children ?? (
        <Button
          className="cursor-default border bg-transparent px-2 py-1 hover:bg-slate-100"
          variant="ghost"
          size="none"
        >
          <Text weight={'medium'} variant={'secondary'} size={'xs'} className="block truncate hover:text-slate-600">
            {selectedArea.length > 0 ? selectedArea[0].name : <BuildingIcon />}
          </Text>
        </Button>
      )}
    </SelectDropDown>
  );
};
