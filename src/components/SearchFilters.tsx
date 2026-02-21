"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

/* ==================== GENERIC DROPDOWN WRAPPER ==================== */
function FilterDropdown({
  trigger,
  children,
  open,
  onToggle,
  align = "left",
  width = "w-[320px]",
}: {
  trigger: ReactNode;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  align?: "left" | "right";
  width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onToggle]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="shrink-0 flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-gray-400 transition-colors whitespace-nowrap"
      >
        {trigger}
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} ${width} bg-white rounded-xl shadow-2xl z-50 overflow-hidden`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ==================== PANEL FOOTER ==================== */
function PanelFooter({ onReset, onDone }: { onReset?: () => void; onDone: () => void }) {
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
        View Properties
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
  open,
  onToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const options = ["For Sale", "For Rent", "Sold"];
  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <>
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M15.75 21H8.25m6.75-18.545L12 1.5 2.25 7.5v13.5h6" />
          </svg>
          For Sale
        </>
      }
      width="w-[280px]"
    >
      <PanelHeader title="Property Search" onDone={onToggle} />
      <div className="px-5 py-4 space-y-3">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
              }`}
            >
              {value === opt && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
            </div>
            <span
              className={`text-sm ${value === opt ? "text-neutral-900 font-medium" : "text-neutral-600"}`}
              onClick={() => onChange(opt)}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
      <PanelFooter onDone={onToggle} />
    </FilterDropdown>
  );
}

/* ==================== PRICE FILTER ==================== */
function PriceFilter({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [min, setMin] = useState("800000");
  const [max, setMax] = useState("");

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <>
          <span className="text-neutral-400">$</span>
          $800K - Any Price
        </>
      }
      width="w-[360px]"
    >
      <PanelHeader title="Price" onDone={onToggle} />
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 focus-within:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-sm mr-1">$</span>
              <input
                type="text"
                value={min}
                onChange={(e) => setMin(e.target.value.replace(/[^0-9]/g, ""))}
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
                value={max}
                onChange={(e) => setMax(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Any"
                className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1.5 ml-1">Maximum</p>
          </div>
        </div>
      </div>
      <PanelFooter onReset={() => { setMin(""); setMax(""); }} onDone={onToggle} />
    </FilterDropdown>
  );
}

/* ==================== BED / BATH FILTER ==================== */
function BedBathFilter({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [bedMin, setBedMin] = useState("");
  const [bedMax, setBedMax] = useState("");
  const [bathMin, setBathMin] = useState("");
  const [bathMax, setBathMax] = useState("");

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <>
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M3 7v11m0-4h18m0 0V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h14Zm0 0v4M3 18h18M5 7V5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2" />
          </svg>
          Bed / Bath
        </>
      }
      width="w-[380px]"
    >
      <PanelHeader title="Rooms" onDone={onToggle} />
      <div className="px-5 py-5 space-y-6">
        {/* Bedrooms */}
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">Bedrooms</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={bedMin}
                onChange={(e) => setBedMin(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Any"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              <p className="text-xs text-neutral-400 mt-1.5 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-20px]">to</span>
            <div className="flex-1">
              <input
                type="text"
                value={bedMax}
                onChange={(e) => setBedMax(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Any"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              <p className="text-xs text-neutral-400 mt-1.5 ml-1">Maximum</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-neutral-200" />

        {/* Bathrooms */}
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">Bathrooms</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={bathMin}
                onChange={(e) => setBathMin(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Any"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              <p className="text-xs text-neutral-400 mt-1.5 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-20px]">to</span>
            <div className="flex-1">
              <input
                type="text"
                value={bathMax}
                onChange={(e) => setBathMax(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Any"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              <p className="text-xs text-neutral-400 mt-1.5 ml-1">Maximum</p>
            </div>
          </div>
        </div>
      </div>
      <PanelFooter
        onReset={() => { setBedMin(""); setBedMax(""); setBathMin(""); setBathMax(""); }}
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

function PropertyTypeFilter({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [selected, setSelected] = useState<string[]>(["Single Family Homes", "Condominiums"]);
  const [hidePending, setHidePending] = useState(false);

  const toggle = (t: string) => {
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      trigger={
        <>
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
          </svg>
          Any Type
        </>
      }
      width="w-[320px]"
    >
      <PanelHeader title="Property Type" onDone={onToggle} />
      <div className="px-5 py-4 space-y-3">
        {PROPERTY_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => toggle(type)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected.includes(type)
                  ? "bg-black border-black"
                  : "border-neutral-300 group-hover:border-neutral-400"
              }`}
            >
              {selected.includes(type) && (
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
              onClick={() => setHidePending(!hidePending)}
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
      <PanelFooter onDone={onToggle} />
    </FilterDropdown>
  );
}

/* ==================== MORE FILTER (MEGA) ==================== */
const KEYWORD_SUGGESTIONS = ["Pool", "Waterfront", "Basement", "Gated", "Pond"];

const WATERFRONT_OPTIONS = [
  "Any", "Bay", "Canal", "Creek", "Fixed Bridge", "Intracoastal",
  "Lake", "Lake Front", "Ocean Access", "Oceanfront", "Point Lot",
  "River", "River Front", "River Frontage", "Water Access",
];

const FEATURE_OPTIONS = [
  "Any", "Boat Dock", "Foreclosures", "Furnished", "Gated Community",
  "Golf Course", "Penthouse", "Pets", "Swimming Pool", "Short Sales",
  "Tennis Courts", "Waterfront",
];

const GARAGE_OPTIONS = ["Any", "1", "2", "3", "4", "5", "5+"];
const DOM_OPTIONS = ["Any", "Today", "7", "14", "21", "30"];

/* Reusable accordion header */
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

/* Min/Max range input pair */
function MinMaxInputs() {
  return (
    <div className="flex items-center gap-3 px-5 pb-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Any"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
      </div>
      <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Any"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
      </div>
    </div>
  );
}

/* Segmented button row (Garage, Days On Market) */
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

/* Radio list (Waterfront Description) */
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
    <div className="px-5 pb-4 space-y-2.5 max-h-[250px] overflow-y-auto">
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

/* Checkbox list (Features) */
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
    <div className="px-5 pb-4 space-y-2.5 max-h-[250px] overflow-y-auto">
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

function MoreFilter({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("For Sale");
  const [garage, setGarage] = useState("Any");
  const [dom, setDom] = useState("Any");
  const [waterfront, setWaterfront] = useState("Any");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Single Family Homes", "Condominiums"]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [hidePending, setHidePending] = useState(false);

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleType = (t: string) => setSelectedTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);
  const toggleFeature = (f: string) => setSelectedFeatures((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f]);

  return (
    <FilterDropdown
      open={open}
      onToggle={onToggle}
      align="right"
      trigger={
        <>
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
          </svg>
          More
        </>
      }
      width="w-[420px]"
    >
      <div className="max-h-[65vh] overflow-y-auto">
        {/* 1. Property Search */}
        <AccordionRow label="Property Search" rightLabel={`${searchType}`} expanded={!!expanded.search} onToggle={() => toggle("search")} />
        {expanded.search && (
          <div className="px-5 pb-4 pt-1 space-y-2.5">
            {["For Sale", "For Rent", "Sold"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setSearchType(opt)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    searchType === opt ? "border-black" : "border-neutral-300 group-hover:border-neutral-400"
                  }`}
                >
                  {searchType === opt && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
                <span className={`text-sm ${searchType === opt ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
                  {opt}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* 2. Price */}
        <AccordionRow label="Price" rightLabel="$800K - Any Price" expanded={!!expanded.price} onToggle={() => toggle("price")} />
        {expanded.price && (
          <div className="flex items-center gap-3 px-5 pb-4 pt-1">
            <div className="flex-1">
              <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5">
                <span className="text-neutral-400 text-sm mr-1">$</span>
                <input type="text" defaultValue="800,000" placeholder="Any" className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
            </div>
            <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
            <div className="flex-1">
              <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5">
                <span className="text-neutral-400 text-sm mr-1">$</span>
                <input type="text" placeholder="Any" className="w-full text-sm text-neutral-900 focus:outline-none bg-transparent" />
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
                  <input type="text" placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
                </div>
                <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
                <div className="flex-1">
                  <input type="text" placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Maximum</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Bathrooms</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input type="text" placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
                  <p className="text-xs text-neutral-400 mt-1 ml-1">Minimum</p>
                </div>
                <span className="text-neutral-400 text-sm mt-[-16px]">to</span>
                <div className="flex-1">
                  <input type="text" placeholder="Any" className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400" />
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
                    selectedTypes.includes(type) ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
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
            <div className="border-t border-neutral-100 pt-3 mt-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setHidePending(!hidePending)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    hidePending ? "bg-black border-black" : "border-neutral-300 group-hover:border-neutral-400"
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
        )}

        {/* 5. Keyword Search */}
        <AccordionRow label="Keyword Search" expanded={!!expanded.keyword} onToggle={() => toggle("keyword")} />
        {expanded.keyword && (
          <div className="px-5 pb-4 pt-1">
            <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 mb-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Select a keyword below or type here..."
                className="flex-1 text-sm text-neutral-900 focus:outline-none bg-transparent placeholder-neutral-400"
              />
              {keyword && (
                <button onClick={() => setKeyword("")} className="text-neutral-400 hover:text-neutral-600">
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
                  onClick={() => setKeyword(kw)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-neutral-400">+</span> {kw}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 mt-3 leading-relaxed">
              Note: To increase accuracy, the keyword filter suggests the most commonly searched terms. Results may vary.
            </p>
          </div>
        )}

        {/* 6. Garage */}
        <AccordionRow label="Garage" expanded={!!expanded.garage} onToggle={() => toggle("garage")} />
        {expanded.garage && <SegmentedButtons options={GARAGE_OPTIONS} value={garage} onChange={setGarage} />}

        {/* 7. Living Size */}
        <AccordionRow label="Living Size" expanded={!!expanded.livingSize} onToggle={() => toggle("livingSize")} />
        {expanded.livingSize && <MinMaxInputs />}

        {/* 8. Land Size */}
        <AccordionRow label="Land Size" expanded={!!expanded.landSize} onToggle={() => toggle("landSize")} />
        {expanded.landSize && <MinMaxInputs />}

        {/* 9. Year Built */}
        <AccordionRow label="Year Built" expanded={!!expanded.yearBuilt} onToggle={() => toggle("yearBuilt")} />
        {expanded.yearBuilt && <MinMaxInputs />}

        {/* 10. Waterfront Description */}
        <AccordionRow label="Waterfront Description" expanded={!!expanded.waterfront} onToggle={() => toggle("waterfront")} />
        {expanded.waterfront && <RadioList options={WATERFRONT_OPTIONS} value={waterfront} onChange={setWaterfront} />}

        {/* 11. Features */}
        <AccordionRow label="Features" expanded={!!expanded.features} onToggle={() => toggle("features")} />
        {expanded.features && <CheckboxList options={FEATURE_OPTIONS} selected={selectedFeatures} onToggle={toggleFeature} />}

        {/* 12. Days On Market */}
        <AccordionRow label="Days On Market" expanded={!!expanded.dom} onToggle={() => toggle("dom")} />
        {expanded.dom && <SegmentedButtons options={DOM_OPTIONS} value={dom} onChange={setDom} />}
      </div>

      {/* Sticky footer */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-neutral-100 bg-white">
        <button className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors px-4 py-2.5 border border-neutral-200 rounded-full">
          Clear Filters
        </button>
        <button
          onClick={onToggle}
          className="flex-1 bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors"
        >
          View 10K Properties
        </button>
      </div>
    </FilterDropdown>
  );
}

/* ==================== MAIN EXPORT ==================== */
type ViewMode = "grid" | "map" | "list";

const VIEW_ICONS: Record<ViewMode, { label: string; icon: React.ReactNode }> = {
  grid: {
    label: "Grid",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
      </svg>
    ),
  },
  map: {
    label: "Map",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
      </svg>
    ),
  },
  list: {
    label: "List",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
      </svg>
    ),
  },
};

export function ViewToggle({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-gray-700 hover:border-gray-400 transition-colors"
      >
        {VIEW_ICONS[view].icon}
        <span className="text-sm font-medium">{VIEW_ICONS[view].label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl z-50 overflow-hidden min-w-[120px]">
          {(["grid", "map", "list"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => { setView(v); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                view === v ? "bg-neutral-100 text-black font-medium" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span className="text-neutral-400">{VIEW_ICONS[v].icon}</span>
              {VIEW_ICONS[v].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== SEARCH BAR (DESKTOP) ==================== */
export function DesktopSearchBar({
  status,
  onStatusChange,
  view,
  onViewChange,
}: {
  status: string;
  onStatusChange: (v: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const toggle = (name: string) => {
    setOpenFilter((prev) => (prev === name ? null : name));
  };

  return (
    <div className="hidden md:flex items-center gap-2 px-6 py-3">
      {/* Search input */}
      <div className="relative flex-1 min-w-[220px] max-w-[400px]">
        <input
          type="text"
          placeholder="Enter Address, City, Zip Code, Subdivision"
          className="w-full bg-transparent border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
        />
      </div>

      {/* Filter buttons */}
      <ForSaleFilter value={status} onChange={onStatusChange} open={openFilter === "status"} onToggle={() => toggle("status")} />
      <PriceFilter open={openFilter === "price"} onToggle={() => toggle("price")} />
      <BedBathFilter open={openFilter === "bedbath"} onToggle={() => toggle("bedbath")} />
      <PropertyTypeFilter open={openFilter === "type"} onToggle={() => toggle("type")} />
      <MoreFilter open={openFilter === "more"} onToggle={() => toggle("more")} />

      {/* Save Search + View Toggle */}
      <div className="ml-auto flex items-center gap-3">
        <button className="shrink-0 bg-black text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors">
          Save Search
        </button>
        <ViewToggle view={view} setView={onViewChange} />
      </div>
    </div>
  );
}

/* ==================== SEARCH BAR (MOBILE) ==================== */
export function MobileSearchBar({
  status,
  onStatusChange,
  view,
  onViewChange,
}: {
  status: string;
  onStatusChange: (v: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const toggle = (name: string) => {
    setOpenFilter((prev) => (prev === name ? null : name));
  };

  return (
    <div className="md:hidden px-4">
      {/* Row 1: Search + view toggle */}
      <div className="flex items-center gap-3 py-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Address, City, Zip Code, Subdivision"
            className="w-full bg-transparent border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
          />
        </div>
        <ViewToggle view={view} setView={onViewChange} />
      </div>

      {/* Row 2: Filter pills (scrollable) */}
      <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
        <ForSaleFilter value={status} onChange={onStatusChange} open={openFilter === "status"} onToggle={() => toggle("status")} />
        <PriceFilter open={openFilter === "price"} onToggle={() => toggle("price")} />
        <BedBathFilter open={openFilter === "bedbath"} onToggle={() => toggle("bedbath")} />
        <PropertyTypeFilter open={openFilter === "type"} onToggle={() => toggle("type")} />
      </div>
    </div>
  );
}
