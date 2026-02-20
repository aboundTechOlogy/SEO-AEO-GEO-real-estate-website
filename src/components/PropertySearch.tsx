"use client";

import FadeInOnScroll from "@/components/FadeInOnScroll";

// TODO: Replace with looping video — slow aerial of Biscayne Bay at dusk

export default function PropertySearch() {
  return (
    <section className="hidden md:flex relative min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
      {/* Video placeholder — uncomment when video file is ready:
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/search-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60" />
      */}

      {/* W-roof watermark */}
      <img
        src="/w-icon-logo.png"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] opacity-[0.04] select-none pointer-events-none"
      />

      <FadeInOnScroll className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-playfair text-5xl md:text-6xl uppercase tracking-[0.15em] text-white mb-10">
          Property Search
        </h2>

        {/* Search bar */}
        <div className="flex flex-row gap-4">
          {/* For Sale dropdown */}
          <div className="relative w-[200px] shrink-0">
            <select
              className="appearance-none w-full bg-transparent border-2 border-white/40 rounded-full px-8 py-4 text-white text-sm uppercase tracking-wider cursor-pointer focus:outline-none focus:border-white/60 transition-colors"
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
            className="flex-1 bg-transparent border-2 border-white/40 rounded-full px-8 py-4 text-white placeholder-white/70 focus:outline-none focus:border-white/60 transition-colors"
          />

          {/* Find Now button */}
          <a
            href="/search/"
            className="w-[200px] shrink-0 bg-neutral-200 text-black font-medium rounded-full px-12 py-4 uppercase tracking-wider text-sm hover:bg-white transition-colors flex items-center justify-center"
          >
            Find Now!
          </a>
        </div>

        {/* Advanced search link */}
        <p className="mt-5 text-right">
          <a href="/search/" className="text-white/60 text-sm tracking-wider hover:text-white transition-colors">
            + Advanced search options
          </a>
        </p>
      </FadeInOnScroll>
    </section>
  );
}
