# Phase 1 Task — Structural Build

Do all 8 tasks in order. Read CLAUDE.md for brand system and design rules.

---

## 1. REDESIGN THE NAV (src/app/layout.tsx)

Replace the current nav. Extract components to `src/components/`.

**Left side:** AW | ANDREW WHALEN (keep existing logo markup)

**Center nav links:**
```
LUXURY CONDOS ▾    NEIGHBORHOODS ▾    NEW CONSTRUCTION    ABOUT    CONTACT
```

**Right side:** Search icon (magnifying glass SVG, links to /search/) + pipe separator + LoKation logo (`/lokation-logo-white.png`, small)

**LUXURY CONDOS dropdown:**
- "All Buildings" → `/luxury-condos/`
- Divider line
- Brickell → `/luxury-condos/brickell/`
- Miami Beach → `/luxury-condos/miami-beach/`
- Coconut Grove → `/luxury-condos/coconut-grove/`
- Coral Gables → `/luxury-condos/coral-gables/`
- Sunny Isles → `/luxury-condos/sunny-isles/`
- Edgewater → `/luxury-condos/edgewater/`

**NEIGHBORHOODS dropdown:**
- "All Neighborhoods" → `/neighborhoods/`
- Divider line
- Brickell → `/neighborhoods/brickell/`
- Miami Beach → `/neighborhoods/miami-beach/`
- Coconut Grove → `/neighborhoods/coconut-grove/`
- Coral Gables → `/neighborhoods/coral-gables/`
- Key Biscayne → `/neighborhoods/key-biscayne/`
- Downtown Miami → `/neighborhoods/downtown-miami/`
- Edgewater → `/neighborhoods/edgewater/`

**Dropdown behavior:**
- Desktop: show on hover, hide on mouse leave with ~200ms delay
- All caps, text-sm, tracking-wider
- Dropdown panel: bg-neutral-950 border border-white/10, shadow-xl

**Mobile:**
- Hamburger icon (3 lines) replaces center nav on small screens
- Slides out a full-height panel from the right
- Flat list of all links (no nested dropdowns)
- Close button (X)

**Components to create:**
- `src/components/NavDropdown.tsx` — "use client", handles hover state
- `src/components/MobileMenu.tsx` — "use client", handles open/close state

---

## 2. CREATE /about/ PAGE (src/app/about/page.tsx)

**Sections:**

1. **Hero** — Gray placeholder box (h-96) for lifestyle photo + text overlay:
   - "ABOUT" label (neutral-500, uppercase, tracking-wider)
   - "Andrew Whalen" (Playfair, text-5xl)
   - "Realtor® · South Florida Luxury Specialist" subtitle

2. **Stats banner** — 3 stat cards in a row:
   - "1,300+" / "Transactions"
   - "20+" / "Years Experience"
   - "Miami" / "Luxury Specialist"
   - Numbers in Playfair text-4xl, labels in Inter text-sm text-neutral-500

3. **Bio** — Two-column layout (text left, photo placeholder right):
   - 2-3 paragraphs: NYC transplant turned Miami luxury expert. 1,300+ closings across all price points, now focused exclusively on South Florida luxury. Deep neighborhood knowledge — not just listings, but lifestyle, market dynamics, and investment potential.

4. **"How I Work"** — 3 cards with icons (use simple SVG icons):
   - **Market Intelligence**: "Real-time market data, price trends, and neighborhood analytics. Not guesswork — data."
   - **Instant Response**: "AI-powered concierge available 24/7. Get answers about any property, neighborhood, or market question immediately."
   - **Data-Driven Decisions**: "Every recommendation backed by comparable sales, price-per-square-foot analysis, and trend data."

5. **LoKation affiliation** — Small section with LoKation logo + "Proudly affiliated with LoKation Real Estate" + office address

**JSON-LD:** RealEstateAgent + Person schema (similar to homepage but more detailed)

---

## 3. CREATE /contact/ PAGE (src/app/contact/page.tsx)

Create a `src/components/ContactForm.tsx` ("use client") for the interactive parts.

**Layout:** Two columns on desktop, stacked on mobile.

**Left column (form):**
- "Let's Talk" heading (Playfair text-4xl)
- "Whether you're buying, selling, or investing — I'm here to help." subtitle
- Goal selection row: 4 buttons (Buy / Sell / Sell & Buy / Invest) — clicking one adds a visual highlight (amber border + subtle amber bg). Store selected goal in state.
- Name input (required)
- Email input (required)
- Phone input
- "What can I help with?" textarea
- Submit button: `bg-amber-600 hover:bg-amber-500 text-white` — "Let's Talk"
- On submit: `console.log({ name, email, phone, goal, message })` with a success state that shows "Thanks! I'll be in touch shortly."

**Right column (contact info):**
- "Andrew Whalen" name
- "Realtor® · LoKation Real Estate"
- Email: andrew@iamandrewwhalen.com
- Phone: (305) 420-6613
- Office: 1900 N Bayshore Dr, Suite 120, Miami, FL 33132
- Small LoKation logo at bottom

---

## 4. CREATE /neighborhoods/ HUB (src/app/neighborhoods/page.tsx)

**First:** Add these neighborhoods to `src/data/neighborhoods.ts` with placeholder data (shorter entries — just slug, name, tagline, placeholder stats, empty FAQs array, basic highlights):
- Aventura (slug: aventura, tagline: "Luxury Meets Convenience")
- Sunny Isles Beach (slug: sunny-isles, tagline: "Florida's Riviera")
- South of Fifth (slug: south-of-fifth, tagline: "SoFi — Miami Beach's Most Exclusive")
- Bal Harbour (slug: bal-harbour, tagline: "Oceanfront Opulence")
- Surfside (slug: surfside, tagline: "Small-Town Charm, Big-Time Beach")
- Wynwood / Midtown (slug: wynwood-midtown, tagline: "Art, Culture & Urban Edge")
- Fisher Island (slug: fisher-island, tagline: "America's Wealthiest Zip Code")

Note: Aventura and Sunny Isles already exist in the homepage NEIGHBORHOODS array but NOT in the neighborhoods.ts data file. Add all 7 new ones to the data file.

**Page layout:**

1. **Hero:**
   - gold-line
   - "NEIGHBORHOOD GUIDES" label
   - "Miami's Luxury Neighborhoods" (Playfair text-5xl)
   - Subtitle: "Insider knowledge on Miami-Dade's most sought-after neighborhoods. Market data, lifestyle insights, and the developments reshaping each area."

2. **Map placeholder:**
   - Full-width gray box (h-64) with "Interactive Map Coming Soon" centered text
   - Will add Mapbox later

3. **Neighborhood grid** (responsive: 1 col mobile, 2 cols md, 3 cols lg):
   Each card:
   - Neighborhood name (Playfair text-xl)
   - Tagline (text-sm text-neutral-500)
   - Market snapshot: "Median: $X" and "Avg DOM: X days" (text-sm text-neutral-400)
   - Two buttons side by side: "HOMES" and "CONDOS" (small, ghost style with border-white/20)
   - If the neighborhood has a full guide (the original 7), the name links to `/neighborhoods/[slug]/`
   - If it's a new placeholder neighborhood, show a small "Coming Soon" badge and don't link the name

**JSON-LD:** ItemList with nested Place entities for each neighborhood

---

## 5. CREATE /new-construction/ PAGE

**First:** Create `src/data/developments.ts` — move the FEATURED_DEVELOPMENTS array from `src/app/page.tsx` and expand it:

```typescript
export interface Development {
  slug: string;
  name: string;
  location: string;    // neighborhood
  priceFrom: string;
  units: string;
  status: "Pre-Construction" | "Under Construction" | "Recently Completed";
  completionYear: string;
  developer: string;
  description: string; // 1-2 sentence editorial note
}
```

**Developments (keep existing 4, add 6 more):**
1. The Perigon — Miami Beach, from $3.7M, 73 units, Pre-Construction, 2027, Mast Capital
2. The Standard Residences — Brickell, from $750K, 228 units, Under Construction, 2027, Midtown Development
3. Vida Residences — Edgewater, from $640K, 400 units, Under Construction, 2026, NR Investments
4. Ella — Miami Beach, from $890K, 120 units, Pre-Construction, 2028, Two Roads Development
5. 72 Park — Miami Beach, from $1.3M, 202 units, Recently Completed, 2025, Aria Development
6. The Residences at 1428 Brickell — Brickell, from $1M, 189 units, Under Construction, 2027, Ytech
7. Five Park Miami Beach — Miami Beach, from $2.5M, 98 units, Recently Completed, 2025, Terra / GFO
8. Aman Miami Beach — Miami Beach, from $5.5M, 23 units, Pre-Construction, 2028, Vlad Doronin / OKO Group
9. St. Regis Sunny Isles — Sunny Isles Beach, from $5M, 152 units, Under Construction, 2027, Fortune International
10. Casa Bella by B&B Italia — Edgewater, from $1.5M, 57 units, Recently Completed, 2024, Related Group

**Page layout (`src/app/new-construction/page.tsx`):**

1. **Hero:**
   - gold-line
   - "NEW DEVELOPMENT" label
   - "New Construction & Pre-Construction" (Playfair text-5xl)
   - Subtitle about Miami's development pipeline

2. **Filter row** (optional, nice-to-have): buttons to filter by status (All / Pre-Construction / Under Construction / Recently Completed)

3. **Map placeholder:** gray box h-64

4. **Development grid** (2 cols on desktop):
   Each card:
   - Placeholder image (gray box h-48 with "Rendering Coming Soon")
   - Name (Playfair text-2xl)
   - Location / Neighborhood
   - Status badge (small pill, bg-white/5)
   - Price from, units, completion year
   - Developer name (text-sm text-neutral-500)
   - 1-2 sentence description
   - No detail page links yet (cards are not clickable to a detail route)

5. **CTA section** at bottom: "Interested in pre-construction? Contact me for pricing, floor plans, and developer incentives." + link to /contact/

**Update `src/app/page.tsx`:** Import developments from the new data file instead of inline array.

**JSON-LD:** ItemList

---

## 6. CREATE /luxury-condos/ PLACEHOLDER (src/app/luxury-condos/page.tsx)

Create `src/data/buildings.ts`:

```typescript
export interface Building {
  slug: string;
  name: string;
  neighborhood: string;
  yearBuilt: string;
  units: number;
  floors: number;
  description: string;
}
```

**Buildings:**
1. Porsche Design Tower — Sunny Isles Beach, 2017, 132 units, 60 floors
2. Armani Casa — Sunny Isles Beach, 2019, 308 units, 56 floors
3. Jade Signature — Sunny Isles Beach, 2018, 192 units, 57 floors
4. Faena House — Miami Beach, 2015, 18 units, 18 floors
5. One Thousand Museum — Downtown Miami, 2019, 83 units, 62 floors
6. Brickell Flatiron — Brickell, 2019, 549 units, 64 floors
7. Missoni Baia — Edgewater, 2023, 249 units, 57 floors
8. Turnberry Ocean Club — Sunny Isles Beach, 2021, 154 units, 52 floors

**Page layout:**

1. **Hero:**
   - gold-line
   - "LUXURY CONDOS" label
   - "Miami's Premier Condo Buildings" (Playfair text-5xl)
   - Subtitle

2. **Building grid** (3 cols lg, 2 cols md, 1 col mobile):
   Each card:
   - Placeholder image (h-48 gray)
   - Name (Playfair text-xl)
   - Neighborhood
   - Year Built · X Units · X Floors
   - 1 sentence description

3. **Note at bottom:** "Full building profiles with market data, amenities, and available units coming soon."

4. **CTA:** Link to /contact/

---

## 7. HOMEPAGE CLEANUP (src/app/page.tsx)

- **Remove** the About section entirely (it's now at /about/)
- **Remove** the Contact section entirely (it's now at /contact/)
- **Keep:** Hero with goal selection, Neighborhoods grid, Featured Developments, Market Stats
- **Import** developments from `src/data/developments.ts` (show first 4 only on homepage)
- **Update neighborhoods grid:** Remove the `hasPage` check — make ALL neighborhood names link to `/neighborhoods/[slug]/`. For the ones without guides yet, link to the hub: `/neighborhoods/`
- **Add "How I Work" section** after Market Stats — 3 cards (same as About page but briefer, 1 sentence each). Link "Learn More" to /about/
- **Add "Let's Connect" CTA** at the very bottom — brief text + amber button linking to /contact/

---

## 8. UPDATE FOOTER (src/app/layout.tsx)

Reorganize the link columns to 4 columns:

**Column 1 — Explore:**
- Luxury Condos → /luxury-condos/
- New Construction → /new-construction/
- Search Properties → /search/
- Market Insights → /blog/

**Column 2 — Neighborhoods:**
- Brickell → /neighborhoods/brickell/
- Miami Beach → /neighborhoods/miami-beach/
- Coconut Grove → /neighborhoods/coconut-grove/
- Coral Gables → /neighborhoods/coral-gables/
- Key Biscayne → /neighborhoods/key-biscayne/
- Downtown Miami → /neighborhoods/downtown-miami/
- Edgewater → /neighborhoods/edgewater/

**Column 3 — Company:**
- About → /about/
- Contact → /contact/
- Insights → /blog/

**Column 4 — Legal:**
- Privacy Policy → /privacy/
- Terms → /terms/
- DMCA → /dmca/

**CRITICAL:** Keep the entire MLS compliance section below the columns EXACTLY as-is. Do not modify any of that text — it is legally required verbatim.

---

## WHEN DONE

Run `npm run build` and fix ALL TypeScript/build errors before finishing. Make sure every page renders without errors.
