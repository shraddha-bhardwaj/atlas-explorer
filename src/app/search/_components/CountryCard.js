"use client";

import { useRouter } from "next/navigation";
import {
  formatPopulation,
  formatCurrencies,
  formatCapital,
} from "@/utils/helpers";
import Card from "../../../components/Card";

export default function CountryCard({ country, onClick, className = "" }) {
  const router = useRouter();

  if (!country) return null;

  const countryCode = country.cca2 || country.cca3;

  const handleCardClick = () => {
    if (typeof onClick === "function") {
      onClick(country);
    } else {
      router.push(`/country/${countryCode}`);
    }
  };

  const flagUrl =
    country.flags?.png || country.flags?.svg || "/placeholder-flag.svg";

  return (
    <Card
      onClick={handleCardClick}
      className={`cursor-pointer transform hover:-translate-y-1 ${className}`}
      padding="p-0"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <img
          src={flagUrl}
          alt={
            country.flags?.alt || `Flag of ${country.name?.common || "Unknown"}`
          }
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
          {country.name?.common || "Unknown Country"}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">
              <span className="font-medium">Capital:</span>{" "}
              {formatCapital(country.capital)}
            </span>
          </div>

          {country.population && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <span className="truncate">
                <span className="font-medium">Population:</span>{" "}
                {formatPopulation(country.population)}
              </span>
            </div>
          )}

          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span className="truncate">
              <span className="font-medium">Currency:</span>{" "}
              {formatCurrencies(country.currencies)}
            </span>
          </div>

          {country.region && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="truncate">
                <span className="font-medium">Region:</span> {country.region}
                {country.subregion && `, ${country.subregion}`}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Click for details</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}
