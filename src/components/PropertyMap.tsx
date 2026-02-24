"use client";

import { useRef, useState, useEffect } from "react";
import { APIProvider, AdvancedMarker, ControlPosition, Map } from "@vis.gl/react-google-maps";
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
}: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const [bannerKey, setBannerKey] = useState(0);
  const [infoCardMarker, setInfoCardMarker] = useState<{ listingKey: string; lat: number; lng: number } | null>(null);

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
              (selectedListingId != null && marker.listingKey === selectedListingId);

            return (
              <AdvancedMarker
                key={`${marker.listingKey || markerLabel}-${index}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  if (!marker.listingKey) return;
                  onClick?.(marker.listingKey);
                  setInfoCardMarker({ listingKey: marker.listingKey, lat: marker.lat, lng: marker.lng });
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

          {/* InfoCard popup — anchored to clicked marker */}
          {infoCardMarker && (
            <AdvancedMarker
              position={{ lat: infoCardMarker.lat, lng: infoCardMarker.lng }}
              zIndex={1000}
            >
              <div className="relative" style={{ transform: "translate(-50%, -100%)", marginBottom: "8px" }}>
                <MapInfoCard
                  listingKey={infoCardMarker.listingKey}
                  onClose={() => setInfoCardMarker(null)}
                  onOpenOverlay={onOpenOverlay}
                />
              </div>
            </AdvancedMarker>
          )}

          {/* MUST be inside <Map> so useMap() returns the map instance */}
          {interactive && <MapDrawControl onBoundsChange={onDrawBounds} containerRef={containerRef} />}
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
