import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Page Not Found | Andrew Whalen",
  description: "The page you're looking for doesn't exist or has been moved.",
  openGraph: {
    title: "Page Not Found | Andrew Whalen",
    description: "The page you're looking for doesn't exist or has been moved.",
    type: "website",
    url: "https://iamandrewwhalen.com/404",
  },
};

export default function NotFound() {
  return (
    <section className="bg-[#0a0a0a] min-h-[calc(100vh-88px)] pt-28 pb-16 px-6 flex items-center">
      <div className="max-w-4xl mx-auto w-full text-center">
        <ScrollReveal className="space-y-6" y={30}>
          <p className="font-playfair font-light leading-none text-[120px] md:text-[180px] text-white/10">404</p>

          <h1 className="font-playfair text-3xl md:text-4xl text-white" data-reveal>
            Page Not Found
          </h1>

          <p className="max-w-xl mx-auto text-neutral-400" data-reveal>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="max-w-2xl mx-auto" data-reveal>
            <svg
              viewBox="0 0 760 170"
              className="w-full h-auto text-white/15"
              role="img"
              aria-label="City skyline illustration"
              fill="none"
            >
              <path d="M0 168h760" stroke="currentColor" strokeWidth="2" />
              <rect x="20" y="86" width="48" height="82" fill="currentColor" />
              <rect x="84" y="62" width="62" height="106" fill="currentColor" />
              <rect x="166" y="102" width="42" height="66" fill="currentColor" />
              <rect x="220" y="48" width="76" height="120" fill="currentColor" />
              <rect x="314" y="78" width="54" height="90" fill="currentColor" />
              <rect x="382" y="24" width="86" height="144" fill="currentColor" />
              <rect x="484" y="92" width="44" height="76" fill="currentColor" />
              <rect x="542" y="58" width="70" height="110" fill="currentColor" />
              <rect x="628" y="96" width="44" height="72" fill="currentColor" />
              <rect x="686" y="70" width="56" height="98" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2" data-reveal>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
            >
              Back to Home
            </Link>
            <Link
              href="/search/"
              className="inline-flex items-center justify-center border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
            >
              Search Properties
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
