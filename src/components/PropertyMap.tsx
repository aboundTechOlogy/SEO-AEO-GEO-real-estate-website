"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { APIProvider, AdvancedMarker, ControlPosition, Map, useMap } from "@vis.gl/react-google-maps";
import MapDrawControl, { type DrawCoordinate } from "@/components/MapDrawControl";
import MapInfoCard from "@/components/MapInfoCard";

interface PropertyMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    price?: number;
    listingKey?: string;
    label?: string;
  }>;
  className?: string;
  interactive?: boolean;
  onClick?: (listingKey: string) => void;
  onDrawBounds?: (coords: DrawCoordinate[] | null) => void;
  hoveredListingId?: string | null;
  selectedListingId?: string | null;
  onMarkerHover?: (listingKey: string | null) => void;
  markerCount?: number;
  totalCount?: number;
  onOpenOverlay?: (listingKey: string) => void;
  savedListingKeys?: Set<string>;
  onToggleSave?: (listingKey: string) => void;
  /** Set when mouse is over a result card — includes coordinates for InfoCard positioning. */
  hoveredResultCard?: { listingKey: string; lat: number; lng: number } | null;
  /** Called when the InfoCard is dismissed (X click, hover end, etc.) so parent can clear highlight. */
  onInfoCardClose?: () => void;
  /** Called when the map viewport changes — reports SW/NE bounds. */
  onViewportChange?: (bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => void;
}

/** Renders InfoCard as a portal into the map container, clamped to stay fully visible. */
function InfoCardOverlay({
  marker,
  onClose,
  onOpenOverlay,
  savedListingKeys,
  onToggleSave,
  containerEl,
}: {
  marker: { listingKey: string; lat: number; lng: number };
  onClose: () => void;
  onOpenOverlay?: (key: string) => void;
  savedListingKeys?: Set<string>;
  onToggleSave?: (key: string) => void;
  containerEl: HTMLDivElement;
}) {
  const map = useMap();
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // Create OverlayView for projection access
  useEffect(() => {
    if (!map) return;
    const ov = new google.maps.OverlayView();
    ov.draw = () => {};
    ov.onAdd = () => {};
    ov.onRemove = () => {};
    ov.setMap(map);
    overlayRef.current = ov;
    return () => {
      ov.setMap(null);
      overlayRef.current = null;
    };
  }, [map]);

  const reposition = useCallback(() => {
    const proj = overlayRef.current?.getProjection();
    if (!proj) return;

    const px = proj.fromLatLngToContainerPixel(
      new google.maps.LatLng(marker.lat, marker.lng)
    );
    if (!px) return;

    const card = cardRef.current;
    const cW = containerEl.offsetWidth;
    const cH = containerEl.offsetHeight;
    const cardW = card?.offsetWidth || 380;
    const cardH = card?.offsetHeight || 130;
    const pad = 10;
    const markerTagH = 28; // approx marker pill height
    const gap = 6;

    // Default: below marker tag so the tag stays visible
    let left = px.x - cardW / 2;
    let top = px.y + markerTagH + gap;

    // If card goes below container → flip above marker
    if (top + cardH > cH - pad) {
      top = px.y - cardH - markerTagH - gap;
    }

    // If still above container top → clamp to top
    if (top < pad) {
      top = pad;
    }

    // Clamp horizontal
    left = Math.max(pad, Math.min(left, cW - cardW - pad));

    setPos({ left, top });
  }, [marker.lat, marker.lng, containerEl]);

  // Track map panning/zooming
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(reposition, 80);
    const listener = map.addListener("bounds_changed", reposition);
    return () => {
      clearTimeout(timer);
      listener.remove();
    };
  }, [map, reposition]);

  // Re-position when card resizes (e.g. after SWR data loads)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new ResizeObserver(reposition);
    observer.observe(card);
    return () => observer.disconnect();
  }, [reposition]);

  return createPortal(
    <div
      ref={cardRef}
      className="absolute z-[1000]"
      style={
        pos
          ? { left: pos.left, top: pos.top }
          : { left: 0, top: 0, opacity: 0, pointerEvents: "none" as const }
      }
      onClick={(e) => e.stopPropagation()}
    >
      <MapInfoCard
        listingKey={marker.listingKey}
        onClose={onClose}
        onOpenOverlay={onOpenOverlay}
        isSaved={savedListingKeys?.has(marker.listingKey)}
        onToggleSave={onToggleSave}
      />
    </div>,
    containerEl
  );
}

/** Reports map viewport bounds when the user pans or zooms. */
function ViewportTracker({ onViewportChange }: { onViewportChange: (bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const report = () => {
      const b = map.getBounds();
      if (!b) return;
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      onViewportChange({ swLat: sw.lat(), swLng: sw.lng(), neLat: ne.lat(), neLng: ne.lng() });
    };

    // Fire once on load, then on every idle (after pan/zoom finishes)
    const timer = setTimeout(report, 200);
    const listener = map.addListener("idle", report);
    return () => { clearTimeout(timer); listener.remove(); };
  }, [map, onViewportChange]);

  return null;
}

function formatPriceLabel(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }
  return `$${Math.round(value)}`;
}

export default function PropertyMap({
  center,
  zoom = 11,
  markers = [],
  className,
  interactive = true,
  onClick,
  onDrawBounds,
  hoveredListingId,
  selectedListingId,
  onMarkerHover,
  markerCount,
  totalCount,
  onOpenOverlay,
  savedListingKeys,
  onToggleSave,
  hoveredResultCard,
  onInfoCardClose,
  onViewportChange,
}: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const [bannerKey, setBannerKey] = useState(0);
  const [infoCardMarker, setInfoCardMarker] = useState<{ listingKey: string; lat: number; lng: number } | null>(null);
  // Track whether InfoCard was opened by a click or a result-card hover
  const infoCardSourceRef = useRef<"click" | "hover" | null>(null);

  // Result card hover → show InfoCard for that listing; un-hover → close it
  useEffect(() => {
    if (hoveredResultCard) {
      setInfoCardMarker(hoveredResultCard);
      infoCardSourceRef.current = "hover";
    } else if (infoCardSourceRef.current === "hover") {
      setInfoCardMarker(null);
      infoCardSourceRef.current = null;
    }
  }, [hoveredResultCard]);

  // Re-trigger banner animation when marker count changes
  useEffect(() => {
    if (markerCount !== undefined) setBannerKey((k) => k + 1);
  }, [markerCount]);

  if (!apiKey) {
    return (
      <div
        className={`bg-neutral-900 border border-white/10 flex items-center justify-center text-center px-6 ${
          className || ""
        }`}
      >
        <div>
          <p className="text-neutral-400 text-sm uppercase tracking-[0.18em] mb-2">Map Unavailable</p>
          <p className="text-neutral-600 text-xs">Set NEXT_PUBLIC_GOOGLE_MAPS_KEY to enable maps.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden border border-white/10 ${className || ""}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="DEMO_MAP_ID"
          style={{ width: "100%", height: "100%" }}
          gestureHandling={interactive ? "greedy" : "none"}
          clickableIcons={interactive}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          rotateControl={false}
          zoomControl={false}
          scaleControl={true}
        >
          {markers.map((marker, index) => {
            const markerLabel = marker.price ? formatPriceLabel(marker.price) : marker.label || "";
            const isActive =
              (hoveredListingId != null && marker.listingKey === hoveredListingId) ||
              (selectedListingId != null && marker.listingKey === selectedListingId) ||
              (infoCardMarker != null && marker.listingKey === infoCardMarker.listingKey);

            return (
              <AdvancedMarker
                key={`${marker.listingKey || markerLabel}-${index}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  if (!marker.listingKey) return;
                  onClick?.(marker.listingKey);
                  setInfoCardMarker({ listingKey: marker.listingKey, lat: marker.lat, lng: marker.lng });
                  infoCardSourceRef.current = "click";
                }}
                zIndex={isActive ? 999 : undefined}
              >
                <div
                  className={`
                    relative cursor-pointer select-none
                    text-[13px] font-bold rounded-[10px] px-[10px] py-[5px]
                    shadow-[3px_3px_5px_rgba(0,0,0,0.25)]
                    transition-all duration-300 ease-in-out
                    ${isActive
                      ? "bg-black text-white scale-[1.2]"
                      : "bg-white text-black"
                    }
                  `}
                  onMouseEnter={() => marker.listingKey && onMarkerHover?.(marker.listingKey)}
                  onMouseLeave={() => onMarkerHover?.(null)}
                >
                  {markerLabel}
                </div>
              </AdvancedMarker>
            );
          })}

          {/* InfoCard — rendered via portal, uses map projection for smart positioning */}
          {infoCardMarker && containerRef.current && (
            <InfoCardOverlay
              marker={infoCardMarker}
              onClose={() => {
                setInfoCardMarker(null);
                infoCardSourceRef.current = null;
                onInfoCardClose?.();
              }}
              onOpenOverlay={onOpenOverlay}
              savedListingKeys={savedListingKeys}
              onToggleSave={onToggleSave}
              containerEl={containerRef.current}
            />
          )}

          {/* MUST be inside <Map> so useMap() returns the map instance */}
          {interactive && <MapDrawControl onBoundsChange={onDrawBounds} containerRef={containerRef} />}
          {onViewportChange && <ViewportTracker onViewportChange={onViewportChange} />}
        </Map>

        {/* Count alert banner — "Showing X of Y properties" */}
        {markerCount !== undefined && totalCount !== undefined && totalCount > markerCount && (
          <div
            key={bannerKey}
            className="absolute top-0 left-0 z-[2] m-[15px] pointer-events-none animate-fadeInOut"
          >
            <div className="bg-black rounded-[15px] px-[15px] py-[10px]">
              <span className="text-white text-[14px]">
                Showing {markerCount.toLocaleString()} of {totalCount.toLocaleString()} properties.
                Zoom in to see more.
              </span>
            </div>
          </div>
        )}
      </APIProvider>
    </div>
  );
}
