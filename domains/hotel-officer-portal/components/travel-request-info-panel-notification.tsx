import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { url } from '@/lib/utils';

import TravelRequestInfoPanelApproval from '../../dashboard/components/travel-request-info-panel-approval';

const TravelRequestInfoPanelNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const images = [
    '/images/dashboard/Ellipse 9.png',
    '/images/dashboard/Ellipse 10.png',
    '/images/dashboard/Ellipse 11.png',
  ];

  return (
    <div className="w-full rounded-md py-4 pe-2">
      {/* Top Notification */}
      <div className="flex items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-2 py-2">
        <div className="flex items-center">
          <Image
            src={url('/images/dashboard/Ellipse 9.png')}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm text-gray-800">You approved this request.</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="mr-2 text-xs text-gray-500">2 mins ago</p>
          <CheckCircle className="text-green-500" size={20} />
        </div>
      </div>

      <div className="mt-4 flex w-full justify-end">{/* <TravelRequestInfoPanelApproval /> */}</div>

      <div className="my-5 flex w-full justify-end px-3">
        <div className="flex gap-x-4">
          <Button className="rounded-lg border bg-transparent text-black">
            <Text size={'xs'}>Reject Request</Text>
          </Button>
          <Button className="rounded-lg border bg-black text-white">
            <Text className="text-white" size={'xs'}>
              Request Still Pending
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TravelRequestInfoPanelNotification;
