'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';

import { ContentType, ContentValue } from '@/types';

import { HotelType } from '../../hooks/create-hotel';

export const columns: ColumnDef<ContentType>[] = [
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
    accessorKey: 'content',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        Issue Title
      </Text>
    ),
    cell: ({ row }) => {
      const contentString = row.getValue('content');
      console.log(contentString);

      // Replace single quotes with double quotes if necessary
      const formattedContentString = (contentString as string).replace(/'/g, '"');

      try {
        const obj = JSON.parse(formattedContentString) as ContentValue;
        console.log(obj.title);
        return <Text size={'sm'}>{obj.title.replace(/"/g, "'")}</Text>;
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return <Text size={'sm'}>Invalid content</Text>; // Handle parse error
      }
    },
  },
  {
    accessorKey: 'content',
    header: () => (
      <Text size={'sm'} weight={'bold'}>
        Issue Solution
      </Text>
    ),
    cell: ({ row }) => {
      const contentString = row.getValue('content');
      console.log(contentString);

      // Replace single quotes with double quotes if necessary
      const formattedContentString = (contentString as string).replace(/'/g, '"');

      try {
        const obj = JSON.parse(formattedContentString) as ContentValue;
        console.log(obj.title);
        return (
          <>
            <Text size={'sm'} className="leading-7">
              {obj.solution.replace(/"/g, "'")}
            </Text>
          </>
        );
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return <Text size={'sm'}>Invalid content</Text>; // Handle parse error
      }
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
