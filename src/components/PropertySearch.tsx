"use client";

import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function PropertySearch() {
  return (
    <section className="hidden md:flex relative min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
      {/* AW watermark */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] font-playfair text-white/[0.03] select-none pointer-events-none leading-none">
        AW
      </span>

      <FadeInOnScroll className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.12em] text-white text-center mb-10">
          Property Search
        </h2>

        {/* Search bar */}
        <div className="flex flex-row gap-3">
          {/* For Sale dropdown */}
          <div className="relative shrink-0">
            <select
              className="appearance-none bg-white/10 border border-white/20 rounded-full px-6 py-4 pr-12 text-white text-sm uppercase tracking-wider cursor-pointer focus:outline-none focus:border-white/40 transition-colors"
              defaultValue="sale"
            >
              <option value="sale" className="bg-neutral-900">For Sale</option>
              <option value="rent" className="bg-neutral-900">For Rent</option>
              <option value="sold" className="bg-neutral-900">Sold</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Enter an address, city, zip code or MLS number"
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
          />

          {/* Find Now button */}
          <a
            href="/search/"
            className="bg-white text-black font-medium rounded-full px-10 py-4 uppercase tracking-wider text-sm hover:bg-neutral-200 transition-colors text-center shrink-0"
          >
            Find Now!
          </a>
        </div>

        {/* Advanced search link */}
        <p className="mt-4 text-center">
          <a href="/search/" className="text-white/60 text-sm tracking-wider hover:text-white transition-colors">
            + Advanced search options
          </a>
        </p>
      </FadeInOnScroll>
    </section>
  );
}
