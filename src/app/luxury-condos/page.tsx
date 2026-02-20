import { Metadata } from "next";
import { buildings } from "@/data/buildings";

export const metadata: Metadata = {
  title: "Miami Luxury Condo Buildings | Andrew Whalen",
  description:
    "Explore Miami's premier luxury condo buildings — Porsche Design Tower, Faena House, One Thousand Museum, and more. Market data, amenities, and available units.",
  openGraph: {
    title: "Miami Luxury Condo Buildings | Andrew Whalen",
    description:
      "Miami's most iconic luxury condo buildings with market data and available units.",
    type: "website",
    url: "https://iamandrewwhalen.com/luxury-condos",
  },
};

export default function LuxuryCondosPage() {
  const miamiDadeBuildings = buildings.filter((b) => b.county === "miami-dade");

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
              Miami-Dade County
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
            <span className="text-neutral-300">Luxury Condos</span>
          </nav>
        </div>
      </section>

      {/* County Links */}
      <section className="bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6">
          <span className="text-white text-sm uppercase tracking-wider border-b border-white pb-1">Miami-Dade</span>
          <a href="/luxury-condos/broward/" className="text-neutral-500 hover:text-white text-sm uppercase tracking-wider transition-colors">Broward</a>
          <a href="/luxury-condos/palm-beach/" className="text-neutral-500 hover:text-white text-sm uppercase tracking-wider transition-colors">Palm Beach</a>
        </div>
      </section>

      {/* Building Grid */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-10">
            {miamiDadeBuildings.length} Buildings in Miami-Dade County
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miamiDadeBuildings.map((b) => (
              <a
                key={b.slug}
                href={`/luxury-condos/${b.slug}/`}
                className="group p-8 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="w-full h-48 bg-neutral-800 mb-6 flex items-center justify-center">
                  <span className="text-neutral-600 text-sm">Photo Coming Soon</span>
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
            history for any building in South Florida.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 border border-white/30 text-white hover:bg-white/10 transition-all rounded-sm tracking-wider uppercase text-sm"
          >
            Get Building Details
          </a>
        </div>
      </section>

      {/* JSON-LD: Static hardcoded data, no user input */}
      <script
        type="application/ld+json"
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Miami Luxury Condo Buildings",
            description: "Premier luxury condo buildings in Miami, Florida.",
            url: "https://iamandrewwhalen.com/luxury-condos",
            numberOfItems: buildings.length,
            itemListElement: buildings.map((b, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Residence",
                name: b.name,
                description: b.description,
              },
            })),
          }),
        }}
      />
    </>
  );
}
