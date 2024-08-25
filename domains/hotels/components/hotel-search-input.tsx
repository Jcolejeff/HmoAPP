import React, { useState } from 'react';

import { Show } from '@/components/shared/show-conditionally';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner';

import { HotelFromIndexShape } from '@/types';

import { useDebounceBrowseMoreHotels } from '../hooks/use-debounce-browse-more-hotels';

export interface HotelSearchProps {
  selectedHotel: HotelFromIndexShape | null;
  setSelectedHotel: (hotel: HotelFromIndexShape) => void;
  children: React.ReactNode;
}

const HotelSearch: React.FC<HotelSearchProps> = ({ setSelectedHotel, children }) => {
  const [textValue, setTextValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const { data: hotelList, isLoading } = useDebounceBrowseMoreHotels(
    {
      search_value: textValue,
      size: 50,
    },
    1500,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim()) {
      setTextValue(value);
    } else {
      setTextValue(''); // Reset the input
    }
  };

  const handleSuggestionClick = (suggestion: HotelFromIndexShape) => {
    setTextValue(suggestion.business_name);
    setSelectedHotel(suggestion);

    setOpen(false);
  };

  return (
    <div className="">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>

        <PopoverContent className="w-[25rem] p-0">
          <Command shouldFilter={false}>
            <div>
              <Input
                name="hotelSearch"
                value={textValue}
                onChange={handleInputChange}
                placeholder="Type a hotel name or location"
                className=" my-2 flex w-full  border-b border-t-0 bg-primary-4 bg-transparent py-3 text-sm text-text outline-none placeholder:text-xs focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Show>
              <Show.When isTrue={isLoading}>
                <CommandList>
                  <CommandEmpty>
                    {/* <Spinner /> */}
                    <div className="animate-bounce"> Getting Hotels...</div>
                  </CommandEmpty>
                </CommandList>
              </Show.When>
              <Show.When isTrue={hotelList?.length === 0}>
                <CommandList>
                  <CommandEmpty>No hotels found.</CommandEmpty>
                </CommandList>
              </Show.When>
              <Show.When isTrue={hotelList && hotelList?.length > 0 ? true : false}>
                <CommandList>
                  <CommandEmpty>No hotels found.</CommandEmpty>
                  <CommandGroup>
                    {hotelList &&
                      hotelList.map((item, index) => (
                        <CommandItem key={index} onSelect={() => handleSuggestionClick(item)}>
                          {item.business_name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Show.When>
            </Show>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HotelSearch;
