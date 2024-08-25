// DON"T REMOVE CODE ABOVE to preview use static data called deparments in the static folder
// import { EllipsisVertical, MessageSquareText } from 'lucide-react';
// import React from 'react';
// import Image from 'next/image';
// import ImageStack from '@/components/shared/image-stack';
// import { Text } from '@/components/ui/text';
// import { images } from '../../static/departments';
// import { gridListCard } from '../../type/departments';
// import ActionPopOver from './action-popover';
// const GridDepartmentCard: React.FC<gridListCard> = ({ department, admin, openRequests, coworkers, onClick }) => (
//   <div className="border-1 w-full cursor-pointer rounded-lg border border-gray-100 bg-white p-4" onClick={onClick}>
//     <div className="mb-4 flex items-center justify-between">
//       <div className="flex items-center">
//         <Image src="/images/dashboard/web.png" alt="Department Icon" height={40} width={40} className="mr-3" />
//         <div>
//           <Text size={'sm'} className="font-bold">
//             {department}
//           </Text>
//           <Text size={'xs'} className=" mt-1 flex items-center text-gray-500">
//             Admin(s):{' '}
//             <Text size={'xs'} className="ms-1 text-gray-700">
//               {admin}
//             </Text>
//           </Text>
//         </div>
//       </div>
//       <div></div>
//       <div className="relative">
//         <ActionPopOver />
//       </div>
//     </div>
//     <div className="mb-4 h-[0.5px] w-full bg-gray-100"></div>
//     <div className="flex items-center justify-between">
//       <div className="flex items-center space-x-2 text-gray-500">
//         <MessageSquareText size={16} />
//         <Text size={'xs'} className="italic text-gray-400">
//           {openRequests} open requests
//         </Text>
//       </div>
//       <div className="flex items-center space-x-2">
//         <div className="flex items-center -space-x-2">
//           {/* {coworkers.slice(0, 3).map((coworker, index) => (
//             <img key={index} className="w-6 h-6 rounded-full border-2 border-white" src={coworker} alt="Coworker" />
//           ))} */}
//           <ImageStack images={images} />
//           {coworkers.length > 3 && (
//             <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs text-gray-700">
//               +{coworkers.length - 3}
//             </div>
//           )}
//         </div>
//         <Text size={'xs'} className="text-gray-500">
//           Coworkers
//         </Text>
//       </div>
//     </div>
//   </div>
// );
// export default GridDepartmentCard;
// DON"T REMOVE CODE ABOVE to preview use static data called deparments in the static folder
import { format } from 'date-fns';
import { CalendarDays, EllipsisVertical, MessageSquareText } from 'lucide-react';
import React from 'react';

import Image from 'next/image';

import ImageStack from '@/components/shared/image-stack';
import { Text } from '@/components/ui/text';

import { url } from '@/lib/utils';

import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { images } from '../static';
import { DepartmentInputProps, gridListCard, iDepartment } from '../type';

import ActionPopOver from './action-popover';
import EditDepartmentDialog from './edit-department-dialog';
import InviteNewAdmin from './invite-new-admin';
import InviteNewCoworkers from './invite-new-coworkers';

interface iGridDepartment extends iDepartment {
  setTitle: (value: any) => void;
  setDescription: (value: any) => void;
  setId: (value: any) => void;
}

const GridDepartmentCard: React.FC<iGridDepartment> = ({
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
  const {
    onOpenChange,
    currentInviteType,
    isInviteNewCoworkersModalOpen,
    isEditDepartmentModalOpen,
    setIsEditDepartmentModalOpen,
    isInviteNewAdminsModalOpen,
  } = useDepartmentsRequestContext();

  return (
    <>
      <div className="border-1 w-full cursor-pointer rounded-lg border border-gray-100 bg-white p-4" onClick={onClick}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={url('/images/dashboard/web.png')}
              alt="Department Icon"
              height={40}
              width={40}
              className="mr-3"
            />
            <div>
              <Text size={'sm'} className="font-bold">
                {name}
              </Text>
              <Text size={'xs'} className=" mt-1 flex items-center text-gray-500">
                Description :{' '}
                <Text size={'xs'} className="ms-1 text-gray-700">
                  {description}
                </Text>
              </Text>
            </div>
          </div>
          <div></div>
          <div className="relative">
            <ActionPopOver
              deptId={id}
              setId={setId}
              title={name}
              description={description}
              setTitle={setTitle}
              setDescription={setDescription}
            />
          </div>
        </div>
        <div className="mb-4 h-[0.5px] w-full bg-gray-100"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-500">
            <CalendarDays size={16} />
            <Text size={'xs'} className="italic text-gray-400">
              Date Created: {format(date_created, 'yyyy-MM-dd')}
            </Text>
          </div>
          <div>
            <Text size={'xs'} className="text-gray-500">
              {open_requests_count ?? 0} Open request{(open_requests_count ?? 0) > 1 ? 's' : ''}
            </Text>
          </div>
          {/* <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-2">
              <ImageStack images={images} />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs text-gray-700">
                +{3}
              </div>
            </div>
            <Text size={'xs'} className="text-gray-500">
              Coworkers
            </Text>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default GridDepartmentCard;
