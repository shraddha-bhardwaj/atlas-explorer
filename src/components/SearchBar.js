"use client";

import { useState, useRef } from "react";
import { useContinents } from "@/hooks/useCountries";

export default function SearchBar({
  initialQuery = "",
  initialContinent = "",
  onSearch,
  className = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [continent, setContinent] = useState(initialContinent);
  const inputRef = useRef(null);

  const { data: continents = [], isLoading: continentsLoading } =
    useContinents();
  console.log(continents);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleContinentChange = (e) => {
    const value = e.target.value;
    setContinent(value);
  };

  return (
    <div className={`relative ${className}`}>
      <form className="w-full">
        <div className={`flex flex-col gap-4`}>
          <div className={`w-full max-w-xs mx-auto`}>
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

          <div className={`relative flex-1 max-w-2xl mx-auto`}>
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
              {continentsLoading ? (
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
          </div>
        </div>
      </form>
    </div>
  );
}
