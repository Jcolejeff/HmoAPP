'use client';

import React from 'react';

import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils/css';

import { useManagerRequestContext } from '@/domains/dashboard/context/manager/manager-requests-provider';
import RejectRequestModal from '@/domains/hotel-officer-portal/components/reject-request-modal';
import TabsWrapper from '@/domains/hotel-officer-portal/components/tabs-wrapper';
import TravelRequestInfoPanel from '@/domains/hotel-officer-portal/components/travel-request-info-panel';
import { useUserContext } from '@/domains/user/contexts/user-context';

const Dashboard = () => {
  const { isTravelRequestInfoPanelOpen } = useManagerRequestContext();
  const { user } = useUserContext();

  const travelRequestData = {
    name: 'John Ugo',
    department: 'Finance & Public Health',
    location: 'Lagos Island, Lagos',
    startDate: '12th February 2024',
    endDate: '15th February 2024',
    travelPurpose: 'ConFig Uni',
    hotel: 'Eko Hotels & Suites',
    roomType: 'Single Bed',
    mealBudget: 'Daily Breakfast Only',
    transportNeeds: 'Airport pickup',
    status: 'Pending',
    createdDate: '12:00am, 17/06/24',
  };

  return (
    <div>
      <RejectRequestModal />
      <section
        className={cn('relative grid w-full', {
          'grid-cols-1': !isTravelRequestInfoPanelOpen,
          'grid-cols-[4fr_2fr]': isTravelRequestInfoPanelOpen,
          'gap-4': isTravelRequestInfoPanelOpen,
        })}
      >
        <section className="flex h-full w-full flex-col gap-4">
          <div className="w-full space-y-4 rounded-md bg-primary-1 bg-[url('/images/dashboard/hero-bg.png'),_url('/images/dashboard/heroBg.png')] bg-contain bg-right-bottom bg-no-repeat px-8 py-16 text-white">
            <Text className="text-1xl font-semibold text-white">
              Hello there, {user?.first_name} {user?.last_name}! 👋
            </Text>
            <Text className="text-sm font-light text-white ">Manage all existing travel requests here!</Text>
          </div>
          <div className="mt-4">
            <TabsWrapper />
          </div>
        </section>
        <TravelRequestInfoPanel
          name={travelRequestData.name}
          department={travelRequestData.department}
          location={travelRequestData.location}
          startDate={travelRequestData.startDate}
          endDate={travelRequestData.endDate}
          travelPurpose={travelRequestData.travelPurpose}
          hotel={travelRequestData.hotel}
          roomType={travelRequestData.roomType}
          mealBudget={travelRequestData.mealBudget}
          transportNeeds={travelRequestData.transportNeeds}
          status={travelRequestData.status}
          createdDate={travelRequestData.createdDate}
        />
      </section>
    </div>
  );
};

export default Dashboard;
