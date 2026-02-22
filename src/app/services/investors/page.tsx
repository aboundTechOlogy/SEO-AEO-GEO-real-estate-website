import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Investor Services | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Investment property sourcing, ROI analysis, rental strategy, and portfolio guidance across South Florida's luxury and growth markets.",
  openGraph: {
    title: "Investor Services | Andrew Whalen",
    description:
      "Acquire with confidence using disciplined analysis, local trend data, and portfolio-first strategy.",
    type: "website",
    url: "https://iamandrewwhalen.com/services/investors/",
  },
};

const INVESTOR_FOCUS = [
  "Investment property identification and underwriting support",
  "ROI projections and cash-flow analysis",
  "Short-term rental analysis for Airbnb and VRBO use cases",
  "1031 exchange guidance and deal sequencing",
  "Portfolio diversification strategy across asset types and submarkets",
  "South Florida trend tracking and emerging-neighborhood insight",
  "Property management and operations referrals",
];

export default function InvestorServicesPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="South Florida investment properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              Investor Services
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              Analysis-driven acquisition strategy for long-term growth, cash flow, and portfolio resilience.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ScrollReveal className="space-y-7" y={24}>
            <p className="text-gray-600 leading-relaxed" data-reveal>
              Investor decisions perform best when they are structured before the property tour. I help define your return
              thresholds, hold period, and risk tolerance first, then identify opportunities that align with those targets
              across Miami-Dade, Broward, and Palm Beach.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              Each deal is evaluated with realistic assumptions for rental income, operating costs, financing, and exit
              scenarios. You receive practical ROI and cash-flow projections so comparisons are clear and decisions are based on
              fundamentals, not momentum.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              For short-term rental strategies, I analyze location-level demand signals, seasonality, occupancy expectations, and
              regulatory constraints. For 1031 buyers and portfolio owners, I help map sequencing and diversification strategy so
              you can move capital efficiently while maintaining flexibility.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              Beyond closing, I connect clients with trusted lenders, property managers, and local service partners to keep the
              execution side as disciplined as the acquisition side. The goal is straightforward: better decisions, tighter risk
              control, and durable portfolio growth in South Florida.
            </p>

            <div className="border-t border-gray-200 pt-8" data-reveal>
              <h2 className="font-playfair text-2xl text-[#1a1a1a] mb-5">Investor Support Scope</h2>
              <ul className="space-y-3">
                {INVESTOR_FOCUS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:pt-2" y={24}>
            <aside className="bg-gray-50 border border-gray-200 p-8 lg:sticky lg:top-28" data-reveal>
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">Investment Strategy Call</p>
              <h2 className="font-playfair text-3xl text-[#1a1a1a] mb-4">Review Your Criteria</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get a focused conversation on target returns, neighborhoods, and acquisition strategy before your next move.
              </p>

              <div className="space-y-3 mb-7 text-sm">
                <a href="tel:+13054559744" className="block text-gray-700 hover:text-[#1a1a1a] transition-colors">
                  (305) 455-9744
                </a>
                <a
                  href="mailto:Andrew@IamAndrewWhalen.com"
                  className="block text-gray-700 hover:text-[#1a1a1a] transition-colors"
                >
                  Andrew@IamAndrewWhalen.com
                </a>
              </div>

              <div className="space-y-3">
                <a
                  href="/services/investment-analysis/"
                  className="inline-flex w-full items-center justify-center border border-gray-300 rounded-full px-6 py-3 text-xs uppercase tracking-[0.12em] text-[#1a1a1a] hover:bg-gray-100 transition-colors"
                >
                  Request Investment Analysis
                </a>
                <a
                  href="/contact/"
                  className="inline-flex w-full items-center justify-center border border-gray-300 rounded-full px-6 py-3 text-xs uppercase tracking-[0.12em] text-[#1a1a1a] hover:bg-gray-100 transition-colors"
                >
                  Contact Andrew
                </a>
              </div>
            </aside>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20 px-6 text-center">
        <ScrollReveal className="max-w-3xl mx-auto" y={24}>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4" data-reveal>
            Ready to get started?
          </h2>
          <p className="text-neutral-400 mb-8" data-reveal>
            Let&apos;s evaluate your next opportunity with a strategy built around your target outcomes.
          </p>
          <a
            href="/contact/"
            className="inline-flex items-center justify-center border border-white/30 rounded-full text-white px-10 py-3.5 text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
            data-reveal
          >
            Book an Investor Consultation
          </a>
        </ScrollReveal>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Investor Services",
            serviceType: "Real Estate Investment Advisory",
            provider: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-455-9744",
              email: "Andrew@IamAndrewWhalen.com",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
            description:
              "Investment property sourcing, ROI modeling, short-term rental analysis, and portfolio strategy across South Florida.",
            url: "https://iamandrewwhalen.com/services/investors/",
          }),
        }}
      />
    </>
  );
}
