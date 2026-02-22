"use client";
import { useState, useRef, useEffect, useMemo, ReactNode } from "react";
import { createPortal } from "react-dom";

/* ==================== SHARED TYPES ==================== */

export interface SearchFilterValues {
  priceMin: string;
  priceMax: string;
  bedMin: string;
  bathMin: string;
  propertyTypes: string[];
  // Wired in this patch
  bedMax: string;
  bathMax: string;
  addressQuery: string;
  keyword: string;
  garage: string;
  domMax: string;
  waterfront: string;
  features: string[];
  hidePending: boolean;
  minSqft: string;
  maxSqft: string;
  /** Sold time-range: number of days as string, or "" for any time */
  soldRange: string;
}

export const DEFAULT_FILTER_VALUES: SearchFilterValues = {
  priceMin: "",
  priceMax: "",
  bedMin: "",
  bathMin: "",
  propertyTypes: [],
  bedMax: "",
  bathMax: "",
  addressQuery: "",
  keyword: "",
  garage: "Any",
  domMax: "Any",
  waterfront: "Any",
  features: [],
  hidePending: false,
  minSqft: "",
  maxSqft: "",
  soldRange: "",
};

/* ==================== SOLD RANGE OPTIONS ==================== */
const SOLD_RANGE_OPTIONS: { label: string; value: string }[] = [
  { label: "Last 1 Week", value: "7" },
  { label: "Last 1 Month", value: "30" },
  { label: "Last 3 Months", value: "90" },
  { label: "Last 6 Months", value: "180" },
  { label: "Last 1 Year", value: "365" },
  { label: "Last 2 Years", value: "730" },
  { label: "Last 3 Years", value: "1095" },
  { label: "Last 5 Years", value: "1825" },
];

/* ==================== SOUTH FLORIDA CITY SUGGESTIONS ==================== */

const CITY_SUGGESTIONS = [
  "Miami", "Miami Beach", "Coral Gables", "Brickell", "Aventura",
  "Bal Harbour", "Sunny Isles Beach", "Fisher Island", "Key Biscayne",
  "Coconut Grove", "Edgewater", "Wynwood", "Downtown Miami", "Brickell Key",
  "Fort Lauderdale", "Hollywood", "Hallandale Beach", "Doral",
  "Pinecrest", "South Miami", "Kendall", "Hialeah",
  "North Miami Beach", "Surfside", "Bay Harbor Islands",
  "Palmetto Bay", "Cutler Bay", "El Portal", "Boca Raton",
  "Pembroke Pines", "Weston", "Miramar", "Coral Springs", "Plantation",
];

/* ==================== ADDRESS SEARCH INPUT ==================== */

export function AddressSearchInput({
  value,
  onChange,
  inputClassName,
  height = "h-[50px]",
}: {
  value: string;
  onChange: (v: string) => void;
  inputClassName?: string;
  height?: string;
}) {
  const [inputVal, setInputVal] = useState(value);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep local input text in sync when parent resets
  useEffect(() => {
    setInputVal(value);
  }, [value]);

  const suggestions = useMemo(() => {
    const trimmed = inputVal.trim();
    if (trimmed.length < 2) return [];
    if (/^\d{3,5}$/.test(trimmed)) {
      return [`Zip: ${trimmed}`];
    }
    return CITY_SUGGESTIONS.filter((c) =>
      c.toLowerCase().includes(trimmed.toLowerCase())
    ).slice(0, 7);
  }, [inputVal]);

  const showDropdown = focused && suggestions.length > 0;

  const commit = (val: string) => {
    const clean = val.startsWith("Zip: ") ? val.replace("Zip: ", "") : val;
    setInputVal(clean);
    onChange(clean);
    setFocused(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setInputVal("");
    onChange("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === "Enter" && inputVal.trim()) {
        onChange(inputVal.trim());
        setFocused(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        commit(suggestions[activeIndex]);
      } else {
        onChange(inputVal.trim());
        setFocused(false);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[180px] max-w-[400px]">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setActiveIndex(-1); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Address, City, Zip Code, Subdivision"
          className={[
            "w-full bg-white border border-gray-300 rounded-[6px] pl-[15px] text-gray-900 placeholder-gray-500",
            "focus:outline-none focus:border-gray-500 transition-colors",
            height,
            inputVal ? "pr-[36px]" : "pr-[15px]",
            inputClassName ?? "text-[15px]",
          ].join(" ")}
        />
        {inputVal && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Clear address search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-[210] overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={s}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(s)}
              className={[
                "flex items-center gap-2 w-full text-left px-4 py-2.5 text-[13px] transition-colors",
                i === activeIndex ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
              </svg>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== GENERIC DROPDOWN WRAPPER ==================== */
function FilterDropdown({
  trigger,
  children,
  open,
  onToggle,
  align = "left",
  width = "320px",
}: {
  trigger: ReactNode;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  align?: "left" | "right";
  width?: string;
}) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      if (align === "right") {
        setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
      } else {
        setPos({ top: rect.bottom + 8, left: rect.left });
      }
    }
  }, [open, align]);

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      onToggle();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onToggle]);

  return (
    <div className="relative" ref={btnRef}>
      <button
        onClick={onToggle}
        className={[
          "shrink-0 relative flex items-center gap-1.5 md:gap-2 bg-white border border-gray-300",
          "text-[13px] md:text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap",
          "md:h-[50px] md:rounded-[10px] md:pl-[15px] md:pr-[40px]",
          "h-[35px] rounded-full px-[18px]",
        ].join(" ")}
      >
        {trigger}
        <svg
          className="absolute right-[14px] top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none hidden md:block"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && mounted && pos && createPortal(
        <div
          ref={panelRef}
          className="fixed bg-white rounded-xl shadow-2xl z-[200] overflow-hidden"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            width,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ==================== PANEL FOOTER ==================== */
function PanelFooter({ onReset, onDone, doneLabel }: { onReset?: () => void; onDone: () => void; doneLabel?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-t border-neutral-100">
      {onReset && (
        <button
          onClick={onReset}
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Reset
        </button>
      )}
      <button
        onClick={onDone}
        className="flex-1 bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors"
      >
        {doneLabel ?? "View Properties"}
      </button>
    </div>
  );
}

/* ==================== PANEL HEADER ==================== */
function PanelHeader({ title, onDone }: { title: string; onDone: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <button onClick={onDone} className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
        Done
      </button>
    </div>
  );
}

/* ==================== FOR SALE FILTER ==================== */
function ForSaleFilter({
  value,
  onChange,
  soldRange,
  onSoldRangeChange,
  open,
  onToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  soldRange: string;
  onSoldRangeChange: (v: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const options = ["For Sale", "For Rent", "Sold"];
  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <span className="flex items-center gap-1.5">
          <svg className="hidden md:block w-6 h-6 shrink-0" viewBox="0 0 1024 1024" fill="currentColor">
            <g transform="scale(1,-1) translate(0,-1024)">
              <path d="M140 896c9.271-4.304 16.027-10.476 20-20 0.957-7.613 0.757-15.093 0.5-22.75-0.036-2.044-0.072-4.089-0.109-6.195-0.094-5.020-0.225-10.036-0.391-15.055 1.714 0.003 3.427 0.006 5.193 0.009 101.509 0.179 203.018 0.316 304.526 0.399 12.182 0.010 24.364 0.020 36.545 0.031 3.638 0.003 3.638 0.003 7.349 0.006 39.295 0.035 78.591 0.098 117.886 0.171 40.305 0.075 80.611 0.119 120.916 0.135 24.881 0.011 49.762 0.046 74.642 0.111 17.050 0.042 34.099 0.055 51.149 0.045 9.844-0.005 19.688 0.003 29.533 0.046 9.009 0.039 18.017 0.041 27.025 0.014 3.263-0.003 6.525 0.007 9.788 0.032 4.43 0.032 8.858 0.015 13.288-0.015 2.462 0.003 4.924 0.006 7.461 0.009 10.294-1.527 16.41-6.587 23.447-13.994 4.796-10.33 4.758-19.8 3.25-31-4.309-9.281-10.444-16.072-20-20-8.275-1.097-16.463-0.931-24.797-0.781-2.38 0.011-4.76 0.023-7.213 0.034-7.581 0.045-15.16 0.145-22.74 0.247-5.148 0.040-10.297 0.077-15.445 0.109-12.603 0.081-25.202 0.238-37.805 0.391 0-21.12 0-42.24 0-64 13.941 0.315 13.941 0.315 27.88 0.721 11.704 0.133 19.158-0.393 28.12-8.721 9.35-10.854 9.135-20.060 9.016-33.711 0.019-3.286 0.019-3.286 0.038-6.638 0.032-7.342 0.007-14.684-0.019-22.026 0.011-5.263 0.025-10.526 0.042-15.789 0.036-12.812 0.028-25.624 0.005-38.437-0.018-10.413-0.021-20.827-0.012-31.24 0.001-1.483 0.002-2.965 0.004-4.492 0.003-3.012 0.005-6.023 0.008-9.035 0.023-28.236-0.003-56.473-0.046-84.709-0.036-24.224-0.030-48.448 0.007-72.673-0.043-28.136-0.060-56.271-0.035-84.407-0.003-3.001-0.005-6.001-0.008-9.002-0.002-2.215-0.002-2.215-0.004-4.474-0.007-10.4 0.005-20.8 0.024-31.2 0.025-14 0.007-27.999-0.039-41.998-0.011-5.142-0.008-10.285 0.010-15.427 0.022-7.011-0.005-14.020-0.045-21.031 0.027-3.064 0.027-3.064 0.054-6.189-0.127-11.482-1.008-18.674-9.070-27.522-11.114-10.763-24.020-9.118-38.57-9.016-2.741-0.009-5.481-0.022-8.222-0.038-7.521-0.033-15.040-0.017-22.561 0.008-8.115 0.018-16.229-0.010-24.344-0.032-15.892-0.036-31.784-0.028-47.677-0.005-12.915 0.018-25.831 0.021-38.746 0.012-1.838-0.001-3.675-0.002-5.569-0.004-3.733-0.003-7.467-0.005-11.2-0.008-35.012-0.023-70.024 0.003-105.036 0.046-30.046 0.036-60.092 0.030-90.138-0.007-34.886-0.043-69.772-0.060-104.659-0.035-3.72 0.003-7.439 0.005-11.159 0.008-1.83 0.001-3.66 0.002-5.546 0.004-12.901 0.007-25.801-0.005-38.702-0.024-15.72-0.022-31.441-0.016-47.161 0.026-8.022 0.021-16.043 0.029-24.065 0.003-7.343-0.024-14.685-0.011-22.028 0.032-3.915 0.013-7.831-0.013-11.746-0.040-21.707 0.194-21.707 0.194-30.872 9.070-9.565 10.497-9.134 20.228-9.016 33.711-0.012 2.191-0.025 4.381-0.038 6.638-0.032 7.342-0.007 14.684 0.019 22.026-0.011 5.263-0.025 10.526-0.042 15.789-0.036 12.812-0.028 25.624-0.005 38.437 0.018 10.413 0.021 20.827 0.012 31.24-0.001 1.483-0.002 2.965-0.004 4.492-0.003 3.012-0.005 6.023-0.008 9.035-0.023 28.236 0.003 56.473 0.046 84.709 0.036 24.224 0.030 48.448-0.007 72.673-0.043 28.136-0.060 56.271-0.035 84.407 0.003 3.001 0.005 6.001 0.008 9.002 0.001 1.476 0.002 2.953 0.004 4.474 0.007 10.4-0.005 20.8-0.024 31.2-0.025 14-0.007 27.999 0.039 41.998 0.011 5.142 0.008 10.285-0.010 15.427-0.022 7.011 0.005 14.020 0.045 21.031-0.027 3.064-0.027 3.064-0.054 6.189 0.128 11.547 1.232 18.423 9.070 27.522 10.653 9.899 21.037 8.957 34.75 8.5 10.519-0.248 10.519-0.248 21.25-0.5 0 21.12 0 42.24 0 64-42.24 0-84.48 0-128 0 0.018-9.344 0.036-18.689 0.054-28.316 0.159-85.648 0.279-171.295 0.355-256.943 0.010-11.22 0.020-22.441 0.031-33.661 0.002-2.234 0.004-4.468 0.006-6.769 0.035-36.192 0.098-72.383 0.171-108.575 0.075-37.123 0.119-74.246 0.135-111.37 0.011-22.915 0.046-45.831 0.111-68.746 0.042-15.704 0.055-31.408 0.045-47.113-0.005-9.067 0.003-18.133 0.046-27.2 0.039-8.298 0.041-16.596 0.014-24.894-0.003-3.004 0.007-6.009 0.032-9.013 0.032-4.081 0.010-8.162-0.015-12.242 0.003-2.268 0.006-4.535 0.009-6.872-1.581-10.005-6.786-16.189-13.994-23.037-10.33-4.796-19.8-4.758-31-3.25-9.957 4.623-14.591 10.585-20 20-0.994 6.287-0.994 6.287-0.984 13.158-0.016 2.629-0.032 5.259-0.048 7.968 0.023 2.905 0.046 5.809 0.071 8.714-0.003 3.096-0.010 6.191-0.021 9.287-0.018 8.502 0.014 17.002 0.054 25.504 0.035 9.17 0.023 18.339 0.017 27.509-0.004 15.885 0.021 31.77 0.066 47.656 0.065 22.967 0.086 45.935 0.096 68.902 0.018 37.263 0.071 74.525 0.146 111.788 0.073 36.198 0.13 72.396 0.164 108.594 0.002 2.231 0.004 4.462 0.006 6.761 0.010 11.193 0.021 22.386 0.030 33.579 0.083 92.861 0.224 185.721 0.403 278.581-1.905-0.063-1.905-0.063-3.849-0.127-5.8-0.167-11.6-0.271-17.401-0.373-1.998-0.067-3.996-0.134-6.055-0.203-12.32-0.163-19.328 0.477-28.695 8.703-7.257 7.639-8.62 13.766-9 24 0.38 10.234 1.743 16.361 9 24 10.931 9.6 20.629 8.974 34.75 8.5 2.044-0.036 4.089-0.072 6.195-0.109 5.020-0.094 10.036-0.225 15.055-0.391-0.042 1.27-0.084 2.54-0.127 3.849-0.167 5.8-0.271 11.6-0.373 17.401-0.067 1.998-0.134 3.996-0.203 6.055-0.163 12.32 0.477 19.328 8.703 28.695 10.543 10.016 22.216 9.856 36 8zM352 768c0-21.12 0-42.24 0-64 147.84 0 295.68 0 448 0 0 21.12 0 42.24 0 64-147.84 0-295.68 0-448 0zM288 640c0-147.84 0-295.68 0-448 190.080 0 380.16 0 576 0 0 147.84 0 295.68 0 448-190.080 0-380.16 0-576 0z" />
            </g>
          </svg>
          For Sale
        </span>
      }
      width="280px"
    >
      <PanelHeader title="Property Search" onDone={onToggle} />
      <div className="px-5 py-4 space-y-3">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onChange(opt)}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
              }`}
            >
              {value === opt && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
            </div>
            <span className={`text-sm ${value === opt ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
              {opt}
            </span>
          </label>
        ))}

        {/* Sold time-range sub-options */}
        {value === "Sold" && (
          <div className="mt-1 ml-8 space-y-2.5 border-l-2 border-neutral-100 pl-3">
            <p className="text-[11px] text-neutral-400 uppercase tracking-wide font-medium mb-1">Sold within</p>
            {SOLD_RANGE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    soldRange === opt.value ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                  onClick={() => onSoldRangeChange(opt.value)}
                >
                  {soldRange === opt.value && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
                <span
                  className={`text-[13px] ${soldRange === opt.value ? "text-neutral-900 font-medium" : "text-neutral-500"}`}
                  onClick={() => onSoldRangeChange(opt.value)}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <PanelFooter
        onReset={value === "Sold" ? () => onSoldRangeChange("") : undefined}
        onDone={onToggle}
      />
    </FilterDropdown>
  );
}

/* ==================== PRICE FILTER ==================== */
function PriceFilter({
  open,
  onToggle,
  priceMin,
  priceMax,
  onPriceChange,
}: {
  open: boolean;
  onToggle: () => void;
  priceMin: string;
  priceMax: string;
  onPriceChange: (min: string, max: string) => void;
}) {
  const label = priceMin && priceMax
    ? `$${Number(priceMin).toLocaleString()} - $${Number(priceMax).toLocaleString()}`
    : priceMin
      ? `$${Number(priceMin).toLocaleString()} - Any`
      : "$800K - Any Price";

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <span className="flex items-center gap-1.5">
          <svg className="hidden md:block w-4 h-4 shrink-0" viewBox="0 0 583 1024" fill="currentColor">
            <g transform="scale(1,-1) translate(0,-1024)">
              <path d="M558.857 282.857c0-116.571-83.429-208.571-204.571-228.571v-100c0-10.286-8-18.286-18.286-18.286h-77.143c-9.714 0-18.286 8-18.286 18.286v100c-133.714 18.857-206.857 98.857-209.714 102.286-5.714 6.857-6.286 16.571-1.143 23.429l58.857 77.143c2.857 4 8 6.286 13.143 6.857s10.286-1.143 13.714-5.143c1.143-0.571 81.143-77.143 182.286-77.143 56 0 116.571 29.714 116.571 94.286 0 54.857-67.429 81.714-144.571 112.571-102.857 40.571-230.857 92-230.857 235.429 0 105.143 82.286 192 201.714 214.857v102.857c0 10.286 8.571 18.286 18.286 18.286h77.143c10.286 0 18.286-8 18.286-18.286v-100.571c116-13.143 177.714-76 180-78.286 5.714-6.286 6.857-14.857 2.857-21.714l-46.286-83.429c-2.857-5.143-7.429-8.571-13.143-9.143-5.714-1.143-10.857 0.571-15.429 4-0.571 0.571-69.714 61.714-155.429 61.714-72.571 0-122.857-36-122.857-88 0-60.571 69.714-87.429 150.857-118.857 105.143-40.571 224-86.857 224-224.571z" />
            </g>
          </svg>
          {label}
        </span>
      }
      width="360px"
    >
      <PanelHeader title="Price" onDone={onToggle} />
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 focus-within:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-sm mr-1">$</span>
              <input
                type="text"
                value={priceMin}
                onChange={(e) => onPriceChange(e.target.value.replace(/[^0-9]/g, ""), priceMax)}
                placeholder="Any"
                className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1.5 ml-1">Minimum</p>
          </div>
          <span className="text-neutral-400 text-sm mt-[-20px]">to</span>
          <div className="flex-1">
            <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 focus-within:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-sm mr-1">$</span>
              <input
                type="text"
                value={priceMax}
                onChange={(e) => onPriceChange(priceMin, e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Any"
                className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1.5 ml-1">Maximum</p>
          </div>
        </div>
      </div>
      <PanelFooter onReset={() => onPriceChange("", "")} onDone={onToggle} />
    </FilterDropdown>
  );
}

/* ==================== BED / BATH FILTER ==================== */
function BedBathFilter({
  open,
  onToggle,
  bedMin,
  bathMin,
  onBedBathChange,
}: {
  open: boolean;
  onToggle: () => void;
  bedMin: string;
  bathMin: string;
  onBedBathChange: (bedMin: string, bathMin: string) => void;
}) {
  const label = bedMin || bathMin
    ? [bedMin && `${bedMin}+ Bed`, bathMin && `${bathMin}+ Bath`].filter(Boolean).join(", ")
    : "Bed / Bath";

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <span className="flex items-center gap-1.5">
          <svg className="hidden md:block w-[22px] h-[22px] shrink-0" viewBox="0 0 1024 1024" fill="currentColor">
            <g transform="scale(1,-1) translate(0,-1024)">
              <path d="M241.641 768.274c2.92 0.015 2.92 0.015 5.9 0.031 3.201 0.001 3.201 0.001 6.466 0.003 2.271 0.009 4.542 0.018 6.882 0.027 7.639 0.027 15.279 0.039 22.918 0.051 5.466 0.015 10.933 0.032 16.399 0.050 16.43 0.049 32.86 0.078 49.29 0.104 4.645 0.007 9.289 0.015 13.934 0.024 28.871 0.050 57.742 0.095 86.614 0.119 6.687 0.006 13.373 0.012 20.060 0.018 1.662 0.001 3.324 0.003 5.036 0.005 26.879 0.025 53.757 0.092 80.636 0.175 27.627 0.085 55.254 0.132 82.881 0.142 15.499 0.007 30.997 0.030 46.495 0.096 13.209 0.056 26.418 0.078 39.628 0.056 6.729-0.010 13.455 0.001 20.184 0.045 46.652 0.291 81.233-5.41 116.475-38.477 22.973-23.878 35.275-54.221 35.017-87.102 0.001-1.973 0.001-3.945 0.002-5.977-0.003-6.471-0.034-12.942-0.065-19.413-0.007-4.506-0.013-9.012-0.017-13.518-0.015-11.823-0.054-23.647-0.099-35.47-0.041-12.079-0.059-24.159-0.079-36.238-0.043-23.675-0.111-47.349-0.195-71.023 1.553-0.597 3.105-1.194 4.705-1.81 24.278-10.044 40.885-34.91 51.154-58.073 6.045-17.274 9.031-32.857 8.949-51.17 0.021-3.282 0.021-3.282 0.042-6.631 0.036-7.16 0.029-14.32 0.017-21.48 0.009-5.007 0.020-10.014 0.032-15.020 0.020-11.793 0.008-23.585-0.015-35.378-0.016-10.732 0.019-21.463 0.066-32.195 0.050-11.656 0.055-23.311 0.042-34.967 0-4.941 0.012-9.883 0.037-14.824 0.030-6.898 0.009-13.794-0.026-20.691 0.019-2.036 0.039-4.071 0.059-6.168-0.121-11.575-1.209-18.468-9.062-27.591-7.639-7.257-13.766-8.62-24-9-10.234 0.38-16.361 1.743-24 9-8 12-8 12-8 56-253.44 0-506.88 0-768 0 0-14.52 0-29.040 0-44-10.345-15.517-10.345-15.517-20-20-11.2-1.508-20.67-1.546-31 3.25-8.535 8.108-13.388 14.668-14.016 26.584-0.047 3.943-0.051 7.887-0.019 11.83-0.014 2.161-0.028 4.322-0.042 6.549-0.035 7.138-0.012 14.274 0.015 21.412-0.005 4.983-0.013 9.965-0.023 14.948-0.013 11.788 0.015 23.576 0.057 35.364 0.038 11.995 0 23.989-0.043 35.984-0.029 10.299-0.020 20.597 0.001 30.896 0.005 4.912-0.001 9.823-0.020 14.734-0.133 44.548 5.371 80.606 37.090 114.448 17.11 15.615 17.11 15.615 28 18-0.018 2.473-0.036 4.946-0.054 7.494-0.163 23.39-0.282 46.781-0.361 70.172-0.042 12.023-0.098 24.046-0.189 36.069-0.087 11.619-0.135 23.238-0.156 34.858-0.015 4.416-0.043 8.833-0.087 13.249-0.42 44.482-0.42 44.482 8.846 66.159 0.777 1.834 1.554 3.667 2.354 5.557 13.562 30.456 39.193 52.49 69.653 64.889 11.31 4.202 21.495 7.795 33.633 7.829zM207.25 681.5c-13.239-16.952-15.581-36.878-15.477-57.777 0-1.563-0.001-3.125-0.001-4.735 0.001-5.118 0.017-10.237 0.033-15.355 0.004-3.567 0.007-7.134 0.009-10.702 0.008-9.354 0.027-18.708 0.049-28.062 0.021-9.559 0.030-19.118 0.040-28.677 0.021-18.731 0.057-37.461 0.098-56.191 21.12 0 42.24 0 64 0 0.339 16.032 0.339 16.032 0.596 32.064 0.876 29.353 10.633 52.336 32.029 72.561 16.446 13.868 35.478 21.814 57.1 21.956 1.293 0.013 2.586 0.027 3.919 0.041 4.234 0.038 8.467 0.046 12.7 0.050 2.976 0.013 5.953 0.026 8.929 0.040 6.227 0.024 12.453 0.031 18.68 0.029 7.924 0 15.846 0.054 23.769 0.123 6.146 0.045 12.293 0.053 18.439 0.050 2.918 0.005 5.836 0.022 8.754 0.053 25.184 0.244 43.815-4.413 64.507-19.015 4.519-2.48 4.519-2.48 9.273-0.727 2.626 1.373 2.626 1.373 5.305 2.773 2.251 1.116 4.501 2.233 6.82 3.383 3.676 1.876 7.346 3.764 11.012 5.66 11.015 5.608 18.837 7.207 31.18 7.311 1.934 0.020 1.934 0.020 3.906 0.040 4.256 0.039 8.513 0.063 12.769 0.083 1.463 0.008 2.926 0.016 4.434 0.025 7.756 0.042 15.513 0.070 23.269 0.089 7.953 0.022 15.904 0.091 23.856 0.17 6.164 0.053 12.327 0.069 18.491 0.076 2.928 0.010 5.855 0.033 8.783 0.070 30.146 0.361 53.675-6.073 75.925-27.11 20.918-22.13 26.029-45.146 26.805-74.672 0.248-8.291 0.495-16.583 0.75-25.125 21.12 0 42.24 0 64 0 0.091 20.481 0.164 40.963 0.207 61.444 0.021 9.512 0.049 19.024 0.095 28.537 0.044 9.194 0.067 18.388 0.078 27.583 0.007 3.493 0.022 6.986 0.043 10.479 0.31 41.795 0.31 41.795-19.618 77.59-18.359 17.318-41.888 18.673-65.778 18.635-2.087 0.005-4.174 0.009-6.325 0.014-6.981 0.013-13.962 0.011-20.942 0.009-5.011 0.006-10.021 0.013-15.032 0.020-12.191 0.016-24.382 0.022-36.573 0.023-9.915 0.001-19.829 0.005-29.744 0.011-28.139 0.018-56.277 0.027-84.416 0.025-2.273 0-2.273 0-4.593 0-2.276 0-2.276 0-4.599 0-24.583-0.001-49.166 0.018-73.749 0.047-25.27 0.029-50.54 0.043-75.81 0.041-14.176-0.001-28.351 0.005-42.527 0.026-13.336 0.020-26.672 0.020-40.009 0.005-4.886-0.002-9.773 0.003-14.659 0.015-6.687 0.015-13.374 0.006-20.061-0.009-1.919 0.010-3.837 0.021-5.814 0.031-25.005-0.126-47.133-4.163-64.925-23.026zM328.125 532.5c-10.984-17.309-8.125-31.382-8.125-52.5 52.8 0 105.6 0 160 0 1.86 28.233 1.86 28.233-8.578 53.156-12.825 11.933-28.743 11.46-45.156 11.445-2.068 0.009-4.137 0.017-6.268 0.026-4.36 0.011-8.721 0.013-13.081 0.004-6.632-0.006-13.262 0.041-19.894 0.091-4.253 0.005-8.505 0.006-12.758 0.004-1.963 0.018-3.926 0.037-5.949 0.056-14.322-0.095-29.96-1.089-40.192-12.282zM552.125 532.5c-10.984-17.309-8.125-31.382-8.125-52.5 52.8 0 105.6 0 160 0 1.86 28.233 1.86 28.233-8.578 53.156-12.825 11.933-28.743 11.46-45.156 11.445-2.068 0.009-4.137 0.017-6.268 0.026-4.36 0.011-8.721 0.013-13.081 0.004-6.632-0.006-13.262 0.041-19.894 0.091-4.253 0.005-8.505 0.006-12.758 0.004-1.963 0.018-3.926 0.037-5.949 0.056-14.322-0.095-29.96-1.089-40.192-12.282zM143.25 393.5c-28.292-36.227-15.25-102.296-15.25-137.5 253.44 0 506.88 0 768 0 7.007 74.259 7.007 74.259-19.195 141.633-19.743 18.623-45.142 18.667-70.637 18.635-2.61 0.005-5.22 0.009-7.909 0.014-7.223 0.012-14.446 0.012-21.669 0.010-7.798 0-15.597 0.011-23.395 0.020-15.271 0.017-30.542 0.022-45.813 0.023-12.417 0.001-24.833 0.005-37.25 0.011-35.222 0.018-70.444 0.027-105.666 0.025-2.847 0-2.847 0-5.751 0-1.9 0-3.801 0-5.759 0-30.791-0.001-61.582 0.018-92.372 0.047-31.634 0.029-63.268 0.043-94.902 0.041-17.753-0.001-35.505 0.005-53.258 0.026-15.116 0.018-30.232 0.023-45.348 0.009-7.707-0.007-15.414-0.007-23.121 0.011-8.369 0.019-16.737 0.006-25.106-0.009-3.625 0.015-3.625 0.015-7.323 0.031-26.262-0.107-49.45-3.068-68.275-23.026z" />
            </g>
          </svg>
          {label}
        </span>
      }
      width="380px"
    >
      <PanelHeader title="Rooms" onDone={onToggle} />
      <div className="px-5 py-5 space-y-6">
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">Bedrooms (min)</p>
          <input
            type="text"
            value={bedMin}
            onChange={(e) => onBedBathChange(e.target.value.replace(/[^0-9]/g, ""), bathMin)}
            placeholder="Any minimum"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
          />
          <p className="text-xs text-neutral-400 mt-1 ml-1">Use More filters for max beds/baths</p>
        </div>
        <div className="border-t border-dashed border-neutral-200" />
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">Bathrooms (min)</p>
          <input
            type="text"
            value={bathMin}
            onChange={(e) => onBedBathChange(bedMin, e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Any minimum"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
          />
        </div>
      </div>
      <PanelFooter
        onReset={() => onBedBathChange("", "")}
        onDone={onToggle}
      />
    </FilterDropdown>
  );
}

/* ==================== PROPERTY TYPE FILTER ==================== */
const PROPERTY_TYPES = [
  "Single Family Homes",
  "Condominiums",
  "Townhouses",
  "Multi-Family",
  "Vacant Land",
];

function PropertyTypeFilter({
  open,
  onToggle,
  selectedTypes,
  onTypesChange,
  hidePending,
  onHidePendingChange,
}: {
  open: boolean;
  onToggle: () => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  hidePending: boolean;
  onHidePendingChange: (v: boolean) => void;
}) {
  const toggle = (t: string) => {
    onTypesChange(selectedTypes.includes(t) ? selectedTypes.filter((x) => x !== t) : [...selectedTypes, t]);
  };

  const label = selectedTypes.length > 0 ? selectedTypes.join(", ") : "Any Type";
  const pillLabel = selectedTypes.length > 1 ? `${selectedTypes.length} Types` : label;

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <span className="flex items-center gap-1.5">
          <svg className="hidden md:block w-[22px] h-[22px] shrink-0" viewBox="0 0 1024 1024" fill="currentColor">
            <g transform="scale(1,-1) translate(0,-1024)">
              <path d="M563 892.75c8.419-7.998 13.395-14.538 13.962-26.317 0.023-3.813 0.002-7.627-0.054-11.44 0.001-2.089 0.002-4.178 0.004-6.33-0.006-6.883-0.068-13.764-0.13-20.647-0.015-4.781-0.026-9.562-0.034-14.342-0.031-12.567-0.109-25.133-0.198-37.7-0.082-12.83-0.118-25.66-0.159-38.489-0.086-25.162-0.221-50.323-0.391-75.484 1.206-0.396 2.412-0.793 3.655-1.201 1.598-0.528 3.196-1.057 4.842-1.601 1.577-0.52 3.155-1.040 4.78-1.576 7.141-2.452 14.084-5.319 21.044-8.239 1.531-0.637 3.063-1.273 4.641-1.929 5.057-2.104 10.11-4.216 15.164-6.329 3.629-1.511 7.257-3.022 10.886-4.533 7.703-3.207 15.405-6.419 23.106-9.633 11.75-4.905 23.503-9.8 35.258-14.693 16.020-6.67 32.038-13.345 48.055-20.023 18.495-7.712 36.994-15.415 55.495-23.113 10.1-4.203 20.199-8.41 30.294-12.625 1.952-0.815 3.904-1.63 5.915-2.47 3.893-1.625 7.785-3.251 11.678-4.876 11.382-4.749 22.776-9.469 34.181-14.163 7.094-2.923 14.182-5.863 21.268-8.806 3.281-1.358 6.566-2.709 9.854-4.051 4.496-1.837 8.981-3.7 13.464-5.569 1.295-0.521 2.591-1.042 3.925-1.579 10.069-4.248 18.875-9.778 25.2-18.882 3.632-11.508 3.078-24.272-1.953-35.109-8.004-8.425-14.178-13.432-26-14-8.41 0.398-15.482 2.303-23.422 5.063-2.13 0.733-4.261 1.467-6.456 2.223-1.608 0.566-3.216 1.132-4.872 1.715 0.007-2.236 0.015-4.472 0.022-6.776 0.178-54.381 0.309-108.763 0.392-163.145 0.041-26.298 0.098-52.597 0.189-78.895 0.080-22.919 0.131-45.838 0.149-68.757 0.010-12.138 0.035-24.275 0.093-36.413 0.054-11.422 0.071-22.844 0.059-34.266 0.002-4.194 0.018-8.388 0.049-12.582 0.040-5.724 0.030-11.446 0.008-17.171 0.023-1.661 0.047-3.323 0.071-5.035-0.109-10.57-1.838-16.714-9.033-24.96-8.528-6.635-14.029-9-24.813-9.007-2.552-0.021-5.105-0.042-7.735-0.063-2.818 0.017-5.635 0.035-8.453 0.054-3.005-0.009-6.009-0.022-9.014-0.038-8.25-0.033-16.5-0.017-24.75 0.008-8.9 0.018-17.8-0.010-26.7-0.032-17.432-0.036-34.865-0.028-52.297-0.005-14.166 0.018-28.333 0.021-42.499 0.012-2.015-0.001-4.031-0.002-6.107-0.004-4.094-0.003-8.188-0.005-12.282-0.008-38.4-0.023-76.8 0.003-115.2 0.046-32.957 0.036-65.913 0.030-98.87-0.007-38.261-0.043-76.523-0.060-114.784-0.035-4.079 0.003-8.158 0.005-12.237 0.008-3.011 0.002-3.011 0.002-6.082 0.004-14.151 0.007-28.302-0.005-42.453-0.024-17.243-0.022-34.485-0.016-51.728 0.026-8.799 0.021-17.598 0.029-26.398 0.003-8.054-0.024-16.106-0.011-24.16 0.032-2.915 0.009-5.83 0.004-8.745-0.015-3.96-0.024-7.921 0.005-11.881 0.038-2.2 0.001-4.401 0.003-6.668 0.004-9.857 1.609-16.068 6.822-22.83 13.923-5.001 10.682-4.428 20.706-4.353 32.365-0.015 2.575-0.030 5.149-0.045 7.802-0.040 7.133-0.031 14.266-0.014 21.399 0.010 7.697-0.026 15.394-0.057 23.092-0.047 13.332-0.064 26.663-0.062 39.994 0.003 19.275-0.037 38.55-0.089 57.825-0.082 31.273-0.129 62.546-0.153 93.819-0.024 30.378-0.064 60.755-0.127 91.133-0.004 1.873-0.008 3.745-0.012 5.675-0.020 9.395-0.039 18.789-0.059 28.184-0.166 77.931-0.274 155.861-0.344 233.792-1.223-0.565-2.446-1.13-3.706-1.713-1.611-0.733-3.222-1.466-4.882-2.221-1.594-0.73-3.188-1.46-4.831-2.213-9.35-3.784-18.741-3.229-28.581-1.854-9.769 4.536-15.464 10.231-20 20-1.488 11.053-1.491 20.583 3 30.875 11.696 11.988 27.011 18.123 42.25 24.477 2.068 0.876 4.136 1.751 6.267 2.653 4.475 1.893 8.953 3.779 13.433 5.66 8.434 3.541 16.859 7.106 25.284 10.671 1.849 0.783 1.849 0.783 3.736 1.581 1.861 0.788 1.861 0.788 3.76 1.591 3.813 1.613 7.627 3.224 11.441 4.834 23.922 10.102 47.794 20.319 71.657 30.561 6.981 2.997 13.964 5.991 20.946 8.986 9.388 4.026 18.775 8.052 28.162 12.079 11.693 5.016 23.387 10.029 35.081 15.041 4.669 2.001 9.339 4.003 14.008 6.005 11.59 4.969 23.183 9.931 34.781 14.881 21.865 9.339 43.698 18.738 65.45 28.338 9.010 3.976 18.032 7.923 27.058 11.864 6.152 2.689 12.293 5.399 18.423 8.139 6.769 3.024 13.56 5.994 20.357 8.953 1.97 0.897 3.94 1.795 5.97 2.719 15.571 6.68 32.025 10.23 47.936 2.843zM501.636 810.539c-1.805-0.768-3.61-1.536-5.47-2.327-1.996-0.854-3.992-1.707-6.049-2.587-2.089-0.89-4.177-1.78-6.329-2.697-6.973-2.972-13.943-5.95-20.913-8.928-3.657-1.56-7.313-3.12-10.97-4.68-43.9-18.726-87.769-37.521-131.631-56.336-42.754-18.337-85.514-36.659-128.273-54.984 0-202.62 0-405.24 0-614 21.12 0 42.24 0 64 0 0.019 5.148 0.037 10.295 0.057 15.599 0.068 17.020 0.179 34.039 0.311 51.058 0.079 10.317 0.143 20.634 0.174 30.952 0.030 9.96 0.099 19.918 0.195 29.878 0.030 3.797 0.045 7.594 0.047 11.391 0.005 5.325 0.059 10.647 0.124 15.971-0.015 2.348-0.015 2.348-0.030 4.743 0.196 10.306 2.183 16.333 9.122 24.408 7.884 6.384 15.091 6.873 24.898 6.808 1.465 0.014 2.929 0.027 4.439 0.042 4.823 0.036 9.645 0.029 14.468 0.017 3.365 0.009 6.73 0.020 10.095 0.032 7.046 0.018 14.091 0.013 21.137-0.007 9.014-0.023 18.027 0.017 27.041 0.076 6.947 0.037 13.894 0.036 20.842 0.025 3.323 0 6.645 0.012 9.968 0.037 4.653 0.030 9.303 0.008 13.956-0.026 1.362 0.019 2.725 0.039 4.129 0.059 9.88-0.152 15.513-2.745 23.028-9.062 6.907-8.301 6.884-16.549 6.865-26.924 0.031-2.519 0.031-2.519 0.062-5.088 0.060-5.53 0.079-11.059 0.097-16.589 0.034-3.842 0.070-7.684 0.109-11.526 0.095-10.097 0.155-20.194 0.207-30.292 0.060-10.31 0.153-20.619 0.243-30.928 0.172-20.217 0.304-40.435 0.418-60.652 21.12 0 42.24 0 64 0 0.052 5.347 0.103 10.694 0.156 16.203 0.077 5.203 0.167 10.406 0.259 15.608 0.056 3.604 0.099 7.208 0.127 10.813 0.043 5.194 0.136 10.386 0.239 15.579 0.002 1.6 0.005 3.201 0.007 4.85 0.273 10.526 2.299 16.565 9.211 24.947 10.445 8.113 21.307 7.548 34 6 10.124-4.796 12.044-8.074 18-18 0.66-25.080 1.32-50.16 2-76 84.48 0 168.96 0 256 0 0 138.6 0 277.2 0 420-21.428 9.924-21.428 9.924-43.102 19.203-1.522 0.629-3.045 1.258-4.613 1.906-3.268 1.349-6.536 2.696-9.806 4.041-7.105 2.923-14.206 5.858-21.306 8.792-3.792 1.567-7.584 3.133-11.376 4.699-22.662 9.36-45.292 18.798-67.923 28.234-3.893 1.623-7.785 3.245-11.678 4.868-2.835 1.182-2.835 1.182-5.727 2.388-3.747 1.562-7.494 3.122-11.241 4.682-10.218 4.255-20.426 8.53-30.626 12.828-2.208 0.927-4.416 1.855-6.691 2.811-4.278 1.798-8.554 3.601-12.828 5.41-1.916 0.804-3.832 1.607-5.806 2.435-1.698 0.716-3.396 1.432-5.145 2.17-4.023 1.764-4.023 1.764-8.132 1.532-0.003-1.772-0.006-3.544-0.009-5.37-0.074-43.116-0.192-86.231-0.359-129.347-0.080-20.85-0.144-41.7-0.174-62.551-0.026-18.173-0.080-36.345-0.167-54.518-0.045-9.623-0.077-19.245-0.075-28.868 0.001-9.059-0.034-18.116-0.099-27.174-0.017-3.323-0.020-6.647-0.009-9.97 0.013-4.542-0.023-9.082-0.070-13.624-0.011-3.811-0.011-3.811-0.022-7.698-1.482-10.039-5.815-16.394-13.773-22.575-9.499-4.176-19.087-3.543-29.242-2.305-9.162 4.34-13.888 8.806-18 18-0.907 7.61-0.831 15.186-0.797 22.842-0.013 2.336-0.027 4.672-0.040 7.079-0.031 6.476-0.035 12.952-0.028 19.429 0.001 6.987-0.032 13.974-0.061 20.961-0.046 12.103-0.069 24.205-0.078 36.308-0.013 17.499-0.059 34.997-0.113 52.495-0.087 28.39-0.146 56.78-0.19 85.17-0.042 27.578-0.097 55.156-0.168 82.734-0.004 1.7-0.009 3.4-0.013 5.151-0.022 8.528-0.045 17.056-0.067 25.585-0.186 70.748-0.33 141.497-0.445 212.245-3.682 0-7.027-2.037-10.364-3.461zM320 192c0-42.24 0-84.48 0-128 21.12 0 42.24 0 64 0 0 42.24 0 84.48 0 128-21.12 0-42.24 0-64 0z" />
            </g>
          </svg>
          {pillLabel}
        </span>
      }
      width="320px"
    >
      <PanelHeader title="Property Type" onDone={onToggle} />
      <div className="px-5 py-4 space-y-3">
        {PROPERTY_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => toggle(type)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedTypes.includes(type)
                  ? "bg-black border-black"
                  : "border-neutral-300 group-hover:border-neutral-400"
              }`}
            >
              {selectedTypes.includes(type) && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
            <span className="text-sm text-neutral-700">{type}</span>
          </label>
        ))}

        <div className="border-t border-neutral-100 pt-3 mt-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => onHidePendingChange(!hidePending)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                hidePending
                  ? "bg-black border-black"
                  : "border-neutral-300 group-hover:border-neutral-400"
              }`}
            >
              {hidePending && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
            <span className="text-sm text-neutral-700">Hide Pending / Contingent</span>
          </label>
        </div>
      </div>
      <PanelFooter
        onReset={() => { onTypesChange([]); onHidePendingChange(false); }}
        onDone={onToggle}
      />
    </FilterDropdown>
  );
}

/* ==================== MORE FILTER (MEGA) — FULLY WIRED ==================== */
const KEYWORD_SUGGESTIONS = ["Pool", "Waterfront", "Basement", "Gated", "Pond"];

const WATERFRONT_OPTIONS = [
  "Any", "Bay", "Canal", "Creek", "Fixed Bridge", "Intracoastal",
  "Lake", "Lake Front", "Ocean Access", "Oceanfront", "Point Lot",
  "River", "River Front", "River Frontage", "Water Access",
];

const FEATURE_OPTIONS = [
  "Boat Dock", "Furnished", "Gated Community",
  "Golf Course", "Penthouse", "Pets Allowed", "Swimming Pool", "Short Sales",
  "Tennis Courts", "Waterfront",
];

const GARAGE_OPTIONS = ["Any", "1", "2", "3", "4", "5+"];
const DOM_OPTIONS = ["Any", "Today", "7", "14", "21", "30"];

function AccordionRow({
  label,
  rightLabel,
  expanded,
  onToggle,
}: {
  label: string;
  rightLabel?: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors border-b border-neutral-100"
    >
      <span className="text-sm font-semibold text-neutral-900">{label}</span>
      <div className="flex items-center gap-2">
        {rightLabel && !expanded && (
          <span className="text-sm text-neutral-400">{rightLabel}</span>
        )}
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </button>
  );
}

function SegmentedButtons({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-0 px-5 pb-4">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-2 text-sm font-medium border transition-colors ${
            value === opt
              ? "bg-black text-white border-black"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          } ${opt === options[0] ? "rounded-l-lg" : ""} ${opt === options[options.length - 1] ? "rounded-r-lg" : ""} ${opt !== options[0] ? "-ml-px" : ""}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RadioList({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-5 pb-4 space-y-2.5 max-h-[220px] overflow-y-auto">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onChange(opt)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              value === opt ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
            }`}
          >
            {value === opt && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
          </div>
          <span className={`text-sm ${value === opt ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

function CheckboxList({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="px-5 pb-4 space-y-2.5 max-h-[220px] overflow-y-auto">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onToggle(opt)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              selected.includes(opt) ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
            }`}
          >
            {selected.includes(opt) && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
          <span className="text-sm text-neutral-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function MoreFilter({
  open,
  onToggle,
  filterValues,
  onFilterChange,
  status,
  onStatusChange,
  soldRange,
  onSoldRangeChange,
  totalCount,
  onClearAll,
}: {
  open: boolean;
  onToggle: () => void;
  filterValues: SearchFilterValues;
  onFilterChange: (partial: Partial<SearchFilterValues>) => void;
  status: string;
  onStatusChange: (v: string) => void;
  soldRange: string;
  onSoldRangeChange: (v: string) => void;
  totalCount: number;
  onClearAll: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFeature = (f: string) => {
    const next = filterValues.features.includes(f)
      ? filterValues.features.filter((x) => x !== f)
      : [...filterValues.features, f];
    onFilterChange({ features: next });
  };

  const toggleType = (t: string) => {
    const next = filterValues.propertyTypes.includes(t)
      ? filterValues.propertyTypes.filter((x) => x !== t)
      : [...filterValues.propertyTypes, t];
    onFilterChange({ propertyTypes: next });
  };

  const countLabel = totalCount > 0
    ? `View ${totalCount.toLocaleString()} Properties`
    : "View Properties";

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      align="right"
      trigger={
        <span className="flex items-center gap-1.5">
          <svg className="w-[14px] h-[14px] md:w-[17px] md:h-[17px] shrink-0" viewBox="0 0 1024 1024" fill="currentColor">
            <g transform="scale(1,-1) translate(0,-1024)">
              <path d="M140.873 652.8c15.141 58.843 68.645 102.4 132.206 102.4s117.065-43.557 132.206-102.4h584.594c18.834 0 34.121-15.323 34.121-34.121s-15.323-34.121-34.121-34.121h-584.521c-15.214-58.843-68.645-102.4-132.206-102.4s-117.065 43.557-132.206 102.4h-106.825c-18.834 0-34.121 15.323-34.121 34.121s15.323 34.121 34.121 34.121h106.752zM549.083 311.479h-514.962c-18.834 0-34.121-15.323-34.121-34.121s15.323-34.121 34.121-34.121h514.962c15.141-58.843 68.645-102.4 132.206-102.4s117.065 43.557 132.206 102.4h176.384c18.834 0 34.121 15.323 34.121 34.121s-15.323 34.121-34.121 34.121h-176.311c-15.214 58.843-68.645 102.4-132.206 102.4s-117.065-43.557-132.279-102.4z" />
            </g>
          </svg>
          More
        </span>
      }
      width="440px"
    >
      <div className="max-h-[65vh] overflow-y-auto">

        {/* 1. Property Search (searchType) */}
        <AccordionRow
          label="Property Search"
          rightLabel={status}
          expanded={!!expanded.search}
          onToggle={() => toggle("search")}
        />
        {expanded.search && (
          <div className="px-5 pb-4 pt-1 space-y-2.5">
            {["For Sale", "For Rent", "Sold"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => onStatusChange(opt)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    status === opt ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {status === opt && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
                <span className={`text-sm ${status === opt ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
                  {opt}
                </span>
              </label>
            ))}
            {status === "Sold" && (
              <div className="mt-1 ml-8 space-y-2.5 border-l-2 border-neutral-100 pl-3">
                <p className="text-[11px] text-neutral-400 uppercase tracking-wide font-medium mb-1">Sold within</p>
                {SOLD_RANGE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        soldRange === opt.value ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
                      }`}
                      onClick={() => onSoldRangeChange(opt.value)}
                    >
                      {soldRange === opt.value && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <span
                      className={`text-[13px] ${soldRange === opt.value ? "text-neutral-900 font-medium" : "text-neutral-500"}`}
                      onClick={() => onSoldRangeChange(opt.value)}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Price */}
        <AccordionRow
          label="Price"
          rightLabel={filterValues.priceMin ? `$${Number(filterValues.priceMin).toLocaleString()}+` : undefined}
          expanded={!!expanded.price}
          onToggle={() => toggle("price")}
        />
        {expanded.price && (
          <div className="flex items-center gap-3 px-5 pb-4 pt-1">
            <div className="flex-1">
              <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5">
                <span className="text-neutral-400 text-sm mr-1">$</span>
                <input
                  type="text"
                  value={filterValues.priceMin}
                  onChange={(e) => onFilterChange({ priceMin: e.target.value.replace(/[^0-9]/g, "") })}
                  placeholder="Any"
                  className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
            <div className="flex-1">
              <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5">
                <span className="text-neutral-400 text-sm mr-1">$</span>
                <input
                  type="text"
                  value={filterValues.priceMax}
                  onChange={(e) => onFilterChange({ priceMax: e.target.value.replace(/[^0-9]/g, "") })}
                  placeholder="Any"
                  className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
            </div>
          </div>
        )}

        {/* 3. Rooms (bed/bath min+max) */}
        <AccordionRow label="Rooms" expanded={!!expanded.rooms} onToggle={() => toggle("rooms")} />
        {expanded.rooms && (
          <div className="px-5 pb-4 pt-1 space-y-5">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Bedrooms</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={filterValues.bedMin}
                    onChange={(e) => onFilterChange({ bedMin: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="Any"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400"
                  />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
                </div>
                <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={filterValues.bedMax}
                    onChange={(e) => onFilterChange({ bedMax: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="Any"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400"
                  />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Bathrooms</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={filterValues.bathMin}
                    onChange={(e) => onFilterChange({ bathMin: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="Any"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400"
                  />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
                </div>
                <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={filterValues.bathMax}
                    onChange={(e) => onFilterChange({ bathMax: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="Any"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400"
                  />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Property Type */}
        <AccordionRow label="Property Type" expanded={!!expanded.type} onToggle={() => toggle("type")} />
        {expanded.type && (
          <div className="px-5 pb-4 pt-1 space-y-2.5">
            {PROPERTY_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleType(type)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    filterValues.propertyTypes.includes(type) ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {filterValues.propertyTypes.includes(type) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-neutral-700">{type}</span>
              </label>
            ))}
            <div className="border-t border-neutral-100 pt-3 mt-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => onFilterChange({ hidePending: !filterValues.hidePending })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    filterValues.hidePending ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {filterValues.hidePending && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-neutral-700">Hide Pending / Contingent</span>
              </label>
            </div>
          </div>
        )}

        {/* 5. Keyword Search */}
        <AccordionRow label="Keyword Search" expanded={!!expanded.keyword} onToggle={() => toggle("keyword")} />
        {expanded.keyword && (
          <div className="px-5 pb-4 pt-1">
            <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 mb-3">
              <input
                type="text"
                value={filterValues.keyword}
                onChange={(e) => onFilterChange({ keyword: e.target.value })}
                placeholder="Pool, Waterfront, Gated..."
                className="flex-1 text-sm text-neutral-900 focus:outline-none bg-transparent placeholder-neutral-400"
              />
              {filterValues.keyword && (
                <button
                  onClick={() => onFilterChange({ keyword: "" })}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {KEYWORD_SUGGESTIONS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => onFilterChange({ keyword: kw })}
                  className="flex items-center gap-1 px-3 py-1.5 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-neutral-400">+</span> {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. Garage */}
        <AccordionRow
          label="Garage Spaces"
          rightLabel={filterValues.garage !== "Any" ? `${filterValues.garage}+` : undefined}
          expanded={!!expanded.garage}
          onToggle={() => toggle("garage")}
        />
        {expanded.garage && (
          <SegmentedButtons
            options={GARAGE_OPTIONS}
            value={filterValues.garage}
            onChange={(v) => onFilterChange({ garage: v })}
          />
        )}

        {/* 7. Living Size */}
        <AccordionRow label="Living Size (sq ft)" expanded={!!expanded.livingSize} onToggle={() => toggle("livingSize")} />
        {expanded.livingSize && (
          <div className="flex items-center gap-3 px-5 pb-4 pt-1">
            <div className="flex-1">
              <input
                type="text"
                value={filterValues.minSqft}
                onChange={(e) => onFilterChange({ minSqft: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="Any"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
              <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
            <div className="flex-1">
              <input
                type="text"
                value={filterValues.maxSqft}
                onChange={(e) => onFilterChange({ maxSqft: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="Any"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
              <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
            </div>
          </div>
        )}

        {/* 8. Waterfront Description */}
        <AccordionRow
          label="Waterfront"
          rightLabel={filterValues.waterfront !== "Any" ? filterValues.waterfront : undefined}
          expanded={!!expanded.waterfront}
          onToggle={() => toggle("waterfront")}
        />
        {expanded.waterfront && (
          <RadioList
            options={WATERFRONT_OPTIONS}
            value={filterValues.waterfront}
            onChange={(v) => onFilterChange({ waterfront: v })}
          />
        )}

        {/* 9. Features */}
        <AccordionRow
          label="Features"
          rightLabel={filterValues.features.length > 0 ? `${filterValues.features.length} selected` : undefined}
          expanded={!!expanded.features}
          onToggle={() => toggle("features")}
        />
        {expanded.features && (
          <CheckboxList
            options={FEATURE_OPTIONS}
            selected={filterValues.features}
            onToggle={toggleFeature}
          />
        )}

        {/* 10. Days On Market */}
        <AccordionRow
          label="Days On Market"
          rightLabel={filterValues.domMax !== "Any" ? `≤ ${filterValues.domMax === "Today" ? "1" : filterValues.domMax} days` : undefined}
          expanded={!!expanded.dom}
          onToggle={() => toggle("dom")}
        />
        {expanded.dom && (
          <SegmentedButtons
            options={DOM_OPTIONS}
            value={filterValues.domMax}
            onChange={(v) => onFilterChange({ domMax: v })}
          />
        )}
      </div>

      {/* Sticky footer */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-neutral-100 bg-white">
        <button
          onClick={onClearAll}
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors px-4 py-2.5 border border-neutral-200 rounded-full"
        >
          Clear All
        </button>
        <button
          onClick={onToggle}
          className="flex-1 bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors"
        >
          {countLabel}
        </button>
      </div>
    </FilterDropdown>
  );
}

/* ==================== MOBILE FILTERS SHEET (FULL-SCREEN) ==================== */
function MobileFiltersSheet({
  isOpen,
  onClose,
  filterValues,
  onFilterChange,
  status,
  onStatusChange,
  soldRange,
  onSoldRangeChange,
  totalCount,
  onClearAll,
}: {
  isOpen: boolean;
  onClose: () => void;
  filterValues: SearchFilterValues;
  onFilterChange: (partial: Partial<SearchFilterValues>) => void;
  status: string;
  onStatusChange: (v: string) => void;
  soldRange: string;
  onSoldRangeChange: (v: string) => void;
  totalCount: number;
  onClearAll: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFeature = (f: string) => {
    const next = filterValues.features.includes(f)
      ? filterValues.features.filter((x) => x !== f)
      : [...filterValues.features, f];
    onFilterChange({ features: next });
  };

  const toggleType = (t: string) => {
    const next = filterValues.propertyTypes.includes(t)
      ? filterValues.propertyTypes.filter((x) => x !== t)
      : [...filterValues.propertyTypes, t];
    onFilterChange({ propertyTypes: next });
  };

  const countLabel = totalCount > 0
    ? `View ${totalCount.toLocaleString()} Properties`
    : "View Properties";

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
        <h2 className="text-base font-semibold text-neutral-900">Filters</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Close filters"
        >
          <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. Property Search */}
        <AccordionRow label="Property Search" rightLabel={status} expanded={!!expanded.search} onToggle={() => toggle("search")} />
        {expanded.search && (
          <div className="px-5 pb-4 pt-1 space-y-2.5">
            {["For Sale", "For Rent", "Sold"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => onStatusChange(opt)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    status === opt ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {status === opt && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
                <span className={`text-sm ${status === opt ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
                  {opt}
                </span>
              </label>
            ))}
            {status === "Sold" && (
              <div className="mt-1 ml-8 space-y-2.5 border-l-2 border-neutral-100 pl-3">
                <p className="text-[11px] text-neutral-400 uppercase tracking-wide font-medium mb-1">Sold within</p>
                {SOLD_RANGE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        soldRange === opt.value ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
                      }`}
                      onClick={() => onSoldRangeChange(opt.value)}
                    >
                      {soldRange === opt.value && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <span
                      className={`text-[13px] ${soldRange === opt.value ? "text-neutral-900 font-medium" : "text-neutral-500"}`}
                      onClick={() => onSoldRangeChange(opt.value)}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Price */}
        <AccordionRow
          label="Price"
          rightLabel={filterValues.priceMin ? `$${Number(filterValues.priceMin).toLocaleString()}+` : undefined}
          expanded={!!expanded.price}
          onToggle={() => toggle("price")}
        />
        {expanded.price && (
          <div className="flex items-center gap-3 px-5 pb-4 pt-1">
            <div className="flex-1">
              <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5">
                <span className="text-neutral-400 text-sm mr-1">$</span>
                <input type="text" value={filterValues.priceMin} onChange={(e) => onFilterChange({ priceMin: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
            <div className="flex-1">
              <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5">
                <span className="text-neutral-400 text-sm mr-1">$</span>
                <input type="text" value={filterValues.priceMax} onChange={(e) => onFilterChange({ priceMax: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
            </div>
          </div>
        )}

        {/* 3. Rooms */}
        <AccordionRow label="Rooms" expanded={!!expanded.rooms} onToggle={() => toggle("rooms")} />
        {expanded.rooms && (
          <div className="px-5 pb-4 pt-1 space-y-5">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Bedrooms</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input type="text" value={filterValues.bedMin} onChange={(e) => onFilterChange({ bedMin: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
                </div>
                <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
                <div className="flex-1">
                  <input type="text" value={filterValues.bedMax} onChange={(e) => onFilterChange({ bedMax: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Bathrooms</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input type="text" value={filterValues.bathMin} onChange={(e) => onFilterChange({ bathMin: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
                </div>
                <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
                <div className="flex-1">
                  <input type="text" value={filterValues.bathMax} onChange={(e) => onFilterChange({ bathMax: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Property Type */}
        <AccordionRow label="Property Type" expanded={!!expanded.type} onToggle={() => toggle("type")} />
        {expanded.type && (
          <div className="px-5 pb-4 pt-1 space-y-2.5">
            {PROPERTY_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleType(type)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    filterValues.propertyTypes.includes(type) ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {filterValues.propertyTypes.includes(type) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M4.5 12.75l6 6 9-13.5" /></svg>
                  )}
                </div>
                <span className="text-sm text-neutral-700">{type}</span>
              </label>
            ))}
            <div className="border-t border-neutral-100 pt-3 mt-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => onFilterChange({ hidePending: !filterValues.hidePending })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    filterValues.hidePending ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {filterValues.hidePending && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M4.5 12.75l6 6 9-13.5" /></svg>
                  )}
                </div>
                <span className="text-sm text-neutral-700">Hide Pending / Contingent</span>
              </label>
            </div>
          </div>
        )}

        {/* 5. Keyword */}
        <AccordionRow label="Keyword Search" expanded={!!expanded.keyword} onToggle={() => toggle("keyword")} />
        {expanded.keyword && (
          <div className="px-5 pb-4 pt-1">
            <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 mb-3">
              <input type="text" value={filterValues.keyword} onChange={(e) => onFilterChange({ keyword: e.target.value })} placeholder="Pool, Waterfront, Gated..." className="flex-1 text-sm text-neutral-900 focus:outline-none bg-transparent placeholder-neutral-400" />
              {filterValues.keyword && (
                <button onClick={() => onFilterChange({ keyword: "" })} className="text-neutral-400 hover:text-neutral-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {KEYWORD_SUGGESTIONS.map((kw) => (
                <button key={kw} onClick={() => onFilterChange({ keyword: kw })} className="flex items-center gap-1 px-3 py-1.5 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <span className="text-neutral-400">+</span> {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. Garage */}
        <AccordionRow label="Garage Spaces" rightLabel={filterValues.garage !== "Any" ? `${filterValues.garage}+` : undefined} expanded={!!expanded.garage} onToggle={() => toggle("garage")} />
        {expanded.garage && <SegmentedButtons options={GARAGE_OPTIONS} value={filterValues.garage} onChange={(v) => onFilterChange({ garage: v })} />}

        {/* 7. Living Size */}
        <AccordionRow label="Living Size (sq ft)" expanded={!!expanded.livingSize} onToggle={() => toggle("livingSize")} />
        {expanded.livingSize && (
          <div className="flex items-center gap-3 px-5 pb-4 pt-1">
            <div className="flex-1">
              <input type="text" value={filterValues.minSqft} onChange={(e) => onFilterChange({ minSqft: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
              <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
            <div className="flex-1">
              <input type="text" value={filterValues.maxSqft} onChange={(e) => onFilterChange({ maxSqft: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
              <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
            </div>
          </div>
        )}

        {/* 8. Waterfront */}
        <AccordionRow label="Waterfront" rightLabel={filterValues.waterfront !== "Any" ? filterValues.waterfront : undefined} expanded={!!expanded.waterfront} onToggle={() => toggle("waterfront")} />
        {expanded.waterfront && <RadioList options={WATERFRONT_OPTIONS} value={filterValues.waterfront} onChange={(v) => onFilterChange({ waterfront: v })} />}

        {/* 9. Features */}
        <AccordionRow label="Features" rightLabel={filterValues.features.length > 0 ? `${filterValues.features.length} selected` : undefined} expanded={!!expanded.features} onToggle={() => toggle("features")} />
        {expanded.features && <CheckboxList options={FEATURE_OPTIONS} selected={filterValues.features} onToggle={toggleFeature} />}

        {/* 10. Days On Market */}
        <AccordionRow label="Days On Market" rightLabel={filterValues.domMax !== "Any" ? `≤ ${filterValues.domMax === "Today" ? "1" : filterValues.domMax} days` : undefined} expanded={!!expanded.dom} onToggle={() => toggle("dom")} />
        {expanded.dom && <SegmentedButtons options={DOM_OPTIONS} value={filterValues.domMax} onChange={(v) => onFilterChange({ domMax: v })} />}
      </div>

      {/* Sticky footer — always reachable */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-neutral-200 bg-white shrink-0">
        <button
          onClick={onClearAll}
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors px-4 py-2.5 border border-neutral-200 rounded-full"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors"
        >
          {countLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ==================== FLOATING SAVE SEARCH (TABLET/MOBILE) ==================== */
export function FloatingSaveSearch({
  onSave,
  message,
}: {
  onSave: () => void;
  message: string | null;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 min-[1180px]:hidden">
      <button
        onClick={onSave}
        className="bg-black text-white rounded-full px-6 py-3 text-sm font-semibold shadow-lg hover:bg-neutral-800 transition-colors whitespace-nowrap flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        Save Search
      </button>
      {message && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-full whitespace-nowrap shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
}

/* ==================== MAIN EXPORT ==================== */
type ViewMode = "grid" | "map" | "list";

const VIEW_ICONS: Record<ViewMode, { label: string; icon: React.ReactNode }> = {
  grid: {
    label: "Grid",
    icon: (
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
      </svg>
    ),
  },
  map: {
    label: "Map",
    icon: (
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
      </svg>
    ),
  },
  list: {
    label: "List",
    icon: (
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
      </svg>
    ),
  },
};

export function ViewToggle({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  const VIEWS: ViewMode[] = ["grid", "map", "list"];
  const viewIndex = VIEWS.indexOf(view);

  return (
    <div className="relative shrink-0 flex rounded-full bg-[#f6f6f6]">
      <div
        className="absolute top-1/2 left-0 h-[31px] w-[56px] md:h-[48px] md:w-[70px] min-[1330px]:w-[80px] rounded-full bg-white border border-[#dedede] z-0 pointer-events-none transition-transform duration-300"
        style={{ transform: `translateX(${viewIndex * 100}%) translateY(-50%)` }}
      />
      {VIEWS.map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className="relative z-10 flex items-center justify-center gap-1 h-[35px] w-[56px] md:h-[50px] md:w-[70px] min-[1330px]:w-[80px] text-[12px] md:text-[14px] font-semibold rounded-full text-gray-700"
        >
          {VIEW_ICONS[v].icon}
          <span className="hidden md:block">{VIEW_ICONS[v].label}</span>
        </button>
      ))}
    </div>
  );
}

function ViewDropdown({
  view,
  setView,
  open,
  onToggle,
}: {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const VIEWS: ViewMode[] = ["grid", "map", "list"];

  return (
    <FilterDropdown
      trigger={
        <>
          {VIEW_ICONS[view].icon}
          <span className="hidden md:inline">{VIEW_ICONS[view].label}</span>
        </>
      }
      open={open}
      onToggle={onToggle}
      width="160px"
    >
      <div className="p-2 space-y-0.5">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => { setView(v); onToggle(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              view === v ? "bg-gray-100 font-semibold text-[#1a1a1a]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {VIEW_ICONS[v].icon}
            {VIEW_ICONS[v].label}
          </button>
        ))}
      </div>
    </FilterDropdown>
  );
}

/* ==================== SEARCH BAR (DESKTOP) ==================== */
export function DesktopSearchBar({
  status,
  onStatusChange,
  view,
  onViewChange,
  filterValues,
  onFilterChange,
  totalCount,
  onSaveSearch,
  saveMessage,
}: {
  status: string;
  onStatusChange: (v: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  filterValues: SearchFilterValues;
  onFilterChange: (partial: Partial<SearchFilterValues>) => void;
  totalCount: number;
  onSaveSearch: () => void;
  saveMessage: string | null;
}) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);

  const toggle = (name: string) => {
    setOpenFilter((prev) => (prev === name ? null : name));
  };

  const handleClearAll = () => {
    onFilterChange(DEFAULT_FILTER_VALUES);
    onStatusChange("For Sale");
  };

  return (
    <div className="hidden md:flex items-center gap-2 px-[15px] py-[10px] overflow-x-auto no-scrollbar">
      {/* Filters button — visible only when Save Search is hidden (<1180px) */}
      <button
        onClick={() => setFiltersSheetOpen(true)}
        className="shrink-0 flex items-center gap-2 bg-white border border-gray-300 rounded-[10px] px-[15px] h-[50px] text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap min-[1180px]:hidden"
      >
        <svg className="w-[17px] h-[17px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>

      {/* Address */}
      <div className="shrink-0 min-w-[180px] w-[240px] min-[1180px]:w-[280px] min-[1440px]:w-[320px]">
        <AddressSearchInput
          value={filterValues.addressQuery}
          onChange={(v) => onFilterChange({ addressQuery: v })}
        />
      </div>

      {/* Filters */}
      <ForSaleFilter
        value={status}
        onChange={(v) => { onStatusChange(v); if (v !== "Sold") onFilterChange({ soldRange: "" }); }}
        soldRange={filterValues.soldRange}
        onSoldRangeChange={(v) => onFilterChange({ soldRange: v })}
        open={openFilter === "status"}
        onToggle={() => toggle("status")}
      />
      <PriceFilter
        open={openFilter === "price"}
        onToggle={() => toggle("price")}
        priceMin={filterValues.priceMin}
        priceMax={filterValues.priceMax}
        onPriceChange={(min, max) => onFilterChange({ priceMin: min, priceMax: max })}
      />
      <BedBathFilter
        open={openFilter === "bedbath"}
        onToggle={() => toggle("bedbath")}
        bedMin={filterValues.bedMin}
        bathMin={filterValues.bathMin}
        onBedBathChange={(bed, bath) => onFilterChange({ bedMin: bed, bathMin: bath })}
      />
      <PropertyTypeFilter
        open={openFilter === "type"}
        onToggle={() => toggle("type")}
        selectedTypes={filterValues.propertyTypes}
        onTypesChange={(types) => onFilterChange({ propertyTypes: types })}
        hidePending={filterValues.hidePending}
        onHidePendingChange={(v) => onFilterChange({ hidePending: v })}
      />
      <MoreFilter
        open={openFilter === "more"}
        onToggle={() => toggle("more")}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        status={status}
        onStatusChange={(v) => { onStatusChange(v); if (v !== "Sold") onFilterChange({ soldRange: "" }); }}
        soldRange={filterValues.soldRange}
        onSoldRangeChange={(v) => onFilterChange({ soldRange: v })}
        totalCount={totalCount}
        onClearAll={handleClearAll}
      />

      {/* Right-side actions */}
      <div className="shrink-0 ml-auto flex items-center gap-2">
        <div className="relative hidden min-[1180px]:block">
          <button
            onClick={onSaveSearch}
            className="shrink-0 bg-black text-white rounded-full px-5 h-[50px] text-sm font-semibold hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Save Search
          </button>
          {saveMessage && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-full whitespace-nowrap shadow-lg z-50">
              {saveMessage}
            </div>
          )}
        </div>
        <ViewDropdown
          view={view}
          setView={onViewChange}
          open={openFilter === "view"}
          onToggle={() => toggle("view")}
        />
      </div>

      {/* Full-screen filters sheet (tablet) */}
      <MobileFiltersSheet
        isOpen={filtersSheetOpen}
        onClose={() => setFiltersSheetOpen(false)}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        status={status}
        onStatusChange={(v) => { onStatusChange(v); if (v !== "Sold") onFilterChange({ soldRange: "" }); }}
        soldRange={filterValues.soldRange}
        onSoldRangeChange={(v) => onFilterChange({ soldRange: v })}
        totalCount={totalCount}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

/* ==================== SEARCH BAR (MOBILE) ==================== */
export function MobileSearchBar({
  status,
  onStatusChange,
  view,
  onViewChange,
  filterValues,
  onFilterChange,
  totalCount,
  onSaveSearch,
}: {
  status: string;
  onStatusChange: (v: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  filterValues: SearchFilterValues;
  onFilterChange: (partial: Partial<SearchFilterValues>) => void;
  totalCount: number;
  onSaveSearch: () => void;
}) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);

  const toggle = (name: string) => {
    setOpenFilter((prev) => (prev === name ? null : name));
  };

  const handleClearAll = () => {
    onFilterChange(DEFAULT_FILTER_VALUES);
    onStatusChange("For Sale");
  };

  return (
    <div className="md:hidden px-4">
      {/* Row 1: Search + view toggle */}
      <div className="flex items-center gap-3 py-2">
        <AddressSearchInput
          value={filterValues.addressQuery}
          onChange={(v) => onFilterChange({ addressQuery: v })}
          height="h-[35px]"
          inputClassName="text-sm"
        />
        <ViewToggle view={view} setView={onViewChange} />
      </div>

      {/* Row 2: Filter pills — scrollable, single row */}
      <div className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFiltersSheetOpen(true)}
          className="shrink-0 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-[16px] h-[35px] text-[13px] font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters
        </button>
        <ForSaleFilter
          value={status}
          onChange={(v) => { onStatusChange(v); if (v !== "Sold") onFilterChange({ soldRange: "" }); }}
          soldRange={filterValues.soldRange}
          onSoldRangeChange={(v) => onFilterChange({ soldRange: v })}
          open={openFilter === "status"}
          onToggle={() => toggle("status")}
        />
        <PriceFilter
          open={openFilter === "price"}
          onToggle={() => toggle("price")}
          priceMin={filterValues.priceMin}
          priceMax={filterValues.priceMax}
          onPriceChange={(min, max) => onFilterChange({ priceMin: min, priceMax: max })}
        />
        <BedBathFilter
          open={openFilter === "bedbath"}
          onToggle={() => toggle("bedbath")}
          bedMin={filterValues.bedMin}
          bathMin={filterValues.bathMin}
          onBedBathChange={(bed, bath) => onFilterChange({ bedMin: bed, bathMin: bath })}
        />
        <PropertyTypeFilter
          open={openFilter === "type"}
          onToggle={() => toggle("type")}
          selectedTypes={filterValues.propertyTypes}
          onTypesChange={(types) => onFilterChange({ propertyTypes: types })}
          hidePending={filterValues.hidePending}
          onHidePendingChange={(v) => onFilterChange({ hidePending: v })}
        />
      </div>

      {/* Full-screen filters sheet */}
      <MobileFiltersSheet
        isOpen={filtersSheetOpen}
        onClose={() => setFiltersSheetOpen(false)}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        status={status}
        onStatusChange={(v) => { onStatusChange(v); if (v !== "Sold") onFilterChange({ soldRange: "" }); }}
        soldRange={filterValues.soldRange}
        onSoldRangeChange={(v) => onFilterChange({ soldRange: v })}
        totalCount={totalCount}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
