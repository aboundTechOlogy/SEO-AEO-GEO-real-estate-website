import { NextRequest, NextResponse } from "next/server";
import { fetchIdxMarkers } from "@/lib/bridge";

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const result = await fetchIdxMarkers({
    minPrice: parseNumber(search.get("minPrice")),
    maxPrice: parseNumber(search.get("maxPrice")),
    beds: parseNumber(search.get("beds")),
    baths: parseNumber(search.get("baths")),
    status: search.get("status") || "Active",
    type: search.get("type") || undefined,
    swLat: parseNumber(search.get("swLat")),
    swLng: parseNumber(search.get("swLng")),
    neLat: parseNumber(search.get("neLat")),
    neLng: parseNumber(search.get("neLng")),
  });

  return NextResponse.json(result);
}
