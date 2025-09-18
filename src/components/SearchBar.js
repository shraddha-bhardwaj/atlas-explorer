"use client";

import { useEffect } from "react";
import { useSearch, useSearchSuggestions } from "@/hooks/useSearch";

const VARIANTS = {
  full: {
    container: "sm:flex-row gap-4 flex-col",
    input:
      "px-4 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-500 text-base",
    select:
      "w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-base",
    selectWrapper: "w-full max-w-[200px]",
    inputWrapper: "w-full",
    button: "right-2 p-2",
    suggestions: "mt-1 rounded-lg max-h-60",
    suggestionItem: "px-4 py-3",
    suggestionTitle: "text-base",
    suggestionSubtitle: "text-sm",
    iconSize: "h-5 w-5",
    spinnerSize: "h-5 w-5",
  },
  compact: {
    container: "gap-2",
    input:
      "px-3 py-2 pr-10 rounded-md focus:ring-1 focus:ring-blue-500 text-sm",
    select: "px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 text-sm",
    selectWrapper: "min-w-[140px]",
    inputWrapper: "",
    button: "right-1 p-1.5",
    suggestions: "mt-1 rounded-md max-h-48",
    suggestionItem: "px-3 py-2",
    suggestionTitle: "text-sm",
    suggestionSubtitle: "text-sm",
    iconSize: "h-4 w-4",
    spinnerSize: "h-4 w-4",
  },
};

export default function SearchBar({
  initialQuery = "",
  initialContinent = "",
  onSearch,
  className = "",
  variant = "full",
  placeholder = "Search for a country...",
  showFilter = true,
  showSuggestions = true,
  queryDelay = 500, // debounce time in ms
  maxSuggestions = 8,
  disabled = false,
  autoFocus = true,
}) {
  const variantConfig = VARIANTS[variant] || VARIANTS.full;

  const {
    query,
    continent,
    showSuggestions: showSuggestionsState,
    suggestions,
    continents,
    suggestionsLoading,
    continentsLoading,
    searchError,
    onQueryChange,
    onContinentChange,
    onSubmit,
    handleSuggestionSelect,
    setShowSuggestions,
  } = useSearch({
    initialQuery,
    initialContinent,
    onSearch,
    queryDelay,
    maxSuggestions,
    enableSuggestions: showSuggestions,
  });

  const { suggestionsRef, inputRef } = useSearchSuggestions(() => {
    setShowSuggestions(false);
  });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSuggestionClick = (suggestion) => {
    if (disabled) return;
    handleSuggestionSelect(suggestion);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={onSubmit} className="w-full">
        <div className={`flex items-center ${variantConfig.container}`}>
          {showFilter && (
            <div className={variantConfig.selectWrapper}>
              <select
                value={continent}
                onChange={onContinentChange}
                className={`border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-transparent ${variantConfig.select}`}
                disabled={continentsLoading}
              >
                <option value="">All Continents</option>
                {continents.map((cont) => (
                  <option key={cont} value={cont}>
                    {cont}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={`relative flex-1 ${variantConfig.inputWrapper}`}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={onQueryChange}
              placeholder={placeholder}
              className={`w-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-transparent ${
                variantConfig.input
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            />

            <button
              type="submit"
              className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors ${variantConfig.button}`}
              disabled={disabled}
            >
              {suggestionsLoading && query.length >= 2 ? (
                <div
                  className={`animate-spin ${variantConfig.spinnerSize} border-2 border-blue-500 border-t-transparent rounded-full`}
                />
              ) : (
                <svg
                  className={variantConfig.iconSize}
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

            {showSuggestionsState && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className={`absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 overflow-y-auto ${variantConfig.suggestions}`}
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.name}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 ${variantConfig.suggestionItem}`}
                    disabled={disabled}
                  >
                    <div
                      className={`font-medium text-gray-900 ${variantConfig.suggestionTitle}`}
                    >
                      {suggestion.name}
                    </div>
                    {suggestion.official !== suggestion.name && (
                      <div
                        className={`text-gray-500 ${variantConfig.suggestionSubtitle}`}
                      >
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

      {searchError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {searchError}
          </p>
        </div>
      )}
    </div>
  );
}
