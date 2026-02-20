"use client";
import { useState } from "react";
import { neighborhoods } from "@/data/neighborhoods";

const COUNTY_TABS = [
  { id: "miami-dade", label: "Miami-Dade" },
  { id: "broward", label: "Broward" },
  { id: "palm-beach", label: "Palm Beach" },
];

// Add a few placeholder Broward/Palm Beach neighborhoods
const BROWARD_PLACEHOLDER = [
  { slug: "fort-lauderdale", name: "Fort Lauderdale", tagline: "Venice of America", county: "broward" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
  { slug: "las-olas", name: "Las Olas", tagline: "Dining & Waterfront Living", county: "broward" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
  { slug: "hallandale-beach", name: "Hallandale Beach", tagline: "Oceanfront Value", county: "broward" as const, propertyTypes: ["CONDOS" as const] },
  { slug: "hollywood", name: "Hollywood Beach", tagline: "Boardwalk Lifestyle", county: "broward" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
];

const PALM_BEACH_PLACEHOLDER = [
  { slug: "palm-beach", name: "Palm Beach", tagline: "The Ultimate Address", county: "palm-beach" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
  { slug: "west-palm-beach", name: "West Palm Beach", tagline: "Waterfront Renaissance", county: "palm-beach" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
  { slug: "boca-raton", name: "Boca Raton", tagline: "Planned Luxury Living", county: "palm-beach" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
  { slug: "delray-beach", name: "Delray Beach", tagline: "Downtown by the Beach", county: "palm-beach" as const, propertyTypes: ["HOMES" as const, "CONDOS" as const] },
];

type NeighborhoodItem = {
  slug: string;
  name: string;
  tagline?: string;
  county: "miami-dade" | "broward" | "palm-beach";
  propertyTypes: ("HOMES" | "CONDOS")[];
};

export default function NeighborhoodsPage() {
  const [activeCounty, setActiveCounty] = useState<"miami-dade" | "broward" | "palm-beach">("miami-dade");

  const allNeighborhoods: NeighborhoodItem[] = [
    ...neighborhoods.map(n => ({ slug: n.slug, name: n.name, tagline: n.tagline, county: n.county, propertyTypes: n.propertyTypes })),
    ...BROWARD_PLACEHOLDER,
    ...PALM_BEACH_PLACEHOLDER,
  ];

  const filtered = allNeighborhoods.filter(n => n.county === activeCounty);

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
            {/* Map placeholder — desktop left */}
            <div className="hidden lg:flex lg:w-[40%] min-h-[600px] bg-neutral-900 border-r border-white/5 items-center justify-center sticky top-32 self-start h-[calc(100vh-8rem)]">
              <div className="text-center px-6">
                <p className="text-neutral-600 text-sm uppercase tracking-widest mb-2">Interactive Map</p>
                <p className="text-neutral-700 text-xs">Coming Soon</p>
              </div>
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
