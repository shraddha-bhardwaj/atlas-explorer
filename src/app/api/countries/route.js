import countryService from "@/services/countryService";
import { apiHandler, successResponse, errorResponse } from "@/utils/apiError";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const continent = searchParams.get("continent") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(
    searchParams.get("limit") || process.env.ITEMS_PER_PAGE || "12"
  );
  const sortBy = searchParams.get("sortBy") || "name";

  if (page < 1 || limit < 1 || limit > 100) {
    return errorResponse("Invalid parameters", 400);
  }

  const result = await countryService.searchCountries(
    query,
    continent,
    page,
    limit,
    sortBy
  );

  return successResponse(result);
});
