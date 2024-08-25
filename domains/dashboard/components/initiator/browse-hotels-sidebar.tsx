import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { Barcode, Map, MapPin, QrCode, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputRange from 'react-input-range';
import { toast } from 'sonner';

import ContentLoader from '@/components/shared/content-loading-screen';
import EmptyContentWrapper from '@/components/shared/empty-content-wrapper';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

import { IMAGE_URL } from '@/lib/constants';
import Icon from '@/lib/icons';
import { formatToNaira } from '@/lib/utils';

import { useDebounceBrowseMoreHotels } from '@/domains/hotels/hooks/use-debounce-browse-more-hotels';
import { State, Area } from '@/types';

import 'react-input-range/lib/css/index.css';

import { useCreateRequestContext } from '../../context/initiator/create-request-context';

import { AreaSelectorDropdown } from './area-selector';
import HotelCard from './hotel-card';
import { StateSelectorDropdown } from './state-selector';

interface filterOptions {
  id: string;
  label: string;
}
const items: filterOptions[] = [
  { id: 'air_conditioning', label: 'Air Conditioning' },
  { id: 'bar/lounge', label: 'Bar/Lounge' },
  { id: '24_electricity', label: '24 Electricity' },
  { id: 'swimming_pool', label: 'Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'adequate_parking', label: 'Adequate Parking' },
  { id: 'clothing_iron', label: 'Clothing Iron' },
  { id: 'continental_breakfast', label: 'Continental Breakfast' },
  { id: 'desk', label: 'Desk' },
  { id: 'dry_cleaning', label: 'Dry Cleaning' },
  { id: 'dstv', label: 'Dstv' },
  { id: 'electronic_room_keys', label: 'Electronic Room Keys' },
  { id: 'elevator/lift', label: 'Elevator/Lift' },
  { id: 'fitness_facilities', label: 'Fitness Facilities' },
  { id: 'flatscreen_tv', label: 'Flatscreen Tv' },
  { id: 'house_keeping', label: 'House Keeping' },
  { id: 'non_smoking_rooms', label: 'Non Smoking Rooms' },
  { id: 'refrigerator', label: 'Refrigerator' },
  { id: 'room_service', label: 'Room Service' },
  { id: 'security_guard', label: 'Security Guard' },
  { id: 'television', label: 'Television' },
  { id: 'toiletries', label: 'Toiletries' },
  { id: 'wireless_internet', label: 'Wireless Internet' },
  { id: 'free_wifi', label: 'Free Wifi' },
  { id: 'airport_transportation', label: 'Airport Transportation' },
];

type HotelListProps = {
  city: string | null;
  state: string | null;
  country: string | null;
  setSelectedHotelFromSidebar: (hotel: { name: string; id: string | number }) => void;
};
const BrowseHotelSidebar = ({ city, state, country, setSelectedHotelFromSidebar }: HotelListProps) => {
  const [selectedItems, setSelectedItems] = useState([] as string[]);
  const [minMaxValue, setMinMaxValue] = useState({ min: 5000, max: 1000000 });

  // had to do this temp abuja fix because the state was returning 'Federal Capital Territory' instead of 'Abuja' from google maps
  const {
    data: hotels,
    isLoading,
    debouncedRefetch,
    isPending,
    isError,
  } = useDebounceBrowseMoreHotels(
    {
      state: state ? (state === 'Federal Capital Territory' ? 'Abuja' : state) : undefined,
      max_price: minMaxValue.max,
      min_price: minMaxValue.min,
      facilities: selectedItems.length > 0 ? selectedItems.join(',') : undefined,
      size: 50,
    },
    1000,
  );

  const { openHotelSideBar, setOpenHotelSideBar } = useCreateRequestContext();

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prevItems =>
      prevItems.includes(itemId) ? prevItems.filter(id => id !== itemId) : [...prevItems, itemId],
    );
  };

  return (
    <>
      {createPortal(
        <div
          className={`portal-selector fixed z-[1000] h-full ${
            openHotelSideBar ? `translate-x-0` : `!translate-x-[100vw]`
          } bottom-0 right-0  top-0 z-[200] flex w-[21vw] flex-col overflow-auto bg-white  px-4 py-6 transition-transform duration-300 ease-in-out`}
        >
          <div className="relative flex w-full items-center justify-between    ">
            <Text weight={'bold'} className="" size={'default'}>
              Browse more Hotels
            </Text>
            <svg
              onClick={() => {
                setOpenHotelSideBar(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 29 29"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x text-text-dim"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <section className="my-4  border-b border-t  py-2 pb-4">
            <article className="my-4 rounded-md bg-slate-100 pb-4 pt-6">
              <div className="mb-3 flex items-center gap-2 px-2">
                <Icon name="PriceIcon" />
                <Text weight={'bold'} className="uppercase" size={'xs'}>
                  Price budget:
                </Text>
              </div>
              <div className="mx-2    rounded-md bg-slate-200 px-8 py-4 pt-8">
                <InputRange
                  step={5000}
                  maxValue={1000000}
                  minValue={5000}
                  formatLabel={value => `${formatToNaira(value)}`}
                  value={minMaxValue}
                  onChange={value => setMinMaxValue(value as any)}
                  onChangeComplete={value => console.log(value)}
                />
              </div>
            </article>

            <article>
              <Label htmlFor="" className="first-letter: mb-3 block whitespace-nowrap ">
                Show only hotels with
              </Label>
              <div className="stats-display flex gap-3  overflow-scroll">
                {items.map(item => (
                  <div key={item.id} className=" flex items-center  gap-3  border p-2 px-3">
                    <Checkbox
                      id={item.id}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <Label
                      htmlFor={item.id}
                      className="whitespace-nowrap text-xs leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <div className="mt-4">
            <ContentLoader isLoading={isLoading} numberOfBlocks={1} className="flex w-full ">
              <EmptyContentWrapper
                customMessage="No hotels found in this location."
                className="mt-6 h-full rounded-md py-16 text-text-dim"
                isEmpty={hotels?.length === 0 || !hotels}
              >
                <article className="">
                  <div className="flex items-center justify-between">
                    <Text className="text-sm ">
                      Hotels in {city}, {state}, {country}:
                    </Text>
                  </div>

                  {hotels?.map((hotel, index) => {
                    return (
                      <HotelCard
                        setSelectedHotelFromSidebar={setSelectedHotelFromSidebar}
                        key={index}
                        direction={hotel.locations[0].city}
                        title={hotel.business_name ?? ''}
                        location={hotel.locations[0].street}
                        price={hotel.minprice}
                        discount={258988}
                        img={hotel?.photos[0] ? `${IMAGE_URL}${hotel.photos[0]}` : '/images/dashboard/hotel.png'}
                        rating={hotel.rating_avg}
                        ratingCount={hotel.reviews_count}
                        id={hotel.id}
                      ></HotelCard>
                    );
                  })}
                </article>
              </EmptyContentWrapper>
            </ContentLoader>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default BrowseHotelSidebar;
