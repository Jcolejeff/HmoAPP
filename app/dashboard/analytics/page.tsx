'use client';

import { format, subDays } from 'date-fns';
import React, { useState, useEffect } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { formatToNaira, url } from '@/lib/utils';

import ActivityTable from '@/domains/analytics/components/activity-table';
import BarGraph from '@/domains/analytics/components/bar-graph';
import GenerateReportModal from '@/domains/analytics/components/generate-report';
import StatCard from '@/domains/analytics/components/stat-card';
import TopTravelers from '@/domains/analytics/components/top-travellers';
import useAnalytics from '@/domains/analytics/hooks/use-analytics';
import { useUserContext } from '@/domains/user/contexts/user-context';
import RoleGuard from '@/components/shared/check-for-role-to-display-page';

type DateRange = 7 | 30 | 60;

const Analytics = () => {
  const { user, isUserLoading, currentWorkspaceRole } = useUserContext();

  const endDate = format(new Date(), 'yyyy-MM-dd');
  const supportedDateRanges: DateRange[] = [7, 30, 60];

  const [currentDateRange, setCurrentDateRange] = useState<DateRange>(7);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), currentDateRange), 'yyyy-MM-dd'));
  const [isGenerateReportModalOpen, setIsGenerateReportodalOpen] = useState<boolean>(false);
  const { data, isPending } = useAnalytics({
    startDate,
    endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
  });
  // const { data, isPending } = useAnalytics({ startDate, endDate });

  useEffect(() => {
    setStartDate(format(subDays(new Date(), currentDateRange), 'yyyy-MM-dd'));
  }, [currentDateRange]);

  if (isPending && !data) {
    return <div>Loading stats...</div>;
  }

  return (
    <RoleGuard role="Manager" isAllowed={currentWorkspaceRole === 'Manager'}>

    <section className="min-h-screen">
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={() => {
          setIsGenerateReportodalOpen(false);
        }}
        email={user?.email}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <Text size={'xs'}>Stay on top of your requests with real-time insights.</Text>
        </div>
        <button
          className="flex items-center rounded-lg bg-black px-4 py-2"
          onClick={() => setIsGenerateReportodalOpen(true)}
        >
          <Image
            src={url('/svg/dashboard/report-box-plus-outline.svg')}
            alt="report"
            width={20}
            height={20}
            className="me-2"
          />
          <Text size={'xs'} className="text-white">
            Generate report
          </Text>
        </button>
      </div>
      <div className="mb-8 h-[0.1px] w-full border-0 bg-gray-300"></div>

      <div className="mb-8 flex w-fit rounded-lg bg-gray-200 p-1">
        {supportedDateRanges.map(dateRange => (
          <Button
            key={dateRange}
            variant={'ghost'}
            className={`${dateRange === currentDateRange ? 'bg-black text-white' : ''} rounded-lg px-4 py-2`}
            onClick={() => setCurrentDateRange(dateRange)}
          >
            <Text size={'xs'} className={`${dateRange === currentDateRange ? 'text-white' : ''}`}>
              Last {dateRange} days
            </Text>
          </Button>
        ))}
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Total spend"
          value={`${formatToNaira(data?.total_organization_spend ?? 0 ?? ?? 0 0)}` ?? 0}
          image="/svg/dashboard/icons_money.svg"
        />
          title="Total hotels booked"
          value={data ? `${data.total_hotels_booked}` : '0'}
          image="/svg/dashboard/bell_outline.svg"
        />
        <StatCard
          title="Coworkers"
          value={data ? `${data.users_count}` : '0'}
          image="/svg/dashboard/person_outline.svg"
        />
        <StatCard
          title="Departments"
          value={data ? `${data.departments_count}` : '0'}
          image="/svg/dashboard/department-line.svg"
        />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <BarGraph data={data?.total_spend_per_department ?? []} />
        <TopTravelers startDate={startDate} endDate={endDate} />
      </div>
      <ActivityTable startDate={startDate} endDate={endDate} />
      </section>
    </RoleGuard>
  );
};

export default Analytics;
