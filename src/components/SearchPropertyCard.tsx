"use client";

import Link from "next/link";
import type { BridgeProperty } from "@/lib/bridge";
import { formatAddress, formatCurrency, getListingPhotos } from "@/lib/property-utils";

interface SearchPropertyCardProps {
  property: BridgeProperty;
  isSold?: boolean;
}

function getStatusLabel(property: BridgeProperty, sold: boolean): string {
  if (sold || property.StandardStatus === "Closed") {
    return "SOLD";
  }

  if (property.DaysOnMarket !== null && property.DaysOnMarket >= 0) {
    return `New - ${property.DaysOnMarket} days ago`;
  }

  return property.StandardStatus || "Active";
}

export default function SearchPropertyCard({ property, isSold = false }: SearchPropertyCardProps) {
  const photos = getListingPhotos(property);
  const heroPhoto = photos[0]?.MediaURL;
  const photoCount = Math.max(photos.length, 1);
  const price = isSold ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const pricePerSqft = property.LivingArea > 0 ? Math.round(price / property.LivingArea) : null;

  return (
    <Link
      href={`/property/${property.ListingKey}/`}
      className="group block relative overflow-hidden bg-neutral-200 cursor-pointer"
      style={{ aspectRatio: "4/3" }}
    >
      {heroPhoto ? (
        <img
          src={heroPhoto}
          alt={formatAddress(property)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? "grayscale" : ""
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      <div className="absolute top-3 left-3">
        <span className="bg-black text-white text-[11px] uppercase tracking-wider font-medium px-3 py-1 rounded-sm">
          {getStatusLabel(property, isSold)}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow"
          aria-label="Share"
          onClick={(event) => event.preventDefault()}
        >
          <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow"
          aria-label="Save"
          onClick={(event) => event.preventDefault()}
        >
          <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
        <p className="text-white text-2xl font-bold leading-tight">{formatCurrency(price)}</p>
        <p className="text-white/90 text-sm mt-0.5">
          {property.BedroomsTotal} Beds • {property.BathroomsTotalInteger} Baths
          {property.LivingArea > 0 ? ` • ${property.LivingArea.toLocaleString()} Sq.Ft` : ""}
          {pricePerSqft ? ` • $${pricePerSqft.toLocaleString()}/Sq.Ft` : ""}
        </p>
        <p className="text-white/75 text-sm mt-0.5 truncate">
          {formatAddress(property)}, {property.City}, {property.StateOrProvince} {property.PostalCode}
        </p>
      </div>

      <div className="absolute bottom-4 right-4">
        <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-sm">1 of {photoCount}</span>
      </div>
    </Link>
  );
}
