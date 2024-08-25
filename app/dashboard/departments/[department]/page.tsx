'use client';

import { format } from 'date-fns';
import { ChevronLeft, Ellipsis, EllipsisVertical, MessageSquareText, Plus, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import EmptyContentWrapper from '@/components/shared/empty-content-wrapper';
import SecondarySortPopover from '@/components/shared/secondary-sort-pop-over';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import DepartmentMemberPopOver from '@/domains/departments/components/department-member-popover';
import { useDepartmentsRequestContext } from '@/domains/departments/context/departments-request-provider';
import useFetchDepartmentMembers from '@/domains/departments/hooks/use-fetch-department-members';
import { coworkersData } from '@/domains/departments/static';
import RequestItem from '@/domains/hotel-officer-portal/components/request-item';

interface iDepartmentPage {
  params: {
    department: string;
  };
}

const DepartmentPage = ({ params }: iDepartmentPage) => {
  const [loading, setLoading] = useState(true);
  // const [coworkers, setCoworkers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const { activeTab, setActiveTab, activeDepartmentTab, setActiveDepartmentTab } = useDepartmentsRequestContext();

  const { isLoading, data: coworkers } = useFetchDepartmentMembers({
    id: params.department,
  });

  console.log(coworkers);

  const router = useRouter();

  const handleTabChange = (tab: 'Coworkers' | 'Requests') => {
    setActiveDepartmentTab(tab);
  };

  const renderCoworkers = () => {
    if (isLoading) {
      return (
        <div className="mb-4 mt-4 p-3">
          <div className="flex justify-center py-56 text-text-dim">
            <Text size={'xs'}>Loading... Please wait while we fetch your requests.</Text>
          </div>
        </div>
      );
    }

    if (coworkers?.items?.length === 0) {
      return (
        <EmptyContentWrapper
          customMessage="No coworkers found."
          className="py-48 text-text-dim"
          isEmpty={coworkers?.items?.length === 0}
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white ">
          <thead>
            <tr className="border-b border-t bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="w-[70px] max-w-[70px] px-4 py-3 text-left">
                <Checkbox />
              </th>
              <th className="px-4 py-3 text-left">
                <Text size={'xs'}>Co-workers name</Text>
              </th>
              <th className="px-4 py-3 text-left">
                <Text size={'xs'}>Date added</Text>
              </th>
              <th className="px-4 py-3 text-left">
                <Text size={'xs'}>Permissions</Text>
              </th>
              <th className="px-4 py-3 text-left">
                <Text size={'xs'}>Action</Text>
              </th>
            </tr>
          </thead>

          <tbody>
            {coworkers.items.map((coworker: any, index: number) => (
              <tr key={index} className="border-t py-2">
                <td className="w-[70px] max-w-[70px] px-4 py-3 text-left">
                  <Checkbox />
                </td>
                <td className="flex items-center space-x-2 px-4 py-2">
                  {/* <img src={coworker.image} alt="Coworker" className="h-8 w-8 rounded-full" /> */}
                  <div>
                    <Text size={'sm'} className="font-semibold">
                      {`${coworker.member.first_name} ${coworker.member.last_name}`}
                    </Text>
                    <Text size={'xs'} className="text-gray-400">
                      {coworker.member.email}
                    </Text>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  <Text size={'xs'} className="italic text-gray-400">
                    {format(coworker.member.date_created, 'MM/dd/yyyy')}
                  </Text>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  <Text size={'xs'}>{coworker.member.user_orgs[0].role.name}</Text>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  <DepartmentMemberPopOver coworkerId={coworker} departmentId={params.department} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRequests = () => {
    if (loading) {
      return (
        <div className="mb-4 mt-4 p-3">
          <div className="flex justify-center py-56 text-text-dim">
            <Text size={'xs'}>Loading... Please wait while we fetch your requests.</Text>
          </div>
        </div>
      );
    }

    if (requests.length === 0) {
      return (
        <EmptyContentWrapper
          customMessage="No requests found."
          className="py-48 text-text-dim"
          isEmpty={requests.length === 0}
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        {requests.map((request, index) => (
          <RequestItem key={index} {...request} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <Button
          onClick={() => router.back()}
          className="flex items-center space-x-1 rounded bg-transparent p-2 hover:bg-gray-100"
        >
          <ChevronLeft color="gray" size={16} />
          <span className="text-xs text-gray-700">Back</span>
        </Button>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="flex w-full justify-between">
          <h1 className="text-1xl font-bold">Manage department</h1>
          <div className="flex space-x-2">
            <Button
              className="flex items-center space-x-1 rounded border bg-transparent p-2 hover:border-gray-300 hover:bg-gray-100"
              onClick={() => '/'}
            >
              <span className="text-xs text-gray-700">Manage approval</span>
            </Button>
            <Button
              className="flex items-center space-x-1 rounded border bg-black p-2 hover:border-gray-300 hover:bg-gray-100"
              onClick={() => '/'}
            >
              <Plus color="white" size={16} />
              <span className="text-xs text-gray-200">Co-worker</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-4 rounded-lg border bg-white p-3">
        <div className="mb-4 flex border-b">
          <Button
            className={`px-4 py-2 ${activeDepartmentTab === 'Coworkers' ? 'border-b-2 border-black text-black' : 'text-gray-500'} rounded-none bg-transparent`}
            onClick={() => handleTabChange('Coworkers')}
          >
            <Text size={'xs'} className="flex items-center">
              Coworkers{' '}
              <Text size={'xs'} className="ml-1 rounded-lg bg-black px-2 py-1 text-white">
                {coworkers && coworkers.items.length}
              </Text>
            </Text>
          </Button>
          <Button
            className={`px-4 py-2 ${activeDepartmentTab === 'Requests' ? 'border-b-2 border-black text-black' : 'text-gray-500'} rounded-none bg-transparent`}
            onClick={() => handleTabChange('Requests')}
          >
            <Text size={'xs'} className="flex items-center">
              Requests{' '}
              <Text size={'xs'} className="ml-1 rounded-lg  bg-black px-2 py-1 text-white">
                {requests.length}
              </Text>
            </Text>
          </Button>
        </div>
        <div className="mb-6 flex justify-between border-b pb-4">
          <div className="flex h-full w-fit items-center rounded-lg border px-4 py-1  ">
            <Search className="h-full w-4" color="#B1B0B9" />
            <div className="flex-grow">
              <Input
                className="border-0 text-xs shadow-none focus-within:border-0 focus-within:shadow-none focus-within:ring-0 focus:border-0 focus:shadow-none focus:!ring-0 focus-visible:border-0 focus-visible:shadow-none focus-visible:ring-0"
                placeholder="Search for past & present requests"
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-fit space-x-3">
            <SecondarySortPopover />
            <SecondarySortPopover />
          </div>
        </div>

        {/* Content Section */}
        {activeDepartmentTab === 'Coworkers' ? renderCoworkers() : renderRequests()}
      </div>
    </div>
  );
};

export default DepartmentPage;
