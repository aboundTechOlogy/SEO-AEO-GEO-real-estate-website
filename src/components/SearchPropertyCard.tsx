"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconLove } from "@/components/IdxIcons";

interface Props {
  image?: string;
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

export default function SearchPropertyCard({
  image,
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
  const isSaved = controlledSaved ?? internalSaved;

  // Hydrate saved state from localStorage after mount
  useEffect(() => {
    if (!listingKey || controlledSaved !== undefined) return;
    setInternalSaved(getSavedSet().has(listingKey));
  }, [listingKey, controlledSaved]);

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
      className="group block relative overflow-hidden bg-neutral-200 cursor-pointer aspect-[4/3] md:rounded-[10px] md:shadow-[0_1px_4px_rgba(0,0,0,0.16)]"
    >
      {/* Image or placeholder */}
      {image ? (
        <img
          src={image}
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
            <svg className="w-5 h-5 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
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
      {photoCount && photoCount > 0 && (
        <div className="absolute bottom-4 right-4">
          <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-sm">
            1 of {photoCount}
          </span>
        </div>
      )}
    </Link>
  );
}
