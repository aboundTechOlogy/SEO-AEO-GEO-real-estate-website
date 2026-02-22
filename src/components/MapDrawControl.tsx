"use client";

import { useEffect, useRef, useState } from "react";
import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";

export interface DrawCoordinate {
  lat: number;
  lng: number;
}

interface MapDrawControlProps {
  onBoundsChange?: (coords: DrawCoordinate[] | null) => void;
}

const POLYGON_FILL = "rgba(66, 133, 244, 0.15)";
const POLYGON_STROKE = "#4285F4";

function isNearFirstPoint(point: DrawCoordinate, first: DrawCoordinate): boolean {
  const latDiff = Math.abs(point.lat - first.lat);
  const lngDiff = Math.abs(point.lng - first.lng);
  return latDiff <= 0.0009 && lngDiff <= 0.0009;
}

export default function MapDrawControl({ onBoundsChange }: MapDrawControlProps) {
  const map = useMap();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [points, setPoints] = useState<DrawCoordinate[]>([]);

  const pointsRef = useRef<DrawCoordinate[]>([]);
  const lineRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

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

  useEffect(() => {
    if (!map) return;

    const googleMaps = (globalThis as any).google?.maps;
    if (!googleMaps) return;

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

  function handleDrawClick() {
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
  }

  function handleClear() {
    setIsDrawing(false);
    setIsClosed(false);
    setPoints([]);
    onBoundsChange?.(null);
  }

  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="mr-2 mt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDrawClick}
          aria-label="Draw boundary"
          title="Draw boundary"
          className={`w-10 h-10 bg-white border border-black/10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors ${
            isDrawing ? "text-[#4285F4]" : "text-neutral-700 hover:bg-neutral-50"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4 19 4.5-11L20 4l-4 11L4 19Zm0 0 6.5-6.5M8.5 8l7 7"
            />
          </svg>
        </button>

        {(isClosed || points.length > 0) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear boundary"
            title="Clear boundary"
            className="w-10 h-10 bg-white border border-black/10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </MapControl>
  );
}
