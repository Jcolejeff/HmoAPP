import React from 'react';

import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils/css';

interface StatusIndicatorProps {
  status: 'pending' | 'approved' | 'rejected' | 'all';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  status = status.toLowerCase() as StatusIndicatorProps['status'];

  let statuses: string[];
  if (status === 'pending') {
    statuses = ['pending', 'approved'];
  } else if (status === 'rejected') {
    statuses = ['pending', 'rejected'];
  } else if (status === 'approved') {
    statuses = ['pending', 'approved'];
  } else {
    statuses = ['pending', 'approved', 'rejected'];
  }

  return (
    <div className="flex items-center space-x-4">
      {statuses.map((currentStatus, index) => (
        <React.Fragment key={currentStatus}>
          <div className="flex items-center">
            <div
              className={cn('h-3 w-3 rounded-full bg-gray-300', {
                'bg-secondary-4': currentStatus === 'rejected' && status === 'rejected',
                'bg-green-600': currentStatus === 'approved' && status === 'approved',
                'bg-yellow-500': currentStatus === 'pending' && status === 'pending',
              })}
            ></div>
            <Text
              size={'sm'}
              className={cn('ml-2 text-gray-400', {
                'text-secondary-4': currentStatus === 'rejected' && status === 'rejected',
                'text-green-600': currentStatus === 'approved' && status === 'approved',
                'text-yellow-500': currentStatus === 'pending' && status === 'pending',
              })}
            >
              {currentStatus}
            </Text>
          </div>
          {index < statuses.length - 1 && (
            <div className="flex items-center">
              <div className={cn('h-0.5 w-8 bg-gray-300')}></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusIndicator;
