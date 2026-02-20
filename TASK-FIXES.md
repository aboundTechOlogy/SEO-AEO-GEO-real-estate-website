# TASK: Fix 404s, Missing Routes, and Data Gaps

Read `CLAUDE.md` for project context. This is a follow-up to the full site build — fixing broken links and missing pages.

---

## 1. Missing Page Routes (Components exist, no page route)

### `/exclusive-listings/` — Create page route
**File:** `src/app/exclusive-listings/page.tsx`

- Import `ExclusiveListings` component (already built), `SectionHeader`, `PropertyCard`
- Hero banner with "Exclusive Listings" title
- Render a full-page grid of listings using `MOCK_EXCLUSIVE` from `src/data/mockListings.ts`
- 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Use `PropertyCard` for each listing
- Add `CollectionPage` JSON-LD schema
- Export metadata with OpenGraph

### `/recent-sales/` — Create page route
**File:** `src/app/recent-sales/page.tsx`

- Same layout as exclusive-listings but using `MOCK_SOLD` data with `isSold: true`
- Hero banner with "Recently Sold" title
- `PropertyCard` with sold styling
- `CollectionPage` JSON-LD schema

---

## 2. County Sub-Routes (Nav links point to 404s)

Create dedicated pages for each county. These are better for SEO than query params.

### Neighborhoods county pages

**File:** `src/app/neighborhoods/broward/page.tsx`
- Same layout as `/neighborhoods/` but filtered to Broward County neighborhoods only
- Hero banner: "Broward County Neighborhoods"
- Map placeholder (left) + neighborhood card grid (right) — only Broward entries
- Import neighborhoods data, filter by `county === "broward"`
- Add breadcrumb: Home > Neighborhoods > Broward County
- Export metadata: "Broward County Neighborhoods | Andrew Whalen"

**File:** `src/app/neighborhoods/palm-beach/page.tsx`
- Same as above but filtered to Palm Beach County
- Hero banner: "Palm Beach County Neighborhoods"
- Filter by `county === "palm-beach"`
- Breadcrumb: Home > Neighborhoods > Palm Beach County

### Luxury Condos county pages

**File:** `src/app/luxury-condos/broward/page.tsx`
- Same layout as `/luxury-condos/` but filtered to Broward County buildings only
- Hero banner: "Broward County Luxury Condos"
- Import buildings data, filter by `county === "broward"`
- Breadcrumb: Home > Luxury Condos > Broward County
- Export metadata: "Broward County Luxury Condos | Andrew Whalen"

**File:** `src/app/luxury-condos/palm-beach/page.tsx`
- Same as above but filtered to Palm Beach County
- Hero banner: "Palm Beach County Luxury Condos"
- Filter by `county === "palm-beach"`

---

## 3. Neighborhood Data Gaps

Add missing neighborhoods to `src/data/neighborhoods.ts`. Each entry needs at minimum: `name`, `slug`, `county`, `description` (1-2 sentences placeholder).

### Missing Miami-Dade neighborhoods (add these):
```ts
{ name: "Doral", slug: "doral", county: "miami-dade", description: "A master-planned community in western Miami-Dade known for world-class golf resorts, top-rated schools, and proximity to Miami International Airport." },
{ name: "Design District", slug: "design-district", county: "miami-dade", description: "Miami's premier luxury shopping and contemporary art destination, home to flagship stores, galleries, and architecturally significant buildings." },
{ name: "Little Havana", slug: "little-havana", county: "miami-dade", description: "The cultural heart of Miami's Cuban-American community, known for Calle Ocho, vibrant street life, and an increasingly dynamic real estate market." },
{ name: "South Beach", slug: "south-beach", county: "miami-dade", description: "Miami Beach's iconic southern tip, famous for Art Deco architecture, Ocean Drive, and some of South Florida's most sought-after oceanfront residences." },
{ name: "Wynwood", slug: "wynwood", county: "miami-dade", description: "Miami's premier arts district, transformed from a warehouse neighborhood into a globally recognized hub for street art, galleries, restaurants, and creative lofts." },
{ name: "Midtown", slug: "midtown", county: "miami-dade", description: "A vibrant mixed-use neighborhood between Wynwood and Edgewater, offering walkable urban living with modern condos, boutique retail, and diverse dining." },
```

### Missing Broward County neighborhoods (add these):
```ts
{ name: "Fort Lauderdale", slug: "fort-lauderdale", county: "broward", description: "Broward County's largest city, known as the 'Venice of America' for its extensive canal system, boating lifestyle, and Las Olas Boulevard's luxury dining and shopping." },
{ name: "Hollywood", slug: "hollywood", county: "broward", description: "A beachfront city offering a more relaxed pace than Miami, with the iconic Hollywood Beach Broadwalk, diverse dining, and increasingly upscale waterfront developments." },
{ name: "Pompano Beach", slug: "pompano-beach", county: "broward", description: "A rapidly developing coastal city north of Fort Lauderdale, attracting buyers with new luxury oceanfront condos, a revitalized fishing pier, and competitive pricing." },
{ name: "Hallandale Beach", slug: "hallandale-beach", county: "broward", description: "A compact oceanfront city at the Broward-Miami-Dade border, home to Gulfstream Park and a growing number of luxury high-rise developments." },
{ name: "Parkland", slug: "parkland", county: "broward", description: "An affluent suburban community in western Broward County, consistently ranked among Florida's safest cities with top-rated schools and estate-sized homes." },
{ name: "Weston", slug: "weston", county: "broward", description: "A master-planned suburban community known for excellent schools, family-friendly parks, and well-maintained gated communities in western Broward." },
```

### Missing Palm Beach County neighborhoods (add these):
```ts
{ name: "Palm Beach", slug: "palm-beach", county: "palm-beach", description: "The crown jewel of South Florida luxury, this barrier island is home to historic mansions, Worth Avenue's world-class shopping, and some of the highest property values in the country." },
{ name: "Boca Raton", slug: "boca-raton", county: "palm-beach", description: "An upscale coastal city known for its pristine beaches, championship golf courses, Mizner Park, and a strong mix of luxury waterfront and gated community living." },
{ name: "Delray Beach", slug: "delray-beach", county: "palm-beach", description: "A vibrant Atlantic Avenue arts and dining scene, award-winning beaches, and a walkable downtown making it one of Palm Beach County's most desirable coastal communities." },
{ name: "West Palm Beach", slug: "west-palm-beach", county: "palm-beach", description: "Palm Beach County's urban center, offering waterfront dining on Clematis Street, a thriving arts scene, and increasingly sophisticated condo and townhome developments." },
{ name: "Jupiter", slug: "jupiter", county: "palm-beach", description: "A northern Palm Beach County coastal town known for Jupiter Inlet, world-class fishing, Roger Dean Stadium, and laid-back luxury living with excellent schools." },
{ name: "Highland Beach", slug: "highland-beach", county: "palm-beach", description: "An exclusive oceanfront community between Boca Raton and Delray Beach, offering private beach access and some of the most prestigious waterfront addresses in Palm Beach County." },
```

### Fix slug conflicts
The existing data has `wynwood-midtown` and `midtown-miami` — keep those entries but also add the new `wynwood` and `midtown` entries above as separate neighborhoods. If there's a duplicate slug conflict, rename the old ones:
- `wynwood-midtown` → keep as-is (it's a combined area reference)
- `midtown-miami` → keep as-is
- Add new `wynwood` (slug: "wynwood") and `midtown` (slug: "midtown") as separate entries

---

## 4. Building Detail Pages

### Create building detail route
**File:** `src/app/luxury-condos/[slug]/page.tsx`

Reference: `reference/carroll-luxury-condos.html` for building card design

- Dynamic route using building slug from `src/data/buildings.ts`
- Layout:
  1. Hero banner with building name
  2. Building image (placeholder gradient)
  3. Building details: location, year built, total units, price range (all placeholder data)
  4. Description (placeholder paragraph)
  5. "View Available Units" CTA (links to `/search/` for now)
  6. "Back to Luxury Condos" link
- Generate static params from buildings data
- `RealEstateListing` or `Place` JSON-LD schema
- Export metadata with building name

---

## 5. Add Broward/Palm Beach Buildings & Developments

### Update `src/data/buildings.ts`
Add 3-4 placeholder buildings for each new county if they don't already exist:

**Broward:**
```ts
{ name: "Auberge Beach Residences", slug: "auberge-beach-residences", county: "broward", neighborhood: "Fort Lauderdale", description: "Ultra-luxury oceanfront residences on Fort Lauderdale Beach." },
{ name: "Paramount Fort Lauderdale", slug: "paramount-fort-lauderdale", county: "broward", neighborhood: "Fort Lauderdale", description: "Iconic luxury tower on Fort Lauderdale Beach." },
{ name: "The Ritz-Carlton Pompano Beach", slug: "ritz-carlton-pompano-beach", county: "broward", neighborhood: "Pompano Beach", description: "Branded luxury oceanfront residences in Pompano Beach." },
```

**Palm Beach:**
```ts
{ name: "The Bristol", slug: "the-bristol", county: "palm-beach", neighborhood: "West Palm Beach", description: "Ultra-luxury waterfront condominium on the Intracoastal in West Palm Beach." },
{ name: "Via Mizner", slug: "via-mizner", county: "palm-beach", neighborhood: "Boca Raton", description: "Luxury residences adjacent to the Boca Raton Resort & Club." },
```

### Update `src/data/developments.ts`
Add 2-3 placeholder developments for Broward/Palm Beach if missing. Same structure as existing entries, add `county` field.

---

## 6. Accessibility Page

**File:** `src/app/accessibility/page.tsx`

Simple page — good for MLS compliance:
- Hero banner: "Accessibility"
- Standard accessibility statement text:
  - "Andrew Whalen is committed to ensuring digital accessibility for people with disabilities."
  - "We continually improve the user experience for everyone and apply the relevant accessibility standards."
  - Contact info for accessibility issues: email + phone
- Export metadata

---

## Order of Operations

1. Add missing neighborhoods to `neighborhoods.ts`
2. Add missing buildings/developments to `buildings.ts` and `developments.ts`
3. Create county sub-routes (neighborhoods + luxury-condos for Broward and Palm Beach)
4. Create `/exclusive-listings/` page route
5. Create `/recent-sales/` page route
6. Create `/luxury-condos/[slug]/` building detail page
7. Create `/accessibility/` page
8. Run `npm run build` — fix ALL errors
9. Verify: no nav link should result in a 404

## Critical Rules
- **Read CLAUDE.md** for design system, brand, and animation references
- Use `ScrollReveal` for section animations (not FadeInOnScroll — it was deleted)
- All hero banners: dark background or `/hero-miami.jpg` with gradient overlay + title
- All buttons: ghost/outline white unless it's the ONE amber CTA per page
- "South Florida" not "Miami" for the overall market
- Run `npm run build` and fix all errors before done
- Mobile-first — every page must work at 375px
