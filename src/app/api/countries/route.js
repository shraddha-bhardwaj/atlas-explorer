import { NextResponse } from "next/server";
import countryService from "@/services/countryService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const continent = searchParams.get("continent") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(
      searchParams.get("limit") || process.env.ITEMS_PER_PAGE || "12"
    );
    const sortBy = searchParams.get("sortBy") || "name";

    const result = await countryService.searchCountries(
      query,
      continent,
      page,
      limit,
      sortBy
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in countries API:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries", message: error.message },
      { status: 500 }
    );
  }
}
