import { NextResponse } from "next/server";
import countryService from "@/services/countryService";

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { error: "Country code is required" },
        { status: 400 }
      );
    }

    const country = await countryService.getCountryDetails(code);

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(country);
  } catch (error) {
    console.error("Error in country details API:", error);
    return NextResponse.json(
      { error: "Failed to fetch country details", message: error.message },
      { status: 500 }
    );
  }
}
