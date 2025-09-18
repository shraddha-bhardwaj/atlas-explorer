"use client";

import Button from "./Button";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const adjacentPagesToShow = 2; // number of pages to show adjacent to current ones
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - adjacentPagesToShow);
      i <= Math.min(totalPages - 1, currentPage + adjacentPagesToShow);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - adjacentPagesToShow > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + adjacentPagesToShow < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>

      {/* page numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-sm font-medium text-gray-500"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </nav>
  );
}
