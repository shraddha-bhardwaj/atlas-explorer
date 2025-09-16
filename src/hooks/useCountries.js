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
