"use client";

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
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`
          px-3 py-2 text-sm font-medium rounded-md border transition-colors
          ${
            hasPrevPage
              ? "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              : "text-gray-300 bg-gray-100 border-gray-200 cursor-not-allowed"
          }
        `}
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
      </button>

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
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-colors
                ${
                  isCurrentPage
                    ? "text-white bg-blue-600 border-blue-600"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`
          px-3 py-2 text-sm font-medium rounded-md border transition-colors
          ${
            hasNextPage
              ? "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              : "text-gray-300 bg-gray-100 border-gray-200 cursor-not-allowed"
          }
        `}
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
      </button>
    </nav>
  );
}
