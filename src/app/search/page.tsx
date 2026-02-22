"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import SearchPropertyCard from "@/components/SearchPropertyCard";
import { DesktopSearchBar, MobileSearchBar } from "@/components/SearchFilters";
import PropertyMap from "@/components/PropertyMap";
import type {
  BridgeIdxListing,
  BridgeIdxMarker,
  BridgeIdxMarkersResponse,
  BridgeIdxSearchResponse,
} from "@/lib/bridge";

type ViewMode = "grid" | "map" | "list";
type DrawCoords = Array<{ lat: number; lng: number }>;

interface UiListing {
  id: string;
  image?: string;
  price: string;
  priceValue: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft?: number;
  status?: string;
  href: string;
  listDate?: string;
  photoCount?: number;
  lat: number;
  lng: number;
}

const PAGE_SIZE = 24;
const FALLBACK_CENTER = { lat: 25.95, lng: -80.15 };

const STATUS_TO_BRIDGE: Record<string, string> = {
  "For Sale": "Active",
  "For Rent": "Active",
  Sold: "Closed",
};

const SORT_OPTIONS = [
  { label: "Newest Listings", orderby: "OnMarketTimestamp desc" },
  { label: "Modified Listings", orderby: "OnMarketTimestamp desc" },
  { label: "Highest Price", orderby: "ListPrice desc" },
  { label: "Lowest Price", orderby: "ListPrice asc" },
  { label: "Highest Sq.Ft", orderby: "LivingArea desc" },
  { label: "Lowest Sq.Ft", orderby: "LivingArea asc" },
  { label: "Just Reduced", orderby: "ListPrice desc" },
  { label: "Highest Price/Sq.Ft", orderby: "ListPrice desc" },
  { label: "Lowest Price/Sq.Ft", orderby: "ListPrice asc" },
] as const;

const DEFAULT_SORT = SORT_OPTIONS[0].label;

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPriceSqft(price: number, sqft?: number): string {
  if (!sqft || sqft <= 0) {
    return "-";
  }

  return `$${Math.round(price / sqft).toLocaleString()}`;
}

function getSortOrderBy(sortLabel: string): string {
  return SORT_OPTIONS.find((option) => option.label === sortLabel)?.orderby || SORT_OPTIONS[0].orderby;
}

function getBoundingBox(coords: DrawCoords | null) {
  if (!coords || coords.length < 3) {
    return null;
  }

  const lats = coords.map((coord) => coord.lat);
  const lngs = coords.map((coord) => coord.lng);

  return {
    swLat: Math.min(...lats),
    swLng: Math.min(...lngs),
    neLat: Math.max(...lats),
    neLng: Math.max(...lngs),
  };
}

function toClosedRing(coords: DrawCoords): number[][] | null {
  if (coords.length < 3) {
    return null;
  }

  const ring = coords.map((coord) => [coord.lng, coord.lat]);
  const first = ring[0];
  const last = ring[ring.length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  return ring;
}

function isPointInsidePolygon(lat: number, lng: number, coords: DrawCoords | null): boolean {
  if (!coords || coords.length < 3) {
    return true;
  }

  const ring = toClosedRing(coords);
  if (!ring) {
    return true;
  }

  try {
    return booleanPointInPolygon(point([lng, lat]), polygon([ring]));
  } catch {
    return true;
  }
}

function toUiListing(listing: BridgeIdxListing): UiListing {
  return {
    id: listing.id,
    image: listing.photos[0]?.url,
    price: formatCurrency(listing.price),
    priceValue: listing.price,
    address: listing.address || "Address unavailable",
    city: listing.city,
    state: listing.state,
    zip: listing.zip,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft || undefined,
    status: listing.status || undefined,
    href: `/property/${listing.id}/`,
    listDate: listing.listDate || undefined,
    photoCount: listing.photoCount,
    lat: listing.lat,
    lng: listing.lng,
  };
}

/* Sort dropdown */
function SortDropdown({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
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
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[220px]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                onChange(option.label);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-[13px] transition-colors ${
                selected === option.label
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SorterRow({
  count,
  selectedSort,
  onSortChange,
}: {
  count: number;
  selectedSort: string;
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="h-10 flex items-center justify-between px-[15px] bg-white border-b border-gray-200 shrink-0">
      <p className="text-[13px] text-gray-600">{count.toLocaleString()} Properties</p>
      <SortDropdown selected={selectedSort} onChange={onSortChange} />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-center gap-3 py-8 bg-white">
      <button
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {"<"}
      </button>
      <p className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </p>
      <button
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {">"}
      </button>
    </div>
  );
}

function LoadingGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="px-[5px] mb-[10px]">
          <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function MobileListCard({ listing }: { listing: UiListing }) {
  return (
    <Link
      href={listing.href}
      className="mx-4 mb-3 flex gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer block"
    >
      {listing.image ? (
        <img
          src={listing.image}
          alt={listing.address}
          className="w-20 h-20 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="w-20 h-20 shrink-0 rounded-md bg-gray-200 flex items-center justify-center" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm leading-snug truncate">
          {listing.address}, {listing.city}, {listing.state} {listing.zip}
        </p>
        <p className="text-gray-900 text-base font-bold mt-1">{listing.price}</p>
        <div className="flex items-center gap-1 text-[13px] text-gray-700 mt-1">
          <span className="font-semibold">{listing.beds}</span>
          <span className="text-gray-400">Beds</span>
          <span className="text-gray-300 mx-0.5">•</span>
          <span className="font-semibold">{listing.baths}</span>
          <span className="text-gray-400">Baths</span>
          <span className="text-gray-300 mx-0.5">•</span>
          <span className="font-semibold">{listing.sqft?.toLocaleString() ?? "-"}</span>
          <span className="text-gray-400">Sq.Ft</span>
        </div>
      </div>

      <button
        className="shrink-0 self-start text-gray-400 hover:text-gray-700 transition-colors p-1"
        aria-label="Save listing"
      >
        <StarIcon />
      </button>
    </Link>
  );
}

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
  const router = useRouter();
  const [status, setStatus] = useState<string>("For Sale");
  const [view, setViewState] = useState<ViewMode>("grid");
  const [sortLabel, setSortLabel] = useState<string>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [drawBounds, setDrawBounds] = useState<DrawCoords | null>(null);
  const [highlightedListingId, setHighlightedListingId] = useState<string | null>(null);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [theadTop, setTheadTop] = useState(136);

  useEffect(() => {
    const measure = () => {
      if (!filterBarRef.current) {
        return;
      }

      const top = parseFloat(getComputedStyle(filterBarRef.current).top) || 0;
      setTheadTop(top + filterBarRef.current.offsetHeight);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as ViewMode;
    if (["grid", "map", "list"].includes(hash)) {
      setViewState(hash);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [status, sortLabel, drawBounds]);

  useEffect(() => {
    setHighlightedListingId(null);
  }, [page, status, sortLabel, drawBounds]);

  const bridgeStatus = STATUS_TO_BRIDGE[status] || "Active";
  const orderby = getSortOrderBy(sortLabel);
  const skip = Math.max(0, (page - 1) * PAGE_SIZE);
  const bbox = useMemo(() => getBoundingBox(drawBounds), [drawBounds]);

  const searchKey = useMemo(() => {
    const params = new URLSearchParams();
    params.set("top", String(PAGE_SIZE));
    params.set("skip", String(skip));
    params.set("orderby", orderby);
    params.set("status", bridgeStatus);

    if (bbox) {
      params.set("swLat", String(bbox.swLat));
      params.set("swLng", String(bbox.swLng));
      params.set("neLat", String(bbox.neLat));
      params.set("neLng", String(bbox.neLng));
    }

    return `/api/search?${params.toString()}`;
  }, [bbox, bridgeStatus, orderby, skip]);

  const markersKey = useMemo(() => {
    if (view !== "map") {
      return null;
    }

    const params = new URLSearchParams();
    params.set("status", bridgeStatus);

    if (bbox) {
      params.set("swLat", String(bbox.swLat));
      params.set("swLng", String(bbox.swLng));
      params.set("neLat", String(bbox.neLat));
      params.set("neLng", String(bbox.neLng));
    }

    return `/api/search/markers?${params.toString()}`;
  }, [bbox, bridgeStatus, view]);

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useSWR<BridgeIdxSearchResponse>(searchKey, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const { data: markersData } = useSWR<BridgeIdxMarkersResponse>(markersKey, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const rawListings = searchData?.listings || [];
  const filteredListings = useMemo(() => {
    if (!drawBounds || drawBounds.length < 3) {
      return rawListings;
    }

    return rawListings.filter((listing) =>
      isPointInsidePolygon(listing.lat, listing.lng, drawBounds)
    );
  }, [drawBounds, rawListings]);

  const listings = useMemo(() => filteredListings.map((listing) => toUiListing(listing)), [filteredListings]);

  const rawMarkers = (markersData?.markers || []) as BridgeIdxMarker[];
  const filteredMarkers = useMemo(() => {
    if (!drawBounds || drawBounds.length < 3) {
      return rawMarkers;
    }

    return rawMarkers.filter((marker) =>
      isPointInsidePolygon(marker.lat, marker.lng, drawBounds)
    );
  }, [drawBounds, rawMarkers]);

  const mapMarkers = useMemo(
    () =>
      filteredMarkers.map((marker) => ({
        lat: marker.lat,
        lng: marker.lng,
        price: marker.price,
        listingKey: marker.id,
      })),
    [filteredMarkers]
  );

  const mapCenter = useMemo(() => {
    if (mapMarkers.length > 0) {
      return { lat: mapMarkers[0].lat, lng: mapMarkers[0].lng };
    }

    if (listings.length > 0) {
      return { lat: listings[0].lat, lng: listings[0].lng };
    }

    return FALLBACK_CENTER;
  }, [listings, mapMarkers]);

  const totalCount = searchData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const showLoading = isSearchLoading && !searchData;
  const showNoResults = !showLoading && listings.length === 0;
  const errorMessage =
    searchData?.error || (searchError instanceof Error ? searchError.message : undefined);

  const setView = (newView: ViewMode) => {
    setViewState(newView);
    window.history.replaceState(null, "", `/search#${newView}`);
  };

  const handleMarkerClick = (listingKey: string) => {
    setHighlightedListingId(listingKey);
    const target = cardRefs.current[listingKey];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <div className="h-[50px] lg:h-[82px] min-[1440px]:h-[90px]" />

      <div ref={filterBarRef} className="sticky top-[50px] lg:top-[82px] min-[1440px]:top-[90px] z-30 bg-white">
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

      {errorMessage && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[13px] text-amber-900">
          {errorMessage}
        </div>
      )}

      {view === "grid" && (
        <div className="bg-white min-h-[calc(100vh-64px-56px)]">
          <SorterRow count={totalCount} selectedSort={sortLabel} onSortChange={setSortLabel} />
          <div className="px-[10px] pt-[10px]">
            {showLoading ? (
              <LoadingGrid />
            ) : showNoResults ? (
              <div className="py-14 text-center text-sm text-gray-500">No properties match this search.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className={`px-[5px] mb-[10px] ${
                      highlightedListingId === listing.id ? "ring-2 ring-amber-400 ring-offset-2" : ""
                    }`}
                    ref={(node) => {
                      cardRefs.current[listing.id] = node;
                    }}
                  >
                    <SearchPropertyCard
                      image={listing.image}
                      price={listing.price}
                      address={listing.address}
                      city={listing.city}
                      state={listing.state}
                      zip={listing.zip}
                      beds={listing.beds}
                      baths={listing.baths}
                      sqft={listing.sqft}
                      status={listing.status}
                      href={listing.href}
                      listDate={listing.listDate}
                      photoCount={listing.photoCount}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {view === "map" && (
        <div className="flex" style={{ height: "calc(100vh - 72px - 56px)" }}>
          <div className="w-full lg:w-[60%] xl:w-1/2 shrink-0">
            <PropertyMap
              center={mapCenter}
              zoom={10}
              interactive={true}
              markers={mapMarkers}
              onClick={handleMarkerClick}
              className="w-full h-full"
              onDrawBounds={setDrawBounds}
            />
          </div>

          <div className="hidden lg:flex lg:w-[40%] xl:w-1/2 bg-white flex-col overflow-y-auto">
            <SorterRow count={totalCount} selectedSort={sortLabel} onSortChange={setSortLabel} />
            <div className="px-[10px] pt-[10px] flex-1">
              {showLoading ? (
                <LoadingGrid count={8} />
              ) : showNoResults ? (
                <div className="py-14 text-center text-sm text-gray-500">No properties match this search.</div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className={`px-[5px] mb-[10px] ${
                        highlightedListingId === listing.id ? "ring-2 ring-amber-400 ring-offset-2" : ""
                      }`}
                      ref={(node) => {
                        cardRefs.current[listing.id] = node;
                      }}
                    >
                      <SearchPropertyCard
                        image={listing.image}
                        price={listing.price}
                        address={listing.address}
                        city={listing.city}
                        state={listing.state}
                        zip={listing.zip}
                        beds={listing.beds}
                        baths={listing.baths}
                        sqft={listing.sqft}
                        status={listing.status}
                        href={listing.href}
                        listDate={listing.listDate}
                        photoCount={listing.photoCount}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="bg-white min-h-[calc(100vh-64px-56px)]">
          <SorterRow count={totalCount} selectedSort={sortLabel} onSortChange={setSortLabel} />

          <div className="hidden md:block px-[15px] pb-[15px]">
            <table
              className="w-full max-w-full border-collapse border border-gray-200 bg-white"
              style={{ borderSpacing: 0 }}
            >
              <thead className="sticky z-[3]" style={{ top: theadTop }}>
                <tr>
                  <th className="w-10 px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200" />
                  <th className="px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Address
                  </th>
                  <th className="w-[140px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Price
                  </th>
                  <th className="w-[70px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    % / $
                  </th>
                  <th className="w-[60px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Beds
                  </th>
                  <th className="w-[60px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">
                    Baths
                  </th>
                  <th className="w-[120px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden lg:table-cell">
                    Living Size
                  </th>
                  <th className="w-[120px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden xl:table-cell">
                    Price / Sq.Ft.
                  </th>
                  <th className="px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden 2xl:table-cell">
                    Development / Subdivision
                  </th>
                </tr>
              </thead>
              <tbody>
                {showLoading &&
                  Array.from({ length: 8 }).map((_, index) => (
                    <tr key={`loading-${index}`}>
                      <td className="p-3 border border-gray-200 text-center" />
                      <td className="p-3 border border-gray-200">
                        <div className="h-5 bg-gray-200 animate-pulse rounded" />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <div className="h-5 bg-gray-200 animate-pulse rounded" />
                      </td>
                      <td className="p-3 border border-gray-200" />
                      <td className="p-3 border border-gray-200" />
                      <td className="p-3 border border-gray-200" />
                      <td className="p-3 border border-gray-200 hidden lg:table-cell" />
                      <td className="p-3 border border-gray-200 hidden xl:table-cell" />
                      <td className="p-3 border border-gray-200 hidden 2xl:table-cell" />
                    </tr>
                  ))}

                {!showLoading &&
                  listings.map((listing) => (
                    <tr
                      key={listing.id}
                      ref={(node) => {
                        cardRefs.current[listing.id] = node;
                      }}
                      className={`cursor-pointer group hover:bg-gray-50 transition-colors ${
                        highlightedListingId === listing.id ? "bg-amber-50" : ""
                      }`}
                      onClick={() => {
                        router.push(listing.href);
                      }}
                    >
                      <td className="p-3 border border-gray-200 text-center">
                        <button className="text-gray-400 hover:text-gray-700 group-hover:text-gray-500 transition-colors">
                          <StarIcon />
                        </button>
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-gray-900">
                        {listing.address}, {listing.city}, {listing.state} {listing.zip}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-900 font-semibold whitespace-nowrap">
                        {listing.price}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-500">
                        -
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-700">
                        {listing.beds}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-700">
                        {listing.baths}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-700 whitespace-nowrap hidden lg:table-cell">
                        {listing.sqft ? `${listing.sqft.toLocaleString()} Sq.Ft` : "-"}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-700 whitespace-nowrap hidden xl:table-cell">
                        {formatPriceSqft(listing.priceValue, listing.sqft)}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-gray-500 whitespace-nowrap hidden 2xl:table-cell">
                        {listing.address}
                      </td>
                    </tr>
                  ))}

                {showNoResults && (
                  <tr>
                    <td colSpan={9} className="p-8 border border-gray-200 text-center text-gray-500 text-sm">
                      No properties match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden pt-3 pb-3 bg-gray-50">
            {showLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`mobile-loading-${index}`} className="mx-4 mb-3 h-24 rounded-xl bg-gray-200 animate-pulse" />
              ))}

            {!showLoading && listings.map((listing) => <MobileListCard key={listing.id} listing={listing} />)}

            {showNoResults && (
              <div className="px-4 py-10 text-center text-sm text-gray-500">No properties match this search.</div>
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
