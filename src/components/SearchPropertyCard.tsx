"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { IconLove } from "@/components/IdxIcons";

interface Props {
  image?: string;
  photos?: string[];
  price: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft?: number;
  status?: string;
  href: string;
  isSold?: boolean;
  index?: number;
  total?: number;
  listDate?: string;
  photoCount?: number;
  listingKey?: string;
  onOpenOverlay?: (listingKey: string) => void;
  isSaved?: boolean;
  onToggleSave?: (listingKey: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const listed = new Date(dateStr).getTime();
  const diffMs = now - listed;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

const SAVED_KEY = "savedListings";

function getSavedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSet(set: Set<string>) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore storage errors
  }
}

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function SearchPropertyCard({
  image,
  photos,
  price,
  address,
  city,
  state,
  zip,
  beds,
  baths,
  sqft,
  status,
  href,
  isSold = false,
  index,
  total,
  listDate,
  photoCount,
  listingKey,
  onOpenOverlay,
  isSaved: controlledSaved,
  onToggleSave,
}: Props) {
  const [internalSaved, setInternalSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState<"idle" | "copied">("idle");
  const [photoIndex, setPhotoIndex] = useState(0);
  const isSaved = controlledSaved ?? internalSaved;

  const allPhotos = photos && photos.length > 0 ? photos : image ? [image] : [];
  const currentPhoto = allPhotos[photoIndex] || image;
  const totalPhotos = allPhotos.length;
  const hasMultiplePhotos = totalPhotos > 1;

  // Hydrate saved state from localStorage after mount
  useEffect(() => {
    if (!listingKey || controlledSaved !== undefined) return;
    setInternalSaved(getSavedSet().has(listingKey));
  }, [listingKey, controlledSaved]);

  const handlePrevPhoto = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((i) => (i === 0 ? totalPhotos - 1 : i - 1));
  }, [totalPhotos]);

  const handleNextPhoto = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((i) => (i === totalPhotos - 1 ? 0 : i + 1));
  }, [totalPhotos]);

  function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${href}`;
    if (navigator.share) {
      navigator.share({ title: `${address}, ${city}, ${state}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareLabel("copied");
        setTimeout(() => setShareLabel("idle"), 2000);
      }).catch(() => {});
    }
  }

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!listingKey) return;
    if (onToggleSave) {
      onToggleSave(listingKey);
      return;
    }
    const set = getSavedSet();
    if (set.has(listingKey)) {
      set.delete(listingKey);
      setInternalSaved(false);
    } else {
      set.add(listingKey);
      setInternalSaved(true);
    }
    saveSet(set);
  }

  const badgeText = isSold
    ? "SOLD"
    : status && listDate
      ? `${status} - ${formatRelativeTime(listDate)}`
      : status || (listDate ? `New - ${formatRelativeTime(listDate)}` : undefined);

  function handleCardClick(e: React.MouseEvent) {
    if (onOpenOverlay && listingKey) {
      e.preventDefault();
      onOpenOverlay(listingKey);
    }
  }

  return (
    <Link
      href={href}
      onClick={handleCardClick}
      className="group block relative overflow-hidden bg-neutral-200 cursor-pointer aspect-[5/3] md:rounded-[10px] md:shadow-[0_1px_4px_rgba(0,0,0,0.16)]"
    >
      {/* Image or placeholder */}
      {currentPhoto ? (
        <img
          src={currentPhoto}
          alt={address}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? "grayscale" : ""}`}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
      )}

      {/* Photo navigation arrows — show on hover when multiple photos */}
      {hasMultiplePhotos && (
        <>
          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next photo"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Status badge — top left */}
      {badgeText && (
        <div className="absolute top-3 left-3">
          <span className="bg-black text-white text-[11px] tracking-wider font-medium px-3 py-1 rounded-sm">
            {badgeText}
          </span>
        </div>
      )}

      {/* Action buttons — top right */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow relative"
          aria-label={shareLabel === "copied" ? "Link copied!" : "Share"}
          title={shareLabel === "copied" ? "Link copied!" : "Share listing"}
          onClick={handleShare}
        >
          {shareLabel === "copied" ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-neutral-900" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M719.94-49Q657-49 613-93.04T569-200q0-7.95 1-16.48 1-8.52 3-16.52L340-369q-20 19-45.85 29.5Q268.31-329 240-329q-62.92 0-106.96-44.06Q89-417.12 89-480.06T133.04-587q44.04-44 106.96-44 28.31 0 54.15 10.5Q320-610 340-591l233-136q-2-8-3-16.52-1-8.53-1-16.48 0-62.92 44.06-106.96 44.06-44.04 107-44.04T827-866.94q44 44.06 44 107T826.96-653Q782.92-609 720-609q-28.31 0-54.15-9.5Q640-628 620-647L387-513q2 8 3 16.52 1 8.53 1 16.48 0 7.95-1 16.48-1 8.52-3 16.52l233 134q20-19 45.85-28.5Q691.69-351 720-351q62.92 0 106.96 44.06 44.04 44.06 44.04 107T826.94-93q-44.06 44-107 44Z" />
            </svg>
          )}
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow"
          aria-label={isSaved ? "Unsave listing" : "Save listing"}
          title={isSaved ? "Remove from saved" : "Save listing"}
          onClick={handleSave}
        >
          <IconLove className={`w-5 h-5 ${isSaved ? "text-rose-500" : "text-neutral-900"}`} active={isSaved} />
        </button>
      </div>

      {/* Info overlay — bottom */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
        <p className="text-white text-2xl font-bold leading-tight">{price}</p>
        <p className="text-white/90 text-sm mt-0.5">
          {beds} Beds&nbsp;•&nbsp;{baths} Baths{sqft ? `\u00a0•\u00a0${sqft.toLocaleString()} Sq.Ft` : ""}
        </p>
        <p className="text-white/75 text-sm mt-0.5 truncate">
          {address}, {city}, {state} {zip}
        </p>
      </div>

      {/* Photo counter — bottom right */}
      {totalPhotos > 0 && (
        <div className="absolute bottom-4 right-4">
          <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-sm">
            {photoIndex + 1} of {totalPhotos}
          </span>
        </div>
      )}
    </Link>
  );
}
