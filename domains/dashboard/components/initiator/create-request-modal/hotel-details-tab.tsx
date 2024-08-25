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

const defaultHotels: hotel[] = [
  {
    organization_id: 2,
    hotel_name: 'Hilton',
    state: 'Federal Capital Territory',
    city: 'abuja',
    country: 'nigeria',
    id: 5,
    is_deleted: false,
    date_created: '2024-08-14T15:10:48',
    last_updated: '2024-08-14T15:10:48',
  },
  {
    organization_id: 2,
    hotel_name: 'Sheraton',
    state: 'plateau',
    city: 'jos',
    country: 'nigeria',
    id: 6,
    is_deleted: false,
    date_created: '2024-08-14T15:11:03',
    last_updated: '2024-08-14T15:11:03',
  },
  {
    organization_id: 2,
    hotel_name: 'Eko Hotels',
    state: 'lagos',
    city: 'lagos',
    country: 'nigeria',
    id: 7,
    is_deleted: false,
    date_created: '2024-08-14T15:11:22',
    last_updated: '2024-08-14T15:11:22',
  },
];
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
  room: z.string(),

  start_date: z.date({
    required_error: 'A start date is required',
  }),
  end_date: z.date({
    required_error: 'An end date is required',
  }),

  hotel_name: z.string(),
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

  const [roomPrice, setRoomPrice] = useState<number>(isEditMode ? createRequestData?.rate! : 0);
  const [hotelId, setHotelId] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(isEditMode ? createRequestData?.city! : null);
  const [state, setState] = useState<string | null>(isEditMode ? createRequestData?.state! : null);
  const [country, setCountry] = useState<string | null>(isEditMode ? createRequestData?.country! : null);
  const { data: approvedHotels, isPending } = useGetApprovedHotels(country!, state!, city!);
  const form = useForm<CreateRequestFormFields>({
    resolver: zodResolver(createRequestSchema),
    mode: 'onSubmit',
    defaultValues: isEditMode
      ? {
          hotel_name: createRequestData?.hotel,
          room: createRequestData?.room,

          start_date: new Date(createRequestData?.start ?? new Date()),
          end_date: new Date(createRequestData?.end ?? new Date()),
        }
      : {},
  });

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
    form.reset();
    setActiveTab('travel-details');
  };

  const onSubmit: SubmitHandler<CreateRequestFormFields> = async values => {
    if (values.end_date.getTime() < values.start_date.getTime()) {
      toast.error('Travel End Date Cannot Be Before Travel Start Date.');
      return;
    }
    if (values.start_date.getTime() < new Date().getTime()) {
      toast.error('Travel Start Date Cannot Be Before Today.');
      return;
    }

    setCreateRequestData({
      ...createRequestData,
      hotel: values.hotel_name,
      room: values.room,

      start: formatDate(values.start_date, 'yyyy-MM-dd'),
      end: formatDate(values.end_date, 'yyyy-MM-dd'),
      state: state!,
      city: city ? city : state!,
      rate: roomPrice!,

      country: country!,
    });
    switchTab(tabData[2]);
    handleComplete(tabData[1]);
  };

  const setSelectedHotelFromSidebar = (hotel: { name: string; id: string | number }) => {
    form.setValue('hotel_name', hotel.name);
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
          <LocationSelectorAsync
            selectedLocation={selectedLocation}
            setCity={setCity}
            setCountry={setCountry}
            setSelectedLocation={setSelectedLocation}
            setState={setState}
            state={state}
            country={country}
            city={city}
          >
            <div className="flex w-full cursor-pointer items-center gap-3 rounded-md  border px-3 hover:bg-slate-100">
              <Label htmlFor="location" className=" first-letter: text-black ">
                Location
              </Label>

              <Button
                className="flex w-full   cursor-default justify-between bg-transparent py-3  "
                variant="ghost"
                size="none"
                type="button"
              >
                <Text
                  weight={'medium'}
                  variant={'secondary'}
                  size={'xs'}
                  className="block truncate hover:text-slate-600"
                >
                  {selectedLocation || 'Search Location'}
                </Text>
                <MapPin size={16} className="text-text-dim" />
              </Button>
            </div>
          </LocationSelectorAsync>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr]">
            <CalendarInput
              control={form.control}
              required
              name="start_date"
              label="Start date"
              placeholder="Select start date"
            />
            <CalendarInput
              control={form.control}
              required
              name="end_date"
              label="End date"
              placeholder="Select end date"
            />
          </div>

          <Show>
            <Show.When isTrue={approvedHotels && approvedHotels.length > 0 ? true : false}>
              <div>
                <Label htmlFor="room" className=" first-letter: mb-3 inline-block uppercase">
                  Approved hotels
                </Label>
                <div className="flex gap-4 overflow-scroll">
                  {isPending ? (
                    <Spinner />
                  ) : (
                    approvedHotels?.map((hotel, index) => {
                      return (
                        <Button
                          key={index}
                          className="flex  justify-between border bg-transparent px-4 py-2  "
                          variant="ghost"
                          type="button"
                          size="none"
                          onClick={() => {
                            form.setValue('hotel_name', hotel.hotel_name);
                            getHotelIdFromName(hotel.hotel_name);
                          }}
                        >
                          <Text
                            weight={'medium'}
                            size={'xs'}
                            className="block truncate capitalize  hover:text-slate-600"
                          >
                            {hotel.hotel_name}
                          </Text>
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>
              <Text weight={'medium'} size={'xs'} className="text-end text-text-dim">
                Hotel not in list of approved?
              </Text>
            </Show.When>
          </Show>

          <div className="flex gap-2">
            <div className="flex w-full cursor-pointer items-center gap-3 rounded-md  border px-3 hover:bg-slate-100">
              <Label htmlFor="room" className=" first-letter: whitespace-nowrap text-black ">
                Hotel
              </Label>

              <HotelSelectorDropdown
                onSelect={value => {
                  form.setValue('hotel_name', value.hotel_name);
                  getHotelIdFromName(value.hotel_name);
                }}
                hotels={approvedHotels ? approvedHotels : []}
              >
                <Button
                  className="flex w-full   cursor-default justify-between bg-transparent py-3  "
                  variant="ghost"
                  size="none"
                >
                  <Text
                    weight={'medium'}
                    variant={'secondary'}
                    size={'xs'}
                    className="block truncate hover:text-slate-600"
                  >
                    {form.watch('hotel_name') ? form.getValues('hotel_name') : 'Select hotel'}
                  </Text>
                </Button>
              </HotelSelectorDropdown>
            </div>
            <Button
              className="flex  justify-between border bg-transparent px-4 py-3  "
              variant="ghost"
              size="none"
              type="button"
              onClick={() => {
                setOpenHotelSideBar(!openHotelSideBar);
              }}
            >
              <QrCode size={16} className="text-text-dim" />
              <Text weight={'medium'} size={'xs'} className="block truncate hover:text-slate-600">
                Browse hotels
              </Text>
            </Button>
          </div>

          <div className="flex w-full cursor-pointer items-center gap-3 rounded-md  border px-3 hover:bg-slate-100">
            <Label htmlFor="room" className=" first-letter: whitespace-nowrap text-black ">
              Room type:
            </Label>

            <RoomSelectorDropdown
              onSelect={value => {
                setRoomPrice(value.current_price);
                form.setValue('room', value.name);
              }}
              hotelId={hotelId}
            >
              <Button
                className="flex w-full   cursor-default justify-between bg-transparent py-3"
                variant="ghost"
                size="none"
              >
                <Text
                  weight={'medium'}
                  variant={'secondary'}
                  size={'xs'}
                  className="block truncate hover:text-slate-600"
                >
                  {form.watch('room') ? `${form.getValues('room')} - ${formatToNaira(roomPrice)}` : 'Select room'}
                </Text>
                <ChevronDown size={16} className="text-text-dim" />
              </Button>
            </RoomSelectorDropdown>
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
                disabled={!form.getValues('hotel_name') || !form.getValues('room')}
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
