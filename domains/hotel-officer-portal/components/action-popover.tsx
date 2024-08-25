import React from 'react';

import Image from 'next/image';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';

import { url } from '@/lib/utils';

import { useManagerRequestContext } from '../../dashboard/context/manager/manager-requests-provider';

const ActionPopOver: React.FC = () => {
  const actions = [
    { label: 'Approve Request', className: 'text-black ' },
    { label: 'Mark as Booked', className: 'text-gray-300' },
    { label: 'Reject Request', className: 'text-red-500 ' },
  ];

  const { onOpenChange } = useManagerRequestContext();

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button onClick={handleTriggerClick}>
          <Image src={url('/svg/dashboard/manager/menu-dots-bold.svg')} alt="action" width={26} height={10} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 rounded-md border bg-white p-4 shadow-md">
        <div className="flex flex-col space-y-2">
          {actions.map(action => (
            <button
              key={action.label}
              className={`py-1 text-left transition-all duration-200 ease-in-out hover:rounded-lg hover:bg-background-lighter hover:px-3`}
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                if (action.label === 'Reject Request') {
                  onOpenChange(true);
                }
              }}
            >
              <Text size={'xs'} className={`${action.className}`}>
                {action.label}
              </Text>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ActionPopOver;
