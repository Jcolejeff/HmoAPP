import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from 'date-fns';
import { Barcode, ChevronDown, Map, MapPin, QrCode, X } from 'lucide-react';
import { is } from 'ramda';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Show } from '@/components/shared/show-conditionally';
import { Button } from '@/components/ui/button';
import CalendarInput from '@/components/ui/calender-input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

import { $http } from '@/lib/http';
import { formatToNaira } from '@/lib/utils';

import { useGetApprovedHotels } from '@/domains/dashboard/hooks/initiator/use-get-approved-hotels';
import { hotel, TabsNames } from '@/domains/dashboard/type/initiator';
import { GetHotelsResponse } from '@/domains/hotels/hooks/use-browse-more-hotels';
import { useDebounceBrowseMoreHotels } from '@/domains/hotels/hooks/use-debounce-browse-more-hotels';
import { useCreateRequest } from '@/domains/requests/hooks/use-create-request';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';
import { Hotel, RoomType } from '@/types';

import { useCreateRequestContext } from '../../../context/initiator/create-request-context';
import BrowseHotelSidebar from '../browse-hotels-sidebar';
import { HotelSelectorDropdown } from '../hotel-selector';
import LocationSelectorAsync from '../location-async-selector';
import { RoomSelectorDropdown } from '../room-type-selector';

interface Iprops {
  switchTab: (tab: TabsNames) => void;
  handleComplete: (tab: TabsNames) => void;
  data: TabsNames[];
}

interface IDataItem {
  name: string;
  type: string;
}
const createRequestSchema = z.object({
  phone: z.string(),

  start_date: z.date({
    required_error: 'A start date is required',
  }),

  faculty_name: z.string(),
  level: z.string(),
  school_email: z.string(),
  department_name: z.string(),
  matric_number: z.string(),
});
type CreateRequestFormFields = z.infer<typeof createRequestSchema>;

const HotelDetailsTab = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  const {
    open,
    onOpenChange,
    createMore,
    setCreateMore,
    setOpenHotelSideBar,
    openHotelSideBar,
    setActiveTab,
    setCreateRequestData,
    createRequestData,
    isEditMode,
  } = useCreateRequestContext();

  const { currentWorkspace } = useWorkspaceContext();

  const [roomPrice, setRoomPrice] = useState<number>(isEditMode ? createRequestData?.rate! : 33320);
  const [hotelId, setHotelId] = useState<string>('');
  const [city, setCity] = useState<string | null>(isEditMode ? createRequestData?.city! : null);
  const [state, setState] = useState<string | null>(isEditMode ? createRequestData?.state! : null);
  const [country, setCountry] = useState<string | null>(isEditMode ? createRequestData?.country! : null);
  const { data: approvedHotels, isPending } = useGetApprovedHotels(country!, state!, city!);
  const form = useForm<CreateRequestFormFields>({
    resolver: zodResolver(createRequestSchema),
    mode: 'onSubmit',
    defaultValues: isEditMode
      ? {
          faculty_name: createRequestData?.hotel ?? 'jos hotel',
          phone: createRequestData?.room ?? 'standard',

          start_date: new Date(createRequestData?.start ?? new Date()),
        }
      : {},
  });

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
    form.reset();
    setActiveTab('travel-details');
  };

  const onSubmit: SubmitHandler<CreateRequestFormFields> = async values => {
    setCreateRequestData({
      ...createRequestData,
      hotel: values.faculty_name,
      room: values.phone,

      start: formatDate(values.start_date, 'yyyy-MM-dd'),
      end: formatDate(values.start_date, 'yyyy-MM-dd'),
      state: values.department_name,
      city: values.matric_number,
      rate: parseInt(values.level, 10),

      country: values.school_email,
    });
    switchTab(tabData[2]);
    handleComplete(tabData[1]);
  };

  const setSelectedHotelFromSidebar = (hotel: { name: string; id: string | number }) => {
    form.setValue('faculty_name', hotel.name);
    setHotelId(hotel.id as string);
  };

  const getHotelIdFromName = async (hotelName: string) => {
    const { data } = await $http.get<GetHotelsResponse>('/hotels/index', {
      params: {
        search_value: hotelName,
        organization_id: currentWorkspace?.id!,
        size: 10,
      },
    });
    if (data.items.length > 0) {
      const hotel = data.items.find(hotel => hotel.business_name === hotelName);
      setHotelId(hotel?.id!);
    }
  };

  return (
    <TabsContent value="hotel-details" className="h-full w-full ">
      <BrowseHotelSidebar
        country={country}
        state={state}
        city={city}
        setSelectedHotelFromSidebar={setSelectedHotelFromSidebar}
      />

      <Form {...form}>
        <form className="w-full space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
            <TextField
              control={form.control}
              required
              name="faculty_name"
              label="Faculty name"
              placeholder="Enter faculty name"
            />
            <TextField
              control={form.control}
              required
              name="department_name"
              label="Department Name"
              placeholder="Enter department name"
            />
          </div>
          <TextField
            control={form.control}
            required
            name="matric_number"
            label="Matriculation Number"
            placeholder="Enter matriculation number"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
            <CalendarInput
              control={form.control}
              required
              name="start_date"
              label="Issue start date"
              placeholder="Select start date"
            />
            <TextField control={form.control} required name="phone" label="Phone" placeholder="Enter phone number" />
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            <TextField
              control={form.control}
              required
              name="school_email"
              label="School email"
              placeholder="Enter school email"
            />

            <TextField control={form.control} required name="level" label="Level" placeholder="Enter level" />
          </div>

          <div className="flex justify-between gap-4 py-2">
            <Button
              onClick={() => {
                switchTab(tabData[0]);
              }}
              type="button"
              className="shadow-9 group  flex w-max items-center justify-center gap-2 rounded-[6px] border bg-white px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-2"
            >
              <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
                {`Previous`}
              </Text>
            </Button>
            <div className=" flex gap-4">
              <Button
                onClick={() => {
                  onCloseForm(false);
                }}
                type="button"
                className="shadow-9 group  flex w-max items-center justify-center gap-2 rounded-[6px] border bg-white px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-2"
              >
                <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
                  {`Cancel`}
                </Text>
              </Button>
              <Button
                type="submit"
                disabled={!form.getValues('faculty_name') || !form.getValues('phone')}
                className="px-6 text-xs"
              >
                {form.formState.isSubmitting ? <Spinner /> : 'Continue'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
};

export default HotelDetailsTab;
