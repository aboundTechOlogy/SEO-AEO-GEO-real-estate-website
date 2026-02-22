import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import InvestmentAnalysisLeadForm from "@/components/InvestmentAnalysisLeadForm";

export const metadata: Metadata = {
  title: "Request an Investment Analysis | Andrew Whalen",
  description:
    "Get detailed investment projections for South Florida properties, including ROI assumptions, cash-flow outlook, and market context.",
  openGraph: {
    title: "Request an Investment Analysis | Andrew Whalen",
    description:
      "Request a personalized investment analysis with ROI, cash flow, and market outlook projections.",
    type: "website",
    url: "https://iamandrewwhalen.com/services/investment-analysis/",
  },
};

export default function InvestmentAnalysisPage() {
  return (
    <>
      <section className="relative h-[46vh] min-h-[340px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="South Florida investment analysis"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              Request an Investment Analysis
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              Get detailed investment projections for any South Florida property - ROI, cash flow, and market outlook.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <ScrollReveal className="bg-neutral-900 border border-white/10 p-6 md:p-8" y={24}>
            <h2 className="font-playfair text-3xl text-white mb-6" data-reveal>
              Share Your Investment Criteria
            </h2>
            <div data-reveal>
              <InvestmentAnalysisLeadForm />
            </div>
            <p className="text-sm text-neutral-400 mt-6" data-reveal>
              Complimentary • No Obligation • Personalized for your goals
            </p>
          </ScrollReveal>

          <ScrollReveal className="space-y-6 lg:pt-2" y={24}>
            <div data-reveal>
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">What Is Included?</p>
              <h2 className="font-playfair text-3xl text-white mb-4">Actionable Investment Clarity</h2>
            </div>

            <p className="text-neutral-300 leading-relaxed" data-reveal>
              This analysis is built to answer the questions that actually drive investment decisions: expected income, expense
              ranges, financing assumptions, and projected returns under realistic operating conditions.
            </p>

            <p className="text-neutral-300 leading-relaxed" data-reveal>
              You receive a practical view of cash flow and ROI potential based on property type, location, and strategy, whether
              you are evaluating long-term rentals, short-term rentals, or value-add opportunities.
            </p>

            <p className="text-neutral-300 leading-relaxed" data-reveal>
              I also include South Florida market context to help you evaluate risk and timing, so each acquisition can fit into
              a broader portfolio strategy rather than standing alone.
            </p>

            <div className="border border-white/10 p-6" data-reveal>
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">Direct Contact</p>
              <a href="tel:+13054559744" className="block text-neutral-200 hover:text-white transition-colors mb-2">
                (305) 455-9744
              </a>
              <a
                href="mailto:Andrew@IamAndrewWhalen.com"
                className="block text-neutral-200 hover:text-white transition-colors"
              >
                Andrew@IamAndrewWhalen.com
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-neutral-900 py-20 px-6 text-center">
        <ScrollReveal className="max-w-3xl mx-auto" y={24}>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4" data-reveal>
            Ready to get started?
          </h2>
          <p className="text-neutral-400 mb-8" data-reveal>
            If you want to discuss your strategy first, reach out and we&apos;ll define the right acquisition criteria together.
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
            name: "Real Estate Investment Analysis",
            serviceType: "Investment Property Analysis",
            provider: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-455-9744",
              email: "Andrew@IamAndrewWhalen.com",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
            description:
              "Personalized investment analysis including projected ROI, cash flow assumptions, and market outlook for South Florida properties.",
            url: "https://iamandrewwhalen.com/services/investment-analysis/",
          }),
        }}
      />
    </>
  );
}
