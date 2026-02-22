import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "How We Use AI | Andrew Whalen",
  description:
    "Learn how Andrew Whalen uses AI responsibly to improve market analysis, property search, and communication while keeping human guidance at the center.",
  openGraph: {
    title: "How We Use AI | Andrew Whalen",
    description:
      "Transparency in how we leverage technology to serve clients across South Florida.",
    type: "article",
    url: "https://iamandrewwhalen.com/about/ai/",
  },
};

const AI_SECTIONS = [
  {
    title: "Our Philosophy",
    paragraphs: [
      "AI should strengthen service, not replace relationships. Technology helps process information faster so the human side of real estate can stay front and center.",
      "By automating repetitive analysis, we spend more time on strategy, communication, and decision support tailored to your goals.",
    ],
  },
  {
    title: "Market Analysis",
    paragraphs: [
      "AI tools can process thousands of market data points quickly, from recent sales to pricing shifts and supply trends. That scale helps us identify patterns that may be missed in manual review alone.",
      "Every valuation insight is reviewed and contextualized before it reaches you, so recommendations remain practical and locally grounded.",
    ],
  },
  {
    title: "Property Search",
    paragraphs: [
      "Intelligent matching helps surface properties that align with your criteria, including options you might not have initially considered. This improves discovery without losing focus.",
      "Search outputs are filtered through live market knowledge and your priorities, so suggestions stay relevant and actionable.",
    ],
  },
  {
    title: "Content & Communication",
    paragraphs: [
      "AI supports the creation of market reports, neighborhood briefings, and recurring updates so information reaches you faster and with more consistency.",
      "The goal is clear communication at the right time, not generic automation. Messaging is refined for clarity and then personalized to your transaction.",
    ],
  },
  {
    title: "What AI Doesn't Do",
    paragraphs: [
      "AI does not make decisions for you, negotiate on your behalf, or replace professional judgment. Final recommendations are always reviewed and tailored by Andrew.",
      "Your privacy remains a priority. Sensitive client information is handled carefully and never treated as disposable data.",
    ],
  },
  {
    title: "Our Commitment",
    paragraphs: [
      "We are committed to responsible AI use: transparent methods, practical application, and human accountability at every step.",
      "If you want to understand how a recommendation was produced or how technology supports your transaction, we are happy to walk through it with you.",
    ],
  },
];

export default function HowWeUseAiPage() {
  return (
    <>
      <section className="relative h-[46vh] min-h-[340px] overflow-hidden bg-[#0a0a0a]">
        <img
          src="/hero-miami.jpg"
          alt="Technology and real estate strategy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <ScrollReveal className="max-w-3xl" y={30}>
            <h1 className="font-playfair text-5xl md:text-7xl font-light text-white" data-reveal>
              How We Use AI
            </h1>
            <p className="text-neutral-300 mt-4 text-lg" data-reveal>
              Transparency in how we leverage technology to serve you better
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {AI_SECTIONS.map((section, index) => (
            <ScrollReveal key={section.title} className="border-b border-white/10 pb-10" y={24} delay={index * 0.04}>
              <h2 className="font-playfair text-3xl text-white mb-4" data-reveal>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-neutral-300 leading-relaxed mb-4 last:mb-0" data-reveal>
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-neutral-900 py-20 px-6 text-center">
        <ScrollReveal className="max-w-3xl mx-auto" y={24}>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4" data-reveal>
            Have questions about our technology?
          </h2>
          <p className="text-neutral-400 mb-8" data-reveal>
            We&apos;re happy to explain exactly how tools support your experience and how decisions remain human-led.
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
            "@type": "Article",
            headline: "How We Use AI",
            description:
              "Transparency in how Andrew Whalen uses AI for market analysis, property search, and client communication.",
            author: {
              "@type": "Person",
              name: "Andrew Whalen",
            },
            publisher: {
              "@type": "Organization",
              name: "Andrew Whalen | LoKation Real Estate",
            },
            mainEntityOfPage: "https://iamandrewwhalen.com/about/ai/",
            datePublished: "2026-02-22",
            dateModified: "2026-02-22",
          }),
        }}
      />
    </>
  );
}
