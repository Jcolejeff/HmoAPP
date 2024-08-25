'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import OtpInput from '@/components/ui/otp-input';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

const emailSchema = z.string().email().toLowerCase().trim().min(2, 'Email must be at least 2 characters');
const phoneSchema = z.string().regex(/^(0|\+?[1-9])[0-9]{7,14}$/, 'Invalid phone number');

const ForgotPassword = () => {
  const [resetType, setResetType] = React.useState<'SMS' | 'Email'>('Email');
  const [showOTP, setShowOTP] = React.useState(false);

  const schema = resetType === 'Email' ? z.object({ value: emailSchema }) : z.object({ value: phoneSchema });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { value: '' },
    mode: 'onSubmit',
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: { value: string }) => {
    console.log({ [resetType.toLowerCase()]: values.value });
    if (resetType === 'Email') toast.success('A link to reset your password has been sent! Click here to go to mail.');
    if (resetType === 'SMS') {
      toast.success('An OTP to reset your password has been sent to you via SMS!');
      setShowOTP(true);
    }
  };

  const toggleResetType = () => {
    setResetType(prev => (prev === 'SMS' ? 'Email' : 'SMS'));
    form.reset();
  };

  return (
    <section className="container">
      {showOTP ? (
        <OtpInput />
      ) : (
        <section className="mx-auto flex h-screen max-w-lg flex-col justify-center py-28">
          <Text size={'xl'} weight={'bold'} className="my-3 text-center capitalize md:text-[1.4rem]">
            forgot password?
          </Text>
          <Text size={'sm'} weight={'normal'} className="mb-4 text-center md:text-[0.9rem]">
            Don&apos;t worry! It occurs. Please enter the {resetType === 'SMS' ? 'phone number' : 'email address'}{' '}
            linked with your account. We&apos;ll send you a link to reset our password.
          </Text>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%]">
              <div>
                <TextField
                  control={form.control}
                  required
                  name="value"
                  label={resetType === 'SMS' ? 'Your Phone Number' : 'Your Email'}
                  placeholder={resetType === 'SMS' ? 'Enter your phone number' : 'yourmail@sample.com'}
                  className="rounded-md py-6"
                  disabled={isSubmitting}
                  type={resetType === 'SMS' ? 'tel' : 'email'}
                  inputMode={resetType === 'SMS' ? 'tel' : 'email'}
                />
              </div>
              <div className="flex w-full items-center justify-end">
                <Button
                  isFullWidth={false}
                  variant={'ghost'}
                  type="button"
                  className="font-semibold text-primary-2"
                  onClick={toggleResetType}
                >
                  Use {resetType === 'Email' ? 'SMS' : 'Email'}
                </Button>
              </div>

              <Button
                type="submit"
                className={`${!form.formState.isValid ? 'bg-slate-500' : 'bg-primary-2'} w-full rounded-md py-4 text-base`}
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? <Spinner /> : resetType === 'Email' ? 'Request Link' : 'Request OTP'}
              </Button>
              <Link
                href="/auth/signin"
                className="shadow-3 mt-4 flex w-full items-center justify-center gap-4 rounded-md border py-4 text-[1rem] font-[500] text-primary-2 shadow-md transition-opacity duration-300 ease-in-out hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:opacity-50"
              >
                Return to Login
              </Link>
            </form>
          </Form>
        </section>
      )}
    </section>
  );
};

export default ForgotPassword;
