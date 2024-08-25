'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, Suspense } from 'react';
import { useState } from 'react';
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

const signInSchema = z.object({
  email: z.string().email().toLowerCase().trim().min(2, {
    message: 'Email must be at least 2 characters',
  }),

  password: z.string().min(6, {
    message: 'password must be at least 6 characters.',
  }),
});

type SignInFormFields = z.infer<typeof signInSchema>;

const SignIn = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);

  const googleLogin = async () => {
    return;
  };

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: SignInFormFields) => {
    setIsLoading(true);
    try {
      const { data } = await $http.post('/auth/login', values);

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_orgs', JSON.stringify(data.data.user_orgs));
      addAccessTokenToHttpInstance(data.access_token);

      toast('Login successful');

      window.location.href = '/workspace';
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        processError(error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const inviteeEmail = searchParams.get('email');
    if (inviteeEmail) {
      form.setValue('email', inviteeEmail);
    }
  }, [searchParams]);

  return (
    <Suspense fallback={<div></div>}>
      <div className="container flex h-[100vh] items-center justify-center">
        <section className="flex w-full flex-col justify-center rounded-lg border border-slate-50 p-6 shadow-md md:w-[70%] md:p-8 lg:w-[45%]">
          <div className="mb-6">
            <Text
              as={'p'}
              weight={'bold'}
              size={'xl'}
              className=" flex w-full items-center justify-center gap-2 rounded-md border-b py-4   transition-opacity duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:opacity-50"
            >
              HMO portal
            </Text>
          </div>
          <div className="flex flex-col items-start">
            <Text weight={'bold'} size={'lg'} className="my-1 text-center ">
              Sign in
            </Text>
            <Text weight={'normal'} className="text-start text-[0.8rem] md:text-[0.9rem]">
              Sign in to continue to your account.
            </Text>
          </div>
          <hr className="my-3" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%]">
              <div className="mb-5 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]"></div>
              <div className="mb-2">
                <TextField
                  control={form.control}
                  required
                  name="email"
                  label="Email address"
                  placeholder="yourmail@sample.com"
                  className="rounded-md py-6"
                  disabled={!!searchParams.get('email')}
                />
              </div>

              <div className="mb-2">
                <TextField
                  control={form.control}
                  required
                  name="password"
                  label="Password"
                  placeholder="password"
                  className=" rounded-md py-6 focus-within:ring-0 focus:ring-0 focus-visible:ring-0"
                  type={showPassword ? 'text' : 'password'}
                  showpassword={showPassword}
                  setshowpassword={setShowPassword}
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <label className="ms-2 w-max text-xs font-medium text-gray-400">Remain signed in</label>
                </div>
                <Link href="/auth/forgot-password" className="w-fit text-end">
                  <Text size={'xs'} className="text-primary-2">
                    Forgot password?
                  </Text>
                </Link>
              </div>
              <Button
                type="submit"
                className={` ${!form.formState.isValid ? 'bg-slate-500' : 'bg-black'} mt-8 w-full rounded-md py-4 text-base`}
                disabled={!form.formState.isValid || isLoading ? true : false}
              >
                {isLoading ? <Spinner /> : 'Sign in'}
              </Button>
            </form>
          </Form>
          <div className="mt-6">
            <Text
              as={'p'}
              size={'sm'}
              className="shadow-3 flex w-full items-center justify-center gap-2 rounded-md border py-4 font-normal shadow-md transition-opacity duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:opacity-50"
            >
              Don&apos;t have an account?
              <Link href="/auth/signup" className="text-primary-2 no-underline transition duration-150 hover:underline">
                Sign up
              </Link>
            </Text>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default SignIn;
