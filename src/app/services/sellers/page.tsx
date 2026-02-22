import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Seller Services | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Strategic pricing, premium marketing, and full transaction management for sellers across Miami-Dade, Broward, and Palm Beach counties.",
  openGraph: {
    title: "Seller Services | Andrew Whalen",
    description:
      "Sell with a data-backed strategy, elevated marketing, and expert representation across South Florida.",
    type: "website",
    url: "https://iamandrewwhalen.com/services/sellers/",
  },
};

const SELLER_FOCUS = [
  "Strategic pricing and comparative market analysis",
  "Professional photography, video, and virtual tours",
  "Multi-channel marketing across MLS, social, and targeted campaigns",
  "Expert negotiation and end-to-end transaction management",
  "Pre-listing preparation and staging consultation",
  "Luxury market execution across Miami-Dade, Broward, and Palm Beach",
];

export default function SellerServicesPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="Luxury home listing presentation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              Seller Services
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              Position your home to stand out, attract qualified buyers, and close on your terms.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ScrollReveal className="space-y-7" y={24}>
            <p className="text-gray-600 leading-relaxed" data-reveal>
              Selling in South Florida&apos;s luxury market requires more than putting a property on the MLS. I start with a
              detailed comparative market analysis to identify the pricing window that creates urgency without leaving value
              behind. Every recommendation is built around live competition, absorption pace, and neighborhood-specific buyer
              behavior.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              Presentation is the next lever. I coordinate professional photography, cinematic video, and virtual-tour assets so
              your listing performs across every channel from day one. Before launch, we walk through pre-listing updates and
              staging adjustments that improve first impressions both online and in person.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              Distribution is intentional and layered. Your home is marketed through MLS syndication, targeted social campaigns,
              and audience-specific outreach to brokers and qualified buyers. Instead of one generic campaign, we align message,
              creative, and timing around the audience most likely to act.
            </p>

            <p className="text-gray-600 leading-relaxed" data-reveal>
              Once offers arrive, I guide negotiation and contract strategy to protect net proceeds and timeline certainty. From
              inspections through appraisal, title, and closing, I manage each step proactively so you can make decisions with
              clear data and minimal friction.
            </p>

            <div className="border-t border-gray-200 pt-8" data-reveal>
              <h2 className="font-playfair text-2xl text-[#1a1a1a] mb-5">What You Can Expect</h2>
              <ul className="space-y-3">
                {SELLER_FOCUS.map((item) => (
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
              <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-3">Seller Consultation</p>
              <h2 className="font-playfair text-3xl text-[#1a1a1a] mb-4">Talk Through Your Options</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you&apos;re listing now or planning ahead, we can map out pricing strategy, preparation priorities, and
                launch timing.
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
                  href="/services/market-analysis/"
                  className="inline-flex w-full items-center justify-center border border-gray-300 rounded-full px-6 py-3 text-xs uppercase tracking-[0.12em] text-[#1a1a1a] hover:bg-gray-100 transition-colors"
                >
                  Request a Market Analysis
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
            Let&apos;s create a custom sale plan built for your property and your timeline.
          </p>
          <a
            href="/contact/"
            className="inline-flex items-center justify-center border border-white/30 rounded-full text-white px-10 py-3.5 text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
            data-reveal
          >
            Schedule a Consultation
          </a>
        </ScrollReveal>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Seller Services",
            serviceType: "Residential Listing Representation",
            provider: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-455-9744",
              email: "Andrew@IamAndrewWhalen.com",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
            description:
              "Strategic pricing, professional marketing, negotiation, and transaction management for luxury sellers across South Florida.",
            url: "https://iamandrewwhalen.com/services/sellers/",
          }),
        }}
      />
    </>
  );
}
