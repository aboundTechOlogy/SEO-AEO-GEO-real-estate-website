# TASK — IDX Overlay Property Detail Page Parity (EXTREME DETAIL)

## Owner
Cursor Codex / Claude Code implementation task

## Priority
P0 — blocking design/UX parity work

## Non-Negotiable Instruction
Do **not** do approximation work. Do **contract replication** from Chad’s shipped frontend behavior.

---

## 1) Scope and Architecture

### In scope
- Search-flow detail overlay (intercept route):
  - `src/app/search/@modal/(..)property/[listingKey]/page.tsx`
  - `src/components/PropertyDetailPanel.tsx`
  - `src/app/search/@modal/(..)property/[listingKey]/loading.tsx`

### Out of scope (do not change for this task)
- Standalone canonical detail page (`/property/[listingKey]`) except if overlay “external-link” icon routes into it.
- Non-IDX sections of site.

### Critical architecture clarification
There are **two distinct states**:
1. **Overlay state** (from /search list/map)
2. **Canonical URL page state** (opened by the external-link icon in overlay header)

Do not mix these states.

---

## 2) Source-of-Truth Contract (Chad)

Use Chad’s real shipped code + runtime behavior as source of truth:
- URL: `https://thechadcarrollgroup.com/search/`
- Assets already identified under IDXBoost:
  - `.../wp-content/plugins/idxboost/build/.../css/main.min.css`
  - `.../wp-content/plugins/idxboost/build/.../react/property-modal/...`

This task must use:
- DOM structure mapping
- CSS token mapping (font sizes, spacing, borders, radii, heights)
- interaction mapping (click paths, scroll lock, close behavior)

---

## 3) Required Investigation (before coding)

## A. DOM map capture
Capture exact DOM sections for overlay at desktop and mobile:
- header/address row
- header action icons (save/share/external-link/close)
- photo tabs row
- gallery area
- bottom action row (mobile)
- stats strip
- contact/request form block
- description block
- details block
- disclaimer block

## B. Computed style extraction
For each section above, extract computed values at both breakpoints:
- font-size, line-height, font-weight, letter-spacing
- paddings/margins/gaps
- border width/color/radius
- icon container size (w/h), background, border
- row heights
- gallery height/min-height/max-height
- overlay container left/right/top/bottom behavior

## C. Behavior map extraction
Document exact behavior for every clickable control.

---

## 4) Behavior Contract Matrix (must match)

### Header controls (desktop)
- Save icon: toggles saved state
- Share icon: triggers share behavior
- External-link icon: opens canonical `/property/[listingKey]` page
- Close icon: closes overlay

### Gallery controls
- Clicking any visible gallery image: opens full-photo viewer
- Black expand icon on gallery (top-right): opens full-photo viewer
- Left/right arrows: photo navigation
- Counter badge: updates with active index
- Street View button: opens street view when coords available

### Tabs
- Photos tab: active state
- Map View tab/icon: opens map behavior
- Virtual/Video Tour: only enabled if actual URL exists; otherwise visibly disabled state

### Close behavior
- X button closes
- ESC closes
- backdrop click closes

### Scroll behavior
- overlay content scrolls internally
- background page must not scroll while overlay is open
- no scroll bleed on desktop/mobile

### Mobile behavior
- no accidental desktop-only fullscreen behavior leaks
- action row visible and wired (save/share/call/email)

---

## 5) Visual Parity Requirements (must match)

Apply exact parity for:
- top address row sizing/spacing
- icon button diameters and spacing
- tabs style and text treatment
- gallery vertical height
- stats strip typography (price + metrics)
- metric labels formatting (BED/BATH/HALF BATH/SIZE SQ.FT./$/SQFT)
- contact card dimensions/alignment
- description + details block spacing

Allowed differences only:
1. Andrew branding/contact identity
2. legal/disclaimer text content
3. listing data values

Everything else must visually/functionally match.

---

## 6) Implementation Constraints

- Keep route architecture intact (intercepting route).
- Keep overlay and canonical page separated.
- No random UI redesign.
- No broad refactors outside scope.
- Loading skeleton must mirror final geometry.

---

## 7) Acceptance Checklist (strict)

Geometry & layout
- [ ] Desktop overlay has symmetric left/right gaps
- [ ] Overlay top alignment matches contract
- [ ] Loading and loaded geometry match

Controls
- [ ] Header save/share/external-link/close each do correct action
- [ ] Gallery black expand icon opens fullscreen viewer
- [ ] Clicking photo opens fullscreen viewer
- [ ] Map/Street actions work with coords
- [ ] Mobile action row wired

Behavior
- [ ] ESC/backdrop/close all close reliably
- [ ] No background scroll bleed while modal is open
- [ ] Internal scrolling smooth

Typography/spacing
- [ ] Key rows match measured desktop tokens
- [ ] Key rows match measured mobile tokens

State correctness
- [ ] Overlay state and canonical page state not conflated

Build quality
- [ ] `npm run build` passes
- [ ] no TypeScript errors

---

## 8) Required Deliverables from Cursor/Codex

1. **Patch set** (files changed)
2. **PARITY REPORT** including:
   - table of every control and action result (PASS/FAIL)
   - table of key style tokens (Chad vs ours)
   - list of known deltas (if any)
3. **Evidence snapshots** (desktop + mobile)
4. final build output summary

---

## 9) Stop Conditions

Do not mark done if any of these remain:
- any icon action uncertain
- overlay still scroll-bleeds
- desktop gap asymmetry persists
- external-link and gallery-expand behaviors are mixed up

If uncertain on any control, investigate Chad code/runtime first, then implement.
