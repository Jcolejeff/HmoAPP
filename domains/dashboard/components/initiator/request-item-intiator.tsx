import { formatDate, formatRelative } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Calendar, Hotel, LocateIcon, Map, UserIcon } from 'lucide-react';
import React from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils/css';

import { RequestItemProps } from '@/domains/requests/type';

import { useCreateRequestContext } from '../../context/initiator/create-request-context';
import StatusIndicator from '../status-indicator';

import ActionPopOver from './action-popover';

const RequestItem: React.FC<RequestItemProps> = props => {
  const { setShowRequestDetail, setCurrentRequest, showRequestDetail, currentRequest } = useCreateRequestContext();
  const {
    id,
    requester,
    purpose,
    state,
    city,
    hotel,
    room,
    start,
    end,
    specialRequests,
    status,
    messages,
    date_created,
  } = props;
  return (
    <div
      onClick={() => {
        setCurrentRequest(props);
        setShowRequestDetail(true);
      }}
      className={`flex w-full gap-7  ${currentRequest?.id === id ? 'bgp border-black shadow-md' : ''}   border-b py-6 pt-8 shadow-sm `}
    >
      <div>
        <Checkbox checked={currentRequest?.id === id} />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between  ">
          <h4 className=" text-sm font-medium">
            Travel request - {id} - {hotel}/ {city},{state} -{' '}
            <span className="text-xs text-text-dim">{formatRelative(date_created, new Date())} </span>
          </h4>
          <AnimatePresence>
            {showRequestDetail && (
              // <motion.div
              //   initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
              //   animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
              //   exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
              //   className=""
              // >
              //   {' '}
              <Text
                size={'sm'}
                className={cn(' capitalize underline ', {
                  ' text-secondary-4': status === 'rejected',
                  'text-green-600': status === 'approved',
                  ' text-yellow-500': status === 'pending',
                })}
              >
                {status}
              </Text>
              // </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!showRequestDetail && (
              // <motion.div
              //   initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
              //   animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
              //   className=""
              // >
              //   {' '}
              <div className="flex items-center">
                <StatusIndicator status={status} />
              </div>
              // </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4  py-3">
          <article className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-end gap-1 ">
                <Hotel size={16} className="text-text-dim" />

                <Text size={'xs'} className="text-text-dim">
                  {hotel} - {room}
                </Text>
                <p className="-mt-1">.</p>
              </div>
              <div className="mt-1  flex items-center gap-1 ">
                <UserIcon size={16} className="text-text-dim" />
                <Text size={'xs'} className="text-text-dim">
                  {requester.first_name} {requester.last_name}
                </Text>
              </div>

              <div className="flex space-x-3 ">
                {/* {specialRequests.slice(0, 4).map((request, index) => {
                  return (
                    <Text size={'xs'} key={request} className="mt-1 rounded-lg bg-purple-100 px-2 py-1 text-purple-600">
                      {request}
                    </Text>
                  );
                })}
                {specialRequests.length > 4 && (
                  <Text size={'xs'} className="mt-1 rounded-lg bg-purple-100 px-2 py-1 text-purple-600">
                    +{specialRequests.length - 4}
                  </Text>
                )} */}
              </div>
            </div>
            <div
              className={
                showRequestDetail
                  ? ' space-y-3 transition-all duration-200 ease-linear '
                  : 'flex items-center  gap-2 transition-all duration-200 ease-linear'
              }
            >
              <div className="flex items-end gap-1">
                <Map size={16} className="text-text-dim" />

                <Text size={'xs'} className="text-text-dim">
                  {city}, {state}
                </Text>
                <p className="-mt-1">{'   '} .</p>
              </div>

              <div className="flex items-end gap-1">
                <Calendar size={16} className="text-text-dim" />
                <Text size={'xs'} className="text-text-dim">
                  {formatDate(start, 'dd MMMM, yyyy')} - {formatDate(end, 'dd MMMM, yyyy')}
                </Text>
                <p className="-mt-1">.</p>
              </div>
              <div className="flex items-end gap-1">
                <Book size={16} className="text-text-dim" />
                <Text
                  size={'xs'}
                  className="text-text-dim"
                  dangerouslySetInnerHTML={{
                    __html: purpose,
                  }}
                />
              </div>
            </div>
          </article>

          <div>
            <Button
              size="sm"
              variant="default"
              className="text-white"
              onClick={() => {
                setShowRequestDetail(true);
                setCurrentRequest(props);
              }}
            >
              View request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
