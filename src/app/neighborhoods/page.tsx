import { Metadata } from "next";
import { neighborhoods } from "@/data/neighborhoods";

export const metadata: Metadata = {
  title: "Miami Luxury Neighborhoods | Andrew Whalen",
  description:
    "Explore Miami's most prestigious luxury neighborhoods. Market data, lifestyle insights, and expert guides for Brickell, Miami Beach, Coconut Grove, Coral Gables, and more.",
  openGraph: {
    title: "Miami Luxury Neighborhoods | Andrew Whalen",
    description:
      "Insider knowledge on Miami-Dade's most sought-after neighborhoods.",
    type: "website",
    url: "https://iamandrewwhalen.com/neighborhoods",
  },
};

export default function NeighborhoodsPage() {
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
            Neighborhood Guides
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-light mb-4">
            Miami&apos;s Luxury Neighborhoods
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Insider knowledge on Miami-Dade&apos;s most sought-after
            neighborhoods. Market data, lifestyle insights, and the developments
            reshaping each area.
          </p>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-64 bg-neutral-900 border border-white/5 rounded-sm flex items-center justify-center">
            <span className="text-neutral-600 text-sm">
              Interactive Map Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((n) => {
              const hasGuide = n.hasGuidePage === true;
              return (
                <div
                  key={n.slug}
                  className="group p-8 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-sm"
                >
                  <div className="flex items-start justify-between mb-1">
                    {hasGuide ? (
                      <a
                        href={`/neighborhoods/${n.slug}/`}
                        className="font-playfair text-xl hover:text-white transition-colors"
                      >
                        {n.name}
                      </a>
                    ) : (
                      <span className="font-playfair text-xl">{n.name}</span>
                    )}
                    {!hasGuide && (
                      <span className="text-[10px] uppercase tracking-wider text-neutral-600 bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mb-6">{n.tagline}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Median
                      </p>
                      <p className="text-sm text-neutral-300">
                        {n.stats.medianPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Avg DOM
                      </p>
                      <p className="text-sm text-neutral-300">
                        {n.stats.avgDom} days
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={hasGuide ? `/neighborhoods/${n.slug}/` : `/neighborhoods/`}
                      className="flex-1 text-center py-2 text-xs uppercase tracking-wider border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all"
                    >
                      Homes
                    </a>
                    <a
                      href={hasGuide ? `/neighborhoods/${n.slug}/` : `/neighborhoods/`}
                      className="flex-1 text-center py-2 text-xs uppercase tracking-wider border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all"
                    >
                      Condos
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl mb-4">
            Not Sure Which Neighborhood?
          </h2>
          <p className="text-neutral-400 mb-10">
            I&apos;ll help you find the right fit based on your lifestyle,
            budget, and goals.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
          >
            Let&apos;s Talk
          </a>
        </div>
      </section>

      {/* Structured data — static hardcoded content, safe for dangerouslySetInnerHTML */}
      <script
        type="application/ld+json"
        /* eslint-disable-next-line -- static trusted JSON-LD, no user input */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Miami Luxury Neighborhoods",
            description:
              "Guide to Miami's most prestigious luxury neighborhoods.",
            url: "https://iamandrewwhalen.com/neighborhoods",
            numberOfItems: neighborhoods.length,
            itemListElement: neighborhoods.map((n, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Place",
                name: n.name,
                description: n.heroDescription,
                url: `https://iamandrewwhalen.com/neighborhoods/${n.slug}`,
              },
            })),
          }),
        }}
      />
    </>
  );
}
