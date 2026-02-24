"use client";

import type { ReactNode, TouchEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import type { BridgeIdxSearchResponse, BridgeMedia, BridgeProperty } from "@/lib/bridge";
import {
  buildSimilarListingSlots,
  buildIdxDetailSections,
  buildIdxLegalDisclosure,
  calculatePricePerSqft,
  formatAddress,
  formatCurrency,
  generatePropertySlug,
  getListingPhotos,
  type IdxDetailRow,
} from "@/lib/property-utils";
import { APIProvider, Map as GoogleMap, Marker, useMap } from "@vis.gl/react-google-maps";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import MortgageCalculatorModal from "@/components/MortgageCalculatorModal";
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
  IconDollar,
  IconHouseSale,
  IconRuler,
  IconSearchFlat,
  IconTimeClock,
  IconVirtual360,
  IconCamera,
  IconLocation,
  IconStreetView,
} from "@/components/IdxIcons";

interface PropertyDetailPanelProps {
  property: BridgeProperty | null;
  listingKey: string;
}

type MediaTab = "photos" | "map" | "street-view";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

function SectionTitleStrip({ title }: { title: string }) {
  return (
    <div className="bg-[#f5f5f5] border-y border-gray-200 px-[15px] py-[10px]">
      <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a]">{title}</h3>
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <li className="grid gap-1.5 border-b border-gray-200 py-[10px] last:border-b-0 sm:grid-cols-[230px_minmax(0,1fr)]">
      <p className="text-[13px] text-gray-600 flex items-center gap-2">
        {icon && <span className="w-4 h-4 shrink-0 text-gray-500">{icon}</span>}
        <span>{label}</span>
      </p>
      <p className="text-[14px] text-[#1a1a1a] leading-[1.5]">{value}</p>
    </li>
  );
}

export function EstPaymentLink({ label, listPrice }: { label: string; listPrice: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="font-semibold text-[#2563eb] underline underline-offset-2 hover:text-blue-700 transition-colors">
        {label}
      </button>
      <MortgageCalculatorModal isOpen={isOpen} onClose={() => setIsOpen(false)} listPrice={listPrice} />
    </>
  );
}

export function DetailSection({
  title,
  rows,
  iconMap,
}: {
  title: string;
  rows: IdxDetailRow[];
  iconMap?: Record<string, ReactNode>;
}) {
  if (rows.length === 0) return null;
  return (
    <section className="bg-white border-b border-gray-200">
      <SectionTitleStrip title={title} />
      <div className="px-[15px] py-[12px]">
        <ul>
        {rows.map((row) => (
            <DetailRow key={row.label} label={row.label} value={row.value} icon={iconMap?.[row.label]} />
        ))}
        </ul>
      </div>
    </section>
  );
}

export function AmenitiesSection({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <section className="bg-white border-b border-gray-200">
      <SectionTitleStrip title="Amenities" />
      <ul className="px-[15px] py-[12px] grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[14px] text-gray-700 leading-[1.5]">
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

export function LocationSection({
  latitude,
  longitude,
  address,
  addressShort,
  addressLong,
}: {
  latitude: number;
  longitude: number;
  address: string;
  addressShort?: string;
  addressLong?: string;
}) {
  const hasCoords =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) > 0 &&
    Math.abs(longitude) > 0;

  if (!hasCoords) {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <section className="bg-white border-b border-gray-200">
      {/* Address header — matches Chad's ms-sf-title -flex with sf-icon-map */}
      <div className="px-[15px] py-[12px] flex items-start gap-3">
        <IconLocation className="w-[22px] h-[22px] shrink-0 text-[#1a1a1a] mt-[2px]" />
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-[#1a1a1a] leading-tight">{addressShort || address}</p>
          {addressLong && <p className="text-[13px] text-gray-500 leading-tight mt-[2px]">{addressLong}</p>}
        </div>
      </div>
      <div className="relative w-full aspect-[2/1] overflow-hidden bg-gray-100">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              defaultCenter={{ lat: latitude, lng: longitude }}
              defaultZoom={18}
              style={{ width: "100%", height: "100%" }}
              gestureHandling="cooperative"
              mapTypeControl={false}
              streetViewControl={true}
              fullscreenControl={false}
              rotateControl={false}
              zoomControl={false}
              scaleControl={false}
            >
              <Marker position={{ lat: latitude, lng: longitude }} />
              <DetailMapControls />
            </GoogleMap>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            Map unavailable
          </div>
        )}
      </div>
    </section>
  );
}

export function SimilarListingsSection({
  listingKey,
  city,
  listings,
}: {
  listingKey: string;
  city: string;
  listings: BridgeIdxSearchResponse | null;
}) {
  const { slots, activeCount } = buildSimilarListingSlots(listings?.listings || [], listingKey, 4);
  const isEmptyFeed = activeCount === 0;

  return (
    <section className="bg-white border-b border-gray-200">
      <SectionTitleStrip title="Similar Properties For Sale" />
      <div className="px-[15px] py-[12px]">
        <p className="text-[14px] text-gray-600 mb-3">
          {isEmptyFeed
            ? `No active similar listings are available in ${city || "this area"} right now.`
            : `Explore more properties in ${city || "this area"}.`}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {slots.map((slot) =>
            slot.href ? (
              <Link
                key={slot.key}
                href={slot.href}
                className="block border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                {slot.imageUrl ? (
                  <img src={slot.imageUrl} alt={slot.addressLine} className="w-full aspect-[4/3] object-cover bg-gray-100" />
                ) : (
                  <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-[12px] text-gray-500">
                    Photo unavailable
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[14px] font-semibold leading-tight text-[#1a1a1a]">{slot.priceLabel}</p>
                  <p className="text-[12px] text-gray-600 mt-1 line-clamp-2">{slot.addressLine}</p>
                  <p className="text-[12px] text-gray-500 mt-1">{slot.detailLine}</p>
                </div>
              </Link>
            ) : (
              <div
                key={slot.key}
                className="border border-dashed border-gray-300 bg-[#fafafa] aspect-[4/3] flex items-center justify-center text-center px-3"
              >
                <p className="text-[12px] text-gray-500">{slot.addressLine}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Custom map controls matching Chad Carroll's listing detail page ── */

const CTRL = "w-[40px] h-[40px] bg-white flex items-center justify-center cursor-pointer text-[#333] hover:bg-gray-50 transition-colors";
const CTRL_SHADOW = "shadow-[0_1px_4px_rgba(0,0,0,0.3)]";

function DetailMapControls({ showFullscreen = true }: { showFullscreen?: boolean } = {}) {
  const map = useMap();
  const [isSatellite, setIsSatellite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  return (
    <div className={`absolute right-[10px] ${showFullscreen ? "top-[10px]" : "top-[60px]"} z-[5] flex flex-col`} style={{ pointerEvents: "auto" }}>
      {showFullscreen && (
        <>
          {/* 1. Fullscreen / Expand (sf-icon-fullscreen) */}
          <button type="button" aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => {
              const container = map?.getDiv()?.parentElement;
              if (!container) return;
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                container.requestFullscreen();
              }
            }}
            className={`${CTRL} ${CTRL_SHADOW} rounded-[4px] border border-[#e6e6e6]`}>
            {isFullscreen ? (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
          <div className="h-[6px]" />
        </>
      )}

      {/* 2. Zoom in (sf-icon-zoom) */}
      <button type="button" aria-label="Zoom in" title="Zoom in"
        onClick={() => map?.setZoom((map.getZoom() || 15) + 1)}
        className={`${CTRL} ${CTRL_SHADOW} rounded-t-[4px] border border-[#e6e6e6]`}>
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      {/* 3. Zoom out (sf-icon-min) */}
      <button type="button" aria-label="Zoom out" title="Zoom out"
        onClick={() => map?.setZoom((map.getZoom() || 15) - 1)}
        className={`${CTRL} ${CTRL_SHADOW} border-x border-b border-[#e6e6e6]`}>
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      {/* 4. Satellite toggle (sf-icon-satellite / sf-icon-guide) */}
      <button type="button"
        aria-label={isSatellite ? "Switch to map view" : "Switch to satellite view"}
        title={isSatellite ? "Map view" : "Satellite view"}
        onClick={() => {
          if (!map) return;
          const next = !isSatellite;
          setIsSatellite(next);
          map.setMapTypeId(next ? "satellite" : "roadmap");
        }}
        className={`${CTRL} ${CTRL_SHADOW} border-x border-b border-[#e6e6e6] rounded-b-[4px]`}>
        {isSatellite ? (
          <svg className="w-[20px] h-[20px]" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M672 256l-320-128-352 128v768l352-128 320 128 352-128v-768l-352 128zM384 209.728l256 102.4v630.144l-256-102.4v-630.144zM64 300.832l256-93.088v631.808l-256 93.088v-631.808zM960 851.168l-256 93.088v-631.808l256-93.088v631.808z" />
          </svg>
        ) : (
          <svg className="w-[20px] h-[20px]" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M128 533.334h-42.667c0.17 259.137 210.196 469.163 469.316 469.333h0.017v-42.667c-235.486-0.388-426.279-191.182-426.667-426.63v-0.037zM298.667 533.334h-42.667c0.194 164.871 133.796 298.473 298.648 298.667h0.018v-42.667c-141.336-0.121-255.879-114.664-256-255.988v-0.012zM938.667 759.041l-192-192-42.667 42.667-55.040-55.040 85.333-85.333-115.627-115.627-85.333 85.333-55.040-55.040 42.667-42.667-192-192h-17.92l-106.667 106.667 200.96 200.96 42.667-42.667 55.040 55.040-85.333 85.333 115.627 115.627 85.333-85.333 55.040 55.040-42.667 42.667 200.96 200.96 106.667-106.667z" />
          </svg>
        )}
      </button>

    </div>
  );
}

/** Embedded Google Street View Panorama using raw Maps JS API */
function EmbeddedStreetView({ latitude, longitude }: { latitude: number; longitude: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof google === "undefined") return;
    const pano = new google.maps.StreetViewPanorama(containerRef.current, {
      position: { lat: latitude, lng: longitude },
      pov: { heading: 34, pitch: 10 },
      zoom: 1,
      addressControl: false,
      linksControl: true,
      panControl: true,
      enableCloseButton: false,
      zoomControl: false,
      fullscreenControl: false,
    });
    panoRef.current = pano;

    /* Add custom zoom +/- controls */
    const controlDiv = document.createElement("div");
    controlDiv.className = "gm-sv-custom-controls";
    controlDiv.style.cssText = "display:flex;flex-direction:column;margin:56px 10px 0 0;";

    const btnStyle = "width:40px;height:40px;background:#fff;border:1px solid #e6e6e6;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#333;font-size:18px;box-shadow:0 1px 4px rgba(0,0,0,0.3);";

    const zoomIn = document.createElement("button");
    zoomIn.textContent = "+";
    zoomIn.style.cssText = btnStyle + "border-radius:4px 4px 0 0;";
    zoomIn.title = "Zoom in";
    zoomIn.onclick = () => pano.setZoom(Math.min((pano.getZoom() ?? 1) + 1, 5));

    const zoomOut = document.createElement("button");
    zoomOut.textContent = "\u2212";
    zoomOut.style.cssText = btnStyle + "border-radius:0 0 4px 4px;border-top:none;";
    zoomOut.title = "Zoom out";
    zoomOut.onclick = () => pano.setZoom(Math.max((pano.getZoom() ?? 1) - 1, 0));

    controlDiv.appendChild(zoomIn);
    controlDiv.appendChild(zoomOut);
    pano.controls[google.maps.ControlPosition.RIGHT_TOP]?.push(controlDiv);

    return () => { panoRef.current = null; };
  }, [latitude, longitude]);

  return (
    <div data-media-sv className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export function PropertyMediaTabs({
  photos,
  address,
  latitude,
  longitude,
  virtualTourUrl,
  singleHero = false,
  onExpandPhoto,
}: {
  photos: BridgeMedia[];
  address: string;
  latitude: number;
  longitude: number;
  virtualTourUrl?: string | null;
  /** When true, shows a single full-width hero image instead of 3-col grid on desktop (for standalone page) */
  singleHero?: boolean;
  /** Called when user clicks expand — parent renders the full-screen viewer */
  onExpandPhoto?: (photoIndex: number) => void;
}) {
  const [activeMediaTab, setActiveMediaTab] = useState<MediaTab>("photos");
  const [activePhoto, setActivePhoto] = useState(0);
  const [failedPhotos, setFailedPhotos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setActiveMediaTab("photos");
    setActivePhoto(0);
    setFailedPhotos({});
  }, [photos, address]);

  const photoCount = photos.length;
  const hasDisplayablePhotos = photos.some((photo, index) => Boolean(photo?.MediaURL) && !failedPhotos[index]);
  const hasCoords =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) > 0 &&
    Math.abs(longitude) > 0;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  const activePhotoUrl = photos[activePhoto]?.MediaURL;
  const activePhotoFailed = failedPhotos[activePhoto];
  const desktopIndexes =
    photoCount > 0
      ? [activePhoto, (activePhoto + 1) % photoCount, (activePhoto + 2) % photoCount]
      : [];

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

  return (
    <div className="relative border-b border-black/10 bg-white">
      <div className="absolute left-[15px] top-[15px] z-20 flex items-center gap-[8px]">
        <RectTabButton label="Photos" icon={<IconCamera className="w-[18px] h-[18px]" />} active={activeMediaTab === "photos"} onClick={() => setActiveMediaTab("photos")} />
        <RectTabButton label="Map View" icon={<IconLocation className="w-[18px] h-[18px]" />} active={activeMediaTab === "map"} onClick={() => setActiveMediaTab("map")} />
        {virtualTourUrl && (
          <RectTabButton
            label="Virtual Tour"
            icon={<IconVirtual360 className="w-[18px] h-[18px]" />}
            onClick={() => window.open(virtualTourUrl, "_blank", "noopener,noreferrer")}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (activeMediaTab === "photos") {
            if (hasDisplayablePhotos && onExpandPhoto) onExpandPhoto(activePhoto);
          } else if (activeMediaTab === "map") {
            const mapContainer = document.querySelector<HTMLElement>("[data-media-map]");
            if (mapContainer) mapContainer.requestFullscreen();
          } else if (activeMediaTab === "street-view") {
            const svContainer = document.querySelector<HTMLElement>("[data-media-sv]");
            if (svContainer) {
              if (document.fullscreenElement) document.exitFullscreen();
              else svContainer.requestFullscreen();
            }
          }
        }}
        className={`hidden lg:flex absolute right-[15px] top-[15px] z-20 w-[35px] h-[35px] rounded-[6px] items-center justify-center transition-colors ${
          activeMediaTab === "photos"
            ? "bg-black text-white hover:bg-black/90"
            : "bg-white text-[#333] border border-[#e6e6e6] shadow-[0_1px_4px_rgba(0,0,0,0.3)] hover:bg-gray-50"
        } ${activeMediaTab === "photos" && !hasDisplayablePhotos ? "opacity-40 cursor-not-allowed" : ""}`}
        aria-label={activeMediaTab === "photos" ? "Open full photo viewer" : "Fullscreen"}
        disabled={activeMediaTab === "photos" && !hasDisplayablePhotos}
      >
        <IconExpand className="w-[18px] h-[18px]" />
      </button>

      {activeMediaTab === "photos" && (
        <>
          {/* Mobile: always single hero */}
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

          {/* Desktop: single hero (standalone page) */}
          {singleHero && (
            <div className="relative hidden lg:block h-[450px] overflow-hidden">
              {activePhotoUrl && !activePhotoFailed ? (
                <img
                  src={activePhotoUrl}
                  alt={address}
                  className="w-full h-full object-cover"
                  onError={() => markPhotoFailed(activePhoto)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-100">
                  Photo unavailable
                </div>
              )}
            </div>
          )}

          {/* Desktop: 3-col grid (overlay only) */}
          {!singleHero && (
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
                        onExpandPhoto?.(photoIndex);
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
          )}

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

          <div className="absolute left-[15px] bottom-[15px] z-20">
            <button
              type="button"
              onClick={() => hasCoords && setActiveMediaTab("street-view")}
              disabled={!hasCoords}
              aria-label="Street View"
              className="w-[35px] h-[35px] rounded-full lg:w-auto lg:h-auto lg:min-h-[35px] lg:px-[15px] lg:py-[6px] lg:rounded-[6px] lg:gap-[6px] text-[14px] font-semibold border border-black bg-white text-[#1a1a1a] hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-default"
            >
              <IconStreetView className="w-[18px] h-[18px]" />
              <span className="hidden lg:inline">Street View</span>
            </button>
          </div>

          <div className="absolute right-3 bottom-3">
            <span className="rounded-md bg-black text-white text-xs px-2.5 py-1.5">
              {Math.min(activePhoto + 1, Math.max(photoCount, 1))} of {Math.max(photoCount, 1)}
            </span>
          </div>
        </>
      )}

      {activeMediaTab === "map" && (
        <div data-media-map className="relative w-full aspect-video lg:h-[450px] lg:aspect-auto bg-gray-100">
          {hasCoords && apiKey ? (
            <APIProvider apiKey={apiKey}>
              <GoogleMap
                defaultCenter={{ lat: latitude, lng: longitude }}
                defaultZoom={15}
                style={{ width: "100%", height: "100%" }}
                gestureHandling="greedy"
                mapTypeControl={false}
                streetViewControl={true}
                fullscreenControl={false}
                rotateControl={false}
                zoomControl={false}
                scaleControl={false}
              >
                <Marker position={{ lat: latitude, lng: longitude }} />
                <DetailMapControls showFullscreen={false} />
              </GoogleMap>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Map unavailable
            </div>
          )}

          <div className="absolute left-[15px] bottom-[15px] z-20">
            <button
              type="button"
              onClick={() => hasCoords && setActiveMediaTab("street-view")}
              disabled={!hasCoords}
              aria-label="Street View"
              className="w-[35px] h-[35px] rounded-full lg:w-auto lg:h-auto lg:min-h-[35px] lg:px-[15px] lg:py-[6px] lg:rounded-[6px] lg:gap-[6px] text-[14px] font-semibold border border-black bg-white text-[#1a1a1a] hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-default"
            >
              <IconStreetView className="w-[18px] h-[18px]" />
              <span className="hidden lg:inline">Street View</span>
            </button>
          </div>
        </div>
      )}

      {activeMediaTab === "street-view" && (
        <div className="relative w-full aspect-video lg:h-[450px] lg:aspect-auto bg-gray-100">
          {hasCoords && apiKey ? (
            <APIProvider apiKey={apiKey}>
              <EmbeddedStreetView latitude={latitude} longitude={longitude} />
            </APIProvider>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Street View unavailable
            </div>
          )}

          <div className="absolute left-[15px] bottom-[15px] z-20">
            <button
              type="button"
              onClick={() => setActiveMediaTab("street-view")}
              aria-label="Street View"
              className="w-[35px] h-[35px] rounded-full lg:w-auto lg:h-auto lg:min-h-[35px] lg:px-[15px] lg:py-[6px] lg:rounded-[6px] lg:gap-[6px] text-[14px] font-semibold border border-black bg-black text-white transition-all duration-300 flex items-center justify-center"
            >
              <IconStreetView className="w-[18px] h-[18px]" />
              <span className="hidden lg:inline">Street View</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/** Full-screen photo viewer — rendered at dialog root (outside <aside>) so `fixed` works correctly */
function FullScreenPhotoViewer({
  photos,
  startIndex,
  address,
  cityLine,
  onClose,
  onSave,
  onShare,
  isSaved,
  latitude,
  longitude,
  listingKey,
}: {
  photos: BridgeMedia[];
  startIndex: number;
  address: string;
  cityLine: string;
  onClose: () => void;
  onSave: () => void;
  onShare: () => void;
  isSaved: boolean;
  latitude?: number;
  longitude?: number;
  listingKey?: string;
}) {
  const [activePhoto, setActivePhoto] = useState(startIndex);
  const [failedPhotos, setFailedPhotos] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<"photos" | "map">("photos");
  const [showContactForm, setShowContactForm] = useState(false);
  const photoCount = photos.length;
  const url = photos[activePhoto]?.MediaURL;
  const failed = failedPhotos[activePhoto];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showContactForm) {
        if (e.key === "Escape") setShowContactForm(false);
        return;
      }
      if (e.key === "Escape") onClose();
      if (viewMode === "photos") {
        if (e.key === "ArrowLeft") setActivePhoto((p) => (p - 1 + photoCount) % photoCount);
        if (e.key === "ArrowRight") setActivePhoto((p) => (p + 1) % photoCount);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photoCount, viewMode, showContactForm]);

  const gmapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-black">
      {/* Header bar — matches Carroll's expand header */}
      <div className="shrink-0 bg-white border-b border-black/10">
        <div className="h-[70px] px-[15px] py-[10px] flex items-center justify-between gap-[10px]">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[20px] leading-[1.1] font-semibold text-[#1a1a1a]">{address}</p>
            <p className="truncate text-[13px] leading-[1.1] text-gray-600">{cityLine}</p>
          </div>
          <div className="flex items-center gap-[10px] shrink-0">
            <CircleIconButton label={isSaved ? "Unsave" : "Save"} onClick={onSave}>
              <IconLove className="w-5 h-5" active={isSaved} />
            </CircleIconButton>
            <CircleIconButton label="Photos" active={viewMode === "photos"} onClick={() => setViewMode("photos")}>
              <IconCamera className="w-5 h-5" />
            </CircleIconButton>
            <CircleIconButton label="Map" active={viewMode === "map"} onClick={() => setViewMode("map")}>
              <IconLocation className="w-5 h-5" />
            </CircleIconButton>
            <CircleIconButton label="Contact" onClick={() => setShowContactForm(true)}>
              <IconEnvelope className="w-5 h-5" />
            </CircleIconButton>
            <CircleIconButton label="Share" onClick={onShare}>
              <IconShared className="w-5 h-5" />
            </CircleIconButton>
            <CircleIconButton label="Close" onClick={onClose}>
              <IconClose className="w-5 h-5" />
            </CircleIconButton>
          </div>
        </div>
      </div>

      {/* Content — Photos or Map */}
      <div className="relative flex-1 min-h-0 overflow-hidden mx-[60px] mt-[6px]">
        {viewMode === "photos" ? (
          <>
            {url && !failed ? (
              <img
                src={url}
                alt={`${address} photo ${activePhoto + 1}`}
                className="w-full"
                onError={() => setFailedPhotos((prev) => ({ ...prev, [activePhoto]: true }))}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Photo unavailable</div>
            )}

            {photoCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActivePhoto((p) => (p - 1 + photoCount) % photoCount)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Previous photo"
                >
                  <IconChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto((p) => (p + 1) % photoCount)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Next photo"
                >
                  <IconChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </>
        ) : (
          /* Map view */
          latitude && longitude && gmapsKey ? (
            <APIProvider apiKey={gmapsKey}>
              <GoogleMap
                defaultCenter={{ lat: latitude, lng: longitude }}
                defaultZoom={16}
                mapId="expand-map"
                className="w-full h-full"
                gestureHandling="greedy"
              >
                <Marker position={{ lat: latitude, lng: longitude }} />
              </GoogleMap>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Map unavailable</div>
          )
        )}
      </div>

      {/* Contact form popup */}
      {showContactForm && (
        <div className="fixed inset-0 z-[310] flex items-center justify-center" onClick={() => setShowContactForm(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative z-10 bg-white rounded-lg shadow-2xl w-full max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-[20px] font-semibold text-[#1a1a1a]">Contact Agent</h2>
              <button type="button" onClick={() => setShowContactForm(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Close">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 px-6 pb-4 border-b border-gray-200">
              <img src="/andrew-headshot.png" alt="Andrew Whalen" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-[#1a1a1a]">Andrew Whalen</p>
                <a href="tel:+13054559744" className="text-sm text-[#2563eb] hover:underline">Ph. (305) 455-9744</a>
              </div>
            </div>
            <div className="px-6 py-4">
              <PropertyInquiryForm listingKey={listingKey || ""} address={address} theme="light" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Client wrapper for standalone page — manages expand state since the page is a server component */
export function PropertyMediaWithExpand({
  photos,
  address,
  cityLine,
  latitude,
  longitude,
  virtualTourUrl,
  singleHero = false,
}: {
  photos: BridgeMedia[];
  address: string;
  cityLine: string;
  latitude: number;
  longitude: number;
  virtualTourUrl?: string | null;
  singleHero?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [startPhoto, setStartPhoto] = useState(0);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: address, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  return (
    <>
      <PropertyMediaTabs
        photos={photos}
        address={address}
        latitude={latitude}
        longitude={longitude}
        virtualTourUrl={virtualTourUrl}
        singleHero={singleHero}
        onExpandPhoto={(idx) => { setStartPhoto(idx); setIsOpen(true); }}
      />
      {isOpen && (
        <FullScreenPhotoViewer
          photos={photos}
          startIndex={startPhoto}
          address={address}
          cityLine={cityLine}
          onClose={() => setIsOpen(false)}
          onSave={() => {}}
          onShare={handleShare}
          isSaved={false}
          latitude={latitude}
          longitude={longitude}
        />
      )}
    </>
  );
}

function StatMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-[10px] lg:px-[12px] py-[15px] flex-1 text-center uppercase text-gray-500">
      <p className="text-[17px] lg:text-[24px] leading-none font-semibold text-[#1a1a1a]">{value}</p>
      <p className="mt-[5px] text-[11px] lg:text-[12px] leading-none">{label}</p>
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
  "relative w-full md:w-[96%] md:max-w-[1300px] border-0 md:border md:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)]";

export const BASIC_INFO_ICON_MAP: Record<string, ReactNode> = {
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
  icon,
  active,
  disabled = false,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        /* mobile/tablet: icon-only circle */
        "w-[35px] h-[35px] rounded-full text-[14px] font-semibold transition-all duration-300 flex items-center justify-center shadow-sm",
        /* desktop: pill with text */
        "lg:w-auto lg:h-auto lg:min-h-[35px] lg:px-[15px] lg:py-[6px] lg:rounded-[6px] lg:gap-[6px]",
        active
          ? "bg-black text-white"
          : "bg-white text-[#1a1a1a] hover:bg-black hover:text-white",
        disabled ? "opacity-50 cursor-default" : "",
      ].join(" ")}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export default function PropertyDetailPanel({ property, listingKey }: PropertyDetailPanelProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isMortgageCalcOpen, setIsMortgageCalcOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [viewerStartPhoto, setViewerStartPhoto] = useState(0);
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

  // useSWR must be called unconditionally (React Rules of Hooks) — use null key to skip fetch when property is absent
  const similarQuery = property?.City
    ? `/api/search?status=Active&top=8&orderby=ListPrice%20desc&q=${encodeURIComponent(property.City)}`
    : property
      ? `/api/search?status=Active&top=8&orderby=ListPrice%20desc`
      : null;
  const { data: similarListings } = useSWR<BridgeIdxSearchResponse>(
    similarQuery,
    fetchJson,
    { revalidateOnFocus: false },
  );

  if (!property) {
    return (
      <div
        className={`fixed inset-0 z-[150] flex items-start justify-center transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[7px] pointer-events-none" />

          <aside
            className={`${PANEL_CONTAINER_CLASS} md:mt-[15px] min-h-screen md:min-h-[calc(100vh-30px)] transition-all duration-300 ${
              isClosing ? "translate-y-3 scale-[0.985] opacity-0" : "translate-y-0 scale-100 opacity-100"
            }`}
          >
            <div className="min-h-[inherit] flex flex-col items-center justify-center px-8 text-center bg-white">
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

  const details = buildIdxDetailSections(property);
  const legal = buildIdxLegalDisclosure(property);
  const remarks = details.description;

  const bathsCount =
    property.BathroomsTotalInteger ??
    (property.BathroomsFull || property.BathroomsHalf
      ? Number((property.BathroomsFull + property.BathroomsHalf * 0.5).toFixed(1))
      : 0);

  const halfBathValue = property.BathroomsHalf ? String(property.BathroomsHalf) : "--";

  const lat = property.Latitude;
  const lng = property.Longitude;

  const propertySlug = property ? generatePropertySlug(property) : listingKey;
  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/property/${propertySlug}/`
      : `/property/${propertySlug}/`;

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

  function openCanonicalDetailsPage() {
    window.location.assign(`/property/${propertySlug}/`);
  }

  return (
    <div
      className={`fixed inset-0 z-[150] overflow-y-auto flex items-start justify-center bg-black/80 backdrop-blur-[7px] transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Property details panel"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >

        <aside
          className={`${PANEL_CONTAINER_CLASS} transition-all duration-300 ${
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
                <CircleIconButton label="Open detail page" onClick={() => window.open(canonicalUrl, "_blank", "noopener,noreferrer")}>
                  <IconOpen className="w-5 h-5" />
                </CircleIconButton>
                <CircleIconButton label="Close" onClick={handleClose}>
                  <IconClose className="w-5 h-5" />
                </CircleIconButton>
              </div>
            </div>
          </div>

          <PropertyMediaTabs photos={photos} address={address} latitude={lat} longitude={lng} virtualTourUrl={property.VirtualTourURLUnbranded} onExpandPhoto={(idx) => { setViewerStartPhoto(idx); setIsPhotoViewerOpen(true); }} />

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
                  {/* Desktop: single-row grid (lg+) */}
                  <div className="hidden lg:flex items-stretch">
                    <div className="px-[15px] py-[15px] flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[24px] leading-none font-semibold text-[#1a1a1a]">{formatCurrency(price)}</p>
                        {property.OriginalListPrice != null && property.OriginalListPrice !== price && (() => {
                          const pct = Math.abs(((price - property.OriginalListPrice) / property.OriginalListPrice) * 100);
                          const isReduced = price < property.OriginalListPrice;
                          return (
                            <span className={`text-[13px] font-bold ${isReduced ? "text-green-600" : "text-red-500"}`}>
                              {isReduced ? "↓" : "↑"} {pct.toFixed(2)}%
                            </span>
                          );
                        })()}
                      </div>
                      <p className="mt-[5px] text-[12px] leading-none text-gray-500">
                        Est. Payment {estimatedPayment ? (
                          <button type="button" onClick={() => setIsMortgageCalcOpen(true)} className="font-semibold text-[#2563eb] underline underline-offset-2 hover:text-blue-700 transition-colors">
                            {estimatedPayment}/mo
                          </button>
                        ) : "--"}
                      </p>
                    </div>
                    <StatMetric label="Beds" value={String(property.BedroomsTotal || 0)} />
                    <StatMetric label="Baths" value={String(bathsCount || 0)} />
                    <StatMetric label="Half Bath" value={halfBathValue} />
                    <StatMetric label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
                    <StatMetric label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
                  </div>

                  {/* Mobile/Tablet: two-row layout (below lg) */}
                  <div className="lg:hidden">
                    <div className="flex items-center justify-between px-[15px] py-[10px]">
                      <div className="flex items-center gap-2">
                        <p className="text-[22px] leading-none font-semibold text-[#1a1a1a]">{formatCurrency(price)}</p>
                        {property.OriginalListPrice != null && property.OriginalListPrice !== price && (() => {
                          const pct = Math.abs(((price - property.OriginalListPrice) / property.OriginalListPrice) * 100);
                          const isReduced = price < property.OriginalListPrice;
                          return (
                            <span className={`text-[13px] font-bold ${isReduced ? "text-green-600" : "text-red-500"}`}>
                              {isReduced ? "↓" : "↑"} {pct.toFixed(2)}%
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-[12px] leading-none text-gray-500">
                        Est. Payment {estimatedPayment ? (
                          <button type="button" onClick={() => setIsMortgageCalcOpen(true)} className="font-semibold text-[#2563eb] underline underline-offset-2 hover:text-blue-700 transition-colors">
                            {estimatedPayment}/mo
                          </button>
                        ) : "--"}
                      </p>
                    </div>
                    <div className="grid grid-cols-4">
                      <StatMetric label="Beds" value={String(property.BedroomsTotal || 0)} />
                      <StatMetric label="Baths" value={String(bathsCount || 0)} />
                      <StatMetric label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
                      <StatMetric label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
                    </div>
                  </div>
                </div>

                <section className="bg-white border-b border-gray-200">
                  <SectionTitleStrip title="Description" />
                  <div className="px-[15px] py-[12px]">
                    <p className="text-[14px] leading-[1.6] text-gray-700">{remarks}</p>
                  </div>
                </section>

                <DetailSection title="Basic Information" rows={details.basicInformationRows} iconMap={BASIC_INFO_ICON_MAP} />
                <AmenitiesSection amenities={details.amenities} />
                <DetailSection title="Exterior Features" rows={details.exteriorFeatureRows} />
                <DetailSection title="Interior Features" rows={details.interiorFeatureRows} />
                <DetailSection title="Property Features" rows={details.propertyFeatureRows} />
                <LocationSection
                  latitude={lat}
                  longitude={lng}
                  address={address}
                  addressShort={[property.StreetNumber, property.StreetName].filter(Boolean).join(" ") || address}
                  addressLong={`${property.City || ""}, ${property.StateOrProvince || ""} ${property.PostalCode || ""}`}
                />
                <SimilarListingsSection
                  listingKey={listingKey}
                  city={property.City}
                  listings={similarListings || null}
                />

                <section className="bg-[#f5f5f5] border-b border-gray-200 px-[15px] py-[20px] text-[11px] text-gray-500 leading-[1.6] space-y-2">
                  {legal.courtesyLine && <p>{legal.courtesyLine}</p>}
                  <p>{legal.disclaimer}</p>
                </section>
              </div>

              <aside className="hidden lg:block p-[15px] self-stretch">
                <div className="border border-gray-200 bg-white p-[15px] space-y-[15px] sticky top-[85px]">
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

        </aside>

      <MortgageCalculatorModal
        isOpen={isMortgageCalcOpen}
        onClose={() => setIsMortgageCalcOpen(false)}
        listPrice={price}
      />

      {isPhotoViewerOpen && (
        <FullScreenPhotoViewer
          photos={photos}
          startIndex={viewerStartPhoto}
          address={address}
          cityLine={`${property.City}, ${property.StateOrProvince} ${property.PostalCode}`}
          onClose={() => setIsPhotoViewerOpen(false)}
          onSave={toggleSaved}
          onShare={shareListing}
          isSaved={isSaved}
          latitude={lat}
          longitude={lng}
          listingKey={listingKey}
        />
      )}
    </div>
  );
}
