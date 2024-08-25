import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { formatDate } from 'date-fns';
import { on } from 'events';
import { Map, MapPin, X } from 'lucide-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';
import { Textarea } from '@/components/ui/textarea';

import processError from '@/lib/error';

import { useCreateRequest } from '@/domains/requests/hooks/use-create-request';

import { useCreateRequestContext } from '../../dashboard/context/initiator/create-request-context';
import { useDepartmentsRequestContext } from '../context/departments-request-provider';
import { TabsNames } from '../type';

import DepartmentInput from './department-input';

interface Iprops {
  switchTab: (tab: TabsNames) => void;
  handleComplete: (tab: TabsNames) => void;
  data: TabsNames[];
}
const createRequestSchema = z.object({
  location: z.string(),
  start_date: z.date({
    required_error: 'A start date is required',
  }),
  end_date: z.date({
    required_error: 'An end date is required',
  }),
  purpose: z.string(),
});

type CreateRequestFormFields = z.infer<typeof createRequestSchema>;

const CreateDepartmentName = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  const {
    onOpenChange,
    createDepartmentName,
    setCreateDepartmentName,
    createDepartmentDescription,
    setCreateDepartmentDescription,
  } = useDepartmentsRequestContext();

  const form = useForm<CreateRequestFormFields>({
    resolver: zodResolver(createRequestSchema),

    mode: 'onSubmit',
  });

  return (
    <TabsContent value="create-department" className="h-full w-full    border-t ">
      <DepartmentInput
        departmentNameLabel="Name:"
        textValue={createDepartmentName}
        setTextValue={setCreateDepartmentName}
        placeHolder="Enter department name"
      />
      <DepartmentInput
        departmentNameLabel="Description:"
        textValue={createDepartmentDescription}
        setTextValue={setCreateDepartmentDescription}
        placeHolder="Enter description"
      />

      <div className="my-6 flex w-full items-center justify-end gap-4">
        <button
          onClick={() => {
            onOpenChange(false);
          }}
          type="button"
          className=" group mt-9 flex w-max items-center justify-center gap-2 rounded-[6px]  border px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 md:px-6 md:py-2"
        >
          <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
            {`Cancel`}
          </Text>
        </button>

        <Button
          onClick={() => {
            switchTab(tabData[1]);
            handleComplete(tabData[0]);
          }}
          disabled={!createDepartmentName}
          type="submit"
          className="group mt-9 flex items-center justify-center gap-2 rounded-[6px] px-4  py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3 "
        >
          Continue
        </Button>
      </div>
    </TabsContent>
  );
};

export default CreateDepartmentName;
