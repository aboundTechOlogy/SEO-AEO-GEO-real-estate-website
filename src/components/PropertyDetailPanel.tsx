"use client";

import type { TouchEvent } from "react";
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
    <div className="border border-white/10 bg-neutral-900/40 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 mb-1">{label}</p>
      <p className="text-sm text-neutral-200">{value}</p>
    </div>
  );
}

export default function PropertyDetailPanel({ property, listingKey }: PropertyDetailPanelProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

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
    if (touchStartX !== null && touchCurrentX !== null && touchCurrentX - touchStartX > 80) {
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
        <div className="absolute inset-0 bg-black/60" />
        <aside
          className={`absolute inset-y-0 right-0 w-full sm:max-w-[600px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isClosing ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="h-full flex flex-col items-center justify-center px-8 text-center">
            <p className="text-neutral-300 text-lg mb-3">Property not found.</p>
            <button
              type="button"
              onClick={handleClose}
              className="border border-white/30 text-white px-5 py-2 text-sm rounded-full hover:bg-white/10 transition-colors"
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
  const pricePerSqft = calculatePricePerSqft(price, property.LivingArea);

  const activePhotoUrl = photos[activePhoto]?.MediaURL;
  const remarks = property.PublicRemarks || "No description provided.";
  const isLongDescription = remarks.length > 320;
  const description = showFullDescription ? remarks : `${remarks.slice(0, 320)}${isLongDescription ? "..." : ""}`;

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

  const daysOnMarket =
    property.DaysOnMarket !== null && property.DaysOnMarket !== undefined
      ? `${property.DaysOnMarket} Days on Market`
      : "Days on Market unavailable";

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
      <div className="absolute inset-0 bg-black/60" />

      <aside
        className={`absolute inset-y-0 right-0 w-full sm:max-w-[600px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-[0.15em]">Property Details</p>
              <p className="text-sm text-white truncate max-w-[360px]">{address}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-neutral-300 hover:text-white transition-colors"
              aria-label="Close property panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-5 space-y-7">
            <div className="space-y-3">
              <div className="relative bg-neutral-900 border border-white/10 overflow-hidden">
                {activePhotoUrl ? (
                  <img
                    src={activePhotoUrl}
                    alt={address}
                    className="w-full h-[280px] md:h-[320px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[280px] md:h-[320px] flex items-center justify-center text-neutral-500 text-sm">
                    No photo available
                  </div>
                )}

                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev - 1 + photos.length) % photos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/65 text-white hover:bg-black/85 transition-colors"
                      aria-label="Previous photo"
                    >
                      <span className="sr-only">Previous photo</span>
                      {"<"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhoto((prev) => (prev + 1) % photos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/65 text-white hover:bg-black/85 transition-colors"
                      aria-label="Next photo"
                    >
                      <span className="sr-only">Next photo</span>
                      {">"}
                    </button>
                  </>
                )}
              </div>

              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.slice(0, 8).map((photo, index) => (
                    <button
                      key={`${photo.MediaURL}-${index}`}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      className={`shrink-0 border ${
                        activePhoto === index ? "border-white" : "border-white/20"
                      }`}
                    >
                      <img src={photo.MediaURL} alt={address} className="w-16 h-12 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-playfair text-4xl text-white leading-none">{formatCurrency(price)}</p>
                <span className="px-2.5 py-1 rounded bg-white/10 border border-white/20 text-[11px] uppercase tracking-[0.12em] text-neutral-200">
                  {property.StandardStatus || "Active"}
                </span>
              </div>
              <p className="text-neutral-200 text-sm">{address}</p>
              <p className="text-neutral-400 text-sm">
                {property.City}, {property.StateOrProvince} {property.PostalCode}
              </p>
              <p className="text-neutral-400 text-xs uppercase tracking-[0.12em]">{daysOnMarket}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <DetailRow label="Beds" value={String(property.BedroomsTotal || 0)} />
              <DetailRow label="Baths" value={String(property.BathroomsTotalInteger || 0)} />
              <DetailRow
                label="Sq.Ft"
                value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"}
              />
              <DetailRow
                label="$ / Sq.Ft"
                value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"}
              />
            </div>

            <div>
              <h3 className="font-playfair text-2xl text-white mb-2">Description</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{description}</p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="mt-2 text-sm text-neutral-200 underline underline-offset-2 hover:text-white transition-colors"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            <div>
              <h3 className="font-playfair text-2xl text-white mb-3">Key Details</h3>
              <div className="grid grid-cols-2 gap-2">
                {detailItems.map(([label, value]) => (
                  <DetailRow key={label} label={label} value={value} />
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-neutral-900/40 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <img src="/andrew-headshot.png" alt="Andrew Whalen" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-white font-medium leading-none">Andrew Whalen</p>
                  <p className="text-neutral-400 text-xs">LoKation Real Estate</p>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <a href="tel:+13054559744" className="block text-neutral-200 hover:text-white transition-colors">
                  (305) 455-9744
                </a>
                <a href="mailto:Andrew@IamAndrewWhalen.com" className="block text-neutral-200 hover:text-white transition-colors">
                  Andrew@IamAndrewWhalen.com
                </a>
              </div>

              <PropertyInquiryForm listingKey={property.ListingKey} address={address} />
            </div>

            <a
              href={`/property/${listingKey}/`}
              className="inline-flex items-center justify-center w-full border border-white/30 text-white px-4 py-3 rounded-full text-sm uppercase tracking-[0.12em] hover:bg-white/10 transition-colors"
            >
              View Full Details
            </a>

            <div className="border-t border-white/10 pt-4 text-[11px] text-neutral-500 leading-relaxed">
              <p>
                The multiple listing information is provided by the Miami Association of Realtors from a copyrighted
                compilation of listings. All information is deemed reliable but not guaranteed.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
