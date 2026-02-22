"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BridgeProperty } from "@/lib/bridge";
import { calculatePricePerSqft, formatAddress, formatCompactPrice, formatCurrency, getListingPhotos } from "@/lib/property-utils";
import SearchPropertyCard from "@/components/SearchPropertyCard";
import { DesktopSearchBar, MobileSearchBar, SearchFilterValues, ViewMode } from "@/components/SearchFilters";
import PropertyMap from "@/components/PropertyMap";

interface SearchApiResponse {
  properties: BridgeProperty[];
  totalCount: number;
  page: number;
  totalPages: number;
}

function parseFilterValues(params: URLSearchParams): SearchFilterValues {
  return {
    q: params.get("q") || "",
    status: params.get("status") || "Active",
    type: params.get("type") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    beds: params.get("beds") || "",
    baths: params.get("baths") || "",
    sort: params.get("sort") || "ListingContractDate desc",
  };
}

function parsePageParam(params: URLSearchParams): number {
  const raw = Number(params.get("page") || "1");
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.floor(raw);
}

function SorterRow({
  count,
  sort,
  onSortChange,
}: {
  count: number;
  sort: string;
  onSortChange: (sort: string) => void;
}) {
  const options = [
    { label: "Newest Listings", value: "ListingContractDate desc" },
    { label: "Price: High to Low", value: "ListPrice desc" },
    { label: "Price: Low to High", value: "ListPrice asc" },
    { label: "Beds: High to Low", value: "BedroomsTotal desc" },
    { label: "Baths: High to Low", value: "BathroomsTotalInteger desc" },
    { label: "Sq.Ft: High to Low", value: "LivingArea desc" },
    { label: "Days on Market", value: "DaysOnMarket asc" },
  ];

  return (
    <div className="h-10 flex items-center justify-between px-[15px] bg-white border-b border-gray-200 shrink-0">
      <p className="text-[13px] text-gray-600">{count.toLocaleString()} Properties</p>
      <label className="flex items-center gap-2 text-[13px] text-gray-500">
        <span>Sort by:</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="text-gray-900 font-semibold bg-transparent border-none focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
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
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = [];

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-8 bg-white">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ‹
      </button>

      {pages.map((item) => (
        <button
          key={item}
          onClick={() => onPageChange(item)}
          className={`w-9 h-9 rounded text-sm transition-colors ${
            item === page
              ? "bg-gray-900 text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}

function MobileListCard({ property }: { property: BridgeProperty }) {
  const photos = getListingPhotos(property);
  const heroPhoto = photos[0]?.MediaURL;
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;

  return (
    <a
      href={`/property/${property.ListingKey}/`}
      className="mx-4 mb-3 flex gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      {heroPhoto ? (
        <img src={heroPhoto} alt={formatAddress(property)} className="w-20 h-20 shrink-0 rounded-md object-cover" />
      ) : (
        <div className="w-20 h-20 shrink-0 rounded-md bg-gray-200" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm leading-snug truncate">
          {formatAddress(property)}, {property.City}, {property.StateOrProvince} {property.PostalCode}
        </p>
        <p className="text-gray-900 text-base font-bold mt-1">{formatCurrency(price)}</p>
        <div className="flex items-center gap-1 text-[13px] text-gray-700 mt-1">
          <span className="font-semibold">{property.BedroomsTotal}</span>
          <span className="text-gray-400">Beds</span>
          <span className="text-gray-300 mx-0.5">•</span>
          <span className="font-semibold">{property.BathroomsTotalInteger}</span>
          <span className="text-gray-400">Baths</span>
          <span className="text-gray-300 mx-0.5">•</span>
          <span className="font-semibold">{property.LivingArea ? property.LivingArea.toLocaleString() : "-"}</span>
          <span className="text-gray-400">Sq.Ft</span>
        </div>
      </div>
    </a>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterBarRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theadTop, setTheadTop] = useState(136);

  const [view, setViewState] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    const hash = window.location.hash.replace("#", "") as ViewMode;
    return ["grid", "map", "list"].includes(hash) ? hash : "grid";
  });

  const paramsKey = searchParams.toString();
  const values = useMemo(() => parseFilterValues(new URLSearchParams(paramsKey)), [paramsKey]);
  const page = useMemo(() => parsePageParam(new URLSearchParams(paramsKey)), [paramsKey]);

  useEffect(() => {
    let canceled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const query = paramsKey ? `?${paramsKey}` : "";
        const response = await fetch(`/api/search${query}`);

        if (!response.ok) {
          throw new Error(`Search request failed (${response.status})`);
        }

        const json = (await response.json()) as SearchApiResponse;

        if (!canceled) {
          setResult(json);
        }
      } catch (caught) {
        if (!canceled) {
          setError(caught instanceof Error ? caught.message : "Failed to load properties");
          setResult({ properties: [], totalCount: 0, page: 1, totalPages: 1 });
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      canceled = true;
    };
  }, [paramsKey]);

  useEffect(() => {
    const measure = () => {
      if (filterBarRef.current) {
        const top = Number.parseFloat(getComputedStyle(filterBarRef.current).top) || 0;
        setTheadTop(top + filterBarRef.current.offsetHeight);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function updateUrlParams(patch: Partial<SearchFilterValues> & { page?: string }) {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    if (!Object.prototype.hasOwnProperty.call(patch, "page")) {
      next.delete("page");
    }

    const query = next.toString();
    const hash = `#${view}`;
    router.replace(query ? `${pathname}?${query}${hash}` : `${pathname}${hash}`, { scroll: false });
  }

  function setView(nextView: ViewMode) {
    setViewState(nextView);
    const query = searchParams.toString();
    const hash = `#${nextView}`;
    window.history.replaceState(null, "", query ? `${pathname}?${query}${hash}` : `${pathname}${hash}`);
  }

  const properties = result?.properties || [];
  const totalCount = result?.totalCount || 0;
  const totalPages = Math.max(1, result?.totalPages || 1);

  const mapMarkers = properties
    .filter((property) => Number.isFinite(property.Latitude) && Number.isFinite(property.Longitude) && property.Latitude !== 0 && property.Longitude !== 0)
    .map((property) => ({
      lat: property.Latitude,
      lng: property.Longitude,
      price: property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice,
      listingKey: property.ListingKey,
      label: formatCompactPrice(property.ListPrice),
    }));

  const mapCenter = mapMarkers[0]
    ? { lat: mapMarkers[0].lat, lng: mapMarkers[0].lng }
    : { lat: 25.7617, lng: -80.1918 };

  return (
    <>
      <div className="h-[50px] lg:h-[82px] min-[1440px]:h-[90px]" />

      <div ref={filterBarRef} className="sticky top-[50px] lg:top-[82px] min-[1440px]:top-[90px] z-30 bg-white">
        <DesktopSearchBar
          values={values}
          onValuesChange={updateUrlParams}
          onSubmit={() => updateUrlParams({})}
          view={view}
          onViewChange={setView}
        />
        <MobileSearchBar
          values={values}
          onValuesChange={updateUrlParams}
          onSubmit={() => updateUrlParams({})}
          view={view}
          onViewChange={setView}
        />
      </div>

      {loading && (
        <div className="bg-white py-16 text-center text-gray-600 text-sm uppercase tracking-[0.16em]">Loading properties...</div>
      )}

      {!loading && error && (
        <div className="bg-white py-16 text-center text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && view === "grid" && (
        <div className="bg-white min-h-[calc(100vh-64px-56px)]">
          <SorterRow count={totalCount} sort={values.sort} onSortChange={(sort) => updateUrlParams({ sort })} />
          <div className="px-[10px] pt-[10px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <div key={property.ListingKey} className="px-[5px] mb-[10px]">
                  <SearchPropertyCard property={property} isSold={property.StandardStatus === "Closed"} />
                </div>
              ))}
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(nextPage) => updateUrlParams({ page: String(nextPage) })} />
        </div>
      )}

      {!loading && !error && view === "map" && (
        <div className="flex" style={{ height: "calc(100vh - 72px - 56px)" }}>
          <div className="w-full lg:w-[60%] xl:w-1/2 shrink-0">
            <PropertyMap
              center={mapCenter}
              zoom={11}
              markers={mapMarkers}
              className="h-full"
              onClick={(listingKey) => router.push(`/property/${listingKey}/`)}
            />
          </div>

          <div className="hidden lg:flex lg:w-[40%] xl:w-1/2 bg-white flex-col overflow-y-auto">
            <SorterRow count={totalCount} sort={values.sort} onSortChange={(sort) => updateUrlParams({ sort })} />
            <div className="px-[10px] pt-[10px] flex-1">
              <div className="grid grid-cols-1 xl:grid-cols-2">
                {properties.map((property) => (
                  <div key={property.ListingKey} className="px-[5px] mb-[10px]">
                    <SearchPropertyCard property={property} isSold={property.StandardStatus === "Closed"} />
                  </div>
                ))}
              </div>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={(nextPage) => updateUrlParams({ page: String(nextPage) })} />
          </div>
        </div>
      )}

      {!loading && !error && view === "list" && (
        <div className="bg-white min-h-[calc(100vh-64px-56px)]">
          <SorterRow count={totalCount} sort={values.sort} onSortChange={(sort) => updateUrlParams({ sort })} />

          <div className="hidden md:block px-[15px] pb-[15px]">
            <table className="w-full max-w-full border-collapse border border-gray-200 bg-white" style={{ borderSpacing: 0 }}>
              <thead className="sticky z-[3]" style={{ top: theadTop }}>
                <tr>
                  <th className="px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200">Address</th>
                  <th className="w-[140px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200">Price</th>
                  <th className="w-[70px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">Beds</th>
                  <th className="w-[70px] px-2 py-[15px] text-[14px] font-semibold text-center text-gray-700 bg-[#f5f5f5] border border-gray-200">Baths</th>
                  <th className="w-[130px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden lg:table-cell">Living Size</th>
                  <th className="w-[130px] px-2 py-[15px] text-[14px] font-semibold text-right text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden xl:table-cell">Price / Sq.Ft.</th>
                  <th className="px-2 py-[15px] text-[14px] font-semibold text-left text-gray-700 bg-[#f5f5f5] border border-gray-200 hidden 2xl:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
                  const pricePerSqft = calculatePricePerSqft(price, property.LivingArea);

                  return (
                    <tr
                      key={property.ListingKey}
                      className="cursor-pointer group hover:bg-gray-50 transition-colors"
                      onClick={() => router.push(`/property/${property.ListingKey}/`)}
                    >
                      <td className="p-3 border border-gray-200 text-[15px] text-gray-900">
                        {formatAddress(property)}, {property.City}, {property.StateOrProvince} {property.PostalCode}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-900 font-semibold whitespace-nowrap">
                        {formatCurrency(price)}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-700">{property.BedroomsTotal}</td>
                      <td className="p-3 border border-gray-200 text-[15px] text-center text-gray-700">{property.BathroomsTotalInteger}</td>
                      <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-700 whitespace-nowrap hidden lg:table-cell">
                        {property.LivingArea ? `${property.LivingArea.toLocaleString()} Sq.Ft` : "-"}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-right text-gray-700 whitespace-nowrap hidden xl:table-cell">
                        {pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"}
                      </td>
                      <td className="p-3 border border-gray-200 text-[15px] text-gray-500 whitespace-nowrap hidden 2xl:table-cell">
                        {property.StandardStatus || "Active"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden pt-3 pb-3 bg-gray-50">
            {properties.map((property) => (
              <MobileListCard key={property.ListingKey} property={property} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={(nextPage) => updateUrlParams({ page: String(nextPage) })} />
        </div>
      )}
    </>
  );
}
