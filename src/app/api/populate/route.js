import { NextResponse } from "next/server";
import countryService from "@/services/countryService";

export async function POST() {
  try {
    const result = await countryService.populateDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in populate API:", error);
    return NextResponse.json(
      { error: "Failed to populate database", message: error.message },
      { status: 500 }
    );
  }
}
