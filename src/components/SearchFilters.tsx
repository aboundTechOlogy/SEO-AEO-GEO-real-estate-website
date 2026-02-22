"use client";

import { FormEvent } from "react";

export type ViewMode = "grid" | "map" | "list";

export interface SearchFilterValues {
  q: string;
  status: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  sort: string;
}

interface SearchBarProps {
  values: SearchFilterValues;
  onValuesChange: (patch: Partial<SearchFilterValues>) => void;
  onSubmit: () => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const STATUS_OPTIONS = [
  { label: "For Sale", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Sold", value: "Closed" },
];

const TYPE_OPTIONS = [
  { label: "Any Type", value: "" },
  { label: "Residential", value: "Residential" },
  { label: "Residential Lease", value: "Residential Lease" },
  { label: "Residential Income", value: "Residential Income" },
  { label: "Land", value: "Land" },
];

const NUMERIC_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
];

const SORT_OPTIONS = [
  { label: "Newest Listings", value: "ListingContractDate desc" },
  { label: "Price: High to Low", value: "ListPrice desc" },
  { label: "Price: Low to High", value: "ListPrice asc" },
  { label: "Beds: High to Low", value: "BedroomsTotal desc" },
  { label: "Baths: High to Low", value: "BathroomsTotalInteger desc" },
  { label: "Sq.Ft: High to Low", value: "LivingArea desc" },
  { label: "Days on Market", value: "DaysOnMarket asc" },
];

const VIEW_LABELS: Record<ViewMode, string> = {
  grid: "Grid",
  map: "Map",
  list: "List",
};

function ViewToggle({ view, onViewChange }: { view: ViewMode; onViewChange: (view: ViewMode) => void }) {
  return (
    <div className="flex items-center rounded-full border border-gray-300 overflow-hidden h-[35px] md:h-[50px]">
      {(["grid", "map", "list"] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onViewChange(mode)}
          className={`px-3 md:px-4 text-xs md:text-sm font-medium transition-colors h-full ${
            view === mode ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          aria-label={`Switch to ${VIEW_LABELS[mode]} view`}
        >
          {VIEW_LABELS[mode]}
        </button>
      ))}
    </div>
  );
}

function NumericInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
      placeholder={placeholder}
      className="w-full h-[35px] md:h-[50px] border border-gray-300 rounded-[8px] px-3 md:px-4 text-[13px] md:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
    />
  );
}

export function DesktopSearchBar({ values, onValuesChange, onSubmit, view, onViewChange }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-2 lg:gap-3 px-[15px] pt-[18px] pb-[10px]">
      <input
        type="text"
        value={values.q}
        onChange={(event) => onValuesChange({ q: event.target.value })}
        placeholder="Enter address, city, zip, or street"
        className="min-w-[220px] max-w-[380px] flex-1 h-[50px] border border-gray-300 rounded-[8px] px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
      />

      <select
        value={values.status}
        onChange={(event) => onValuesChange({ status: event.target.value })}
        className="h-[50px] border border-gray-300 rounded-[8px] px-3 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={values.type}
        onChange={(event) => onValuesChange({ type: event.target.value })}
        className="h-[50px] border border-gray-300 rounded-[8px] px-3 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500"
      >
        {TYPE_OPTIONS.map((option) => (
          <option key={option.value || "any"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <NumericInput value={values.minPrice} placeholder="Min Price" onChange={(value) => onValuesChange({ minPrice: value })} />
      <NumericInput value={values.maxPrice} placeholder="Max Price" onChange={(value) => onValuesChange({ maxPrice: value })} />

      <select
        value={values.beds}
        onChange={(event) => onValuesChange({ beds: event.target.value })}
        className="h-[50px] border border-gray-300 rounded-[8px] px-3 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500"
      >
        {NUMERIC_OPTIONS.map((option) => (
          <option key={`beds-${option.value || "any"}`} value={option.value}>
            Beds {option.label}
          </option>
        ))}
      </select>

      <select
        value={values.baths}
        onChange={(event) => onValuesChange({ baths: event.target.value })}
        className="h-[50px] border border-gray-300 rounded-[8px] px-3 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500"
      >
        {NUMERIC_OPTIONS.map((option) => (
          <option key={`baths-${option.value || "any"}`} value={option.value}>
            Baths {option.label}
          </option>
        ))}
      </select>

      <select
        value={values.sort}
        onChange={(event) => onValuesChange({ sort: event.target.value })}
        className="h-[50px] border border-gray-300 rounded-[8px] px-3 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="h-[50px] px-6 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        Search
      </button>

      <ViewToggle view={view} onViewChange={onViewChange} />
    </form>
  );
}

export function MobileSearchBar({ values, onValuesChange, onSubmit, view, onViewChange }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="md:hidden px-4 py-2 space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={values.q}
          onChange={(event) => onValuesChange({ q: event.target.value })}
          placeholder="Address, city, zip, street"
          className="flex-1 h-[35px] border border-gray-300 rounded-[8px] px-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={values.status}
          onChange={(event) => onValuesChange({ status: event.target.value })}
          className="h-[35px] border border-gray-300 rounded-full px-3 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={`m-status-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={values.type}
          onChange={(event) => onValuesChange({ type: event.target.value })}
          className="h-[35px] border border-gray-300 rounded-full px-3 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={`m-type-${option.value || "any"}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <NumericInput value={values.minPrice} placeholder="Min Price" onChange={(value) => onValuesChange({ minPrice: value })} />
        <NumericInput value={values.maxPrice} placeholder="Max Price" onChange={(value) => onValuesChange({ maxPrice: value })} />

        <select
          value={values.beds}
          onChange={(event) => onValuesChange({ beds: event.target.value })}
          className="h-[35px] border border-gray-300 rounded-full px-3 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
        >
          {NUMERIC_OPTIONS.map((option) => (
            <option key={`m-beds-${option.value || "any"}`} value={option.value}>
              Beds {option.label}
            </option>
          ))}
        </select>

        <select
          value={values.baths}
          onChange={(event) => onValuesChange({ baths: event.target.value })}
          className="h-[35px] border border-gray-300 rounded-full px-3 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
        >
          {NUMERIC_OPTIONS.map((option) => (
            <option key={`m-baths-${option.value || "any"}`} value={option.value}>
              Baths {option.label}
            </option>
          ))}
        </select>

        <select
          value={values.sort}
          onChange={(event) => onValuesChange({ sort: event.target.value })}
          className="h-[35px] border border-gray-300 rounded-full px-3 text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={`m-sort-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="w-full h-[35px] bg-gray-900 text-white rounded-full text-xs font-semibold">
        Search Properties
      </button>
    </form>
  );
}
