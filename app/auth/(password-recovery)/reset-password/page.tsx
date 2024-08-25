'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Spinner from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import TextField from '@/components/ui/text-field';

const resetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'password must be at least 2 characters.',
  }),
  confirm_password: z.string().min(8, {
    message: 'password must be at least 2 characters.',
  }),
});

type ResetPasswordFormFields = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [noMatchError, setNoMatchError] = React.useState('');

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
    mode: 'onSubmit',
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ResetPasswordFormFields) => {
    console.log(values);
    if (values.password !== values.confirm_password) {
      setNoMatchError('Passwords do not match');
      return;
    }
    setNoMatchError('Passwords match');
  };

  return (
    <section className="container">
      <section className="mx-auto flex h-screen max-w-lg flex-col justify-center py-32">
        <Text size={'xl'} weight={'bold'} className="my-3 text-center capitalize md:text-[1.4rem]">
          reset password
        </Text>
        <Text className="mb-4 text-center font-[400] md:text-[0.9rem]">Set a new password for your account.</Text>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%]">
            <div className="bord mb-5">
              <TextField
                control={form.control}
                required
                name="password"
                label="New Password"
                placeholder="New Password (Minimum of 8 characters)"
                className="rounded-md py-6 focus-within:ring-0 focus:border-primary-2 focus:ring-0 focus-visible:ring-0"
                type={showPassword ? 'text' : 'password'}
                showpassword={showPassword}
                setshowpassword={setShowPassword}
              />
            </div>
            <div className="bord mb-5">
              <TextField
                control={form.control}
                required
                name="confirm_password"
                label="Confirm Password"
                placeholder="Confirm Password (Minimum of 8 characters)"
                className="rounded-md py-6 focus-within:ring-0 focus:border-primary-2 focus:ring-0 focus-visible:ring-0"
                type={showConfirmPassword ? 'text' : 'password'}
                showpassword={showConfirmPassword}
                setshowpassword={setShowConfirmPassword}
              />
              <p className={`text-sm ${noMatchError === 'Passwords do not match' ? 'text-red-500' : 'text-primary-2'}`}>
                {noMatchError}
              </p>
            </div>

            <Button
              type="submit"
              className={` ${!form.formState.isValid ? 'bg-slate-500' : 'bg-primary-2'} w-full rounded-md py-4 text-base`}
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting ? <Spinner /> : 'Reset Password'}
            </Button>
          </form>
        </Form>
      </section>
    </section>
  );
};

export default ResetPassword;
