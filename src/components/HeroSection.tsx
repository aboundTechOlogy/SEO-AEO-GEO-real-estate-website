"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { AddressSearchInput } from "@/components/SearchFilters";

const GOALS = ["Buy", "Sell", "Sell & Buy", "Invest"];

function splitLetters(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="inline-block" style={{ opacity: 0 }}>
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function HeroSection() {
  const router = useRouter();
  const [mobileQuery, setMobileQuery] = useState("");
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop: letter-by-letter stagger, line1 then line2
      const letters1 = line1Ref.current?.querySelectorAll("span");
      const letters2 = line2Ref.current?.querySelectorAll("span");

      const tl = gsap.timeline({ delay: 0.2 });

      if (letters1?.length) {
        tl.to(Array.from(letters1), {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.03,
          ease: "power2.out",
        });
      }
      if (letters2?.length) {
        tl.to(
          Array.from(letters2),
          { opacity: 1, y: 0, duration: 0.05, stagger: 0.03, ease: "power2.out" },
          "-=0.05"
        );
      }
      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "+=0.1");
      }
      if (buttonsRef.current) {
        const btns = buttonsRef.current.querySelectorAll("button");
        tl.to(Array.from(btns), { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.2");
      }

      // Mobile: simple fade in
      if (mobileTitleRef.current) {
        gsap.to(mobileTitleRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background */}
      <img
        src="/hero-miami.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover hero-parallax"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />

      {/* Desktop: left-aligned, vertically centered */}
      <div className="hidden md:flex absolute inset-0 items-center pl-6 md:pl-12 lg:pl-16">
        <div className="max-w-3xl">
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
            <div ref={line1Ref} className="overflow-hidden">{splitLetters("South Florida")}</div>
            <div ref={line2Ref} className="overflow-hidden">{splitLetters("Luxury Real Estate")}</div>
          </h1>
          <p
            ref={subtitleRef}
            className="text-base md:text-lg text-white font-light mt-4 mb-8"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            Select your goal. Our AI concierge handles the rest.
          </p>
          <div ref={buttonsRef} className="inline-flex gap-4">
            {GOALS.map((goal) => (
              <button
                key={goal}
                style={{ opacity: 0, transform: "translateY(20px)" }}
                className="min-w-[160px] md:min-w-[180px] px-8 py-3.5 border-2 border-white/40 hover:border-white/70 text-sm tracking-[0.15em] uppercase text-white hover:bg-white/10 transition-all"
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: centered */}
      <div className="flex md:hidden absolute inset-0 items-center justify-center">
        <div className="text-center px-6 w-full">
          <h1
            ref={mobileTitleRef}
            className="font-playfair text-4xl sm:text-5xl font-light text-white leading-tight"
            style={{ opacity: 0, transform: "translateY(30px)" }}
          >
            South Florida
            <br />
            Luxury Real Estate
          </h1>
          <p className="text-base text-white font-light max-w-xs mx-auto mt-4 mb-8">
            Select your goal. Our AI concierge handles the rest.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
            {GOALS.map((goal) => (
              <button
                key={goal}
                className="min-w-[160px] px-8 py-3.5 border-2 border-white/40 hover:border-white/70 text-sm tracking-[0.15em] uppercase text-white hover:bg-white/10 transition-all"
              >
                {goal}
              </button>
            ))}
          </div>

          {/* Mobile search bar */}
          <div className="relative max-w-sm mx-auto">
            <AddressSearchInput
              value={mobileQuery}
              onChange={(v) => {
                setMobileQuery(v);
                if (v) {
                  const params = new URLSearchParams();
                  params.set("q", v);
                  router.push(`/search/?${params.toString()}`);
                }
              }}
              variant="dark"
              height="h-auto py-3.5"
              inputClassName="text-sm rounded-full! pl-5! pr-12!"
            />
          </div>
          <p className="mt-3">
            <a href="/search/" className="text-white/80 text-sm tracking-wider hover:text-white transition-colors">
              + Advanced search options
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
