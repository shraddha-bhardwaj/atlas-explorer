"use client";

import { useSearchParams, useRouter } from "next/navigation";
import CountryCard from "./CountryCard";

import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { useSearchPage } from "@/hooks/useSearchPage";
import ErrorCard from "@/components/ErrorCard";
import Button from "@/components/Button";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const continent = searchParams.get("continent") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sortBy") || "name";

  const {
    handleSortChange,
    handlePageChange,
    handleSearch,
    countriesData,
    isCountriesDataLoading,
    isCountriesDataError,
    isCountriesDataFetching,
  } = useSearchPage({ query, continent, page, sortBy });

  const countries = countriesData?.countries || [];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
            <Button variant="ghost" onClick={() => router.push("/")}>
              ← Back to Home
            </Button>
          </div>

          <SearchBar
            variant="compact"
            initialQuery={query}
            initialContinent={continent}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            {isCountriesDataLoading ? (
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            ) : (
              <p className="text-gray-600">
                {countriesData?.totalCount === 0
                  ? "No countries found"
                  : `Search results with ${countriesData?.totalCount} countries`}
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
              disabled={isCountriesDataLoading}
            >
              <option value="name">Country Name</option>
              <option value="capital">Capital City</option>
              <option value="currency">Currency</option>
            </select>
          </div>
        </div>

        {isCountriesDataError && !isCountriesDataLoading && (
          <ErrorCard message={isCountriesDataError.message} />
        )}

        {!isCountriesDataLoading &&
          !isCountriesDataError &&
          countriesData.length === 0 && (
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
                Please try again with different name or removing filters.
              </p>
            </div>
          )}

        {!isCountriesDataLoading &&
          !isCountriesDataError &&
          countries.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {countries.map((country) => (
                  <CountryCard
                    key={country?.cca2 || country?.cca3}
                    country={country}
                  />
                ))}
              </div>
            </>
          )}
        {countriesData?.totalPages > 1 && (
          <Pagination
            currentPage={countriesData?.currentPage}
            totalPages={countriesData?.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={countriesData?.hasNextPage}
            hasPrevPage={countriesData?.hasPrevPage}
          />
        )}
      </div>
    </div>
  );
}
