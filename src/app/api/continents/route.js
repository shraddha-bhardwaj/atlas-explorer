import countryService from "@/services/countryService";
import { apiHandler, successResponse } from "@/utils/apiError";

export const GET = apiHandler(async () => {
  const continents = await countryService.getContinents();
  return successResponse(continents);
});
