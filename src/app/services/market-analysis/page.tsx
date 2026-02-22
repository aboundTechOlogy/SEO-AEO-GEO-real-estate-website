import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import MarketAnalysisLeadForm from "@/components/MarketAnalysisLeadForm";

export const metadata: Metadata = {
  title: "Request a Market Analysis | Andrew Whalen",
  description:
    "Request a complimentary comparative market analysis to understand your property's value, current buyer demand, and ideal pricing strategy.",
  openGraph: {
    title: "Request a Market Analysis | Andrew Whalen",
    description:
      "Get a complimentary, data-backed market analysis for your South Florida property.",
    type: "website",
    url: "https://iamandrewwhalen.com/services/market-analysis/",
  },
};

export default function MarketAnalysisPage() {
  return (
    <>
      <section className="relative h-[46vh] min-h-[340px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="South Florida market analysis"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              Request a Market Analysis
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              Get a comprehensive analysis of your property&apos;s current market value - complimentary and obligation-free.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <ScrollReveal className="bg-white border border-gray-200 shadow-sm p-6 md:p-8" y={24}>
            <h2 className="font-playfair text-3xl text-[#1a1a1a] mb-6" data-reveal>
              Tell Us About Your Property
            </h2>
            <div data-reveal>
              <MarketAnalysisLeadForm />
            </div>
            <p className="text-sm text-gray-500 mt-6" data-reveal>
              Complimentary • No Obligation • Delivered within 48 hours
            </p>
          </ScrollReveal>

          <ScrollReveal className="space-y-6 lg:pt-2" y={24}>
            <div data-reveal>
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">What Is a CMA?</p>
              <h2 className="font-playfair text-3xl text-[#1a1a1a] mb-4">A Pricing Strategy, Not Just a Number</h2>
            </div>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              A comparative market analysis (CMA) evaluates your property against relevant recent sales, current competition,
              and active buyer behavior. It gives you an evidence-based value range so decisions are tied to market reality,
              not guesswork.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              The right pricing strategy directly impacts showings, offer quality, and time on market. Price too high and you
              lose momentum. Price too low and you leave equity behind. A strong CMA helps you launch with clarity and leverage.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              Your analysis includes localized trends, supply and demand conditions, and strategic recommendations tailored to
              your home and timeline across South Florida&apos;s luxury market.
            </p>

            <div className="border border-gray-200 bg-gray-50 p-6" data-reveal>
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">Direct Contact</p>
              <a href="tel:+13054559744" className="block text-gray-700 hover:text-[#1a1a1a] transition-colors mb-2">
                (305) 455-9744
              </a>
              <a
                href="mailto:Andrew@IamAndrewWhalen.com"
                className="block text-gray-700 hover:text-[#1a1a1a] transition-colors"
              >
                Andrew@IamAndrewWhalen.com
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20 px-6 text-center">
        <ScrollReveal className="max-w-3xl mx-auto" y={24}>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4" data-reveal>
            Ready to get started?
          </h2>
          <p className="text-neutral-400 mb-8" data-reveal>
            Prefer to talk first? Reach out directly and we&apos;ll walk through your property details together.
          </p>
          <a
            href="/contact/"
            className="inline-flex items-center justify-center border border-white/30 rounded-full px-10 py-3.5 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
            data-reveal
          >
            Contact Andrew
          </a>
        </ScrollReveal>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Comparative Market Analysis",
            serviceType: "Property Valuation and Pricing Strategy",
            provider: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-455-9744",
              email: "Andrew@IamAndrewWhalen.com",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
            description:
              "Complimentary comparative market analysis for South Florida property owners with pricing recommendations and local trend context.",
            url: "https://iamandrewwhalen.com/services/market-analysis/",
          }),
        }}
      />
    </>
  );
}
