import { Metadata } from "next";
import { developments } from "@/data/developments";

export const metadata: Metadata = {
  title: "New Construction & Pre-Construction Miami | Andrew Whalen",
  description:
    "Miami's newest luxury developments — pre-construction pricing, floor plans, developer incentives, and investment analysis for South Florida's hottest new towers.",
  openGraph: {
    title: "New Construction & Pre-Construction Miami | Andrew Whalen",
    description:
      "Explore Miami's newest luxury developments with pre-construction pricing and developer incentives.",
    type: "website",
    url: "https://iamandrewwhalen.com/new-construction",
  },
};

export default function NewConstructionPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-sm font-light tracking-[0.25em] uppercase text-neutral-500 mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            New Development
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-light mb-4">
            New Construction &amp; Pre-Construction
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Miami&apos;s development pipeline is one of the most active in the
            world. From pre-construction opportunities to recently delivered
            towers — explore the projects reshaping the skyline.
          </p>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-64 bg-neutral-900 border border-white/5 rounded-sm flex items-center justify-center">
            <span className="text-neutral-600 text-sm">
              Development Map Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Development Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {developments.map((d) => (
              <div
                key={d.slug}
                className="group p-8 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-sm"
              >
                {/* Placeholder image */}
                <div className="w-full h-48 bg-gradient-to-br from-neutral-700/30 to-neutral-800 rounded-sm mb-6 flex flex-col items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                  <span className="text-neutral-600 text-[10px] uppercase tracking-widest">{d.status}</span>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-playfair text-2xl group-hover:text-white transition-colors">
                      {d.name}
                    </h2>
                    <p className="text-sm text-neutral-500">{d.location}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 bg-white/5 px-3 py-1 rounded-full shrink-0">
                    {d.status}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-neutral-400 mb-3">
                  <span>From {d.priceFrom}</span>
                  <span>{d.units}</span>
                  <span>Est. {d.completionYear}</span>
                </div>

                <p className="text-sm text-neutral-500 mb-2">
                  {d.developer}
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl mb-4">
            Interested in Pre-Construction?
          </h2>
          <p className="text-neutral-400 mb-10">
            Contact me for pricing, floor plans, and developer incentives.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
          >
            Get Details
          </a>
        </div>
      </section>

      {/* JSON-LD: Static hardcoded structured data — no user input */}
      <script
        type="application/ld+json"
        /* eslint-disable-next-line react/no-danger -- static trusted JSON-LD */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Miami New Construction Developments",
            description:
              "New luxury developments in Miami with pre-construction pricing.",
            url: "https://iamandrewwhalen.com/new-construction",
            numberOfItems: developments.length,
            itemListElement: developments.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Residence",
                name: d.name,
                description: d.description,
              },
            })),
          }),
        }}
      />
    </>
  );
}
