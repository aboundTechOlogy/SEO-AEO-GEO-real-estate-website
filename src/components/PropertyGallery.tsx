"use client";

import { useEffect, useState } from "react";
import type { BridgeMedia } from "@/lib/bridge";

interface PropertyGalleryProps {
  photos: BridgeMedia[];
  address: string;
}

export default function PropertyGallery({ photos, address }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="w-full h-[420px] bg-neutral-900 border border-white/10 flex items-center justify-center">
        <p className="text-neutral-500 text-sm uppercase tracking-[0.12em]">No photos available</p>
      </div>
    );
  }

  const hero = photos[0];
  const secondary = photos.slice(1, 3);
  const activePhoto = photos[activeIndex];

  return (
    <>
      <div className="grid md:grid-cols-[2fr_1fr] gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setLightboxOpen(true);
          }}
          className="relative h-[420px] overflow-hidden bg-neutral-900 border border-white/10"
        >
          <img src={hero.MediaURL} alt={address} className="w-full h-full object-cover" />
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-sm">
            1 of {photos.length}
          </span>
        </button>

        <div className="grid grid-rows-2 gap-3">
          {secondary.map((photo, index) => (
            <button
              type="button"
              key={`${photo.MediaURL}-${index}`}
              onClick={() => {
                setActiveIndex(index + 1);
                setLightboxOpen(true);
              }}
              className="h-[203px] overflow-hidden bg-neutral-900 border border-white/10"
            >
              <img src={photo.MediaURL} alt={address} className="w-full h-full object-cover" />
            </button>
          ))}
          {secondary.length < 2 && (
            <div className="h-[203px] bg-neutral-900 border border-white/10 flex items-center justify-center">
              <p className="text-neutral-600 text-xs uppercase tracking-[0.12em]">More photos in gallery</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="mt-3 border border-white/30 rounded-full px-5 py-2 text-xs uppercase tracking-[0.12em] text-white hover:bg-white/10 transition-colors"
      >
        View All Photos ({photos.length})
      </button>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)}
            className="absolute left-4 md:left-8 text-white/80 hover:text-white transition-colors"
            aria-label="Previous photo"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 19.5-7.5-7.5 7.5-7.5" />
            </svg>
          </button>

          <div className="w-full max-w-6xl">
            <img src={activePhoto.MediaURL} alt={address} className="w-full max-h-[82vh] object-contain" />
            <p className="text-center text-white/80 text-sm mt-3">
              {activeIndex + 1} of {photos.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % photos.length)}
            className="absolute right-4 md:right-8 text-white/80 hover:text-white transition-colors"
            aria-label="Next photo"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
