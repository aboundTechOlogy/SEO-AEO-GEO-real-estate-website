# IDX Search Responsive Chad Pattern — v1

**Branch:** `fix/search-responsive-chad-mobile-pattern`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/components/SearchFilters.tsx`, `src/app/search/page.tsx`

---

## Problem

1. **Save Search had no mobile/tablet substitute** — hidden below 1180px with no alternative.
2. **Mobile Filters button was dead** — `toggle("more")` opened nothing (keyed to non-existent filter).
3. **No full-screen filters sheet** — mobile/tablet filters only accessible via small dropdown portals.
4. **No breakpoint-synchronized handoff** — Save Search disappeared without the Filters button appearing.

---

## Behavior Changes

### Desktop (>= 1180px)
- Single-row search bar: Address | ForSale | Price | BedBath | Type | More | **Save Search** | ViewDropdown
- No Filters button (individual dropdowns are roomy enough)
- No floating pill

### Tablet (768px - 1179px)
- Single-row search bar: **Filters** | Address | ForSale | Price | BedBath | Type | More | ViewDropdown
- **Save Search hidden** from top bar
- **Filters button appears** on far left (same breakpoint: `min-[1180px]:hidden`)
- **Floating Save Search pill** at bottom center over listings
- Filters button opens **full-screen filters sheet** (portal to document.body)
- Individual filter dropdowns still work for quick changes

### Mobile (< 768px)
- Row 1: Address + ViewToggle
- Row 2: **Filters** | ForSale | Price | BedBath | Type (scrollable pills)
- **Floating Save Search pill** at bottom center
- Filters button opens **full-screen filters sheet**
- Removed: duplicate MoreFilter dropdown, inline Save Search pill

---

## New Components

### `MobileFiltersSheet`
- Full-screen overlay: `fixed inset-0 z-[200] flex flex-col bg-white`
- Header: "Filters" title + X close button
- Body: scrollable accordion sections (all 10 filter groups from MoreFilter)
  - Property Search (status + sold range)
  - Price (min/max)
  - Rooms (bed/bath min/max)
  - Property Type (checkboxes + hide pending)
  - Keyword Search
  - Garage Spaces
  - Living Size (sqft min/max)
  - Waterfront
  - Features
  - Days On Market
- Footer: **sticky** "Clear All" + "View X Properties" — always reachable
- Locks body scroll when open
- Used by both DesktopSearchBar (tablet widths) and MobileSearchBar

### `FloatingSaveSearch` (exported)
- `fixed bottom-6 left-1/2 -translate-x-1/2 z-20 min-[1180px]:hidden`
- Black pill with bookmark icon + "Save Search" text
- Shadow for depth over listings
- Toast message floats above pill
- Rendered in `search/page.tsx` after filter bar

---

## Breakpoint Logic

| Element | < 768px | 768-1179px | >= 1180px |
|---------|---------|-----------|-----------|
| Filters button (desktop bar) | N/A (mobile bar) | **Visible** | Hidden |
| Filters button (mobile bar) | **Visible** | N/A (desktop bar) | N/A |
| Save Search (top bar) | N/A | Hidden | **Visible** |
| Floating Save Search pill | **Visible** | **Visible** | Hidden |
| Full-screen filters sheet | **Available** | **Available** | Not needed |
| Individual filter dropdowns | Via pills | Via dropdowns | Via dropdowns |

---

## Validation Matrix

| Width | Filters Reachable | Sheet Opens/Closes | Top Save Visible | Floating Save Visible | No Dead Controls |
|-------|------------------|-------------------|-----------------|---------------------|-----------------|
| 1600  | PASS (dropdowns)  | N/A               | PASS (visible)   | PASS (hidden)       | PASS            |
| 1440  | PASS (dropdowns)  | N/A               | PASS (visible)   | PASS (hidden)       | PASS            |
| 1280  | PASS (dropdowns)  | N/A               | PASS (visible)   | PASS (hidden)       | PASS            |
| 1180  | PASS (dropdowns)  | N/A               | PASS (visible)   | PASS (hidden)       | PASS            |
| 1024  | PASS (btn + drops)| PASS              | PASS (hidden)    | PASS (visible)      | PASS            |
| 900   | PASS (btn + drops)| PASS              | PASS (hidden)    | PASS (visible)      | PASS            |
| 820   | PASS (btn + drops)| PASS              | PASS (hidden)    | PASS (visible)      | PASS            |
| 768   | PASS (btn + drops)| PASS              | PASS (hidden)    | PASS (visible)      | PASS            |
| 767   | PASS (pills + btn)| PASS              | N/A              | PASS (visible)      | PASS            |
| 430   | PASS (pills + btn)| PASS              | N/A              | PASS (visible)      | PASS            |

---

## Files Changed

| File | Change |
|---|---|
| `src/components/SearchFilters.tsx` | +MobileFiltersSheet (full-screen filter overlay), +FloatingSaveSearch export, DesktopSearchBar gets Filters button (<1180px), MobileSearchBar: fixed Filters button, removed dead MoreFilter + inline Save Search |
| `src/app/search/page.tsx` | Import FloatingSaveSearch, render after filter bar |

---

## Build Result

```
Compiled successfully in 4.7s
Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
