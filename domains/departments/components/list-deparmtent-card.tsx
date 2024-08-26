import { format } from 'date-fns';
import { CalendarDays, ChevronRight, EllipsisVertical, MessageSquareText } from 'lucide-react';
import React from 'react';

import Image from 'next/image';

import ImageStack from '@/components/shared/image-stack';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { url } from '@/lib/utils';

import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { images } from '../static';
import { gridListCard, iDepartment } from '../type';

import ActionPopOver from './action-popover';
import InviteNewCoworkers from './invite-new-coworkers';

interface iListDepartment extends iDepartment {
  setTitle: (value: any) => void;
  setDescription: (value: any) => void;
  setId: (value: any) => void;
}

const ListDepartmentCard: React.FC<iListDepartment> = ({
  name,
  description,
  onClick,
  date_created,
  id,
  setTitle,
  setDescription,
  setId,
  open_requests_count,
}) => {
  const { onOpenChange, isInviteNewCoworkersModalOpen, isCreateDepartmentModalOpen, currentInviteType } =
    useDepartmentsRequestContext();
  const { currentWorkspace } = useWorkspaceContext();

  return (
    <>
      <div
        className="border-1  flex w-full cursor-pointer flex-col rounded-lg border border-gray-100  bg-white p-4"
        onClick={onClick}
      >
        <div className="flex w-full  items-center  justify-between">
          <div className="flex items-center">
            <Image
              src={url('/images/dashboard/web.png')}
              alt="Department Icon"
              height={40}
              width={40}
              className="mr-3"
            />
            <div>
              <Text size={'sm'} className="font-bold capitalize">
                {name}
              </Text>
              {/* <Text size={'sm'} className="font-bold">
                {currentWorkspace?.name} Department
              </Text> */}
              <Text size={'xs'} className="mt-1 flex items-center text-gray-500">
                Description:{' '}
                <Text size={'xs'} className="ms-1 text-gray-700">
                  {description}
                </Text>
              </Text>
            </div>
          </div>

          <button className="flex items-center text-gray-500 hover:text-gray-700">
            <ActionPopOver
              deptId={id}
              setId={setId}
              title={name}
              description={description}
              setTitle={setTitle}
              setDescription={setDescription}
            />
          </button>
        </div>

        <div className="my-4 h-[0.5px] w-full bg-gray-100"></div>

        <div className="flex items-center justify-between space-x-4">
          <Text size={'xs'} className="text-gray-500">
            {open_requests_count ?? 0} Open request{(open_requests_count ?? 0) > 1 ? 's' : ''}
          </Text>
          {/* <div className="flex items-center space-x-2 text-gray-500">
            <div className="tems-center flex">
              <ImageStack images={images} />
            </div>
            <div className="item-center flex">
              <Text size={'xs'} className="text-gray-500">
                Coworkers
              </Text>
              <CalendarDays size={16} className="ms-12" />
            </div>
            <Text size={'xs'} className="italic text-gray-400">
              Date created: {format(date_created, 'yyyy-MM-dd')}
            </Text>
          </div> */}
          <Button className="group flex items-center space-x-1 rounded-none bg-transparent">
            <Text
              size={'xs'}
              className="border-b-[0.5px] border-gray-500 text-gray-700 transition duration-300 group-hover:border-blue-500 group-hover:text-blue-500"
            >
              View Details
            </Text>
            <ChevronRight size={16} className="text-black transition duration-300 group-hover:text-blue-500" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ListDepartmentCard;
