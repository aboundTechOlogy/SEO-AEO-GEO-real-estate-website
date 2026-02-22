import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/bridge";

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = parseNumber(value);
  if (!parsed) return fallback;
  return Math.max(1, Math.floor(parsed));
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const status = search.get("status") || "Active";
  const propertyType = search.get("type") || undefined;
  const minPrice = parseNumber(search.get("minPrice"));
  const maxPrice = parseNumber(search.get("maxPrice"));
  const minBeds = parseNumber(search.get("beds"));
  const minBaths = parseNumber(search.get("baths"));
  const sort = search.get("sort") || "ListingContractDate desc";
  const q = search.get("q") || undefined;
  const page = parsePositiveInt(search.get("page"), 1);
  const limit = parsePositiveInt(search.get("limit"), 24);

  const result = await searchProperties({
    status,
    propertyType,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    sort,
    q,
    page,
    limit,
  });

  const totalPages = Math.max(1, Math.ceil(result.totalCount / limit));

  return NextResponse.json({
    properties: result.properties,
    totalCount: result.totalCount,
    page,
    totalPages,
  });
}
