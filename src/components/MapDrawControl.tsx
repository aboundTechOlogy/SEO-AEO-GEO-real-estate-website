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
/* IDXBoost icon-draw (e952) — hand/finger freehand drawing gesture, from Chad Carroll's site */
function DrawIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
      <g transform="translate(0,1024) scale(1,-1)">
        <path d="M1015.243 643.529c-13.891 8.153-31.707 3.322-39.861-10.569-1.51-2.718-41.673-68.85-132.567-85.157-8.153-1.51-18.723-2.114-23.252 2.718-3.020 3.322-12.079 18.421-3.926 69.454 5.738 35.029 17.213 71.568 23.554 91.197 9.059 28.084 34.727 125.018-10.871 190.547-24.46 35.935-64.623 55.262-119.28 57.979-158.537 7.851-395.89-162.765-405.855-170.012-1.208-0.906-2.416-2.114-3.624-3.322-8.757 2.114-17.817 3.020-26.876 2.416-25.064-2.114-48.92-12.683-66.133-31.405-9.059-9.965-15.703-21.138-20.534-34.123-4.53-12.683-4.53-25.97-4.53-39.257 0.604-60.697 1.51-121.394 2.416-182.091 0.302-30.198 0.906-60.395 1.208-90.895 0.302-20.836 0.906-41.673 0.604-62.509-4.832 3.926-9.663 7.851-14.495 11.475-9.059 7.247-18.421 14.495-27.48 21.742-8.757 7.247-17.213 15.099-27.48 19.93-10.871 4.832-22.044 7.851-34.123 7.549s-22.648-3.322-33.519-8.153c-19.93-9.059-34.727-26.574-42.881-46.806-9.965-24.46-5.436-51.638 7.549-73.984 5.134-8.757 11.475-16.911 17.515-25.064 6.643-9.059 12.985-18.421 19.628-27.48 25.668-36.841 50.732-73.984 77.608-109.617 26.574-35.029 54.658-69.152 87.271-98.746 32.915-29.594 69.756-53.45 111.731-68.247 79.118-27.782 171.824-18.421 243.091 26.574 63.415 40.163 109.315 106.597 123.508 180.28 2.416 12.381 3.926 25.064 5.134 37.445 5.134 59.489 1.51 119.582 1.812 179.374 0 14.797 0.302 29.594 0 44.088 0 13.589-0.604 27.178-5.738 39.861-5.134 12.985-12.683 25.366-23.252 34.727s-23.554 16.911-37.445 19.628c-15.703 3.322-32.311 2.718-47.41-3.322-3.624-1.51-7.247-3.020-10.569-4.832-7.851 10.871-18.119 20.232-29.896 26.272-25.97 13.287-55.262 12.985-81.231 0.604-3.322-1.51-6.643-3.624-9.663-5.738-12.079 10.871-26.876 18.723-42.277 21.742-13.287 2.718-26.876 3.020-40.163 0 0.604 46.806 1.51 93.613 2.416 140.419 0.302 15.703-2.416 29.896-8.757 44.088-3.322 7.247-7.851 14.495-13.287 20.534 53.752 36.539 236.145 154.008 353.312 148.27 35.935-1.812 60.395-12.381 74.588-32.915 31.104-44.692 8.153-124.112 3.020-139.815-25.97-81.835-47.41-171.824-7.851-216.517 9.965-11.475 27.48-23.554 56.168-23.554 6.341 0 13.589 0.604 21.138 2.114 118.375 21.44 170.314 109.617 172.428 113.543 7.851 13.589 3.020 31.405-10.871 39.559z" />
      </g>
    </svg>
  );
}

/* IDXBoost icon-satellite — exact glyph from Chad Carroll's IDXBoost plugin */
function SatelliteIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
      <path d="M128 533.334h-42.667c0.17 259.137 210.196 469.163 469.316 469.333h0.017v-42.667c-235.486-0.388-426.279-191.182-426.667-426.63v-0.037zM298.667 533.334h-42.667c0.194 164.871 133.796 298.473 298.648 298.667h0.018v-42.667c-141.336-0.121-255.879-114.664-256-255.988v-0.012zM938.667 759.041l-192-192-42.667 42.667-55.040-55.040 85.333-85.333-115.627-115.627-85.333 85.333-55.040-55.040 42.667-42.667-192-192h-17.92l-106.667 106.667 200.96 200.96 42.667-42.667 55.040 55.040-85.333 85.333 115.627 115.627 85.333-85.333 55.040 55.040-42.667 42.667 200.96 200.96 106.667-106.667z" />
    </svg>
  );
}

/* IDXBoost icon-map-flat — shown when in satellite mode to switch back */
function MapViewIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
      <path d="M672 256l-320-128-352 128v768l352-128 320 128 352-128v-768l-352 128zM384 209.728l256 102.4v630.144l-256-102.4v-630.144zM64 300.832l256-93.088v631.808l-256 93.088v-631.808zM960 851.168l-256 93.088v-631.808l256-93.088v631.808z" />
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
