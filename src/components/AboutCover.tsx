"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "1,300+", label: "Transactions Closed" },
  { value: "21+", label: "Years of Experience" },
  { value: "$500M+", label: "Career Sales Volume" },
  { value: "40+", label: "Neighborhoods Served" },
];

function splitChars(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="inline-block" style={{ opacity: 0 }}>
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function AboutCover() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statValueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statLabelRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Clip-path photo reveal
      if (photoRef.current) {
        gsap.from(photoRef.current, {
          clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Floating bars expand
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        gsap.from(bar, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          delay: i * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });
      });

      // Stat value letter-by-letter animation
      statValueRefs.current.forEach((ref, statIdx) => {
        if (!ref) return;
        const chars = ref.querySelectorAll("span");
        gsap.to(Array.from(chars), {
          opacity: 1,
          duration: 0.04,
          stagger: 0.04,
          delay: 0.5 + statIdx * 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });
      });

      // Stat label fade-in
      statLabelRefs.current.forEach((ref, i) => {
        if (!ref) return;
        gsap.to(ref, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.8 + i * 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Desktop: clip-path reveal + floating bars + stat grid */}
      <section
        ref={sectionRef}
        className="hidden lg:block relative min-h-screen overflow-hidden bg-[#0a0a0a]"
      >
        {/* Andrew's photo with clip-path reveal */}
        <div
          ref={photoRef}
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <img
            src="/andrew-stats-v3.png"
            alt="Andrew Whalen"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "left top" }}
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* 6 floating horizontal bars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              ref={(el) => { barsRef.current[i] = el; }}
              className="absolute left-0 right-0 h-px bg-white/15"
              style={{ top: `${(i + 1) * (100 / 7)}%` }}
            />
          ))}
        </div>

        {/* W-icon watermark */}
        <img
          src="/w-icon-logo.png"
          alt=""
          className="absolute right-[42%] top-1/2 -translate-y-1/2 w-48 opacity-[0.04] select-none pointer-events-none"
        />

        {/* Stats grid — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-[38%] flex flex-col justify-center pr-16 pl-4">
          <div className="space-y-10">
            {STATS.map((stat, i) => (
              <div key={stat.label}>
                <div
                  ref={(el) => { statValueRefs.current[i] = el; }}
                  className="font-playfair text-5xl xl:text-6xl text-white leading-none mb-2 tracking-tight"
                >
                  {splitChars(stat.value)}
                </div>
                <p
                  ref={(el) => { statLabelRefs.current[i] = el; }}
                  className="text-xs uppercase tracking-[0.2em] text-neutral-400"
                  style={{ opacity: 0, transform: "translateY(8px)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile/Tablet: sticky photo + scrolling stat boxes */}
      <section className="relative lg:hidden">
        {/* Sticky photo background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src="/andrew-stats-mobile.png"
            alt="Andrew Whalen"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "45% top" }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Stat boxes scroll over the photo */}
        <div className="relative" style={{ marginTop: "-100vh" }}>
          <div className="h-[75vh]" />

          <div className="space-y-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/75 backdrop-blur-sm py-14 px-6 text-center mx-8"
              >
                <p className="font-playfair text-5xl text-white mb-3">{stat.value}</p>
                <p className="text-sm uppercase tracking-wider text-neutral-300">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Meet Andrew bio — scrolls over same sticky photo on mobile */}
          <div className="bg-[#0a0a0a] py-16 px-6 mt-6">
            <p className="font-playfair italic text-lg text-neutral-400">LoKation Real Estate</p>
            <h2 className="font-playfair text-4xl uppercase tracking-wide text-white mt-2 mb-4">MEET ANDREW</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-10">SERVING MIAMI, FORT LAUDERDALE AND PALM BEACH.</p>
            <p className="text-neutral-300 leading-relaxed mb-6">
              Andrew Whalen has built a reputation as one of South Florida&apos;s most dedicated and
              knowledgeable real estate professionals. With over 1,300 transactions closed and 21+ years
              of experience across Miami-Dade&apos;s most competitive neighborhoods, Andrew combines deep
              market expertise with a data-driven approach that consistently delivers results for his clients.
            </p>
            <p className="text-neutral-300 leading-relaxed mb-8">
              With a career spanning over two decades, Andrew delivers a comprehensive level of
              concierge-style service with extensive experience across every level of real estate —
              including investment analysis, negotiation, new development sales, and marketing.
            </p>
            <a href="/about/" className="text-sm uppercase tracking-wider text-white hover:text-neutral-300 transition-colors">
              Meet Andrew →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
