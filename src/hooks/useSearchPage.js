import { useCountries } from "./useCountries";
import { createSearchParams } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export function useSearchPage({
  query = "",
  continent = "",
  page = 1,
  sortBy = "name",
  limit = 12,
}) {
  const router = useRouter();
  const {
    data: countriesData,
    isLoading: isCountriesDataLoading,
    error: isCountriesDataError,
    isFetching: isCountriesDataFetching,
  } = useCountries({
    query,
    continent,
    page,
    sortBy,
    limit,
  });

  const countries = countriesData?.countries || [];

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

  const handleSearch = ({ query: newQuery, continent: newContinent }) => {
    const params = createSearchParams({
      q: newQuery,
      continent: newContinent,
      sortBy: sortBy,
    });
    router.push(`/search?${params}`);
  };

  return {
    handleSortChange,
    handlePageChange,
    handleSearch,
    countries,
    isCountriesDataLoading,
    isCountriesDataError,
    isCountriesDataFetching,
  };
}
