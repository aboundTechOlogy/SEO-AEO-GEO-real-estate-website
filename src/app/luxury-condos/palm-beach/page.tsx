import { Metadata } from "next";
import { buildings } from "@/data/buildings";

export const metadata: Metadata = {
  title: "Palm Beach County Luxury Condos | Andrew Whalen",
  description:
    "Explore Palm Beach County luxury condo buildings — The Bristol, Via Mizner, Azure, and more. Andrew Whalen, South Florida luxury real estate.",
  openGraph: {
    title: "Palm Beach County Luxury Condos | Andrew Whalen",
    description:
      "Palm Beach County luxury condo buildings with Andrew Whalen, South Florida luxury real estate specialist.",
    type: "website",
    url: "https://iamandrewwhalen.com/luxury-condos/palm-beach",
  },
};

export default function PalmBeachCondosPage() {
  const palmBeachBuildings = buildings.filter(
    (b) => b.county === "palm-beach"
  );

  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">
              Andrew Whalen
            </p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">
              Palm Beach County
            </h1>
            <p className="text-neutral-300 text-lg mt-3">Luxury Condos</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <a
              href="/luxury-condos/"
              className="hover:text-white transition-colors"
            >
              Luxury Condos
            </a>
            <span>/</span>
            <span className="text-neutral-300">Palm Beach County</span>
          </nav>
        </div>
      </section>

      {/* Building Grid */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-10">
            {palmBeachBuildings.length} Buildings in Palm Beach County
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {palmBeachBuildings.map((b) => (
              <a
                key={b.slug}
                href={`/luxury-condos/${b.slug}/`}
                className="group p-8 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="w-full h-48 bg-neutral-800 mb-6 flex items-center justify-center">
                  <span className="text-neutral-600 text-sm">
                    Photo Coming Soon
                  </span>
                </div>
                <h2 className="font-playfair text-xl mb-1 group-hover:text-white transition-colors">
                  {b.name}
                </h2>
                <p className="text-sm text-neutral-500 mb-3">
                  {b.neighborhood}
                </p>
                <p className="text-xs text-neutral-400 mb-4">
                  {b.yearBuilt} &middot; {b.units} Units &middot; {b.floors}{" "}
                  Floors
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {b.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl mb-4">
            Looking for a Specific Building?
          </h2>
          <p className="text-neutral-400 mb-10">
            I can provide detailed market data, available units, and pricing
            history for any building in Palm Beach County.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 border border-white/30 text-white hover:bg-white/10 transition-all tracking-wider uppercase text-sm"
          >
            Get Building Details
          </a>
        </div>
      </section>
    </>
  );
}
