# IDX Search Bar Layout v2 — Single-Row + View Dropdown

**Branch:** `feat/searchbar-single-row-view-dropdown`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/components/SearchFilters.tsx`

---

## Problem

The v1 responsive fix (2-row layout) worked but forced desktop/tablet users into a stacked 2-row bar even when horizontal space was sufficient. The 3-button ViewToggle pill strip consumed ~210px+ of horizontal real estate, making single-row layouts impractical.

---

## Changes

### 1. ViewDropdown (new component)

Replaces the 3-button `ViewToggle` pill strip (~210px) with a compact dropdown button (~100px):
- Shows current view icon + label (e.g., "Grid ▾")
- Dropdown panel (160px wide) with Grid / Map / List options
- Active option highlighted with `bg-gray-100 font-semibold`
- Uses existing `FilterDropdown` wrapper (portal, outside-click, positioning)

### 2. DesktopSearchBar (restructured)

Changed from 2-row `md:block` to single-row `md:flex` with `overflow-x-auto no-scrollbar`:

```
[Address] [ForSale] [Price] [BedBath] [Type] [More] → ml-auto → [Save Search?] [View ▾]
```

- **Address input:** `shrink-0`, responsive width: `w-[240px]` → `min-[1180px]:w-[280px]` → `min-[1440px]:w-[320px]`
- **Filter buttons:** All `shrink-0` via existing FilterDropdown styling
- **Save Search:** `hidden min-[1180px]:block` — hides below 1180px (Chad-like behavior)
- **ViewDropdown:** Always visible, compact
- **Overflow:** `overflow-x-auto no-scrollbar` — horizontal scroll at narrow widths

### 3. MobileSearchBar (unchanged)

Still uses `md:hidden` with its own 2-row layout + ViewToggle pill strip (works well at mobile widths).

---

## Validation Matrix

| Width | Address | Prop Search | Price | Bed/Bath | Type | More | View | Save Search | Dead Controls |
|-------|---------|-------------|-------|----------|------|------|------|-------------|---------------|
| 1600  | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | PASS (visible) | None |
| 1440  | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | PASS (visible) | None |
| 1280  | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | PASS (visible) | None |
| 1180  | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | PASS (visible) | None |
| 1024  | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | hidden (OK) | None |
| 900   | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | hidden (OK) | None |
| 820   | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | hidden (OK) | None |
| 768   | PASS    | PASS        | PASS  | PASS     | PASS | PASS | PASS | hidden (OK) | None |
| 767   | PASS*   | PASS*       | PASS* | PASS*    | PASS*| PASS*| PASS*| in pill row  | None |
| 430   | PASS*   | PASS*       | PASS* | PASS*    | PASS*| PASS*| PASS*| in pill row  | None |

*Below 768px = MobileSearchBar with scrollable pill row. All controls accessible.

---

## Before / After

### Before (v1 — 2-row layout)
```
Row 1: [Address ─────────────────────] [Save Search] [Grid|Map|List]
Row 2: [ForSale] [Price] [BedBath] [Type] [More]
```
- Extra vertical space consumed
- ViewToggle pill strip = ~210px
- Save Search always visible (even when cramped)

### After (v2 — single-row)
```
[Address] [ForSale] [Price] [BedBath] [Type] [More] ──→ [Save?] [View ▾]
```
- Single row, horizontally scrollable
- ViewDropdown = ~100px (saves ~110px)
- Save Search auto-hides below 1180px
- Cleaner, more space-efficient

---

## Space Budget (at md: breakpoint, 768px)

| Element | Width |
|---------|-------|
| Address | 240px |
| ForSale + chevron | ~130px |
| Price + chevron | ~110px |
| BedBath + chevron | ~120px |
| Type + chevron | ~130px |
| More + chevron | ~110px |
| View dropdown | ~100px |
| Gaps (6 × 8px) | ~48px |
| **Total** | **~988px** |
| **Available** (768 - 30px pad) | **738px** |
| **Overflow** | ~250px (scrollable) |

At 1024px+: most/all controls fit without scroll. At 768-1023px: rightmost items require short horizontal scroll.

---

## Files Changed

| File | Lines | Change |
|---|---|---|
| `src/components/SearchFilters.tsx` | +114/−68 | New `ViewDropdown` component; restructured `DesktopSearchBar` from 2-row block to single-row flex with overflow scroll; Save Search hidden below 1180px |

---

## Build Result

```
✓ Compiled successfully in 5.4s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
