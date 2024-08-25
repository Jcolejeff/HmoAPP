'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useHotelContext } from '@/domains/hotels/context/hotel-context';

import { DataTablePagination } from './data-table-pagination';

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: Pagination;
  setPagination?: (pagination: Pagination) => void;
  rowCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: rowCount,
    initialState: {
      pagination,
    },
    state: {
      pagination: pagination,
    },
    onPaginationChange: updater => {
      if (pagination && setPagination) {
        const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
        setPagination({ pageIndex: newState.pageIndex, pageSize: newState.pageSize });
      }

      return updater;
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getCoreRowModel().rows?.length ? (
            table.getCoreRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
