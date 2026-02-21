"use client";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import SwiperCarousel from "@/components/SwiperCarousel";
import SectionHeader from "@/components/SectionHeader";
import NavArrows from "@/components/NavArrows";
import PropertyCard from "@/components/PropertyCard";
import { MOCK_EXCLUSIVE } from "@/data/mockListings";

export default function ExclusiveListings() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="bg-[#0a0a0a] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          subtitle="Andrew Whalen"
          title="Our Listings"
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
          {MOCK_EXCLUSIVE.map((listing, i) => (
            <PropertyCard key={i} {...listing} />
          ))}
        </SwiperCarousel>

        <NavArrows
          ctaText="View All Listings"
          ctaHref="/our-listings/"
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </div>
    </section>
  );
}
