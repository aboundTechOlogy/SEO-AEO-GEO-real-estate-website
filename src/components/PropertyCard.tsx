"use client";

export interface PropertyCardProps {
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

export default function PropertyCard({
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
}: PropertyCardProps) {
  return (
    <a
      href={href}
      className="group block bg-neutral-900 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Image container — 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900">
        {image ? (
          <img
            src={image}
            alt={address}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? "grayscale" : ""}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}

        {/* Status badge — top left */}
        {(status || isSold) && (
          <div className="absolute top-3 left-3">
            <span className="bg-white text-black text-[10px] uppercase tracking-wider font-medium px-2 py-1">
              {isSold ? "SOLD" : status}
            </span>
          </div>
        )}

        {/* Heart icon — top right */}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
          aria-label="Save listing"
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-playfair text-xl text-white mb-1">{price}</p>
        <p className="text-neutral-300 text-sm truncate">{address}</p>
        <p className="text-neutral-500 text-xs mt-0.5">
          {city}, {state} {zip}
        </p>
        <div className="flex gap-3 mt-3 text-neutral-400 text-xs uppercase tracking-wider">
          <span>{beds} Beds</span>
          <span>·</span>
          <span>{baths} Baths</span>
          <span>·</span>
          <span>{sqft.toLocaleString()} Sqft</span>
        </div>
      </div>
    </a>
  );
}
