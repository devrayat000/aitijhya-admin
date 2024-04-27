import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string>;
}

export default function PostPagination({
  currentPage,
  totalPages,
  searchParams,
}: PostPaginationProps) {
  const neighborPages = [currentPage - 1, currentPage, currentPage + 1];
  while (neighborPages[0] < 2) {
    neighborPages.shift();
  }
  while (neighborPages[neighborPages.length - 1] > totalPages - 1) {
    neighborPages.pop();
  }

  return (
    <Pagination className="pb-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={{
                query: {
                  ...searchParams,
                  page: currentPage - 1,
                },
              }}
            />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href={{
              query: {
                ...searchParams,
                page: 1,
              },
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
        {currentPage >= 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {neighborPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={{
                query: {
                  ...searchParams,
                  page,
                },
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage <= totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href={{
              query: {
                ...searchParams,
                page: totalPages,
              },
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={{
                query: {
                  ...searchParams,
                  page: currentPage + 1,
                },
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
