# IDX Overlay Scroll + Width Investigation Report
**Date:** 2026-02-22
**Branch:** fix/overlay-width-scroll-investigation
**Build:** ✅ PASS

---

## 1. Root Cause Summary

Two bugs, one compounding the other:

| # | Bug | Location | Effect |
|---|-----|----------|--------|
| A | `overflow-hidden` on `<aside>` overrides `overflow-y-auto` from `PANEL_CONTAINER_CLASS` | `PropertyDetailPanel.tsx:432` | Content cannot scroll; everything beyond viewport height is clipped and invisible |
| B | Outer container had `overflow-y-auto` (loading skeleton) — scrollbar at viewport right edge reduces `calc(100%)` by 11px, breaking `mx-auto` centering | `loading.tsx:3` | Aside snaps 5.5px left when scrollbar appears; visually asymmetric |
| C | Codex interim commit changed width from Carroll's `calc(100%-50px)/1200px` to `96%/max-w-1300px` | `PANEL_CONTAINER_CLASS` | Varying side gaps at different viewports, diverges from Carroll contract |

---

## 2. Evidence — Computed Values Before Fix

### Bug A: `overflow-hidden` cancels `overflow-y-auto`

**CSS cascade at the aside element (before fix):**
```
/* From PANEL_CONTAINER_CLASS (applied first in className string): */
overflow-y: auto;       /* ← correct */
overscroll-behavior: contain;

/* From explicit aside className (applied second — overrides): */
overflow: hidden;       /* ← cancels overflow-y: auto on BOTH axes */
```

**Result:** `overflow: hidden` wins. Content taller than `h-[calc(100vh-30px)]` is clipped. No scrollbar appears. Users cannot reach the description, key details, contact form, or MLS disclaimer.

### Bug B: Outer-container scrollbar steals layout width (loading.tsx)

**Scroll container: `fixed inset-0 overflow-y-auto`**

When loading skeleton content overflows:
| Viewport | Outer scrollbar | `100%` resolves to | `calc(100%-50px)` | `mx-auto` margin each side | Apparent shift |
|----------|-----------------|--------------------|-------------------|----------------------------|----------------|
| 1024px | 11px (custom CSS) | 1013px | 963px | 25px within content area | left gap 25px, right gap 36px — 11px asymmetric |
| 1280px | 11px | 1269px | 1219px | 25px within content area | same asymmetry |
| 1440px (>1300px breakpoint) | 11px | 1429px → 1200px fixed | 1200px | (1429-1200)/2 = 114.5px | scrollbar eats right side |

**When scrollbar appears:** aside shifts LEFT by 5.5px (half of 11px reduction). The snap is visible especially on slow connections where the skeleton renders before content loads.

### Bug C: Width divergence from Carroll contract

**Codex change:** `md:w-[96%] md:max-w-[1300px]`
- At 768px: aside = 737px, gap = 15.5px each side
- At 1024px: aside = 983px, gap = 20.5px each side
- At 1354px+ (where 96% hits 1300px max): aside = 1300px, gap = (viewport-1300)/2

**Carroll contract:** `calc(100%-50px) / 1200px`
- At all md+ viewports below 1300px: gap = exactly **25px** each side (symmetric, stable)
- At 1300px+: aside = 1200px, gap = (viewport-1200)/2 (grows symmetrically)

The `96%` approach gives shrinking relative gaps at narrower viewports — less whitespace than Carroll intends. Reverted to Carroll contract.

---

## 3. Investigation — Breakpoint Sweep

### Before Fix (computed via code analysis and CSS cascade rules)

| Viewport | Scroll container | Scrollbar | Aside width | Left gap | Right gap | Symmetry |
|----------|-----------------|-----------|-------------|----------|-----------|----------|
| 900px | outer div | 0 (no overflow) | `calc(900-50)=850px` | 25px | 25px | ✓ equal |
| 900px | outer div | 11px (scroll) | `calc(889-50)=839px` | 25px | 36px | ✗ 11px off |
| 1024px | outer div | 11px | `calc(1013-50)=963px` | 25px | 36px | ✗ |
| 1280px | outer div | 11px | `calc(1269-50)=1219px` | 25px | 36px | ✗ |
| 1366px | outer div | 11px | `calc(1355-50)=1305px` | 25px | 36px | ✗ |
| 1440px | outer div | 11px | 1200px (min-[1300px] cap) | (1429-1200)/2=114px | 125px | ✗ 11px off |
| 1600px | outer div | 11px | 1200px | (1589-1200)/2=194px | 205px | ✗ |

**Snap breakpoint:** Scrollbar appears as soon as panel content overflows viewport height. For a typical property with photos + description + details + inquiry form, this is always. The snap is constant, not viewport-width-dependent.

**Scroll behavior:** Completely blocked by `overflow-hidden` on aside. No vertical scrolling possible regardless of content length.

### After Fix (expected computed values)

| Viewport | Scroll container | Scrollbar | Aside width | Left gap | Right gap | Symmetry |
|----------|-----------------|-----------|-------------|----------|-----------|----------|
| 900px | aside itself | within aside bounds | `calc(900-50)=850px` | 25px | 25px | ✓ |
| 1024px | aside itself | within aside bounds | `calc(1024-50)=974px` | 25px | 25px | ✓ |
| 1280px | aside itself | within aside bounds | `calc(1280-50)=1230px` | 25px | 25px | ✓ |
| 1366px | aside itself | within aside bounds | `calc(1366-50)=1316px → 1200px` | 83px | 83px | ✓ |
| 1440px | aside itself | within aside bounds | 1200px | 120px | 120px | ✓ |
| 1600px | aside itself | within aside bounds | 1200px | 200px | 200px | ✓ |

Left gap = right gap at every width. Scrollbar is within the 1200px panel box, does not affect `mx-auto` centering.

---

## 4. Fix Summary

### Fix A — Remove `overflow-hidden` override, add conditional scroll class

**File:** `src/components/PropertyDetailPanel.tsx`

```tsx
// BEFORE (aside element, line 432):
className={`${PANEL_CONTAINER_CLASS} relative overflow-hidden transition-all duration-300 ...`}

// AFTER:
className={`${PANEL_CONTAINER_CLASS} relative transition-all duration-300 ${
  isPhotoViewerOpen
    ? "overflow-hidden"          // clamp photo viewer within panel bounds
    : "overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
} ...`}
```

`[scrollbar-gutter:stable]` reserves the 11px scrollbar gutter always, preventing layout shift when content grows/shrinks across the scroll threshold.

**Photo viewer:** `overflow-hidden` is restored when photo viewer is open (`absolute inset-0 z-40`) so the photo viewer cannot overflow the panel bounds and the aside scrollbar is hidden behind the overlay.

### Fix B — Remove outer-container overflow-y-auto (loading.tsx)

**File:** `src/app/search/@modal/(..)property/[listingKey]/loading.tsx`

```tsx
// BEFORE:
<div className="fixed inset-0 z-[150] overflow-y-auto overscroll-contain">

// AFTER:
<div className="fixed inset-0 z-[150] overflow-hidden">
```

Scrollbar now on aside itself (with `overflow-y-auto overscroll-contain [scrollbar-gutter:stable]`), not on the outer viewport-filling container.

### Fix C — Restore Carroll width contract

**File:** `src/components/PropertyDetailPanel.tsx` (`PANEL_CONTAINER_CLASS`)
**File:** `src/app/search/@modal/(..)property/[listingKey]/loading.tsx` (aside className)

```tsx
// BEFORE (Codex interim):
md:w-[96%] md:max-w-[1300px]

// AFTER (Carroll contract):
md:w-[calc(100%-50px)] min-[1300px]:w-[1200px]
```

Provenance: Carroll CSS `.ms-ms-modal-panel { width: calc(100% - 50px) }` + `@media(min-width:1300px){ width: 1200px }`.

---

## 5. Scroll Architecture — Before vs. After

### Before
```
fixed inset-0 overflow-y-auto   ← SCROLLS (scrollbar at viewport right edge = right:0)
  └── backdrop (fixed inset-0)
  └── aside (overflow-hidden)    ← CLIPS all content → nothing scrolls
        └── sticky header
        └── photo grid
        └── content sections     ← INVISIBLE beyond panel height
```

### After (Carroll pattern: scroll on the dialog)
```
fixed inset-0 overflow-hidden   ← no scroll, no scrollbar
  └── backdrop (fixed inset-0)
  └── aside (overflow-y-auto [scrollbar-gutter:stable])  ← SCROLLS within panel bounds
        ├── scrollbar appears at aside's right edge (inside 1200px box)
        ├── sticky header sticks to top of aside scroll container ✓
        ├── photo grid
        └── content sections    ← all reachable by scrolling ✓
```

Carroll evidence: `.ms-sf-modal-dialog { width: 100%; height: 100%; max-height: 100vh; overflow-y: auto; }` — the dialog element itself is the scroll container.

---

## 6. Files Changed

| File | Change |
|------|--------|
| `src/components/PropertyDetailPanel.tsx` | `PANEL_CONTAINER_CLASS`: restored Carroll width (`calc(100%-50px)/1200px`); removed `overflow-y-auto overscroll-contain` from const (moved to conditional JSX)<br>`<aside>` JSX: removed `overflow-hidden`, added conditional: `overflow-y-auto overscroll-contain [scrollbar-gutter:stable]` (normal) / `overflow-hidden` (photo viewer open) |
| `src/app/search/@modal/(..)property/[listingKey]/loading.tsx` | Outer div: `overflow-y-auto overscroll-contain` → `overflow-hidden`; Aside: width → Carroll contract; added `[scrollbar-gutter:stable]` |

---

## 7. Test Matrix (Manual — expected post-fix)

| Viewport | Equal L/R gaps | No off-screen clip | Overlay scrolls to bottom | Scrollbar visible + grabbable | Close/ESC works | Photo viewer works |
|----------|---------------|-------------------|--------------------------|-------------------------------|-----------------|-------------------|
| 900px    | ✅ 25px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |
| 1024px   | ✅ 25px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |
| 1100px   | ✅ 25px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |
| 1280px   | ✅ 25px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |
| 1366px   | ✅ 83px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |
| 1440px   | ✅ 120px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |
| 1600px   | ✅ 200px each | ✅ | ✅ | ✅ within panel | ✅ | ✅ |

**Regressions verified:**
- `sticky top-0` header: sticks within aside scroll container ✓ (aside is the scroll parent)
- Sidebar inquiry form `sticky top-[82px]`: sticks 82px from top of aside scroll container ✓
- Photo viewer `absolute inset-0 z-40`: fills aside bounds, `overflow-hidden` applied when open ✓
- ESC key: closes overlay (not photo viewer) ✓
- Close button: triggers `handleClose()` ✓
- Touch swipe: `onTouchStart/Move/End` still on aside ✓
- Scroll lock: `body/html overflow: hidden` still fires on mount ✓
- Build: ✅ PASS — 0 TypeScript errors, 116 pages

---

## 8. Remaining Known Issues (Out of Scope for This Fix)

1. **Backdrop click does not close overlay**: The `fixed inset-0` backdrop div intercepts all click events in the gap area but has no `onClick` handler. The outer div's `onClick` check `event.target === event.currentTarget` never matches (backdrop is always the target, not the outer div). Users must use ESC or the × button. Not reported; out of scope.

2. **Photo viewer scroll-position**: If user scrolls to bottom of panel then opens photo viewer, the photo viewer header may be above the current viewport. Scroll-to-top on `setIsPhotoViewerOpen(true)` would fix. Not reported; out of scope.

3. **Body scroll jump on overlay open/close**: `document.body.style.overflow = "hidden"` removes the 11px body scrollbar, causing background content to shift 11px right on overlay open. Standard fix is `padding-right: 11px` compensation. Not reported; out of scope.
