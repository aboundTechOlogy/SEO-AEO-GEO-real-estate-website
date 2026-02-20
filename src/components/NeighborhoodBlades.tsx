"use client";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const COUNTIES = [
  {
    id: "miami-dade",
    name: "Miami-Dade",
    tagline: "The Luxury Capital",
    href: "/neighborhoods/",
    gradient: "from-blue-950/90 to-cyan-950/70",
  },
  {
    id: "broward",
    name: "Broward",
    tagline: "Fort Lauderdale & Beyond",
    href: "/neighborhoods/#broward",
    gradient: "from-emerald-950/90 to-teal-950/70",
  },
  {
    id: "palm-beach",
    name: "Palm Beach",
    tagline: "The Gold Coast",
    href: "/neighborhoods/#palm-beach",
    gradient: "from-amber-950/80 to-orange-950/70",
  },
];

export default function NeighborhoodBlades() {
  const [active, setActive] = useState("miami-dade");

  return (
    <section className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="mb-10">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-2" data-reveal>Andrew Whalen</p>
          <h2 className="font-playfair text-5xl md:text-6xl uppercase tracking-wider text-white" data-reveal>
            Neighborhoods
          </h2>
        </ScrollReveal>

        {/* Desktop: click-to-expand blades */}
        <div className="hidden md:flex gap-2 h-[560px]">
          {COUNTIES.map((c) => (
            <div
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 ${
                active === c.id ? "flex-[2]" : "flex-1"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              {/* TODO: Replace with video background */}
              {/*
              <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src={`/${c.id}-aerial.mp4`} type="video/mp4" />
              </video>
              */}
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
              <div className={`absolute inset-0 transition-colors duration-500 ${
                active === c.id ? "bg-black/20" : "bg-black/50"
              }`} />

              <div className="relative h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div>
                  <h3 className={`font-playfair uppercase tracking-wider text-white transition-all duration-500 ${
                    active === c.id ? "text-3xl" : "text-2xl"
                  }`}>
                    {c.name}
                  </h3>
                  {active === c.id && (
                    <p className="text-neutral-400 text-sm mt-2 uppercase tracking-widest">{c.tagline}</p>
                  )}
                </div>
                <a
                  href={c.href}
                  onClick={(e) => e.stopPropagation()}
                  className="border border-white/30 rounded-full px-6 py-2 text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-all"
                >
                  Explore Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked blades */}
        <div className="flex flex-col gap-2 md:hidden">
          {COUNTIES.map((c) => (
            <a
              key={c.id}
              href={c.href}
              className="relative h-48 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full flex flex-col items-center justify-center gap-4">
                <h3 className="font-playfair text-2xl uppercase tracking-wider text-white">{c.name}</h3>
                <span className="border border-white/30 rounded-full px-6 py-2 text-xs uppercase tracking-wider text-white">
                  Explore Now
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/neighborhoods/"
            className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
          >
            View All Neighborhoods
          </a>
        </div>
      </div>
    </section>
  );
}
