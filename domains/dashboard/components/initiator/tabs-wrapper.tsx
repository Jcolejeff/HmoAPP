import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import ContentLoader from '@/components/shared/content-loading-screen';
import EditableText from '@/components/shared/edit-text';
import EmptyContentWrapper from '@/components/shared/empty-content-wrapper';
import GoBackButton from '@/components/shared/go-back-button';
import { ImageSlide } from '@/components/shared/images/image-slide';
import SelectAndSearchInput from '@/components/shared/select-and-replace-input';
import SortPopover from '@/components/shared/sort-pop-over';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SelectDropDown from '@/components/ui/select-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import { requestKeys } from '@/lib/react-query/query-keys';

import { RequestItemProps, RequestState, RequestStatus } from '@/domains/requests/type';
import { useUserContext } from '@/domains/user/contexts/user-context';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { MaintenanceSchedule } from '@/types';
import { Request } from '@/types';

import { useRequests } from '../../../requests/hooks/use-requests';
import { useCreateRequestContext } from '../../context/initiator/create-request-context';

import RequestItem from './request-item-intiator';

interface TabData {
  key: RequestState;
  label: string;
}

type TabKey = 'my-requests' | 'approve-requests';

const requestStatus: { key: RequestStatus; value: string }[] = [
  { key: 'all', value: 'All Requests' },
  { key: 'pending', value: 'Pending' },
  { key: 'approved', value: 'Approved' },
  { key: 'rejected', value: 'Rejected' },
];

const TabsWrapper: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { user, currentWorkspaceRole } = useUserContext();

  const workspaceId = currentWorkspace?.id;

  const [tabsData, setTabsData] = useState<{ key: TabKey; label: string }[]>([
    { key: 'my-requests', label: 'Requests by you' },
    ...(currentWorkspaceRole === 'Manager'
      ? [
          {
            key: 'approve-requests' as TabKey,
            label: 'Approve Requests',
          },
        ]
      : []),
  ]);

  const [activeTab, setActiveTab] = useState<TabKey>('my-requests');
  const [activeStatus, setActiveStatus] = useState<(typeof requestStatus)[0]>(requestStatus[0]);

  // if approve-requests tab is active, pass approver_id to requests endpoint, else pass requester ID
  const {
    data: { items: requests = [] } = {},
    isLoading,
    isPending,
    isError,
  } = useRequests({
    approverId: activeTab === 'approve-requests' ? user?.id : undefined,
    requesterId: activeTab === 'my-requests' ? user?.id : undefined,
    status: activeStatus.key === 'all' ? undefined : activeStatus.key,
  });

  const handleTabChange = (value: TabKey) => {
    setActiveTab(value);
  };

  const queryClient = useQueryClient();

  const getRequestsCount = (status: string) => {
    const requestsListQueryKey = currentWorkspace
      ? user
        ? requestKeys.list(currentWorkspace?.id!.toString(), user.id.toString(), status)
        : requestKeys.list(currentWorkspace.id.toString(), status)
      : [''];

    const requestsList = queryClient.getQueryData<RequestItemProps[]>(requestsListQueryKey);
    return requestsList?.length || null;
  };

  return (
    <Tabs defaultValue={activeTab} className="" onValueChange={key => handleTabChange(key as TabKey)}>
      <div className="mb-4 flex w-full justify-between">
        <TabsList className="rounded-lg border p-1">
          {tabsData.map(tab => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={`w-max rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-linear  ${activeTab === tab.key ? 'bg-secondary-6' : 'bg-white text-slate-500'}`}
            >
              {tab.label}
              {getRequestsCount(tab.key) && <span>({getRequestsCount(tab.key)})</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        <div>
          <SelectDropDown
            data={requestStatus}
            placeholder={'Select status'}
            selectedValues={[activeStatus]}
            setSelectedValues={selectedValues => setActiveStatus(selectedValues[0])}
            nameKey="value"
            idKey="key"
            asRadio
            isSingleSelect={true}
            className="w-[12.5rem]"
          >
            <Button className=" flex items-center justify-between gap-4 rounded-md border bg-secondary-6 px-3 py-3">
              <Text className="text-sm font-medium">Status: {activeStatus.value}</Text>
              <ChevronDown className="ml-2 h-4 w-4 text-black" />
            </Button>
          </SelectDropDown>
        </div>
        {/* <SortPopover /> */}
      </div>

      {tabsData.map(tab => (
        <TabsContent key={tab.key} value={tab.key} className="h-full">
          <ContentLoader isLoading={isLoading} numberOfBlocks={1} className="flex w-full ">
            <Card className="h-full border-none bg-white  px-6 shadow">
              <CardContent className="p-0">
                <EmptyContentWrapper
                  customMessage="Empty"
                  className="mt-6 h-full rounded-md py-16 text-text-dim"
                  isEmpty={requests?.length === 0 || isError}
                >
                  <div>{requests?.map((item, index) => <RequestItem key={index} {...item} />)}</div>
                </EmptyContentWrapper>
              </CardContent>
            </Card>
          </ContentLoader>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsWrapper;
