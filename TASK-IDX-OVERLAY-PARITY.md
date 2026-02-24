# TASK: IDX Overlay Detail Page — Chad Parity (Desktop + Mobile)

## Goal
Make our `/search` overlay property detail modal virtually identical to Chad’s IDX modal in layout, typography, spacing, icon placement, and behavior.

This task is for the **overlay modal only** (search flow), not the standalone `/property/[listingKey]` SEO page.

## Source-of-Truth Reference
Use Chad’s shipped frontend contract (IDXBoost) as behavioral/layout reference.
- Site: `https://thechadcarrollgroup.com/search/`
- Relevant shipped assets discovered:
  - `.../wp-content/plugins/idxboost/build/.../css/main.min.css`
  - `.../wp-content/plugins/idxboost/build/.../react/property-modal/...`

## Files to Work In
- `src/components/PropertyDetailPanel.tsx`
- `src/app/search/@modal/(..)property/[listingKey]/loading.tsx`
- Optional if required by flow wiring: `src/app/search/layout.tsx`, `src/components/SearchPropertyCard.tsx`

## Non-Negotiable Requirements
1. **Geometry / Positioning (Desktop)**
   - Overlay covers full viewport height from top.
   - Symmetric left/right gap (not left-only, not flush-right).
   - Stable loading and loaded geometry must match.

2. **Close Behavior**
   - Clear visible close control on desktop and mobile.
   - Click-outside closes.
   - Escape closes.

3. **Scroll Behavior**
   - Modal content scrolls internally.
   - Background page behind modal does NOT scroll (no scroll bleed).

4. **Typography + Spacing Parity**
   - Match Chad’s visual rhythm for:
     - title block
     - tabs/actions row
     - price/stats strip
     - description block
     - right-side contact card (desktop)

5. **Controls / Icons / Links Functionality**
   - Save: works (toggle persisted locally).
   - Share: works (navigator share or clipboard fallback).
   - Map View: opens map using listing coordinates.
   - Street View: opens Google Street View with listing coordinates.
   - Expand/fullscreen photo behavior matches desktop contract.
   - Mobile should not incorrectly inherit desktop pop-out behavior.

## Allowed Differences
Only these can differ from Chad:
1. Andrew branding/contact info and request/showing card content.
2. Disclaimer/legal copy at bottom.
3. Underlying listing data values.

No other intentional UX/UI differences.

## Hard Constraints
- Do NOT redesign.
- Do NOT “improve” layout beyond parity.
- Do NOT break standalone `/property/[listingKey]` page.
- Keep search overlay route behavior intact.

## Acceptance Checklist (must all pass)
- [ ] Desktop overlay has equal left/right gap.
- [ ] Desktop overlay starts at top and fully covers header area.
- [ ] Close button always visible and works.
- [ ] ESC and backdrop close work.
- [ ] Background page never scrolls while modal open.
- [ ] Internal modal scroll works smoothly.
- [ ] Save/share/map/street-view controls are functional.
- [ ] Loading skeleton matches final modal geometry.
- [ ] Mobile behavior mirrors Chad’s mobile flow (no accidental desktop-only interactions).
- [ ] `npm run build` passes clean.

## Deliverables
1. Code changes.
2. Short CHANGELOG (what was changed and why).
3. Explicit PASS/FAIL against each acceptance checklist item.
