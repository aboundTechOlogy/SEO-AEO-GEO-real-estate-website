"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

function ResultsHeader() {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5">
      <p className="text-neutral-400 text-sm">{MOCK_SEARCH.length} Properties</p>
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <span className="hidden md:inline">Sort by:</span>
        <select className="bg-transparent text-white text-sm focus:outline-none cursor-pointer">
          {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

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
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <span>Sort by:</span>
        <span className="text-neutral-800 font-medium">{selected}</span>
        <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl py-1 z-50 min-w-[200px]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => { setSelected(option); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                selected === option
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
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

function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">‹</button>
      <button className="w-9 h-9 rounded-full bg-white text-black text-sm">1</button>
      <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">2</button>
      <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">3</button>
      <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">›</button>
    </div>
  );
}

function MobileListCard({ listing }: { listing: typeof MOCK_SEARCH[0] }) {
  return (
    <div className="flex gap-4 p-4 border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
      <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-neutral-700/30 to-neutral-800 flex items-center justify-center">
        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{listing.address}, {listing.city}, {listing.state} {listing.zip}</p>
        <p className="text-white text-lg font-semibold mt-0.5">{listing.price}</p>
        <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
          <span>{listing.beds} Beds</span>
          <span className="text-neutral-600">•</span>
          <span>{listing.baths} Baths</span>
          <span className="text-neutral-600">•</span>
          <span>{listing.sqft?.toLocaleString()} Sq.Ft</span>
        </div>
      </div>
      <button className="shrink-0 self-start text-neutral-500 hover:text-white transition-colors p-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      </button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("For Sale");

  // Read view from URL ?view=grid|map|list, default to grid
  const urlView = searchParams.get("view") as ViewMode | null;
  const validViews: ViewMode[] = ["grid", "map", "list"];
  const [view, setViewState] = useState<ViewMode>(
    urlView && validViews.includes(urlView) ? urlView : "grid"
  );

  // When view changes, update URL
  const setView = (newView: ViewMode) => {
    setViewState(newView);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-[72px] md:top-[80px] z-30 bg-neutral-950 border-b border-white/5">
        <DesktopSearchBar status={status} onStatusChange={setStatus} view={view} onViewChange={setView} />
        <MobileSearchBar status={status} onStatusChange={setStatus} view={view} onViewChange={setView} />
      </div>

      {/* ==================== VIEW: GRID ==================== */}
      {view === "grid" && (
        <div className="bg-[#0a0a0a] min-h-[calc(100vh-72px-60px)]">
          {/* Count + Sort row — white bg like Carroll grid view */}
          <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-white border-b border-neutral-200">
            <p className="text-sm text-neutral-600">{MOCK_SEARCH.length.toLocaleString()} Properties</p>
            <SortDropdown />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
            {MOCK_SEARCH.map((listing, i) => (
              <PropertyCard key={i} {...listing} />
            ))}
          </div>
          <Pagination />
        </div>
      )}

      {/* ==================== VIEW: MAP ==================== */}
      {view === "map" && (
        <div className="flex bg-[#0a0a0a]" style={{ height: "calc(100vh - 72px - 60px)" }}>
          <div className="w-full lg:w-1/2 bg-neutral-900 border-r border-white/5 flex items-center justify-center">
            <div className="text-center px-6">
              <svg className="w-12 h-12 text-neutral-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <p className="text-neutral-500 text-sm uppercase tracking-widest mb-2">Interactive Map</p>
              <p className="text-neutral-600 text-xs">Map integration coming soon</p>
            </div>
          </div>
          <div className="hidden lg:block flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-neutral-200">
              <p className="text-sm text-neutral-600">{MOCK_SEARCH.length.toLocaleString()} Properties</p>
              <SortDropdown />
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 md:p-6">
              {MOCK_SEARCH.map((listing, i) => (
                <PropertyCard key={i} {...listing} />
              ))}
            </div>
            <Pagination />
          </div>
        </div>
      )}

      {/* ==================== VIEW: LIST ==================== */}
      {view === "list" && (
        <div className="bg-[#0a0a0a] min-h-[calc(100vh-72px-60px)]">
          {/* Count + Sort row — light bg band like Carroll */}
          <div className="hidden md:flex items-center justify-between px-4 py-2 bg-neutral-200 text-neutral-700 border-b border-neutral-300">
            <p className="text-sm">{MOCK_SEARCH.length.toLocaleString()} Properties</p>
            <SortDropdown />
          </div>
          {/* Mobile count + sort */}
          <div className="md:hidden flex items-center justify-between px-4 py-2 bg-neutral-200 text-neutral-700">
            <p className="text-sm">{MOCK_SEARCH.length.toLocaleString()} Properties</p>
            <SortDropdown />
          </div>

          {/* Desktop: Data table */}
          <div className="hidden md:block">
            <table className="w-full text-sm table-fixed">
              {/* Column header row — light gray bg matching Carroll */}
              <thead>
                <tr className="bg-neutral-200 text-neutral-600 border-b border-neutral-300">
                  <th className="py-3 px-4 w-10"></th>
                  <th className="py-3 px-4 text-left text-sm font-normal text-neutral-500">Address</th>
                  <th className="py-3 px-4 text-right text-sm font-normal text-neutral-500 w-[140px]">Price</th>
                  <th className="py-3 px-4 text-center text-sm font-normal text-neutral-500 w-[70px]">% / $</th>
                  <th className="py-3 px-4 text-center text-sm font-normal text-neutral-500 w-[60px]">Beds</th>
                  <th className="py-3 px-4 text-center text-sm font-normal text-neutral-500 w-[60px]">Baths</th>
                  <th className="py-3 px-4 text-right text-sm font-normal text-neutral-500 w-[120px]">Living Size</th>
                  <th className="py-3 px-4 text-right text-sm font-normal text-neutral-500 w-[120px]">Price / Sq.Ft.</th>
                  <th className="py-3 px-4 text-left text-sm font-normal text-neutral-500">Development / Subdivision</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SEARCH.map((listing, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <td className="py-4 px-4 w-10">
                      <button className="text-neutral-500 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-white">{listing.address}, {listing.city}, {listing.state} {listing.zip}</td>
                    <td className="py-4 px-4 text-right text-white font-semibold whitespace-nowrap">{listing.price}</td>
                    <td className="py-4 px-4 text-center text-neutral-400">—</td>
                    <td className="py-4 px-4 text-center text-neutral-300">{listing.beds}</td>
                    <td className="py-4 px-4 text-center text-neutral-300">{listing.baths}</td>
                    <td className="py-4 px-4 text-right text-neutral-300 whitespace-nowrap">{listing.sqft ? `${listing.sqft.toLocaleString()} Sq.Ft` : "—"}</td>
                    <td className="py-4 px-4 text-right text-neutral-300 whitespace-nowrap">{formatPriceSqft(listing.price, listing.sqft)}</td>
                    <td className="py-4 px-4 text-neutral-400 whitespace-nowrap">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card list */}
          <div className="md:hidden px-4 py-4 space-y-3">
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
