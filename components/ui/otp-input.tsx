import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from './button';
import { Form } from './form';
import Spinner from './spinner';
import { Text } from './text';

type OTPInputProps = {
  onComplete?: (passcodeValue: any) => void;
};

const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OtpSchemaType = z.infer<typeof otpSchema>;

const OtpInput: React.FC<OTPInputProps> = ({ onComplete }) => {
  const [otp, setOtp] = React.useState<string[]>(new Array(4).fill(''));
  const otpRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const [counter, setCounter] = React.useState(60); // Resend otp timer

  const form = useForm<OtpSchemaType>({
    resolver: zodResolver(otpSchema),
    mode: 'onSubmit',
  });

  const onSubmit = (data: OtpSchemaType) => {};

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    const newOtp = [...otp];

    if (isNaN(Number(value))) return; // Ensure input is a number

    newOtp[index] = value;
    setOtp(newOtp);

    form.setValue('otp', newOtp.join(''), { shouldValidate: true });

    // Auto focus to next input on fill
    if (value && index < newOtp.length - 1) {
      const nextSibling = otpRef.current[index + 1];
      nextSibling?.focus();
    }

    // If all inputs are filled
    if (newOtp.every(num => num !== '')) {
      const completeHandler = onComplete;
      completeHandler && completeHandler(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && e.currentTarget.previousSibling && !otp[index]) {
      // Focus to previous input on backspace
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [counter]);

  const formatTime = (time: number) => {
    const seconds = time % 60 === 0 ? 60 : time % 60;
    return `${seconds}s`;
  };

  // Reminder: Handle resend Otp
  const resendOtp = () => {
    setCounter(60);

    // Resend new OTP
  };

  return (
    <section className="mx-auto flex h-screen max-w-lg flex-col justify-center py-28">
      <Text size={'xl'} weight={'bold'} className="my-3 text-center capitalize md:text-[1.4rem]">
        OTP Verification
      </Text>
      <Text weight={'normal'} className="text-center md:text-[0.9rem]">
        Enter the 4-digit verification code we just sent to your Phone number (*** **** 518).
      </Text>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="my-8 flex flex-col items-center justify-center gap-1">
            <div className="flex justify-center gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={el => {
                    otpRef.current[index] = el;
                    if (index === 0) {
                      form.register('otp');
                    }
                  }}
                  className="otp-input mr-2 h-[3.5rem] w-16 rounded-md border border-gray-300 text-center text-lg font-semibold text-black focus:bg-blue-100 focus:outline-blue-300"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={data}
                  placeholder="-"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                  onFocus={(e: ChangeEvent<HTMLInputElement>) => e.target.select()}
                />
              ))}
            </div>
            {form.formState.errors.otp && (
              <p className="mt-2 text-sm text-red-500">{form.formState.errors.otp.message}</p>
            )}
          </div>
          <Button
            type="button"
            className={` ${otp.some(data => data === '') || !form.formState.isValid ? 'bg-slate-500' : 'bg-primary-2'} w-full rounded-md py-4 text-base`}
            disabled={otp.some(data => data === '') || !form.formState.isValid || form.formState.isSubmitting}
          >
            {!otp ? <Spinner /> : 'Confirm OTP'}
          </Button>
        </form>
      </Form>
      <div className="mt-6">
        <Text
          size={'sm'}
          className="shadow-3 flex w-full items-center justify-center gap-2 rounded-md  border py-4 shadow transition-opacity duration-300 ease-in-out hover:opacity-90"
        >
          Did not receive the OTP?
          <Text size={'sm'} className="text-primary-2">
            <button
              type="button"
              className={`${counter > 0 ? 'text-[gray]' : 'underline'}`}
              onClick={resendOtp}
              disabled={counter > 0}
            >
              Resend
            </button>{' '}
            {counter === 0 ? '' : `in ${formatTime(counter)}`}
          </Text>
        </Text>
      </div>
    </section>
  );
};

export default OtpInput;
