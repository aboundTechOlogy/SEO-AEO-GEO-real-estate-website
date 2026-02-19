# Phase 1B — Visual Polish & Nav Redesign

Read CLAUDE.md for project context and design rules.

This task fixes visual gaps between our site and the design reference (thechadcarrollgroup.com). Focus on the nav layout, section design, and visual polish.

---

## 1. NAV BAR — COMPLETE REDESIGN (highest priority)

The current nav has logo left, links center, LoKation right. This needs to match the Carroll Group's nav pattern:

**Carroll's nav pattern:**
```
LEFT NAV LINKS          CENTER LOGO LOCKUP                    RIGHT NAV + ACTIONS
OUR LISTINGS | LUXURY   [G icon] The Carroll Group | COMPASS  ABOUT US | PRESS | [CONTACT US] | 👤 | ☰
CONDOS | NEIGHBORHOODS
```

**Our nav should be:**
```
LEFT NAV LINKS                              CENTER LOGO LOCKUP                        RIGHT NAV + ACTIONS
LUXURY CONDOS ▾ | NEIGHBORHOODS ▾ |        [AW] ANDREW WHALEN | LoKation            ABOUT | INSIGHTS | [CONTACT] | 👤 | ☰
NEW CONSTRUCTION
```

### Specific requirements:

**Left section** — Primary nav links, left-aligned:
- `LUXURY CONDOS` (with dropdown chevron ▾)
- `NEIGHBORHOODS` (with dropdown chevron ▾)
- `NEW CONSTRUCTION`
- All: text-xs or text-sm, uppercase, tracking-wider, Inter font, text-neutral-400, hover:text-white
- Dropdown behavior same as current (hover to open, 200ms delay to close)

**Center section** — Logo lockup, centered:
- "AW" text monogram (text-sm, font-light, tracking-[0.35em], uppercase, Inter)
- Pipe separator (thin, `w-px h-5 bg-white/20`)
- "ANDREW WHALEN" (text-sm, font-light, tracking-[0.25em], uppercase, Inter)
- Another pipe separator
- LoKation logo image (`/lokation-logo-white.png`, h-5, opacity-60)
- The entire center lockup should be a link to `/`

**Right section** — Secondary nav + actions, right-aligned:
- `ABOUT` link (same text style as left nav)
- `INSIGHTS` link (same text style, links to `/blog/`) — this is our equivalent of Carroll's "PRESS" slot. When Andrew gets press coverage, this becomes PRESS or we add a separate PRESS link.
- `CONTACT` link — **outlined button style**: `border border-white/20 px-4 py-1.5 text-xs uppercase tracking-wider hover:border-white/50 hover:text-white transition-all`
- User/login icon (person silhouette SVG) — links to `/login/` for now. This mirrors Carroll's user account icon for saved searches, favorites, and email alerts. Create a simple placeholder page at `src/app/login/page.tsx` with heading "Sign In", a note "Account features coming soon — save searches, favorite listings, and get email alerts", and a simple email/password form (non-functional, console.log on submit). Phase 2 will implement real auth.
- On mobile: hamburger icon replaces all nav (keep existing MobileMenu component)

**Overall nav styling:**
- `fixed top-0 w-full z-50`
- `bg-[#0a0a0a]/90 backdrop-blur-md`
- `border-b border-white/5`
- Use CSS flexbox with `justify-between` for the three sections
- Inner padding: `px-6 py-4` (same as current)
- Max width: `max-w-[1400px]` (slightly wider than current 7xl to give room for the three-section layout)
- The left and right nav sections should be roughly equal width to keep the center logo truly centered. Use `flex-1` on both.

**Hide on mobile (below md:):** Left nav links, center logo text (show only AW monogram), ABOUT/INSIGHTS links, user icon. Show only: AW monogram + hamburger.

### Dropdowns (keep existing NavDropdown component, same items):
- LUXURY CONDOS: All Buildings → /luxury-condos/, then by neighborhood
- NEIGHBORHOODS: All Neighborhoods → /neighborhoods/, then 7 guide links

---

## 2. HERO SECTION — Add Background Image

The current hero is dark gradient on dark background. It needs visual impact.

**Changes to src/app/page.tsx hero:**
- Replace the gradient-only background with a dark-overlaid photo background
- Use this placeholder approach: create a CSS class `hero-bg` in globals.css that has a `background-image` url pointing to `/hero-miami.jpg`
- For now, since we don't have the image yet, keep the gradient but make it slightly lighter so the hero feels distinct from the body. Use: `from-neutral-800/30 via-neutral-900/60 to-neutral-950`
- Add a comment: `/* Replace hero-placeholder with actual Miami aerial/skyline photo */`
- The hero text and goal selection buttons stay the same

---

## 3. NEIGHBORHOOD CARDS — Add Image Placeholders & Improve Layout

The homepage neighborhood grid has text-only cards. They need to feel richer.

**Update the neighborhood cards on the homepage (src/app/page.tsx):**
- Make cards taller with an image area at top
- Each card gets a placeholder image area: `h-40 bg-neutral-800/50 rounded-t-sm` with a subtle gradient overlay and the text "Coming Soon" or a simple location pin icon centered
- Below the image area: neighborhood name (Playfair, text-xl), tagline, and "VIEW GUIDE →" link
- Add `HOMES` and `CONDOS` ghost buttons at the bottom of each card (matching the hub page cards)
- Grid should be 2 columns on mobile, 3 on md, same on lg

**Update the neighborhoods hub (src/app/neighborhoods/page.tsx):**
- Same image placeholder treatment on hub cards
- Cards should have equal height (use a consistent aspect ratio for the image area)

---

## 4. DEVELOPMENT CARDS — Better Placeholder Images

The development card placeholders blend into the black background.

**Update development cards (src/app/page.tsx and src/app/new-construction/page.tsx):**
- Change placeholder from dark gray to a slightly lighter treatment: `bg-neutral-800` with a subtle gradient: `bg-gradient-to-br from-neutral-700/30 to-neutral-800`
- Add a small building/crane SVG icon centered (suggests "under construction")
- Change placeholder text from "Rendering Coming Soon" to the development status (e.g., "PRE-CONSTRUCTION" or "UNDER CONSTRUCTION") in small caps

---

## 5. STATS SECTION — Add Visual Depth

The market stats section is flat.

**Update the stats section on homepage:**
- Add a subtle background pattern or gradient to the section: `bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900`
- Make stat numbers larger: `text-5xl` or `text-6xl` (they're the star of this section)
- Add a subtle top border accent: a thin amber line `w-12 h-0.5 bg-amber-600/50 mx-auto mb-4` above each stat card
- Change percentage indicators to include color: positive changes in green-ish (`text-emerald-500/70`), neutral in gray

---

## 6. "HOW I WORK" SECTION — Less Template, More Editorial

The 3-column icon cards look like a SaaS template.

**Redesign:**
- Instead of 3 equal cards, use a single-row layout with a subtle background section
- Add a large decorative number before each item: "01", "02", "03" in `font-playfair text-6xl text-white/5` (very faint, decorative)
- Stack the items vertically on mobile, horizontal with more space on desktop
- Remove the boxy card borders — let the content breathe
- Keep the same 3 items but with slightly longer descriptions (2-3 sentences each)
- Add a subtle watermark "AW" in the background of this section: a very large, very faint `text-[200px] text-white/[0.02]` centered behind the content

---

## 7. ADD SEARCH BAR SECTION (below hero)

Carroll has a prominent property search bar below the hero. We need one too.

**Add a new section between Hero and Neighborhoods:**
- Dark textured background: `bg-neutral-900 border-y border-white/5`
- "PROPERTY SEARCH" label (small, centered, neutral-500)
- A search input: large, centered, full-width (max-w-2xl), with placeholder text "Search by address, neighborhood, or building..."
- The input should be styled: `bg-white/5 border border-white/10 text-white placeholder-neutral-600 px-6 py-4 text-lg` with a search icon inside on the right
- A "SEARCH" button next to it: `bg-amber-600 hover:bg-amber-500 text-white px-8 py-4`
- This is non-functional for now — clicking SEARCH should route to `/search/` or show an alert "Search coming soon"
- On mobile: stack input and button vertically

---

## 8. FOOTER — Add Social Links & Branding

**Add to footer (src/app/layout.tsx):**
- Above the 4-column links, add a footer header: "ANDREW WHALEN" in font-playfair text-2xl, with "South Florida Luxury Real Estate" below in text-sm text-neutral-500
- Add social media icon links after the Company column or in a dedicated row:
  - Instagram (link to #)
  - YouTube (link to #)
  - LinkedIn (link to #)
- Use simple SVG icons, text-neutral-500, hover:text-white
- Add "Sign In" to the Company column (links to /login/)
- Keep everything else the same (4 columns + MLS compliance)

Also update the MobileMenu component (src/components/MobileMenu.tsx):
- Add "Insights" link (to /blog/) and "Sign In" link (to /login/) to the flat nav list
- Keep all existing links

---

## 9. GLOBAL CSS ADDITIONS (src/app/globals.css)

Add these utility styles:

```css
/* Subtle background pattern for sections that need texture */
.bg-texture {
  background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Watermark text utility */
.watermark {
  position: absolute;
  font-size: 200px;
  font-weight: 300;
  color: rgba(255,255,255,0.015);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

/* Frosted glass effect for overlays */
.glass {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## DESIGN PRINCIPLES (reminders)
- Alternate section backgrounds between `bg-[#0a0a0a]` and `bg-neutral-900/50`
- Use `bg-texture` class on 1-2 sections for visual variety
- The amber accent (`#d97706`) is ONLY for primary CTA buttons and subtle accents — never for text or backgrounds
- Keep generous spacing between sections (py-16 to py-24)
- Test responsiveness at mobile (375px), tablet (768px), and desktop (1280px+)

---

## WHEN DONE

Run `npm run build` and fix ALL errors. Commit the changes.
