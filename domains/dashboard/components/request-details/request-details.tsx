import { DialogTitle } from '@radix-ui/react-dialog';
import { AxiosError } from 'axios';
import { formatDate, formatRelative } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, ChevronDown, MapPinIcon, Paperclip, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { start } from 'repl';
import { toast } from 'sonner';

import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage, AvatarRoot } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SelectDropDown from '@/components/ui/select-dropdown';
import Spinner from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

import processError from '@/lib/error';
import { calculateDaysBetweenDates, formatToNaira, url } from '@/lib/utils';
import { cn } from '@/lib/utils/css';
import { getInitialsFromSentence } from '@/lib/utils/string';

import { RequestItemProps, RequestStatus } from '@/domains/requests/type';
import { useUserContext } from '@/domains/user/contexts/user-context';

import { useSingleRequest } from '../../../requests/hooks/use-single-request';
import { useUpdateRequest } from '../../../requests/hooks/use-update-request';
import { useCreateRequestContext } from '../../context/initiator/create-request-context';
import { useCreateComment } from '../../hooks/use-create-comment';
import TravelRequestInfoPanelApproval from '../travel-request-info-panel-approval';

import ChatBox from './chat-box';
import CommentUpload from './comment-upload';

// exporting all these because they are used in the external pages /requests/approve/page.tsx too
export interface RequestSideBarProps {}
export type HotelDetail = {
  name: string;
  value: string | null | undefined;
};

export type ApproveRequestArgs = { status: RequestStatus; rejectionReason?: string };

/**
 * Request key/value details like accomodation and hotel details
 * @param param0
 * @returns
 */
export const RequestKVDetails = ({ details }: { details: HotelDetail[] }) => {
  return (
    <Table>
      <TableBody>
        {details.map(item => {
          return (
            <TableRow key={item.name} className="border-none">
              <TableCell className="flex  gap-1 p-0  py-2">
                <MapPinIcon className="h-4 w-4 text-text-dim" />

                <Text size={'xs'} className="text-text-dim">
                  {item.name}
                </Text>
              </TableCell>
              <TableCell className="p-0  text-end">
                {item.name === 'Purpose' ? (
                  <Text
                    size={'xs'}
                    className="text-text-dim"
                    dangerouslySetInnerHTML={{ __html: item.value ?? 'N/A' }}
                  />
                ) : (
                  <Text size={'xs'} className="text-text-dim">
                    {item.value}
                  </Text>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export const requestStatus: { key: RequestStatus; value: string }[] = [
  { key: 'pending', value: 'Pending' },
  { key: 'approved', value: 'Approved' },
  { key: 'rejected', value: 'Rejected' },
];

export const ApproveRequestConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isUpdateRequestPending,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onConfirm: (args: ApproveRequestArgs) => void;
  isUpdateRequestPending: boolean;
}) => {
  const [activeStatus, setActiveStatus] = useState<(typeof requestStatus)[0]>(requestStatus[0]);
  const [rejectionReason, setRejectionReason] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="min-w-[500px] p-4">
        <DialogTitle>Approve request</DialogTitle>

        <div className="flex items-center gap-3">
          <Text size="xs">Select Status</Text>
          <SelectDropDown
            data={requestStatus}
            placeholder={'Select status'}
            selectedValues={[activeStatus]}
            setSelectedValues={selectedValues => setActiveStatus(selectedValues[0])}
            nameKey="value"
            idKey="key"
            asRadio
            isSingleSelect={true}
          >
            <Button className="flex  items-center justify-between gap-4 rounded-md bg-secondary-6 px-3 py-3">
              <Text className="text-xs font-medium">{activeStatus.value}</Text>
              <ChevronDown className="ml-2 h-4 w-4 text-black" />
            </Button>
          </SelectDropDown>
        </div>

        {activeStatus.key === 'rejected' && (
          <div>
            <Text size="xs">Rejection reason</Text>

            <Textarea
              name="title"
              placeholder="Enter rejection reason"
              className="my-2 w-full border-none bg-primary-4"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              variant="minimal"
              size="sm"
              required={true}
            />
          </div>
        )}

        <div className="flex justify-end px-4">
          <Button
            disabled={isUpdateRequestPending}
            onClick={() => {
              if (activeStatus.key === 'rejected' && rejectionReason.trim().length === 0) {
                toast.error('Rejection reason is required if you reject a request');
                return;
              }
              onConfirm({ status: activeStatus.key, rejectionReason });
              setActiveStatus(requestStatus[0]);
            }}
          >
            {isUpdateRequestPending ? <Spinner /> : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RequestSideBar = ({}: RequestSideBarProps) => {
  const { user } = useUserContext();
  const {
    showRequestDetail,
    currentRequest,
    setShowRequestDetail,
    setCurrentRequest,
    setCreateRequestData,
    setActiveTab,
    onOpenChange,

    open,
    setIsEditMode,
  } = useCreateRequestContext();
  const { mutate: createComment, isPending } = useCreateComment();
  const { mutate: updateRequest, isPending: isUpdateRequestPending } = useUpdateRequest();

  const [newComment, setNewComment] = React.useState('');
  const [openApprovalDialog, setOpenApprovalDialog] = React.useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTheTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = -chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToTheTop();
  }, [currentRequest]);

  const handleSubmitComment = (content: string, currReq: RequestItemProps) => {
    if (content && currReq && content.trim().length > 0) {
      createComment(
        {
          content: content,
          record_id: currReq.id,
        },
        {
          onSuccess: () => {
            toast.success(`Comment Added Successfully`);
            setNewComment('');
          },
          onError: error => {
            console.log({ error });
            if (error instanceof AxiosError) processError(error);
          },
        },
      );
    } else {
      toast.error('Comment cannot be empty');
    }
  };

  const { data, isFetching, isLoading } = useSingleRequest(currentRequest?.id!);

  const details = data ? data : currentRequest;

  const studentDetails = [
    {
      name: 'Faculty',
      value: `${details?.hotel}`,
    },
    {
      name: 'Department',

      value: details?.state,
    },
    {
      name: 'Mat Num.',

      value: details?.city,
    },
    {
      name: 'Issue Start date',

      value: details?.start && formatDate(details?.start, 'dd MMMM, yyyy'),
    },
    {
      name: 'Level',
      value: details?.rate,
    },
    {
      name: 'Phone',
      value: details?.room,
    },
  ];

  const handleEditRequest = () => {
    if (!details) return;

    setCreateRequestData(details);
    setActiveTab('travel-details');
    setIsEditMode(true);
    onOpenChange(true);
  };

  const approveRequest = ({ status, rejectionReason }: ApproveRequestArgs) => {
    if (!currentRequest) return;

    updateRequest(
      {
        id: currentRequest.id,
        status,
        rejection_reason: rejectionReason,
      },
      {
        onSuccess: data => {
          setCurrentRequest(data);
          toast.success('Request Updated Successfully');
          setOpenApprovalDialog(false);
        },
      },
    );
  };

  if (!showRequestDetail || !currentRequest || !details) {
    return <></>;
  }

  const userApproverInstance = currentRequest.request_approvals.find((value: any) => value.approver_id == user?.id);
  const approvedOrRejectedApprovals = currentRequest.request_approvals.filter((approval: any) =>
    ['approved', 'rejected'].includes(approval.status),
  );

  const name = `${details.requester?.first_name || ' '} ${details.requester?.last_name || ' '}`;
  return (
    <AnimatePresence>
      <ApproveRequestConfirmationDialog
        open={openApprovalDialog}
        onOpenChange={val => setOpenApprovalDialog(val)}
        onConfirm={approveRequest}
        isUpdateRequestPending={isUpdateRequestPending}
      />
      {showRequestDetail && (
        <motion.div
          initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
          animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
          exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
          className="h-full"
        >
          <div className=" sticky top-[2rem] hidden h-fit flex-col overflow-hidden rounded-lg  border bg-white pb-4 shadow-sm   md:flex">
            <div className="flex justify-between bg-primary-4 px-2 py-4 shadow-sm ">
              <div className="flex items-center gap-2">
                <div className="flex gap-2 rounded-full bg-secondary-7 px-3 py-2">
                  <Text className="text-base">{getInitialsFromSentence(name)}</Text>
                </div>

                <div className="space-y-[2px]">
                  <Text size={'sm'} className="font-semibold capitalize">
                    {name} - {details.id}
                  </Text>

                  <Text size={'xs'} className="text-text-dim">
                    {details.hotel} / {details.city}, {details.state}
                  </Text>
                </div>
              </div>

              <Button
                variant={'outline'}
                onClick={() => {
                  setCurrentRequest(null);
                  setShowRequestDetail(false);
                }}
                className="hover:bg-gray/10 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground right-4 top-4 w-fit border-none p-4 opacity-70 ring-offset-transparent transition-opacity hover:opacity-100 focus:shadow-none focus:outline-none focus:ring focus:ring-[#777979]/20 focus-visible:ring-1 focus-visible:ring-[#777979]/20 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <section className="h-[66vh] space-y-3 overflow-scroll scroll-smooth px-4" ref={chatContainerRef}>
              {/* SHOW IF USER IS A PART OF THE APPROVERS AND REQUEST STATUS IS PENDING */}
              {userApproverInstance && userApproverInstance.status === 'pending' && (
                <Button
                  variant={'outline'}
                  className="mt-4 w-full rounded-lg bg-lime-600"
                  onClick={() => setOpenApprovalDialog(true)}
                >
                  <Text className="text-white" size={'xs'}>
                    Approve request
                  </Text>
                </Button>
              )}

              <div className=" my-4 flex items-center justify-between gap-1">
                <div className="h-[1px] w-[25%] bg-gray-200" />

                <Text className=" w-fit text-center text-xs text-text-dim">
                  Created: {formatDate(details.date_created!, 'dd MMM, yyyy')}{' '}
                </Text>
                <div className="h-[1px] w-[25%] bg-gray-200" />
              </div>

              <Text
                className={cn('mx-auto w-fit rounded-sm   px-4 py-1 text-xs font-medium capitalize ', {
                  'bg-secondary-5 text-secondary-4': details.status === 'rejected',
                  'bg-green-50 text-green-600': details.status === 'approved',
                  'bg-yellow-100/60 text-yellow-500': details.status === 'pending',
                })}
              >
                Status: {details.status}
              </Text>

              <div className="space-y-4 rounded-lg bg-primary-4  px-4 py-4 md:px-4">
                <article className="space-y-2">
                  <div className="rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                    <Text size={'xs'} className="mb-1 w-full border-b py-4 font-semibold uppercase">
                      Issue details
                    </Text>
                    <RequestKVDetails details={studentDetails} />
                  </div>

                  <div className=" rounded-lg border border-b-0 bg-white  px-4 pb-2  ">
                    <Text size={'xs'} className="mb-1 w-full  py-4 font-semibold uppercase">
                      Issue description
                    </Text>

                    <Text
                      size={'xs'}
                      className="text-text-dim"
                      dangerouslySetInnerHTML={{
                        __html: details?.purpose ?? 'N/A',
                      }}
                    />
                  </div>
                </article>
              </div>
              <div className="my-5 flex w-full justify-end px-3">
                <div className="flex gap-x-4">
                  <Button className="rounded-lg border bg-transparent text-black" disabled={true}>
                    <Text size={'xs'}>Cancel request</Text>
                  </Button>

                  {user?.id! === details.requester_id && (
                    <Button
                      disabled={details.status === 'approved' || details.status === 'rejected'}
                      onClick={handleEditRequest}
                      className="rounded-lg border bg-transparent text-black"
                    >
                      <Text size={'xs'}>Edit request</Text>
                    </Button>
                  )}
                  <Button className="rounded-lg bg-primary-4" disabled={true}>
                    <Text size={'xs'}>Send reminder</Text>
                  </Button>
                </div>
              </div>

              {/* SHOW IF USER IS A PART OF THE APPROVERS AND REQUEST STATUS IS PENDING */}
              {userApproverInstance && userApproverInstance.status === 'pending' && (
                <Button
                  variant={'outline'}
                  className="w-full rounded-lg bg-lime-600"
                  onClick={() => setOpenApprovalDialog(true)}
                >
                  <Text className="text-white" size={'xs'}>
                    Approve request
                  </Text>
                </Button>
              )}

              <div className="my-5 flex w-full justify-end px-3">
                <TravelRequestInfoPanelApproval approvals={currentRequest.request_approvals} />
              </div>
              <div className="w-full rounded-md py-4 pe-2">
                {approvedOrRejectedApprovals.map((approval: any) => (
                  <div
                    className="flex items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-2 py-2"
                    key={approval.id}
                  >
                    <div className="flex items-center">
                      <div className="flex gap-2 rounded-full bg-secondary-7 px-3 py-2">
                        <Text className="text-sm">
                          {getInitialsFromSentence(`${approval.approver.first_name} ${approval.approver.last_name}`)}
                        </Text>
                      </div>
                      {/* <Image
                        src={url('/images/dashboard/Ellipse 9.png')}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      /> */}
                      <div className="ml-3">
                        <p className="text-xs text-gray-800">
                          {approval.approver.first_name} {approval.status} this request.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="mr-2 text-xs text-gray-500">{formatRelative(approval.last_updated, new Date())}</p>
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                  </div>
                ))}
              </div>

              <ChatBox recordId={details.id.toString()} parentId={details.id.toString()} />
            </section>
            {/* comment upload input  */}
            <CommentUpload />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestSideBar;
