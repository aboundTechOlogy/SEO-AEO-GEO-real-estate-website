# TASK-SPACER-FIX.md

Root cause of "no space" bug: the spacer div height doesn't match the header height at each breakpoint.
The filter bar starts behind the header, hiding the top portion of its padding.

## Current state:
- Mobile header: `py-[14px]` + `h-8` = **60px**
- Desktop lg+ header: `py-6` + `h-8` = **80px**
- Desktop 1440px+ header: `py-[29px]` + `h-8` = **90px**
- Spacer: `h-[72px] md:h-[80px]` ← WRONG at mobile (72≠60) and 1440px+ (80≠90)

At 1440px+ viewport: header=90px, spacer=80px → filter bar starts 10px INSIDE the header.
20px padding - 10px hidden behind header = only ~10px visible above pills. That's the bug.

---

## Change — search/page.tsx (spacer div, line ~219)

**File:** `src/app/search/page.tsx`

Find:
```
      <div className="h-[72px] md:h-[80px]" />
```

Replace with:
```
      <div className="h-[60px] lg:h-[80px] min-[1440px]:h-[90px]" />
```

Matches the header height exactly at each breakpoint:
- Mobile (<1024px): 60px spacer = 60px header ✓
- Desktop lg (1024–1439px): 80px spacer = 80px header ✓
- Desktop 1440px+: 90px spacer = 90px header ✓

---

## After changes

```
npm run build
git add -A
git commit -m "fix: spacer height now matches header height at all breakpoints — fixes hidden filter bar padding"
```
