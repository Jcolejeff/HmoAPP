'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';

import { HotelType } from '../../hooks/create-hotel';

export const columns: ColumnDef<HotelType>[] = [
  {
    accessorKey: 'id',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        ID
      </Text>
    ),
    cell: ({ row }) => {
      return <Text size={'sm'}>{row.getValue('id')}</Text>;
    },
  },
  {
    accessorKey: 'hotel_name',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        Issue Title
      </Text>
    ),
    cell: ({ row }) => {
      return <Text size={'sm'}>{row.getValue('hotel_name')}</Text>;
    },
  },
  {
    accessorKey: 'city',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        City
      </Text>
    ),
    cell: ({ row }) => {
      return <Text size={'sm'}>{row.getValue('city')}</Text>;
    },
  },
  {
    accessorKey: 'state',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        State
      </Text>
    ),
    cell: ({ row }) => {
      return <Text size={'sm'}>{row.getValue('state')}</Text>;
    },
  },
  {
    accessorKey: 'country',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        Country
      </Text>
    ),
    cell: ({ row }) => {
      return <Text size={'sm'}>{row.getValue('country')}</Text>;
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const hotel = row.original;

      return (
        <Dropdown>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content align="end" className="bg bg-white">
            <Dropdown.Label>Actions</Dropdown.Label>
            <hr />
            <Dropdown.Item onClick={() => navigator.clipboard.writeText(hotel.id?.toString())}>
              Copy hotel ID
            </Dropdown.Item>
            <Dropdown.Item>Update</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
    },
  },
];
