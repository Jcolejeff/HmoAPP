import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner';
// Import Spinner component
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils/css';

import { iOrganizationUser, WorkspaceUser } from '@/types';

interface ComboboxProps {
  users: WorkspaceUser[] | undefined;
  onSelect: (user: WorkspaceUser) => void;
  placeholder?: string;
  buttonClassName?: string;
  loading: boolean;
  innerPlaceholder?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
  users,
  onSelect,
  placeholder = 'Select coworker...',
  buttonClassName,
  loading,
  innerPlaceholder = 'coworker',
}) => {
  const [selectedUser, setSelectedUser] = useState<WorkspaceUser>();
  const [open, setOpen] = useState(false);

  const handleUserSelect = (user: WorkspaceUser) => {
    setSelectedUser(user);
    onSelect(user);
    setOpen(false);
  };

  useEffect(() => {});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[300px] justify-between', buttonClassName)}
          disabled={loading}
        >
          {loading ? <Text size={'xs'}>Loading...</Text> : <Text size={'xs'}>{placeholder}</Text>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Spinner /> {/* Spinner while loading */}
          </div>
        )}

        {!loading && users ? (
          <Command>
            <CommandInput size={8} className="text-sm" placeholder={`Search ${innerPlaceholder}...`} />
            <CommandList>
              {Array.isArray(users) && users.length > 0 ? (
                <CommandGroup>
                  {users.map((user: WorkspaceUser) => (
                    <CommandItem key={user.id} value={user.user.first_name} onSelect={() => handleUserSelect(user)}>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedUser === user.user.first_name ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <Text size={'xs'}>
                        {user.user.first_name} {user.user.last_name}
                      </Text>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No {innerPlaceholder} found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
