"use client";
import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { MOCK_SEARCH } from "@/data/mockListings";

const PRICE_RANGES = ["Any Price", "Under $500K", "$500K–$1M", "$1M–$2M", "$2M–$5M", "$5M+"];
const BED_OPTIONS = ["Any Beds", "1+", "2+", "3+", "4+", "5+"];
const STATUS_OPTIONS = ["For Sale", "Sold", "For Rent"];

export default function SearchPage() {
  const [status, setStatus] = useState("For Sale");

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-neutral-950 border-b border-white/5 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Address, city, zip, or MLS#"
              className="w-full bg-transparent border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-neutral-900 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40"
          >
            {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>

          {/* Price */}
          <select className="bg-neutral-900 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40">
            {PRICE_RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>

          {/* Beds */}
          <select className="bg-neutral-900 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40">
            {BED_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>

          {/* Result count + sort */}
          <div className="ml-auto flex items-center gap-3 text-sm text-neutral-400">
            <span>{MOCK_SEARCH.length} results</span>
            <select className="bg-transparent border border-white/20 rounded-full px-3 py-1.5 text-xs text-neutral-400 focus:outline-none">
              <option>Newest</option>
              <option>Price: High–Low</option>
              <option>Price: Low–High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Split panel */}
      <div className="flex min-h-[calc(100vh-8rem)] bg-[#0a0a0a] pt-16">
        {/* Map placeholder — desktop */}
        <div className="hidden lg:flex lg:w-[40%] sticky top-[8.5rem] self-start h-[calc(100vh-8.5rem)] bg-neutral-900 border-r border-white/5 items-center justify-center">
          <div className="text-center px-6">
            <p className="text-neutral-600 text-sm uppercase tracking-widest mb-2">Interactive Map</p>
            <p className="text-neutral-700 text-xs">Map integration coming soon</p>
          </div>
        </div>

        {/* Results grid */}
        <div className="flex-1 px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            {MOCK_SEARCH.map((listing, i) => (
              <PropertyCard key={i} {...listing} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">‹</button>
            <button className="w-9 h-9 rounded-full bg-white text-black text-sm">1</button>
            <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">2</button>
            <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">3</button>
            <button className="w-9 h-9 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all">›</button>
          </div>
        </div>
      </div>
    </>
  );
}
