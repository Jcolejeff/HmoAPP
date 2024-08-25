import { PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Text } from '@/components/ui/text';

// Helper to create pagination links
const createPaginationLink = (pageNumber: number, currentPage: number, handlePageChange: (page: number) => void) => (
  <PaginationItem key={pageNumber}>
    <PaginationLink
      href="#"
      isActive={currentPage === pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      className="px-3 py-2"
    >
      <Text size={'xs'}>{pageNumber}</Text>
    </PaginationLink>
  </PaginationItem>
);

// Helper to create an ellipsis
const createEllipsis = (key: string) => (
  <PaginationItem key={key}>
    <PaginationEllipsis />
  </PaginationItem>
);

export const renderPaginationItems = (
  totalPages: number,
  currentPage: number,
  handlePageChange: (page: number) => void,
) => {
  const maxPagesToShow = 6;
  const pageNumbers: JSX.Element[] = [];

  if (totalPages <= maxPagesToShow) {
    // Show all pages if total pages is within maxPagesToShow
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(createPaginationLink(i, currentPage, handlePageChange));
    }
  } else {
    if (currentPage <= 4) {
      // Show the first 5 pages and ellipsis
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(createPaginationLink(i, currentPage, handlePageChange));
      }
      pageNumbers.push(createEllipsis('ellipsis-end'));
      pageNumbers.push(createPaginationLink(totalPages, currentPage, handlePageChange));
    } else if (currentPage > 4 && currentPage < totalPages - 3) {
      // Show first page, ellipsis, 5 pages around current, and ellipsis, last page
      pageNumbers.push(createPaginationLink(1, currentPage, handlePageChange));
      pageNumbers.push(createEllipsis('ellipsis-start'));
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(createPaginationLink(i, currentPage, handlePageChange));
      }
      pageNumbers.push(createEllipsis('ellipsis-end'));
      pageNumbers.push(createPaginationLink(totalPages, currentPage, handlePageChange));
    } else {
      // Show first page, ellipsis, and last 5 pages
      pageNumbers.push(createPaginationLink(1, currentPage, handlePageChange));
      pageNumbers.push(createEllipsis('ellipsis-start'));
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(createPaginationLink(i, currentPage, handlePageChange));
      }
    }
  }

  return pageNumbers;
};
