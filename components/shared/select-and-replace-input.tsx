// import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { ChevronDown, CheckIcon } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils/css';

const frameworks = [
  {
    value: 'John Doe',
    label: 'John Doe',
  },
];

const SelectAndReplaceInput = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className=" w-[10rem] justify-between bg-primary-3 text-sm"
          >
            <CircleUserRound className="h-4 w-4 text-gray-500" />

            {value ? frameworks.find(framework => framework.value === value)?.label : 'Unassigned'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className=" p-0">
          <Command className="rounded-lg  shadow-sm">
            <CommandInput placeholder="search..." />
            <CommandList>
              <CommandGroup heading="Suggestions">
                {frameworks.map(framework => (
                  <Button
                    className="w-full bg-white text-black "
                    key={framework.value}
                    onClick={() => {
                      setValue(framework.value);
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    <CheckIcon
                      className={cn('ml-auto h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')}
                    />
                  </Button>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectAndReplaceInput;
