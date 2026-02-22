import { MOCK_EXCLUSIVE, MOCK_SEARCH, MOCK_SOLD } from "@/data/mockListings";

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
    Media: normalizeMedia(record.Media),
  };
}

function escapeOData(value: string): string {
  return value.replace(/'/g, "''");
}

function getBridgeConfig() {
  const apiBase = process.env.BRIDGE_API_BASE || DEFAULT_BRIDGE_API_BASE;
  const dataset = process.env.BRIDGE_DATASET || DEFAULT_BRIDGE_DATASET;
  const token = process.env.BRIDGE_SERVER_TOKEN;

  return {
    apiBase,
    dataset,
    token,
    endpoint: `${apiBase}/${dataset}/Property`,
  };
}

async function bridgeFetch<T>(query: URLSearchParams, revalidateSeconds: number): Promise<ODataResponse<T>> {
  ensureServerSide();
  const config = getBridgeConfig();

  if (!config.token) {
    throw new Error("Missing BRIDGE_SERVER_TOKEN environment variable.");
  }

  const url = `${config.endpoint}?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/json",
    },
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

export function propertyToCardListing(property: BridgeProperty, sold = false): PropertyCardListing {
  const photos = getListingPhotos(property);
  const photo = photos[0]?.MediaURL;
  const amount = sold ? property.ClosePrice || property.ListPrice : property.ListPrice;

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
    href: `/property/${property.ListingKey}/`,
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
    console.error("searchProperties failed, falling back to mock data:", error);
    return getMockSearchResult(page, limit);
  }
}

export async function getProperty(listingKey: string): Promise<BridgeProperty | null> {
  if (!listingKey) {
    return null;
  }

  const mockMatch = getMockPropertyByListingKey(listingKey);
  if (mockMatch) {
    return mockMatch;
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
  query.set("$filter", "StandardStatus eq 'Active'");

  try {
    const response = await bridgeFetch<unknown>(query, SEARCH_REVALIDATE_SECONDS);
    return (response.value || []).map((item) => normalizeProperty(item));
  } catch (error) {
    console.error("getRecentListings failed, using mock fallback:", error);
    return MOCK_EXCLUSIVE.map((listing, index) => mockListingToBridgeProperty(index, listing));
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
    console.error("getSoldListings failed, using mock fallback:", error);
    return MOCK_SOLD.map((listing, index) => mockListingToBridgeProperty(index, listing));
  }
}
