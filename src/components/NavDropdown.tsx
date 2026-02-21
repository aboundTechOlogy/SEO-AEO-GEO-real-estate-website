"use client";

import { useState, useRef, useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  dividerBefore?: boolean;
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
      <a
        href={allHref}
        className="text-[12px] uppercase tracking-[0.08em] text-white hover:text-neutral-300 transition-colors"
      >
        {label}
      </a>

      {open && (
        <div className="absolute top-full left-0 mt-4 w-56 bg-white rounded shadow-xl py-3 z-50">
          {items.map((item) => (
            <div key={item.href}>
              {item.dividerBefore && <div className="border-t border-neutral-200 my-2 mx-4" />}
              <a
                href={item.href}
                className="block px-5 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors uppercase tracking-wider"
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
