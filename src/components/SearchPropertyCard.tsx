"use client";

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
}: Props) {
  const badgeText = isSold
    ? "SOLD"
    : status && listDate
      ? `${status} - ${formatRelativeTime(listDate)}`
      : status || (listDate ? `New - ${formatRelativeTime(listDate)}` : undefined);

  return (
    <a
      href={href}
      className="group block relative overflow-hidden bg-neutral-200 cursor-pointer"
      style={{ aspectRatio: "4/3" }}
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
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow"
          aria-label="Share"
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z" />
          </svg>
        </button>
        <button
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow"
          aria-label="Save"
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
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
    </a>
  );
}
