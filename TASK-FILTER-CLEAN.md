# TASK-FILTER-CLEAN.md

Two changes. Remove the visual junk we added, increase the padding.

---

## Change 1 — search/page.tsx (sticky filter bar container)

**File:** `src/app/search/page.tsx`

Find:
```
<div ref={filterBarRef} className="sticky top-[60px] lg:top-[80px] min-[1440px]:top-[90px] z-30 bg-white border-t border-gray-200 shadow-sm">
```

Replace with:
```
<div ref={filterBarRef} className="sticky top-[60px] lg:top-[80px] min-[1440px]:top-[90px] z-30 bg-white">
```

Removes `border-t border-gray-200` (hard gray line at header/filter junction — visually collapses the breathing room) and `shadow-sm` (the drop shadow below pills that Chad does NOT have).

---

## Change 2 — SearchFilters.tsx (DesktopSearchBar inner div, line ~907)

**File:** `src/components/SearchFilters.tsx`

Find:
```
<div className="hidden md:flex items-center gap-3 px-[15px] py-[15px]">
```

Replace with:
```
<div className="hidden md:flex items-center gap-3 px-[15px] py-[20px]">
```

20px above and below the pills. Chad's `padding: 10px 15px` + his fixed-header shadow gives a perceived gap of ~20px. We match it with straight padding since we have no shadow.

---

## After changes

```
npm run build
git add -A
git commit -m "fix: remove border/shadow from filter bar, increase padding to 20px to match Chad's spacing"
```
