import React from 'react';

import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';

import { trunc, url } from '@/lib/utils';

import { RequestItemProps } from '@/domains/requests/type';

import StatusIndicator from '../../dashboard/components/status-indicator';
import { useManagerRequestContext } from '../../dashboard/context/manager/manager-requests-provider';

import ActionPopOver from './action-popover';

const RequestItem: React.FC<RequestItemProps> = props => {
  const { id, requester_id, purpose, city, country, hotel, room, start, end, other_requests, status, messages } = props;

  const {
    selectedManagerRequest,
    setSelectedManagerRequest,
    isTravelRequestInfoPanelOpen,
    setIsTravelRequestInfoPanelOpen,
  } = useManagerRequestContext();

  const handleClickedItem = () => {
    setSelectedManagerRequest(props);
    setIsTravelRequestInfoPanelOpen(true);
  };
  return (
    <div
      className={`border ${selectedManagerRequest?.id === id ? 'border-black shadow-md' : ''} mb-4 rounded-md p-1`}
      onClick={handleClickedItem}
    >
      <div className="mb-2 flex items-center justify-between rounded-lg bg-background-lighter px-4 py-3">
        <div className="flex min-w-[200px] items-center">
          <Image src={url('/svg/dashboard/manager/database-setting-solid.svg')} alt={`${id}`} width={25} height={25} />
          <h4 className="ms-3 text-sm font-bold">Request ID: {id}</h4>
        </div>
        <div className="flex items-center">
          <div
            className={` ${!isTravelRequestInfoPanelOpen ? 'flex' : 'hidden'} mr-5 items-center rounded-full bg-[#F3FEF1] px-4 py-1`}
          >
            <Image
              src={url('/svg/dashboard/manager/alert-twotone.svg')}
              alt={`${id}`}
              width={16}
              height={16}
              className="mb-1 me-2"
            />
            {messages > 0 && (
              <Text size={'xs'} className="text-green-400">
                {messages} new messages from Emediong
              </Text>
            )}
          </div>

          <StatusIndicator status={status} />
        </div>
      </div>
      <div className="mb-2 flex items-center gap-4 px-2 py-3">
        <div className="flex items-center justify-between">
          <div className="mx-3 flex h-full items-center justify-center">
            <Checkbox checked={selectedManagerRequest?.id === id} />
          </div>
          <div className="mx-3 min-w-[100px]">
            <Text size={'xs'} className="text-slate-400">
              Requester:
            </Text>
            <Text size={'xs'} className={'mt-1 w-fit'}>
              requester_id
            </Text>
          </div>
          <div className={`mx-3 ${!isTravelRequestInfoPanelOpen ? 'flex' : 'hidden'}  flex-col`}>
            <Text size={'xs'} className="text-slate-400">
              Purpose:
            </Text>
            <Text
              size={'xs'}
              className=""
              dangerouslySetInnerHTML={{
                __html: purpose,
              }}
            />
          </div>
          <div className="mx-3 min-w-[100px]">
            <Text size={'xs'} className="text-slate-400">
              Location:
            </Text>
            <Text size={'xs'} className={'mt-1 w-fit'}>
              {`${trunc(city, 15)}, ${trunc(country, 15)}`}
            </Text>
          </div>
          <div className="mx-3 min-w-[100px]">
            <Text size={'xs'} className="text-slate-400">
              Hotel:
            </Text>
            <Text size={'xs'} className={'mt-1 w-fit'}>
              {trunc(hotel, 15)}
            </Text>
          </div>
          <div className={`mx-3 ${!isTravelRequestInfoPanelOpen ? 'flex' : 'hidden'} flex-col`}>
            <Text size={'xs'} className="text-slate-400">
              Room Type:
            </Text>
            <Text size={'xs'} className={'mt-1 w-fit'}>
              {trunc(room, 15)}
            </Text>
          </div>
          <div className="mx-3 min-w-[100px]">
            <Text size={'xs'} className="text-slate-400">
              Start - End Date:
            </Text>
            <Text size={'xs'} className={'mt-1 w-fit'}>
              {trunc(`${start} - ${end}`, 25)}
            </Text>
          </div>
        </div>
        <div className="mx-3 h-5 w-[0.5px] bg-slate-200"></div>
        <div className="flex items-center justify-between">
          <div className={`${!isTravelRequestInfoPanelOpen ? 'flex' : 'hidden'} flex-col`}>
            <Text size={'xs'} className="text-slate-400">
              Other request
            </Text>

            <div className="flex space-x-3">
              <Text size={'xs'} className="mt-1 rounded-lg bg-purple-100 px-2 py-1 text-purple-600">
                {other_requests ? trunc(other_requests, 12) : 'none'}
              </Text>
            </div>
          </div>

          <div
            className={`mx-7 h-5 w-[0.5px] bg-slate-200 ${!isTravelRequestInfoPanelOpen ? 'flex' : 'hidden'} `}
          ></div>

          <div className="mt-4">
            <Text size={'xs'} className="text-slate-400">
              Actions
            </Text>
            <ActionPopOver />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
