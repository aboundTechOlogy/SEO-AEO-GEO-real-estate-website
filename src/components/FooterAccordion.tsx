"use client";

import { useState } from "react";

const SECTIONS = [
  {
    title: "Our Listings",
    links: [
      { label: "Miami-Dade", href: "/our-listings/" },
      { label: "Broward", href: "/our-listings/" },
      { label: "Palm Beach", href: "/our-listings/" },
      { label: "Recently Sold", href: "/recent-sales/" },
      { label: "View All", href: "/our-listings/" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Neighborhoods", href: "/neighborhoods/" },
      { label: "Luxury Condos", href: "/luxury-condos/" },
      { label: "New Construction", href: "/new-construction/" },
      { label: "Search Properties", href: "/search/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Insights", href: "/blog/" },
      { label: "Sign In", href: "/login/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy/" },
      { label: "Terms", href: "/terms/" },
      { label: "DMCA", href: "/dmca/" },
    ],
  },
];

export default function FooterAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="md:hidden divide-y divide-white/5">
      {SECTIONS.map((section, i) => (
        <div key={section.title}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-sm uppercase tracking-wider text-neutral-400"
          >
            {section.title}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              open === i ? "max-h-48 pb-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-3 pl-2">
              {section.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
