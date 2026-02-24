import { MOCK_EXCLUSIVE, MOCK_SEARCH, MOCK_SOLD } from "@/data/mockListings";

/** True only in local/dev. All mock fallbacks are gated on this. */
const IS_DEV = process.env.NODE_ENV !== "production";

const SEARCH_REVALIDATE_SECONDS = 60 * 15;
const DETAIL_REVALIDATE_SECONDS = 60 * 60;

const DEFAULT_BRIDGE_API_BASE = "https://api.bridgedataoutput.com/api/v2/OData";
const DEFAULT_BRIDGE_DATASET = "test";

export interface BridgeMedia {
  MediaURL: string;
  Order: number;
  MimeType: string;
  MediaCategory: string;
  ShortDescription: string | null;
}

export interface BridgeProperty {
  ListingKey: string;
  ListingId: string;
  ListPrice: number;
  StandardStatus: string;
  PropertyType: string;
  PropertySubType: string;
  StreetNumber: string;
  StreetName: string;
  StreetSuffix: string | null;
  UnitNumber: string | null;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  BathroomsFull: number;
  BathroomsHalf: number;
  LivingArea: number;
  LotSizeArea: number | null;
  YearBuilt: number | null;
  PublicRemarks: string | null;
  Latitude: number;
  Longitude: number;
  DaysOnMarket: number | null;
  OriginalListPrice: number | null;
  ListingContractDate: string;
  ClosePrice: number | null;
  CloseDate: string | null;
  AssociationFee: number | null;
  AssociationFeeFrequency: string | null;
  GarageSpaces: number | null;
  BuildingName: string | null;
  WaterfrontYN: boolean;
  PoolPrivateYN: boolean;
  ViewYN: boolean;
  Appliances: string[];
  InteriorFeatures: string[];
  ExteriorFeatures: string[];
  Cooling: string[];
  Heating: string[];
  ParkingFeatures: string[];
  BuildingFeatures: string[];
  ListAgentFullName: string | null;
  ListOfficeName: string | null;
  ListOfficePhone: string | null;
  SubdivisionName: string | null;
  LotSizeAcres: number | null;
  LotSizeSquareFeet: number | null;
  CountyOrParish: string | null;
  CoveredSpaces: number | null;
  StoriesTotal: number | null;
  AttachedGarageYN: boolean;
  DirectionFaces: string | null;
  OccupantType: string | null;
  TaxAnnualAmount: number | null;
  TaxLegalDescription: string | null;
  TaxYear: number | null;
  ArchitecturalStyle: string[];
  ConstructionMaterials: string[];
  CommunityFeatures: string[];
  Flooring: string[];
  Levels: string[];
  ListingTerms: string[];
  LotFeatures: string[];
  PatioAndPorchFeatures: string[];
  PetsAllowed: string[];
  PoolFeatures: string[];
  Possession: string[];
  Roof: string[];
  Sewer: string[];
  View: string[];
  WaterSource: string[];
  VirtualTourURLUnbranded: string | null;
  Media: BridgeMedia[];
}

export interface BridgeSearchParams {
  status?: "Active" | "Pending" | "Closed" | string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  waterfront?: boolean;
  pool?: boolean;
  city?: string;
  postalCode?: string;
  sort?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export interface BridgeSearchResult {
  properties: BridgeProperty[];
  totalCount: number;
  nextLink: string | null;
}

export interface BridgeIdxSearchParams {
  top?: number;
  skip?: number;
  orderby?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  maxBeds?: number;
  baths?: number;
  maxBaths?: number;
  status?: "Active" | "Pending" | "Closed" | string;
  type?: string;
  types?: string[];
  /** Pre-built OData filter expressions for property type (from UI type picker) */
  typeFilterExprs?: string[];
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
  /** Free-text address/city/zip search */
  q?: string;
  /** Keyword search against remarks/building name */
  keyword?: string;
  /** Minimum garage spaces */
  minGarage?: number;
  /** Maximum days on market */
  maxDom?: number;
  /** Filter to waterfront-only listings */
  waterfrontOnly?: boolean;
  /** Filter to pool-only listings */
  poolOnly?: boolean;
  /** Exclude Active Under Contract listings (For Sale sub-filter) */
  hideActiveWithContract?: boolean;
  /** Filter to rental listings only (PropertyType eq 'Residential Lease') */
  forRent?: boolean;
  /** Minimum living area (sq ft) */
  minSqft?: number;
  /** Maximum living area (sq ft) */
  maxSqft?: number;
  /** Minimum close date (ISO YYYY-MM-DD) — used for sold time-range filter */
  minCloseDate?: string;
}

export interface BridgeIdxListingPhoto {
  url: string;
  order: number;
}

export interface BridgeIdxListing {
  id: string;
  price: number;
  status: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number | null;
  lat: number;
  lng: number;
  photos: BridgeIdxListingPhoto[];
  daysOnMarket: number | null;
  listDate: string | null;
  photoCount: number;
  propertyType: string | null;
  yearBuilt: number | null;
  buildingName: string | null;
}

export interface BridgeIdxMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  originalPrice: number | null;
}

export interface BridgeIdxSearchResponse {
  listings: BridgeIdxListing[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export interface BridgeIdxMarkersResponse {
  markers: BridgeIdxMarker[];
  total: number;
  error?: string;
}

export interface PropertyCardListing {
  image?: string;
  price: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  status?: string;
  href: string;
  isSold?: boolean;
}

interface ODataResponse<T> {
  value?: T[];
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
}

const IDX_SEARCH_REVALIDATE_SECONDS = 60 * 5;
const IDX_DEFAULT_TOP = 24;
const IDX_DEFAULT_SKIP = 0;
const IDX_DEFAULT_ORDERBY = "ListPrice desc";

const IDX_SELECT_FIELDS = [
  "ListingKey",
  "ListPrice",
  "StandardStatus",
  "PropertyType",
  "City",
  "StateOrProvince",
  "PostalCode",
  "UnparsedAddress",
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "LivingArea",
  "YearBuilt",
  "Latitude",
  "Longitude",
  "Media",
  "DaysOnMarket",
  "OriginalEntryTimestamp",
  "ClosePrice",
  "CloseDate",
  "BuildingName",
  "LotSizeAcres",
  "GarageSpaces",
  "AssociationFee",
].join(",");

const IDX_MARKER_SELECT_FIELDS = [
  "ListingKey",
  "Latitude",
  "Longitude",
  "ListPrice",
  "OriginalListPrice",
].join(",");

function ensureServerSide() {
  if (typeof window !== "undefined") {
    throw new Error("Bridge API functions must run server-side only.");
  }
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = toNumber(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toNullableString(value: unknown): string | null {
  const stringValue = toStringValue(value).trim();
  return stringValue.length > 0 ? stringValue : null;
}

function toBooleanValue(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
}

function toFiniteNumberOrNull(value: unknown): number | null {
  const num = toNullableNumber(value);
  return typeof num === "number" && Number.isFinite(num) ? num : null;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeMedia(media: unknown): BridgeMedia[] {
  if (!Array.isArray(media)) {
    return [];
  }

  return media
    .map((item) => {
      const record = typeof item === "object" && item !== null ? item : {};
      return {
        MediaURL: toStringValue((record as Record<string, unknown>).MediaURL),
        Order: toNumber((record as Record<string, unknown>).Order),
        MimeType: toStringValue((record as Record<string, unknown>).MimeType),
        MediaCategory: toStringValue((record as Record<string, unknown>).MediaCategory),
        ShortDescription: toNullableString((record as Record<string, unknown>).ShortDescription),
      } as BridgeMedia;
    })
    .filter((item) => item.MediaURL.length > 0);
}

function sanitizeIdxOrderBy(orderby: string | undefined): string {
  if (!orderby) {
    return IDX_DEFAULT_ORDERBY;
  }

  const clean = orderby.trim().replace(/\+/g, " ");
  return clean || IDX_DEFAULT_ORDERBY;
}

function clampIdxInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.floor(value), min), max);
}

function buildIdxFilters(params: BridgeIdxSearchParams): string[] {
  const filters: string[] = [];
  const status = params.status || "Active";

  if (status === "Active") {
    // "For Sale" — show Active + Active Under Contract, never Pending
    if (params.hideActiveWithContract) {
      filters.push(`StandardStatus eq 'Active'`);
    } else {
      filters.push(`(StandardStatus eq 'Active' or StandardStatus eq 'Active Under Contract')`);
    }
  } else {
    filters.push(`StandardStatus eq '${escapeOData(status)}'`);
  }

  if (typeof params.minPrice === "number") {
    filters.push(`ListPrice ge ${params.minPrice}`);
  }

  if (typeof params.maxPrice === "number") {
    filters.push(`ListPrice le ${params.maxPrice}`);
  }

  if (typeof params.beds === "number") {
    filters.push(`BedroomsTotal ge ${params.beds}`);
  }

  if (typeof params.maxBeds === "number") {
    filters.push(`BedroomsTotal le ${params.maxBeds}`);
  }

  if (typeof params.baths === "number") {
    filters.push(`BathroomsTotalInteger ge ${params.baths}`);
  }

  if (typeof params.maxBaths === "number") {
    filters.push(`BathroomsTotalInteger le ${params.maxBaths}`);
  }

  if (typeof params.minSqft === "number") {
    filters.push(`LivingArea ge ${params.minSqft}`);
  }

  if (typeof params.maxSqft === "number") {
    filters.push(`LivingArea le ${params.maxSqft}`);
  }

  if (typeof params.minGarage === "number" && params.minGarage > 0) {
    filters.push(`GarageSpaces ge ${params.minGarage}`);
  }

  if (typeof params.maxDom === "number") {
    filters.push(`DaysOnMarket le ${params.maxDom}`);
  }

  if (params.waterfrontOnly) {
    filters.push(`WaterfrontYN eq true`);
  }

  if (params.poolOnly) {
    filters.push(`PoolPrivateYN eq true`);
  }

  if (params.minCloseDate) {
    filters.push(`CloseDate ge ${params.minCloseDate}`);
  }

  if (params.q) {
    const q = escapeOData(params.q.toLowerCase());
    filters.push(
      `(contains(tolower(UnparsedAddress), '${q}') or contains(tolower(City), '${q}') or contains(tolower(PostalCode), '${q}'))`
    );
  }

  if (params.keyword) {
    const kw = escapeOData(params.keyword.toLowerCase());
    filters.push(
      `(contains(tolower(PublicRemarks), '${kw}') or contains(tolower(BuildingName), '${kw}'))`
    );
  }

  if (params.forRent) {
    // "For Rent" mode — only show rental listings
    filters.push(`PropertyType eq 'Residential Lease'`);
  } else if (params.typeFilterExprs && params.typeFilterExprs.length > 0) {
    // Pre-built OData expressions from UI type picker (e.g. "PropertySubType eq 'Condominium'")
    if (params.typeFilterExprs.length === 1) {
      filters.push(params.typeFilterExprs[0]);
    } else {
      filters.push(`(${params.typeFilterExprs.join(" or ")})`);
    }
  } else if (params.types && params.types.length > 0) {
    if (params.types.length === 1) {
      filters.push(`PropertyType eq '${escapeOData(params.types[0])}'`);
    } else {
      const typeFilters = params.types.map((t) => `PropertyType eq '${escapeOData(t)}'`).join(" or ");
      filters.push(`(${typeFilters})`);
    }
  } else if (params.type) {
    filters.push(`PropertyType eq '${escapeOData(params.type)}'`);
  } else if (status === "Active") {
    // "Any Type" default: only residential property types (exclude commercial, leases, etc.)
    filters.push(`(PropertyType eq 'Residential' or PropertyType eq 'Residential Income' or PropertyType eq 'Land/Boat Docks')`);
  } else if (status === "Closed") {
    // Sold: exclude closed rentals/commercial — only show residential sales
    filters.push(`(PropertyType eq 'Residential' or PropertyType eq 'Residential Income' or PropertyType eq 'Land/Boat Docks')`);
  }

  const hasBBox =
    typeof params.swLat === "number" &&
    typeof params.swLng === "number" &&
    typeof params.neLat === "number" &&
    typeof params.neLng === "number";

  if (hasBBox) {
    filters.push(`Latitude ge ${params.swLat}`);
    filters.push(`Latitude le ${params.neLat}`);
    filters.push(`Longitude ge ${params.swLng}`);
    filters.push(`Longitude le ${params.neLng}`);
  }

  return filters;
}

function mapMediaToIdxPhotos(media: unknown): BridgeIdxListingPhoto[] {
  const photos = normalizeMedia(media)
    .filter((item) => item.MediaCategory === "Photo")
    .sort((a, b) => a.Order - b.Order)
    .map((item) => ({ url: item.MediaURL, order: item.Order }));

  return photos;
}

function toIdxListing(raw: unknown): BridgeIdxListing {
  const record = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const photos = mapMediaToIdxPhotos(record.Media);
  const address = toNullableString(record.UnparsedAddress);

  return {
    id: toStringValue(record.ListingKey),
    price: toNumber(record.ListPrice),
    status: toStringValue(record.StandardStatus),
    address: address || "",
    city: toStringValue(record.City),
    state: toStringValue(record.StateOrProvince),
    zip: toStringValue(record.PostalCode),
    beds: toNumber(record.BedroomsTotal),
    baths: toNumber(record.BathroomsTotalInteger),
    sqft: toFiniteNumberOrNull(record.LivingArea),
    lat: toNumber(record.Latitude),
    lng: toNumber(record.Longitude),
    photos,
    daysOnMarket: toFiniteNumberOrNull(record.DaysOnMarket),
    listDate: toNullableString(record.OriginalEntryTimestamp),
    photoCount: photos.length,
    propertyType: toNullableString(record.PropertyType),
    yearBuilt: toFiniteNumberOrNull(record.YearBuilt),
    buildingName: toNullableString(record.BuildingName),
  };
}

function toIdxMarker(raw: unknown): BridgeIdxMarker {
  const record = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  return {
    id: toStringValue(record.ListingKey),
    lat: toNumber(record.Latitude),
    lng: toNumber(record.Longitude),
    price: toNumber(record.ListPrice),
    originalPrice: toFiniteNumberOrNull(record.OriginalListPrice),
  };
}

function mockBaseLat(index: number): number {
  return 25.72 + (index % 25) * 0.012;
}

function mockBaseLng(index: number): number {
  return -80.28 + (index % 25) * 0.011;
}

function toIdxMockStatus(listing: (typeof MOCK_SEARCH)[number]): string {
  if (listing.isSold) return "Closed";
  if ((listing.status || "").toLowerCase().includes("pending")) return "Pending";
  return "Active";
}

function toIdxListingFromMock(index: number, listing: (typeof MOCK_SEARCH)[number]): BridgeIdxListing {
  const parsedPrice = Number(String(listing.price).replace(/[^0-9.]/g, "")) || 0;
  const lat = mockBaseLat(index);
  const lng = mockBaseLng(index);
  const photos = listing.image ? [{ url: listing.image, order: 1 }] : [];

  return {
    id: `MOCK-${index}`,
    price: parsedPrice,
    status: toIdxMockStatus(listing),
    address: listing.address,
    city: listing.city,
    state: listing.state,
    zip: listing.zip,
    beds: listing.beds,
    baths: listing.baths,
    sqft: typeof listing.sqft === "number" ? listing.sqft : null,
    lat,
    lng,
    photos,
    daysOnMarket: null,
    listDate: null,
    photoCount: photos.length,
    propertyType: "Residential",
    yearBuilt: null,
    buildingName: null,
  };
}

function filterIdxMockListings(listings: BridgeIdxListing[], params: BridgeIdxSearchParams): BridgeIdxListing[] {
  const status = params.status || "Active";

  let filtered = listings.filter((item) => item.status === status);

  if (typeof params.minPrice === "number") {
    filtered = filtered.filter((item) => item.price >= params.minPrice!);
  }

  if (typeof params.maxPrice === "number") {
    filtered = filtered.filter((item) => item.price <= params.maxPrice!);
  }

  if (params.hideActiveWithContract) {
    filtered = filtered.filter((item) => item.status !== "Active Under Contract");
  }

  if (typeof params.beds === "number") {
    filtered = filtered.filter((item) => item.beds >= params.beds!);
  }

  if (typeof params.maxBeds === "number") {
    filtered = filtered.filter((item) => item.beds <= params.maxBeds!);
  }

  if (typeof params.baths === "number") {
    filtered = filtered.filter((item) => item.baths >= params.baths!);
  }

  if (typeof params.maxBaths === "number") {
    filtered = filtered.filter((item) => item.baths <= params.maxBaths!);
  }

  if (typeof params.minSqft === "number") {
    filtered = filtered.filter((item) => (item.sqft ?? 0) >= params.minSqft!);
  }

  if (typeof params.maxSqft === "number") {
    filtered = filtered.filter((item) => (item.sqft ?? 0) <= params.maxSqft!);
  }

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.address.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.zip.includes(q)
    );
  }

  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (item) => (item.buildingName ?? "").toLowerCase().includes(kw)
    );
  }

  if (params.types && params.types.length > 0) {
    filtered = filtered.filter((item) => params.types!.includes(item.propertyType || ""));
  } else if (params.type) {
    filtered = filtered.filter((item) => item.propertyType === params.type);
  }

  const hasBBox =
    typeof params.swLat === "number" &&
    typeof params.swLng === "number" &&
    typeof params.neLat === "number" &&
    typeof params.neLng === "number";

  if (hasBBox) {
    filtered = filtered.filter(
      (item) =>
        item.lat >= params.swLat! &&
        item.lat <= params.neLat! &&
        item.lng >= params.swLng! &&
        item.lng <= params.neLng!
    );
  }

  const order = sanitizeIdxOrderBy(params.orderby);
  if (order.toLowerCase().includes("listprice")) {
    const desc = order.toLowerCase().includes("desc");
    filtered = [...filtered].sort((a, b) => (desc ? b.price - a.price : a.price - b.price));
  }

  return filtered;
}

function buildMockIdxSearchResponse(params: BridgeIdxSearchParams): BridgeIdxSearchResponse {
  const top = clampIdxInt(params.top, IDX_DEFAULT_TOP, 1, 100);
  const skip = clampIdxInt(params.skip, IDX_DEFAULT_SKIP, 0, 20000);

  const source = MOCK_SEARCH.map((listing, index) => toIdxListingFromMock(index, listing));
  const filtered = filterIdxMockListings(source, params);
  const pageSlice = filtered.slice(skip, skip + top);

  return {
    listings: pageSlice,
    total: filtered.length,
    hasMore: skip + top < filtered.length,
  };
}

function buildMockIdxMarkersResponse(params: BridgeIdxSearchParams): BridgeIdxMarkersResponse {
  const source = MOCK_SEARCH.map((listing, index) => toIdxListingFromMock(index, listing));
  const filtered = filterIdxMockListings(source, params).slice(0, 500);

  return {
    markers: filtered.map((item) => ({ id: item.id, lat: item.lat, lng: item.lng, price: item.price, originalPrice: null })),
    total: filtered.length,
  };
}

export async function fetchIdxSearch(params: BridgeIdxSearchParams = {}): Promise<BridgeIdxSearchResponse> {
  const top = clampIdxInt(params.top, IDX_DEFAULT_TOP, 1, 100);
  const skip = clampIdxInt(params.skip, IDX_DEFAULT_SKIP, 0, 20000);
  const orderby = sanitizeIdxOrderBy(params.orderby);

  const safeParams: BridgeIdxSearchParams = {
    ...params,
    top,
    skip,
    orderby,
    status: params.status || "Active",
  };

  const query = new URLSearchParams();
  query.set("$select", IDX_SELECT_FIELDS);
  query.set("$count", "true");
  query.set("$top", String(top));
  query.set("$skip", String(skip));
  query.set("$orderby", orderby);

  const filters = buildIdxFilters(safeParams);
  if (filters.length > 0) {
    query.set("$filter", filters.join(" and "));
  }

  try {
    const response = await bridgeFetch<unknown>(query, IDX_SEARCH_REVALIDATE_SECONDS);
    const listings = (response.value || []).map((item) => toIdxListing(item));
    const total = typeof response["@odata.count"] === "number" ? response["@odata.count"] : listings.length;
    const hasMore = Boolean(response["@odata.nextLink"]);

    return {
      listings,
      total,
      hasMore,
    };
  } catch (error) {
    console.error("fetchIdxSearch failed:", error);
    if (IS_DEV) {
      const fallback = buildMockIdxSearchResponse(safeParams);
      return { ...fallback, error: "Unable to load live Bridge listings." };
    }
    return { listings: [], total: 0, hasMore: false, error: "Listing data temporarily unavailable." };
  }
}

export async function fetchIdxMarkers(params: BridgeIdxSearchParams = {}): Promise<BridgeIdxMarkersResponse> {
  const safeParams: BridgeIdxSearchParams = {
    ...params,
    top: 200,
    skip: 0,
    orderby: "ListPrice desc",
    status: params.status || "Active",
  };

  const filters = buildIdxFilters(safeParams);
  const filterStr = filters.length > 0 ? filters.join(" and ") : undefined;

  // Bridge production API limits $top to 200, so paginate to get more markers
  const PAGE_SIZE = 200;
  const MAX_MARKERS = 500;
  const allMarkers: BridgeIdxMarker[] = [];
  let total = 0;

  try {
    for (let skip = 0; skip < MAX_MARKERS; skip += PAGE_SIZE) {
      const query = new URLSearchParams();
      query.set("$select", IDX_MARKER_SELECT_FIELDS);
      query.set("$count", "true");
      query.set("$top", String(PAGE_SIZE));
      query.set("$skip", String(skip));
      if (filterStr) query.set("$filter", filterStr);

      const response = await bridgeFetch<unknown>(query, IDX_SEARCH_REVALIDATE_SECONDS);
      const batch = (response.value || []).map((item) => toIdxMarker(item));
      if (skip === 0) {
        total = typeof response["@odata.count"] === "number" ? response["@odata.count"] : batch.length;
      }
      allMarkers.push(...batch);

      // Stop if we got fewer than a full page (no more results)
      if (batch.length < PAGE_SIZE) break;
    }

    return { markers: allMarkers, total };
  } catch (error) {
    console.error("fetchIdxMarkers failed:", error);
    if (IS_DEV) {
      const fallback = buildMockIdxMarkersResponse(safeParams);
      return { ...fallback, error: "Unable to load live map markers." };
    }
    return { markers: [], total: 0, error: "Map data temporarily unavailable." };
  }
}

function normalizeProperty(raw: unknown): BridgeProperty {
  const record = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  return {
    ListingKey: toStringValue(record.ListingKey),
    ListingId: toStringValue(record.ListingId),
    ListPrice: toNumber(record.ListPrice),
    StandardStatus: toStringValue(record.StandardStatus),
    PropertyType: toStringValue(record.PropertyType),
    PropertySubType: toStringValue(record.PropertySubType),
    StreetNumber: toStringValue(record.StreetNumber),
    StreetName: toStringValue(record.StreetName),
    StreetSuffix: toNullableString(record.StreetSuffix),
    UnitNumber: toNullableString(record.UnitNumber),
    City: toStringValue(record.City),
    StateOrProvince: toStringValue(record.StateOrProvince),
    PostalCode: toStringValue(record.PostalCode),
    BedroomsTotal: toNumber(record.BedroomsTotal),
    BathroomsTotalInteger: toNumber(record.BathroomsTotalInteger),
    BathroomsFull: toNumber(record.BathroomsFull),
    BathroomsHalf: toNumber(record.BathroomsHalf),
    LivingArea: toNumber(record.LivingArea),
    LotSizeArea: toNullableNumber(record.LotSizeArea),
    YearBuilt: toNullableNumber(record.YearBuilt),
    PublicRemarks: toNullableString(record.PublicRemarks),
    Latitude: toNumber(record.Latitude),
    Longitude: toNumber(record.Longitude),
    DaysOnMarket: toNullableNumber(record.DaysOnMarket),
    OriginalListPrice: toNullableNumber(record.OriginalListPrice),
    ListingContractDate: toStringValue(record.ListingContractDate),
    ClosePrice: toNullableNumber(record.ClosePrice),
    CloseDate: toNullableString(record.CloseDate),
    AssociationFee: toNullableNumber(record.AssociationFee),
    AssociationFeeFrequency: toNullableString(record.AssociationFeeFrequency),
    GarageSpaces: toNullableNumber(record.GarageSpaces),
    BuildingName: toNullableString(record.BuildingName),
    WaterfrontYN: toBooleanValue(record.WaterfrontYN),
    PoolPrivateYN: toBooleanValue(record.PoolPrivateYN),
    ViewYN: toBooleanValue(record.ViewYN),
    Appliances: toStringArray(record.Appliances),
    InteriorFeatures: toStringArray(record.InteriorFeatures),
    ExteriorFeatures: toStringArray(record.ExteriorFeatures),
    Cooling: toStringArray(record.Cooling),
    Heating: toStringArray(record.Heating),
    ParkingFeatures: toStringArray(record.ParkingFeatures),
    BuildingFeatures: toStringArray(record.BuildingFeatures),
    ListAgentFullName: toNullableString(record.ListAgentFullName),
    ListOfficeName: toNullableString(record.ListOfficeName),
    ListOfficePhone: toNullableString(record.ListOfficePhone),
    SubdivisionName: toNullableString(record.SubdivisionName),
    LotSizeAcres: toNullableNumber(record.LotSizeAcres),
    LotSizeSquareFeet: toNullableNumber(record.LotSizeSquareFeet),
    CountyOrParish: toNullableString(record.CountyOrParish),
    CoveredSpaces: toNullableNumber(record.CoveredSpaces),
    StoriesTotal: toNullableNumber(record.StoriesTotal),
    AttachedGarageYN: toBooleanValue(record.AttachedGarageYN),
    DirectionFaces: toNullableString(record.DirectionFaces),
    OccupantType: toNullableString(record.OccupantType),
    TaxAnnualAmount: toNullableNumber(record.TaxAnnualAmount),
    TaxLegalDescription: toNullableString(record.TaxLegalDescription),
    TaxYear: toNullableNumber(record.TaxYear),
    ArchitecturalStyle: toStringArray(record.ArchitecturalStyle),
    ConstructionMaterials: toStringArray(record.ConstructionMaterials),
    CommunityFeatures: toStringArray(record.CommunityFeatures),
    Flooring: toStringArray(record.Flooring),
    Levels: toStringArray(record.Levels),
    ListingTerms: toStringArray(record.ListingTerms),
    LotFeatures: toStringArray(record.LotFeatures),
    PatioAndPorchFeatures: toStringArray(record.PatioAndPorchFeatures),
    PetsAllowed: toStringArray(record.PetsAllowed),
    PoolFeatures: toStringArray(record.PoolFeatures),
    Possession: toStringArray(record.Possession),
    Roof: toStringArray(record.Roof),
    Sewer: toStringArray(record.Sewer),
    View: toStringArray(record.View),
    WaterSource: toStringArray(record.WaterSource),
    VirtualTourURLUnbranded: toNullableString(record.VirtualTourURLUnbranded),
    Media: normalizeMedia(record.Media),
  };
}

function escapeOData(value: string): string {
  return value.replace(/'/g, "''");
}

function getBridgeConfig() {
  const proxyBase = process.env.BRIDGE_PROXY_URL; // e.g., http://34.75.30.116:8787
  const apiBase = process.env.BRIDGE_API_BASE || DEFAULT_BRIDGE_API_BASE;
  const dataset = process.env.BRIDGE_DATASET || DEFAULT_BRIDGE_DATASET;
  const token = process.env.BRIDGE_SERVER_TOKEN;

  // If proxy is configured, route through it (proxy handles auth)
  const useProxy = !!proxyBase;
  const endpoint = useProxy
    ? `${proxyBase}/api/v2/OData/${dataset}/Property`
    : `${apiBase}/${dataset}/Property`;

  return {
    apiBase,
    dataset,
    token,
    endpoint,
    useProxy,
  };
}

async function bridgeFetch<T>(query: URLSearchParams, revalidateSeconds: number): Promise<ODataResponse<T>> {
  ensureServerSide();
  const config = getBridgeConfig();

  if (!config.useProxy && !config.token) {
    throw new Error("Missing BRIDGE_SERVER_TOKEN or BRIDGE_PROXY_URL environment variable.");
  }

  const url = `${config.endpoint}?${query.toString()}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // Only add auth header when calling Bridge directly (proxy handles its own auth)
  if (!config.useProxy && config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    next: {
      revalidate: revalidateSeconds,
    },
  });

  if (!response.ok) {
    throw new Error(`Bridge API request failed (${response.status})`);
  }

  return (await response.json()) as ODataResponse<T>;
}

function buildFilters(params: BridgeSearchParams): string[] {
  const filters: string[] = [];

  if (params.status) {
    filters.push(`StandardStatus eq '${escapeOData(params.status)}'`);
  }

  if (params.propertyType) {
    filters.push(`PropertyType eq '${escapeOData(params.propertyType)}'`);
  } else if (params.status === "Active") {
    // Only residential property types (exclude commercial, leases, etc.)
    filters.push(`(PropertyType eq 'Residential' or PropertyType eq 'Residential Income' or PropertyType eq 'Land/Boat Docks')`);
  }

  if (typeof params.minPrice === "number") {
    filters.push(`ListPrice ge ${params.minPrice}`);
  }

  if (typeof params.maxPrice === "number") {
    filters.push(`ListPrice le ${params.maxPrice}`);
  }

  if (typeof params.minBeds === "number") {
    filters.push(`BedroomsTotal ge ${params.minBeds}`);
  }

  if (typeof params.minBaths === "number") {
    filters.push(`BathroomsTotalInteger ge ${params.minBaths}`);
  }

  if (typeof params.minSqft === "number") {
    filters.push(`LivingArea ge ${params.minSqft}`);
  }

  if (typeof params.maxSqft === "number") {
    filters.push(`LivingArea le ${params.maxSqft}`);
  }

  if (typeof params.waterfront === "boolean") {
    filters.push(`WaterfrontYN eq ${params.waterfront}`);
  }

  if (typeof params.pool === "boolean") {
    filters.push(`PoolPrivateYN eq ${params.pool}`);
  }

  if (params.city) {
    filters.push(`contains(tolower(City), '${escapeOData(params.city.toLowerCase())}')`);
  }

  if (params.postalCode) {
    filters.push(`contains(PostalCode, '${escapeOData(params.postalCode)}')`);
  }

  if (params.q) {
    const query = escapeOData(params.q.toLowerCase());
    filters.push(
      `(contains(tolower(City), '${query}') or contains(tolower(PostalCode), '${query}') or contains(tolower(StreetName), '${query}'))`
    );
  }

  return filters;
}

function sanitizeSort(sort: string | undefined): string {
  if (!sort) {
    return "ListingContractDate desc";
  }

  const safe = sort.trim().replace(/\+/g, " ");
  if (!safe) {
    return "ListingContractDate desc";
  }

  return safe;
}

function toPositiveInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.floor(value), min), max);
}

function parseResult<T>(response: ODataResponse<T>): BridgeSearchResult {
  const properties = (response.value || []).map((item) => normalizeProperty(item));
  const totalCount = typeof response["@odata.count"] === "number" ? response["@odata.count"] : properties.length;

  return {
    properties,
    totalCount,
    nextLink: response["@odata.nextLink"] || null,
  };
}

export function getListingPhotos(property: BridgeProperty): BridgeMedia[] {
  return [...property.Media]
    .filter((item) => item.MediaCategory === "Photo")
    .sort((a, b) => a.Order - b.Order);
}

export function formatAddress(property: BridgeProperty): string {
  const parts = [property.StreetNumber, property.StreetName, property.StreetSuffix || ""].filter(Boolean);
  const base = parts.join(" ").trim();

  if (property.UnitNumber) {
    return `${base} Unit ${property.UnitNumber}`.trim();
  }

  return base;
}

export function formatCurrency(value: number | null | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactPrice(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0";
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }

  return formatCurrency(value);
}

function slugifyForUrl(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function propertyToCardListing(property: BridgeProperty, sold = false): PropertyCardListing {
  const photos = getListingPhotos(property);
  const photo = photos[0]?.MediaURL;
  const amount = sold ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const slug = slugifyForUrl(
    [property.StreetNumber, property.StreetName, property.StreetSuffix, property.UnitNumber,
     property.City, property.StateOrProvince, property.PostalCode, property.ListingKey]
      .filter(Boolean).join(" ")
  );

  return {
    image: photo,
    price: formatCurrency(amount),
    address: formatAddress(property),
    city: property.City,
    state: property.StateOrProvince,
    zip: property.PostalCode,
    beds: property.BedroomsTotal,
    baths: property.BathroomsTotalInteger,
    sqft: property.LivingArea,
    status: sold ? "SOLD" : property.StandardStatus,
    href: `/property/${slug}/`,
    isSold: sold,
  };
}

export function mockListingToBridgeProperty(index: number, listing: (typeof MOCK_SEARCH)[number]): BridgeProperty {
  const cleanPrice = Number(listing.price.replace(/[^0-9]/g, ""));

  return {
    ListingKey: `MOCK-${index}`,
    ListingId: `MOCK-${index}`,
    ListPrice: cleanPrice,
    StandardStatus: listing.isSold ? "Closed" : listing.status || "Active",
    PropertyType: "Residential",
    PropertySubType: "Condominium",
    StreetNumber: listing.address.split(" ")[0] || "",
    StreetName: listing.address.split(" ").slice(1).join(" "),
    StreetSuffix: null,
    UnitNumber: null,
    City: listing.city,
    StateOrProvince: listing.state,
    PostalCode: listing.zip,
    BedroomsTotal: listing.beds,
    BathroomsTotalInteger: Math.floor(listing.baths),
    BathroomsFull: Math.floor(listing.baths),
    BathroomsHalf: listing.baths % 1 === 0.5 ? 1 : 0,
    LivingArea: listing.sqft,
    LotSizeArea: null,
    YearBuilt: null,
    PublicRemarks: null,
    Latitude: 0,
    Longitude: 0,
    DaysOnMarket: null,
    OriginalListPrice: null,
    ListingContractDate: "",
    ClosePrice: listing.isSold ? cleanPrice : null,
    CloseDate: null,
    AssociationFee: null,
    AssociationFeeFrequency: null,
    GarageSpaces: null,
    BuildingName: null,
    WaterfrontYN: false,
    PoolPrivateYN: false,
    ViewYN: false,
    Appliances: [],
    InteriorFeatures: [],
    ExteriorFeatures: [],
    Cooling: [],
    Heating: [],
    ParkingFeatures: [],
    BuildingFeatures: [],
    ListAgentFullName: null,
    ListOfficeName: null,
    ListOfficePhone: null,
    SubdivisionName: null,
    LotSizeAcres: null,
    LotSizeSquareFeet: null,
    CountyOrParish: null,
    CoveredSpaces: null,
    StoriesTotal: null,
    AttachedGarageYN: false,
    DirectionFaces: null,
    OccupantType: null,
    TaxAnnualAmount: null,
    TaxLegalDescription: null,
    TaxYear: null,
    ArchitecturalStyle: [],
    ConstructionMaterials: [],
    CommunityFeatures: [],
    Flooring: [],
    Levels: [],
    ListingTerms: [],
    LotFeatures: [],
    PatioAndPorchFeatures: [],
    PetsAllowed: [],
    PoolFeatures: [],
    Possession: [],
    Roof: [],
    Sewer: [],
    View: [],
    WaterSource: [],
    VirtualTourURLUnbranded: null,
    Media: listing.image
      ? [{ MediaURL: listing.image, Order: 1, MimeType: "image/jpeg", MediaCategory: "Photo", ShortDescription: null }]
      : [],
  };
}

function getMockPropertyByListingKey(listingKey: string): BridgeProperty | null {
  if (!listingKey.startsWith("MOCK-")) {
    return null;
  }

  const index = Number(listingKey.replace("MOCK-", ""));
  if (!Number.isFinite(index) || index < 0 || index >= MOCK_SEARCH.length) {
    return null;
  }

  return mockListingToBridgeProperty(index, MOCK_SEARCH[index]);
}

export function getMockSearchResult(page = 1, limit = 24): BridgeSearchResult {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  const slice = MOCK_SEARCH.slice(start, end);

  return {
    properties: slice.map((listing, index) => mockListingToBridgeProperty(start + index, listing)),
    totalCount: MOCK_SEARCH.length,
    nextLink: null,
  };
}

export async function searchProperties(params: BridgeSearchParams = {}): Promise<BridgeSearchResult> {
  const page = toPositiveInt(params.page, 1, 1, 1000);
  const limit = toPositiveInt(params.limit, 24, 1, 100);

  const query = new URLSearchParams();
  query.set("$count", "true");
  query.set("$top", String(limit));
  query.set("$skip", String((page - 1) * limit));
  query.set("$orderby", sanitizeSort(params.sort));

  const filters = buildFilters(params);
  if (filters.length > 0) {
    query.set("$filter", filters.join(" and "));
  }

  try {
    const response = await bridgeFetch<unknown>(query, SEARCH_REVALIDATE_SECONDS);
    return parseResult(response);
  } catch (error) {
    console.error("searchProperties failed:", error);
    if (IS_DEV) {
      return getMockSearchResult(page, limit);
    }
    return { properties: [], totalCount: 0, nextLink: null };
  }
}

export async function getProperty(listingKey: string): Promise<BridgeProperty | null> {
  if (!listingKey) {
    return null;
  }

  // MOCK-* keys only resolved in dev; never served in production
  if (IS_DEV) {
    const mockMatch = getMockPropertyByListingKey(listingKey);
    if (mockMatch) {
      return mockMatch;
    }
  }

  const query = new URLSearchParams();
  query.set("$top", "1");
  query.set("$filter", `ListingKey eq '${escapeOData(listingKey)}'`);

  try {
    const response = await bridgeFetch<unknown>(query, DETAIL_REVALIDATE_SECONDS);
    const first = response.value?.[0];
    return first ? normalizeProperty(first) : null;
  } catch (error) {
    console.error(`getProperty failed for ${listingKey}:`, error);
    return null;
  }
}

export async function getRecentListings(limit = 8): Promise<BridgeProperty[]> {
  const query = new URLSearchParams();
  query.set("$top", String(toPositiveInt(limit, 8, 1, 100)));
  query.set("$orderby", "ListingContractDate desc");
  query.set("$filter", "StandardStatus eq 'Active' and (PropertyType eq 'Residential' or PropertyType eq 'Residential Income' or PropertyType eq 'Land/Boat Docks')");

  try {
    const response = await bridgeFetch<unknown>(query, SEARCH_REVALIDATE_SECONDS);
    return (response.value || []).map((item) => normalizeProperty(item));
  } catch (error) {
    console.error("getRecentListings failed:", error);
    if (IS_DEV) {
      return MOCK_EXCLUSIVE.map((listing, index) => mockListingToBridgeProperty(index, listing));
    }
    return [];
  }
}

export async function getSoldListings(limit = 8): Promise<BridgeProperty[]> {
  const query = new URLSearchParams();
  query.set("$top", String(toPositiveInt(limit, 8, 1, 100)));
  query.set("$orderby", "CloseDate desc");
  query.set("$filter", "StandardStatus eq 'Closed'");

  try {
    const response = await bridgeFetch<unknown>(query, SEARCH_REVALIDATE_SECONDS);
    return (response.value || []).map((item) => normalizeProperty(item));
  } catch (error) {
    console.error("getSoldListings failed:", error);
    if (IS_DEV) {
      return MOCK_SOLD.map((listing, index) => mockListingToBridgeProperty(index, listing));
    }
    return [];
  }
}
