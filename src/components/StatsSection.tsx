"use client";

import FadeInOnScroll from "@/components/FadeInOnScroll";

const STATS = [
  { value: "1,300+", label: "Transactions Closed" },
  { value: "21+", label: "Years of Experience" },
  { value: "$500M+", label: "Career Sales Volume" },
  { value: "40+", label: "Neighborhoods Served" },
];

export default function StatsSection() {
  return (
    <>
      {/* Mobile/Tablet: sticky photo + scrolling individual stat boxes */}
      <section className="relative lg:hidden">
        {/* Sticky photo background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src="/andrew-stats-mobile.png"
            alt="Andrew Whalen"
            className="absolute inset-0 w-full h-full object-cover object-center-top"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Stat boxes scroll over the photo — separate boxes with gaps so photo shows through */}
        <div className="relative" style={{ marginTop: "-100vh" }}>
          {/* Spacer so first box starts near bottom of viewport */}
          <div className="h-[75vh]" />

          <div className="space-y-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/75 backdrop-blur-sm py-14 px-6 text-center mx-8"
              >
                <p className="font-playfair text-5xl text-white mb-3">{stat.value}</p>
                <p className="text-sm uppercase tracking-wider text-neutral-300">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Meet Andrew bio — scrolls over same sticky photo on mobile */}
          <div className="bg-[#0a0a0a] py-16 px-6 mt-6">
            <p className="font-playfair italic text-lg text-neutral-400">LoKation Real Estate</p>
            <h2 className="font-playfair text-4xl uppercase tracking-wide text-white mt-2 mb-4">MEET ANDREW</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-10">SERVING MIAMI, FORT LAUDERDALE AND PALM BEACH.</p>
            <p className="text-neutral-300 leading-relaxed mb-6">Andrew Whalen has built a reputation as one of South Florida&apos;s most dedicated and knowledgeable real estate professionals. With over 1,300 transactions closed and 21+ years of experience across Miami-Dade&apos;s most competitive neighborhoods, Andrew combines deep market expertise with a data-driven approach that consistently delivers results for his clients.</p>
            <p className="text-neutral-300 leading-relaxed mb-8">With a career spanning over two decades, Andrew delivers a comprehensive level of concierge-style service with extensive experience across every level of real estate — including investment analysis, negotiation, new development sales, and marketing. Leveraging cutting-edge technology and AI-powered market intelligence, Andrew provides his clients with unmatched insights and exposure in South Florida&apos;s luxury market.</p>
            <a href="/about/" className="text-sm uppercase tracking-wider text-white hover:text-neutral-300 transition-colors">Meet Andrew →</a>
          </div>
        </div>
      </section>

      {/* Desktop: stats photo background with stat grid on right */}
      <section className="relative hidden lg:block h-[85vh] overflow-hidden">
        <img
          src="/andrew-stats-v3.png"
          alt="Andrew Whalen"
          className="absolute inset-0 w-full h-full object-cover stats-image-desktop"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Stat grid — top-right */}
        <div className="absolute top-0 right-0 pt-8 lg:pt-12 pr-4">
          <FadeInOnScroll scale>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-black/70 backdrop-blur-sm p-8 md:p-12 text-center">
                  <p className="font-playfair text-5xl md:text-6xl text-white">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wider text-neutral-300 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInOnScroll>
        </div>

        {/* Large name watermark at bottom */}
        <p className="absolute bottom-0 left-0 right-0 font-playfair text-[8rem] lg:text-[10rem] uppercase text-black/15 leading-none whitespace-nowrap pointer-events-none select-none text-center overflow-hidden">
          ANDREW WHALEN
        </p>
      </section>
    </>
  );
}
