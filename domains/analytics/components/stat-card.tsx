import React from 'react';

import Image from 'next/image';

import { Text } from '@/components/ui/text';

import { url } from '@/lib/utils';

type Props = {
  title: string;
  image: string;
  value: string;
};

const StatCard = ({ title, value, image }: Props) => {
  return (
    <div className="flex flex-col rounded-lg border border-gray-300  bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <Image src={url(image)} alt={title} width={30} height={30} />
        <div className="flex items-center space-x-3">
          {/* <Image src={'/svg/dashboard/growth_outline.svg'} alt={'growth'} width={20} height={20} /> */}
          {/* <Text size={'xs'} className="text-green-500">
            {change} <span className="text-gray-500">{changeToday}</span>
          </Text> */}
        </div>
      </div>
      <Text size={'lg'} className=" font-bold">
        {value}
      </Text>
      <Text size={'xs'} className="text-gray-500">
        {title}
      </Text>
    </div>
  );
};

export default StatCard;
