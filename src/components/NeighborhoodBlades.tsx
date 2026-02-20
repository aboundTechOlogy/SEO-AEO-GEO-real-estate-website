"use client";

import FadeInOnScroll from "@/components/FadeInOnScroll";

const COUNTIES = [
  {
    name: "Miami-Dade",
    href: "/neighborhoods/",
    gradient: "from-blue-900/80 to-cyan-900/60",
  },
  {
    name: "Broward",
    href: "/neighborhoods/broward/",
    gradient: "from-emerald-900/80 to-teal-900/60",
  },
  {
    name: "Palm Beach",
    href: "/neighborhoods/palm-beach/",
    gradient: "from-amber-900/60 to-orange-950/60",
  },
];

export default function NeighborhoodBlades() {
  return (
    <section className="py-20 md:py-28 px-6 bg-[#0a0a0a]">
      <FadeInOnScroll>
        <h2 className="font-playfair text-4xl md:text-5xl uppercase tracking-wide text-center mb-12">
          Neighborhoods
        </h2>

        {/* Desktop: 3 side-by-side expandable blades */}
        <div className="hidden md:flex gap-2 h-[500px] md:h-[600px] max-w-7xl mx-auto group/blades">
          {COUNTIES.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="relative flex-1 hover:flex-[2] overflow-hidden transition-all duration-500 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

              <div className="relative h-full flex flex-col items-center justify-center gap-6">
                <h3 className="font-playfair text-2xl md:text-3xl uppercase tracking-wider text-white text-center">
                  {c.name}
                </h3>
                <span className="border border-white/30 rounded-full px-6 py-2 text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-all">
                  Explore Now
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile: stacked blades */}
        <div className="flex flex-col gap-2 md:hidden">
          {COUNTIES.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="relative h-48 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative h-full flex flex-col items-center justify-center gap-4">
                <h3 className="font-playfair text-2xl uppercase tracking-wider text-white">
                  {c.name}
                </h3>
                <span className="border border-white/30 rounded-full px-6 py-2 text-xs uppercase tracking-wider text-white">
                  Explore Now
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <a
            href="/neighborhoods/"
            className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
          >
            View All Neighborhoods
          </a>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
