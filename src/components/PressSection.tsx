"use client";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import SwiperCarousel from "@/components/SwiperCarousel";
import SectionHeader from "@/components/SectionHeader";
import NavArrows from "@/components/NavArrows";

const PRESS_ITEMS = [
  { outlet: "Miami Herald", headline: "South Florida Luxury Market Hits Record Highs as Buyers Flock from Northeast", date: "Jan 2026" },
  { outlet: "Wall Street Journal", headline: "Miami's Brickell Emerges as America's Next Financial Hub", date: "Dec 2025" },
  { outlet: "Mansion Global", headline: "Inside South Florida's Most Exclusive Off-Market Deals", date: "Nov 2025" },
  { outlet: "Forbes", headline: "Why Ultra-High-Net-Worth Buyers Are Choosing Miami Over Manhattan", date: "Oct 2025" },
];

function PressCard({ outlet, headline, date }: { outlet: string; headline: string; date: string }) {
  return (
    <div className="bg-neutral-900 border border-white/5 p-6 hover:border-white/20 transition-colors">
      {/* Placeholder thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-950 mb-4 flex items-center justify-center">
        <span className="text-neutral-600 text-xs uppercase tracking-widest">{outlet}</span>
      </div>
      <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">{outlet} · {date}</p>
      <p className="text-white text-sm leading-relaxed">{headline}</p>
    </div>
  );
}

export default function PressSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="bg-[#0a0a0a] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <SectionHeader
          subtitle="Andrew Whalen"
          title="In The News"
          align="left"
          className="mb-4"
        />
        <p className="text-neutral-500 text-sm mb-12">
          Stay in the loop with the most recent updates, insightful articles, and breaking news.
        </p>

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
          {PRESS_ITEMS.map((item, i) => (
            <PressCard key={i} {...item} />
          ))}
        </SwiperCarousel>

        <div className="mt-10 text-center">
          <a
            href="/press/"
            className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
          >
            View All Press &amp; Media
          </a>
        </div>
      </div>
    </section>
  );
}
