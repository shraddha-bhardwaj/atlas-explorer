import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSearchParams } from "@/utils/helpers";
import { useContinents, useCountrySuggestions } from "@/hooks/useCountries";

/* Custom hook for search functionality with debouncing and suggestions */
export function useSearch({
  initialQuery = "",
  initialContinent = "",
  onSearch,
  queryDelay = 500,
  maxSuggestions = 8,
  enableSuggestions = true,
} = {}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [continent, setContinent] = useState(initialContinent);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery);
    setHasUserTyped(false);
    setSearchError(null);
  }, [initialQuery]);

  useEffect(() => {
    setContinent(initialContinent);
  }, [initialContinent]);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, queryDelay);

    return () => clearTimeout(timer);
  }, [query, queryDelay]);

  // Fetch continents and suggestions
  const { data: continents = [], isLoading: continentsLoading } =
    useContinents();

  const {
    data: suggestions = [],
    isLoading: suggestionsLoading,
    isFetching: suggestionsFetching,
  } = useCountrySuggestions({
    query: debouncedQuery,
    continent,
    limit: maxSuggestions,
  });

  // Manage suggestions dropdown
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    if (
      enableSuggestions &&
      hasUserTyped &&
      trimmedQuery.length >= 2 &&
      suggestions.length > 0
    ) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery, suggestions, enableSuggestions, hasUserTyped]);

  const validateSearchQuery = (searchQuery) => {
    const trimmed = searchQuery.trim();

    // dont allow for empty query search
    if (!trimmed) {
      return { isValid: false, error: "Please enter a search term" };
    }

    // limit min length to 2
    if (trimmed.length < 2) {
      return {
        isValid: false,
        error: "Search term must be at least 2 characters long",
      };
    }

    // limit max length
    if (trimmed.length > 100) {
      return {
        isValid: false,
        error: "Search term is too long(maximum 100 characters)",
      };
    }

    // check for special characters
    const invalidChars = /[^a-zA-Z0-9\s\-']/;
    if (invalidChars.test(trimmed)) {
      return {
        isValid: false,
        error: "Search term cannot contain special characters",
      };
    }

    return { isValid: true, query: trimmed };
  };

  // Search handler with validation
  const handleSearch = (searchQuery = query, searchContinent = continent) => {
    setShowSuggestions(false);

    const validation = validateSearchQuery(searchQuery);

    if (!validation.isValid) {
      setSearchError(validation.error);
      return;
    }

    setSearchError(null);

    if (typeof onSearch === "function") {
      onSearch({ query: validation.query, continent: searchContinent });
    } else {
      const params = createSearchParams({
        q: validation.query,
        continent: searchContinent,
      });
      router.push(`/search?${params}`);
    }
  };

  // Suggestion select handler
  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    handleSearch(suggestion.name, continent);
  };

  // Clear search handler
  const clearSearch = () => {
    setQuery("");
    setContinent("");
    setShowSuggestions(false);
    setHasUserTyped(false);
  };

  // Update continent handler
  const updateContinent = (newContinent) => {
    setContinent(newContinent);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const onQueryChange = (e) => {
    setQuery(e.target.value);
    setHasUserTyped(true);

    if (searchError) {
      setSearchError(null);
    }
  };

  return {
    query,
    continent,
    debouncedQuery,
    showSuggestions,
    suggestions,
    continents,
    suggestionsLoading: suggestionsLoading || suggestionsFetching,
    continentsLoading,
    searchError,
    updateContinent,
    handleSearch,
    handleSuggestionSelect,
    clearSearch,
    setShowSuggestions,
    onQueryChange,
    onContinentChange: (e) => setContinent(e.target.value),
    onSubmit,
  };
}

/* Hook for suggestionss dropdown */
export function useSearchSuggestions(onClose) {
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        if (typeof onClose === "function") {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return {
    suggestionsRef,
    inputRef,
  };
}
