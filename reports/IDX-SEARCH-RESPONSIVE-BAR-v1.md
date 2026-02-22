# IDX Search Bar Responsive Collapse Fix — v1

**Branch:** `fix/searchbar-responsive-collapse`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/components/SearchFilters.tsx`

---

## Problem

At viewport widths between 768px (md breakpoint) and ~1100px, the desktop search bar rendered all controls in a single `flex` row with no wrapping or overflow handling. Filter buttons, Save Search, and ViewToggle were pushed off-canvas — users lost access to controls until the mobile layout kicked in below 768px.

**Root cause:** `DesktopSearchBar` used `hidden md:flex items-center gap-3` — a single non-wrapping flex row containing address input + 5 filter buttons + Save Search + ViewToggle (~800px+ of content in a 768px container).

---

## Fix

Restructured `DesktopSearchBar` from a single-row flex layout to a 2-row layout:

**Row 1:** Address input (flex-1) + Save Search + ViewToggle
- Address takes full available width
- Save Search and ViewToggle are `shrink-0` on the right

**Row 2:** Filter pills in a horizontally scrollable row
- ForSale, Price, BedBath, Any Type, More
- `overflow-x-auto no-scrollbar` for edge-case overflow at very narrow tablet widths
- At most widths (≥768px), all 5 pills fit without scrolling (~600px total)

**Container:** Changed from `hidden md:flex` to `hidden md:block` with `space-y-2` between rows.

**Mobile bar:** Unchanged. Still uses `md:hidden` with its own 2-row layout.

---

## Validation Matrix

All controls checked at each width. PASS = visible and clickable without scrolling.

| Width | Address | Prop Search | Price | Bed/Bath | Any Type | More | Save Search | Grid/Map/List |
|-------|---------|-------------|-------|----------|----------|------|-------------|---------------|
| 1440  | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 1280  | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 1180  | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 1024  | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 900   | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 820   | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 768   | PASS    | PASS        | PASS  | PASS     | PASS     | PASS | PASS        | PASS          |
| 767   | PASS*   | PASS*       | PASS* | PASS*    | PASS*    | PASS*| PASS*       | PASS*         |

*767px = mobile layout (MobileSearchBar kicks in). All controls accessible via scrollable pill row + Filters button.

---

## Layout Geometry

### Before (broken at 768-1100px)
```
┌─ Address ─────────┬─ ForSale ─┬─ Price ─┬─ Bed/Bath ─┬─ AnyType ─┬─ More ─┬─ Save ─┬─ View ─┐
│  (shrinks)        │           │         │            │  ← OVERFLOW: pushed off-canvas →       │
└───────────────────┴───────────┴─────────┴────────────┴───────────┴────────┴────────┴────────┘
```

### After (all widths ≥768px)
```
┌─ Address (flex-1) ──────────────────────────────────────┬─ Save Search ─┬─ View Toggle ─┐
├─ ForSale ─┬─ Price ─┬─ Bed/Bath ─┬─ Any Type ─┬─ More ─┤               │               │
│  (~600px total — fits in 738px available)               │               │               │
└───────────┴─────────┴────────────┴────────────┴────────┴───────────────┴───────────────┘
```

---

## Files Changed

| File | Lines | Change |
|---|---|---|
| `src/components/SearchFilters.tsx` | +70/−66 | Restructured `DesktopSearchBar` from single-row flex to 2-row block layout; row 1 = address + actions, row 2 = scrollable filter pills |

---

## Build Result

```
✓ Compiled successfully in 7.5s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
