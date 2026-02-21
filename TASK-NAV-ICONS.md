# TASK-NAV-ICONS.md

Make the login icon and hamburger larger and thicker to match Chad's verified spec.

## Chad's verified spec (from carroll-header.css):
- Hamburger button container: `width: 44px; height: 50px`
- Hamburger lines: `width: 28px; height: 2px` (2px thick)
- Login icon: `width: 30px; height: 30px`

---

## Change 1 — MegaMenu.tsx (hamburger button, lines ~121–129)

**File:** `src/components/MegaMenu.tsx`

Find:
```
      <button
        onClick={() => setOpen(true)}
        className="text-white hover:text-neutral-300 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
```

Replace with:
```
      <button
        onClick={() => setOpen(true)}
        className="text-white hover:text-neutral-300 transition-colors flex items-center justify-center w-[44px] h-[50px]"
        aria-label="Open menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
```

`w-7 h-7` = 28px (matches Chad's 28px lines). `strokeWidth={2}` = 2px thick. Button container 44×50px.

---

## Change 2 — Header.tsx (login icon — desktop, line ~90)

**File:** `src/components/Header.tsx`

Find (desktop login icon):
```
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
```

Replace with:
```
            <svg className="w-[30px] h-[30px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
```

---

## Change 3 — Header.tsx (login icon — mobile, line ~115)

**File:** `src/components/Header.tsx`

Find (mobile login icon — same SVG, second occurrence):
```
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
```

Replace with:
```
            <svg className="w-[30px] h-[30px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
```

---

## After changes

```
npm run build
git add -A
git commit -m "feat: match login icon (30px) and hamburger (28px/2px thick) to Chad's spec"
```
