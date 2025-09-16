"use client";

import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCountryDetails } from "@/hooks/useCountries";
import {
  formatPopulation,
  formatArea,
  formatCurrencies,
  formatLanguages,
  formatCapital,
  formatContinents,
  formatTimezones,
} from "@/utils/helpers";

export default function CountryDetails() {
  const router = useRouter();
  const params = useParams();

  const countryCode = params.code;

  const {
    data: country,
    isLoading: loading,
    error,
  } = useCountryDetails(countryCode);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Country not found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested country could not be found.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const flagUrl =
    country.flags?.png || country.flags?.svg || "/placeholder-flag.svg";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-64 md:h-full">
                <img
                  src={flagUrl}
                  alt={country.flags?.alt || `Flag of ${country.name?.common}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {country.name?.common}
                  </h1>
                  {country.name?.official !== country.name?.common && (
                    <p className="text-lg text-gray-600 mb-2">
                      Official: {country.name?.official}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {country.cca2}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      {country.cca3}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Capital</h3>
                  <p className="text-gray-600">
                    {formatCapital(country.capital)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Population</h3>
                  <p className="text-gray-600">
                    {formatPopulation(country.population)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Area</h3>
                  <p className="text-gray-600">{formatArea(country.area)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Region</h3>
                  <p className="text-gray-600">{country.region}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Geographic Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Continents</h3>
                <p className="text-gray-600">
                  {formatContinents(country.continents)}
                </p>
              </div>
              {console.log(country)}
              {country.latlng?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Coordinates
                  </h3>
                  <p className="text-gray-600">
                    {country.latlng[0]}°, {country.latlng[1]}°
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Timezones</h3>
                <p className="text-gray-600">
                  {formatTimezones(country.timezones)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Cultural & Economic
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Languages</h3>
                <p className="text-gray-600">
                  {formatLanguages(country.languages)}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Currencies</h3>
                <p className="text-gray-600">
                  {formatCurrencies(country.currencies)}
                </p>
              </div>

              {country.startOfWeek && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Start of Week
                  </h3>
                  <p className="text-gray-600 capitalize">
                    {country.startOfWeek}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
