import { Metadata } from "next";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import PropertySearch from "@/components/PropertySearch";
import StatsSection from "@/components/StatsSection";
import NeighborhoodBlades from "@/components/NeighborhoodBlades";

export const metadata: Metadata = {
  title: "Andrew Whalen | Miami Luxury Real Estate",
  description:
    "Luxury real estate specialist serving Miami's most prestigious neighborhoods. New developments, market insights, and lifestyle expertise.",
};

export default function HomePage() {
  return (
    <>
      {/* ============================================
          SECTION 1: Hero
          Future: swap img for video element
          ============================================ */}
      <section className="relative h-screen overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover hero-parallax"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />

        {/* Desktop: vertically centered, left-aligned */}
        <div className="hidden md:flex absolute inset-0 items-center pl-6 md:pl-12 lg:pl-16">
          <div className="hero-animate max-w-3xl">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
              South Florida
              <br />
              Luxury Real Estate
            </h1>
            <p className="text-base md:text-lg text-white/70 font-light mt-4 mb-8">
              Select your goal. Our AI concierge handles the rest.
            </p>
            <div className="inline-flex gap-4">
              {["Buy", "Sell", "Sell & Buy", "Invest"].map((goal) => (
                <button
                  key={goal}
                  className="min-w-[160px] md:min-w-[180px] px-8 py-3.5 border-2 border-white/30 hover:border-white/70 text-sm tracking-[0.15em] uppercase text-white hover:bg-white/10 transition-all"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: centered */}
        <div className="flex md:hidden absolute inset-0 items-center justify-center">
          <div className="hero-animate text-center px-6 w-full">
            <h1 className="font-playfair text-4xl sm:text-5xl font-light text-white leading-tight">
              South Florida
              <br />
              Luxury Real Estate
            </h1>
            <p className="text-base text-white/70 font-light max-w-xs mx-auto mt-4 mb-8">
              Select your goal. Our AI concierge handles the rest.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
              {["Buy", "Sell", "Sell & Buy", "Invest"].map((goal) => (
                <button
                  key={goal}
                  className="min-w-[160px] px-8 py-3.5 border-2 border-white/30 hover:border-white/70 text-sm tracking-[0.15em] uppercase text-white hover:bg-white/10 transition-all"
                >
                  {goal}
                </button>
              ))}
            </div>

            {/* Mobile search bar */}
            <div className="relative max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Enter an address, city, zip code or MLS number"
                className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3.5 pr-12 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="mt-3">
              <a href="/search/" className="text-white/50 text-xs tracking-wider hover:text-white transition-colors">
                + Advanced search options
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: Property Search (desktop only)
          ============================================ */}
      <PropertySearch />

      {/* ============================================
          SECTION 3: Stats
          ============================================ */}
      <StatsSection />

      {/* ============================================
          SECTION 4: Meet Andrew
          ============================================ */}
      <section className="bg-[#0a0a0a] py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row md:items-stretch md:gap-0">
              {/* Text — left ~55% */}
              <div className="md:w-[55%] md:pr-16 md:py-8">
                <p className="font-playfair italic text-lg text-neutral-400">LoKation Real Estate</p>
                <h2 className="font-playfair text-5xl md:text-6xl uppercase tracking-wide text-white mt-2 mb-4">
                  Meet Andrew
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-10">
                  Serving Miami, Fort Lauderdale and Palm Beach.
                </p>
                <p className="text-neutral-300 leading-relaxed text-base mb-6">
                  Andrew Whalen has built a reputation as one of South Florida&apos;s
                  most dedicated and knowledgeable real estate professionals. With over
                  1,300 transactions closed and 21+ years of experience across
                  Miami-Dade&apos;s most competitive neighborhoods, Andrew combines deep
                  market expertise with a data-driven approach that consistently
                  delivers results for his clients.
                </p>
                <p className="text-neutral-300 leading-relaxed text-base mb-8">
                  With a career spanning over two decades, Andrew delivers a
                  comprehensive level of concierge-style service with extensive
                  experience across every level of real estate — including investment
                  analysis, negotiation, new development sales, and marketing.
                  Leveraging cutting-edge technology and AI-powered market intelligence,
                  Andrew provides his clients with unmatched insights and exposure in
                  South Florida&apos;s luxury market.
                </p>
                {/* Desktop: text link */}
                <a
                  href="/about/"
                  className="hidden md:inline-block text-sm uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
                >
                  Learn More →
                </a>
                {/* Mobile: pill button */}
                <div className="md:hidden mt-2">
                  <a
                    href="/about/"
                    className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
                  >
                    Meet Andrew
                  </a>
                </div>
              </div>

              {/* Photo — right ~45% (desktop only) */}
              <div className="hidden md:block md:w-[45%] relative min-h-[500px]">
                <img
                  src="/andrew-headshot.png"
                  alt="Andrew Whalen"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent w-1/3" />
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ============================================
          SECTION 5: Testimonials
          ============================================ */}
      <section className="py-20 md:py-28 px-6 bg-[#0a0a0a]">
        <FadeInOnScroll className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl uppercase tracking-wide text-center mb-16">
            Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="flex gap-1 text-amber-500 mb-6">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="font-playfair italic text-lg text-neutral-300 leading-relaxed mb-6">
                &ldquo;Andrew&apos;s market knowledge and responsiveness made our home
                purchase seamless. He knew Brickell inside and out and found us exactly
                what we were looking for.&rdquo;
              </p>
              <p className="text-white font-medium text-sm uppercase tracking-wider">Placeholder Client</p>
              <p className="text-neutral-500 text-xs mt-1">Buyer, Brickell</p>
            </div>

            <div className="p-8">
              <div className="flex gap-1 text-amber-500 mb-6">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="font-playfair italic text-lg text-neutral-300 leading-relaxed mb-6">
                &ldquo;We sold our Coral Gables home in under two weeks at above asking
                price. Andrew&apos;s pricing strategy and marketing approach were
                exceptional.&rdquo;
              </p>
              <p className="text-white font-medium text-sm uppercase tracking-wider">Placeholder Client</p>
              <p className="text-neutral-500 text-xs mt-1">Seller, Coral Gables</p>
            </div>

            <div className="p-8">
              <div className="flex gap-1 text-amber-500 mb-6">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="font-playfair italic text-lg text-neutral-300 leading-relaxed mb-6">
                &ldquo;As an investor, I need data-driven advice I can trust. Andrew
                delivers every time with detailed market analysis and honest
                assessments.&rdquo;
              </p>
              <p className="text-white font-medium text-sm uppercase tracking-wider">Placeholder Client</p>
              <p className="text-neutral-500 text-xs mt-1">Investor, Miami Beach</p>
            </div>
          </div>

          {/* Mobile: view more button */}
          <div className="mt-10 text-center md:hidden">
            <a
              href="/about/"
              className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
            >
              View More Testimonials
            </a>
          </div>
        </FadeInOnScroll>
      </section>

      {/* ============================================
          SECTION 6: Neighborhoods
          ============================================ */}
      <NeighborhoodBlades />

      {/* ============================================
          SECTION 7: CTA
          ============================================ */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto mb-10">
            Ready to explore South Florida&apos;s luxury market? Whether you&apos;re
            buying, selling, or investing — let&apos;s talk.
          </p>
          <a
            href="/contact/"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-white rounded-sm px-10 py-4 uppercase tracking-wider text-sm transition-colors"
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
              "Miami luxury real estate specialist serving Miami's most prestigious neighborhoods.",
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
              "https://www.instagram.com/iamandrewwhalen/",
              "https://www.tiktok.com/@iamandrewwhalen",
              "https://x.com/iamandrewwhalen",
              "https://www.facebook.com/ImAndrewWhalen",
              "https://www.youtube.com/@andrewwhalen11",
              "https://www.linkedin.com/in/iamandrewwhalen/",
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
