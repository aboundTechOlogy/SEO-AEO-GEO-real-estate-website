"use client";
import { useState } from "react";
import { neighborhoods } from "@/data/neighborhoods";
import PropertyMap from "@/components/PropertyMap";

const COUNTY_TABS = [
  { id: "miami-dade", label: "Miami-Dade" },
  { id: "broward", label: "Broward" },
  { id: "palm-beach", label: "Palm Beach" },
];

const COUNTY_CENTERS: Record<"miami-dade" | "broward" | "palm-beach", { lat: number; lng: number; zoom: number }> = {
  "miami-dade": { lat: 25.7617, lng: -80.1918, zoom: 10 },
  broward: { lat: 26.1224, lng: -80.1373, zoom: 10 },
  "palm-beach": { lat: 26.7153, lng: -80.0534, zoom: 10 },
};

export default function NeighborhoodsPage() {
  const [activeCounty, setActiveCounty] = useState<"miami-dade" | "broward" | "palm-beach">("miami-dade");

  const filtered = neighborhoods.filter(n => n.county === activeCounty);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img src="/hero-miami.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">Andrew Whalen</p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">Neighborhoods</h1>
          </div>
        </div>
      </section>

      {/* County tabs */}
      <section className="bg-neutral-900 border-b border-white/5 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 flex gap-0">
          {COUNTY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCounty(tab.id as "miami-dade" | "broward" | "palm-beach")}
              className={`px-6 py-4 text-xs uppercase tracking-widest transition-colors ${
                activeCounty === tab.id
                  ? "text-white border-b-2 border-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Split panel */}
      <section className="bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Map panel — desktop left */}
            <div className="hidden lg:block lg:w-[40%] min-h-[600px] bg-neutral-900 border-r border-white/5 sticky top-32 self-start h-[calc(100vh-8rem)] p-4">
              <PropertyMap
                center={{ lat: COUNTY_CENTERS[activeCounty].lat, lng: COUNTY_CENTERS[activeCounty].lng }}
                zoom={COUNTY_CENTERS[activeCounty].zoom}
                className="h-full"
                interactive={true}
              />
            </div>

            {/* Neighborhood grid — right */}
            <div className="lg:w-[60%] px-6 py-12">
              <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-8">
                {filtered.length} Neighborhoods in {COUNTY_TABS.find(t => t.id === activeCounty)?.label}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((n) => (
                  <a
                    key={n.slug}
                    href={`/neighborhoods/${n.slug}/`}
                    className="group relative bg-neutral-900 border border-white/5 hover:border-white/20 transition-all p-6"
                  >
                    {/* Placeholder thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-950 mb-4 flex items-center justify-center">
                      <span className="text-neutral-700 text-xs uppercase tracking-widest">{n.name}</span>
                    </div>
                    <h3 className="font-playfair text-xl text-white mb-1">{n.name}</h3>
                    {n.tagline && <p className="text-neutral-500 text-xs uppercase tracking-wider mb-4">{n.tagline}</p>}
                    <div className="flex gap-2">
                      {n.propertyTypes.map((t) => (
                        <span key={t} className="bg-neutral-800 px-3 py-1 text-xs uppercase tracking-wider text-neutral-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "South Florida Neighborhoods | Andrew Whalen",
            url: "https://iamandrewwhalen.com/neighborhoods",
          }),
        }}
      />
    </>
  );
}
