'use client';

import { PaginationMetadata } from '@/lib/types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useQueryState } from 'nuqs';
import { parseAsInteger } from 'nuqs/server';

export function ListPagination({
  metadata,
}: {
  metadata?: PaginationMetadata;
}) {
  const [_, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const handlePage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Generate page numbers to display
  const generatePaginationItems = () => {
    if (!metadata) {
      return [];
    }

    const items = [];
    const { currentPage, totalPages } = metadata;

    // Always show first page
    items.push(1);

    if (currentPage > 3) {
      items.push('ellipsis');
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(i);
    }

    if (currentPage < totalPages - 2) {
      items.push('ellipsis');
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  if (!metadata || metadata.totalPages <= 1) {
    return (
      <Pagination className='p-4 justify-end'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className='pointer-events-none opacity-50' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePage(1)}
              className='cursor-pointer'
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className='pointer-events-none opacity-50' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <Pagination className='p-4 justify-end'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePage(metadata.currentPage - 1)}
            className={
              !metadata.hasPreviousPage
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {generatePaginationItems().map((item, index) => (
          <PaginationItem key={index}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePage(item as number)}
                isActive={metadata.currentPage === item}
                className='cursor-pointer'
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePage(metadata.currentPage + 1)}
            className={
              !metadata.hasNextPage
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
