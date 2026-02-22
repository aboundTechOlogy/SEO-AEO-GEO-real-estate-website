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

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3 text-left">
      <p className="text-[34px] font-semibold leading-none text-[#1a1a1a] hidden md:block">{value}</p>
      <p className="text-[30px] font-semibold leading-none text-[#1a1a1a] md:hidden">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500 mt-1">{label}</p>
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
  "absolute inset-0 sm:inset-x-4 sm:top-20 sm:bottom-4 lg:inset-x-[5vw] lg:top-24 lg:bottom-6 border-0 sm:border sm:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)]";

function IconButton({
  label,
  children,
  active = false,
}: {
  label: string;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        active ? "bg-black text-white" : "bg-white text-[#1a1a1a] border border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function PropertyDetailPanel({ property, listingKey }: PropertyDetailPanelProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
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

  function markPhotoFailed(index: number) {
    setFailedPhotos((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
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
  const address = formatAddress(property);
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const estimatedPayment = estimateMonthlyPayment(price);
  const pricePerSqft = calculatePricePerSqft(price, property.LivingArea);

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
        className={`${PANEL_CONTAINER_CLASS} transition-all duration-300 ${
          isClosing ? "translate-y-3 scale-[0.985] opacity-0" : "translate-y-0 scale-100 opacity-100"
        }`}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full overflow-y-auto bg-[#f5f5f5]">
          <div className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur-sm px-4 sm:px-5 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 uppercase tracking-[0.14em] hidden sm:block">Property Details</p>
                <p className="text-[40px] leading-[1.02] font-semibold text-[#1a1a1a] truncate">{address}</p>
                <p className="text-sm text-gray-600 truncate">
                  {property.City}, {property.StateOrProvince} {property.PostalCode}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-12 h-12 rounded-full border border-gray-300 bg-white text-[#1a1a1a] hover:bg-gray-100 transition-colors"
                  aria-label="Close property panel"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="relative border-b border-black/10 bg-white">
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
              <IconButton label="Photos" active>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5 8.25 12l3 3 4.5-5.25 4.5 6.75" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z" />
                </svg>
              </IconButton>
              <IconButton label="Map view">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.686 6-10a6 6 0 1 0-12 0c0 4.314 6 10 6 10Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                </svg>
              </IconButton>
              <IconButton label="Virtual tour">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3c2.5 2.3 2.5 13.7 0 18M12 3c-2.5 2.3-2.5 13.7 0 18" />
                </svg>
              </IconButton>
            </div>

            <div className="relative">
              {activePhotoUrl && !activePhotoFailed ? (
                <img
                  src={activePhotoUrl}
                  alt={address}
                  className="w-full h-[42vh] min-h-[260px] max-h-[620px] object-cover"
                  onError={() => markPhotoFailed(activePhoto)}
                />
              ) : (
                <div className="w-full h-[42vh] min-h-[260px] max-h-[620px] flex items-center justify-center text-gray-500 text-sm bg-gray-100">
                  Photo unavailable
                </div>
              )}

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePhoto((prev) => (prev - 1 + photos.length) % photos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhoto((prev) => (prev + 1) % photos.length)}
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
                  {Math.min(activePhoto + 1, Math.max(photos.length, 1))} of {Math.max(photos.length, 1)}
                </span>
              </div>
            </div>

            {photos.length > 1 && (
              <div className="hidden sm:flex gap-2 overflow-x-auto px-4 py-3 border-t border-gray-200 bg-[#f8f8f8]">
                {photos.slice(0, 12).map((photo, index) => {
                  const failed = failedPhotos[index];
                  return (
                    <button
                      key={`${photo.MediaURL}-${index}`}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      className={`shrink-0 border bg-white ${
                        activePhoto === index ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {failed ? (
                        <div className="w-[86px] h-[58px] bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                          N/A
                        </div>
                      ) : (
                        <img
                          src={photo.MediaURL}
                          alt={`${address} photo ${index + 1}`}
                          className="w-[86px] h-[58px] object-cover"
                          onError={() => markPhotoFailed(index)}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 border-b border-black/10 bg-white">
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

          <div className="bg-white border-b border-black/10 px-4 py-4">
            <div className="flex items-end justify-between gap-4 pb-3 border-b border-gray-200">
              <p className="font-playfair text-5xl leading-none text-[#1a1a1a]">{formatCurrency(price)}</p>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Est. Payment</p>
                <p className="text-blue-600 text-[24px] font-semibold leading-none">{estimatedPayment || "--"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200 mt-1">
              <StatCell label="Beds" value={String(property.BedroomsTotal || 0)} />
              <StatCell label="Baths" value={String(bathsCount || 0)} />
              <StatCell label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
              <StatCell label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
            </div>
          </div>

          <div className="px-4 py-5 lg:px-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6 min-w-0">
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

                <div className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-300 pt-4">
                  The multiple listing information is provided by the Miami Association of Realtors from a copyrighted
                  compilation of listings. All information is deemed reliable but not guaranteed.
                </div>

                <a
                  href={`/property/${listingKey}/`}
                  className="inline-flex items-center justify-center w-full border border-gray-300 text-[#1a1a1a] px-4 py-3 rounded-full text-xs uppercase tracking-[0.12em] hover:bg-gray-100 transition-colors"
                >
                  View Full Details
                </a>
              </div>

              <aside className="hidden lg:block border border-gray-200 bg-white p-4 space-y-4 h-fit">
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
      </aside>
    </div>
  );
}
