# TASK: Full Site Build — Match Carroll's Design

## READ FIRST
- Read `CLAUDE.md` for project context, design system, brand rules, and Carroll's animation reference
- Read `reference/carroll-*.html` and `reference/carroll-*.css` for EACH section/page before implementing. **Do not guess** at layout or animation behavior — the actual source code is right there.
- This is a **one-shot build**. Build everything described below, run `npm run build`, fix all errors.

## Setup

```bash
npm install gsap @gsap/react swiper
```

Add to `.gitignore` if not already there:
```
reference/
```

---

## PART 1: Shared Components

### 1A. `src/components/ScrollReveal.tsx`
GSAP ScrollTrigger-based scroll animation. Replaces old `FadeInOnScroll.tsx`.

```tsx
"use client";
import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  start?: string;
}

export default function ScrollReveal({
  children, className, stagger = 0.12, y = 40,
  duration = 0.8, delay = 0, once = true, start = "top 80%"
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const targets = ref.current.querySelectorAll("[data-reveal]");
    const animTargets = targets.length > 0 ? Array.from(targets) : [ref.current];

    gsap.set(animTargets, { opacity: 0, y });

    const tween = gsap.to(animTargets, {
      opacity: 1, y: 0, duration, delay, stagger,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start, once },
    });

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [stagger, y, duration, delay, once, start]);

  return <div ref={ref} className={className}>{children}</div>;
}
```

### 1B. `src/components/SectionHeader.tsx`
Consistent section header matching Carroll's `.ms-new-header-title` pattern.

Props: `subtitle` (small text, e.g. "Andrew Whalen"), `title` (large text, e.g. "Exclusive Listings"), optional `watermark` boolean (shows W-icon behind), optional `align` ("center" | "left").

Structure:
```
<div class="relative">
  {watermark && <img src="/w-icon-logo.png" class="absolute opacity-[0.03] ..." />}
  <p data-reveal class="font-inter text-sm tracking-[0.2em] uppercase text-neutral-500">{subtitle}</p>
  <h2 data-reveal class="font-playfair text-5xl md:text-6xl uppercase tracking-wider text-white mt-2">{title}</h2>
</div>
```
Wrap in `ScrollReveal`.

### 1C. `src/components/PropertyCard.tsx`
Shared listing card used by Exclusive Listings, Recently Sold, and search results.

Reference: `reference/carroll-exclusive-listings.html` — look at the `.gs-container-slider` card markup and `reference/carroll-css-pages-home-index.css` for `.featured-section` styles.

Props: `image`, `price`, `address`, `city`, `state`, `zip`, `beds`, `baths`, `sqft`, `status` (optional badge), `href`, `isSold` (boolean).

Structure:
- Aspect-ratio 4/3 image container with `object-cover`
- Status badge (top-left): "New", "Price Reduced", "Pending", "SOLD" — badge color: white bg black text
- Heart icon (top-right, outline, for future save functionality)
- Below image: Price (large, Playfair), address, city/state/zip, beds·baths·sqft (small)
- Hover: `scale-[1.02]` with shadow increase
- If `isSold`: grayscale image, "SOLD" banner

### 1D. `src/components/SwiperCarousel.tsx`
Reusable Swiper wrapper.

Props: `children` (slides), `slidesPerView` (default 3), `spaceBetween` (default 24), `navigation` (boolean), `pagination` (boolean), `breakpoints` (optional override), `className`.

Use Swiper React components. Include prev/next arrow buttons matching Carroll's nav pattern (thin arrow icons, positioned outside carousel or overlapping edges).

Import Swiper CSS:
```tsx
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
```

### 1E. `src/components/NavArrows.tsx`
Prev/Next + CTA button row used below carousels.

Props: `prevLabel`, `nextLabel`, `ctaText`, `ctaHref`, `onPrev`, `onNext`.

Layout: `[← Prev] [CTA Button] [Next →]` — centered, with arrows as thin-border circles and CTA as ghost pill button.

Reference: Carroll's `.ms-new-wrapper-nav` pattern in the homepage HTML.

---

## PART 2: Homepage Sections

Build each as its own component file. Import all into `src/app/page.tsx`.

### 2A. Hero Section — `src/components/HeroSection.tsx` — **ACTIVE**

Reference: `reference/carroll-full.html` lines ~2301-2327 (`#introVideo`)

**Keep existing functionality** (goal buttons, mobile search) but upgrade animations:

- Background: Keep `/hero-miami.jpg` with dark gradient overlay. Keep commented-out `<video>` tag ready.
- Title: "South Florida Luxury Real Estate" — each letter wrapped in `<span>` for GSAP stagger animation (Carroll does this with `.ms-wrapper-animation-text > div`)
- Subtitle: "Select your goal. Our AI concierge handles the rest." — fades in after title
- Goal buttons: Buy, Sell, Sell & Buy, Invest — stagger fade-in after subtitle. Ghost outline style (`border-2 border-white/40`). **DO NOT REMOVE THESE.**
- Desktop: left-aligned (`pl-12 lg:pl-16`), vertically centered
- Mobile: centered, goal buttons in 2×2 grid, search bar below
- Letter animation timing: 0.03s stagger per letter, 0.15s delay between lines

### 2B. Property Search — `src/components/PropertySearch.tsx` — **ACTIVE** (refine existing)

Reference: `reference/carroll-full.html` lines ~2328-2417 (`#welcome`) and CSS `.ms-search` in `reference/carroll-css-pages-home-index.css`

- Desktop only (`hidden md:flex`)
- Full-viewport height, dark background
- W-icon watermark (keep existing)
- Title: "Property" (drops down) + "Search" (rises up) — two-part animation. Reference Carroll's `.ms-down` / `.ms-up` CSS classes.
- Pill search bar: `[For Sale ▾] [Search input ...] [Find Now!]` — keep existing layout
- Video background: keep commented out, ready for swap
- Wrap in `ScrollReveal`

### 2C. Exclusive Listings — `src/components/ExclusiveListings.tsx` — **COMMENTED OUT**

Reference: `reference/carroll-full.html` lines ~2418-2467 (`#listings`) and `reference/carroll-exclusive-listings.html`

- `SectionHeader` with subtitle="Andrew Whalen" title="Exclusive Listings"
- `SwiperCarousel` with 3 `PropertyCard` components (use mock data below)
- `NavArrows` with "View All Exclusive Listings" CTA → `/exclusive-listings/`
- Full dark bg (`bg-[#0a0a0a]`), generous padding (`py-20 md:py-28`)

Mock listings data (put in `src/data/mockListings.ts`):
```ts
export const MOCK_EXCLUSIVE = [
  { image: "/placeholder-listing-1.jpg", price: "$4,250,000", address: "1000 Brickell Plaza #5501", city: "Miami", state: "FL", zip: "33131", beds: 4, baths: 4, sqft: 3200, status: "New", href: "#" },
  { image: "/placeholder-listing-2.jpg", price: "$2,850,000", address: "900 Biscayne Blvd #4201", city: "Miami", state: "FL", zip: "33132", beds: 3, baths: 3, sqft: 2450, status: "", href: "#" },
  { image: "/placeholder-listing-3.jpg", price: "$7,500,000", address: "7412 Fisher Island Dr", city: "Miami Beach", state: "FL", zip: "33109", beds: 5, baths: 6, sqft: 5100, status: "New", href: "#" },
  { image: "/placeholder-listing-4.jpg", price: "$1,995,000", address: "2627 S Bayshore Dr #2401", city: "Coconut Grove", state: "FL", zip: "33133", beds: 3, baths: 3, sqft: 2100, status: "", href: "#" },
  { image: "/placeholder-listing-5.jpg", price: "$12,500,000", address: "6800 Indian Creek Dr", city: "Miami Beach", state: "FL", zip: "33141", beds: 7, baths: 8, sqft: 8500, status: "New", href: "#" },
];
```

For placeholder images: create simple dark gradient placeholder divs (no actual images needed — use `bg-gradient-to-br from-neutral-800 to-neutral-900` as the image container background when no `src` is provided).

### 2D. Exclusive Videos — `src/components/ExclusiveVideos.tsx` — **COMMENTED OUT**

Reference: `reference/carroll-full.html` lines ~2468-2563 (`#new_videos`)

- `SectionHeader` with subtitle="Andrew Whalen" title="Exclusive Videos"
- `SwiperCarousel` with 3 video card placeholders
- Each card: dark placeholder thumbnail + centered play button icon (SVG circle with triangle) + AW logo + LoKation logo at bottom
- `NavArrows` with prev/next

### 2E. Animated Text Banner — `src/components/AnimatedTextBanner.tsx` — **ACTIVE**

Reference: `reference/carroll-full.html` lines ~2564-2577 (`#animate_text`)

- Full-width section, min-height ~60vh
- Dark background (placeholder for video — add commented-out `<video>` tag)
- "Andrew Whalen" (h2, large) + "South Florida Luxury Real Estate" (h3, larger)
- Text fades in on scroll (ScrollReveal)
- This is a visual breathing space between content sections

### 2F. About Cover — `src/components/AboutCover.tsx` — **ACTIVE**

Reference: `reference/carroll-full.html` lines ~2578-2637 (`#about_cover`) and CSS `#about_cover` in `reference/carroll-css-pages-home-index.css`

**This is the most complex animation section. Read Carroll's source carefully.**

Desktop layout:
- Full viewport height, relative positioned
- Andrew's photo (`/andrew-stats-v3.png`) with clip-path reveal animation
  - Initial: `clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)` (invisible)
  - Animated: `clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)` (full reveal)
  - GSAP ScrollTrigger, duration 1.2s, ease "power2.inOut"
- 6 floating bars (`.ms-float-bar` in Carroll's HTML) — horizontal bars that expand width from 0 to 100%, staggered 0.15s each, positioned over the photo
- 4 stat records positioned to the right of the photo:
  - "1,300+" / "Transactions Closed"
  - "21+" / "Years of Experience"  
  - "$500M+" / "Career Sales Volume"
  - "40+" / "Neighborhoods Served"
  - Each stat value: letter-by-letter reveal (wrap each char in `<span>`, GSAP stagger 0.04s per char, 0.3s delay between stats)
  - Subtitle fades in after value completes
- W-icon watermark between/behind stats (low opacity)

Mobile layout (`lg:hidden`):
- Reference `#about_records` in Carroll's HTML (lines ~2638-2658) — simplified mobile version
- Photo: `/andrew-stats-mobile.png`, sticky top, full viewport
- Stats: scroll over photo as overlay cards (keep existing sticky-scroll pattern — it works well)
- Stats are simple text (no letter-by-letter on mobile — too fiddly on small screens)

### 2G. About Description — `src/components/AboutDescription.tsx` — **ACTIVE**

Reference: `reference/carroll-full.html` lines ~2659-2730 (`#about_description`) and CSS

- Two-column layout (desktop): text left ~55%, photo right ~45%
- Left column:
  - `SectionHeader` subtitle="Andrew Whalen" title="Meet Andrew"
  - "Serving Miami, Fort Lauderdale and Palm Beach." (subtitle, uppercase, tracked)
  - Bio paragraphs (use existing text from current page.tsx Meet Andrew section)
  - "Meet Andrew →" text link (desktop) or pill button (mobile) → /about/
- Right column:
  - `/andrew-headshot.png` with fade-in gradient on left edge blending into bg
  - Below: placeholder for team/lifestyle video (commented out `<video>`)
- Mobile: stacked (text → headshot)
- Wrapped in `ScrollReveal`

### 2H. Neighborhoods — `src/components/NeighborhoodBlades.tsx` — **ACTIVE** (major refactor)

Reference: `reference/carroll-full.html` lines ~2731-2826 (`#neighborhoods_collection`) and CSS

Carroll's implementation: 3 `<li>` items in a `<ul>`, one has class `active` (expanded ~50% width), others ~25%. Each has video background + header + "Explore Now" button.

Our refactored version:
- 3 blades: Miami-Dade, Broward, Palm Beach
- Desktop: flex layout, active blade `flex-[2]`, inactive `flex-1`. **Click to expand** (not just hover).
- Each blade: gradient background (keep current gradients as placeholder until we have photos/video), section header "Neighborhoods" / county name, "Explore Now" pill button
- Video backgrounds: commented out, ready for swap
- Mobile: stacked vertically, each blade ~200px tall, tap to navigate
- Animation: blades slide/fade in with ScrollReveal stagger
- Default active blade: Miami-Dade (center position, matching Carroll)

### 2I. Recently Sold — `src/components/RecentlySold.tsx` — **COMMENTED OUT**

Same pattern as ExclusiveListings but with sold data.
- `SectionHeader` subtitle="Andrew Whalen" title="Recently Sold"
- `SwiperCarousel` with `PropertyCard` components (use `MOCK_SOLD` data with `isSold: true`)
- `NavArrows` with "View All Recently Sold" → `/recent-sales/`

Add to `src/data/mockListings.ts`:
```ts
export const MOCK_SOLD = [
  { image: "/placeholder-listing-1.jpg", price: "$3,100,000", address: "800 S Pointe Dr #1803", city: "Miami Beach", state: "FL", zip: "33139", beds: 3, baths: 3, sqft: 2800, isSold: true, href: "#" },
  { image: "/placeholder-listing-2.jpg", price: "$1,450,000", address: "1643 Brickell Ave #3204", city: "Miami", state: "FL", zip: "33129", beds: 2, baths: 2, sqft: 1650, isSold: true, href: "#" },
  { image: "/placeholder-listing-3.jpg", price: "$5,800,000", address: "300 S Biscayne Blvd PH", city: "Miami", state: "FL", zip: "33131", beds: 4, baths: 5, sqft: 4200, isSold: true, href: "#" },
];
```

### 2J. Testimonials — `src/components/TestimonialsSection.tsx` — **ACTIVE**

Reference: `reference/carroll-full.html` lines ~3939-4153 (`#new_testimonials`) and `reference/carroll-css-pages-testimonials-index.css`

- `SectionHeader` subtitle="Andrew Whalen" title="Testimonials"
- `SwiperCarousel` (1 slide visible on mobile, 1-2 on desktop — testimonials are wide cards)
- Each testimonial card:
  - Large quotation mark icon (SVG — use `"` in Playfair Display at ~80px, low opacity, positioned top-left of card)
  - Testimonial text (Playfair italic, text-lg, neutral-300)
  - 5 stars (amber-500 — this is the ONE allowed amber element)
  - No client name (using placeholder text, will add real names later)
- Background: Andrew's photo positioned right side, low opacity (~10%), desktop only
  - Reference Carroll's `.ms-avatar-img` positioning
- `NavArrows` with "View More Testimonials" → `/testimonials/`
- Keep existing 3 placeholder testimonials, add 2-3 more

### 2K. Press/Media — `src/components/PressSection.tsx` — **COMMENTED OUT**

Reference: `reference/carroll-full.html` lines ~4154-5245 (`#new_media`)

- `SectionHeader` subtitle="Andrew Whalen" title="In The News"
- Description text: "Stay in the loop with the most recent updates, insightful articles, and breaking news."
- `SwiperCarousel` with 4 placeholder press cards (dark gradient thumbnails)
- "View All Press And Media" button → `/press/`

### 2L. Instagram Feed — `src/components/InstagramFeed.tsx` — **COMMENTED OUT**

Reference: `reference/carroll-full.html` lines ~5246-6322 (`#instagram_content`)

- Instagram header: avatar circle + @iamandrewwhalen + bio preview
- 4-column grid (2 on mobile) of placeholder image squares
- Each square: dark gradient placeholder with Instagram icon overlay
- "Follow on Instagram" button linking to IG profile
- Will integrate with Instagram API later

### 2M. Contact Form Section — `src/components/ContactFormSection.tsx` — **ACTIVE**

Reference: `reference/carroll-full.html` lines ~6323-6463 (`#new_contact_form`) and `reference/carroll-css-core-contact-index.css`

- Two-column layout: form left (~50%), decorative right (~50%)
- Left column:
  - `SectionHeader` subtitle="Andrew Whalen" title="South Florida's Luxury Specialist"  
  - Subtext: "Contact Trusted Professionals"
  - Form fields: First Name*, Last Name*, Email*, Phone, Message (textarea), Submit button
  - Consent checkbox: "I agree to be contacted by Andrew Whalen via call, email, and text. [Privacy Policy] and [Terms of Service]."
  - Submit button: ghost pill style (`border border-white/30 rounded-full`)
  - Form action: POST to `/api/contact` (create API route)
- Right column: dark gradient placeholder (for future video background)
- Mobile: full-width form, no right column

### 2N. Create `/src/app/api/contact/route.ts`
Simple POST handler that console.logs form data. Will integrate with GHL later.
```ts
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Contact form submission:", data);
  // TODO: GHL integration
  return NextResponse.json({ success: true });
}
```

---

## PART 3: Page Builds

### 3A. Homepage — `src/app/page.tsx`

Replace current content with all section imports. Structure:

```tsx
import { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import PropertySearch from "@/components/PropertySearch";
// import ExclusiveListings from "@/components/ExclusiveListings";
// import ExclusiveVideos from "@/components/ExclusiveVideos";
import AnimatedTextBanner from "@/components/AnimatedTextBanner";
import AboutCover from "@/components/AboutCover";
import AboutDescription from "@/components/AboutDescription";
import NeighborhoodBlades from "@/components/NeighborhoodBlades";
// import RecentlySold from "@/components/RecentlySold";
import TestimonialsSection from "@/components/TestimonialsSection";
// import PressSection from "@/components/PressSection";
// import InstagramFeed from "@/components/InstagramFeed";
import ContactFormSection from "@/components/ContactFormSection";

export const metadata: Metadata = {
  title: "Andrew Whalen | South Florida Luxury Real Estate",
  description: "South Florida luxury real estate specialist. 1,300+ transactions, 21+ years experience across Miami-Dade, Broward, and Palm Beach counties.",
  openGraph: {
    title: "Andrew Whalen | South Florida Luxury Real Estate",
    description: "South Florida luxury real estate specialist serving Miami-Dade, Broward, and Palm Beach.",
    url: "https://iamandrewwhalen.com",
    siteName: "Andrew Whalen | LoKation Real Estate",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PropertySearch />
      {/* <ExclusiveListings /> */}
      {/* <ExclusiveVideos /> */}
      <AnimatedTextBanner />
      <AboutCover />
      <AboutDescription />
      <NeighborhoodBlades />
      {/* <RecentlySold /> */}
      <TestimonialsSection />
      {/* <PressSection /> */}
      {/* <InstagramFeed /> */}
      <ContactFormSection />

      {/* Keep existing JSON-LD — copy from current page.tsx */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: "Andrew Whalen",
        description: "South Florida luxury real estate specialist with 1,300+ transactions across Miami-Dade, Broward, and Palm Beach counties.",
        url: "https://iamandrewwhalen.com",
        telephone: "+1-305-420-6613",
        address: { "@type": "PostalAddress", streetAddress: "1900 N Bayshore Dr, Suite 120", addressLocality: "Miami", addressRegion: "FL", postalCode: "33132", addressCountry: "US" },
        sameAs: [
          "https://www.instagram.com/iamandrewwhalen/",
          "https://www.tiktok.com/@iamandrewwhalen",
          "https://x.com/iamandrewwhalen",
          "https://www.facebook.com/ImAndrewWhalen",
          "https://www.youtube.com/@andrewwhalen11",
          "https://www.linkedin.com/in/iamandrewwhalen/",
        ],
        worksFor: { "@type": "RealEstateAgent", name: "LoKation Real Estate", address: { "@type": "PostalAddress", streetAddress: "1900 N Bayshore Dr, Suite 120", addressLocality: "Miami", addressRegion: "FL", postalCode: "33132", addressCountry: "US" }, telephone: "+1-305-420-6613" },
        areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
      })}} />
    </>
  );
}
```

### 3B. About Page — `src/app/about/page.tsx`

Reference: `reference/carroll-meet-chad.html` and `reference/carroll-css-pages-agents-detail-index.css`

Layout:
1. **Hero banner** — Full-width image with dark overlay, "Meet Andrew" title (like Carroll's about page hero)
2. **Photo + Bio section** — Two-column: large Andrew photo left (~45%), bio text right (~55%)
   - Bio uses existing text + add: awards/certifications placeholder, specialties list
   - "Serving Miami, Fort Lauderdale and Palm Beach" subtitle
3. **Stats strip** — Horizontal row of 4 stats (same data as homepage AboutCover)
4. **Contact CTA** — Full-width band with "Let's Connect" + contact button

Schema: `Person` + `RealEstateAgent` JSON-LD (already partially exists — keep and enhance).

### 3C. Contact Page — `src/app/contact/page.tsx`

Reference: `reference/carroll-contact.html` and `reference/carroll-css-core-contact-index.css`

Layout:
1. **Hero banner** — Dark image overlay + "Contact Us" title
2. **Two-column**: Form left, contact info right
   - Form: same fields as homepage ContactFormSection (reuse the component or extract form into shared component)
   - Right: Address, phone, email, office hours, social icons, embedded Google Map placeholder (dark box with "Map coming soon")
3. **Goal selector** at top of form: Buy / Sell / Invest pills (sets hidden field)

Schema: `ContactPage` JSON-LD.

### 3D. Neighborhood Hub — `src/app/neighborhoods/page.tsx`

Reference: `reference/carroll-miami-dade.html` and `reference/carroll-communities-page.css`

Carroll's layout: Split-screen — interactive map (left ~40%) + neighborhood card grid (right ~60%).

Our layout:
1. **Hero banner** — "Neighborhoods" title with dark overlay
2. **County tabs** — Miami-Dade | Broward | Palm Beach (tab selector at top)
3. **Split panel**:
   - Left (~40%): Dark placeholder for Google Map (will integrate later). Show "Interactive map coming soon" text.
   - Right (~60%): 2-column grid of neighborhood cards
4. **Neighborhood cards**: 
   - Image (aerial photo placeholder — dark gradient)
   - Neighborhood name (centered, serif)
   - Two CTA buttons below: `[HOMES]` `[CONDOS]` (small, dark bg, white text)
   - Links to `/neighborhoods/{slug}/`

Use existing `src/data/neighborhoods.ts` data. Each neighborhood should have `county` field — add if missing.

Schema: `CollectionPage` + `ItemList` JSON-LD.

### 3E. Neighborhood Individual — `src/app/neighborhoods/[slug]/page.tsx`

Reference: `reference/carroll-brickell.html` for layout

This is the **editorial pillar page** — the GEO/AEO workhorse. Template structure:

1. **Hero** — Full-width aerial image (placeholder) + neighborhood name overlay
2. **Canonical Answer Box** — 50-90 word summary in a highlighted box. This is the "cite-magnet" for AI.
3. **Market Snapshot Table** — HTML `<table>` with median price, avg DOM, price/sqft, inventory, absorption rate. Use placeholder data.
4. **Overview** — 300-400 word section about the neighborhood. Use placeholder text with realistic structure.
5. **Who Buys Here** — Buyer persona section with placeholder text
6. **Lifestyle** — Dining, recreation, culture section with placeholder text
7. **Highlights** — Pill-style tags: "Walk Score: 95", "Waterfront", "30+ Luxury Towers", etc.
8. **FAQ Section** — 5 placeholder FAQs with accordion expand. FAQPage schema.
9. **CTA** — "Browse X Homes for Sale in {Neighborhood}" + "Browse X Condos for Sale" buttons
10. **Related Neighborhoods** — 3-4 cards linking to similar areas

Generate this template page. Use Brickell as the example with realistic placeholder content. Other neighborhood slugs should render the same template with data from `neighborhoods.ts`.

Schema: `Article` + `FAQPage` + `Place` JSON-LD.

### 3F. Luxury Condos — `src/app/luxury-condos/page.tsx`

Reference: `reference/carroll-luxury-condos.html`

Layout:
1. **Hero banner** — "Luxury Condos" title
2. **County tabs** — Miami-Dade | Broward | Palm Beach
3. **Building grid** — 3-column grid of condo building cards
   - Large image (placeholder gradient)
   - Building name
   - Location/neighborhood
   - "View Building" link

Use existing `src/data/buildings.ts` data. Enhance with `county` field if needed.

### 3G. New Construction — `src/app/new-construction/page.tsx`

Reference: `reference/carroll-new-developments.html`

Layout:
1. **Hero banner** — "New Construction" title
2. **Development grid** — Cards for each development
   - Large image placeholder
   - Development name, location, price range, completion date
   - "Learn More" button

Use existing `src/data/developments.ts` data.

### 3H. Search Results — `src/app/search/page.tsx`

Reference: `reference/carroll-search.html` and `reference/carroll-idx-search-filter.css`

**IMPORTANT: We are NOT using Carroll's IDX vendor. Build our own layout.**

Layout:
1. **Filter bar** (top, sticky):
   - Address/MLS search input
   - For Sale / Sold / For Rent dropdown
   - Price range dropdown
   - Beds/Baths dropdown
   - More filters (expandable)
   - Map toggle button
   - Result count + Sort dropdown
2. **Split panel**:
   - Left (~40%): Map placeholder (dark box, "Map integration coming soon")
   - Right (~60%): 2-column grid of `PropertyCard` components
3. **Pagination** at bottom
4. **No real data** — Show 6-8 mock listings from `mockListings.ts`

This page will be wired to Bridge API in Phase 2. For now it's a static shell.

Schema: `CollectionPage` + `ItemList` JSON-LD.

### 3I. Testimonials Full Page — `src/app/testimonials/page.tsx`

Reference: `reference/carroll-testimonials.html` and `reference/carroll-css-pages-testimonials-index.css`

Layout:
1. **Hero banner** — "Testimonials" title
2. **Grid of testimonial cards** — 2-column on desktop, 1 on mobile
   - Quotation mark icon
   - Testimonial text
   - 5 stars
   - Client name placeholder
3. Use 6-8 placeholder testimonials

### 3J. Press Page — `src/app/press/page.tsx` — **PLACEHOLDER**

Simple page with "Press & Media — Coming Soon" message. Just the hero banner and a line of text. Don't invest heavy time here.

### 3K. Blog Pages — **KEEP AS-IS**

Don't modify existing blog pages (`/blog/` and `/blog/[slug]/`). They work.

### 3L. Legal Pages — **KEEP AS-IS**

Don't modify `/privacy/`, `/terms/`, `/dmca/`, `/login/`. They work.

---

## PART 4: Layout & Navigation

### 4A. Header — `src/components/Header.tsx` — REFINE

Keep existing header but ensure:
- Scroll behavior: bg-transparent with `border-b border-white/10` on homepage → bg-black after 80px scroll. Always bg-black on other pages.
- Logo centered (absolute positioning — already correct)
- Desktop nav: LEFT dropdowns (Luxury Condos, Neighborhoods) | CENTER logo | RIGHT (About Us, Insights, Contact pill, login icon, hamburger)
- Mobile: logo left, login + hamburger right
- Add "Testimonials" to the MegaMenu links if not already there

### 4B. Footer — refactor in `src/app/layout.tsx`

Reference: `reference/carroll-full.html` footer section and `reference/carroll-css-core-footer-index.css`

Layout:
1. **Top**: Logo lockup (AW + LoKation) centered
2. **Columns** (desktop 4-col, mobile accordion):
   - **Luxury Condos**: Miami-Dade, Broward, Palm Beach, New Construction, View All
   - **Neighborhoods**: Miami-Dade, Broward, Palm Beach, View All
   - **Company**: About Us, Testimonials, Blog/Insights, Contact, Search Properties
   - **Connect**: Social icons (IG, TikTok, X, FB, YT, LinkedIn) + email + phone
3. **Bottom bar**: MLS compliance text (DO NOT MODIFY), legal links (Privacy, Terms, DMCA), © year
4. Mobile: `FooterAccordion.tsx` (already exists — reuse)

### 4C. `src/app/globals.css` — ensure GSAP + Swiper CSS doesn't conflict

Add any needed global styles:
- Smooth scrolling: `html { scroll-behavior: smooth; }` (or let GSAP handle it)
- Swiper overrides for dark theme (pagination dots white, nav arrows white)
- Clip-path animation utilities if needed

---

## PART 5: Data Files

### 5A. `src/data/mockListings.ts` (NEW)
Mock listing data for ExclusiveListings, RecentlySold, and Search page. Include `MOCK_EXCLUSIVE`, `MOCK_SOLD`, and `MOCK_SEARCH` arrays with 5-8 entries each matching the PropertyCard props interface.

### 5B. Update `src/data/neighborhoods.ts`
Ensure every neighborhood has a `county` field: `"miami-dade"`, `"broward"`, or `"palm-beach"`. Add any missing neighborhoods to reach at least 14 for Miami-Dade. Add 3-5 placeholder neighborhoods for Broward and Palm Beach if they don't exist.

### 5C. Update `src/data/buildings.ts`
Ensure every building has a `county` field. Add a few Broward/Palm Beach placeholders if needed.

### 5D. Update `src/data/developments.ts`
Same — ensure `county` field exists on all entries.

---

## PART 6: Cleanup

### Delete these files:
- `src/components/FadeInOnScroll.tsx` — replaced by ScrollReveal
- `src/components/StatsSection.tsx` — replaced by AboutCover
- `src/components/StatsAnimation.tsx` — replaced by AboutCover

### Update all imports:
Search the codebase for any imports of deleted components and update them.

---

## PART 7: Placeholder Images

Since we don't have photos for every section, use CSS gradient placeholders:

```tsx
// When a PropertyCard or section needs an image but doesn't have one:
<div className="w-full h-full bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900" />
```

For hero images on subpages (About, Contact, Neighborhoods, etc.), use the existing `/hero-miami.jpg` with different gradient overlays and titles, or create simple dark sections with just the title.

---

## PART 8: Build & Verify

After all code is written:

```bash
npm run build
```

Fix ALL TypeScript errors and build warnings. The site must build clean.

Test mentally at these breakpoints:
- 375px (mobile)
- 768px (tablet)
- 1024px (lg breakpoint)
- 1440px (desktop)

---

## CRITICAL RULES (violating any of these will require a redo)

1. **READ the Carroll reference files** (`reference/carroll-*.html` and `reference/carroll-*.css`) for each section before implementing. The code is RIGHT THERE.
2. **Do NOT remove goal buttons** from the hero (Buy, Sell, Sell & Buy, Invest)
3. **Keep "South Florida"** everywhere — never change to "Miami" for the overall market
4. **Amber used ONLY for**: star ratings in testimonials. ONE amber CTA max per page. All other buttons: ghost/outline white.
5. **Do NOT modify MLS compliance footer text** — legally required verbatim
6. **Do NOT remove JSON-LD structured data** — add to it, don't delete
7. **Logo is ALWAYS white on dark — never amber**
8. **Run `npm run build` and fix ALL errors before considering the task complete**
9. **Mobile-first**: every section must work at 375px
10. **Use "Andrew Whalen" where Carroll uses "The Carroll Group"** and "LoKation Real Estate" where Carroll uses "Compass"
