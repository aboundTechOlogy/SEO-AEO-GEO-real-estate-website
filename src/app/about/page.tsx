import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Andrew Whalen | South Florida Luxury Real Estate Specialist",
  description:
    "1,300+ transactions, 21+ years of experience. Andrew Whalen is a South Florida luxury real estate specialist serving Miami-Dade, Broward, and Palm Beach counties.",
  openGraph: {
    title: "About Andrew Whalen | South Florida Luxury Real Estate Specialist",
    description:
      "1,300+ transactions, 21+ years of experience. South Florida luxury real estate specialist.",
    type: "profile",
    url: "https://iamandrewwhalen.com/about",
  },
};

const STATS = [
  { value: "1,300+", label: "Transactions Closed" },
  { value: "21+", label: "Years Experience" },
  { value: "$500M+", label: "Career Sales Volume" },
  { value: "40+", label: "Neighborhoods Served" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt="South Florida Luxury Real Estate"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">LoKation Real Estate</p>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white">Meet Andrew</h1>
          </div>
        </div>
      </section>

      {/* Photo + Bio */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Photo */}
            <div className="lg:w-[45%] relative min-h-[500px]">
              <img
                src="/andrew-headshot.png"
                alt="Andrew Whalen"
                className="w-full h-full object-cover object-top"
                style={{ minHeight: "500px" }}
              />
            </div>

            {/* Bio */}
            <div className="lg:w-[55%] lg:py-8">
              <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-2">LoKation Real Estate</p>
              <h2 className="font-playfair text-4xl md:text-5xl uppercase tracking-wide text-[#1a1a1a] mt-2 mb-6">Andrew Whalen</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-10">
                Serving Miami, Fort Lauderdale and Palm Beach.
              </p>

              <p className="text-gray-600 leading-relaxed mb-6">
                Andrew Whalen has built a reputation as one of South Florida&apos;s most dedicated and
                knowledgeable real estate professionals. With over 1,300 transactions closed and 21+ years
                of experience across Miami-Dade&apos;s most competitive neighborhoods, Andrew combines deep
                market expertise with a data-driven approach that consistently delivers results for his clients.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                With a career spanning over two decades, Andrew delivers a comprehensive level of
                concierge-style service with extensive experience across every level of real estate —
                including investment analysis, negotiation, new development sales, and marketing.
                Leveraging cutting-edge technology and AI-powered market intelligence, Andrew provides
                his clients with unmatched insights and exposure in South Florida&apos;s luxury market.
              </p>
              <p className="text-gray-600 leading-relaxed mb-10">
                Licensed with LoKation Real Estate, Andrew brings a boutique-level commitment to every
                client relationship while leveraging the resources and technology of a modern, AI-forward
                brokerage. Whether you&apos;re buying a first investment property or selling a multi-million
                dollar waterfront estate, Andrew approaches every transaction with the same dedication to
                excellence.
              </p>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-[#1a1a1a] text-xs uppercase tracking-widest mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {["Luxury Condos", "Waterfront Estates", "New Construction", "Investment Properties", "Pre-Construction", "International Buyers", "Relocations"].map((s) => (
                    <span key={s} className="border border-gray-300 bg-white px-3 py-1 text-xs uppercase tracking-wider text-gray-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-playfair text-4xl md:text-5xl text-white mb-2">{s.value}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#0a0a0a] py-24 px-6 text-center">
        <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-4">Andrew Whalen</p>
        <h2 className="font-playfair text-4xl md:text-5xl text-white mb-6">Let&apos;s Connect</h2>
        <p className="text-neutral-400 max-w-xl mx-auto mb-10">
          Ready to explore South Florida&apos;s luxury market? Whether you&apos;re buying, selling, or
          investing — let&apos;s talk.
        </p>
        <a
          href="/contact/"
          className="inline-block border border-white/30 rounded-full px-10 py-4 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
        >
          Contact Andrew
        </a>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Andrew Whalen",
            jobTitle: "Luxury Real Estate Specialist",
            worksFor: { "@type": "Organization", name: "LoKation Real Estate" },
            url: "https://iamandrewwhalen.com/about",
            telephone: "+1-305-455-9744",
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
              "https://www.linkedin.com/in/iamandrewwhalen/",
            ],
          }),
        }}
      />
    </>
  );
}
