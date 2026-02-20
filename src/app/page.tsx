import { Metadata } from "next";
import { developments } from "@/data/developments";
import FadeInView from "@/components/FadeInView";
import StatsSection from "@/components/StatsSection";

export const metadata: Metadata = {
  title: "Andrew Whalen | Miami Luxury Real Estate",
  description:
    "Luxury real estate specialist serving Miami's most prestigious neighborhoods. New developments, market insights, and lifestyle expertise.",
};

const NEIGHBORHOODS = [
  { name: "Brickell", slug: "brickell", gradient: "from-blue-900/60 to-cyan-900/40" },
  { name: "Miami Beach", slug: "miami-beach", gradient: "from-sky-800/60 to-blue-900/40" },
  { name: "Coconut Grove", slug: "coconut-grove", gradient: "from-green-900/60 to-emerald-900/40" },
  { name: "Coral Gables", slug: "coral-gables", gradient: "from-orange-900/40 to-amber-950/40" },
  { name: "Downtown Miami", slug: "downtown-miami", gradient: "from-indigo-900/60 to-purple-900/40" },
  { name: "Key Biscayne", slug: "key-biscayne", gradient: "from-teal-900/60 to-cyan-950/40" },
];

const DEV_GRADIENTS = [
  "from-slate-800/60 to-neutral-900/40",
  "from-zinc-800/50 to-stone-900/40",
  "from-gray-800/50 to-neutral-900/40",
  "from-neutral-700/40 to-zinc-900/40",
];

const homepageDevelopments = developments.slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0a0a0a]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white">
            South Florida
            <br />
            Luxury Real Estate
          </h1>
          <p className="mt-10 text-base text-white/70 tracking-wide">
            Select your goal below and AI will take it from there.
          </p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg md:max-w-none mx-auto">
            {["Buy", "Sell", "Sell & Buy", "Invest"].map((goal) => (
              <button
                key={goal}
                className="px-6 py-3 border border-white/30 hover:border-white/70 text-sm tracking-[0.15em] uppercase text-white hover:bg-white/10 transition-all"
              >
                {goal}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Property Search Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* AW watermark */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-playfair text-white/[0.03] select-none pointer-events-none leading-none">
          AW
        </span>

        <FadeInView className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-4xl md:text-6xl uppercase tracking-[0.15em] text-white mb-12">
            Property Search
          </h2>

          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* For Sale dropdown */}
            <div className="relative shrink-0">
              <select
                className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-4 pr-12 text-white text-sm uppercase tracking-wider w-full md:w-auto cursor-pointer focus:outline-none focus:border-white/40 transition-colors"
                defaultValue="sale"
              >
                <option value="sale" className="bg-neutral-900">For Sale</option>
                <option value="rent" className="bg-neutral-900">For Rent</option>
                <option value="sold" className="bg-neutral-900">Sold</option>
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Search input */}
            <input
              type="text"
              placeholder="Enter an address, city, zip code or MLS number"
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
            />

            {/* Find Now button */}
            <a
              href="/search/"
              className="bg-white text-black font-medium rounded-full px-10 py-4 uppercase tracking-wider text-sm hover:bg-neutral-200 transition-colors text-center shrink-0"
            >
              Find Now!
            </a>
          </div>

          {/* Advanced search link */}
          <p className="mt-4">
            <a href="/search/" className="text-white/70 text-sm tracking-wider hover:text-white transition-colors">
              + Advanced search options
            </a>
          </p>
        </FadeInView>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl text-center mb-16">What Clients Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <p className="italic text-neutral-300 leading-relaxed mb-6">
                &ldquo;Andrew made the entire process seamless. His market knowledge
                in Brickell is unmatched — we closed in under 30 days at a price
                we didn&apos;t think was possible.&rdquo;
              </p>
              <p className="text-white text-sm font-medium">— Client Name</p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">Brickell Condo Purchase</p>
            </div>
            <div className="p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <p className="italic text-neutral-300 leading-relaxed mb-6">
                &ldquo;We interviewed several agents before choosing Andrew. His
                data-driven approach and responsiveness set him apart. He sold our
                home above asking in two weeks.&rdquo;
              </p>
              <p className="text-white text-sm font-medium">— Client Name</p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">Coconut Grove Home Sale</p>
            </div>
            <div className="p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <p className="italic text-neutral-300 leading-relaxed mb-6">
                &ldquo;As an out-of-state investor, I needed someone I could trust
                to guide me through Miami&apos;s pre-construction market. Andrew
                delivered — professional, transparent, and always available.&rdquo;
              </p>
              <p className="text-white text-sm font-medium">— Client Name</p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">Pre-Construction Investment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl mb-12">Neighborhoods</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEIGHBORHOODS.map((n) => (
              <a
                key={n.name}
                href={`/neighborhoods/${n.slug}/`}
                className="group relative h-80 md:h-96 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-playfair text-2xl md:text-3xl text-white mb-4">{n.name}</h3>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 text-xs uppercase tracking-wider border border-white/30 text-white group-hover:bg-white/10 transition-all">
                      Homes
                    </span>
                    <span className="px-4 py-2 text-xs uppercase tracking-wider border border-white/30 text-white group-hover:bg-white/10 transition-all">
                      Condos
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="/neighborhoods/" className="text-sm uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors">
              View All Neighborhoods →
            </a>
          </div>
        </div>
      </section>

      {/* Featured Developments Section */}
      <section id="developments" className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl mb-12">New Developments</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {homepageDevelopments.map((d, i) => (
              <a
                key={d.name}
                href={`/new-construction/`}
                className="group relative h-72 md:h-80 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${DEV_GRADIENTS[i % DEV_GRADIENTS.length]}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-playfair text-2xl md:text-3xl text-white mb-1 group-hover:text-white transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-3">{d.location}</p>
                  <div className="flex gap-4 text-sm text-neutral-300">
                    <span>From {d.priceFrom}</span>
                    <span className="text-neutral-500">{d.status}</span>
                  </div>
                </div>
              </a>
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

      {/* Let's Connect CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-neutral-400 mb-10">
            Ready to explore Miami&apos;s luxury market? Whether you&apos;re
            buying, investing, or just curious about a neighborhood — I&apos;m
            here to help.
          </p>
          <a
            href="/contact/"
            className="inline-block px-8 py-3 border border-white/30 text-white hover:bg-white/10 transition-all tracking-wider uppercase text-sm"
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
