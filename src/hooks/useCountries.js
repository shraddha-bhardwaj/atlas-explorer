import { createSearchParams } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/apiClient";

// Get all continents
export function useContinents() {
  return useQuery({
    queryKey: ["continents"],
    queryFn: () => apiGet("/api/continents"),
    staleTime: 24 * 60 * 60 * 1000, // caching set to 24 hours as continents do not change
    gcTime: 7 * 24 * 60 * 60 * 1000, // gctime set to 7 days
  });
}

// autocomplete country  suggestions
export function useCountrySuggestions({ query, continent = "", limit = 8 }) {
  const trimmedQuery = query?.trim() || "";

  return useQuery({
    queryKey: [
      "country-suggestions",
      { query: trimmedQuery, continent, limit },
    ],
    queryFn: async () => {
      if (!trimmedQuery || trimmedQuery.length < 2) {
        return [];
      }
      const params = createSearchParams({
        q: trimmedQuery,
        continent,
        limit,
      });
      return apiGet(`/api/countries/suggestions?${params}`);
    },
    enabled: !!(trimmedQuery && trimmedQuery.length >= 2),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

//get all countries vased on params
export function useCountries({
  query = "",
  continent = "",
  page = 1,
  sortBy = "name",
  limit = 12,
}) {
  const queryKey = ["countries", { query, continent, page, sortBy, limit }];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = createSearchParams({
        q: query,
        continent,
        page,
        sortBy,
        limit,
      });
      return apiGet(`/api/countries?${params}`);
    },
    enabled: true,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCountryDetails(countryCode) {
  return useQuery({
    queryKey: ["country-details", countryCode],
    queryFn: () => apiGet(`/api/countries/${countryCode}`),
    enabled: !!countryCode,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
