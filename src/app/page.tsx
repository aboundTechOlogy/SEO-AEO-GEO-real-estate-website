import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Luxury real estate specialist serving Miami's most prestigious neighborhoods. New developments, market insights, and lifestyle expertise.",
};

const NEIGHBORHOODS = [
  { name: "Downtown Miami", tagline: "The New Urban Core", slug: "downtown-miami" },
  { name: "Coconut Grove", tagline: "Bohemian Meets Bayfront", slug: "coconut-grove" },
  { name: "Brickell", tagline: "Manhattan of the South", slug: "brickell" },
  { name: "Miami Beach", tagline: "Iconic Oceanfront Living", slug: "miami-beach" },
  { name: "Coral Gables", tagline: "The City Beautiful", slug: "coral-gables" },
  { name: "Key Biscayne", tagline: "Island Paradise", slug: "key-biscayne" },
  { name: "Sunny Isles", tagline: "Florida's Riviera", slug: "sunny-isles" },
  { name: "Aventura", tagline: "Luxury Meets Convenience", slug: "aventura" },
  { name: "Wynwood", tagline: "Art & Culture District", slug: "wynwood" },
  { name: "Edgewater", tagline: "Bayfront Rising", slug: "edgewater" },
];

const FEATURED_DEVELOPMENTS = [
  {
    name: "The Perigon",
    location: "Miami Beach",
    priceFrom: "$3.7M",
    units: "73 Residences",
    status: "Pre-Construction",
  },
  {
    name: "The Standard Residences",
    location: "Brickell",
    priceFrom: "$750K",
    units: "228 Residences",
    status: "Under Construction",
  },
  {
    name: "Vida Residences",
    location: "Edgewater",
    priceFrom: "$640K",
    units: "400 Residences",
    status: "Under Construction",
  },
  {
    name: "Ella",
    location: "Miami Beach",
    priceFrom: "$890K",
    units: "120 Residences",
    status: "Pre-Construction",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background — will be replaced with actual imagery */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950" />
        <div className="absolute inset-0 opacity-20 bg-[url('/hero-placeholder.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Minimal logo mark */}
          <p className="text-sm font-light tracking-[0.4em] uppercase text-neutral-500 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
            Andrew Whalen
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl font-light tracking-tight mb-6">
            South Florida
            <br />
            Luxury Real Estate
          </h1>
          <p className="text-lg text-neutral-400 font-light max-w-xl mx-auto mb-12 leading-relaxed">
            New developments. Neighborhood intelligence. Lifestyle expertise.
          </p>

          {/* Goal Selection — Routes to AI concierge in Phase 3 */}
          <p className="text-sm text-neutral-500 mb-4">
            Start your AI-guided journey by selecting your real estate goal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-8 py-3 border border-white/20 hover:border-white/50 text-sm tracking-[0.15em] uppercase text-neutral-300 hover:text-white hover:bg-white/5 transition-all">
              Buy
            </button>
            <button className="px-8 py-3 border border-white/20 hover:border-white/50 text-sm tracking-[0.15em] uppercase text-neutral-300 hover:text-white hover:bg-white/5 transition-all">
              Sell
            </button>
            <button className="px-8 py-3 border border-white/20 hover:border-white/50 text-sm tracking-[0.15em] uppercase text-neutral-300 hover:text-white hover:bg-white/5 transition-all">
              Sell & Buy
            </button>
            <button className="px-8 py-3 border border-white/20 hover:border-white/50 text-sm tracking-[0.15em] uppercase text-neutral-300 hover:text-white hover:bg-white/5 transition-all">
              Invest
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-5 h-5 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">
            Neighborhood Guides
          </h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            Insider knowledge on Miami&apos;s most sought-after neighborhoods.
            Market data, lifestyle insights, and the developments reshaping each
            area.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEIGHBORHOODS.map((n) => {
              const hasPage = ["brickell", "coconut-grove", "miami-beach", "coral-gables", "key-biscayne", "downtown-miami", "edgewater"].includes(n.slug);
              const Wrapper = hasPage ? "a" : "div";
              const linkProps = hasPage ? { href: `/neighborhoods/${n.slug}` } : {};
              return (
                <Wrapper
                  key={n.name}
                  {...linkProps}
                  className="group p-6 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer rounded-sm block"
                >
                  <h3 className="font-playfair text-xl mb-1 group-hover:text-white transition-colors">
                    {n.name}
                  </h3>
                  <p className="text-sm text-neutral-500">{n.tagline}</p>
                  {hasPage && (
                    <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wider">
                      View Guide →
                    </p>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Developments Section */}
      <section
        id="developments"
        className="py-24 px-6 bg-neutral-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">
            New Developments
          </h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            The latest luxury developments transforming Miami&apos;s skyline.
            Pricing, floor plans, developer insights, and investment analysis.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED_DEVELOPMENTS.map((d) => (
              <div
                key={d.name}
                className="group p-8 border border-white/5 hover:border-white/20 bg-neutral-950 transition-all rounded-sm"
              >
                {/* Placeholder for development image */}
                <div className="w-full h-48 bg-neutral-800 rounded-sm mb-6 flex items-center justify-center">
                  <span className="text-neutral-600 text-sm">
                    Rendering Coming Soon
                  </span>
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-playfair text-2xl group-hover:text-white transition-colors">
                      {d.name}
                    </h3>
                    <p className="text-sm text-neutral-500">{d.location}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 bg-white/5 px-3 py-1 rounded-full">
                    {d.status}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-neutral-400">
                  <span>From {d.priceFrom}</span>
                  <span>{d.units}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section id="market" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">
            Market Insights
          </h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            Data-driven analysis of South Florida&apos;s luxury real estate
            market. Pricing trends, absorption rates, and investment
            opportunities.
          </p>

          {/* Placeholder for market data — Phase 2 will pull from PostGIS */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Median Luxury Price",
                value: "$2.4M",
                change: "+8.2%",
              },
              { label: "Avg Days on Market", value: "67", change: "-12%" },
              { label: "New Developments", value: "50+", change: "Active" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-8 border border-white/5 bg-white/[0.02] rounded-sm text-center"
              >
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <p className="font-playfair text-4xl text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-400">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="gold-line mb-6" />
              <p className="text-sm font-light tracking-[0.25em] uppercase text-neutral-500 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>About</p>
              <h2 className="font-playfair text-4xl mb-6">
                Andrew Whalen
              </h2>
              <p className="text-neutral-300 leading-relaxed mb-4">
                South Florida luxury real estate specialist with deep knowledge
                of Miami&apos;s most prestigious neighborhoods, new developments,
                and the high-status lifestyle that draws discerning buyers from
                around the world.
              </p>
              <p className="text-neutral-400 leading-relaxed mb-8">
                Whether you&apos;re seeking a waterfront penthouse in Brickell, a
                historic estate in Coconut Grove, or a pre-construction
                opportunity in one of Miami&apos;s hottest new developments — I
                provide the market intelligence and insider access to help you
                make confident decisions.
              </p>
              <div className="text-sm text-neutral-500">
                <p>LoKation Real Estate</p>
                <p>1900 N Bayshore Dr, Suite 120, Miami, FL 33132</p>
              </div>
            </div>
            {/* Placeholder for professional photo */}
            <div className="w-full h-96 bg-neutral-800 rounded-sm flex items-center justify-center">
              <span className="text-neutral-600 text-sm">
                Professional Photo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-playfair text-4xl mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-neutral-400 mb-10">
            Ready to explore Miami&apos;s luxury market? Whether you&apos;re
            buying, investing, or just curious about a neighborhood — I&apos;m
            here to help.
          </p>
          <a
            href="mailto:andrew@iamandrewwhalen.com"
            className="inline-block px-8 py-3 bg-white hover:bg-neutral-200 text-neutral-950 transition-colors rounded-sm tracking-wider uppercase text-sm"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* RealEstateAgent JSON-LD — Required for Entity Home */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Andrew Whalen",
            description:
              "South Florida luxury real estate specialist serving Miami's most prestigious neighborhoods.",
            url: "https://iamandrewwhalen.com",
            telephone: "+1-305-420-6613",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1900 N Bayshore Dr, Suite 120",
              addressLocality: "Miami",
              addressRegion: "FL",
              postalCode: "33132",
              addressCountry: "US",
            },
            sameAs: [
              "https://www.linkedin.com/in/andrewwhalen",
              "https://www.youtube.com/@andrewwhalen",
              "https://www.instagram.com/andrewwhalen",
            ],
            worksFor: {
              "@type": "RealEstateAgent",
              name: "LoKation Real Estate",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1900 N Bayshore Dr, Suite 120",
                addressLocality: "Miami",
                addressRegion: "FL",
                postalCode: "33132",
                addressCountry: "US",
              },
              telephone: "+1-305-420-6613",
            },
            areaServed: [
              "Downtown Miami",
              "Coconut Grove",
              "Brickell",
              "Miami Beach",
              "Coral Gables",
              "Key Biscayne",
              "Sunny Isles Beach",
              "Aventura",
              "Wynwood",
              "Fort Lauderdale",
            ],
          }),
        }}
      />
    </>
  );
}
