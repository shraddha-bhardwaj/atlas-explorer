import { NextResponse } from "next/server";
import countryService from "@/services/countryService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const continent = searchParams.get("continent") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const suggestions = await countryService.getCountrySuggestions(
      query,
      continent,
      limit
    );

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error in suggestions API:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions", message: error.message },
      { status: 500 }
    );
  }
}
