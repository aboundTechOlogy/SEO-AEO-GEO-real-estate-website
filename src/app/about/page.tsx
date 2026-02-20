import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Andrew Whalen | Miami Luxury Real Estate Specialist",
  description:
    "1,300+ transactions, 20+ years of experience. Andrew Whalen is a South Florida luxury real estate specialist serving Miami's most prestigious neighborhoods.",
  openGraph: {
    title: "About Andrew Whalen | Miami Luxury Real Estate Specialist",
    description:
      "1,300+ transactions, 20+ years of experience. South Florida luxury real estate specialist.",
    type: "profile",
    url: "https://iamandrewwhalen.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-96 bg-neutral-800 flex items-center justify-center">
          <span className="absolute text-neutral-700 text-sm">Lifestyle Photo</span>
          <div className="relative z-10 text-center px-6">
            <p
              className="text-sm font-light tracking-[0.25em] uppercase text-neutral-500 mb-4"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              About
            </p>
            <h1 className="font-playfair text-5xl font-light mb-3">
              Andrew Whalen
            </h1>
            <p className="text-lg text-neutral-400">
              Realtor&reg; &middot; South Florida Luxury Specialist
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 px-6 bg-neutral-900/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-playfair text-4xl text-white mb-2">1,300+</p>
              <p className="text-sm text-neutral-500 uppercase tracking-wider">
                Transactions
              </p>
            </div>
            <div>
              <p className="font-playfair text-4xl text-white mb-2">20+</p>
              <p className="text-sm text-neutral-500 uppercase tracking-wider">
                Years Experience
              </p>
            </div>
            <div>
              <p className="font-playfair text-4xl text-white mb-2">Miami</p>
              <p className="text-sm text-neutral-500 uppercase tracking-wider">
                Luxury Specialist
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bio — Two Column */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-playfair text-4xl mb-8">My Story</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed">
                <p>
                  I moved to Miami from New York City over two decades ago, drawn
                  by the energy of a market that was just beginning to realize its
                  potential as a global luxury destination. What I found was a city
                  in the middle of a transformation — and I&apos;ve been part of
                  it ever since.
                </p>
                <p>
                  Over 1,300 closed transactions later, I&apos;ve built my career
                  on deep neighborhood knowledge, honest market analysis, and a
                  relentless focus on getting my clients the best possible
                  outcome. I&apos;ve helped first-time buyers navigate
                  Brickell&apos;s condo market, guided investors through
                  pre-construction opportunities in Edgewater and Miami Beach, and
                  represented sellers of waterfront estates in Coconut Grove and
                  Key Biscayne.
                </p>
                <p>
                  My approach is straightforward: know the market better than
                  anyone, respond faster than anyone, and let the data drive
                  decisions — not emotions. Whether you&apos;re buying a $500K
                  condo or a $50M estate, you get the same level of dedication and
                  market intelligence.
                </p>
              </div>
            </div>
            {/* Photo placeholder */}
            <div className="w-full h-96 bg-neutral-800 rounded-sm flex items-center justify-center">
              <span className="text-neutral-600 text-sm">
                Professional Photo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
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
                Real-time market data, price trends, and neighborhood analytics. Not guesswork — data.
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
                AI-powered concierge available 24/7. Get answers about any property, neighborhood, or market question immediately.
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
                Every recommendation backed by comparable sales, price-per-square-foot analysis, and trend data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LoKation Affiliation */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="/lokation-logo-white.png"
            alt="LoKation Real Estate"
            className="h-10 w-auto opacity-60 mx-auto mb-8"
          />
          <p className="text-neutral-400 leading-relaxed mb-4">
            Proudly affiliated with LoKation Real Estate
          </p>
          <div className="text-sm text-neutral-500">
            <p>1900 N Bayshore Dr, Suite 120, Miami, FL 33132</p>
            <p>(305) 420-6613</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-neutral-400 mb-10">
            Whether you&apos;re buying, selling, or investing in Miami luxury
            real estate — I&apos;m here to help.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
          >
            Let&apos;s Talk
          </a>
        </div>
      </section>

      {/* JSON-LD: Static trusted content for structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              description:
                "South Florida luxury real estate specialist with 1,300+ transactions and 20+ years of experience serving Miami's most prestigious neighborhoods.",
              url: "https://iamandrewwhalen.com/about",
              telephone: "+1-305-420-6613",
              email: "andrew@iamandrewwhalen.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1900 N Bayshore Dr, Suite 120",
                addressLocality: "Miami",
                addressRegion: "FL",
                postalCode: "33132",
                addressCountry: "US",
              },
              worksFor: {
                "@type": "RealEstateAgent",
                name: "LoKation Real Estate",
              },
              areaServed: [
                "Brickell",
                "Miami Beach",
                "Coconut Grove",
                "Coral Gables",
                "Key Biscayne",
                "Downtown Miami",
                "Edgewater",
                "Sunny Isles Beach",
                "Aventura",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Andrew Whalen",
              jobTitle: "Realtor",
              url: "https://iamandrewwhalen.com/about",
              worksFor: {
                "@type": "Organization",
                name: "LoKation Real Estate",
              },
              knowsAbout: [
                "Luxury Real Estate",
                "Miami Real Estate",
                "Pre-Construction",
                "Investment Properties",
                "South Florida Market Analysis",
              ],
            },
          ]),
        }}
      />
    </>
  );
}
