"use client";
import { useState, useRef, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import { DesktopSearchBar, MobileSearchBar } from "@/components/SearchFilters";
import { MOCK_SEARCH } from "@/data/mockListings";

type ViewMode = "grid" | "map" | "list";

const SORT_OPTIONS = [
  "Newest Listings",
  "Modified Listings",
  "Highest Price",
  "Lowest Price",
  "Highest Sq.Ft",
  "Lowest Sq.Ft",
  "Just Reduced",
  "Highest Price/Sq.Ft",
  "Lowest Price/Sq.Ft",
];

function parsePrice(p: string): number {
  return Number(p.replace(/[^0-9.]/g, ""));
}

function formatPriceSqft(price: string, sqft: number | undefined): string {
  if (!sqft || sqft === 0) return "—";
  const num = parsePrice(price);
  return `$${Math.round(num / sqft).toLocaleString()}`;
}

/* ── Sort dropdown — dark text for white bg ── */
function SortDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Newest Listings");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
      >
        <span>Sort by:</span>
        <span className="text-gray-900 font-semibold">{selected}</span>
        <svg
          className="w-3 h-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[200px]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => { setSelected(option); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-[13px] transition-colors ${
                selected === option
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sort/count row — shared across all three views ── */
function SorterRow({ count }: { count: number }) {
  return (
    <div className="h-10 flex items-center justify-between px-[15px] bg-white border-b border-gray-200 shrink-0">
      <p className="text-[13px] text-gray-600">{count.toLocaleString()} Properties</p>
      <SortDropdown />
    </div>
  );
}

/* ── Pagination — dark on white ── */
function Pagination() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-8 bg-white">
      <button className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors">
        ‹
      </button>
      <button className="w-9 h-9 rounded bg-gray-900 text-white text-sm">1</button>
      <button className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors">
        2
      </button>
      <button className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors">
        3
      </button>
      <button className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors">
        ›
      </button>
    </div>
  );
}

/* ── Mobile list card — white bg, dark text ── */
function MobileListCard({ listing }: { listing: (typeof MOCK_SEARCH)[0] }) {
  return (
    <div className="flex gap-3 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-20 h-20 shrink-0 bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm truncate">
          {listing.address}, {listing.city}, {listing.state} {listing.zip}
        </p>
        <p className="text-gray-900 text-base font-semibold mt-0.5">{listing.price}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span>{listing.beds} Beds</span>
          <span className="text-gray-300">·</span>
          <span>{listing.baths} Baths</span>
          <span className="text-gray-300">·</span>
          <span>{listing.sqft?.toLocaleString()} Sq.Ft</span>
        </div>
      </div>
      <button
        className="shrink-0 self-start text-gray-400 hover:text-gray-700 transition-colors p-1"
        aria-label="Save listing"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </button>
    </div>
  );
}

/* ── Star icon for table favorite button ── */
function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

export default function SearchPage() {
  const [status, setStatus] = useState("For Sale");
  const [view, setViewState] = useState<ViewMode>("grid");

  // Persist view in URL hash and restore on load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as ViewMode;
    if (["grid", "map", "list"].includes(hash)) {
      setViewState(hash);
    }
  }, []);

  const setView = (newView: ViewMode) => {
    setViewState(newView);
    window.history.replaceState(null, "", `/search#${newView}`);
  };

  return (
    <>
      {/* Spacer for fixed nav */}
      <div className="h-[72px] md:h-[80px]" />

      {/* Filter bar — ONLY dark element on this page */}
      <div className="sticky top-[72px] md:top-[80px] z-30 bg-neutral-950 border-b border-white/5">
        <DesktopSearchBar
          status={status}
          onStatusChange={setStatus}
          view={view}
          onViewChange={setView}
        />
        <MobileSearchBar
          status={status}
          onStatusChange={setStatus}
          view={view}
          onViewChange={setView}
        />
      </div>

      {/* ==================== VIEW: GRID ==================== */}
      {view === "grid" && (
        <div className="bg-white min-h-[calc(100vh-72px-56px)]">
          <SorterRow count={MOCK_SEARCH.length} />
          <div className="px-[10px] pt-[10px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {MOCK_SEARCH.map((listing, i) => (
                <div key={i} className="px-[5px] mb-[10px]">
                  <PropertyCard {...listing} />
                </div>
              ))}
            </div>
          </div>
          <Pagination />
        </div>
      )}

      {/* ==================== VIEW: MAP ==================== */}
      {view === "map" && (
        <div
          className="flex"
          style={{ height: "calc(100vh - 72px - 56px)" }}
        >
          {/* Map panel — dark, full width on mobile, 60% on lg, 50% on xl */}
          <div className="w-full lg:w-[60%] xl:w-1/2 bg-neutral-900 flex items-center justify-center shrink-0">
            <div className="text-center px-6">
              <svg
                className="w-12 h-12 text-neutral-600 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z"
                />
              </svg>
              <p className="text-neutral-500 text-sm uppercase tracking-widest mb-2">
                Interactive Map
              </p>
              <p className="text-neutral-600 text-xs">Map integration coming soon</p>
            </div>
          </div>

          {/* Right panel — white, hidden on mobile, 40% on lg, 50% on xl */}
          <div className="hidden lg:flex lg:w-[40%] xl:w-1/2 bg-white flex-col overflow-y-auto">
            <SorterRow count={MOCK_SEARCH.length} />
            <div className="px-[10px] pt-[10px] flex-1">
              <div className="grid grid-cols-1 xl:grid-cols-2">
                {MOCK_SEARCH.map((listing, i) => (
                  <div key={i} className="px-[5px] mb-[10px]">
                    <PropertyCard {...listing} />
                  </div>
                ))}
              </div>
            </div>
            <Pagination />
          </div>
        </div>
      )}

      {/* ==================== VIEW: LIST ==================== */}
      {view === "list" && (
        <div className="bg-white min-h-[calc(100vh-72px-56px)]">
          <SorterRow count={MOCK_SEARCH.length} />

          {/* Desktop: data table */}
          <div className="hidden md:block px-[15px] pb-[15px]">
            <table
              className="w-full max-w-full border-collapse border border-gray-200 bg-white"
              style={{ borderSpacing: 0 }}
            >
              <thead>
                <tr>
                  {/* Fave */}
                  <th className="w-10 px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200" />
                  {/* Address */}
                  <th className="px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Address
                  </th>
                  {/* Price */}
                  <th className="w-[140px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Price
                  </th>
                  {/* % / $ */}
                  <th className="w-[70px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    % / $
                  </th>
                  {/* Beds */}
                  <th className="w-[60px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Beds
                  </th>
                  {/* Baths */}
                  <th className="w-[60px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Baths
                  </th>
                  {/* Living Size — hidden below lg (1024px ≈ Carroll's 990px) */}
                  <th className="w-[120px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden lg:table-cell">
                    Living Size
                  </th>
                  {/* Price/Sq.Ft — hidden below xl (1280px ≈ Carroll's 1300px) */}
                  <th className="w-[120px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden xl:table-cell">
                    Price / Sq.Ft.
                  </th>
                  {/* Development — hidden below 2xl (1536px ≈ Carroll's 1500px) */}
                  <th className="px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden 2xl:table-cell">
                    Development / Subdivision
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SEARCH.map((listing, i) => (
                  <tr
                    key={i}
                    className="cursor-pointer group hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 border border-gray-200 text-center">
                      <button className="text-gray-400 hover:text-gray-700 group-hover:text-gray-500 transition-colors">
                        <StarIcon />
                      </button>
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-gray-900">
                      {listing.address}, {listing.city}, {listing.state}{" "}
                      {listing.zip}
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-900 font-semibold whitespace-nowrap">
                      {listing.price}
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-500">
                      —
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-700">
                      {listing.beds}
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-700">
                      {listing.baths}
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-700 whitespace-nowrap hidden lg:table-cell">
                      {listing.sqft ? `${listing.sqft.toLocaleString()} Sq.Ft` : "—"}
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-700 whitespace-nowrap hidden xl:table-cell">
                      {formatPriceSqft(listing.price, listing.sqft)}
                    </td>
                    <td className="p-3 border border-gray-200 text-[15px] text-gray-500 whitespace-nowrap hidden 2xl:table-cell">
                      —
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: card list */}
          <div className="md:hidden divide-y divide-gray-200">
            {MOCK_SEARCH.map((listing, i) => (
              <MobileListCard key={i} listing={listing} />
            ))}
          </div>

          <Pagination />
        </div>
      )}
    </>
  );
}
