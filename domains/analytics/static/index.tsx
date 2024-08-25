import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { DataTable } from '@/components/shared/data-table';
import SecondarySortPopover from '@/components/shared/secondary-sort-pop-over';
import { Text } from '@/components/ui/text';

import useTopTravellers from '../hooks/use-top-travellers';
import { analyticsData } from '../types';

export const columns: ColumnDef<analyticsData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'total_requests',
    header: 'Total Requests',
  },
  {
    accessorKey: 'total_spend',
    header: 'Total Spend',
  },
  {
    accessorKey: 'travel_count',
    header: 'Travel Count',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
];

export const generateReportItems = [
  'All',
  'Total Requests',
  'Pending Requests',
  'Approved Requests',
  'Top Requesters',
  'Top Hotels',
  'Total Spend',
  'Cancelled Requests',
  'Total Departments',
  'Travel Count',
  'Top Destinations',
  'Top Hotels',
];
