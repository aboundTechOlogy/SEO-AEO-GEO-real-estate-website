"use client";

import type { ReactNode, TouchEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BridgeProperty } from "@/lib/bridge";
import { calculatePricePerSqft, formatAddress, formatCurrency, getListingPhotos } from "@/lib/property-utils";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";

interface PropertyDetailPanelProps {
  property: BridgeProperty | null;
  listingKey: string;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 bg-white px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-[#1a1a1a]">{value}</p>
    </div>
  );
}

function StatMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3 text-left">
      <p className="text-[42px] leading-none font-semibold text-[#1a1a1a] inline-block mr-1">{value}</p>
      <span className="text-[34px] leading-none font-light text-[#1a1a1a]">{label}</span>
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
  "absolute inset-0 lg:inset-y-0 lg:left-[7vw] lg:right-[7vw] border-0 lg:border lg:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)]";

function CircleIconButton({
  label,
  children,
  active = false,
  onClick,
}: {
  label: string;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        active ? "bg-black text-white" : "bg-white text-[#1a1a1a] border border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function RectTabButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`h-11 px-5 text-sm font-semibold border transition-colors ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-300 bg-white text-[#1a1a1a] hover:bg-gray-100"
      }`}
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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsClosing(false);
    });

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActivePhoto(0);
    setIsPhotoViewerOpen(false);
    setFailedPhotos({});
    setShowFullDescription(false);
  }, [listingKey]);

  function handleClose() {
    setIsClosing(true);
    window.setTimeout(() => {
      router.back();
    }, 220);
  }

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
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1.5px]" />

        <aside
          className={`${PANEL_CONTAINER_CLASS} transition-all duration-300 ${
            isClosing ? "translate-y-3 scale-[0.985] opacity-0" : "translate-y-0 scale-100 opacity-100"
          }`}
        >
          <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-white">
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

  const detailItems = useMemo(
    () => [
      ["Property Type", property.PropertyType || "-"],
      ["Sub Type", property.PropertySubType || "-"],
      ["Year Built", property.YearBuilt ? String(property.YearBuilt) : "-"],
      ["Living Area", property.LivingArea ? `${property.LivingArea.toLocaleString()} Sq.Ft` : "-"],
      ["Lot Size", property.LotSizeArea ? `${property.LotSizeArea.toLocaleString()} Sq.Ft` : "-"],
      ["Garage", property.GarageSpaces ? String(property.GarageSpaces) : "-"],
      ["Association Fee", property.AssociationFee ? formatCurrency(property.AssociationFee) : "-"],
      ["Status", property.StandardStatus || "-"],
    ],
    [property]
  );

  const bathsCount =
    property.BathroomsTotalInteger ??
    (property.BathroomsFull || property.BathroomsHalf
      ? Number((property.BathroomsFull + property.BathroomsHalf * 0.5).toFixed(1))
      : 0);

  const halfBathValue = property.BathroomsHalf ? String(property.BathroomsHalf) : "--";

  return (
    <div
      className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Property details panel"
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1.5px]" />

      <aside
        className={`${PANEL_CONTAINER_CLASS} relative overflow-hidden transition-all duration-300 ${
          isClosing ? "translate-y-3 scale-[0.985] opacity-0" : "translate-y-0 scale-100 opacity-100"
        }`}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full overflow-y-auto bg-[#f5f5f5]">
          <div className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur-sm px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[34px] sm:text-[40px] lg:text-[44px] leading-[1.02] font-semibold text-[#1a1a1a] break-words pr-2">
                  {address}
                </p>
                <p className="text-sm text-gray-600 break-words pr-2">
                  {property.City}, {property.StateOrProvince} {property.PostalCode}
                </p>
              </div>

              <div className="sm:hidden flex items-center gap-2 shrink-0">
                <CircleIconButton label="Close" onClick={handleClose}>
                  ✕
                </CircleIconButton>
              </div>

              <div className="hidden sm:flex items-center gap-2 shrink-0 pt-1">
                <CircleIconButton label="Save">
                  ☆
                </CircleIconButton>
                <CircleIconButton label="Share">
                  ↗
                </CircleIconButton>
                <CircleIconButton
                  label="Fullscreen"
                  onClick={() => {
                    if (photoCount > 0) {
                      setIsPhotoViewerOpen(true);
                    }
                  }}
                >
                  ⤢
                </CircleIconButton>
                <CircleIconButton label="Close" onClick={handleClose}>
                  ✕
                </CircleIconButton>
              </div>
            </div>
          </div>

          <div className="relative border-b border-black/10 bg-white">
            <div className="absolute left-4 top-4 z-20 sm:hidden flex items-center gap-2">
              <CircleIconButton label="Photos" active>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5 8.25 12l3 3 4.5-5.25 4.5 6.75" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z" />
                </svg>
              </CircleIconButton>
              <CircleIconButton label="Map view">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.686 6-10a6 6 0 1 0-12 0c0 4.314 6 10 6 10Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                </svg>
              </CircleIconButton>
              <CircleIconButton label="Virtual tour">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3c2.5 2.3 2.5 13.7 0 18M12 3c-2.5 2.3-2.5 13.7 0 18" />
                </svg>
              </CircleIconButton>
            </div>

            <div className="absolute left-4 top-4 z-20 hidden sm:flex items-center gap-2">
              <RectTabButton label="PHOTOS" active />
              <RectTabButton label="MAP VIEW" />
              <RectTabButton label="VIRTUAL TOUR" />
            </div>

            <div className="relative sm:hidden">
              {activePhotoUrl && !activePhotoFailed ? (
                <img
                  src={activePhotoUrl}
                  alt={address}
                  className="w-full h-[42vh] min-h-[260px] object-cover"
                  onError={() => markPhotoFailed(activePhoto)}
                />
              ) : (
                <div className="w-full h-[42vh] min-h-[260px] flex items-center justify-center text-gray-500 text-sm bg-gray-100">
                  Photo unavailable
                </div>
              )}
            </div>

            <div className="relative hidden sm:grid grid-cols-3 h-[62vh] min-h-[420px] max-h-[700px] overflow-hidden">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto((prev) => (prev + 1) % photoCount)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}

            <div className="absolute left-3 bottom-3">
              <button
                type="button"
                className="rounded-full border border-gray-300 bg-white/95 px-3 py-2 text-xs font-medium text-[#1a1a1a] hover:bg-white"
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

          <div className="grid grid-cols-4 border-b border-black/10 bg-white sm:hidden">
            <button type="button" className="h-14 border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors" aria-label="Save">
              ☆
            </button>
            <button type="button" className="h-14 border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors" aria-label="Share">
              ↗
            </button>
            <a href="tel:+13054559744" className="h-14 border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center" aria-label="Call">
              ☎
            </a>
            <a href="mailto:Andrew@IamAndrewWhalen.com" className="h-14 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center" aria-label="Email">
              ✉
            </a>
          </div>

          <div className="bg-white border-b border-black/10 px-4 py-4 lg:px-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
              <div className="space-y-4 min-w-0">
                <div className="border border-gray-200 bg-white">
                  <div className="flex items-end justify-between gap-4 px-4 pt-4 pb-3 border-b border-gray-200">
                    <p className="font-playfair text-[58px] leading-none text-[#1a1a1a]">{formatCurrency(price)}</p>
                    <div className="text-right pb-1">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Est. Payment</p>
                      <p className="text-blue-600 text-[34px] font-semibold leading-none">
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

                <section className="space-y-3">
                  <div className="bg-gray-100 border border-gray-200 rounded px-4 py-3">
                    <h3 className="text-[30px] font-semibold leading-none text-[#1a1a1a]">Description</h3>
                  </div>

                  <div className="bg-white border border-gray-200 px-4 py-4">
                    <p className="text-[15px] leading-relaxed text-gray-700">{description}</p>
                    {isLongDescription && (
                      <button
                        type="button"
                        onClick={() => setShowFullDescription((prev) => !prev)}
                        className="mt-2 text-sm text-gray-700 underline underline-offset-2 hover:text-black transition-colors"
                      >
                        {showFullDescription ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </section>

                <section className="bg-white border border-gray-200 px-4 py-4">
                  <h3 className="text-[30px] font-semibold leading-none text-[#1a1a1a] mb-3">Key Details</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {detailItems.map(([label, value]) => (
                      <DetailRow key={label} label={label} value={value} />
                    ))}
                  </div>
                </section>

                <a
                  href={`/property/${listingKey}/`}
                  className="inline-flex items-center justify-center w-full border border-gray-300 text-[#1a1a1a] px-4 py-3 rounded-full text-xs uppercase tracking-[0.12em] hover:bg-gray-100 transition-colors"
                >
                  View Full Details
                </a>

                <div className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-300 pt-4">
                  The multiple listing information is provided by the Miami Association of Realtors from a copyrighted
                  compilation of listings. All information is deemed reliable but not guaranteed.
                </div>
              </div>

              <aside className="hidden lg:block border border-gray-200 bg-white p-4 space-y-4 sticky top-4">
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
              </aside>
            </div>
          </div>
        </div>

        {isPhotoViewerOpen && (
          <div
            className="hidden sm:block absolute inset-0 z-40 bg-black/75 backdrop-blur-[2px]"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsPhotoViewerOpen(false);
              }
            }}
          >
            <div className="h-full flex flex-col" onClick={(event) => event.stopPropagation()}>
              <div className="hidden sm:block border-b border-gray-300 bg-white px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[32px] sm:text-[38px] leading-[1.05] font-semibold text-[#1a1a1a] break-words pr-2">
                      {address}
                    </p>
                    <p className="text-sm text-gray-600 break-words pr-2">
                      {property.City}, {property.StateOrProvince} {property.PostalCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <CircleIconButton label="Save">☆</CircleIconButton>
                    <CircleIconButton label="Photos" active>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5 8.25 12l3 3 4.5-5.25 4.5 6.75" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z" />
                      </svg>
                    </CircleIconButton>
                    <CircleIconButton label="Map view">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.686 6-10a6 6 0 1 0-12 0c0 4.314 6 10 6 10Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                      </svg>
                    </CircleIconButton>
                    <CircleIconButton label="Email">✉</CircleIconButton>
                    <CircleIconButton label="Share">↗</CircleIconButton>
                    <CircleIconButton label="Close" onClick={() => setIsPhotoViewerOpen(false)}>
                      ✕
                    </CircleIconButton>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 px-4 pb-6 pt-4 sm:p-6 md:p-8 lg:p-10">
                <div className="h-full w-full flex items-center justify-center">
                  {activePhotoUrl && !activePhotoFailed ? (
                    <img
                      src={activePhotoUrl}
                      alt={`${address} enlarged photo`}
                      className="w-full h-[56vh] max-h-[640px] object-cover sm:w-auto sm:h-auto sm:max-h-full sm:max-w-full sm:object-contain"
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
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev + 1) % photoCount)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </>
                )}

                <div className="absolute right-6 bottom-8 sm:bottom-6">
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
