# TASK-FILTER-SPACING.md

Fix: visible space between header bottom edge and filter pills.

Two causes:
1. Header has `border-b border-transparent` on inner pages — no visible bottom edge
2. Filter bar wrapper has `py-[10px]` (10px) — Chad's visual is ~15px

---

## Change 1 — Header.tsx (line 41)

**File:** `src/components/Header.tsx`

Find:
```
const border = transparent ? "border-b border-white/10" : "border-b border-transparent";
```

Replace with:
```
const border = transparent ? "border-b border-white/10" : "border-b border-black/20";
```

Chad's verified: `border-bottom: 1px solid rgba(0,0,0,0.27)` on inner pages. `border-black/20` = `rgba(0,0,0,0.2)` — close enough.

---

## Change 2 — SearchFilters.tsx (line 907, DesktopSearchBar)

**File:** `src/components/SearchFilters.tsx`

Find:
```
<div className="hidden md:flex items-center gap-3 px-[15px] py-[10px]">
```

Replace with:
```
<div className="hidden md:flex items-center gap-3 px-[15px] py-[15px]">
```

15px top/bottom = 15 + 50 (pill) + 15 = 80px filter bar height on desktop. Matches Chad's visual breathing room.

---

## After changes

Run:
```
npm run build
git add -A
git commit -m "fix: header border + filter bar vertical padding to match Chad's spacing"
```
