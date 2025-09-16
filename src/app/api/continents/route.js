import { NextResponse } from "next/server";
import countryService from "@/services/countryService";

export async function GET() {
  try {
    const continents = await countryService.getContinents();
    return NextResponse.json(continents);
  } catch (error) {
    console.error("Error in continents API:", error);
    return NextResponse.json(
      { error: "Failed to fetch continents", message: error.message },
      { status: 500 }
    );
  }
}
