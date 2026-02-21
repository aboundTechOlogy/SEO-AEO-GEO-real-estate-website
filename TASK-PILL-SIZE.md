# TASK: Match Filter Pill Size & Shape to Chad's Exactly

## Verified CSS Values (extracted directly from carroll-idx-search-filter.css)

**Desktop** `.ms-sf-dropdown .ms-sf-btn-dropdown`:
- `height: 50px`
- `border-radius: 10px`
- `padding: 0 40px 0 15px` (padding-right 40px at 1024px+, accounts for absolute-positioned arrow)
- `font-weight: 600`
- `font-size: 14px`
- `background-color: white`
- `border: 1px solid` (border color)
- Chevron: `::after` pseudo-element, absolute, `right: 14px`, `top: 50%`, `translateY(-50%)`

**Mobile** (touch-scroll pills):
- `height: 35px`
- `border-radius: 25px` (fully rounded)
- `padding: 0 18px`
- No chevron (`:after { display: none }`)

**Icon sizes** (verified from CSS):
- `sf-icon-house-sale` (For Sale): `font-size: 24px` → use `w-6 h-6`
- `sf-icon-dollar` (Price): `font-size: 16px` → use `w-4 h-4`
- `sf-icon-bed`, `sf-icon-houses` (Bed/Bath, Any Type): `font-size: 22px` → use `w-[22px] h-[22px]`
- `sf-icon-filter` (More): `font-size: 17px` → use `w-[17px] h-[17px]`

---

## What Needs to Change

### File: `src/components/SearchFilters.tsx`

#### 1. Update FilterDropdown's `<button>` — desktop styling + absolute chevron

Find:
```tsx
<button
  onClick={onToggle}
  className="shrink-0 flex items-center gap-2 border border-gray-300 rounded-full px-[15px] py-[6px] min-h-[35px] text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors whitespace-nowrap"
>
  {trigger}
  <svg className="w-3 h-3 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
</button>
```

Replace with:
```tsx
<button
  onClick={onToggle}
  className="shrink-0 relative flex items-center gap-2 bg-white border border-gray-300 rounded-[10px] pl-[15px] pr-[40px] h-[50px] text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap md:flex hidden"
>
  {trigger}
  <svg
    className="absolute right-[14px] top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
</button>
```

Wait — the FilterDropdown button is used on both desktop AND mobile. Instead of hiding with md:flex, make it responsive:

```tsx
<button
  onClick={onToggle}
  className={[
    "shrink-0 relative flex items-center gap-2 bg-white border border-gray-300",
    "text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap",
    // Desktop: 50px tall, 10px radius, padding with room for absolute arrow
    "md:h-[50px] md:rounded-[10px] md:pl-[15px] md:pr-[40px]",
    // Mobile: 35px tall, fully rounded, symmetric padding, no arrow space needed
    "h-[35px] rounded-full px-[18px]",
  ].join(" ")}
>
  {trigger}
  {/* Chevron — hidden on mobile, shown on desktop */}
  <svg
    className="absolute right-[14px] top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none hidden md:block"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
</button>
```

#### 2. Update the SVG icon sizes in the 5 pill triggers

The triggers currently have `className="w-4 h-4 shrink-0"` on all icons. Update each to its verified size:

- **ForSaleFilter** (house-sale icon): change `w-4 h-4` → `w-6 h-6`
- **PriceFilter** (dollar icon): keep `w-4 h-4` ✓ (already correct)
- **BedBathFilter** (bed icon): change `w-4 h-4` → `w-[22px] h-[22px]`
- **PropertyTypeFilter** (houses icon): change `w-4 h-4` → `w-[22px] h-[22px]`
- **MoreFilter** (filter icon): change `w-4 h-4` → `w-[17px] h-[17px]`

#### 3. Update the mobile "Filters" button in MobileSearchBar

Find:
```tsx
className="shrink-0 flex items-center gap-2 border border-gray-300 rounded-full px-[15px] py-[6px] min-h-[35px] text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors whitespace-nowrap"
```

Replace with:
```tsx
className="shrink-0 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-[18px] h-[35px] text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap"
```

#### 4. Update ViewToggle button to match desktop pill sizing

Find the button in `ViewToggle`:
```tsx
className="flex items-center gap-2 border border-gray-300 rounded-full px-[15px] py-[6px] min-h-[35px] text-gray-700 hover:border-gray-400 transition-colors"
```

Replace with:
```tsx
className="flex items-center gap-2 bg-white border border-gray-300 md:rounded-[10px] md:h-[50px] md:px-[15px] rounded-full h-[35px] px-[18px] text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors"
```

---

## Constraints
- Do NOT modify `src/data/mockListings.ts`
- Only touch the 4 items listed above in `SearchFilters.tsx`
- Run `npm run build` — zero errors required before committing
- Commit message: `feat: match filter pill height, radius, and icon sizes to Chad's verified CSS`
