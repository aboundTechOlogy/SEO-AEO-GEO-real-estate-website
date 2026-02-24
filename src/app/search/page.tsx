"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import SearchPropertyCard from "@/components/SearchPropertyCard";
import { DesktopSearchBar, MobileSearchBar, DEFAULT_FILTER_VALUES } from "@/components/SearchFilters";
import type { SearchFilterValues } from "@/components/SearchFilters";
import PropertyMap from "@/components/PropertyMap";
import PropertyDetailPanel from "@/components/PropertyDetailPanel";
import { IconLove } from "@/components/IdxIcons";
import type {
  BridgeIdxListing,
  BridgeIdxMarker,
  BridgeIdxMarkersResponse,
  BridgeIdxSearchResponse,
  BridgeProperty,
} from "@/lib/bridge";

type ViewMode = "grid" | "map" | "list";
type DrawCoords = Array<{ lat: number; lng: number }>;

interface UiListing {
  id: string;
  image?: string;
  photos: string[];
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
  buildingName?: string;
}

const PAGE_SIZE = 24;
const FALLBACK_CENTER = { lat: 25.95, lng: -80.15 };
const SAVED_LISTINGS_KEY = "savedListings";

const STATUS_TO_BRIDGE: Record<string, string> = {
  "For Sale": "Active",
  "For Rent": "Active",
  Sold: "Closed",
};

const SORT_OPTIONS = [
  { label: "Newest Listings", orderby: "OriginalEntryTimestamp desc" },
  { label: "Highest Price", orderby: "ListPrice desc" },
  { label: "Lowest Price", orderby: "ListPrice asc" },
  { label: "Highest Sq.Ft", orderby: "LivingArea desc" },
  { label: "Lowest Sq.Ft", orderby: "LivingArea asc" },
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
    photos: listing.photos.map((p) => p.url),
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
    buildingName: listing.buildingName || undefined,
  };
}

function readSavedListingKeys(): Set<string> {
  try {
    const raw = window.localStorage.getItem(SAVED_LISTINGS_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(parsed.filter(Boolean));
  } catch {
    return new Set();
  }
}

function persistSavedListingKeys(keys: Set<string>) {
  try {
    window.localStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify(Array.from(keys)));
  } catch {
    // ignore storage errors
  }
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

  // Sliding window of 7 consecutive pages centered on current — no ellipsis, no total
  const maxVisible = 7;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pageNumbers: number[] = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  const btnBase =
    "w-10 h-10 rounded border text-[14px] font-semibold transition-colors flex items-center justify-center";

  return (
    <div className="flex items-center justify-center gap-1.5 py-8 bg-white">
      <button
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className={`${btnBase} border-gray-300 text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        {"<"}
      </button>

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`${btnBase} ${
            p === page
              ? "bg-black text-white border-black"
              : "border-gray-300 text-gray-800 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className={`${btnBase} border-gray-300 text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed`}
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
          <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function MobileListCard({
  listing,
  isSaved,
  onToggleSave,
  onOpenOverlay,
}: {
  listing: UiListing;
  isSaved: boolean;
  onToggleSave: (listingKey: string) => void;
  onOpenOverlay?: (listingKey: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (onOpenOverlay) {
      e.preventDefault();
      onOpenOverlay(listing.id);
    }
  };

  const handleToggleSave = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleSave(listing.id);
  };

  return (
    <Link
      href={listing.href}
      onClick={handleClick}
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
        className="shrink-0 self-start rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors"
        aria-label={isSaved ? "Unsave listing" : "Save listing"}
        onClick={handleToggleSave}
      >
        <IconLove className={`w-4 h-4 ${isSaved ? "text-rose-500" : "text-gray-500"}`} active={isSaved} />
      </button>
    </Link>
  );
}

/* ==================== URL HELPERS ==================== */

function buildSearchUrl(
  filterValues: SearchFilterValues,
  status: string,
  sortLabel: string,
  page: number,
  view: ViewMode
): string {
  const params = new URLSearchParams();

  if (filterValues.priceMin) params.set("minPrice", filterValues.priceMin);
  if (filterValues.priceMax) params.set("maxPrice", filterValues.priceMax);
  if (filterValues.bedMin) params.set("beds", filterValues.bedMin);
  if (filterValues.bathMin) params.set("baths", filterValues.bathMin);
  if (filterValues.bedMax) params.set("maxBeds", filterValues.bedMax);
  if (filterValues.bathMax) params.set("maxBaths", filterValues.bathMax);
  if (filterValues.propertyTypes.length > 0) params.set("types", filterValues.propertyTypes.join(","));
  if (filterValues.addressQuery) params.set("q", filterValues.addressQuery);
  if (filterValues.keyword) params.set("keyword", filterValues.keyword);
  if (filterValues.garage !== "Any") params.set("garage", filterValues.garage);
  if (filterValues.domMax !== "Any") params.set("maxDom", filterValues.domMax);
  if (filterValues.waterfront !== "Any") params.set("waterfront", filterValues.waterfront);
  if (filterValues.features.length > 0) params.set("features", filterValues.features.join(","));
  if (filterValues.hidePending) params.set("hidePending", "true");
  if (filterValues.minSqft) params.set("minSqft", filterValues.minSqft);
  if (filterValues.maxSqft) params.set("maxSqft", filterValues.maxSqft);
  if (status === "Sold" && filterValues.soldRange) params.set("soldRange", filterValues.soldRange);

  params.set("status", status);
  if (sortLabel !== DEFAULT_SORT) params.set("sort", sortLabel);
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  const hash = view !== "grid" ? `#${view}` : "";
  return `/search${qs ? `?${qs}` : ""}${hash}`;
}

function hydrateFromUrl(): {
  filterPartial: Partial<SearchFilterValues>;
  status?: string;
  sortLabel?: string;
  page?: number;
  view?: ViewMode;
} {
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace("#", "");

  const filterPartial: Partial<SearchFilterValues> = {};
  if (search.get("minPrice")) filterPartial.priceMin = search.get("minPrice")!;
  if (search.get("maxPrice")) filterPartial.priceMax = search.get("maxPrice")!;
  if (search.get("beds")) filterPartial.bedMin = search.get("beds")!;
  if (search.get("baths")) filterPartial.bathMin = search.get("baths")!;
  if (search.get("maxBeds")) filterPartial.bedMax = search.get("maxBeds")!;
  if (search.get("maxBaths")) filterPartial.bathMax = search.get("maxBaths")!;
  if (search.get("q")) filterPartial.addressQuery = search.get("q")!;
  if (search.get("keyword")) filterPartial.keyword = search.get("keyword")!;
  if (search.get("garage")) filterPartial.garage = search.get("garage")!;
  if (search.get("maxDom")) filterPartial.domMax = search.get("maxDom")!;
  if (search.get("waterfront")) filterPartial.waterfront = search.get("waterfront")!;
  if (search.get("features")) filterPartial.features = search.get("features")!.split(",").filter(Boolean);
  if (search.get("hidePending") === "true") filterPartial.hidePending = true;
  if (search.get("minSqft")) filterPartial.minSqft = search.get("minSqft")!;
  if (search.get("maxSqft")) filterPartial.maxSqft = search.get("maxSqft")!;
  if (search.get("types")) filterPartial.propertyTypes = search.get("types")!.split(",").filter(Boolean);
  if (search.get("soldRange")) filterPartial.soldRange = search.get("soldRange")!;

  const statusFromUrl = search.get("status") || undefined;
  const sortFromUrl = SORT_OPTIONS.some((o) => o.label === search.get("sort"))
    ? (search.get("sort") as string)
    : undefined;
  const pageFromUrl = Number(search.get("page")) > 1 ? Number(search.get("page")) : undefined;
  const viewFromUrl: ViewMode | undefined = ["grid", "map", "list"].includes(hash)
    ? (hash as ViewMode)
    : undefined;

  return {
    filterPartial,
    status: statusFromUrl,
    sortLabel: sortFromUrl,
    page: pageFromUrl,
    view: viewFromUrl,
  };
}

/* ==================== PAGE ==================== */

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("For Sale");
  const [view, setViewState] = useState<ViewMode>("grid");
  const [sortLabel, setSortLabel] = useState<string>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [drawBounds, setDrawBounds] = useState<DrawCoords | null>(null);
  const [mapViewport, setMapViewport] = useState<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null);
  const [highlightedListingId, setHighlightedListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [hoveredResultCard, setHoveredResultCard] = useState<{ listingKey: string; lat: number; lng: number } | null>(null);
  const [filterValues, setFilterValues] = useState<SearchFilterValues>(DEFAULT_FILTER_VALUES);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [savedListingKeys, setSavedListingKeys] = useState<Set<string>>(new Set());

  // Overlay state — `?show=listingKey` URL param
  const searchParams = useSearchParams();
  const showListingKey = searchParams.get("show") || null;

  // Fetch overlay property data when ?show= is set
  const { data: overlayProperty } = useSWR<BridgeProperty>(
    showListingKey ? `/api/property/${showListingKey}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleOpenOverlay = useCallback(
    (listingKey: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("show", listingKey);
      router.replace(url.pathname + url.search + url.hash, { scroll: false });
    },
    [router]
  );

  const handleFilterChange = (partial: Partial<SearchFilterValues>) => {
    setFilterValues((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

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

  // Hydrate all filter state from URL on mount
  useEffect(() => {
    const { filterPartial, status: urlStatus, sortLabel: urlSort, page: urlPage, view: urlView } =
      hydrateFromUrl();

    if (Object.keys(filterPartial).length > 0) {
      setFilterValues((prev) => ({ ...prev, ...filterPartial }));
    }
    if (urlStatus) setStatus(urlStatus);
    if (urlSort) setSortLabel(urlSort);
    if (urlPage) setPage(urlPage);
    if (urlView) setViewState(urlView);

    setHydrated(true);
  }, []);

  useEffect(() => {
    setSavedListingKeys(readSavedListingKeys());
  }, []);

  // Hide footer on map view — map should be permanently sticky with no footer
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    if (view === "map") {
      footer.style.display = "none";
    } else {
      footer.style.display = "";
    }
    return () => {
      footer.style.display = "";
    };
  }, [view]);

  // Sync URL on state changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const url = buildSearchUrl(filterValues, status, sortLabel, page, view);
    // Preserve ?show= param if overlay is open
    if (showListingKey) {
      const parsed = new URL(url, window.location.origin);
      parsed.searchParams.set("show", showListingKey);
      window.history.replaceState(null, "", parsed.pathname + parsed.search + parsed.hash);
    } else {
      window.history.replaceState(null, "", url);
    }
  }, [filterValues, status, sortLabel, page, view, hydrated, showListingKey]);

  useEffect(() => {
    setPage(1);
  }, [status, sortLabel, drawBounds]);

  useEffect(() => {
    setHighlightedListingId(null);
  }, [page, status, sortLabel, drawBounds]);

  const bridgeStatus = STATUS_TO_BRIDGE[status] || "Active";
  const orderby = getSortOrderBy(sortLabel);
  const skip = Math.max(0, (page - 1) * PAGE_SIZE);
  // Draw bounds take priority; otherwise use map viewport bounds when in map view
  const bbox = useMemo(() => {
    const drawn = getBoundingBox(drawBounds);
    if (drawn) return drawn;
    if (view === "map" && mapViewport) return mapViewport;
    return null;
  }, [drawBounds, mapViewport, view]);

  const searchKey = useMemo(() => {
    const params = new URLSearchParams();
    params.set("top", String(PAGE_SIZE));
    params.set("skip", String(skip));
    params.set("orderby", orderby);
    params.set("status", bridgeStatus);

    if (filterValues.priceMin) params.set("minPrice", filterValues.priceMin);
    if (filterValues.priceMax) params.set("maxPrice", filterValues.priceMax);
    if (filterValues.bedMin) params.set("beds", filterValues.bedMin);
    if (filterValues.bathMin) params.set("baths", filterValues.bathMin);
    if (filterValues.bedMax) params.set("maxBeds", filterValues.bedMax);
    if (filterValues.bathMax) params.set("maxBaths", filterValues.bathMax);
    if (filterValues.propertyTypes.length > 0) params.set("types", filterValues.propertyTypes.join(","));
    if (filterValues.addressQuery) params.set("q", filterValues.addressQuery);
    if (filterValues.keyword) params.set("keyword", filterValues.keyword);
    if (filterValues.garage && filterValues.garage !== "Any") params.set("minGarage", filterValues.garage);
    if (filterValues.domMax && filterValues.domMax !== "Any") params.set("maxDom", filterValues.domMax);
    if (filterValues.waterfront && filterValues.waterfront !== "Any") params.set("waterfront", filterValues.waterfront);
    if (filterValues.features.length > 0) params.set("features", filterValues.features.join(","));
    if (filterValues.hidePending) params.set("hidePending", "true");
    if (filterValues.minSqft) params.set("minSqft", filterValues.minSqft);
    if (filterValues.maxSqft) params.set("maxSqft", filterValues.maxSqft);
    if (bridgeStatus === "Closed" && filterValues.soldRange) params.set("soldRange", filterValues.soldRange);

    if (bbox) {
      params.set("swLat", String(bbox.swLat));
      params.set("swLng", String(bbox.swLng));
      params.set("neLat", String(bbox.neLat));
      params.set("neLng", String(bbox.neLng));
    }

    return `/api/search?${params.toString()}`;
  }, [bbox, bridgeStatus, filterValues, orderby, skip]);

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
  };

  const handleSaveSearch = () => {
    const save = {
      label: filterValues.addressQuery || "South Florida Search",
      url: window.location.href,
      filterValues,
      status,
      sortLabel,
      savedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("savedSearches") || "[]") as typeof save[];
      existing.unshift(save);
      localStorage.setItem("savedSearches", JSON.stringify(existing.slice(0, 20)));
      setSaveToast("Search saved!");
    } catch {
      setSaveToast("Could not save search.");
    }

    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleToggleSavedListing = (listingKey: string) => {
    setSavedListingKeys((prev) => {
      const next = new Set(prev);
      if (next.has(listingKey)) {
        next.delete(listingKey);
      } else {
        next.add(listingKey);
      }
      persistSavedListingKeys(next);
      return next;
    });
  };

  const handleMarkerClick = (listingKey: string) => {
    setHighlightedListingId(listingKey);
    const target = cardRefs.current[listingKey];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMarkerHover = useCallback((listingKey: string | null) => {
    setHoveredListingId(listingKey);
  }, []);

  const prevViewportRef = useRef<string>("");
  const handleViewportChange = useCallback((bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => {
    // Round to 3 decimals (~100m) to avoid jitter from tiny floating-point changes
    const key = `${bounds.swLat.toFixed(3)},${bounds.swLng.toFixed(3)},${bounds.neLat.toFixed(3)},${bounds.neLng.toFixed(3)}`;
    if (key === prevViewportRef.current) return;
    prevViewportRef.current = key;
    setMapViewport(bounds);
    setPage(1);
  }, []);

  return (
    <>
      <div className="h-[50px] lg:h-[82px] min-[1440px]:h-[90px]" />

      <div ref={filterBarRef} className="sticky top-[50px] lg:top-[82px] min-[1440px]:top-[90px] z-30 bg-white md:pt-2">
        <DesktopSearchBar
          status={status}
          onStatusChange={setStatus}
          view={view}
          onViewChange={setView}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
          onSaveSearch={handleSaveSearch}
          saveMessage={saveToast}
        />
        <MobileSearchBar
          status={status}
          onStatusChange={setStatus}
          view={view}
          onViewChange={setView}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
          onSaveSearch={handleSaveSearch}
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
                      listingKey={listing.id}
                      image={listing.image}
                      photos={listing.photos}
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
                      isSaved={savedListingKeys.has(listing.id)}
                      onToggleSave={handleToggleSavedListing}
                      onOpenOverlay={handleOpenOverlay}
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
        <div className="lg:flex">
          {/* Map — sticky on desktop, fixed height on mobile */}
          <div
            className="w-full lg:w-[60%] xl:w-1/2 lg:shrink-0 lg:sticky lg:self-start"
            style={{ height: `calc(100vh - ${theadTop}px)`, top: theadTop }}
          >
            <PropertyMap
              center={mapCenter}
              zoom={10}
              interactive={true}
              markers={mapMarkers}
              onClick={handleMarkerClick}
              className="w-full h-full"
              onDrawBounds={setDrawBounds}
              hoveredListingId={hoveredListingId}
              selectedListingId={highlightedListingId}
              onMarkerHover={handleMarkerHover}
              markerCount={filteredMarkers.length}
              totalCount={markersData?.total ?? totalCount}
              onOpenOverlay={handleOpenOverlay}
              savedListingKeys={savedListingKeys}
              onToggleSave={handleToggleSavedListing}
              hoveredResultCard={hoveredResultCard}
              onInfoCardClose={() => setHighlightedListingId(null)}
              onViewportChange={handleViewportChange}
            />
          </div>

          {/* Results panel — normal page flow, scrolls with page */}
          <div className="hidden lg:block lg:w-[40%] xl:w-1/2 bg-white">
            <SorterRow count={totalCount} selectedSort={sortLabel} onSortChange={setSortLabel} />
            <div className="px-[10px] pt-[10px]">
              {showLoading ? (
                <LoadingGrid count={8} />
              ) : showNoResults ? (
                <div className="py-14 text-center text-sm text-gray-500">No properties match this search.</div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-[10px] p-[5px]">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className={`rounded-[10px] transition-shadow duration-200 ${
                        highlightedListingId === listing.id
                          ? "ring-2 ring-black"
                          : hoveredListingId === listing.id
                            ? "ring-2 ring-black"
                            : ""
                      }`}
                      ref={(node) => {
                        cardRefs.current[listing.id] = node;
                      }}
                      onMouseEnter={() => { setHoveredListingId(listing.id); setHoveredResultCard({ listingKey: listing.id, lat: listing.lat, lng: listing.lng }); setHighlightedListingId(null); }}
                      onMouseLeave={() => { setHoveredListingId(null); setHoveredResultCard(null); }}
                    >
                      <SearchPropertyCard
                        listingKey={listing.id}
                        image={listing.image}
                        photos={listing.photos}
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
                        isSaved={savedListingKeys.has(listing.id)}
                        onToggleSave={handleToggleSavedListing}
                        onOpenOverlay={handleOpenOverlay}
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
                        handleOpenOverlay(listing.id);
                      }}
                    >
                      <td className="p-3 border border-gray-200 text-center">
                        <button
                          className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors"
                          aria-label={savedListingKeys.has(listing.id) ? "Unsave listing" : "Save listing"}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleToggleSavedListing(listing.id);
                          }}
                        >
                          <IconLove
                            className={`w-4 h-4 ${savedListingKeys.has(listing.id) ? "text-rose-500" : "text-gray-500"}`}
                            active={savedListingKeys.has(listing.id)}
                          />
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
                        {listing.buildingName || "-"}
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

            {!showLoading &&
              listings.map((listing) => (
                <MobileListCard
                  key={listing.id}
                  listing={listing}
                  isSaved={savedListingKeys.has(listing.id)}
                  onToggleSave={handleToggleSavedListing}
                  onOpenOverlay={handleOpenOverlay}
                />
              ))}

            {showNoResults && (
              <div className="px-4 py-10 text-center text-sm text-gray-500">No properties match this search.</div>
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Property detail overlay — triggered by ?show=listingKey */}
      {showListingKey && (
        <PropertyDetailPanel
          property={overlayProperty ?? null}
          listingKey={showListingKey}
        />
      )}
    </>
  );
}
