"use client";

import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import MapDrawControl, { type DrawCoordinate } from "@/components/MapDrawControl";

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
}

/* Default Google Maps styling — no custom overrides, matches standard map look */

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
}: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

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
    <div className={`relative overflow-hidden border border-white/10 ${className || ""}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          style={{ width: "100%", height: "100%" }}
          disableDefaultUI={false}
          gestureHandling={interactive ? "greedy" : "none"}
          clickableIcons={interactive}
          mapTypeControl={false}
          streetViewControl={interactive}
          fullscreenControl={interactive}
          zoomControl={interactive}
          rotateControl={interactive}
          scaleControl={true}
        >
          {markers.map((marker, index) => {
            const markerLabel = marker.price ? formatPriceLabel(marker.price) : marker.label || "";

            return (
              <AdvancedMarker
                key={`${marker.listingKey || markerLabel}-${index}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => marker.listingKey && onClick?.(marker.listingKey)}
              >
                <button
                  type="button"
                  className="bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/25 shadow-lg hover:bg-neutral-800 transition-colors"
                >
                  {markerLabel}
                </button>
              </AdvancedMarker>
            );
          })}

          {interactive && <MapDrawControl onBoundsChange={onDrawBounds} />}
        </Map>
      </APIProvider>
    </div>
  );
}
