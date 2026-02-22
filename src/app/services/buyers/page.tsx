import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Buyer Services | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Personalized property search, neighborhood guidance, negotiation, and relocation support for luxury buyers across South Florida.",
  openGraph: {
    title: "Buyer Services | Andrew Whalen",
    description:
      "Buy with confidence through curated showings, market analysis, and full-service transaction guidance.",
    type: "website",
    url: "https://iamandrewwhalen.com/services/buyers/",
  },
};

const BUYER_FOCUS = [
  "Personalized property search and curated showings",
  "Market analysis and neighborhood-by-neighborhood guidance",
  "New construction and pre-construction representation",
  "Negotiation strategy and precise offer preparation",
  "Mortgage and financing coordination",
  "Relocation support for out-of-state and international buyers",
  "Post-closing support with trusted local connections",
];

export default function BuyerServicesPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="South Florida luxury properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              Buyer Services
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              A focused strategy to help you secure the right property without second-guessing your decisions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ScrollReveal className="space-y-7" y={24}>
            <p className="text-neutral-300 leading-relaxed" data-reveal>
              Buying in South Florida can move quickly, especially in top neighborhoods and well-priced luxury segments. I
              start by narrowing your criteria into a clear acquisition brief so we can target properties that match your
              lifestyle goals, investment goals, and timeline instead of touring everything on the market.
            </p>

            <p className="text-neutral-300 leading-relaxed" data-reveal>
              From there, I curate showings and share local context that goes beyond listing photos. You get neighborhood
              guidance, market trend interpretation, and honest feedback on value so each property is evaluated against both
              emotional fit and financial logic.
            </p>

            <p className="text-neutral-300 leading-relaxed" data-reveal>
              For buyers considering new construction and pre-construction opportunities, I help compare developer offerings,
              delivery timelines, and contract structure. This is where details matter, and having experienced representation
              can materially improve terms and protect optionality.
            </p>

            <p className="text-neutral-300 leading-relaxed" data-reveal>
              When it is time to submit, I build a negotiation strategy around leverage and timing, coordinate closely with your
              lender, and manage each milestone through closing. If you are relocating from out of state or internationally, I
              also help connect you with trusted partners after closing so your transition stays smooth.
            </p>

            <div className="border-t border-white/10 pt-8" data-reveal>
              <h2 className="font-playfair text-2xl text-white mb-5">How I Support Buyers</h2>
              <ul className="space-y-3">
                {BUYER_FOCUS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:pt-2" y={24}>
            <aside className="bg-neutral-900 border border-white/10 p-8 lg:sticky lg:top-28" data-reveal>
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">Buyer Consultation</p>
              <h2 className="font-playfair text-3xl text-white mb-4">Plan Your Search</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Let&apos;s build your shortlist, define target areas, and map an offer strategy before the right property appears.
              </p>

              <div className="space-y-3 mb-7 text-sm">
                <a href="tel:+13054559744" className="block text-neutral-200 hover:text-white transition-colors">
                  (305) 455-9744
                </a>
                <a
                  href="mailto:Andrew@IamAndrewWhalen.com"
                  className="block text-neutral-200 hover:text-white transition-colors"
                >
                  Andrew@IamAndrewWhalen.com
                </a>
              </div>

              <div className="space-y-3">
                <a
                  href="/contact/"
                  className="inline-flex w-full items-center justify-center border border-white/30 rounded-full px-6 py-3 text-xs uppercase tracking-[0.12em] text-white hover:bg-white/10 transition-all"
                >
                  Contact Andrew
                </a>
                <a
                  href="/services/investors/"
                  className="inline-flex w-full items-center justify-center border border-white/30 rounded-full px-6 py-3 text-xs uppercase tracking-[0.12em] text-white hover:bg-white/10 transition-all"
                >
                  Explore Investor Services
                </a>
              </div>
            </aside>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-neutral-900 py-20 px-6 text-center">
        <ScrollReveal className="max-w-3xl mx-auto" y={24}>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4" data-reveal>
            Ready to get started?
          </h2>
          <p className="text-neutral-400 mb-8" data-reveal>
            Share your goals and we&apos;ll build a search strategy designed for your next move.
          </p>
          <a
            href="/contact/"
            className="inline-flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 text-white px-10 py-3.5 text-sm uppercase tracking-wider transition-colors"
            data-reveal
          >
            Schedule a Buyer Call
          </a>
        </ScrollReveal>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Buyer Services",
            serviceType: "Residential Buyer Representation",
            provider: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-455-9744",
              email: "Andrew@IamAndrewWhalen.com",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
            description:
              "Personalized property search, neighborhood guidance, negotiation, and financing coordination for luxury buyers in South Florida.",
            url: "https://iamandrewwhalen.com/services/buyers/",
          }),
        }}
      />
    </>
  );
}
