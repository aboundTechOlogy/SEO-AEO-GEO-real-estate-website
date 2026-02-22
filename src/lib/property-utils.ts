import type { BridgeMedia, BridgeProperty } from "@/lib/bridge";

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
