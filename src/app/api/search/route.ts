import { NextRequest, NextResponse } from "next/server";
import { fetchIdxSearch } from "@/lib/bridge";

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseIntWithBounds(
  value: string | null,
  fallback: number,
  min: number,
  max: number
): number {
  const parsed = parseNumber(value);
  if (typeof parsed !== "number") {
    return fallback;
  }

  return Math.min(Math.max(Math.floor(parsed), min), max);
}

function parseSkip(search: URLSearchParams, top: number): number {
  const explicitSkip = parseNumber(search.get("skip"));
  if (typeof explicitSkip === "number") {
    return Math.max(0, Math.floor(explicitSkip));
  }

  const page = parseNumber(search.get("page"));
  if (typeof page !== "number") {
    return 0;
  }

  return Math.max(0, (Math.max(1, Math.floor(page)) - 1) * top);
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const top = parseIntWithBounds(search.get("top") || search.get("limit"), 24, 1, 100);
  const skip = parseSkip(search, top);
  const orderby = search.get("orderby") || search.get("sort") || "ListPrice desc";

  const result = await fetchIdxSearch({
    top,
    skip,
    orderby,
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
