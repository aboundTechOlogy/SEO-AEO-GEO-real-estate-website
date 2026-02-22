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

/* ── Icons matching Chad Carroll's toolbar ── */

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

/* Hand/finger drawing a squiggly line — matches Chad's draw icon */
function DrawIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth={1.6}>
      {/* Curved arrow suggesting a drawing motion */}
      <path d="M7 16c1-2 3-4 5-4s3 1.5 5 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hand/finger pointing down */}
      <path d="M14 4v7c0 .6.4 1 1 1h0c.6 0 1-.4 1-1V7c0-.6.4-1 1-1h0c.6 0 1 .4 1 1v5c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4V8c0-.6.4-1 1-1h0c.6 0 1 .4 1 1v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Satellite icon — matches Chad's satellite/map toggle */
function SatelliteIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      {/* Satellite body */}
      <path d="M13 7L9 3 5 7l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 11l4-4-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12l4 4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Signal waves */}
      <path d="M7 17a5.5 5.5 0 0 0 7.5-7.5" strokeLinecap="round" />
      <path d="M4 20a9.5 9.5 0 0 0 13-13" strokeLinecap="round" />
      {/* Dish base */}
      <circle cx="6" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Map/road view icon */
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
  const [isHolding, setIsHolding] = useState(false);

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

  // Freehand drawing: mousedown → track mousemove → mouseup closes shape
  useEffect(() => {
    if (!map) return;

    const drawActive = isDrawing && !isClosed;

    if (drawActive) {
      map.setOptions({
        gestureHandling: "none",
        disableDoubleClickZoom: true,
        draggableCursor: "crosshair",
      });
    } else {
      map.setOptions({
        gestureHandling: "greedy",
        disableDoubleClickZoom: false,
        draggableCursor: undefined,
      });
    }

    if (!drawActive) return;

    // Get the map div to attach raw DOM events
    const mapDiv = (map as any).getDiv?.() as HTMLElement | undefined;
    if (!mapDiv) return;

    let drawing = false;
    let localPoints: DrawCoordinate[] = [];

    function pixelToLatLng(x: number, y: number): DrawCoordinate | null {
      if (!map) return null;
      const bounds = map.getBounds();
      const projection = map.getProjection();
      if (!bounds || !projection) return null;

      const mapDivEl = (map as any).getDiv() as HTMLElement;
      const rect = mapDivEl.getBoundingClientRect();

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const lng = sw.lng() + ((x - rect.left) / rect.width) * (ne.lng() - sw.lng());
      const lat = ne.lat() - ((y - rect.top) / rect.height) * (ne.lat() - sw.lat());

      return { lat, lng };
    }

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return; // left click only
      drawing = true;
      localPoints = [];
      const coord = pixelToLatLng(e.clientX, e.clientY);
      if (coord) {
        localPoints.push(coord);
        setPoints([...localPoints]);
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!drawing) return;
      const coord = pixelToLatLng(e.clientX, e.clientY);
      if (coord) {
        // Throttle: only add point if moved enough
        const last = localPoints[localPoints.length - 1];
        if (last) {
          const dist = Math.abs(coord.lat - last.lat) + Math.abs(coord.lng - last.lng);
          if (dist < 0.0005) return; // skip tiny movements
        }
        localPoints.push(coord);
        setPoints([...localPoints]);
      }
    }

    function onMouseUp() {
      if (!drawing) return;
      drawing = false;
      if (localPoints.length >= 3) {
        setPoints([...localPoints]);
        setIsClosed(true);
        setIsDrawing(false);
      } else {
        // Not enough points, reset
        localPoints = [];
        setPoints([]);
      }
    }

    mapDiv.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      mapDiv.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      map.setOptions({
        gestureHandling: "greedy",
        disableDoubleClickZoom: false,
        draggableCursor: undefined,
      });
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
    setIsHolding(false);
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

          <div className="h-2" />

          {/* Draw boundary — freehand */}
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
