'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { inputVariants } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

import processError from '@/lib/error';

import { HotelFromIndexShape } from '@/types';

import { useHotelContext } from '../context/hotel-context';
import { useCreateHotel } from '../hooks/create-hotel';

import HotelSearch from './hotel-search-input';

const hotelFormSchema = z.object({
  hotel_name: z.string({ required_error: 'Hotel name is required.' }).min(2).max(300),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
});

const CreateHotelForm = () => {
  const { mutate: createHotel, isPending } = useCreateHotel();
  const [selectedHotel, setSelectedHotel] = useState<HotelFromIndexShape | null>(null);

  const { open, onOpenChange } = useHotelContext();
  const form = useForm<z.infer<typeof hotelFormSchema>>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      hotel_name: '',
      city: '',
      state: '',
      country: '',
    },
  });
  const onSubmit = (values: z.infer<typeof hotelFormSchema>) => {
    createHotel(
      {
        hotel_name: values.hotel_name,
        city: values.city,
        state: values.state === 'Abuja Federal Capital Territory' ? 'Abuja' : values.state,
        country: values.country,
      },
      {
        onSuccess: () => {
          toast.success(`Hotel Added Successfully`);
          onOpenChange(false);
        },
        onError: error => {
          console.log({ error });
          if (error instanceof AxiosError) processError(error);
        },
      },
    );
  };

  const handleSelectHotel = (hotel: HotelFromIndexShape) => {
    setSelectedHotel(hotel);
    form.setValue('hotel_name', hotel.business_name);
    form.setValue('city', hotel.locations[0].city);
    form.setValue(
      'state',
      hotel.locations[0].state === 'Abuja' ? 'Abuja Federal Capital Territory' : hotel.locations[0].state,
    );
    form.setValue('country', hotel.locations[0].country);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <HotelSearch selectedHotel={selectedHotel} setSelectedHotel={handleSelectHotel}>
          <div className=" w-full cursor-pointer items-center gap-3 rounded-md ">
            <Label htmlFor="location" className=" ">
              Hotel Name
            </Label>

            <Button
              className="mt-2 flex w-full cursor-default justify-between border bg-transparent px-3 py-2  "
              variant="ghost"
              size="none"
              type="button"
            >
              <Text weight={'medium'} variant={'secondary'} size={'xs'} className="block truncate hover:text-slate-600">
                {selectedHotel?.business_name || 'Search Hotel'}
              </Text>
            </Button>
          </div>
        </HotelSearch>
        {/* 
        <TextField
          control={form.control}
          placeholder="Best Western Inn"
          required
          name="hotel_name"
          label="Hotel Name"
          className="rounded-md focus:border-primary-2"
        /> */}
        <section className="grid grid-cols-2 gap-2">
          <div>
            <FormLabel htmlFor="country">Country</FormLabel>
            <CountryDropdown
              classes={inputVariants({ variant: 'default', customSize: 'lg' })}
              name={'country'}
              defaultOptionLabel="Choose country"
              value={form.watch('country')}
              onChange={country => {
                form.setValue('country', country);
                console.log('country', form.getValues());
              }}
            />
          </div>

          <div>
            <FormLabel htmlFor="state">State</FormLabel>
            <RegionDropdown
              classes={inputVariants({ variant: 'default', customSize: 'lg' })}
              name={'state'}
              defaultOptionLabel="Select state or region"
              blankOptionLabel="Select state or region"
              country={form.watch('country')}
              value={form.watch('state')}
              onChange={state => {
                form.setValue('state', state);
                console.log('state', form.getValues());
              }}
            />
          </div>
        </section>
        <section className="w-1/2">
          <TextField
            control={form.control}
            placeholder="City"
            name="city"
            label="City"
            className="rounded-md focus:border-primary-2"
          />
        </section>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateHotelForm;
