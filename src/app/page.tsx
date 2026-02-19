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
        {/* Background: image now, replace with <video> later for aerial Miami footage */}
        {/* To switch to video: replace the img tag with:
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
        */}
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0a0a0a]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <p className="text-sm font-light tracking-[0.4em] uppercase text-white/80 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
            Andrew Whalen
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl font-light tracking-tight mb-6 text-white">
            South Florida
            <br />
            Luxury Real Estate
          </h1>
          <p className="text-lg text-white/80 font-light max-w-xl mx-auto mb-12 leading-relaxed">
            New developments. Neighborhood intelligence. Lifestyle expertise.
          </p>

          <p className="text-base text-white tracking-wide mb-5">
            Start your AI-guided journey by selecting your real estate goal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Buy", "Sell", "Sell & Buy", "Invest"].map((goal) => (
              <button
                key={goal}
                className="px-8 py-3 border border-white/30 hover:border-white/70 text-sm tracking-[0.15em] uppercase text-white hover:bg-white/10 transition-all"
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

      {/* Property Search Section */}
      <section className="py-10 px-6 bg-neutral-900 border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
            Property Search
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by address, neighborhood, or building..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-neutral-600 px-6 py-4 text-lg pr-12 focus:outline-none focus:border-white/30 transition-colors"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <a
              href="/search/"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 text-sm uppercase tracking-wider transition-colors text-center shrink-0"
            >
              Search
            </a>
          </div>
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {NEIGHBORHOODS.map((n) => (
              <div
                key={n.name}
                className="group border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-sm overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-40 bg-neutral-800/50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/40" />
                  <svg className="w-6 h-6 text-neutral-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl mb-1 group-hover:text-white transition-colors">
                    {n.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-3">{n.tagline}</p>
                  <a
                    href={n.hasGuide ? `/neighborhoods/${n.slug}/` : `/neighborhoods/`}
                    className="text-xs text-neutral-500 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    View Guide →
                  </a>
                  <div className="flex gap-3 mt-4">
                    <a
                      href={n.hasGuide ? `/neighborhoods/${n.slug}/` : `/neighborhoods/`}
                      className="flex-1 text-center py-2 text-xs uppercase tracking-wider border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all"
                    >
                      Homes
                    </a>
                    <a
                      href={n.hasGuide ? `/neighborhoods/${n.slug}/` : `/neighborhoods/`}
                      className="flex-1 text-center py-2 text-xs uppercase tracking-wider border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all"
                    >
                      Condos
                    </a>
                  </div>
                </div>
              </div>
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
                <div className="w-full h-48 bg-gradient-to-br from-neutral-700/30 to-neutral-800 rounded-sm mb-6 flex flex-col items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                  <span className="text-neutral-600 text-[10px] uppercase tracking-widest">{d.status}</span>
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
      <section id="market" className="py-24 px-6 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-4">Market Insights</h2>
          <p className="text-neutral-400 mb-12 max-w-xl">
            Data-driven analysis of South Florida&apos;s luxury real estate market.
            Pricing trends, absorption rates, and investment opportunities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Median Luxury Price", value: "$2.4M", change: "+8.2%", positive: true },
              { label: "Avg Days on Market", value: "67", change: "-12%", positive: true },
              { label: "New Developments", value: "50+", change: "Active", positive: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-8 border border-white/5 bg-white/[0.02] rounded-sm text-center"
              >
                <div className="w-12 h-0.5 bg-amber-600/50 mx-auto mb-4" />
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-3">
                  {stat.label}
                </p>
                <p className="font-playfair text-5xl md:text-6xl text-white mb-2">
                  {stat.value}
                </p>
                <p className={`text-sm ${stat.positive ? "text-emerald-500/70" : "text-neutral-400"}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section className="py-24 px-6 bg-neutral-900/50 relative overflow-hidden">
        {/* AW watermark */}
        <div className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
          AW
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="gold-line mb-6" />
          <h2 className="font-playfair text-4xl mb-16">How I Work</h2>

          <div className="flex flex-col md:flex-row gap-16 md:gap-12">
            {[
              {
                num: "01",
                title: "Market Intelligence",
                desc: "Real-time market data and neighborhood analytics power every conversation. I track pricing trends, absorption rates, and inventory shifts across Miami-Dade so you never rely on guesswork or outdated comps.",
              },
              {
                num: "02",
                title: "Instant Response",
                desc: "An AI-powered concierge handles your questions 24/7 — property details, market comparisons, and neighborhood insights on demand. You get answers in seconds, not days, whether it\u2019s midnight or midday.",
              },
              {
                num: "03",
                title: "Data-Driven Decisions",
                desc: "Every recommendation is backed by comps, price-per-square-foot analysis, and trend data. No pressure tactics, no emotional selling — just clear numbers that help you make confident moves.",
              },
            ].map((item) => (
              <div key={item.num} className="flex-1 relative">
                <span className="font-playfair text-6xl text-white/5 absolute -top-4 -left-2">
                  {item.num}
                </span>
                <div className="pt-10">
                  <h3 className="font-playfair text-xl mb-3">{item.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
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
