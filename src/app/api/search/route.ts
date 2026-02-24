import { NextRequest, NextResponse } from "next/server";
import { fetchIdxSearch } from "@/lib/bridge";

/**
 * Maps UI filter labels → OData filter expressions.
 * Miami MLS uses PropertyType for broad category and PropertySubType for specifics.
 * e.g. Condos are PropertyType='Residential' AND PropertySubType='Condominium'.
 */
const PROPERTY_TYPE_FILTERS: Record<string, string> = {
  "Single Family Homes": "PropertySubType eq 'Single Family Residence'",
  "Condominiums": "PropertySubType eq 'Condominium'",
  "Townhouses": "PropertySubType eq 'Townhouse'",
  "Multi-Family": "PropertyType eq 'Residential Income'",
  "Vacant Land": "(PropertyType eq 'Land/Boat Docks')",
};

/** Features that map directly to Bridge boolean fields */
const FEATURE_POOL_LABELS = ["Swimming Pool", "Pool"];
const FEATURE_WATERFRONT_LABELS = ["Waterfront"];

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

function parseDomMax(value: string | null): number | undefined {
  if (!value || value === "Any") return undefined;
  if (value === "Today") return 1;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseGarage(value: string | null): number | undefined {
  if (!value || value === "Any") return undefined;
  const n = Number(value.replace("+", ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseSoldRange(value: string | null): string | undefined {
  if (!value) return undefined;
  const days = Number(value);
  if (!Number.isFinite(days) || days <= 0) return undefined;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const top = parseIntWithBounds(search.get("top") || search.get("limit"), 24, 1, 100);
  const skip = parseSkip(search, top);
  const orderby = search.get("orderby") || search.get("sort") || "ListPrice desc";

  const typesRaw = search.get("types");
  const typeFilterExprs = typesRaw
    ? typesRaw.split(",").map((t) => PROPERTY_TYPE_FILTERS[t.trim()]).filter(Boolean)
    : undefined;

  // New params
  const q = search.get("q") || undefined;
  const keyword = search.get("keyword") || undefined;
  const maxBeds = parseNumber(search.get("maxBeds"));
  const maxBaths = parseNumber(search.get("maxBaths"));
  const minSqft = parseNumber(search.get("minSqft"));
  const maxSqft = parseNumber(search.get("maxSqft"));
  const minGarage = parseGarage(search.get("minGarage"));
  const maxDom = parseDomMax(search.get("maxDom"));
  const hidePending = search.get("hidePending") === "true";
  const forRent = search.get("forRent") === "true";
  const minCloseDate = parseSoldRange(search.get("soldRange"));

  const waterfrontParam = search.get("waterfront");
  const waterfrontOnly = waterfrontParam && waterfrontParam !== "Any" ? true : undefined;

  const featuresRaw = search.get("features");
  const features = featuresRaw ? featuresRaw.split(",").map((f) => f.trim()).filter(Boolean) : [];
  const poolOnly = features.some((f) => FEATURE_POOL_LABELS.includes(f)) || undefined;
  const poolOrWaterfrontOnly = features.some((f) => FEATURE_WATERFRONT_LABELS.includes(f))
    ? true
    : undefined;

  const result = await fetchIdxSearch({
    top,
    skip,
    orderby,
    minPrice: parseNumber(search.get("minPrice")),
    maxPrice: parseNumber(search.get("maxPrice")),
    beds: parseNumber(search.get("beds")),
    maxBeds,
    baths: parseNumber(search.get("baths")),
    maxBaths,
    status: search.get("status") || "Active",
    typeFilterExprs,
    swLat: parseNumber(search.get("swLat")),
    swLng: parseNumber(search.get("swLng")),
    neLat: parseNumber(search.get("neLat")),
    neLng: parseNumber(search.get("neLng")),
    q,
    keyword,
    minGarage,
    maxDom,
    waterfrontOnly: waterfrontOnly || poolOrWaterfrontOnly || undefined,
    poolOnly,
    hidePending: hidePending || undefined,
    forRent: forRent || undefined,
    minSqft,
    maxSqft,
    minCloseDate,
  });

  return NextResponse.json(result);
}
