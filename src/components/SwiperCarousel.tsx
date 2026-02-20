"use client";
import { useRef, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  children: ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  navigation?: boolean;
  pagination?: boolean;
  className?: string;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
  onSwiper?: (swiper: SwiperType) => void;
}

export default function SwiperCarousel({
  children,
  slidesPerView = 3,
  spaceBetween = 24,
  navigation = false,
  pagination = false,
  className = "",
  breakpoints,
  onSwiper,
}: Props) {
  const defaultBreakpoints = breakpoints ?? {
    0: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: slidesPerView, spaceBetween },
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      slidesPerView={1}
      spaceBetween={spaceBetween}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      breakpoints={defaultBreakpoints}
      className={`w-full ${className}`}
      onSwiper={onSwiper}
    >
      {children.map((child, i) => (
        <SwiperSlide key={i}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
