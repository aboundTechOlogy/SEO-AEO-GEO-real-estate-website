"use client";

import { useState, useEffect } from "react";

const MENU_SECTIONS = {
  top: [
    {
      title: "Luxury Condos",
      links: [
        { label: "Brickell", href: "/luxury-condos/brickell/" },
        { label: "Miami Beach", href: "/luxury-condos/miami-beach/" },
        { label: "Coconut Grove", href: "/luxury-condos/coconut-grove/" },
        { label: "Coral Gables", href: "/luxury-condos/coral-gables/" },
        { label: "Sunny Isles", href: "/luxury-condos/sunny-isles/" },
        { label: "Edgewater", href: "/luxury-condos/edgewater/" },
        { label: "New Construction", href: "/new-construction/" },
        { label: "View All", href: "/luxury-condos/" },
      ],
    },
    {
      title: "Neighborhoods",
      links: [
        { label: "Brickell", href: "/neighborhoods/brickell/" },
        { label: "Miami Beach", href: "/neighborhoods/miami-beach/" },
        { label: "Coconut Grove", href: "/neighborhoods/coconut-grove/" },
        { label: "Coral Gables", href: "/neighborhoods/coral-gables/" },
        { label: "Key Biscayne", href: "/neighborhoods/key-biscayne/" },
        { label: "Downtown Miami", href: "/neighborhoods/downtown-miami/" },
        { label: "Edgewater", href: "/neighborhoods/edgewater/" },
        { label: "View All", href: "/neighborhoods/" },
      ],
    },
  ],
  bottom: [
    {
      title: "About",
      links: [
        { label: "About Andrew", href: "/about/" },
        { label: "Insights", href: "/blog/" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Contact", href: "/contact/" },
        { label: "Request a Market Analysis", href: "/contact/?goal=market-analysis" },
        { label: "Sign In", href: "/login/" },
      ],
    },
  ],
};

export default function MegaMenu() {
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
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        className="text-white hover:text-neutral-300 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay + Slide-out Panel */}
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Dark overlay on left */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Right panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[55%] bg-neutral-900 overflow-y-auto">
            {/* Background image with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url('/hero-miami.jpg')" }}
            />
            <div className="relative z-10">
              {/* Header: Logo + Close */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                <a href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                  <img src="/w-icon-logo.png" alt="W" className="h-8 w-auto" />
                  <img src="/aw-name-logo.png" alt="Andrew Whalen" className="h-4 w-auto" />
                  <span className="w-px h-6 bg-white/30 mx-2" />
                  <img src="/lokation-logo.png" alt="LoKation" className="h-2.5 w-auto brightness-0 invert" />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-neutral-300 transition-colors p-1"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Top sections — 2 column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
                {MENU_SECTIONS.top.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-lg font-semibold tracking-wide mb-4">{section.title}</h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.href} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                          <a
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="text-neutral-300 hover:text-white transition-colors"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mx-8" />

              {/* Bottom sections — 2 column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
                {MENU_SECTIONS.bottom.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-lg font-semibold tracking-wide mb-4">{section.title}</h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.href} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                          <a
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="text-neutral-300 hover:text-white transition-colors"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer with address */}
              <div className="border-t border-white/10 mx-8" />
              <div className="px-8 py-8 text-sm text-neutral-400">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                  </svg>
                  <span>Serving Miami-Dade County &amp; South Florida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
