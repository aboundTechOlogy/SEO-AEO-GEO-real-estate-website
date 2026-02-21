# TASK: Match Header Height to Chad's Verified Spec

## Verified Values (from carroll-header.css)
- Desktop 1024px+: `height: 80px` (explicit in CSS)
- Desktop 1440px+: `height: 90px` (explicit in CSS)
- Mobile: no explicit height — content-driven, minimum ~50px (hamburger button is 50px tall)
- Mobile logo width: `180px` with `height: auto`

## Current State (from Header.tsx)
- Desktop nav: `py-5 lg:py-6` + logo `h-8` = 80px at 1024px+ ✓ already correct
- Desktop at 1440px+: no xl breakpoint → stays at 80px ✗ should be 90px
- Mobile nav: `py-3` + logo `h-5` = 44px ✗ too small

## What Needs to Change

### File: `src/components/Header.tsx`

#### 1. Desktop nav — add 1440px breakpoint for 90px height

Find:
```tsx
<nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center w-full px-4 lg:px-6 py-5 lg:py-6">
```

Replace with:
```tsx
<nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center w-full px-4 lg:px-6 py-6 min-[1440px]:py-[29px]">
```
Note: `py-6` = 24px × 2 + 32px logo = 80px. `min-[1440px]:py-[29px]` = 29px × 2 + 32px logo = 90px. Chad's CSS explicitly uses 1440px for this breakpoint.

#### 2. Desktop logo — stays `h-8` (32px) ✓ no change needed

#### 3. Mobile nav — increase height to ~60px

Find:
```tsx
<nav className="lg:hidden w-full px-4 py-3 flex items-center">
```

Replace with:
```tsx
<nav className="lg:hidden w-full px-4 py-[14px] flex items-center">
```
Note: `py-[14px]` = 14px × 2 + content. With `h-8` logo below, total ≈ 60px.

#### 4. Mobile logo — increase from `h-5` to `h-8`

Find:
```tsx
<img
  src="/logo-lockup.png"
  alt="Andrew Whalen | LoKation"
  className="h-5 w-auto"
/>
```
(This is the one inside `<nav className="lg:hidden ...">`)

Replace with:
```tsx
<img
  src="/logo-lockup.png"
  alt="Andrew Whalen | LoKation"
  className="h-8 w-auto"
/>
```

#### 5. Remove divider line below filter pills

In `src/app/search/page.tsx` line ~222, find the sticky filter bar container:
```tsx
<div ref={filterBarRef} className="sticky top-[44px] lg:top-[80px] z-30 bg-white border-b border-gray-200">
```

Remove `border-b border-gray-200` — Chad's filter bar has no divider line below the pills.

#### 6. Fix search page sticky filter offset

The filter bar sticks below the header. With the header now 80px desktop / 60px mobile, the `top` offset must match.

In `src/app/search/page.tsx`, find the sticky filter bar container. It likely has `top-[64px]` or similar. Update to:
```
top-[60px] lg:top-[80px] min-[1440px]:top-[90px]
```

#### 7. Fix address search input to match filter pill style

In `src/components/SearchFilters.tsx`, inside `DesktopSearchBar`, find the search input:
```tsx
className="w-full bg-transparent border border-gray-300 rounded-full px-4 py-2.5 text-sm ..."
```
Replace with:
```tsx
className="w-full bg-white border border-gray-300 rounded-[6px] px-[15px] h-[50px] text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
```

In `MobileSearchBar`, same input but mobile height:
```tsx
className="w-full bg-white border border-gray-300 rounded-[6px] px-[15px] h-[35px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
```

#### 8. Match Save Search button to filter pill style

In `DesktopSearchBar`, find:
```tsx
<button className="shrink-0 bg-black text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors">
  Save Search
</button>
```
Replace with:
```tsx
<button className="shrink-0 relative flex items-center gap-2 bg-white border border-gray-300 rounded-[10px] px-[15px] h-[50px] text-sm font-semibold text-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap">
  Save Search
</button>
```

---

## Constraints
- Do NOT touch the desktop logo (`h-8` inside the `hidden lg:grid` nav) — it's correct
- Do NOT modify `src/data/mockListings.ts`
- Run `npm run build` — zero errors before committing
- Commit message: `fix: match header height to Chad's verified spec (80px desktop, 90px at 1440px, 60px mobile)`
