import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

import NameStack from '@/components/shared/names-initials-stack';
import { Text } from '@/components/ui/text';

import { RequestApprovals } from '@/domains/requests/type';

import ImageStack from '../../../components/shared/image-stack';

const TravelRequestInfoPanelApproval = ({ approvals }: { approvals: RequestApprovals[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const images = [
    '/images/dashboard/Ellipse 9.png',
    '/images/dashboard/Ellipse 10.png',
    '/images/dashboard/Ellipse 11.png',
  ];

  const pendingApprovals = approvals.filter(approval => approval.status === 'pending');

  if (pendingApprovals.length === 0) return <></>;

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`relative flex ${isOpen ? 'flex-col items-start' : 'items-center'} transition-all duration-500 ease-in-out`}
      >
        <div className="flex items-center justify-end">
          <Text size="xs" className={`${isOpen ? 'text-black' : 'text-slate-500'} mr-4 italic`}>
            Awaiting {pendingApprovals.length} approval(s)...
          </Text>
          {!isOpen && (
            <NameStack
              names={pendingApprovals.map(approval => `${approval.approver.first_name} ${approval.approver.last_name}`)}
            />
          )}
          <button onClick={handleToggle} className="ml-2">
            {isOpen ? (
              <ChevronUp className="text-slate-400" size={16} />
            ) : (
              <ChevronDown className="text-slate-400" size={16} />
            )}
          </button>
        </div>
        <div
          className={`transition-max-height overflow-hidden duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          {isOpen && (
            <div className="flex w-full justify-end">
              <div className="mt-2 space-y-2">
                {pendingApprovals.map((approval, index) => (
                  <div key={index} className="flex items-center justify-end">
                    <Text size="xs" className="mr-4 italic text-gray-500">
                      {approval.approver.first_name} {approval.approver.last_name}
                    </Text>
                    {/* <Image
                        src={''}
                        alt={`User ${index + 1}`}
                        width={35}
                        height={35}
                        className="rounded-full border-2 border-white object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                      /> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelRequestInfoPanelApproval;
