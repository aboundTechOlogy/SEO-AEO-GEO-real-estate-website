# IDX Parity Matrix — FINAL Report

**Date:** 2026-02-22
**Branch:** `fix/chad-codefirst-parity-rebuild`
**PRD:** `reference/PRD-IDX-PARITY-EXECUTION-LOCK-v3-FINAL.md`

---

## Build Result

```
npm run build → PASS (0 errors, 116 static pages generated)
Next.js 16.1.6 (Turbopack)
```

---

## Acceptance Matrix

| # | Item | Result |
|---|------|--------|
| 1 | Build: `npm run build` passes (0 errors) | **PASS** |
| 2 | Search controls: all functional at every width | **PASS** |
| 3 | Filter sheet: open/close/clear/apply/resize behavior correct | **PASS** |
| 4 | Save Search: breakpoint placement correct (>=1180 top, <1180 floating) | **PASS** |
| 5 | View selector: reachable + functional all widths | **PASS** |
| 6 | Sold ranges: exact options + functional filtering | **PASS** |
| 7 | Overlay X: persistent at all scroll positions | **PASS** |
| 8 | Overlay refresh behavior parity: `?show=` persists overlay on refresh | **PASS** |
| 9 | Header icon role parity: open/external -> canonical, expand -> fullscreen media | **PASS** |
| 10 | Overlay + canonical section parity | **PASS** |
| 11 | Icon parity (no emoji, correct SVG set) | **PASS** |
| 12 | Map block placement + behavior parity | **PASS** |
| 13 | Similar properties placement parity | **PASS** |
| 14 | Legal disclosure full-width bottom parity | **PASS** |

**Result: 14/14 PASS**

---

## Changed Files

### New Files
| File | Purpose |
|------|---------|
| `src/components/IdxIcons.tsx` | SVG icon library matching Chad sf-icon-* set (30+ icons) |
| `src/app/api/property/[listingKey]/route.ts` | API route for client-side overlay property fetching |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/search/layout.tsx` | Simplified: removed @modal slot + ModalPortal |
| `src/app/search/page.tsx` | Added `?show=` overlay param, useSearchParams, PropertyDetailPanel render, Suspense wrapper, onOpenOverlay callbacks |
| `src/components/PropertyDetailPanel.tsx` | All emoji icons replaced with SVG (IdxIcons), handleClose removes `?show=` param, correct header icon roles |
| `src/components/SearchPropertyCard.tsx` | Added `onOpenOverlay` prop, click intercept for overlay mode |
| `src/app/property/[listingKey]/page.tsx` | Complete rebuild: white bg, section order parity with overlay, all data sections (Basic, Exterior, Interior, Property, Tax), static map, legal disclosure |

### Deleted Files
| File | Reason |
|------|--------|
| `src/app/search/@modal/default.tsx` | Replaced by `?show=` overlay system |
| `src/app/search/@modal/(..)property/[listingKey]/page.tsx` | Replaced by `?show=` overlay system |
| `src/app/search/@modal/(..)property/[listingKey]/loading.tsx` | Replaced by `?show=` overlay system |

---

## Section Order Parity (Overlay + Canonical)

Both surfaces follow this exact order:

1. Header/address
2. Media/gallery
3. Price/stats strip (price, est. payment, beds, baths, half bath, sqft, $/sqft)
4. Description
5. Basic Information (iconized in overlay, plain in canonical)
6. Exterior Features
7. Interior Features
8. Property Features
9. Tax Information (conditional)
10. Location map (Google static map)
11. Similar Properties
12. Legal/courtesy disclosure (full-width bottom)

---

## Icon Parity Summary

All emoji characters removed from `PropertyDetailPanel.tsx`:
- `✕` -> `<IconClose />`
- `★/☆` -> `<IconLove active={true/false} />`
- `↗` -> `<IconShared />`
- `↱` -> `<IconOpen />`
- `⤢` -> `<IconExpand />`
- `☎` -> `<IconPhone />`
- `✉` -> `<IconEnvelope />`
- `‹/›` -> `<IconChevronLeft />` / `<IconChevronRight />`

SVG icons match Chad's sf-icon-* visual intent (shape + placement + size + state).

---

## Overlay Refresh Behavior

- URL: `/search?...&show=listingKey`
- On refresh: `useSearchParams()` reads `show` param, fetches property via `/api/property/[listingKey]`, renders `PropertyDetailPanel` inline
- Close: removes `?show=` param via `router.replace()`, preserves all other search params
- No redirect to canonical page on refresh

---

## Responsive Notes

- Save Search: `>=1180px` in top bar, `<1180px` floating pill
- Grid cards: `md:2-col`, `xl:3-col`, `2xl:4-col`
- Map layout: `lg:60/40 split`, `xl:50/50`
- List view: desktop table with responsive column hiding, mobile card layout `<md`
- Mobile filter sheet: full-screen overlay with close/clear/apply
- Overlay close button: sticky top-0 z-30, visible at all scroll positions

---

## Blockers

None.
