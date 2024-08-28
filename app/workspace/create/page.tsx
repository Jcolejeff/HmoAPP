'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { inputVariants } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

import processError from '@/lib/error';
import { $http } from '@/lib/http';
import { workspaceKeys } from '@/lib/react-query/query-keys';

import { useUserContext } from '@/domains/user/contexts/user-context';

const createOrganizationSchema = z.object({
  name: z.string(),
  country: z.string(),
  state: z.string(),
  address: z.string(),
  phone: z.string(),
});

type CreateOrganizationFormFields = z.infer<typeof createOrganizationSchema>;

const CreateOrganization = () => {
  const { user, setCurrentWorkspaceRole } = useUserContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      country: 'Nigeria',
      state: 'Plateau',
      address: '',
      phone: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: CreateOrganizationFormFields) => {
    try {
      const { data } = await $http.post('/organizations', values); // refactor to use react-query mutation

      sessionStorage.setItem('currentWorkspace', JSON.stringify(data));

      toast(`Workspace "${values.name}" created successfully!`);
      setCurrentWorkspaceRole('Manager');
      queryClient.cancelQueries({ queryKey: workspaceKeys.list() });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });

      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof AxiosError) processError(error);
    }
  };

  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 px-6 py-8 lg:px-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1 text-sm">
          <Text size={'xs'} className="text-gray-400">
            Logged in as
          </Text>
          <Text size={'xs'}>{user?.email}</Text>
        </div>
        <Button variant={'ghost'} className="text-sm font-medium text-red-500 underline">
          Log out
        </Button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-[30rem]">
        <Text
          size={'2xl'}
          as={'h2'}
          weight={'bold'}
          className="mt-10 text-center leading-9 tracking-tight text-gray-900"
        >
          Create a new workspace
        </Text>
        <Text weight={'normal'} size={'sm'} className="mt-4 text-center text-gray-400">
          Create a workspace to use continue
        </Text>
        {/* {error ? <pre className="text-center text-red-400">{error}</pre> : null} */}
      </div>

      <section className="sm:mx-auto sm:w-full sm:max-w-[37rem]">
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <TextField
              control={form.control}
              placeholder="Meta Inc"
              required
              name="name"
              label="Organization name"
              className="rounded-md focus:border-primary-2"
            />
            <section className="grid grid-cols-2 gap-2 pb-2">
              <div>
                <Label htmlFor="country" className="mb-2 text-xs text-text-dim">
                  Country
                </Label>
                <CountryDropdown
                  classes={inputVariants({ variant: 'default', customSize: 'lg' })}
                  name={'country'}
                  defaultOptionLabel="Choose country"
                  value={form.watch('country')}
                  onChange={country => {
                    form.setValue('country', country);
                  }}
                />
              </div>

              <div>
                <Label htmlFor="state" className="mb-2 text-xs text-text-dim">
                  State
                </Label>
                <RegionDropdown
                  classes={inputVariants({ variant: 'default', customSize: 'lg' })}
                  name={'state'}
                  defaultOptionLabel="Select state or region"
                  blankOptionLabel="Select state or region"
                  country={form.watch('country')}
                  value={form.watch('state')}
                  onChange={state => {
                    form.setValue('state', state);
                  }}
                />
              </div>
            </section>
            <TextField
              control={form.control}
              required
              name="address"
              label="Address"
              placeholder="Enter your business location"
              className="rounded-md focus:border-primary-2"
            />
            <TextField
              control={form.control}
              required
              name="phone"
              type="tel"
              label="Phone number"
              placeholder="Enter phone number"
              className="rounded-md focus:border-primary-2"
            />
            <div>
              <Button
                type="submit"
                isFullWidth={true}
                className={`${!form.formState.isValid ? 'bg-slate-500' : 'bg-primary-2'} w-full rounded-md p-4 text-base`}
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : 'Continue'}
              </Button>
              <Text size={'xs'} className="mt-2 text-center">
                By signing up you agree to the terms of service and data processing agreement
              </Text>
            </div>
          </form>
        </Form>
      </section>
    </section>
  );
};

export default CreateOrganization;
