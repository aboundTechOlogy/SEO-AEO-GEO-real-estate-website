"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { createPortal } from "react-dom";

export interface DrawCoordinate {
  lat: number;
  lng: number;
}

interface MapDrawControlProps {
  onBoundsChange?: (coords: DrawCoordinate[] | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const POLYGON_FILL = "rgba(66, 133, 244, 0.15)";
const POLYGON_STROKE = "#4285F4";

function isNearFirstPoint(point: DrawCoordinate, first: DrawCoordinate): boolean {
  const latDiff = Math.abs(point.lat - first.lat);
  const lngDiff = Math.abs(point.lng - first.lng);
  return latDiff <= 0.0009 && lngDiff <= 0.0009;
}

export default function MapDrawControl({ onBoundsChange, containerRef }: MapDrawControlProps) {
  const map = useMap();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [points, setPoints] = useState<DrawCoordinate[]>([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pointsRef = useRef<DrawCoordinate[]>([]);
  const lineRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // Draw polyline/polygon on map
  useEffect(() => {
    if (!map) return;

    const googleMaps = (globalThis as any).google?.maps;
    if (!googleMaps) return;

    if (lineRef.current) {
      lineRef.current.setMap(null);
      lineRef.current = null;
    }

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    if (isClosed && points.length >= 3) {
      polygonRef.current = new googleMaps.Polygon({
        map,
        paths: points,
        strokeColor: POLYGON_STROKE,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: POLYGON_FILL,
        fillOpacity: 1,
        clickable: false,
      });
      return;
    }

    if (points.length >= 2) {
      lineRef.current = new googleMaps.Polyline({
        map,
        path: points,
        strokeColor: POLYGON_STROKE,
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
      });
    }
  }, [map, points, isClosed]);

  // Map click listeners for drawing
  useEffect(() => {
    if (!map) return;

    map.setOptions({
      disableDoubleClickZoom: isDrawing && !isClosed,
      draggableCursor: isDrawing && !isClosed ? "crosshair" : undefined,
    });

    if (!(isDrawing && !isClosed)) {
      return () => {
        map.setOptions({ disableDoubleClickZoom: false, draggableCursor: undefined });
      };
    }

    const clickListener = map.addListener("click", (event: any) => {
      const latLng = event.latLng?.toJSON?.();
      if (!latLng) return;

      setPoints((previous) => {
        if (previous.length >= 3 && isNearFirstPoint(latLng, previous[0])) {
          setIsClosed(true);
          setIsDrawing(false);
          return previous;
        }
        return [...previous, latLng];
      });
    });

    const doubleClickListener = map.addListener("dblclick", () => {
      if (pointsRef.current.length >= 3) {
        setIsClosed(true);
        setIsDrawing(false);
      }
    });

    return () => {
      clickListener.remove();
      doubleClickListener.remove();
      map.setOptions({ disableDoubleClickZoom: false, draggableCursor: undefined });
    };
  }, [map, isDrawing, isClosed]);

  // Notify parent of bounds changes
  useEffect(() => {
    if (!onBoundsChange) return;

    if (isClosed && points.length >= 3) {
      onBoundsChange(points);
      return;
    }

    if (points.length === 0) {
      onBoundsChange(null);
    }
  }, [onBoundsChange, isClosed, points]);

  const handleDrawClick = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      return;
    }

    if (isClosed) {
      setPoints([]);
      setIsClosed(false);
      onBoundsChange?.(null);
    }

    setIsDrawing(true);
  }, [isDrawing, isClosed, onBoundsChange]);

  const handleClear = useCallback(() => {
    setIsDrawing(false);
    setIsClosed(false);
    setPoints([]);
    onBoundsChange?.(null);
  }, [onBoundsChange]);

  const handleSatelliteToggle = useCallback(() => {
    if (!map) return;
    const next = !isSatellite;
    setIsSatellite(next);
    map.setMapTypeId(next ? "hybrid" : "roadmap");
  }, [map, isSatellite]);

  const hasPolygon = isClosed || points.length > 0;

  // Portal the toolbar buttons into the map container as an absolute overlay
  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div className="absolute right-[10px] top-[10px] z-[5] flex flex-col gap-[2px]" style={{ pointerEvents: "auto" }}>
      {/* Draw boundary tool */}
      <button
        type="button"
        onClick={handleDrawClick}
        aria-label="Draw boundary"
        title="Draw boundary"
        className={`w-10 h-10 bg-white border border-black/10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors cursor-pointer ${
          isDrawing ? "text-[#4285F4]" : "text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <polygon points="12,2 22,8.5 19,20 5,20 2,8.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="2" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="22" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="20" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="5" cy="20" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="2" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* Clear boundary */}
      {hasPolygon && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear boundary"
          title="Clear boundary"
          className="w-10 h-10 bg-white border border-black/10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Satellite / Map view toggle */}
      <button
        type="button"
        onClick={handleSatelliteToggle}
        aria-label={isSatellite ? "Switch to map view" : "Switch to satellite view"}
        title={isSatellite ? "Map view" : "Satellite view"}
        className={`w-10 h-10 bg-white border border-black/10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors cursor-pointer ${
          isSatellite ? "text-[#4285F4]" : "text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 12h18M12 3v18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
        </svg>
      </button>
    </div>,
    containerRef.current
  );
}
