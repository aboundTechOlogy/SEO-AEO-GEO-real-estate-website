# IDX Overlay Close/X Persistence + Bottom Parity — v1

**Branch:** `fix/overlay-close-persistence-and-bottom-parity`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/components/PropertyDetailPanel.tsx`

---

## Problem

1. **X button disappeared on scroll** — The desktop close button was `absolute top-3 right-3` inside the scrollable `<aside>`, so it scrolled out of view once the user scrolled past the photo section.
2. **No map block** — Overlay had no embedded map despite coordinates being available in the property data.
3. **No Similar Properties section** — No way to discover related listings from the overlay.
4. **Legal disclaimer trapped in left column** — The courtesy/MLS disclaimer was inside the 2-col grid's left column, not spanning full width.
5. **Basic Information section lacked icons** — Rows were text-only with no visual differentiation from other detail sections.

---

## Fixes

### 1. X Button → Sticky Header (Desktop)

**Before:** `absolute top-3 right-3 z-40` inside scrollable `<aside>` — scrolled away.

**After:** Moved into the sticky header's desktop action buttons div (`hidden lg:flex`):

```
[Address + City/State]  →  ml-auto  →  [☆ Save] [↗ Share] [↱ Open] [✕ Close]
```

- Uses existing `CircleIconButton` component
- Sticky header has `sticky top-0 z-30` — always visible
- Mobile X button unchanged (was already in sticky header at `lg:hidden`)

### 2. Map Block (Full-Width, Conditional)

Added below the 2-col grid, only when `Latitude`/`Longitude` exist:

- Google Static Maps API image (800×400, scale 2, zoom 15)
- Red marker at property coordinates
- `aspect-[2/1]` container with `rounded-lg overflow-hidden`
- Hover overlay: "Open in Google Maps" pill
- Links to `google.com/maps?q={lat},{lng}` in new tab

### 3. Similar Properties Section

Full-width section below map:

- Heading: "Similar Properties"
- Subtext: "Explore more properties in {City}."
- CTA: "View Similar Listings" → `/search?q={city}` (outline pill button)

### 4. Legal Disclaimer → Full-Width Bottom

Moved from inside the left column of the 2-col grid to a full-width section at the very bottom:

- `bg-[#f5f5f5]` background
- Dynamic: "Courtesy of {agent}, {office} ({phone})" when data exists
- Static MLS disclaimer always shown
- `text-[11px] text-gray-500`

### 5. Basic Information Icons

Added SVG icons to the Basic Information section only (22 possible labels mapped):

| Label Group | Icon |
|---|---|
| Property Type | House |
| Sub Type | Tag |
| Status | Check circle |
| Year Built, List Date | Calendar |
| Living Area, Lot Size, Lot Acres | Expand/resize arrows |
| Stories | Layers |
| Subdivision | Map pin |
| Building | Office building |
| County | Map |
| Architectural Style | Lightbulb |
| Construction | Wrench |
| Garage/Covered Spaces, Attached Garage | Car/truck |
| Days on Market | Clock |
| Original List Price, Close Price | Dollar circle |
| Close Date | Check circle |
| Association Fee | Banknote |
| Direction Faces | Star/compass |

Later sections (Exterior, Interior, Property Features, Tax) have **no icons** — text-only rows.

---

## Validation Matrix

| Width | X Button Sticky | Map Block | Similar Props | Legal Full-Width | Icons (Basic Info) | Scroll Preserved |
|-------|----------------|-----------|---------------|-----------------|-------------------|-----------------|
| 1600  | PASS (desktop) | PASS      | PASS          | PASS            | PASS              | PASS            |
| 1366  | PASS (desktop) | PASS      | PASS          | PASS            | PASS              | PASS            |
| 1280  | PASS (desktop) | PASS      | PASS          | PASS            | PASS              | PASS            |
| 1024  | PASS (desktop) | PASS      | PASS          | PASS            | PASS              | PASS            |
| 820   | PASS (mobile)  | PASS      | PASS          | PASS            | PASS              | PASS            |
| 430   | PASS (mobile)  | PASS      | PASS          | PASS            | PASS              | PASS            |

---

## Layout After (Desktop, ≥1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Address + City/State]              [☆] [↗] [↱] [✕]  ← STICKY  │
├──────────────────────────────────────────────────────────────────┤
│ [PHOTOS] [MAP VIEW] [VIRTUAL TOUR]                    [⤢]       │
│ ┌─────────────────┬─────────────────┬─────────────────┐         │
│ │  Photo 1        │  Photo 2        │  Photo 3        │         │
│ └─────────────────┴─────────────────┴─────────────────┘         │
├──────────────────────────────────────────────────────────────────┤
│ [☆ Save] [↗ Share] [☎ Call] [✉ Email]  ← mobile only            │
├─────────────────────────────────────┬────────────────────────────┤
│ $1,250,000          Est. $6,450/mo  │                            │
│ 3 Beds  2 Baths  1 Half  1,850  $675│   Andrew Whalen           │
│─────────────────────────────────────│   LoKation Real Estate     │
│ Description                         │   (305) 455-9744           │
│ Beautiful waterfront property...    │                            │
│─────────────────────────────────────│   [Property Inquiry Form]  │
│ Basic Information  (with icons)     │                            │
│ ┌──────────────┬──────────────┐     │                            │
│ │ 🏠 Prop Type │ 📋 Sub Type │     │                            │
│ │ ✓ Status     │ 📅 Yr Built │     │                            │
│ │ ↔ Living     │ ↔ Lot Size  │     │                            │
│ │ ...          │ ...         │     │                            │
│ └──────────────┴──────────────┘     │                            │
│─────────────────────────────────────│                            │
│ Exterior Features  (no icons)       │                            │
│ Interior Features  (no icons)       │                            │
│ Property Features  (no icons)       │                            │
│ Tax Information    (no icons)       │                            │
│ [View Full Details]                 │                            │
├─────────────────────────────────────┴────────────────────────────┤
│ Location                                                         │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │  [Google Static Map Image]                                   │ │
│ │              hover: "Open in Google Maps"                    │ │
│ └──────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│ Similar Properties                                               │
│ Explore more properties in Miami Beach.                          │
│ [View Similar Listings]                                          │
├──────────────────────────────────────────────────────────────────┤
│ Courtesy of John Doe, ABC Realty (305-555-1234)                  │
│ The multiple listing information is provided by...               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Files Changed

| File | Lines | Change |
|---|---|---|
| `src/components/PropertyDetailPanel.tsx` | +85/−8 | Moved X to sticky header; added `BASIC_INFO_ICONS` map + `iconMap` prop to `DetailSection`/`DetailRow`; added Location map block; added Similar Properties section; moved legal disclaimer to full-width bottom |

---

## Build Result

```
✓ Compiled successfully in 8.6s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
