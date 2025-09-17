"use client";

import { useSearchParams, useRouter } from "next/navigation";
import CountryCard from "@/components/CountryCard";

import { useCountries } from "@/hooks/useCountries";
import { createSearchParams } from "@/utils/helpers";
import Pagination from "@/components/Pagination";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const continent = searchParams.get("continent") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sortBy") || "name";

  const {
    data: searchData,
    isLoading: loading,
    error,
    isFetching,
  } = useCountries({
    query,
    continent,
    page,
    sortBy,
    limit: 12,
  });

  const countries = searchData?.countries || [];

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    const params = createSearchParams({
      q: query,
      continent: continent,
      page: 1,
      sortBy: newSortBy,
    });
    router.push(`/search?${params}`);
  };

  const handlePageChange = (newPage) => {
    const params = createSearchParams({
      q: query,
      continent: continent,
      page: newPage,
      sortBy: sortBy,
    });
    router.push(`/search?${params}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            {loading ? (
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            ) : (
              <p className="text-gray-600">
                {searchData?.totalCount === 0
                  ? "No countries found"
                  : `Search results with ${searchData?.totalCount} countries`}
                {query && (
                  <span>
                    {" "}
                    for &ldquo;<span className="font-medium">{query}</span>
                    &rdquo;
                  </span>
                )}
                {continent && (
                  <span>
                    {" "}
                    in <span className="font-medium">{continent}</span>
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="name">Country Name</option>
              <option value="capital">Capital City</option>
              <option value="currency">Currency</option>
            </select>
          </div>
        </div>

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-1">
              Error Loading Results
            </h3>
            <p className="text-red-700">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && countries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No countries found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or removing filters.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start New Search
            </button>
          </div>
        )}

        {!loading && !error && countries.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {countries.map((country) => (
                <CountryCard
                  key={country.cca2 || country.cca3}
                  country={country}
                />
              ))}
            </div>
          </>
        )}
        {searchData?.totalPages > 1 && (
          <Pagination
            currentPage={searchData?.currentPage}
            totalPages={searchData?.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={searchData?.hasNextPage}
            hasPrevPage={searchData?.hasPrevPage}
          />
        )}
      </div>
    </div>
  );
}
