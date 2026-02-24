"use client";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import SwiperCarousel from "@/components/SwiperCarousel";
import SectionHeader from "@/components/SectionHeader";
import NavArrows from "@/components/NavArrows";

const TESTIMONIALS = [
  {
    quote: "Andrew was an absolute pleasure to work with. His knowledge of the Miami market is unmatched. He helped us close on our dream home in Brickell in under 30 days — well below asking price.",
    name: "Michael & Jennifer R.",
    role: "Buyers — Brickell",
    rating: 5,
  },
  {
    quote: "I've worked with many agents across South Florida. Andrew is in a different category. His data-driven approach and negotiation skills helped us sell our Coconut Grove estate for 12% above asking.",
    name: "Carlos M.",
    role: "Seller — Coconut Grove",
    rating: 5,
  },
  {
    quote: "Andrew's expertise in new construction is exceptional. He guided us through the pre-construction process for our Edgewater unit from deposit to closing — flawlessly. We've already made significant gains.",
    name: "Sarah & David L.",
    role: "Investors — Edgewater",
    rating: 5,
  },
  {
    quote: "From the first call, I knew Andrew was different. He took the time to understand exactly what we needed, showed us only the right properties, and negotiated a deal that exceeded our expectations.",
    name: "Alexandra V.",
    role: "Buyer — Miami Beach",
    rating: 5,
  },
  {
    quote: "Andrew helped us sell our Coral Gables home and find our next property simultaneously — coordinating both closings perfectly. His professionalism and market knowledge are truly exceptional.",
    name: "Robert & Patricia H.",
    role: "Sellers & Buyers — Coral Gables",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative bg-[#0a0a0a] py-20 md:py-28 overflow-hidden">
      {/* Andrew photo background — desktop only, low opacity */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[30%] pointer-events-none">
        <img
          src="/andrew-headshot.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
          style={{ objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 overflow-hidden">
        <SectionHeader
          subtitle="Andrew Whalen"
          title="Testimonials"
          align="left"
          className="mb-12"
        />

        <SwiperCarousel
          slidesPerView={1}
          spaceBetween={32}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 24 },
            1024: { slidesPerView: 2, spaceBetween: 32 },
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="relative bg-neutral-900/50 border border-white/5 p-8 lg:p-10"
            >
              {/* Large quotation mark */}
              <span
                className="font-playfair text-[120px] leading-none text-white/5 absolute top-0 left-6 select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="relative">
                <StarRating count={t.rating} />
                <p className="font-playfair italic text-base text-neutral-300 leading-relaxed mt-4 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </SwiperCarousel>

        <NavArrows
          prevLabel="Previous"
          nextLabel="Next"
          ctaText="View More Testimonials"
          ctaHref="/testimonials/"
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </div>
    </section>
  );
}
