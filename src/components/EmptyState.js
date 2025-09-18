import React from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";

const EmptyState = ({ query, continent }) => {
  const router = useRouter();

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No countries found
      </h3>
      <p className="text-gray-600 mb-6">
        {query && continent
          ? `No countries matching "${query}" found in ${continent}`
          : query
          ? `No countries matching "${query}" found`
          : continent
          ? `No countries found in ${continent}`
          : "No countries found"}
      </p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => router.push("/search")}>
          Clear Filters
        </Button>
        <Button variant="primary" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
