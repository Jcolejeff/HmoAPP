import { BuildingIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import SelectDropDown from '@/components/ui/select-dropdown';
import { Text } from '@/components/ui/text';

import { State } from '@/types';

// import {useRoomType} from '@/domains/room-type/hooks/use-room-type';

const States = [
  { id: 1, name: 'Lagos' },
  { id: 2, name: 'Jos' },
  { id: 3, name: 'Abuja' },
  { id: 4, name: 'Kogi' },
  { id: 5, name: 'Sokoto' },
];

export const StateSelectorDropdown = ({
  onSelect,
  children,
}: {
  onSelect: (state: State) => void;
  children?: React.ReactNode;
}) => {
  const [selectedState, setSelectedState] = useState<State[]>([]);

  if (!States) return <></>;

  return (
    <SelectDropDown
      data={States}
      placeholder={'Pick State'}
      selectedValues={selectedState}
      setSelectedValues={setSelectedState}
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
            {selectedState.length > 0 ? selectedState[0].name : <BuildingIcon />}
          </Text>
        </Button>
      )}
    </SelectDropDown>
  );
};
