import React from "react";
import Button from "./Button";

const ErrorCard = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 mb-2">
        <svg
          className="w-8 h-8 mx-auto mb-2"
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
      <h3 className="text-lg font-medium text-red-900 mb-1">
        Error Loading Results
      </h3>
      <p className="text-red-700">{message}</p>
      <Button
        variant="danger"
        onClick={() => window.location.reload()}
        className="mt-4"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorCard;
