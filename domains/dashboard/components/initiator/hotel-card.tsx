import React from 'react';

import Image from 'next/image';

import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
// Adjust the imports according to the actual library
import { Text } from '@/components/ui/text';

import Icon from '@/lib/icons';
import { formatToNaira, url } from '@/lib/utils';

import { useCreateRequestContext } from '../../context/initiator/create-request-context';

interface HotelCardProps {
  id: string;
  img: string;
  price: number;
  discount: number;
  title: string;
  link?: string;
  location: string;
  direction?: string;
  rating?: string | number;
  ratingCount?: string | number;
  setSelectedHotelFromSidebar: (hotel: { name: string; id: string | number }) => void;
}

const HotelCard = ({
  img,
  location,
  price,
  title,
  link,
  direction,
  ratingCount,
  rating,
  discount,
  id,
  setSelectedHotelFromSidebar,
}: HotelCardProps) => {
  const { setOpenHotelSideBar, openHotelSideBar } = useCreateRequestContext();
  return (
    <Card
      onClick={() => {
        setSelectedHotelFromSidebar({
          name: title,
          id,
        });
        setOpenHotelSideBar(!openHotelSideBar);
      }}
      className="group my-6 flex h-max w-full cursor-pointer flex-col justify-between rounded-[0.5rem] shadow-lg"
    >
      <div className="relative mb-[1rem] w-full overflow-hidden rounded-t-[0.5rem] transition-all duration-300 ease-in-out hover:after:bg-black/80">
        <Image
          src={url(img ? img : '/images/landing-page/businessImage.png')}
          className="h-full max-h-[11rem] w-full bg-cover bg-top object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          alt="business"
          width={500}
          height={300}
        />
        <div className="absolute left-0 top-0 h-full w-full  bg-black/20 "></div>
        <div className="absolute left-[3%] top-[6%] rounded-full  bg-white  px-3 py-[0.1rem]">
          <Text className="text-[0.7rem] font-bold leading-[1.3125rem] tracking-[0.00625rem] ">{direction}</Text>
        </div>
        <div className="absolute bottom-[5%] right-[5%]">
          {/* <Text className="text-right text-[0.8rem] font-[400] leading-[1.3125rem]  tracking-[0.00625rem] text-white line-through">
            {formatToNaira(discount)}
          </Text> */}
          <Text className="text-right text-base font-[700] leading-[1.3125rem] tracking-[0.00625rem] text-secondary-3">
            {formatToNaira(price)}
          </Text>
          <Text className="text-right text-[0.775rem] font-[300] leading-[1.3125rem] tracking-[0.00625rem] text-white">
            avg/night
          </Text>
        </div>
      </div>
      <CardContent className=" px-3 pb-4">
        <div className="flex w-full items-center justify-between">
          <Text as="p" className="xxl:text-lg text-[0.875rem] font-[700] leading-[1.3125rem] tracking-[0.00625rem]">
            {title}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="RedStar" />
          <Text as="p" className="  text-[0.8125rem] text-xs font-[700] leading-[1.375rem] tracking-[0.00625rem]">
            {rating} - Very Good <span className="text-[0.6rem] font-semibold">(from {ratingCount} reviews)</span>
          </Text>
        </div>

        <Text as="p" className="text-[0.8125rem] font-[300] leading-[1.375rem] tracking-[0.00625rem]">
          {location}
        </Text>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
