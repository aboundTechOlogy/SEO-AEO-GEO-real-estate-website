"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Luxury Condos", href: "/luxury-condos/" },
  { label: "Miami-Dade County", href: "/luxury-condos/", indent: true },
  { label: "Broward County", href: "/luxury-condos/broward/", indent: true },
  { label: "Palm Beach County", href: "/luxury-condos/palm-beach/", indent: true },
  { label: "New Construction", href: "/new-construction/", indent: true },
  { label: "Neighborhoods", href: "/neighborhoods/" },
  { label: "Miami-Dade County", href: "/neighborhoods/", indent: true },
  { label: "Broward County", href: "/neighborhoods/broward/", indent: true },
  { label: "Palm Beach County", href: "/neighborhoods/palm-beach/", indent: true },
  { label: "Search Properties", href: "/search/", indent: true },
  { label: "About Us", href: "/about/" },
  { label: "Insights", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
  { label: "Sign In", href: "/login/" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 text-white hover:text-neutral-300 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Slide-out panel */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-neutral-950 border-l border-white/5 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-6">
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 pb-6 overflow-y-auto h-[calc(100%-72px)]">
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 text-sm uppercase tracking-wider transition-colors ${
                    link.indent
                      ? "pl-4 text-neutral-500 hover:text-white"
                      : "text-neutral-300 hover:text-white font-light"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
