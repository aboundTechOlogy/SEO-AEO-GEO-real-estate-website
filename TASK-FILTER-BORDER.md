# TASK-FILTER-BORDER.md

Add a visible top border to the sticky filter bar so it has a clean separation from the dark header.

---

## Change 1 — search/page.tsx (line ~222)

**File:** `src/app/search/page.tsx`

Find:
```
<div ref={filterBarRef} className="sticky top-[60px] lg:top-[80px] min-[1440px]:top-[90px] z-30 bg-white">
```

Replace with:
```
<div ref={filterBarRef} className="sticky top-[60px] lg:top-[80px] min-[1440px]:top-[90px] z-30 bg-white border-t border-gray-200 shadow-sm">
```

Two additions:
- `border-t border-gray-200` — 1px light gray line at the top of the filter bar. Creates a crisp edge where the dark header ends and the white bar begins.
- `shadow-sm` — subtle drop shadow below the filter bar (matches Chad's `box-shadow: 0 2px 5px rgba(0,0,0,0.1)` on his fixedHeader state).

---

## After changes

```
npm run build
git add -A
git commit -m "fix: add top border + shadow to sticky filter bar for header separation"
```
