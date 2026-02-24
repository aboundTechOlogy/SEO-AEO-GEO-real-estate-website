"use client";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import SwiperCarousel from "@/components/SwiperCarousel";
import SectionHeader from "@/components/SectionHeader";
import NavArrows from "@/components/NavArrows";
import PropertyCard, { type PropertyCardProps } from "@/components/PropertyCard";

interface RecentlySoldProps {
  listings: PropertyCardProps[];
}

export default function RecentlySold({ listings }: RecentlySoldProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="bg-neutral-900 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <SectionHeader
          subtitle="Andrew Whalen"
          title="Recently Sold"
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
          {listings.map((listing) => (
            <PropertyCard key={listing.href} {...listing} isSold />
          ))}
        </SwiperCarousel>

        <NavArrows
          ctaText="View All Recently Sold"
          ctaHref="/recent-sales/"
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </div>
    </section>
  );
}
