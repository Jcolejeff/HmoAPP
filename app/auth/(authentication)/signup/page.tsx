'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import React, { Suspense } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

import processError from '@/lib/error';
import { $http, addAccessTokenToHttpInstance } from '@/lib/http';
import { url } from '@/lib/utils';

const signUpSchema = z.object({
  first_name: z.string().trim().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  last_name: z.string().trim().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email().toLowerCase().trim().min(2, {
    message: 'Email must be at least 2 characters',
  }),

  password: z.string().min(8, {
    message: 'password must be at least 8 characters.',
  }),
});
type SignupFormFields = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const searchParams = useSearchParams();
  const [validSubmit, setValidSubmit] = useState(false);
  const [agreeToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const googleLogin = async () => {
    return;
  };

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(values: SignupFormFields) {
    setIsLoading(true);
    try {
      const { data } = await $http.post('/auth/signup', values);

      localStorage.setItem('access_token', data.access_token);
      addAccessTokenToHttpInstance(data.access_token);

      toast('Signup successful');
      window.location.href = '/workspace';
    } catch (error) {
      if (error instanceof AxiosError) {
        processError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!form.formState.isValid || !agreeToTerms) {
      setValidSubmit(false);
    } else {
      setValidSubmit(true);
    }
  }, [agreeToTerms, form.formState.isValid]);

  useEffect(() => {
    const inviteeEmail = searchParams.get('email');
    if (inviteeEmail) {
      form.setValue('email', inviteeEmail);
    }
  }, [searchParams]);

  return (
    <Suspense fallback={<div></div>}>
      <div className="container h-full">
        <section className="mx-auto flex h-full min-h-full max-w-lg flex-col justify-center py-12">
          <Text weight={'bold'} size={'xl'} className="my-4 text-center md:text-[1.4rem]">
            Create your new account
          </Text>
          <Text size={'sm'} className="mb-6 text-center">
            Let&apos;s get started with your HMO account
          </Text>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[100%] flex-col gap-3">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]">
                <TextField
                  control={form.control}
                  required
                  name="first_name"
                  label="First name"
                  placeholder="First name"
                  className="rounded-md py-6 focus:border-primary-2"
                />
                <TextField
                  control={form.control}
                  required
                  name="last_name"
                  label="Last name"
                  placeholder="Last name"
                  className="rounded-md py-6 focus:border-primary-2"
                />
              </div>
              <div>
                <TextField
                  control={form.control}
                  required
                  name="email"
                  label="Your email"
                  placeholder="yourmail@sample.com"
                  className="rounded-md py-6 focus:border-primary-2"
                />
              </div>

              <div className="bord">
                <TextField
                  control={form.control}
                  required
                  name="password"
                  label="Create a password"
                  placeholder="Password (minimum of 8 characters)"
                  className="rounded-md py-6 focus-within:ring-0 focus:border-primary-2 focus:ring-0 focus-visible:ring-0"
                  type={showPassword ? 'text' : 'password'}
                  showpassword={showPassword}
                  setshowpassword={setShowPassword}
                />
              </div>

              <div className="flex w-full items-start lg:items-center">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  value=""
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  onChange={e => setAgreedToTerms(e.target.checked)}
                />
                <label className="ms-2 text-xs font-medium text-gray-400">
                  I agree to HMO’s{' '}
                  <Text as={'span'} size={'xs'} className="cursor-pointer text-primary-2" style={{ display: 'inline' }}>
                    privacy policy
                  </Text>{' '}
                  and{' '}
                  <Text as={'span'} size={'xs'} className="cursor-pointer text-primary-2" style={{ display: 'inline' }}>
                    terms and conditions.
                  </Text>
                </label>
              </div>
              <Button
                type="submit"
                className={` ${!validSubmit ? 'bg-slate-500' : 'bg-primary-2'} w-full rounded-md py-4 text-base`}
                disabled={!validSubmit || isLoading ? true : false}
              >
                {isLoading ? <Spinner /> : 'Get started'}
              </Button>
            </form>
          </Form>
          <div className="mx-auto my-6 flex w-1/2 items-center justify-center gap-4">
            <div className="w-[50%] border-t "></div>
            <Text size={'sm'} className="leading-[24px] tracking-[0.15px] text-gray-400">
              Or
            </Text>
            <div className="w-[50%] border-t "></div>
          </div>
          {/* <button
            disabled={isLoading}
            onClick={() => googleLogin()}
            type="submit"
            className="shadow-3 flex w-full items-center justify-center gap-4  rounded-md border  py-4 text-[1rem] font-[500]  shadow-md transition-opacity duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:opacity-50"
          >
            <Image width={30} height={30} src={url('/images/auth/googleIcon.svg')} alt="" className="" />
            <Text size={'sm'} className="font-normal leading-[0.46px]">
              Sign up with your Google account
            </Text>
          </button> */}
          <div className="">
            <Text
              size={'sm'}
              className="shadow-3 flex w-full items-center justify-center gap-2 rounded-md border py-4 font-normal shadow-md transition-opacity duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:opacity-50"
            >
              Have an account already?
              <Link href="/auth/signin" className="text-primary-2 no-underline transition duration-150 hover:underline">
                Sign in
              </Link>
            </Text>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default SignUp;
