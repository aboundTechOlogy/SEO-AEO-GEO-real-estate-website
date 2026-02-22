# TASK: Chad Parity Pass + New Pages

Read `CLAUDE.md` for project context, design system, and critical rules.

This task covers: remaining Chad Carroll parity items, new service pages, and the "How We Use AI" page. Everything here is static content — no external API dependencies.

---

## 1. Custom 404 Page

**File:** `src/app/not-found.tsx`

Carroll has a branded 404 with "Oops!" heading and a cityscape illustration. Build ours:

- Dark background (`bg-[#0a0a0a]`)
- Centered content:
  - "404" in massive Playfair Display (`text-[120px] md:text-[180px]` font-light, `text-white/10`)
  - "Page Not Found" heading (`font-playfair text-3xl md:text-4xl`)
  - Subtitle: "The page you're looking for doesn't exist or has been moved."
  - Ghost button: "Back to Home" → `/`
  - Ghost button: "Search Properties" → `/search/`
- Minimum height: full viewport minus header
- Export metadata: `title: "Page Not Found | Andrew Whalen"`

---

## 2. Service Pages

All service pages follow the same template structure:

### Template for all service pages:
- Hero section: dark bg, hero image with gradient overlay, Playfair title + subtitle
- Content section: 2-column on desktop (content left, sidebar right), single column mobile
- Content: 3-5 paragraphs of relevant copy (write real, useful content — not Lorem ipsum)
- Sidebar: contact form card or CTA card with phone (305-455-9744) and email (Andrew@IamAndrewWhalen.com)
- Bottom CTA section: "Ready to get started?" with amber CTA button → `/contact/`
- JSON-LD: `Service` schema
- Export metadata with OpenGraph

### 2a. Services Hub Page

**File:** `src/app/services/page.tsx`

- Hero: "Our Services" title, subtitle: "Comprehensive real estate services for buyers, sellers, and investors across South Florida"
- Grid of 5 service cards linking to individual pages:
  - Seller Services → `/services/sellers/`
  - Buyer Services → `/services/buyers/`
  - Investor Services → `/services/investors/`
  - Request a Market Analysis → `/services/market-analysis/`
  - Request an Investment Analysis → `/services/investment-analysis/`
- Each card: icon/illustration area (use a simple SVG icon), title, 1-2 sentence description, "Learn More" link
- Cards: dark card style (`bg-neutral-900 border border-white/5 hover:border-white/20`)

### 2b. Seller Services

**File:** `src/app/services/sellers/page.tsx`

Content should cover:
- Strategic pricing and comparative market analysis
- Professional photography and virtual tours
- Multi-channel marketing (MLS, social media, targeted ads)
- Negotiation expertise and transaction management
- Pre-listing preparation and staging consultation
- South Florida luxury market expertise across Miami-Dade, Broward, and Palm Beach

### 2c. Buyer Services

**File:** `src/app/services/buyers/page.tsx`

Content should cover:
- Personalized property search and curated showings
- Market analysis and neighborhood guidance
- New construction and pre-construction expertise
- Negotiation strategy and offer preparation
- Mortgage and financing coordination
- Relocation assistance for out-of-state and international buyers
- Post-closing support and local connections

### 2d. Investor Services

**File:** `src/app/services/investors/page.tsx`

Content should cover:
- Investment property identification and analysis
- ROI projections and cash flow analysis
- Short-term rental (Airbnb/VRBO) market analysis
- 1031 exchange guidance
- Portfolio diversification strategy
- South Florida market trends and emerging neighborhoods
- Property management referrals

### 2e. Request a Market Analysis (CMA)

**File:** `src/app/services/market-analysis/page.tsx`

This is a **lead generation page** — primary purpose is form submission.

- Hero: "Request a Market Analysis" title
- Subtitle: "Get a comprehensive analysis of your property's current market value — complimentary and obligation-free."
- Explanation section: What is a CMA? Why it matters. 2-3 short paragraphs.
- **Lead form** (prominent, above the fold on desktop):
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Phone (required)
  - Property Address (required)
  - Property Type dropdown (Single Family, Condo/Townhouse, Multi-Family, Land/Lot)
  - "When are you looking to sell?" dropdown (ASAP, 1-3 months, 3-6 months, 6-12 months, Just curious)
  - Additional Comments (textarea)
  - Submit button (amber): "Request My Analysis"
- Form POST to `/api/market-analysis` (create the API route — for now just log to console and return success)
- Below form: trust signals — "Complimentary • No Obligation • Delivered within 48 hours"

### 2f. Request an Investment Analysis

**File:** `src/app/services/investment-analysis/page.tsx`

Similar to market analysis but investment-focused.

- Hero: "Request an Investment Analysis" title
- Subtitle: "Get detailed investment projections for any South Florida property — ROI, cash flow, and market outlook."
- Explanation section: What's included in the analysis? 2-3 paragraphs.
- **Lead form**:
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Phone (required)
  - Property Address or Area of Interest (required)
  - Investment Type dropdown (Long-Term Rental, Short-Term Rental, Fix & Flip, Buy & Hold, New Construction)
  - Budget Range dropdown ($500K-$1M, $1M-$2M, $2M-$5M, $5M-$10M, $10M+)
  - Additional Comments (textarea)
  - Submit button (amber): "Request My Analysis"
- Form POST to `/api/investment-analysis` (create API route — log to console and return success)
- Below form: trust signals — "Complimentary • No Obligation • Personalized for your goals"

---

## 3. How We Use AI Page

**File:** `src/app/about/ai/page.tsx`

This is a **differentiator page** — it positions Andrew as tech-forward and transparent.

- Hero: "How We Use AI" title, subtitle: "Transparency in how we leverage technology to serve you better"
- Content sections (each with a heading and 1-2 paragraphs):
  1. **Our Philosophy** — AI enhances our service, it doesn't replace the human relationship. Technology handles data so we can focus on you.
  2. **Market Analysis** — AI processes thousands of data points to deliver more accurate property valuations and market insights.
  3. **Property Search** — Intelligent matching helps us find properties that fit your criteria, including ones you might not have considered.
  4. **Content & Communication** — AI assists in creating market reports, neighborhood guides, and keeping you informed with timely updates.
  5. **What AI Doesn't Do** — AI never makes decisions for you. Every recommendation is reviewed and personalized by Andrew. Your data stays private.
  6. **Our Commitment** — We're committed to responsible AI use. If you have questions about how we use technology, we're happy to discuss.
- Bottom CTA: "Have questions about our technology?" → Contact button
- Tone: confident but approachable. Not salesy. Transparent.
- JSON-LD: `Article` schema
- Export metadata with OpenGraph

---

## 4. API Routes for Lead Forms

### 5a. Market Analysis API

**File:** `src/app/api/market-analysis/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  // TODO: Route to GHL CRM
  console.log("Market Analysis Request:", data);
  return NextResponse.json({ success: true, message: "Request received" });
}
```

### 5b. Investment Analysis API

**File:** `src/app/api/investment-analysis/route.ts`

Same pattern as above but for investment analysis submissions.

---

## 6. Update CLAUDE.md Nav Structure

The nav structure in CLAUDE.md is outdated. Update the "Nav Structure" section to reflect:

```
LEFT:  Our Listings ▾ | Luxury Condos ▾ | Neighborhoods ▾
CENTER: [Logo Lockup]
RIGHT: About ▾ | Services ▾ | Contact Us (outlined pill) | 👤 | ☰ (mega menu)
```

Also update the File Structure section to include the new pages.

---

## Order of Operations

1. Update CLAUDE.md nav structure documentation
2. Create `/not-found.tsx` (404 page)
3. Create `/services/page.tsx` (hub)
4. Create `/services/sellers/page.tsx`
5. Create `/services/buyers/page.tsx`
6. Create `/services/investors/page.tsx`
7. Create `/services/market-analysis/page.tsx` + API route
8. Create `/services/investment-analysis/page.tsx` + API route
9. Create `/about/ai/page.tsx`
10. Run `npm run build` — fix ALL errors
11. Verify: every nav/footer/mega menu link resolves to a real page

## Critical Rules
- **Read CLAUDE.md** before starting — follow design system strictly
- **Phone number:** (305) 455-9744 for all Andrew contact info
- **Email:** Andrew@IamAndrewWhalen.com
- **"South Florida"** not "Miami" for overall market coverage
- Use `ScrollReveal` for section animations (not FadeInOnScroll)
- All hero banners: dark background or `/hero-miami.jpg` with gradient overlay
- Buttons: ghost/outline white unless it's the ONE amber CTA per page
- Every page needs `export const metadata: Metadata` with OpenGraph
- Every page needs appropriate JSON-LD structured data
- Mobile-first — every page must work at 375px
- Run `npm run build` and fix all errors before done
- **Write real content** — no Lorem ipsum, no "coming soon" placeholders
