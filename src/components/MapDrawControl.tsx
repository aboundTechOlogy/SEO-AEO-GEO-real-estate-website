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

const BTN =
  "w-10 h-10 bg-white flex items-center justify-center transition-colors cursor-pointer text-neutral-700 hover:bg-neutral-50";
const BTN_SHADOW = "shadow-[0_1px_4px_rgba(0,0,0,0.3)]";

function isNearFirstPoint(point: DrawCoordinate, first: DrawCoordinate): boolean {
  const latDiff = Math.abs(point.lat - first.lat);
  const lngDiff = Math.abs(point.lng - first.lng);
  return latDiff <= 0.0009 && lngDiff <= 0.0009;
}

/* ── SVG Icons ── */

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function DrawIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SatelliteIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9c2.5-2.5 4-5.5 4-9s-1.5-6.5-4-9z" />
    </svg>
  );
}

function MapViewIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  useEffect(() => { pointsRef.current = points; }, [points]);

  // Draw polyline/polygon on map
  useEffect(() => {
    if (!map) return;
    const gm = (globalThis as any).google?.maps;
    if (!gm) return;

    if (lineRef.current) { lineRef.current.setMap(null); lineRef.current = null; }
    if (polygonRef.current) { polygonRef.current.setMap(null); polygonRef.current = null; }

    if (isClosed && points.length >= 3) {
      polygonRef.current = new gm.Polygon({
        map, paths: points,
        strokeColor: POLYGON_STROKE, strokeOpacity: 1, strokeWeight: 2,
        fillColor: POLYGON_FILL, fillOpacity: 1, clickable: false,
      });
      return;
    }
    if (points.length >= 2) {
      lineRef.current = new gm.Polyline({
        map, path: points,
        strokeColor: POLYGON_STROKE, strokeOpacity: 1, strokeWeight: 2, clickable: false,
      });
    }
  }, [map, points, isClosed]);

  // Map click listeners for drawing — ALSO disable dragging so clicks register
  useEffect(() => {
    if (!map) return;

    const drawActive = isDrawing && !isClosed;

    map.setOptions({
      draggable: !drawActive,
      disableDoubleClickZoom: drawActive,
      draggableCursor: drawActive ? "crosshair" : undefined,
    });

    if (!drawActive) {
      return () => {
        map.setOptions({ draggable: true, disableDoubleClickZoom: false, draggableCursor: undefined });
      };
    }

    const clickListener = map.addListener("click", (event: any) => {
      const latLng = event.latLng?.toJSON?.();
      if (!latLng) return;
      setPoints((prev) => {
        if (prev.length >= 3 && isNearFirstPoint(latLng, prev[0])) {
          setIsClosed(true);
          setIsDrawing(false);
          return prev;
        }
        return [...prev, latLng];
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
      map.setOptions({ draggable: true, disableDoubleClickZoom: false, draggableCursor: undefined });
    };
  }, [map, isDrawing, isClosed]);

  // Notify parent of bounds changes
  useEffect(() => {
    if (!onBoundsChange) return;
    if (isClosed && points.length >= 3) { onBoundsChange(points); return; }
    if (points.length === 0) onBoundsChange(null);
  }, [onBoundsChange, isClosed, points]);

  /* ── Handlers ── */

  const handleDrawClick = useCallback(() => {
    if (isClosed) { setPoints([]); setIsClosed(false); onBoundsChange?.(null); }
    setIsDrawing(true);
  }, [isClosed, onBoundsChange]);

  const handleCancel = useCallback(() => {
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

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    map.setZoom((map.getZoom() || 10) + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    map.setZoom((map.getZoom() || 10) - 1);
  }, [map]);

  if (!mounted || !containerRef.current) return null;

  const hasPolygon = isClosed || points.length > 0;
  const drawActive = isDrawing && !isClosed;

  return createPortal(
    <>
      {/* ── Draw mode banner ── */}
      {drawActive && (
        <div className="absolute top-0 left-0 right-0 z-[6] flex items-center justify-between bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-md">
          <p className="text-sm text-neutral-800">
            Draw a shape around the region(s) you would like to live in
          </p>
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-1.5 text-sm font-medium text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer shadow-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Toolbar (hidden during draw mode, matching Chad) ── */}
      {!drawActive && (
        <div className="absolute right-[10px] top-[10px] z-[5] flex flex-col" style={{ pointerEvents: "auto" }}>
          {/* Zoom in */}
          <button type="button" onClick={handleZoomIn} aria-label="Zoom in" title="Zoom in"
            className={`${BTN} ${BTN_SHADOW} rounded-t-sm border border-black/10`}>
            <PlusIcon />
          </button>
          {/* Zoom out */}
          <button type="button" onClick={handleZoomOut} aria-label="Zoom out" title="Zoom out"
            className={`${BTN} ${BTN_SHADOW} border-x border-b border-black/10`}>
            <MinusIcon />
          </button>

          {/* Spacer */}
          <div className="h-2" />

          {/* Draw boundary */}
          <button type="button" onClick={handleDrawClick} aria-label="Draw boundary" title="Draw boundary"
            className={`${BTN} ${BTN_SHADOW} rounded-t-sm border border-black/10`}>
            <DrawIcon />
          </button>

          {/* Clear polygon */}
          {hasPolygon && (
            <button type="button" onClick={handleCancel} aria-label="Clear boundary" title="Clear boundary"
              className={`${BTN} ${BTN_SHADOW} border-x border-b border-black/10 !text-red-500 hover:!bg-red-50`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Satellite / Map toggle */}
          <button type="button" onClick={handleSatelliteToggle}
            aria-label={isSatellite ? "Map view" : "Satellite view"}
            title={isSatellite ? "Map view" : "Satellite view"}
            className={`${BTN} ${BTN_SHADOW} rounded-b-sm border-x border-b border-black/10`}>
            {isSatellite ? <MapViewIcon /> : <SatelliteIcon />}
          </button>
        </div>
      )}
    </>,
    containerRef.current
  );
}
