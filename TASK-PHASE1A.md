# TASK: Phase 1A — Visual Polish (Carroll Match)

> **Goal:** Transform the current site to match the monochromatic cinematic luxury of thechadcarrollgroup.com. No new pages — just fixing what exists.
> **Reference:** Read CLAUDE.md first for brand system and design principles.
> **Build check:** Run `npm run build` after ALL tasks and fix any errors before committing.

---

## Task 1: Kill the Orange Overuse

The current site uses amber/orange way too much. Carroll uses almost zero accent color.

**Changes:**
- Search section "Search" button → change from `bg-amber-600` to `border border-white/30 text-white hover:bg-white/10`
- Stats section: Remove `bg-amber-600/50` divider lines above stat labels. Replace with nothing (let typography breathe).
- "How I Work" section: No amber anywhere
- Footer: No amber anywhere
- Homepage "Get in Touch" CTA button → this ONE can stay amber (it's the primary CTA)
- **Rule of thumb:** Maximum ONE amber element per page. Everything else is white outline/ghost buttons.

**Files:** `src/app/page.tsx`

---

## Task 2: Hero — Bigger, Simpler

Carroll's hero is massive typography with almost nothing else. Ours is cluttered.

**Changes:**
- Increase headline to `text-6xl md:text-8xl lg:text-9xl`
- Change headline text to just: `"Miami Luxury Real Estate"` (shorter, bolder — drop "South Florida")
- **Remove** the subtitle paragraph ("New developments. Neighborhood intelligence...")
- **Remove** the "Start your AI-guided journey" text and the 4 goal buttons entirely (move to Phase 3 AI features)
- **Remove** the bounce arrow at the bottom
- Keep the hero image and gradient overlay
- The hero should be JUST: massive headline + maybe one ghost button "Explore Properties" centered below

**Example output:**
```tsx
<h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white">
  Miami
  <br />
  Luxury Real Estate
</h1>
<div className="mt-12">
  <a href="/neighborhoods/" className="border border-white/30 px-10 py-4 text-sm uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all">
    Explore Neighborhoods
  </a>
</div>
```

**Files:** `src/app/page.tsx` (Hero section)

---

## Task 3: Remove "How I Work" from Homepage

This content belongs on the About page, not the homepage. Carroll's homepage is 4-5 sections, not 7.

**Changes:**
- **Delete** the entire "How I Work" section from `page.tsx`
- The homepage should now have these sections only:
  1. Hero
  2. Property Search bar
  3. Neighborhoods
  4. Featured Developments
  5. CTA ("Let's Connect")
- Also **delete** the Market Insights / stats section — these are placeholder stats with no real data. We'll add real stats in Phase 2 when we have Bridge API data.

**Files:** `src/app/page.tsx`

---

## Task 4: Neighborhood Cards — Image-Dominant

Carroll's neighborhood cards are huge aerial photos with the neighborhood name overlaid. Ours are small cards with placeholder icons.

**Changes:**
- Replace the neighborhood card design entirely
- Card layout: Large image (70% of card height) with gradient overlay at bottom, neighborhood name overlaid on the image
- Remove tagline text from cards
- Keep HOMES | CONDOS buttons below the image
- Remove "View Guide →" link (the whole card should link to the guide)
- Reduce from 10 neighborhoods on homepage to **6** (the ones with `hasGuide: true` minus Edgewater): Brickell, Miami Beach, Coconut Grove, Coral Gables, Downtown Miami, Key Biscayne
- Use placeholder images for now — create colored gradient placeholders that look intentional:
  ```tsx
  // Each neighborhood gets a unique gradient as placeholder
  const gradients = [
    "from-blue-900/60 to-cyan-900/40",      // Brickell (waterfront)
    "from-sky-800/60 to-blue-900/40",        // Miami Beach (ocean)
    "from-green-900/60 to-emerald-900/40",   // Coconut Grove (lush)
    "from-orange-900/40 to-amber-950/40",    // Coral Gables (Mediterranean)
    "from-indigo-900/60 to-purple-900/40",   // Downtown Miami (urban)
    "from-teal-900/60 to-cyan-950/40",       // Key Biscayne (island)
  ];
  ```
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Card height: `h-80 md:h-96` (tall cards, image-dominant)
- Add `hover:scale-[1.02] transition-transform duration-300` on card container

**Example card structure:**
```tsx
<a href={`/neighborhoods/${slug}/`} className="group relative h-80 md:h-96 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
  {/* Placeholder gradient (replace with real photos later) */}
  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
  
  {/* Name overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-6">
    <h3 className="font-playfair text-2xl md:text-3xl text-white mb-4">{name}</h3>
    <div className="flex gap-3">
      <span className="px-4 py-2 text-xs uppercase tracking-wider border border-white/30 text-white hover:bg-white/10 transition-all">
        Homes
      </span>
      <span className="px-4 py-2 text-xs uppercase tracking-wider border border-white/30 text-white hover:bg-white/10 transition-all">
        Condos
      </span>
    </div>
  </div>
</a>
```

**Section header:** Remove the gold-line divider. Remove the paragraph description. Just:
```tsx
<h2 className="font-playfair text-4xl md:text-5xl mb-12">Neighborhoods</h2>
```

**"View All" link** below the grid:
```tsx
<div className="mt-10 text-center">
  <a href="/neighborhoods/" className="text-sm uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors">
    View All Neighborhoods →
  </a>
</div>
```

**Files:** `src/app/page.tsx` (Neighborhoods section)

---

## Task 5: Development Cards — Cleaner

Simplify the development cards to match the same image-dominant pattern.

**Changes:**
- Similar to neighborhoods: large image area (gradient placeholder), name + location + price overlay
- Remove status badge pill (redundant — status is shown inline)
- Remove the unit count from the card
- Keep: Name, Location, "From $X.XM", Status text
- Grid: `grid-cols-1 md:grid-cols-2` (keep 2-column)
- Card height: `h-72 md:h-80`
- Remove gold-line and description paragraph from section header
- Section header: just `<h2 className="font-playfair text-4xl md:text-5xl mb-12">New Developments</h2>`

**Files:** `src/app/page.tsx` (Featured Developments section)

---

## Task 6: Footer Simplification

Carroll's footer is minimal. Ours is too busy.

**Changes:**
- **Remove** the 4-column nav grid (Explore / Neighborhoods / Company / Legal) — this duplicates the nav and mega menu
- **Keep:** Footer header (Andrew Whalen + tagline + social icons)
- **Replace** 4-column grid with a single row of key links:
  ```tsx
  <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
    <a href="/neighborhoods/" className="hover:text-white transition-colors">Neighborhoods</a>
    <a href="/luxury-condos/" className="hover:text-white transition-colors">Luxury Condos</a>
    <a href="/new-construction/" className="hover:text-white transition-colors">New Construction</a>
    <a href="/about/" className="hover:text-white transition-colors">About</a>
    <a href="/contact/" className="hover:text-white transition-colors">Contact</a>
    <a href="/blog/" className="hover:text-white transition-colors">Insights</a>
    <a href="/privacy/" className="hover:text-white transition-colors">Privacy</a>
    <a href="/terms/" className="hover:text-white transition-colors">Terms</a>
  </div>
  ```
- **Wire social links** to actual URLs (currently all `href="#"`):
  - Instagram: https://www.instagram.com/iamandrewwhalen/
  - TikTok: https://www.tiktok.com/@iamandrewwhalen
  - X: https://x.com/iamandrewwhalen
  - Facebook: https://www.facebook.com/ImAndrewWhalen
  - YouTube: https://www.youtube.com/@andrewwhalen11
  - LinkedIn: https://www.linkedin.com/in/iamandrewwhalen/
- **Keep** MLS compliance section exactly as-is (legally required, do not modify)
- **Remove** the duplicate Privacy/DMCA/Terms links at the very bottom (they're now in the single row above)

**Files:** `src/app/layout.tsx` (footer section)

---

## Task 7: Update JSON-LD sameAs Links

The homepage JSON-LD has incorrect social links.

**Changes in the `<script type="application/ld+json">` block:**
```json
"sameAs": [
  "https://www.instagram.com/iamandrewwhalen/",
  "https://www.tiktok.com/@iamandrewwhalen",
  "https://x.com/iamandrewwhalen",
  "https://www.facebook.com/ImAndrewWhalen",
  "https://www.youtube.com/@andrewwhalen11",
  "https://www.linkedin.com/in/iamandrewwhalen/"
]
```

**Files:** `src/app/page.tsx` (JSON-LD script block)

---

## Task 8: Favicon + PWA Wiring

The W-icon PNG files exist but aren't wired into the app metadata.

**Changes in `src/app/layout.tsx`:**
Add to the metadata export:
```tsx
export const metadata: Metadata = {
  title: "Andrew Whalen | Miami Luxury Real Estate",
  description: "...",
  icons: {
    icon: [
      { url: "/w-icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/w-icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/w-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/w-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    // ... keep existing
  },
};
```

Also update the title from "South Florida" to "Miami" (more specific, better for local SEO).

**Files:** `src/app/layout.tsx`

---

## Task 9: Remove gold-line and gradient utilities

Clean up CSS patterns that don't match Carroll's aesthetic.

**Changes in `src/app/globals.css`:**
- **Remove** the `.gold-line` class definition
- **Remove** the `.watermark` class definition (not used by Carroll)
- **Keep** `.glass` if it exists (might be useful)
- Search the codebase for any remaining `gold-line` or `watermark` class usage and remove those too

**Files:** `src/app/globals.css`, and any files using these classes

---

## Task 10: Copy Photos to Public

**Changes:**
- Copy `/mnt/c/Users/dreww/Vault/Marketing/Headshot - Andrew.png` → `public/andrew-headshot.png`
- Copy `/mnt/c/Users/dreww/Vault/Marketing/Full Body Pic - Andrew.png` → `public/andrew-fullbody.png`
- These will be used in the About page later, but get them in the repo now

---

## Summary Checklist

After all tasks, the homepage should have exactly 5 sections:
1. **Hero** — Massive "Miami Luxury Real Estate" + one ghost button
2. **Search bar** — Text input + ghost search button (no amber)
3. **Neighborhoods** — 6 large image-dominant cards in 3-column grid
4. **New Developments** — 4 cleaner cards in 2-column grid  
5. **CTA** — "Let's Connect" + one amber button

Footer should be:
- Brand name + tagline + social icons (with real URLs)
- Single row of nav links
- MLS compliance block (untouched)

Run `npm run build` and fix all errors. Commit with message: `Phase 1A: Visual polish — monochromatic Carroll match`
