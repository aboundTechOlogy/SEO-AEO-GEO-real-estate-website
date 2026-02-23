"use client";

import type { ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BridgeProperty } from "@/lib/bridge";
import {
  buildIdxDetailSections,
  buildIdxLegalDisclosure,
  calculatePricePerSqft,
  formatAddress,
  formatCurrency,
  getListingPhotos,
  type IdxDetailRow,
} from "@/lib/property-utils";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import {
  IconCalendar,
  IconClose,
  IconDetailCounty,
  IconDetailDepartment,
  IconDetailInfo,
  IconDetailTool,
  IconLove,
  IconShared,
  IconOpen,
  IconExpand,
  IconPhone,
  IconEnvelope,
  IconChevronLeft,
  IconChevronRight,
  IconCamera,
  IconDollar,
  IconHouseSale,
  IconRuler,
  IconSearchFlat,
  IconStreetView,
  IconTimeClock,
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

function DetailSection({ title, rows, iconMap }: { title: string; rows: IdxDetailRow[]; iconMap?: Record<string, ReactNode> }) {
  if (rows.length === 0) return null;
  return (
    <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
      <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[15px]">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {rows.map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} icon={iconMap?.[row.label]} />
        ))}
      </div>
    </section>
  );
}

function AmenitiesSection({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
      <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[15px]">Amenities</h3>
      <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2 text-[14px] text-gray-700 leading-[1.5]">
        {amenities.map((amenity) => (
          <li key={amenity} className="flex items-start gap-2">
            <span aria-hidden className="text-gray-400 leading-[1.2] mt-[1px]">
              •
            </span>
            <span>{amenity}</span>
          </li>
        ))}
      </ul>
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

const BASIC_INFO_ICON_MAP: Record<string, ReactNode> = {
  "MLS #": <IconSearchFlat className="w-full h-full" />,
  Type: <IconHouseSale className="w-full h-full" />,
  Status: <IconDetailInfo className="w-full h-full" />,
  "Subdivision/Complex": <IconDetailDepartment className="w-full h-full" />,
  "Year Built": <IconDetailTool className="w-full h-full" />,
  "Price Range": <IconDollar className="w-full h-full" />,
  "Total Size": <IconRuler className="w-full h-full" />,
  "Date Closed": <IconCalendar className="w-full h-full" />,
  "Date Listed": <IconCalendar className="w-full h-full" />,
  "Days On Market": <IconTimeClock className="w-full h-full" />,
  "Community Name": <IconDetailCounty className="w-full h-full" />,
};

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
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "map" | "virtual-tour">("photos");
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
    setActiveMediaTab("photos");
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

  const details = buildIdxDetailSections(property);
  const legal = buildIdxLegalDisclosure(property);
  const remarks = details.description;
  const isLongDescription = remarks.length > 340;
  const description = showFullDescription ? remarks : `${remarks.slice(0, 340)}${isLongDescription ? "..." : ""}`;

  const bathsCount =
    property.BathroomsTotalInteger ??
    (property.BathroomsFull || property.BathroomsHalf
      ? Number((property.BathroomsFull + property.BathroomsHalf * 0.5).toFixed(1))
      : 0);

  const halfBathValue = property.BathroomsHalf ? String(property.BathroomsHalf) : "--";

  const lat = property.Latitude;
  const lng = property.Longitude;

  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) > 0 && Math.abs(lng) > 0;
  const mapEmbedUrl = hasCoords
    ? `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
    : null;

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
    setActiveMediaTab("map");
  }

  function openPhotosView() {
    setActiveMediaTab("photos");
  }

  function openVirtualTourView() {
    setActiveMediaTab("virtual-tour");
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
            <div className="absolute left-[15px] top-8 z-20 flex items-center gap-[10px]">
              <RectTabButton label="PHOTOS" active={activeMediaTab === "photos"} onClick={openPhotosView} />
              <RectTabButton label="MAP VIEW" active={activeMediaTab === "map"} onClick={openMapView} />
              <RectTabButton
                label="VIRTUAL TOUR"
                active={activeMediaTab === "virtual-tour"}
                onClick={openVirtualTourView}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (hasDisplayablePhotos && activeMediaTab === "photos") {
                  setIsPhotoViewerOpen(true);
                }
              }}
              className="hidden lg:flex absolute right-[15px] top-[15px] z-20 w-[35px] h-[35px] rounded-md bg-black text-white items-center justify-center hover:bg-black/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Open full photo viewer"
              disabled={!hasDisplayablePhotos || activeMediaTab !== "photos"}
            >
              <IconExpand className="w-[18px] h-[18px]" />
            </button>

            {activeMediaTab === "photos" && (
              <>
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
                          <div
                            key={`desktop-fallback-${photoIndex}`}
                            className="bg-gray-100 border-r border-gray-200 last:border-r-0 flex items-center justify-center text-gray-500 text-sm"
                          >
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

                <div className="absolute right-3 bottom-3">
                  <span className="rounded-md bg-black text-white text-xs px-2.5 py-1.5">
                    {Math.min(activePhoto + 1, Math.max(photoCount, 1))} of {Math.max(photoCount, 1)}
                  </span>
                </div>
              </>
            )}

            {activeMediaTab === "map" && (
              <div className="w-full aspect-video lg:h-[450px] lg:aspect-auto bg-gray-100">
                {mapEmbedUrl ? (
                  <iframe
                    src={mapEmbedUrl}
                    title={`Map view for ${address}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    Map unavailable
                  </div>
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
              </div>
            )}

            {activeMediaTab === "virtual-tour" && (
              <div className="w-full aspect-video lg:h-[450px] lg:aspect-auto bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-600 px-6">
                  <IconVirtual360 className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Virtual tour is not available for this listing.</p>
                </div>
              </div>
            )}
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

                <DetailSection title="Basic Information" rows={details.basicInformationRows} iconMap={BASIC_INFO_ICON_MAP} />
                <AmenitiesSection amenities={details.amenities} />
                <DetailSection title="Exterior Features" rows={details.exteriorFeatureRows} />
                <DetailSection title="Interior Features" rows={details.interiorFeatureRows} />
                <DetailSection title="Property Features" rows={details.propertyFeatureRows} />

                {hasCoords && (
                  <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
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
                  </section>
                )}

                <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
                  <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[10px]">Similar Properties For Sale</h3>
                  <p className="text-[14px] text-gray-500 mb-[15px]">
                    Explore more properties in {property.City || "this area"}.
                  </p>
                  <a
                    href={`/search?q=${encodeURIComponent(property.City || "")}`}
                    className="inline-flex items-center justify-center border border-gray-300 text-[#1a1a1a] px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.12em] hover:bg-gray-100 transition-colors"
                  >
                    View Similar Listings
                  </a>
                </section>

                <section className="bg-[#f5f5f5] border-b border-gray-200 px-[15px] py-[20px] text-[11px] text-gray-500 leading-[1.6] space-y-2">
                  {legal.courtesyLine && <p>{legal.courtesyLine}</p>}
                  <p>{legal.disclaimer}</p>
                </section>
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
                    <CircleIconButton
                      label="Map view"
                      onClick={() => {
                        setIsPhotoViewerOpen(false);
                        openMapView();
                      }}
                    >
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
