"use client";

import { useState } from "react";
import useSWR from "swr";
import { IconLove } from "@/components/IdxIcons";
import type { BridgeProperty } from "@/lib/bridge";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

interface MapInfoCardProps {
  listingKey: string;
  onClose: () => void;
  onOpenOverlay?: (listingKey: string) => void;
  isSaved?: boolean;
  onToggleSave?: (listingKey: string) => void;
}

export default function MapInfoCard({ listingKey, onClose, onOpenOverlay, isSaved, onToggleSave }: MapInfoCardProps) {
  const [shareLabel, setShareLabel] = useState<"idle" | "copied">("idle");
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/property/${listingKey}/`;
    if (navigator.share) {
      navigator.share({ title: "Property", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareLabel("copied");
        setTimeout(() => setShareLabel("idle"), 2000);
      }).catch(() => {});
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave?.(listingKey);
  };

  // Skeleton while loading
  if (isLoading || !property) {
    return (
      <div
        className="min-w-[360px] w-max max-w-[500px] bg-white rounded-lg shadow-lg overflow-hidden"
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
      className="min-w-[360px] w-max max-w-[500px] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
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
          {/* Price + Share/Save on same line */}
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-bold text-black leading-tight">
              {formatPrice(property.ListPrice)}
            </p>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition-colors text-black"
                title={shareLabel === "copied" ? "Copied!" : "Share"}
              >
                {shareLabel === "copied" ? (
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M719.94-49Q657-49 613-93.04T569-200q0-7.95 1-16.48 1-8.52 3-16.52L340-369q-20 19-45.85 29.5Q268.31-329 240-329q-62.92 0-106.96-44.06Q89-417.12 89-480.06T133.04-587q44.04-44 106.96-44 28.31 0 54.15 10.5Q320-610 340-591l233-136q-2-8-3-16.52-1-8.53-1-16.48 0-62.92 44.06-106.96 44.06-44.04 107-44.04T827-866.94q44 44.06 44 107T826.96-653Q782.92-609 720-609q-28.31 0-54.15-9.5Q640-628 620-647L387-513q2 8 3 16.52 1 8.53 1 16.48 0 7.95-1 16.48-1 8.52-3 16.52l233 134q20-19 45.85-28.5Q691.69-351 720-351q62.92 0 106.96 44.06 44.04 44.06 44.04 107T826.94-93q-44.06 44-107 44Z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition-colors"
                title={isSaved ? "Remove from saved" : "Save listing"}
              >
                <IconLove className={`w-3.5 h-3.5 ${isSaved ? "text-rose-500" : "text-black"}`} active={isSaved} />
              </button>
            </div>
          </div>
          <p className="text-[13px] font-medium text-black mt-0.5">
            {property.BedroomsTotal} Beds
            <span className="mx-1.5 opacity-30">&bull;</span>
            {property.BathroomsTotalInteger} Baths
            {property.LivingArea > 0 && (
              <>
                <span className="mx-1.5 opacity-30">&bull;</span>
                {property.LivingArea.toLocaleString()} Sq.Ft
              </>
            )}
          </p>
          <p className="text-[13px] text-black mt-0.5 whitespace-nowrap">{fullAddress}</p>
        </div>
      </div>
    </div>
  );
}
