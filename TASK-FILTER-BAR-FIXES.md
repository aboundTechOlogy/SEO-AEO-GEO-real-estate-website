# TASK: Filter Bar — 3 Specific Fixes

## Verified Source
Chad's filter bar container: `.ms-sf-filter .ms-sf-filter-header .ms-flex { padding: 10px 15px; flex-wrap: nowrap }`
→ 10px top, 10px bottom — equal above and below

---

## Fix 1: Balance padding above and below pills

### File: `src/components/SearchFilters.tsx`

Find the `DesktopSearchBar` return wrapper:
```tsx
<div className="hidden md:flex items-center gap-3 px-6 py-3">
```

Replace with:
```tsx
<div className="hidden md:flex items-center gap-3 px-[15px] py-[10px]">
```

Note: `py-[10px]` = 10px top + 10px bottom (equal, matches Chad's verified spec). `px-[15px]` matches Chad's horizontal padding.

---

## Fix 2: Darken address input placeholder text

### File: `src/components/SearchFilters.tsx`

Find the desktop search input (inside `DesktopSearchBar`):
```tsx
className="w-full bg-white border border-gray-300 rounded-[6px] px-[15px] h-[50px] text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
```

Change `placeholder-gray-400` → `placeholder-gray-500`:
```tsx
className="w-full bg-white border border-gray-300 rounded-[6px] px-[15px] h-[50px] text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
```

---

## Fix 3: Save Search button — solid black

### File: `src/components/SearchFilters.tsx`

Find the Save Search button (inside `DesktopSearchBar`, near the end):
```tsx
<button className="shrink-0 relative flex items-center gap-2 bg-white border border-gray-300 rounded-[10px] px-[15px] h-[50px] text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap">
  Save Search
</button>
```

Replace with:
```tsx
<button className="shrink-0 bg-black text-white rounded-full px-6 h-[50px] text-sm font-semibold hover:bg-neutral-800 transition-colors whitespace-nowrap">
  Save Search
</button>
```

---

## Constraints
- Do NOT modify `src/data/mockListings.ts`
- Only touch the 3 elements listed above
- Run `npm run build` — zero errors before committing
- Commit message: `fix: balance filter bar padding, darken placeholder, black Save Search button`
