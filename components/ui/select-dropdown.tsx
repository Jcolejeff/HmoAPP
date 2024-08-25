import { ComponentProps } from 'react';

import { cn } from '@/lib/utils/css';

import { MultiSelect, MultiSelectProps } from './multi-select';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type SelectDropDownProps<T extends {}> = {
  className?: string;
} & MultiSelectProps<T> &
  ComponentProps<typeof Popover>;

const SelectDropDown = <T extends {}>({
  children,
  className,
  onOpenChange,
  open,

  ...props
}: SelectDropDownProps<T>) => {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>{children ? children : ''}</PopoverTrigger>
      <PopoverContent
        className={cn('popover-background popover-backdrop-filter popover-shadow popover-border w-fit p-0', className)}
        align="start"
      >
        <MultiSelect {...props} />
      </PopoverContent>
    </Popover>
  );
};

export default SelectDropDown;
