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
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <p
            className="text-sm font-light tracking-[0.25em] uppercase text-neutral-500 mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Luxury Condos
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-light mb-4">
            Miami&apos;s Premier Condo Buildings
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            From branded residences to architectural icons — explore the
            buildings that define Miami&apos;s luxury condo market.
          </p>
        </div>
      </section>

      {/* Building Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((b) => (
              <div
                key={b.slug}
                className="group p-8 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-sm"
              >
                {/* Placeholder image */}
                <div className="w-full h-48 bg-neutral-800 rounded-sm mb-6 flex items-center justify-center">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-neutral-500 text-sm">
            Full building profiles with market data, amenities, and available
            units coming soon.
          </p>
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
            history for any building in Miami.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
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
