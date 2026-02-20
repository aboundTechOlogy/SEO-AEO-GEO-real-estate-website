"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

export default function FadeInOnScroll({
  children,
  className = "",
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = scale
    ? "opacity-0 translate-y-8 scale-95"
    : "opacity-0 translate-y-8";
  const shown = scale
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-100 translate-y-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? shown : hidden} ${className}`}
    >
      {children}
    </div>
  );
}
