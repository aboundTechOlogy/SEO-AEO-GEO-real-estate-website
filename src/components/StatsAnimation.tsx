"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { value: "1,300+", label: "Transactions Closed" },
  { value: "21+", label: "Years of Experience" },
  { value: "$500M+", label: "Career Sales Volume" },
  { value: "40+", label: "Neighborhoods Served" },
];

export default function StatsAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const statBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const logoBox = logoBoxRef.current;
      if (!wrapper || !logoBox) return;

      const rect = wrapper.getBoundingClientRect();
      const h = Math.max(wrapper.offsetHeight, 1);
      const wh = window.innerHeight;

      // 0 = section entering from bottom, 1 = section fully scrolled past top
      const p = Math.max(0, Math.min(1, (wh - rect.top) / (h + wh)));

      // W-icon box: full from p=0→0.1, shrinks + fades out from 0.1→0.38
      const logoOp = p < 0.1 ? 1 : Math.max(0, 1 - (p - 0.1) / 0.28);
      const logoScale = p < 0.1 ? 1 : Math.max(0.5, 1 - (p - 0.1) * 1.8);
      logoBox.style.opacity = String(logoOp);
      logoBox.style.transform = `scale(${logoScale})`;

      // Stat boxes: staggered fade in from p=0.32, each offset by 0.07
      statBoxRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = 0.32 + i * 0.07;
        const elP = Math.max(0, Math.min(1, (p - start) / 0.15));
        el.style.opacity = String(elP);
        el.style.transform = `translateY(${(1 - elP) * 22}px)`;
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative hidden lg:block h-screen -mt-[120px] z-10"
    >
      {/* Background image — clipped to section bounds */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/andrew-stats-v3.png"
          alt="Andrew Whalen"
          className="w-full h-full object-cover"
          style={{ objectPosition: "left top" }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Phase 1: W-icon box — top-right, overlaps section boundary above */}
      <div
        ref={logoBoxRef}
        className="absolute top-0 right-0 w-[300px] lg:w-[350px] h-[300px] lg:h-[350px] bg-black flex items-center justify-center z-20"
        style={{ transformOrigin: "top right" }}
      >
        <img
          src="/w-icon-logo.png"
          alt=""
          className="w-[40%] select-none pointer-events-none"
        />
      </div>

      {/* Phase 2+3: Stat boxes — appear as W-icon fades, staggered */}
      <div className="absolute top-0 right-0 grid grid-cols-2 gap-3 z-20">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            ref={(el: HTMLDivElement | null) => { statBoxRefs.current[i] = el; }}
            className="bg-black/70 backdrop-blur-sm p-8 lg:p-10 text-center min-w-[160px] lg:min-w-[180px]"
            style={{ opacity: 0, transform: "translateY(22px)" }}
          >
            <p className="font-playfair text-4xl lg:text-5xl text-white">{stat.value}</p>
            <p className="text-sm uppercase tracking-wider text-neutral-300 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
