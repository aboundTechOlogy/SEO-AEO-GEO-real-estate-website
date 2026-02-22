"use client";

import type { ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BridgeProperty } from "@/lib/bridge";
import { calculatePricePerSqft, formatAddress, formatCurrency, getListingPhotos } from "@/lib/property-utils";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import {
  IconClose,
  IconLove,
  IconShared,
  IconOpen,
  IconExpand,
  IconPhone,
  IconEnvelope,
  IconChevronLeft,
  IconChevronRight,
  IconCamera,
  IconStreetView,
  IconVirtual360,
} from "@/components/IdxIcons";

interface PropertyDetailPanelProps {
  property: BridgeProperty | null;
  listingKey: string;
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="border border-gray-200 bg-white px-[15px] py-[10px]">
      <p className="text-[13px] text-gray-500 mb-1 flex items-center gap-1.5">
        {icon && <span className="w-[14px] h-[14px] shrink-0 text-gray-400">{icon}</span>}
        {label}
      </p>
      <p className="text-[14px] text-[#1a1a1a] leading-[1.35]">{value}</p>
    </div>
  );
}

function DetailSection({ title, rows, iconMap }: { title: string; rows: [string, string][]; iconMap?: Record<string, ReactNode> }) {
  if (rows.length === 0) return null;
  return (
    <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
      <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[15px]">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} icon={iconMap?.[label]} />
        ))}
      </div>
    </section>
  );
}

function StatMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-[15px] py-[10px] text-center uppercase text-gray-500">
      <p className="text-[17px] lg:text-[24px] leading-none font-semibold text-[#1a1a1a]">{value}</p>
      <p className="mt-[3px] text-[11px] lg:text-[12px] leading-none">{label}</p>
    </div>
  );
}

function estimateMonthlyPayment(price: number | null | undefined): string | null {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return null;
  }

  const principal = price * 0.8;
  const monthlyRate = 0.065 / 12;
  const payments = 360;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1);

  if (!Number.isFinite(payment)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(payment));
}

const PANEL_CONTAINER_CLASS =
  "relative w-full h-screen md:my-[15px] md:h-[calc(100vh-30px)] md:w-[calc(100%-50px)] min-[1300px]:w-[1200px] md:mx-auto border-0 md:border md:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)]";

function CircleIconButton({
  label,
  children,
  active = false,
  disabled = false,
  size = "md",
  onClick,
}: {
  label: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  onClick?: () => void;
}) {
  const sizeClass = size === "sm" ? "w-[35px] h-[35px]" : "w-10 h-10";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} rounded-full flex items-center justify-center transition-colors ${
        active ? "bg-black text-white" : "bg-white text-[#1a1a1a] border border-gray-300 hover:bg-gray-100"
      } ${disabled ? "opacity-45 cursor-not-allowed hover:bg-white" : ""}`}
    >
      {children}
    </button>
  );
}

function RectTabButton({
  label,
  active,
  disabled = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[35px] px-[15px] text-[11px] font-semibold uppercase tracking-[0.04em] border transition-colors ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-300 bg-white text-[#1a1a1a] hover:bg-gray-100"
      } ${disabled ? "opacity-45 cursor-not-allowed hover:bg-white" : ""}`}
    >
      {label}
    </button>
  );
}

export default function PropertyDetailPanel({ property, listingKey }: PropertyDetailPanelProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("show");
      router.replace(url.pathname + url.search, { scroll: false });
    }, 220);
  }, [router]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsClosing(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (isPhotoViewerOpen) {
        setIsPhotoViewerOpen(false);
        return;
      }

      handleClose();
    }

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [handleClose, isPhotoViewerOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevHtmlOverscroll = html.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    html.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      html.style.overscrollBehavior = prevHtmlOverscroll;
    };
  }, []);

  useEffect(() => {
    setActivePhoto(0);
    setIsPhotoViewerOpen(false);
    setFailedPhotos({});
    setShowFullDescription(false);

    try {
      const raw = window.localStorage.getItem("savedListings");
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      setIsSaved(parsed.includes(listingKey));
    } catch {
      setIsSaved(false);
    }
  }, [listingKey]);

  useEffect(() => {
    if (!actionNotice) {
      return;
    }

    const id = window.setTimeout(() => setActionNotice(null), 2200);
    return () => window.clearTimeout(id);
  }, [actionNotice]);

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    setTouchStartX(event.touches[0]?.clientX ?? null);
    setTouchCurrentX(null);
  }

  function handleTouchMove(event: TouchEvent<HTMLElement>) {
    if (touchStartX === null) {
      return;
    }

    setTouchCurrentX(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd() {
    if (touchStartX !== null && touchCurrentX !== null && touchCurrentX - touchStartX > 90) {
      handleClose();
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  }

  if (!property) {
    return (
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="fixed inset-0 bg-black/65 backdrop-blur-[1.5px]" />

        <aside
          className={`${PANEL_CONTAINER_CLASS} transition-all duration-300 ${
            isClosing ? "translate-y-3 scale-[0.985] opacity-0" : "translate-y-0 scale-100 opacity-100"
          }`}
        >
          <div className="min-h-full flex flex-col items-center justify-center px-8 text-center bg-white">
            <p className="text-gray-700 text-lg mb-3">Property not found.</p>
            <button
              type="button"
              onClick={handleClose}
              className="border border-gray-300 text-[#1a1a1a] px-5 py-2 text-sm rounded-full hover:bg-gray-100 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </aside>
      </div>
    );
  }

  const photos = getListingPhotos(property);
  const photoCount = photos.length;
  const hasDisplayablePhotos = photos.some((photo, index) => Boolean(photo?.MediaURL) && !failedPhotos[index]);
  const address = formatAddress(property);
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const estimatedPayment = estimateMonthlyPayment(price);
  const pricePerSqft = calculatePricePerSqft(price, property.LivingArea);

  function markPhotoFailed(index: number) {
    setFailedPhotos((prev) => {
      if (prev[index]) {
        return prev;
      }

      const nextFailed = { ...prev, [index]: true };

      if (index === activePhoto) {
        const nextIndex = photos.findIndex((_, i) => !nextFailed[i]);
        if (nextIndex !== -1 && nextIndex !== activePhoto) {
          setActivePhoto(nextIndex);
        }
      }

      return nextFailed;
    });
  }

  const desktopIndexes =
    photoCount > 0
      ? [activePhoto, (activePhoto + 1) % photoCount, (activePhoto + 2) % photoCount]
      : [];

  const activePhotoUrl = photos[activePhoto]?.MediaURL;
  const activePhotoFailed = failedPhotos[activePhoto];

  const remarks = property.PublicRemarks || "No description provided.";
  const isLongDescription = remarks.length > 340;
  const description = showFullDescription ? remarks : `${remarks.slice(0, 340)}${isLongDescription ? "..." : ""}`;

  function fmtArr(arr: string[] | undefined | null): string | null {
    if (!arr || arr.length === 0) return null;
    return arr.join(", ");
  }

  function fmtSqft(val: number | null | undefined): string | null {
    if (typeof val !== "number" || !Number.isFinite(val) || val <= 0) return null;
    return `${val.toLocaleString()} Sq.Ft`;
  }

  function fmtAcres(val: number | null | undefined): string | null {
    if (typeof val !== "number" || !Number.isFinite(val) || val <= 0) return null;
    return `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} Acres`;
  }

  function fmtDate(val: string | null | undefined): string | null {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  type DetailPair = [string, string];

  function collectRows(pairs: [string, string | null | undefined][]): DetailPair[] {
    return pairs.filter((p): p is [string, string] => p[1] != null && p[1] !== "");
  }

  const basicInfoRows = collectRows([
    ["Property Type", property.PropertyType || null],
    ["Sub Type", property.PropertySubType || null],
    ["Status", property.StandardStatus || null],
    ["Year Built", property.YearBuilt ? String(property.YearBuilt) : null],
    ["Living Area", fmtSqft(property.LivingArea)],
    ["Lot Size", fmtSqft(property.LotSizeSquareFeet) || fmtSqft(property.LotSizeArea)],
    ["Lot Acres", fmtAcres(property.LotSizeAcres)],
    ["Stories", property.StoriesTotal ? String(property.StoriesTotal) : null],
    ["Subdivision", property.SubdivisionName],
    ["Building", property.BuildingName],
    ["County", property.CountyOrParish],
    ["Architectural Style", fmtArr(property.ArchitecturalStyle)],
    ["Construction", fmtArr(property.ConstructionMaterials)],
    ["Garage Spaces", property.GarageSpaces ? String(property.GarageSpaces) : null],
    ["Attached Garage", property.AttachedGarageYN ? "Yes" : null],
    ["Covered Spaces", property.CoveredSpaces ? String(property.CoveredSpaces) : null],
    ["Days on Market", property.DaysOnMarket != null ? String(property.DaysOnMarket) : null],
    ["List Date", fmtDate(property.ListingContractDate || null)],
    ["Original List Price", property.OriginalListPrice ? formatCurrency(property.OriginalListPrice) : null],
    ["Close Date", fmtDate(property.CloseDate)],
    ["Close Price", property.ClosePrice ? formatCurrency(property.ClosePrice) : null],
    ["Association Fee", property.AssociationFee ? `${formatCurrency(property.AssociationFee)}${property.AssociationFeeFrequency ? ` / ${property.AssociationFeeFrequency}` : ""}` : null],
    ["Direction Faces", property.DirectionFaces],
  ]);

  const exteriorRows = collectRows([
    ["Exterior Features", fmtArr(property.ExteriorFeatures)],
    ["Roof", fmtArr(property.Roof)],
    ["Pool Features", fmtArr(property.PoolFeatures)],
    ["Pool", property.PoolPrivateYN ? "Private Pool" : null],
    ["Patio / Porch", fmtArr(property.PatioAndPorchFeatures)],
    ["Lot Features", fmtArr(property.LotFeatures)],
    ["View", fmtArr(property.View)],
    ["Waterfront", property.WaterfrontYN ? "Yes" : null],
    ["Water Source", fmtArr(property.WaterSource)],
    ["Sewer", fmtArr(property.Sewer)],
  ]);

  const interiorRows = collectRows([
    ["Interior Features", fmtArr(property.InteriorFeatures)],
    ["Appliances", fmtArr(property.Appliances)],
    ["Flooring", fmtArr(property.Flooring)],
    ["Cooling", fmtArr(property.Cooling)],
    ["Heating", fmtArr(property.Heating)],
    ["Levels", fmtArr(property.Levels)],
  ]);

  const propertyFeaturesRows = collectRows([
    ["Parking", fmtArr(property.ParkingFeatures)],
    ["Building Features", fmtArr(property.BuildingFeatures)],
    ["Community Features", fmtArr(property.CommunityFeatures)],
    ["Pets Allowed", fmtArr(property.PetsAllowed)],
    ["Listing Terms", fmtArr(property.ListingTerms)],
    ["Possession", fmtArr(property.Possession)],
    ["Occupant Type", property.OccupantType],
  ]);

  const taxRows = collectRows([
    ["Tax Annual Amount", property.TaxAnnualAmount ? formatCurrency(property.TaxAnnualAmount) : null],
    ["Tax Year", property.TaxYear ? String(property.TaxYear) : null],
    ["Tax Legal Description", property.TaxLegalDescription],
  ]);

  const bathsCount =
    property.BathroomsTotalInteger ??
    (property.BathroomsFull || property.BathroomsHalf
      ? Number((property.BathroomsFull + property.BathroomsHalf * 0.5).toFixed(1))
      : 0);

  const halfBathValue = property.BathroomsHalf ? String(property.BathroomsHalf) : "--";

  const lat = property.Latitude;
  const lng = property.Longitude;

  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) > 0 && Math.abs(lng) > 0;

  const svgIcon = (d: string) => (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );

  const BASIC_INFO_ICONS: Record<string, ReactNode> = {
    "Property Type": svgIcon("M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"),
    "Sub Type": svgIcon("M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z"),
    "Status": svgIcon("M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
    "Year Built": svgIcon("M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"),
    "Living Area": svgIcon("M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"),
    "Lot Size": svgIcon("M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"),
    "Lot Acres": svgIcon("M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"),
    "Stories": svgIcon("M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"),
    "Subdivision": svgIcon("M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"),
    "Building": svgIcon("M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"),
    "County": svgIcon("M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"),
    "Architectural Style": svgIcon("M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"),
    "Construction": svgIcon("M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"),
    "Garage Spaces": svgIcon("M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"),
    "Attached Garage": svgIcon("M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"),
    "Covered Spaces": svgIcon("M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"),
    "Days on Market": svgIcon("M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"),
    "List Date": svgIcon("M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"),
    "Original List Price": svgIcon("M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
    "Close Date": svgIcon("M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
    "Close Price": svgIcon("M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
    "Association Fee": svgIcon("M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"),
    "Direction Faces": svgIcon("M12 2L15 8h6l-5 4 2 7-6-4-6 4 2-7-5-4h6l3-6z"),
  };

  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/property/${listingKey}/`
      : `/property/${listingKey}/`;

  function toggleSaved() {
    try {
      const raw = window.localStorage.getItem("savedListings");
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      const next = parsed.includes(listingKey)
        ? parsed.filter((item) => item !== listingKey)
        : [...parsed, listingKey];

      window.localStorage.setItem("savedListings", JSON.stringify(next));
      const nowSaved = next.includes(listingKey);
      setIsSaved(nowSaved);
      setActionNotice(nowSaved ? "Listing saved" : "Listing removed");
    } catch {
      setActionNotice("Could not update saved listings");
    }
  }

  async function shareListing() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: address,
          text: `${formatCurrency(price)} · ${address}`,
          url: canonicalUrl,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
        setActionNotice("Link copied");
        return;
      }

      window.open(canonicalUrl, "_blank", "noopener,noreferrer");
    } catch {
      // User canceled share or blocked clipboard.
    }
  }

  function openMapView() {
    if (!hasCoords) {
      return;
    }

    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openStreetView() {
    if (!hasCoords) {
      return;
    }

    const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openCanonicalDetailsPage() {
    window.location.assign(`/property/${listingKey}/`);
  }

  return (
    <div
      className={`fixed inset-0 z-[150] transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Property details panel"
    >
      <div className="fixed inset-0 bg-black/65 backdrop-blur-[1.5px]" />

      <aside
        className={`${PANEL_CONTAINER_CLASS} relative transition-all duration-300 ${
          isPhotoViewerOpen
            ? "overflow-hidden"
            : "overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
        } ${
          isClosing ? "translate-y-3 scale-[0.985] opacity-0" : "translate-y-0 scale-100 opacity-100"
        }`}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {actionNotice && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 px-3 py-2 text-xs rounded-md bg-black text-white">
            {actionNotice}
          </div>
        )}

        <div className="min-h-full bg-[#f5f5f5]">
          <div className="sticky top-0 z-30 border-b border-black/10 bg-white">
            <div className="h-[70px] px-[15px] py-[10px] flex items-center justify-between gap-[10px]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[20px] leading-[1.1] font-semibold text-[#1a1a1a]">
                  {address}
                </p>
                <p className="truncate text-[13px] leading-[1.1] text-gray-600">
                  {property.City}, {property.StateOrProvince} {property.PostalCode}
                </p>
              </div>

              <div className="lg:hidden flex items-center gap-2 shrink-0">
                <CircleIconButton label="Close" size="sm" onClick={handleClose}>
                  <IconClose className="w-4 h-4" />
                </CircleIconButton>
              </div>

              <div className="hidden lg:flex items-center gap-[10px] shrink-0 pl-[15px]">
                <CircleIconButton label={isSaved ? "Unsave listing" : "Save listing"} onClick={toggleSaved}>
                  <IconLove className="w-5 h-5" active={isSaved} />
                </CircleIconButton>
                <CircleIconButton label="Share" onClick={shareListing}>
                  <IconShared className="w-5 h-5" />
                </CircleIconButton>
                <CircleIconButton label="Open canonical property page" onClick={openCanonicalDetailsPage}>
                  <IconOpen className="w-5 h-5" />
                </CircleIconButton>
                <CircleIconButton label="Close" onClick={handleClose}>
                  <IconClose className="w-5 h-5" />
                </CircleIconButton>
              </div>
            </div>
          </div>

          <div className="relative border-b border-black/10 bg-white">
            <div className="absolute left-[15px] top-8 z-20 lg:hidden flex items-center gap-[10px]">
              <CircleIconButton label="Photos" size="sm" active>
                <IconCamera className="w-[18px] h-[18px]" />
              </CircleIconButton>
              <CircleIconButton label="Map view" size="sm" onClick={openMapView} disabled={!hasCoords}>
                <IconStreetView className="w-[18px] h-[18px]" />
              </CircleIconButton>
              <CircleIconButton label="Virtual tour" size="sm" disabled>
                <IconVirtual360 className="w-[18px] h-[18px]" />
              </CircleIconButton>
            </div>

            <div className="absolute left-[15px] top-8 z-20 hidden lg:flex items-center gap-[10px]">
              <RectTabButton label="PHOTOS" active />
              <RectTabButton label="MAP VIEW" onClick={openMapView} disabled={!hasCoords} />
              <RectTabButton label="VIRTUAL TOUR" disabled />
            </div>

            <button
              type="button"
              onClick={() => {
                if (hasDisplayablePhotos) {
                  setIsPhotoViewerOpen(true);
                }
              }}
              className="hidden lg:flex absolute right-[15px] top-[15px] z-20 w-[35px] h-[35px] rounded-md bg-black text-white items-center justify-center hover:bg-black/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Open full photo viewer"
              disabled={!hasDisplayablePhotos}
            >
              <IconExpand className="w-[18px] h-[18px]" />
            </button>

            <div className="relative lg:hidden">
              {activePhotoUrl && !activePhotoFailed ? (
                <img
                  src={activePhotoUrl}
                  alt={address}
                  className="w-full aspect-video object-cover"
                  onError={() => markPhotoFailed(activePhoto)}
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-gray-500 text-sm bg-gray-100">
                  Photo unavailable
                </div>
              )}
            </div>

            <div className="relative hidden lg:grid grid-cols-3 h-[450px] overflow-hidden">
              {desktopIndexes.length > 0 ? (
                desktopIndexes.map((photoIndex) => {
                  const url = photos[photoIndex]?.MediaURL;
                  const failed = failedPhotos[photoIndex];

                  if (!url || failed) {
                    return (
                      <div key={`desktop-fallback-${photoIndex}`} className="bg-gray-100 border-r border-gray-200 last:border-r-0 flex items-center justify-center text-gray-500 text-sm">
                        Photo unavailable
                      </div>
                    );
                  }

                  return (
                    <button
                      key={`desktop-photo-${photoIndex}-${url}`}
                      type="button"
                      onClick={() => {
                        setActivePhoto(photoIndex);
                        setIsPhotoViewerOpen(true);
                      }}
                      className="w-full h-full border-r border-gray-200 last:border-r-0 overflow-hidden"
                      aria-label={`Open photo ${photoIndex + 1}`}
                    >
                      <img
                        src={url}
                        alt={`${address} photo ${photoIndex + 1}`}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onError={() => markPhotoFailed(photoIndex)}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="col-span-3 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  Photo unavailable
                </div>
              )}
            </div>

            {photoCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActivePhoto((prev) => (prev - 1 + photoCount) % photoCount)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black transition-colors flex items-center justify-center"
                  aria-label="Previous photo"
                >
                  <IconChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto((prev) => (prev + 1) % photoCount)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black transition-colors flex items-center justify-center"
                  aria-label="Next photo"
                >
                  <IconChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute left-3 bottom-3">
              <button
                type="button"
                onClick={openStreetView}
                disabled={!hasCoords}
                className="rounded-full border border-gray-300 bg-white/95 px-3 py-2 text-xs font-medium text-[#1a1a1a] hover:bg-white disabled:opacity-45 disabled:cursor-not-allowed"
              >
                Street View
              </button>
            </div>

            <div className="absolute right-3 bottom-3">
              <span className="rounded-md bg-black text-white text-xs px-2.5 py-1.5">
                {Math.min(activePhoto + 1, Math.max(photoCount, 1))} of {Math.max(photoCount, 1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-black/10 bg-white lg:hidden">
            <button
              type="button"
              onClick={toggleSaved}
              className="h-[45px] border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label={isSaved ? "Unsave listing" : "Save listing"}
            >
              <IconLove className="w-5 h-5" active={isSaved} />
            </button>
            <button
              type="button"
              onClick={shareListing}
              className="h-[45px] border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Share"
            >
              <IconShared className="w-5 h-5" />
            </button>
            <a href="tel:+13054559744" className="h-[45px] border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center" aria-label="Call">
              <IconPhone className="w-5 h-5" />
            </a>
            <a href="mailto:Andrew@IamAndrewWhalen.com" className="h-[45px] text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center" aria-label="Email">
              <IconEnvelope className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-white border-b border-black/10">
            <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_310px] min-[1300px]:grid-cols-[minmax(0,1fr)_350px]">
              <div className="min-w-0 border-r-0 lg:border-r lg:border-gray-200">
                <div className="border-b border-gray-200 bg-white">
                  <div className="flex items-end justify-between gap-4 px-[15px] py-[15px] border-b border-gray-200">
                    <p className="text-[22px] font-semibold leading-none text-[#1a1a1a]">{formatCurrency(price)}</p>
                    <div className="text-right">
                      <p className="text-[13px] text-gray-500">Est. Payment</p>
                      <p className="text-[13px] font-semibold leading-none text-[#1a1a1a]">
                        {estimatedPayment ? `${estimatedPayment}/mo` : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200 lg:hidden">
                    <StatMetric label="Beds" value={String(property.BedroomsTotal || 0)} />
                    <StatMetric label="Baths" value={String(bathsCount || 0)} />
                    <StatMetric label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
                    <StatMetric label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
                  </div>

                  <div className="hidden lg:grid lg:grid-cols-5 divide-x divide-gray-200">
                    <StatMetric label="Beds" value={String(property.BedroomsTotal || 0)} />
                    <StatMetric label="Baths" value={String(bathsCount || 0)} />
                    <StatMetric label="Half Bath" value={halfBathValue} />
                    <StatMetric label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
                    <StatMetric label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
                  </div>
                </div>

                <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
                  <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[10px]">Description</h3>
                  <p className="text-[14px] leading-[1.6] text-gray-700">{description}</p>
                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setShowFullDescription((prev) => !prev)}
                      className="mt-2 text-[14px] text-gray-700 underline underline-offset-2 hover:text-black transition-colors"
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </button>
                  )}
                </section>

                <DetailSection title="Basic Information" rows={basicInfoRows} iconMap={BASIC_INFO_ICONS} />
                <DetailSection title="Exterior Features" rows={exteriorRows} />
                <DetailSection title="Interior Features" rows={interiorRows} />
                <DetailSection title="Property Features" rows={propertyFeaturesRows} />
                {taxRows.length > 0 && <DetailSection title="Tax Information" rows={taxRows} />}

                <div className="px-[15px] py-[20px] border-b border-gray-200">
                  <a
                    href={`/property/${listingKey}/`}
                    className="inline-flex items-center justify-center w-full border border-gray-300 text-[#1a1a1a] px-4 py-3 rounded-full text-xs uppercase tracking-[0.12em] hover:bg-gray-100 transition-colors"
                  >
                    View Full Details
                  </a>
                </div>
              </div>

              <aside className="hidden lg:block p-[15px]">
                <div className="border border-gray-200 bg-white p-[15px] space-y-[15px] sticky top-[82px]">
                  <div className="flex items-center gap-3">
                    <img src="/andrew-headshot.png" alt="Andrew Whalen" className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <p className="text-[#1a1a1a] font-semibold leading-none">Andrew Whalen</p>
                      <p className="text-gray-600 text-sm">LoKation Real Estate</p>
                      <a href="tel:+13054559744" className="text-sm text-[#1a1a1a] hover:underline">
                        (305) 455-9744
                      </a>
                    </div>
                  </div>

                  <PropertyInquiryForm listingKey={property.ListingKey} address={address} theme="light" />
                </div>
              </aside>
            </div>
          </div>

          {/* Map block — full-width, below the 2-col grid */}
          {hasCoords && (
            <section className="bg-white border-b border-black/10">
              <div className="px-[15px] py-[20px]">
                <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[15px]">Location</h3>
                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden group"
                >
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=800x400&scale=2&markers=color:red%7C${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`}
                    alt={`Map of ${address}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-sm font-medium text-[#1a1a1a] shadow">
                      Open in Google Maps
                    </span>
                  </div>
                </a>
              </div>
            </section>
          )}

          {/* Similar Properties — link to search */}
          <section className="bg-white border-b border-black/10">
            <div className="px-[15px] py-[20px]">
              <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[10px]">Similar Properties</h3>
              <p className="text-[14px] text-gray-500 mb-[15px]">
                Explore more properties in {property.City || "this area"}.
              </p>
              <a
                href={`/search?q=${encodeURIComponent(property.City || "")}`}
                className="inline-flex items-center justify-center border border-gray-300 text-[#1a1a1a] px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.12em] hover:bg-gray-100 transition-colors"
              >
                View Similar Listings
              </a>
            </div>
          </section>

          {/* Legal / Courtesy — full-width bottom */}
          <div className="px-[15px] py-[20px] text-[11px] text-gray-500 leading-[1.6] space-y-2 bg-[#f5f5f5]">
            {(property.ListOfficeName || property.ListAgentFullName) && (
              <p>
                Courtesy of{property.ListAgentFullName ? ` ${property.ListAgentFullName}` : ""}
                {property.ListOfficeName ? `, ${property.ListOfficeName}` : ""}
                {property.ListOfficePhone ? ` (${property.ListOfficePhone})` : ""}
              </p>
            )}
            <p>
              The multiple listing information is provided by the Miami Association of Realtors from a copyrighted
              compilation of listings. All information is deemed reliable but not guaranteed.
            </p>
          </div>
        </div>

        {isPhotoViewerOpen && (
          <div
            className="hidden lg:block absolute inset-0 z-40 bg-black/75 backdrop-blur-[2px]"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsPhotoViewerOpen(false);
              }
            }}
          >
            <div className="h-full flex flex-col" onClick={(event) => event.stopPropagation()}>
              <div className="hidden lg:block border-b border-gray-300 bg-white px-[15px]">
                <div className="h-[80px] max-w-[1368px] mx-auto flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[20px] leading-[1.1] font-semibold text-[#1a1a1a] truncate pr-2">
                      {address}
                    </p>
                    <p className="text-[15px] leading-[1.1] text-gray-600 truncate pr-2">
                      {property.City}, {property.StateOrProvince} {property.PostalCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-[10px] shrink-0">
                    <CircleIconButton label={isSaved ? "Unsave listing" : "Save listing"} onClick={toggleSaved}>
                      <IconLove className="w-5 h-5" active={isSaved} />
                    </CircleIconButton>
                    <CircleIconButton label="Photos" active>
                      <IconCamera className="w-5 h-5" />
                    </CircleIconButton>
                    <CircleIconButton label="Map view" onClick={openMapView} disabled={!hasCoords}>
                      <IconStreetView className="w-5 h-5" />
                    </CircleIconButton>
                    <CircleIconButton label="Email" onClick={() => window.location.assign("mailto:Andrew@IamAndrewWhalen.com")}>
                      <IconEnvelope className="w-5 h-5" />
                    </CircleIconButton>
                    <CircleIconButton label="Share" onClick={shareListing}>
                      <IconShared className="w-5 h-5" />
                    </CircleIconButton>
                    <CircleIconButton label="Close" onClick={() => setIsPhotoViewerOpen(false)}>
                      <IconClose className="w-5 h-5" />
                    </CircleIconButton>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 px-4 pb-6 pt-4 lg:p-8 xl:p-10">
                <div className="h-full w-full flex items-center justify-center">
                  {activePhotoUrl && !activePhotoFailed ? (
                    <img
                      src={activePhotoUrl}
                      alt={`${address} enlarged photo`}
                      className="w-full h-[56vh] max-h-[640px] object-cover lg:w-auto lg:h-auto lg:max-h-full lg:max-w-full lg:object-contain"
                      onError={() => markPhotoFailed(activePhoto)}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Photo unavailable</div>
                  )}
                </div>

                {photoCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev - 1 + photoCount) % photoCount)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white hover:bg-black transition-colors flex items-center justify-center"
                      aria-label="Previous photo"
                    >
                      <IconChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev + 1) % photoCount)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white hover:bg-black transition-colors flex items-center justify-center"
                      aria-label="Next photo"
                    >
                      <IconChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute right-6 bottom-8 lg:bottom-6">
                  <span className="rounded-md bg-black text-white text-sm px-3 py-2">
                    {Math.min(activePhoto + 1, Math.max(photoCount, 1))} of {Math.max(photoCount, 1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
