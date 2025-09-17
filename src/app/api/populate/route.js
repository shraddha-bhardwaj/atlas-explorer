import countryService from "@/services/countryService";
import { apiHandler, successResponse } from "@/utils/apiError";

export const POST = apiHandler(async () => {
  const result = await countryService.populateDatabase();
  return successResponse(result, result.message);
});
