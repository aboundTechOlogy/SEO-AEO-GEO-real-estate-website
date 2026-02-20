"use client";
import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  start?: string;
}

export default function ScrollReveal({
  children,
  className,
  stagger = 0.12,
  y = 40,
  duration = 0.8,
  delay = 0,
  once = true,
  start = "top 80%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const targets = ref.current.querySelectorAll("[data-reveal]");
    const animTargets = targets.length > 0 ? Array.from(targets) : [ref.current];

    gsap.set(animTargets, { opacity: 0, y });

    const tween = gsap.to(animTargets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start, once },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, y, duration, delay, once, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
