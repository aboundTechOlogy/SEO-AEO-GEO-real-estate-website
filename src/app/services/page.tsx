import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Our Services | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Comprehensive real estate services for buyers, sellers, and investors across South Florida, including market analysis and investment strategy.",
  openGraph: {
    title: "Our Services | Andrew Whalen",
    description:
      "Comprehensive real estate services for buyers, sellers, and investors across South Florida.",
    type: "website",
    url: "https://iamandrewwhalen.com/services/",
  },
};

const SERVICE_CARDS = [
  {
    title: "Seller Services",
    href: "/services/sellers/",
    description:
      "Strategic pricing, launch planning, and full-service representation designed to maximize your sale in South Florida's competitive luxury market.",
    iconPath:
      "M3 21h18M6 21V9.75a1.5 1.5 0 0 1 .44-1.06l4.5-4.5a1.5 1.5 0 0 1 2.12 0l4.5 4.5a1.5 1.5 0 0 1 .44 1.06V21m-9-9h6m-6 4h6",
  },
  {
    title: "Buyer Services",
    href: "/services/buyers/",
    description:
      "Curated property search, market guidance, and expert negotiation support to help you buy with clarity and confidence.",
    iconPath:
      "M21 21l-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0ZM11.5 9v5m-2.5-2.5h5",
  },
  {
    title: "Investor Services",
    href: "/services/investors/",
    description:
      "Data-backed acquisition strategy with ROI modeling, rental projections, and portfolio planning across key South Florida submarkets.",
    iconPath:
      "M4.5 19.5h15m-14-3 3.5-5 3 2.5 4.5-7 3 3.5M18 6h-3m3 0v3",
  },
  {
    title: "Request a Market Analysis",
    href: "/services/market-analysis/",
    description:
      "Get a complimentary comparative market analysis with local comps, pricing strategy, and timing recommendations in 48 hours.",
    iconPath:
      "M7.5 3.75h9a1.5 1.5 0 0 1 1.5 1.5v13.5l-6-3-6 3V5.25a1.5 1.5 0 0 1 1.5-1.5ZM9 8.25h6m-6 3h4.5",
  },
  {
    title: "Request an Investment Analysis",
    href: "/services/investment-analysis/",
    description:
      "Evaluate opportunities with cash-flow forecasts, expense assumptions, and market outlook tailored to your investment goals.",
    iconPath:
      "M4.5 19.5h15M7.5 16.5V9m4 7.5V6m4 10.5v-5m4 5V4.5",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="South Florida skyline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              Our Services
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              Comprehensive real estate services for buyers, sellers, and investors across South Florida
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-10" y={24}>
            <p className="text-neutral-500 text-sm uppercase tracking-[0.2em]" data-reveal>
              Tailored Guidance At Every Stage
            </p>
          </ScrollReveal>

          <ScrollReveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.1} y={26}>
            {SERVICE_CARDS.map((service) => (
              <a
                key={service.href}
                href={service.href}
                className="group bg-neutral-900 border border-white/5 hover:border-white/20 p-7 transition-all"
                data-reveal
              >
                <div className="h-20 w-20 border border-white/10 bg-black/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-9 h-9 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
                  </svg>
                </div>

                <h2 className="font-playfair text-2xl text-white mb-3">{service.title}</h2>
                <p className="text-neutral-400 leading-relaxed mb-6">{service.description}</p>
                <span className="text-sm uppercase tracking-[0.12em] text-white border-b border-white/30 pb-1 group-hover:border-white">
                  Learn More
                </span>
              </a>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-neutral-900 py-20 px-6 text-center">
        <ScrollReveal className="max-w-3xl mx-auto" y={24}>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4" data-reveal>
            Ready to get started?
          </h2>
          <p className="text-neutral-400 mb-8" data-reveal>
            Let&apos;s build a plan around your timeline, goals, and target neighborhoods.
          </p>
          <a
            href="/contact/"
            className="inline-flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 text-white px-10 py-3.5 text-sm uppercase tracking-wider transition-colors"
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
            name: "South Florida Real Estate Services",
            serviceType: "Residential Real Estate Services",
            provider: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-455-9744",
              email: "Andrew@IamAndrewWhalen.com",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Real Estate Services",
              itemListElement: SERVICE_CARDS.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Service",
                  name: service.title,
                  description: service.description,
                  url: `https://iamandrewwhalen.com${service.href}`,
                },
              })),
            },
            url: "https://iamandrewwhalen.com/services/",
          }),
        }}
      />
    </>
  );
}
