import SectionHeader from "@/components/SectionHeader";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutDescription() {
  return (
    <section className="bg-[#0a0a0a] py-16 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-0">
            {/* Text — left ~55% */}
            <div className="lg:w-[55%] lg:pr-16 lg:py-8">
              <SectionHeader
                subtitle="LoKation Real Estate"
                title="Meet Andrew"
                align="left"
                className="mb-8"
              />
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-10">
                Serving Miami, Fort Lauderdale and Palm Beach.
              </p>
              <p className="text-neutral-300 leading-relaxed text-base mb-6" data-reveal>
                Andrew Whalen has built a reputation as one of South Florida&apos;s most dedicated and
                knowledgeable real estate professionals. With over 1,300 transactions closed and 21+ years
                of experience across Miami-Dade&apos;s most competitive neighborhoods, Andrew combines deep
                market expertise with a data-driven approach that consistently delivers results for his clients.
              </p>
              <p className="text-neutral-300 leading-relaxed text-base mb-8" data-reveal>
                With a career spanning over two decades, Andrew delivers a comprehensive level of
                concierge-style service with extensive experience across every level of real estate —
                including investment analysis, negotiation, new development sales, and marketing.
                Leveraging cutting-edge technology and AI-powered market intelligence, Andrew provides
                his clients with unmatched insights and exposure in South Florida&apos;s luxury market.
              </p>
              <a
                href="/about/"
                className="hidden lg:inline-block text-sm uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
                data-reveal
              >
                Meet Andrew →
              </a>
              <div className="lg:hidden mt-2">
                <a
                  href="/about/"
                  className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
                >
                  Meet Andrew
                </a>
              </div>
            </div>

            {/* Photo — right ~45% */}
            <div className="hidden lg:block lg:w-[45%] relative min-h-[500px]">
              <img
                src="/andrew-headshot.png"
                alt="Andrew Whalen"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent w-1/4" />
              {/* TODO: Replace lower portion with team/lifestyle video */}
              {/*
              <video autoPlay muted loop playsInline className="absolute bottom-0 left-0 right-0 h-1/3 object-cover">
                <source src="/andrew-lifestyle.mp4" type="video/mp4" />
              </video>
              */}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
