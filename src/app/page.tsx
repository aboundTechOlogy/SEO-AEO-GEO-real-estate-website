import { Metadata } from "next";
import { developments } from "@/data/developments";

export const metadata: Metadata = {
  title: "Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Luxury real estate specialist serving Miami's most prestigious neighborhoods. New developments, market insights, and lifestyle expertise.",
};

const NEIGHBORHOODS = [
  { name: "Downtown Miami", tagline: "The New Urban Core", slug: "downtown-miami", hasGuide: true },
  { name: "Coconut Grove", tagline: "Bohemian Meets Bayfront", slug: "coconut-grove", hasGuide: true },
  { name: "Brickell", tagline: "Manhattan of the South", slug: "brickell", hasGuide: true },
  { name: "Miami Beach", tagline: "Iconic Oceanfront Living", slug: "miami-beach", hasGuide: true },
  { name: "Coral Gables", tagline: "The City Beautiful", slug: "coral-gables", hasGuide: true },
  { name: "Key Biscayne", tagline: "Island Paradise", slug: "key-biscayne", hasGuide: true },
  { name: "Sunny Isles", tagline: "Florida's Riviera", slug: "sunny-isles", hasGuide: false },
  { name: "Aventura", tagline: "Luxury Meets Convenience", slug: "aventura", hasGuide: false },
  { name: "Wynwood", tagline: "Art & Culture District", slug: "wynwood-midtown", hasGuide: false },
  { name: "Edgewater", tagline: "Bayfront Rising", slug: "edgewater", hasGuide: true },
];

const homepageDevelopments = developments.slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950" />
        <div className="absolute inset-0 opacity-20 bg-[url('/hero-placeholder.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
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

          <p className="text-sm text-neutral-500 mb-4">
            Start your AI-guided journey by selecting your real estate goal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Buy", "Sell", "Sell & Buy", "Invest"].map((goal) => (
              <button
                key={goal}
                className="px-8 py-3 border border-white/20 hover:border-white/50 text-sm tracking-[0.15em] uppercase text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">Neighborhood Guides</h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            Insider knowledge on Miami&apos;s most sought-after neighborhoods.
            Market data, lifestyle insights, and the developments reshaping each area.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEIGHBORHOODS.map((n) => (
              <a
                key={n.name}
                href={n.hasGuide ? `/neighborhoods/${n.slug}/` : `/neighborhoods/`}
                className="group p-6 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer rounded-sm block"
              >
                <h3 className="font-playfair text-xl mb-1 group-hover:text-white transition-colors">
                  {n.name}
                </h3>
                <p className="text-sm text-neutral-500">{n.tagline}</p>
                <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wider">
                  View Guide →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Developments Section */}
      <section id="developments" className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">New Developments</h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            The latest luxury developments transforming Miami&apos;s skyline.
            Pricing, floor plans, developer insights, and investment analysis.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {homepageDevelopments.map((d) => (
              <div
                key={d.name}
                className="group p-8 border border-white/5 hover:border-white/20 bg-neutral-950 transition-all rounded-sm"
              >
                <div className="w-full h-48 bg-neutral-800 rounded-sm mb-6 flex items-center justify-center">
                  <span className="text-neutral-600 text-sm">Rendering Coming Soon</span>
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

          <div className="mt-8 text-center">
            <a
              href="/new-construction/"
              className="inline-block px-6 py-2 text-sm uppercase tracking-wider border border-white/20 text-neutral-400 hover:text-white hover:border-white/40 transition-all"
            >
              View All Developments →
            </a>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section id="market" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">Market Insights</h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            Data-driven analysis of South Florida&apos;s luxury real estate market.
            Pricing trends, absorption rates, and investment opportunities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Median Luxury Price", value: "$2.4M", change: "+8.2%" },
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

      {/* How I Work Section */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-12">How I Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm">
              <div className="w-12 h-12 border border-white/10 rounded-sm flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-3">Market Intelligence</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Real-time market data and neighborhood analytics — not guesswork.
              </p>
            </div>
            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm">
              <div className="w-12 h-12 border border-white/10 rounded-sm flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-3">Instant Response</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                AI-powered concierge available 24/7 for any property or market question.
              </p>
            </div>
            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm">
              <div className="w-12 h-12 border border-white/10 rounded-sm flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-3">Data-Driven Decisions</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Every recommendation backed by comps, price-per-sqft, and trend data.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a
              href="/about/"
              className="inline-block px-6 py-2 text-sm uppercase tracking-wider border border-white/20 text-neutral-400 hover:text-white hover:border-white/40 transition-all"
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* Let's Connect CTA */}
      <section className="py-24 px-6">
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
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* RealEstateAgent JSON-LD */}
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
