import React, { useState } from 'react';

import EmptyContentWrapper from '@/components/shared/empty-content-wrapper';
import SortPopover from '@/components/shared/sort-pop-over';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import { renderPaginationItems } from '@/lib/paginataion';

import { useRequests } from '@/domains/requests/hooks/use-requests';

import useTabsData from '../hooks/use-tabs-data';

import RequestItem from './request-item';

const TabsWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('allRequests');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { tabsData, loading, handleTabChange, requests } = useTabsData({ size: itemsPerPage, page: currentPage });

  console.log('request', requests);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getContentState = () => {
    const activeTabData = tabsData.find(tab => tab.key === activeTab);
    if (loading) {
      return (
        <div className="flex justify-center py-56 text-text-dim">
          <Text size={'xs'}>Loading... Please wait while we fetch your requests.</Text>
        </div>
      );
    }
    if (activeTabData && activeTabData?.count && activeTabData?.count > 0) {
      const totalPages = Math.ceil(activeTabData.count / itemsPerPage);
      return (
        <div>
          {requests.map((request, index) => (
            <RequestItem key={index} {...request} />
          ))}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="text-xs"
                  onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                />
              </PaginationItem>
              {renderPaginationItems(totalPages, currentPage, handlePageChange)}
              <PaginationItem>
                <PaginationNext
                  className="text-xs"
                  href="#"
                  onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      );
    } else {
      return (
        <EmptyContentWrapper
          customMessage="Empty"
          className="py-48 text-text-dim"
          isEmpty={tabsData.find(tab => tab.key === activeTab)?.count === 0}
        />
      );
    }
  };

  return (
    <Tabs
      defaultValue="allRequests"
      className=""
      onValueChange={value => {
        setActiveTab(value);
        handleTabChange(value);
        setCurrentPage(1); // Reset page to 1 when changing tabs
      }}
    >
      <div className="flex w-full justify-between">
        <TabsList className="rounded-lg border p-1">
          {tabsData.map(tab => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={`w-max rounded-lg px-4 py-2 text-sm ${activeTab === tab.key ? 'bg-[#F1F5F9]' : 'bg-transparent text-slate-500'}`}
            >
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>
        <SortPopover />
      </div>
      {tabsData.map(tab => (
        <TabsContent key={tab.key} value={tab.key} className="mb-4 mt-4 rounded-lg border p-3">
          {getContentState()}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsWrapper;
