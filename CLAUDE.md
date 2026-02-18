# AWR Website — Project Instructions

## Project
Luxury real estate website for **Andrew Whalen, Realtor®** (iamandrewwhalen.com)
- **Brokerage:** LoKation Real Estate ($499/transaction)
- **Market:** Miami-Dade luxury ($500K–$150M)
- **Solo agent** — no team pages

## Tech Stack
- Next.js 16, React 19, Tailwind 4, TypeScript
- Deployed on Vercel
- App Router (async server components, `"use client"` where needed)
- Tailwind 4 uses `@import "tailwindcss"` — NOT `@tailwind` directives
- Bridge API (SEFMLS) for MLS data (Phase 2)

## Brand System

### Typography
- **Inter** (already loaded as `--font-inter`):
  - Light 300 → nav, logo, labels, buttons
  - Regular 400 → body text
- **Playfair Display** (already loaded as `--font-playfair`):
  - Regular 400 → section headings, page titles, editorial content
- **Never use more than these two typefaces**

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Black | `#0a0a0a` | Primary background |
| Near Black | `#171717` | Secondary background (neutral-900) |
| White | `#ffffff` | Primary text, logo on dark |
| Neutral 300 | — | Body text on dark bg |
| Neutral 400 | `#a3a3a3` | Secondary body text |
| Neutral 500 | `#737373` | Labels, captions |
| Amber 600 | `#d97706` | **CTA buttons ONLY** — never in logo/wordmark |

### Design Patterns
- Dark backgrounds (#0a0a0a, #171717) — alternate between sections
- Section headings: `font-playfair text-3xl` or `text-4xl`
- Body text: `text-neutral-300` or `text-neutral-400`
- Labels: `text-neutral-500 uppercase tracking-wider text-sm`
- Borders: `border-white/5`, hover → `border-white/20`
- Cards: `bg-white/[0.02]`, hover → `bg-white/[0.04]`
- Primary CTA: `bg-amber-600 text-white` (amber for primary CTAs ONLY)
- Secondary buttons: `border border-white/20` ghost style
- `gold-line`: 60px decorative line (`w-[60px] h-px bg-white/20`) before section headings — use sparingly
- Sections: `py-16` to `py-24` spacing
- Responsive: mobile-first, `md:` tablet, `lg:` desktop

### Logo
- **AW** monogram: Inter Light 300, tracking-[0.35em], uppercase
- **ANDREW WHALEN** wordmark: Inter Light 300, tracking-[0.25em], uppercase
- Logo is ALWAYS white on dark or dark on light — **never amber**

## File Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout (nav + footer)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind + custom styles
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── neighborhoods/
│   │   ├── page.tsx        # Hub/directory
│   │   └── [slug]/page.tsx # Neighborhood guides
│   ├── luxury-condos/
│   │   └── page.tsx        # Building directory
│   ├── new-construction/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── dmca/page.tsx
├── components/             # Shared React components
│   ├── NavDropdown.tsx     # Client component
│   └── MobileMenu.tsx      # Client component
├── data/                   # Static data files
│   ├── neighborhoods.ts
│   ├── developments.ts
│   └── buildings.ts
└── lib/                    # Utility functions
    └── blog.ts
```

## Critical Rules
1. **Do NOT modify MLS compliance footer text** — it is legally required verbatim (SEFMLS copyright, MLS disclaimer, data reliability notice, NAPW broker info)
2. **Do NOT remove existing JSON-LD structured data** — add to it
3. **JSON-LD on every page** — use appropriate schema (RealEstateAgent, Place, FAQPage, Article, ItemList, etc.)
4. **All pages need `export const metadata: Metadata`** with OpenGraph
5. **Property pages are full URLs** (not modals) for SEO indexability
6. **Run `npm run build`** after changes and fix all errors

## Nav Structure
```
AW | ANDREW WHALEN    LUXURY CONDOS ▾  NEIGHBORHOODS ▾  NEW CONSTRUCTION  ABOUT  CONTACT    🔍  [LoKation Logo]
```
- LUXURY CONDOS dropdown → /luxury-condos/ + buildings by neighborhood
- NEIGHBORHOODS dropdown → /neighborhoods/ + individual guides
- Sticky, black bg, backdrop-blur, border-b border-white/5

## Content Strategy (context for writing copy)
- **AI-first:** Every page serves AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), or includes AI features
- **Content > IDX:** Neighborhood guides are 2,000+ word authoritative resources, not thin search pages
- **Unique data:** Market stats, price trends, comparisons not available elsewhere
- **FAQ schema on every content page** — natural-language Q&A that AI assistants can extract
- **Andrew's voice:** Concise, confident, data-informed. No fluff. Active voice, present tense.

## Reference Docs (in ~/Vault/Businesses/awr/)
- `AWR-SITE-STRATEGY.md` — AI-first strategy, three pillars (AEO, GEO, AI Features)
- `AWR-SITEMAP.md` — Complete page specs, routing map, nav structure, 4 phases
- `chad-carroll-routing-map.md` — UX reference navigation audit
- `chad-carroll-site-audit.md` — Design system reference
- `AWR Brand Kit.md` — Full brand positioning, colors, typography, voice
