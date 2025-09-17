"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSearchParams } from "@/utils/helpers";
import { useContinents, useCountrySuggestions } from "@/hooks/useCountries";

export default function SearchBar({
  initialQuery = "",
  initialContinent = "",
  onSearch,
  className = "",
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [continent, setContinent] = useState(initialContinent);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: continents = [], isLoading: continentsLoading } =
    useContinents();
  const {
    data: suggestions = [],
    isLoading: suggestionsLoading,
    isFetching: suggestionsFetching,
  } = useCountrySuggestions({
    query: debouncedQuery,
    continent,
    limit: 8,
  });

  useEffect(() => {
    if (debouncedQuery.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery, suggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleContinentChange = (e) => {
    const value = e.target.value;
    setContinent(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    if (onSearch) {
      onSearch({ query, continent });
    } else {
      const params = createSearchParams({
        q: query,
        continent: continent,
      });
      router.push(`/search?${params}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);

    if (onSearch) {
      onSearch({ query: suggestion.name, continent });
    } else {
      const params = createSearchParams({
        q: suggestion.name,
        continent: continent,
      });
      router.push(`/search?${params}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className={`flex sm:flex-row gap-4 items-center flex-col`}>
          <div className={`w-full max-w-[200px]`}>
            <select
              value={continent}
              onChange={handleContinentChange}
              className={`
               w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
               text-base
             `}
            >
              <option value="">All Continents</option>
              {continents.map((cont) => (
                <option key={cont} value={cont}>
                  {cont}
                </option>
              ))}
            </select>
          </div>

          <div className={`relative flex-1 w-full`}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for a country..."
              className={`
               w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white text-gray-700
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
               text-base
             `}
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {(suggestionsLoading || suggestionsFetching) &&
              debouncedQuery.length >= 2 ? (
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.name}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.name}
                    </div>
                    {suggestion.official !== suggestion.name && (
                      <div className="text-sm text-gray-500">
                        {suggestion.official}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
