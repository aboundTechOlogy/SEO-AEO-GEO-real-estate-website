"use client";

import useSWR from "swr";
import type { BridgeProperty } from "@/lib/bridge";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

interface MapInfoCardProps {
  listingKey: string;
  onClose: () => void;
  onOpenOverlay?: (listingKey: string) => void;
}

export default function MapInfoCard({ listingKey, onClose, onOpenOverlay }: MapInfoCardProps) {
  const { data: property, isLoading } = useSWR<BridgeProperty>(
    `/api/property/${listingKey}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenOverlay?.(listingKey);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // Skeleton while loading
  if (isLoading || !property) {
    return (
      <div
        className="w-[280px] bg-white rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-neutral-800 px-3 h-[27px]">
          <div className="w-24 h-3 bg-neutral-600 rounded animate-pulse" />
          <button type="button" onClick={handleClose} className="text-white text-sm cursor-pointer">
            &times;
          </button>
        </div>
        <div className="flex p-3 gap-3">
          <div className="w-[100px] h-[75px] bg-neutral-200 rounded animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-28 h-5 bg-neutral-200 rounded animate-pulse" />
            <div className="w-32 h-3 bg-neutral-200 rounded animate-pulse" />
            <div className="w-36 h-3 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const photoUrl = property.Media?.[0]?.MediaURL;
  const address = [property.StreetNumber, property.StreetName, property.StreetSuffix]
    .filter(Boolean)
    .join(" ");
  const fullAddress = `${address}, ${property.City}, ${property.StateOrProvince} ${property.PostalCode}`;
  const neighborhood = property.BuildingName || property.SubdivisionName || property.City;

  return (
    <div
      className="w-[280px] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Dark header with neighborhood name */}
      <div className="flex items-center justify-between bg-neutral-800 px-3 h-[27px]">
        <span className="text-white text-[13px] font-normal truncate mr-2">{neighborhood}</span>
        <button
          type="button"
          onClick={handleClose}
          className="text-white text-lg leading-none cursor-pointer hover:text-neutral-300 transition-colors shrink-0"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="flex p-3 gap-3">
        {/* Thumbnail */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={address}
            className="w-[100px] h-[75px] object-cover rounded shrink-0"
          />
        ) : (
          <div className="w-[100px] h-[75px] bg-neutral-200 rounded shrink-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-bold text-black leading-tight">
            {formatPrice(property.ListPrice)}
          </p>
          <p className="text-[13px] text-neutral-600 mt-0.5">
            {property.BedroomsTotal} Beds
            <span className="mx-1.5 opacity-40">&bull;</span>
            {property.BathroomsTotalInteger} Baths
            {property.LivingArea > 0 && (
              <>
                <span className="mx-1.5 opacity-40">&bull;</span>
                {property.LivingArea.toLocaleString()} Sq.Ft
              </>
            )}
          </p>
          <p className="text-[13px] text-neutral-500 mt-0.5 truncate">{fullAddress}</p>
        </div>
      </div>
    </div>
  );
}
