import { NextRequest, NextResponse } from "next/server";
import { fetchIdxMarkers } from "@/lib/bridge";

const PROPERTY_TYPE_FILTERS: Record<string, string> = {
  "Single Family Homes": "PropertySubType eq 'Single Family Residence'",
  "Condominiums": "PropertySubType eq 'Condominium'",
  "Townhouses": "PropertySubType eq 'Townhouse'",
  "Multi-Family": "PropertyType eq 'Residential Income'",
  "Vacant Land": "(PropertyType eq 'Land/Boat Docks')",
};

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const typesRaw = search.get("types");
  const typeFilterExprs = typesRaw
    ? typesRaw.split(",").map((t) => PROPERTY_TYPE_FILTERS[t.trim()]).filter(Boolean)
    : undefined;

  const forRent = search.get("forRent") === "true";

  const result = await fetchIdxMarkers({
    minPrice: parseNumber(search.get("minPrice")),
    maxPrice: parseNumber(search.get("maxPrice")),
    beds: parseNumber(search.get("beds")),
    baths: parseNumber(search.get("baths")),
    status: search.get("status") || "Active",
    typeFilterExprs,
    forRent: forRent || undefined,
    swLat: parseNumber(search.get("swLat")),
    swLng: parseNumber(search.get("swLng")),
    neLat: parseNumber(search.get("neLat")),
    neLng: parseNumber(search.get("neLng")),
  });

  return NextResponse.json(result);
}
