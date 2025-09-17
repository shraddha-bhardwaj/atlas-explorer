import countryService from "@/services/countryService";
import { apiHandler, successResponse, errorResponse } from "@/utils/apiError";

export const GET = apiHandler(async (request, { params }) => {
  const { code } = await params;

  if (!code) {
    return errorResponse("Country code is required", 400);
  }

  const country = await countryService.getCountryDetails(code);

  if (!country) {
    return errorResponse("Country not found", 404);
  }

  return successResponse(country);
});
