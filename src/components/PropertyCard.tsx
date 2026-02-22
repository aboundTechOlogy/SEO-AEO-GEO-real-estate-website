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
  theme?: "dark" | "light";
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
  theme = "dark",
}: PropertyCardProps) {
  const isLight = theme === "light";

  return (
    <a
      href={href}
      className={`group block transition-all duration-300 hover:scale-[1.02] ${
        isLight
          ? "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
          : "bg-neutral-900 border border-white/5 hover:border-white/20"
      }`}
    >
      {/* Image container — 4:3 aspect ratio */}
      <div
        className={`relative aspect-[4/3] overflow-hidden ${
          isLight
            ? "bg-gradient-to-br from-gray-100 via-gray-50 to-white"
            : "bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={address}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? "grayscale" : ""}`}
          />
        ) : (
          <div
            className={`w-full h-full ${
              isLight ? "bg-gradient-to-br from-gray-100 to-gray-200" : "bg-gradient-to-br from-neutral-800 to-neutral-900"
            }`}
          />
        )}

        {/* Status badge — top left */}
        {(status || isSold) && (
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] uppercase tracking-wider font-medium px-2 py-1 ${
                isLight ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
              }`}
            >
              {isSold ? "SOLD" : status}
            </span>
          </div>
        )}

        {/* Heart icon — top right */}
        <button
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors ${
            isLight ? "bg-white/80 hover:bg-white text-[#1a1a1a]" : "bg-black/40 hover:bg-black/60 text-white"
          }`}
          aria-label="Save listing"
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className={`font-playfair text-xl mb-1 ${isLight ? "text-[#1a1a1a]" : "text-white"}`}>{price}</p>
        <p className={`text-sm truncate ${isLight ? "text-gray-600" : "text-neutral-300"}`}>{address}</p>
        <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>
          {city}, {state} {zip}
        </p>
        <div className={`flex gap-3 mt-3 text-xs uppercase tracking-wider ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
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
