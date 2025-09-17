import countryService from "@/services/countryService";
import { apiHandler, successResponse } from "@/utils/apiError";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const continent = searchParams.get("continent") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!query || query.length < 2) {
    return successResponse([]);
  }

  const suggestions = await countryService.getCountrySuggestions(
    query,
    continent,
    limit
  );

  return successResponse(suggestions);
});
