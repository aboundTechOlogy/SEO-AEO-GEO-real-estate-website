# AWR Website — Project Instructions

## Project
Luxury real estate website for **Andrew Whalen, Realtor®** (iamandrewwhalen.com)
- **Brokerage:** LoKation Real Estate ($499/transaction)
- **Market:** Miami-Dade luxury ($500K–$150M)
- **Solo agent** — no team pages
- **Design reference:** thechadcarrollgroup.com (monochromatic cinematic luxury)

## Tech Stack
- Next.js 16, React 19, Tailwind 4, TypeScript
- Deployed on Vercel (auto-deploy on push)
- App Router (async server components, `"use client"` where needed)
- Tailwind 4 uses `@import "tailwindcss"` — NOT `@tailwind` directives
- Bridge API (SEFMLS) for MLS data (Phase 2)

## Design System — Carroll Reference

### Design Principles
Match The Chad Carroll Group (thechadcarrollgroup.com):
- **Monochromatic luxury** — Black + white + photography provides all color. Minimal accent.
- **Cinematic editorial** — Full-bleed images, massive serif typography, generous whitespace
- **Minimal UI** — Nearly-invisible nav, fewer sections, larger impact
- **Typography as architecture** — Headlines command the viewport
- **Photography-forward** — Large aerial/lifestyle imagery. Cards are image-dominant.
- **Show less, intrigue more** — Curated over comprehensive

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
| White | `#ffffff` | Primary text, headings, logo |
| Neutral 300 | — | Body text on dark bg |
| Neutral 400 | `#a3a3a3` | Secondary body text |
| Neutral 500 | `#737373` | Labels, captions |
| Amber 600 | `#d97706` | **CTA buttons ONLY** — use SPARINGLY. Most buttons should be ghost/outline white. |

**CRITICAL:** The current site overuses amber. Carroll uses almost NO accent color. The vast majority of buttons should be `border border-white/30 text-white hover:bg-white/10`. Reserve amber for ONE primary CTA per page at most (e.g., "Contact Us" in nav, "Get in Touch" in CTA section).

### Design Patterns
- Sections: `py-20` to `py-32` spacing (generous — Carroll uses massive whitespace)
- Cards: image-dominant (60%+ image), minimal text
- Borders: `border-white/5`, hover → `border-white/20`
- **No gold-line dividers** — remove these. Carroll doesn't use them.
- **No gradient backgrounds on sections** — use flat `bg-[#0a0a0a]` or `bg-neutral-900`
- Hover: `hover:scale-[1.02] transition-transform` on cards
- Mobile-first: `md:` tablet, `lg:` desktop

### Logo
- **Logo lockup:** `/logo-lockup.png` — W-roof icon + ANDREW WHALEN + | + LOKATION (single PNG, created in Canva)
- **W icon:** `/w-icon-logo.png` — standalone W-roof icon for mobile/small screens
- **Favicon sizes:** `/w-icon-48.png`, `/w-icon-96.png`, `/w-icon-192.png`
- **LoKation logo:** `/lokation-logo-white.png`
- Logo is ALWAYS white on dark — **never amber**

### Social Links
- Instagram: https://www.instagram.com/iamandrewwhalen/
- TikTok: https://www.tiktok.com/@iamandrewwhalen
- X: https://x.com/iamandrewwhalen
- Facebook: https://www.facebook.com/ImAndrewWhalen
- YouTube: https://www.youtube.com/@andrewwhalen11
- LinkedIn: https://www.linkedin.com/in/iamandrewwhalen/

### Photos
- Headshot: `/andrew-headshot.png` (copy from source into /public/)
- Full body: `/andrew-fullbody.png` (copy from source into /public/)
- Source originals: `/mnt/c/Users/dreww/Vault/Marketing/`

## Nav Structure (3-section, matching Carroll)
```
LEFT:  Luxury Condos ▾ | Neighborhoods ▾
CENTER: [Logo Lockup]
RIGHT: About Us | Insights | Contact Us (outlined pill) | 👤 | ☰ (mega menu)
```
- Transparency: `bg-black/20 backdrop-blur-sm` (no bottom border)
- Mega menu: right-side slide-out panel (MegaMenu.tsx)
- Mobile: full logo lockup left, login icon + hamburger right

## File Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout (nav + footer)
│   ├── page.tsx            # Homepage
│   ├── globals.css
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── neighborhoods/
│   │   ├── page.tsx        # Hub/directory
│   │   └── [slug]/page.tsx # Neighborhood guides
│   ├── luxury-condos/page.tsx
│   ├── new-construction/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── dmca/page.tsx
├── components/
│   ├── NavDropdown.tsx
│   ├── MobileMenu.tsx
│   ├── MegaMenu.tsx
│   └── ContactForm.tsx
├── data/
│   ├── neighborhoods.ts    # 40 neighborhoods
│   ├── developments.ts     # 10 developments
│   └── buildings.ts        # 8 buildings
└── lib/
    └── blog.ts
```

## Critical Rules
1. **Do NOT modify MLS compliance footer text** — legally required verbatim
2. **Do NOT remove existing JSON-LD structured data** — add to it
3. **JSON-LD on every page** — RealEstateAgent, Place, FAQPage, Article, etc.
4. **All pages need `export const metadata: Metadata`** with OpenGraph
5. **Run `npm run build`** after changes and fix all errors
6. **Mobile-first** — test all changes at 375px width minimum
7. **Copy Andrew's photos** from `/mnt/c/Users/dreww/Vault/Marketing/` into `/public/` if they don't already exist there
