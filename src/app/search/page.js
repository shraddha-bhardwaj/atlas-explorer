import React, { Suspense } from "react";
import SearchComponent from "./_components/SearchComponent";

const SearchPage = () => {
  return (
    <Suspense fallback={<></>}>
      <SearchComponent />
    </Suspense>
  );
};

export default SearchPage;
