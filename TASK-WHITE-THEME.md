# TASK: White Default Theme + Dark Accent Sections

## Goal
Switch the site from all-dark to **white default background with dark accent sections** — matching the luxury real estate standard (Carroll Group, Sotheby's, Douglas Elliman). Homepage hero stays dark; inner pages get white backgrounds.

## Design System

### Color Tokens (update in globals.css or tailwind config)
- **Page background:** `#ffffff` (white)
- **Primary text:** `#1a1a1a` (near-black)
- **Secondary text:** `#6b7280` (gray-500)
- **Muted text:** `#9ca3af` (gray-400)
- **Borders:** `#e5e7eb` (gray-200)
- **Card backgrounds:** `#f9fafb` (gray-50) or `#ffffff`
- **Dark accent sections:** `#0a0a0a` bg, `#ffffff` text (same as current)
- **CTA buttons:** White outline on dark sections, dark solid on white sections. **NO amber/gold buttons.** Amber (#d97706) is ONLY for testimonial star ratings.

### Typography (unchanged)
- Headings: Playfair Display, `text-[#1a1a1a]` on white, `text-white` on dark
- Body: Inter, `text-[#4b5563]` (gray-600) on white, `text-neutral-300` on dark

## Pages to Update

### STAY DARK (no changes)
- `src/app/page.tsx` — Homepage hero + key sections stay dark (this is the cinematic landing)
- `src/app/search/page.tsx` — Search page stays dark (map + cards work better dark) **DO NOT TOUCH**
- `src/app/property/[listingKey]/page.tsx` — Property detail stays dark (immersive gallery experience)

### SWITCH TO WHITE DEFAULT
All inner/content pages — white background with optional dark accent sections:

**Services:**
- `src/app/services/page.tsx`
- `src/app/services/buyers/page.tsx`
- `src/app/services/sellers/page.tsx`
- `src/app/services/investors/page.tsx`
- `src/app/services/investment-analysis/page.tsx`
- `src/app/services/market-analysis/page.tsx`

**About:**
- `src/app/about/page.tsx`
- `src/app/about/ai/page.tsx`

**Contact:**
- `src/app/contact/page.tsx`

**Neighborhoods:**
- `src/app/neighborhoods/page.tsx`
- `src/app/neighborhoods/[slug]/page.tsx`
- `src/app/neighborhoods/broward/page.tsx`
- `src/app/neighborhoods/palm-beach/page.tsx`

**Luxury Condos:**
- `src/app/luxury-condos/page.tsx`
- `src/app/luxury-condos/[slug]/page.tsx`
- `src/app/luxury-condos/broward/page.tsx`
- `src/app/luxury-condos/palm-beach/page.tsx`

**Listings:**
- `src/app/our-listings/page.tsx`
- `src/app/exclusive-listings/page.tsx`
- `src/app/recent-sales/page.tsx`
- `src/app/new-construction/page.tsx`

**Content/Legal:**
- `src/app/testimonials/page.tsx`
- `src/app/press/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/dmca/page.tsx`
- `src/app/accessibility/page.tsx`

## Pattern for Each Page

### Hero Section (top of page)
Keep dark hero banners where they exist — these are accent sections:
```tsx
<section className="bg-[#0a0a0a] text-white px-6 py-20">
  {/* Hero content */}
</section>
```

### Content Sections (body of page)
Switch to white:
```tsx
{/* BEFORE */}
<section className="bg-[#0a0a0a] px-6 py-14">
  <h2 className="text-white ...">...</h2>
  <p className="text-neutral-300 ...">...</p>
  <div className="border border-white/10 bg-neutral-900/40">...</div>
</section>

{/* AFTER */}
<section className="bg-white px-6 py-14">
  <h2 className="text-[#1a1a1a] ...">...</h2>
  <p className="text-gray-600 ...">...</p>
  <div className="border border-gray-200 bg-gray-50">...</div>
</section>
```

### Dark Accent Sections (sprinkled in)
Use strategically for visual rhythm — CTA bands, stats strips, testimonial sections:
```tsx
<section className="bg-[#0a0a0a] text-white px-6 py-16">
  {/* Dark accent content */}
</section>
```

### Cards
```tsx
{/* BEFORE */}
<div className="border border-white/10 bg-neutral-900/40 p-6">

{/* AFTER — on white pages */}
<div className="border border-gray-200 bg-white shadow-sm p-6">
```

### Buttons
```tsx
{/* On white sections — dark button */}
<button className="bg-[#1a1a1a] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#333] transition-colors">

{/* On dark sections — white outline button */}
<button className="border border-white text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-[#0a0a0a] transition-colors">

{/* NEVER use amber/gold/orange buttons anywhere */}
```

## Shared Components to Check
These components may need conditional styling or variants:
- `src/components/SectionHeader.tsx` — watermark text needs dark variant
- `src/components/ScrollReveal.tsx` — should work either way
- `src/components/Footer.tsx` — footer stays dark (standard practice)
- `src/components/Header.tsx` — needs to work on both dark hero and white body. Consider: dark text when scrolled past hero onto white content, or keep white text with dark header bg always.

## Header Behavior
The header should work correctly over both dark heroes and white content:
- **Option A (simpler):** Keep header background always `bg-[#0a0a0a]` — dark header on all pages
- **Option B (Carroll style):** Transparent header over dark heroes, switches to white bg + dark text when scrolling onto white content

Go with **Option A** for now — simpler, still looks great. We can do the scroll-aware header later.

## DO NOT MODIFY
- `src/app/search/page.tsx` — search page stays dark
- `src/app/property/[listingKey]/page.tsx` — property detail stays dark
- `src/components/SearchFilters.tsx` — locked
- `src/components/SearchPropertyCard.tsx` — locked
- `src/data/mockListings.ts` — locked
- `src/lib/bridge.ts` — locked

## Validation
1. `npm run build` must pass with zero errors
2. All inner pages have white backgrounds with readable dark text
3. Dark accent sections (heroes, CTA bands) still look correct
4. No amber/gold buttons anywhere on the site
5. Footer stays dark
6. Header works correctly on all pages
7. Cards, borders, and backgrounds use appropriate light-theme colors
8. Text contrast meets WCAG AA (4.5:1 ratio minimum)
