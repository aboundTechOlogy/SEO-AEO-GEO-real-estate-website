import { Metadata } from "next";
import { developments } from "@/data/developments";

export const metadata: Metadata = {
  title: "New Construction & Pre-Construction | South Florida | Andrew Whalen",
  description:
    "South Florida's newest luxury developments — pre-construction pricing, floor plans, developer incentives, and investment analysis across Miami-Dade, Broward, and Palm Beach counties.",
  openGraph: {
    title: "New Construction & Pre-Construction | Andrew Whalen",
    description:
      "Explore South Florida's newest luxury developments with pre-construction pricing and developer incentives.",
    type: "website",
    url: "https://iamandrewwhalen.com/new-construction",
  },
};

export default function NewConstructionPage() {
  const counties = [
    { label: "Miami-Dade", value: "miami-dade" },
    { label: "Broward", value: "broward" },
    { label: "Palm Beach", value: "palm-beach" },
  ];

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
              New Construction
            </h1>
            <p className="text-neutral-300 text-lg mt-3">
              Pre-Construction &amp; Recently Delivered
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
            <a href="/" className="hover:text-[#1a1a1a] transition-colors">
              Home
            </a>
            <span>/</span>
            <a
              href="/luxury-condos/"
              className="hover:text-[#1a1a1a] transition-colors"
            >
              Luxury Condos
            </a>
            <span>/</span>
            <span className="text-gray-600">New Construction</span>
          </nav>
        </div>
      </section>

      {/* County Sections */}
      {counties.map((county) => {
        const countyDevs = developments.filter(
          (d) => d.county === county.value
        );
        if (countyDevs.length === 0) return null;

        return (
          <section
            key={county.value}
            className="py-16 px-6 bg-white border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl text-[#1a1a1a] mb-2">
                {county.label} County
              </h2>
              <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-10">
                {countyDevs.length}{" "}
                {countyDevs.length === 1 ? "Development" : "Developments"}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {countyDevs.map((d) => (
                  <div
                    key={d.slug}
                    className="group p-8 border border-gray-200 bg-white hover:border-gray-300 shadow-sm transition-all"
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 mb-6 flex flex-col items-center justify-center gap-3">
                      <svg
                        className="w-8 h-8 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                        />
                      </svg>
                      <span className="text-neutral-600 text-[10px] uppercase tracking-widest">
                        {d.status}
                      </span>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-playfair text-2xl group-hover:text-[#1a1a1a] transition-colors">
                          {d.name}
                        </h3>
                        <p className="text-sm text-neutral-500">{d.location}</p>
                      </div>
                      <span className="text-xs uppercase tracking-wider text-gray-600 bg-gray-100 px-3 py-1 rounded-full shrink-0">
                        {d.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span>From {d.priceFrom}</span>
                      <span>{d.units}</span>
                      <span>Est. {d.completionYear}</span>
                    </div>

                    <p className="text-sm text-neutral-500 mb-2">
                      {d.developer}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl mb-4">
            Interested in Pre-Construction?
          </h2>
          <p className="text-gray-600 mb-10">
            Contact me for pricing, floor plans, and developer incentives across
            South Florida.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 border border-gray-300 text-[#1a1a1a] hover:bg-gray-100 transition-colors tracking-wider uppercase text-sm"
          >
            Get Details
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "South Florida New Construction Developments",
            description:
              "New luxury developments across Miami-Dade, Broward, and Palm Beach counties.",
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
