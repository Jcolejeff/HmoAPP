'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils/css';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input, InputProps } from './input';
import { Label } from './label';
import { Text } from './text';

export interface TextFieldProps extends InputProps {
  control: Control<any, any>;
  name: string;
  label?: string;
  showPassword?: boolean;
  setShowPassword?: (value: boolean) => void;
}

function CalendarInput({ control, name, label, placeholder = name, ...rest }: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="pb-2">
          <div className="relative">
            <FormControl>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <div className=" flex  cursor-pointer flex-col  gap-2 rounded-md  py-2">
                        <FormLabel className="block  ">{label && label}</FormLabel>
                        <Button
                          type="button"
                          variant={'ghost'}
                          className={cn(
                            'flex w-[240px] justify-between border text-xs font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <Text variant={'secondary'} size={'xs'}>
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          </Text>
                          <CalendarIcon className="absolute right-2 h-4 w-4 opacity-50" />
                        </Button>
                      </div>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
          </div>
          <FormMessage className="text-xs text-rose-600" />
        </FormItem>
      )}
    />
  );
}

export default CalendarInput;
