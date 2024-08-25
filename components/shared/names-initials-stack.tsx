import React from 'react';

import { getInitialsFromSentence } from '@/lib/utils/string';

import { Text } from '../ui/text';

interface NamesStackProps {
  names: string[];
}

const NameStack: React.FC<NamesStackProps> = ({ names }) => {
  return (
    <div className="flex items-center gap-2 rounded-full border-2 border-primary-1 bg-secondary-7 px-3 py-2">
      {names.map((name, index) => (
        <Text
          as="p"
          key={index}
          className={`  ${index !== 0 ? '-ml-2' : ''} block text-sm transition-transform duration-200 ease-in-out hover:scale-105`}
        >
          {getInitialsFromSentence(name)}
        </Text>
      ))}
    </div>
  );
};

export default NameStack;
