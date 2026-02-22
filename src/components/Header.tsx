"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavDropdown from "@/components/NavDropdown";
import MegaMenu from "@/components/MegaMenu";
import UserMenu from "@/components/UserMenu";

const LISTING_ITEMS = [
  { label: "Miami-Dade County", href: "/our-listings/" },
  { label: "Broward County", href: "/our-listings/" },
  { label: "Palm Beach County", href: "/our-listings/" },
  { label: "Recently Sold", href: "/recent-sales/", dividerBefore: true },
];

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

const ABOUT_ITEMS = [
  { label: "Meet Andrew", href: "/about/" },
  { label: "Testimonials", href: "/testimonials/" },
  { label: "Insights", href: "/blog/" },
  { label: "How We Use AI", href: "/about/ai/" },
];

const SERVICES_ITEMS = [
  { label: "Seller Services", href: "/services/sellers/" },
  { label: "Buyer Services", href: "/services/buyers/" },
  { label: "Investor Services", href: "/services/investors/" },
  { label: "Request a Market Analysis", href: "/services/market-analysis/", dividerBefore: true },
  { label: "Request an Investment Analysis", href: "/services/investment-analysis/" },
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
  const border = transparent ? "border-b border-white/10" : "border-b border-black/20";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bg} ${border}`}>
      {/* Desktop nav — grid layout, NO transforms (transforms break fixed positioning in children) */}
      <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center w-full px-4 lg:px-6 py-4 min-[1440px]:py-5">
        {/* Left: Primary Nav Links */}
        <div className="flex items-center gap-8">
          <NavDropdown
            label="Our Listings"
            items={LISTING_ITEMS}
            allLabel="View All"
            allHref="/our-listings/"
          />
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

        {/* Center: Logo */}
        <div className="flex justify-center">
          <a href="/" className="shrink-0">
            <img
              src="/logo-lockup.png"
              alt="Andrew Whalen | LoKation"
              className="h-8 w-auto"
            />
          </a>
        </div>

        {/* Right: Secondary Nav + Actions */}
        <div className="flex items-center justify-end gap-6">
          <NavDropdown
            label="About"
            items={ABOUT_ITEMS}
            allLabel="About Andrew"
            allHref="/about/"
          />
          <NavDropdown
            label="Services"
            items={SERVICES_ITEMS}
            allLabel="All Services"
            allHref="/services/"
          />
          <a
            href="/contact/"
            className="border border-white/50 rounded-full px-6 py-2 text-[12px] uppercase tracking-[0.08em] text-white hover:bg-white/10 transition-all whitespace-nowrap"
          >
            Contact Us
          </a>
          <UserMenu />
          {/* Hamburger */}
          <MegaMenu />
        </div>
      </nav>

      {/* Mobile nav */}
      <nav className="lg:hidden w-full px-4 py-[6px] flex items-center">
        {/* Logo left */}
        <a href="/" className="shrink-0">
          <img
            src="/logo-lockup.png"
            alt="Andrew Whalen | LoKation"
            className="h-7 w-auto"
          />
        </a>

        {/* Login + Hamburger right */}
        <div className="ml-auto flex items-center gap-3">
          <UserMenu mobile />
          <MegaMenu />
        </div>
      </nav>
    </header>
  );
}
