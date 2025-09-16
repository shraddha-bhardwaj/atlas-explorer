import { createSearchParams } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";

// Get all continents
export function useContinents() {
  return useQuery({
    queryKey: ["continents"],
    queryFn: async () => {
      const response = await fetch("/api/continents");
      if (!response.ok) {
        throw new Error("Failed to fetch continents");
      }
      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // caching set to 24 hours as continents do not change
    gcTime: 7 * 24 * 60 * 60 * 1000, // gctime set to 7 days
  });
}

// autocomplete country  suggestions
export function useCountrySuggestions({ query, continent = "", limit = 8 }) {
  return useQuery({
    queryKey: ["country-suggestions", { query, continent, limit }],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return [];
      }
      const params = createSearchParams({
        q: query,
        continent,
        limit,
      });
      console.log("here");

      const response = await fetch(`/api/countries/suggestions?${params}`);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      return response.json();
    },
    enabled: !!(query && query.length >= 2),
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

      const response = await fetch(`/api/countries?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      return response.json();
    },
    enabled: true,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
