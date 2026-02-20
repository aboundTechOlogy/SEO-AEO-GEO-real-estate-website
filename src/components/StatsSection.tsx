"use client";

const STATS = [
  { value: "1,300+", label: "Transactions Closed" },
  { value: "21+", label: "Years of Experience" },
  { value: "$500M+", label: "Career Sales Volume" },
  { value: "40+", label: "Neighborhoods Served" },
];

export default function StatsSection() {
  return (
    <>
      {/* Mobile: sticky photo + scrolling stat cards */}
      <section className="relative md:hidden">
        {/* Sticky photo background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src="/andrew-fullbody.png"
            alt="Andrew Whalen"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Stat cards scroll over the photo */}
        <div className="relative" style={{ marginTop: "-100vh" }}>
          {/* Spacer so first card starts near bottom of viewport */}
          <div className="h-[60vh]" />

          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-black/60 backdrop-blur-sm py-12 px-6 text-center"
            >
              <p className="font-playfair text-5xl text-white mb-3">{stat.value}</p>
              <p className="text-sm uppercase tracking-wider text-neutral-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop: side-by-side layout */}
      <section className="relative hidden md:block h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900" />
        <div className="relative h-full max-w-7xl mx-auto flex flex-row items-stretch">
          {/* Photo — left 40% */}
          <div className="relative w-[40%] h-full shrink-0">
            <img
              src="/andrew-fullbody.png"
              alt="Andrew Whalen"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900" />
          </div>

          {/* Stats grid — right 60% */}
          <div className="flex-1 flex items-center justify-center px-12">
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/[0.04] backdrop-blur-sm p-8 text-center">
                  <p className="font-playfair text-5xl text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
