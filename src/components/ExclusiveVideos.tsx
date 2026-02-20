"use client";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import SwiperCarousel from "@/components/SwiperCarousel";
import SectionHeader from "@/components/SectionHeader";
import NavArrows from "@/components/NavArrows";

const PLACEHOLDER_VIDEOS = [
  { title: "1000 Brickell Plaza Penthouse", location: "Brickell, Miami" },
  { title: "Fisher Island Estate Tour", location: "Fisher Island" },
  { title: "Faena House — Unit 7B", location: "Miami Beach" },
  { title: "Jade Signature Walkthrough", location: "Sunny Isles Beach" },
];

function VideoCard({ title, location }: { title: string; location: string }) {
  return (
    <div className="relative group cursor-pointer">
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-950 relative overflow-hidden">
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center group-hover:border-white/70 group-hover:bg-white/10 transition-all">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* AW + LoKation logos at bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <img src="/w-icon-logo.png" alt="" className="h-5 w-auto opacity-60" />
          <img src="/lokation-logo-white.png" alt="LoKation" className="h-4 w-auto opacity-60" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{location}</p>
      </div>
    </div>
  );
}

export default function ExclusiveVideos() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="bg-neutral-900 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          subtitle="Andrew Whalen"
          title="Exclusive Videos"
          align="left"
          className="mb-12"
        />

        <SwiperCarousel
          slidesPerView={3}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
        >
          {PLACEHOLDER_VIDEOS.map((v, i) => (
            <VideoCard key={i} {...v} />
          ))}
        </SwiperCarousel>

        <NavArrows
          ctaText="View All Videos"
          ctaHref="https://www.youtube.com/@andrewwhalen11"
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </div>
    </section>
  );
}
