import { ChevronDown, Check } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

import { Text } from '../ui/text';

const sortOptions = ['A-Z', 'Z-A', 'Most Recent', 'Least Recent'];

const SecondarySortPopover: React.FC = () => {
  const [sortOption, setSortOption] = useState('A-Z');

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="flex items-center rounded-lg bg-transparent p-3 ps-0">
          <Text size={'xs'} className=" text-slate-500">
            Sort by
          </Text>
          <Text size={'xs'} className="ms-2">
            {sortOption}
          </Text>
          <ChevronDown size={'16'} color="black" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-8 rounded-md border bg-white p-2 shadow-md">
        <ul className="m-0 list-none p-0">
          {sortOptions.map(option => (
            <li
              key={option}
              className={`flex cursor-pointer items-center rounded-lg p-2 text-sm ${sortOption === option ? 'bg-gray-200' : ''}`}
              onClick={() => handleSortChange(option)}
            >
              {sortOption === option && <Check size={16} color="black" className="me-3" />}
              <Text size={'xs'}>{option}</Text>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default SecondarySortPopover;
