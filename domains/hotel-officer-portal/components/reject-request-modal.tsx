'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';
import { Textarea } from '@/components/ui/textarea';

import processError from '@/lib/error';

import { useCreateRequest } from '@/domains/requests/hooks/use-create-request';

import { useCreateRequestContext } from '../../dashboard/context/initiator/create-request-context';
import { useManagerRequestContext } from '../../dashboard/context/manager/manager-requests-provider';

const TextEditor = dynamic(() => import('../../dashboard/components/text-editor'), { ssr: false });

const createRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  installed_quantity: z.number({
    invalid_type_error: 'Amount must be a number',
    coerce: true,
  }),
  title: z.string(),

  spare_quantity: z.number({
    invalid_type_error: 'Amount must be a number',
    coerce: true,
  }),
});

type CreateRequestFormFields = z.infer<typeof createRequestSchema>;

// rewrite this to use a context exposing controls to trigger its open states
const RejectRequestModal = () => {
  const { isOpen, onOpenChange } = useManagerRequestContext();
  const [textValue, setTextValue] = React.useState<string>('');

  const { mutate, isPending: isCreateRequestPending } = useCreateRequest();

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
  };

  const onSubmit = async (values: CreateRequestFormFields) => {
    console.log({ values });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseForm} modal={true}>
      <DialogContent className="min-w-[550px] !bg-white p-4">
        <section className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <DialogHeader>
              <h4 className="font-bold">Reject Request?</h4>
              <Text size={'xs'}>{'Are you sure you’d like to cancel this request? This is not reversible!'}</Text>
            </DialogHeader>
            <DialogClose className=" hover:bg-gray/10 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground right-4 top-4 w-fit border-none p-1 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none">
              {/* <X className="h-4 w-4" /> */}
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </section>
        <div className="my-2 h-[0.2px] w-full bg-slate-300"></div>
        <Text size={'sm'} className="font-light italic text-gray-700">
          Add a note for the Initiator
        </Text>
        <section className="pb-4">
          <TextEditor value={textValue} setValue={setTextValue} />
        </section>
        <div className="h-[0.5px] w-full bg-slate-300"></div>
        <div className="flex w-full justify-end">
          <Button className="text-dim me-4 border bg-transparent">No, I don't</Button>
          <Button className="bg-red-500" disabled={textValue.length < 5}>
            Yes, Reject Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectRequestModal;
