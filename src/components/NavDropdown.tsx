"use client";

import { useState, useRef, useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: NavItem[];
  allLabel: string;
  allHref: string;
}

export default function NavDropdown({ label, items, allLabel, allHref }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
        onClick={() => setOpen(!open)}
      >
        {label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 w-56 bg-neutral-950 border border-white/10 rounded-sm shadow-2xl py-2 z-50">
          <a
            href={allHref}
            className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            {allLabel}
          </a>
          <div className="border-t border-white/5 my-1" />
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
