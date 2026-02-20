"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavDropdown from "@/components/NavDropdown";
import MobileMenu from "@/components/MobileMenu";
import MegaMenu from "@/components/MegaMenu";

const CONDO_ITEMS = [
  { label: "Miami-Dade County", href: "/luxury-condos/" },
  { label: "Broward County", href: "/luxury-condos/broward/" },
  { label: "Palm Beach County", href: "/luxury-condos/palm-beach/" },
  { label: "New Construction", href: "/new-construction/", dividerBefore: true },
];

const NEIGHBORHOOD_ITEMS = [
  { label: "Miami-Dade County", href: "/neighborhoods/" },
  { label: "Broward County", href: "/neighborhoods/broward/" },
  { label: "Palm Beach County", href: "/neighborhoods/palm-beach/" },
  { label: "Search Properties", href: "/search/", dividerBefore: true },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    function onScroll() {
      setScrolled(window.scrollY >= 80);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;
  const bg = transparent ? "bg-transparent" : "bg-black";
  const border = transparent ? "border-b border-white/10" : "border-b border-transparent";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bg} ${border}`}>
      {/* Desktop nav */}
      <nav className="hidden lg:block relative w-full px-4 md:px-6 lg:px-8 py-5 md:py-6">
        {/* Left: Primary Nav Links — absolute left */}
        <div className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 flex items-center gap-8">
          <NavDropdown
            label="Luxury Condos"
            items={CONDO_ITEMS}
            allLabel="All Condos"
            allHref="/luxury-condos/"
          />
          <NavDropdown
            label="Neighborhoods"
            items={NEIGHBORHOOD_ITEMS}
            allLabel="All Neighborhoods"
            allHref="/neighborhoods/"
          />
        </div>

        {/* Center: Logo — absolute center */}
        <div className="flex justify-center">
          <a href="/" className="shrink-0">
            <img
              src="/logo-lockup.png"
              alt="Andrew Whalen | LoKation"
              className="h-9 w-auto"
            />
          </a>
        </div>

        {/* Right: Secondary Nav + Actions — absolute right */}
        <div className="absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 flex items-center gap-6">
          <a href="/about/" className="text-[13px] uppercase tracking-[0.12em] text-white hover:text-neutral-300 transition-colors whitespace-nowrap">
            About Us
          </a>
          <a href="/blog/" className="text-[13px] uppercase tracking-[0.12em] text-white hover:text-neutral-300 transition-colors">
            Insights
          </a>
          <a
            href="/contact/"
            className="border border-white/50 rounded-full px-6 py-2 text-[13px] uppercase tracking-[0.12em] text-white hover:bg-white/10 transition-all whitespace-nowrap"
          >
            Contact Us
          </a>
          {/* Login icon */}
          <a href="/login/" className="text-white hover:text-neutral-300 transition-colors" aria-label="Sign in">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </a>
          {/* Hamburger */}
          <MegaMenu />
        </div>
      </nav>

      {/* Mobile nav */}
      <nav className="lg:hidden w-full px-4 py-5 flex items-center">
        {/* Logo left */}
        <a href="/" className="shrink-0">
          <img
            src="/logo-lockup.png"
            alt="Andrew Whalen | LoKation"
            className="h-7 sm:h-8 w-auto"
          />
        </a>

        {/* Login + Hamburger right */}
        <div className="ml-auto flex items-center gap-4">
          <a href="/login/" className="text-white" aria-label="Sign in">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </a>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
