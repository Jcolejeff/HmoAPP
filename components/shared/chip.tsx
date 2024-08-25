import { Send, X } from 'lucide-react';
import React from 'react';

import Image from 'next/image';

import { url } from '@/lib/utils';

import { ChipProps } from '@/types';

import { Text } from '../ui/text';

const Chip: React.FC<ChipProps> = ({ type, label, imageUrl, onRemove }) => {
  // Function to get initials from the label
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="m-1 flex w-fit items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2">
      {type === 'user' && (
        <>
          {imageUrl ? (
            <Image src={url(imageUrl)} alt={label} width={16} height={16} className="mr-2 rounded-full" />
          ) : (
            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs text-gray-700">
              {getInitials(label)}
            </div>
          )}
        </>
      )}
      {type === 'email' && <Send size={16} />}
      <Text size={'xs'} className="capitalize">
        {label}
      </Text>
      <div className="h-[10px] w-[1px] bg-gray-400"></div>
      <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={onRemove}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Chip;
