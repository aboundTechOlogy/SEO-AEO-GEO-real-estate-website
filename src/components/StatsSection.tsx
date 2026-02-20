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
      {/* Mobile: sticky photo + scrolling individual stat boxes */}
      <section className="relative md:hidden">
        {/* Sticky photo background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src="/andrew-stats-v3.png"
            alt="Andrew Whalen"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '35% top' }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Stat boxes scroll over the photo — separate boxes with gaps so photo shows through */}
        <div className="relative" style={{ marginTop: "-100vh" }}>
          {/* Spacer so first box starts near bottom of viewport */}
          <div className="h-[60vh]" />

          <div className="space-y-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/60 backdrop-blur-sm py-14 px-6 text-center mx-8"
              >
                <p className="font-playfair text-5xl text-white mb-3">{stat.value}</p>
                <p className="text-sm uppercase tracking-wider text-neutral-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop: stats photo background with stat grid on right */}
      <section className="relative hidden md:block h-[550px] md:h-[600px] min-h-[550px] md:min-h-[600px] overflow-hidden">
        <img
          src="/andrew-stats-v3.png"
          alt="Andrew Whalen"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'left top' }}
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Stat grid pinned to right side where background is clean */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-12 lg:pr-20">
          <FadeInOnScroll scale>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-black/50 backdrop-blur-sm p-8 md:p-12 text-center">
                  <p className="font-playfair text-5xl md:text-6xl text-white">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wider text-neutral-300 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </>
  );
}
