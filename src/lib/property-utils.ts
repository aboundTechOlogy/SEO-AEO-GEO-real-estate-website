import type { BridgeIdxListing, BridgeMedia, BridgeProperty } from "@/lib/bridge";

export interface IdxDetailRow {
  label: string;
  value: string;
}

export interface IdxDetailSectionBundle {
  description: string;
  basicInformationRows: IdxDetailRow[];
  amenities: string[];
  exteriorFeatureRows: IdxDetailRow[];
  interiorFeatureRows: IdxDetailRow[];
  propertyFeatureRows: IdxDetailRow[];
}

export interface IdxLegalDisclosure {
  courtesyLine: string | null;
  disclaimer: string;
}

export interface SimilarListingSlot {
  key: string;
  listingKey: string | null;
  href: string | null;
  imageUrl: string | null;
  priceLabel: string;
  addressLine: string;
  detailLine: string;
  placeholderReason: "none" | "short-feed" | "empty-feed";
}

const IDX_DEFAULT_DISCLAIMER =
  "The multiple listing information is provided by the MLS from a copyrighted compilation of listings. " +
  "The compilation of listings and each individual listing are copyrighted. The information provided is for consumers' personal, noncommercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing. " +
  "All properties are subject to prior sale or withdrawal. All information provided is deemed reliable but is not guaranteed accurate, and should be independently verified.";

// ---------------------------------------------------------------------------
// SEO-friendly property URL slugs
// Format: /property/5961-sw-56th-ter-south-miami-fl-33143-a11961479/
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Build a slug from a full BridgeProperty. */
export function generatePropertySlug(property: BridgeProperty): string {
  const parts = [
    property.StreetNumber,
    property.StreetName,
    property.StreetSuffix,
    property.UnitNumber,
    property.City,
    property.StateOrProvince,
    property.PostalCode,
    property.ListingKey,
  ].filter(Boolean);
  return slugify(parts.join(" "));
}

/** Build a slug from a BridgeIdxListing (search-result shape). */
export function generateListingSlug(listing: BridgeIdxListing): string {
  const parts = [
    listing.address,
    listing.city,
    listing.state,
    listing.zip,
    listing.id,
  ].filter(Boolean);
  return slugify(parts.join(" "));
}

/**
 * Extract the ListingKey from a property slug or raw key.
 * Looks for a 5-digit zip code near the end; everything after it is the key.
 * Falls back to the full value if no zip pattern is found (raw key).
 */
export function extractListingKeyFromSlug(slugOrKey: string): string {
  // Match: ...-{5-digit-zip}-{listingKey}
  const match = slugOrKey.match(/-(\d{5})-([^/]+)$/);
  if (match) {
    // Restore underscores that slugify converted to hyphens (e.g. P_xxx mock keys)
    return match[2];
  }
  // No zip pattern — assume it's a raw listingKey
  return slugOrKey;
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

export function calculatePricePerSqft(price: number, sqft: number): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(sqft) || sqft <= 0) {
    return null;
  }

  return Math.round(price / sqft);
}

function toNonEmptyString(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function formatCurrencyOrNull(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return formatCurrency(value);
}

function formatDateLabel(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatSqft(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return `${value.toLocaleString()} Sq.Ft`;
}

function formatAcres(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} Acres`;
}

function formatLotSizeSquareFeetAndAcres(
  squareFeet: number | null | undefined,
  acres: number | null | undefined,
): string | null {
  const sqft = formatSqft(squareFeet);
  const acresValue = formatAcres(acres);

  if (sqft && acresValue) {
    return `${sqft} / ${acresValue}`;
  }

  return sqft || acresValue;
}

function joinList(values: string[] | null | undefined): string | null {
  if (!values || values.length === 0) {
    return null;
  }

  const cleaned = values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (cleaned.length === 0) {
    return null;
  }

  return cleaned.join(", ");
}

function uniqueList(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const raw of values) {
    const value = raw.trim();
    if (!value) {
      continue;
    }

    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(value);
  }

  return output;
}

function row(label: string, value: string | null): IdxDetailRow | null {
  if (!value) {
    return null;
  }

  return { label, value };
}

function collectRows(rows: Array<IdxDetailRow | null>): IdxDetailRow[] {
  return rows.filter((item): item is IdxDetailRow => Boolean(item));
}

function getExteriorWaterfrontDescription(property: BridgeProperty): string | null {
  const exteriorWaterfront = property.ExteriorFeatures.find((item) =>
    item.toLowerCase().includes("water"),
  );

  if (exteriorWaterfront) {
    return exteriorWaterfront;
  }

  if (property.WaterfrontYN) {
    return "Waterfront";
  }

  return null;
}

function getParkingSpaces(property: BridgeProperty): string | null {
  const spaces: string[] = [];

  if (property.GarageSpaces && property.GarageSpaces > 0) {
    spaces.push(property.GarageSpaces.toLocaleString());
  }

  if (property.CoveredSpaces && property.CoveredSpaces > 0) {
    spaces.push(property.CoveredSpaces.toLocaleString());
  }

  if (spaces.length > 0) {
    return spaces.join(" / ");
  }

  return null;
}

function getHoaFees(property: BridgeProperty): string | null {
  if (!property.AssociationFee || !Number.isFinite(property.AssociationFee)) {
    return null;
  }

  const fee = formatCurrency(property.AssociationFee);
  if (property.AssociationFeeFrequency) {
    return `${fee} / ${property.AssociationFeeFrequency}`;
  }

  return fee;
}

function boolToYesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

export function buildIdxDetailSections(property: BridgeProperty): IdxDetailSectionBundle {
  const description = toNonEmptyString(property.PublicRemarks) || "No description provided.";
  const listPriceForRange =
    property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const totalSize =
    formatLotSizeSquareFeetAndAcres(
      property.LotSizeSquareFeet ?? property.LotSizeArea,
      property.LotSizeAcres,
    ) || formatSqft(property.LivingArea);
  const sqft = formatSqft(property.LivingArea);
  const lotSize =
    formatLotSizeSquareFeetAndAcres(
      property.LotSizeSquareFeet ?? property.LotSizeArea,
      property.LotSizeAcres,
    );
  const waterfrontDescription = getExteriorWaterfrontDescription(property);

  const basicInformationRows = collectRows([
    row("MLS #", toNonEmptyString(property.ListingId) || toNonEmptyString(property.ListingKey)),
    row("Type", toNonEmptyString(property.PropertyType) || toNonEmptyString(property.PropertySubType)),
    row("Status", toNonEmptyString(property.StandardStatus)),
    row(
      "Subdivision/Complex",
      toNonEmptyString(property.SubdivisionName) || toNonEmptyString(property.BuildingName),
    ),
    row("Year Built", property.YearBuilt ? String(property.YearBuilt) : null),
    row("Price Range", formatCurrencyOrNull(listPriceForRange)),
    row("Total Size", totalSize),
    row("Date Closed", formatDateLabel(property.CloseDate)),
    row("Date Listed", formatDateLabel(property.ListingContractDate)),
    row("Days On Market", property.DaysOnMarket != null ? String(property.DaysOnMarket) : null),
    row("Community Name", toNonEmptyString(property.CountyOrParish)),
  ]);

  const amenities = uniqueList([
    ...property.CommunityFeatures,
    ...property.BuildingFeatures,
    ...property.PoolFeatures,
  ]);

  const exteriorFeatureRows = collectRows([
    row("Waterfront", boolToYesNo(property.WaterfrontYN)),
    row("Parking Spaces", getParkingSpaces(property)),
    row("Pool", boolToYesNo(property.PoolPrivateYN || property.PoolFeatures.length > 0)),
    row("View", joinList(property.View)),
    row("Construction Type", joinList(property.ConstructionMaterials)),
    row("Waterfront Description", waterfrontDescription),
    row("Parking Description", joinList(property.ParkingFeatures)),
    row("Exterior Features", joinList(property.ExteriorFeatures)),
    row("Roof Description", joinList(property.Roof)),
    row("Style", joinList(property.ArchitecturalStyle)),
  ]);

  const interiorFeatureRows = collectRows([
    row("Adjusted Sqft", sqft),
    row("Cooling Description", joinList(property.Cooling)),
    row("Equipment Appliances", joinList(property.Appliances)),
    row("Floor Description", joinList(property.Flooring)),
    row("Heating Description", joinList(property.Heating)),
    row("Interior Features", joinList(property.InteriorFeatures)),
    row("Sqft", sqft),
  ]);

  const propertyFeatureRows = collectRows([
    row("Address", formatAddress(property)),
    row("Aprox. Lot Size", lotSize),
    row("Architectural Style", joinList(property.ArchitecturalStyle)),
    row("Association Fee Frequency", toNonEmptyString(property.AssociationFeeFrequency)),
    row("Attached Garage", boolToYesNo(property.AttachedGarageYN)),
    row("City", toNonEmptyString(property.City)),
    row("Community Features", joinList(property.CommunityFeatures)),
    row("Construction Materials", joinList(property.ConstructionMaterials)),
    row("County", toNonEmptyString(property.CountyOrParish)),
    row("Covered Spaces", property.CoveredSpaces ? String(property.CoveredSpaces) : null),
    row("Direction Faces", toNonEmptyString(property.DirectionFaces)),
    row("Frontage Length", null),
    row("Furnished Info", null),
    row("Garage", property.GarageSpaces ? String(property.GarageSpaces) : null),
    row("Levels", joinList(property.Levels)),
    row("Listing Terms", joinList(property.ListingTerms)),
    row("Lot Features", joinList(property.LotFeatures)),
    row("Occupant Type", toNonEmptyString(property.OccupantType)),
    row("Parking Features", joinList(property.ParkingFeatures)),
    row("Patio And Porch Features", joinList(property.PatioAndPorchFeatures)),
    row("Pets Allowed", joinList(property.PetsAllowed)),
    row("Pool Features", joinList(property.PoolFeatures)),
    row("Possession", joinList(property.Possession)),
    row("Postal City", toNonEmptyString(property.City)),
    row("Public Survey Section", null),
    row("Public Survey Township", null),
    row("Roof", joinList(property.Roof)),
    row("Sewer Description", joinList(property.Sewer)),
    row("Short Sale", null),
    row("Stories", property.StoriesTotal ? String(property.StoriesTotal) : null),
    row("HOA Fees", getHoaFees(property)),
    row("Subdivision Complex", toNonEmptyString(property.SubdivisionName)),
    row("Subdivision Info", toNonEmptyString(property.SubdivisionName)),
    row("Tax Amount", formatCurrencyOrNull(property.TaxAnnualAmount)),
    row("Tax Legal desc", toNonEmptyString(property.TaxLegalDescription)),
    row("Tax Year", property.TaxYear ? String(property.TaxYear) : null),
    row("Terms Considered", joinList(property.ListingTerms)),
    row("Type of Property", toNonEmptyString(property.PropertySubType) || toNonEmptyString(property.PropertyType)),
    row("View", joinList(property.View)),
    row("Water Source", joinList(property.WaterSource)),
    row("Window Features", null),
    row("Year Built Details", property.YearBuilt ? String(property.YearBuilt) : null),
    row("Waterfront Description", waterfrontDescription),
  ]);

  return {
    description,
    basicInformationRows,
    amenities,
    exteriorFeatureRows,
    interiorFeatureRows,
    propertyFeatureRows,
  };
}

export function buildIdxLegalDisclosure(property: BridgeProperty): IdxLegalDisclosure {
  const courtesyParts = [
    toNonEmptyString(property.ListAgentFullName),
    toNonEmptyString(property.ListOfficeName),
  ].filter((value): value is string => Boolean(value));

  const courtesyPhone = toNonEmptyString(property.ListOfficePhone);
  const courtesyLine =
    courtesyParts.length === 0 && !courtesyPhone
      ? null
      : `Courtesy of ${courtesyParts.join(", ")}${courtesyPhone ? ` (${courtesyPhone})` : ""}`;

  return {
    courtesyLine,
    disclaimer: IDX_DEFAULT_DISCLAIMER,
  };
}

export function buildSimilarListingSlots(
  listings: BridgeIdxListing[],
  currentListingKey: string,
  slotCount = 4,
): { slots: SimilarListingSlot[]; activeCount: number; feedCount: number } {
  const filtered = listings.filter(
    (listing) =>
      listing.id &&
      listing.id.toLowerCase() !== currentListingKey.toLowerCase(),
  );
  const selected = filtered.slice(0, slotCount);

  const slots: SimilarListingSlot[] = selected.map((listing) => {
    const address = listing.address?.trim() || "Address unavailable";
    const cityStateZip = [listing.city, listing.state, listing.zip].filter(Boolean).join(", ");
    const addressLine = cityStateZip ? `${address}, ${cityStateZip}` : address;
    const sqftLabel = listing.sqft && listing.sqft > 0 ? `${listing.sqft.toLocaleString()} Sq.Ft` : "-";
    const detailLine = `${listing.beds || 0} Beds • ${listing.baths || 0} Baths • ${sqftLabel}`;

    return {
      key: `similar-${listing.id}`,
      listingKey: listing.id,
      href: `/property/${generateListingSlug(listing)}/`,
      imageUrl: listing.photos[0]?.url || null,
      priceLabel: formatCurrency(listing.price),
      addressLine,
      detailLine,
      placeholderReason: "none",
    };
  });

  const placeholderReason: SimilarListingSlot["placeholderReason"] =
    selected.length === 0 ? "empty-feed" : "short-feed";

  while (slots.length < slotCount) {
    const number = slots.length + 1;
    slots.push({
      key: `similar-placeholder-${number}`,
      listingKey: null,
      href: null,
      imageUrl: null,
      priceLabel: "--",
      addressLine:
        placeholderReason === "empty-feed"
          ? "No similar listings available right now."
          : "Additional similar listing unavailable.",
      detailLine: "Beds • Baths • Sq.Ft",
      placeholderReason,
    });
  }

  return {
    slots,
    activeCount: selected.length,
    feedCount: filtered.length,
  };
}
