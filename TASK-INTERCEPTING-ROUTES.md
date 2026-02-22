# TASK: Property Detail Intercepting Routes

## Goal
Add Next.js intercepting routes so clicking a listing card on `/search` opens a **slide-in panel/modal overlay** with property details, while `/property/[listingKey]/` remains a full standalone page for direct navigation and SEO.

## Reference
- **IDXBoost (Chad Carroll):** Click listing → slide-in panel from right, search page stays visible behind dark overlay. Back button or overlay click returns to search with state preserved.
- **Next.js docs:** https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes

## Architecture

### Route Structure
```
src/app/
  search/
    page.tsx                          ← existing search page (DO NOT rewrite)
    @modal/
      (.)property/[listingKey]/
        page.tsx                      ← intercepted route (renders PropertyModal)
      default.tsx                     ← returns null (no modal by default)
    layout.tsx                        ← search layout with modal slot
  property/
    [listingKey]/
      page.tsx                        ← existing full detail page (DO NOT modify)
```

### How It Works
1. User clicks listing card on `/search` → Next.js intercepts the `/property/[listingKey]/` navigation
2. Instead of full page nav, it renders the `@modal/(.)property/[listingKey]/page.tsx` component
3. The search page stays mounted underneath (filters, map, scroll position preserved)
4. If user navigates directly to `/property/[listingKey]/` (bookmark, Google, share link) → gets the full standalone page

## Components to Build

### 1. `src/app/search/@modal/(.)property/[listingKey]/page.tsx`
- Intercepted route page
- Calls `getProperty(listingKey)` from `@/lib/bridge`
- Renders `<PropertyDetailPanel property={property} />`
- Shows loading skeleton while fetching

### 2. `src/app/search/@modal/default.tsx`
- Returns `null` — no modal when no property is selected

### 3. `src/app/search/layout.tsx`
- New layout wrapping the search page with the modal slot:
```tsx
export default function SearchLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

### 4. `src/components/PropertyDetailPanel.tsx`
**Slide-in panel from the right side:**
- Fixed position overlay: dark semi-transparent backdrop + white/dark panel sliding from right
- Panel width: ~600px desktop, full-width mobile
- **Close button** (X) top-right
- **Click backdrop** to close
- **Escape key** to close
- Uses `useRouter().back()` to close (preserves search state)

**Panel Content (scrollable):**
- Photo gallery/carousel at top (reuse photos from `getListingPhotos`)
- Price (large), address, status badge
- Beds / Baths / Sq.Ft / Price per Sq.Ft stats row
- Days on market
- Description (truncated with "Read more")
- Key details grid (Property Type, Year Built, Lot Size, etc.)
- Agent contact card (Andrew's info + inquiry CTA)
- "View Full Details" link → navigates to `/property/[listingKey]/` (full page)
- MLS compliance footer text

**Styling:**
- Match existing site theme: `bg-[#0a0a0a]` panel, `bg-black/60` backdrop
- Slide-in animation: CSS transform `translateX(100%)` → `translateX(0)` with transition
- Font: Playfair Display headings, Inter body (same as site)
- Panel scrolls independently from the search page behind it

### 5. Update listing card click behavior
In the search page, listing cards currently use `<a href="/property/{id}/">` or `<Link>`.
**Change to `<Link href="/property/{listing.id}/">`** — this is required for Next.js intercepting routes to work (client-side navigation triggers interception; hard `<a>` tags don't).

Check:
- `src/app/search/page.tsx` — card rendering (use `next/link` `<Link>` component)
- `src/components/SearchPropertyCard.tsx` — if cards have their own links

**IMPORTANT:** Only change the link/href mechanism. DO NOT rewrite SearchPropertyCard layout, styles, or data mapping.

## Existing Code Reference
- `src/lib/bridge.ts` → `getProperty(listingKey)` returns full `BridgeProperty`
- `src/lib/bridge.ts` → `getListingPhotos()`, `formatAddress()`, `formatCurrency()`
- `src/lib/property-utils.ts` → `calculatePricePerSqft()` and other utils
- `src/components/PropertyGallery.tsx` → existing photo gallery component
- `src/components/PropertyInquiryForm.tsx` → existing inquiry form
- Andrew's phone: (305) 455-9744
- Andrew's email: Andrew@IamAndrewWhalen.com

## DO NOT MODIFY
- `src/app/property/[listingKey]/page.tsx` — the full detail page is complete
- `src/components/SearchFilters.tsx` — search filters are locked
- `src/components/SearchPropertyCard.tsx` — card layout/styles are locked (only change link mechanism if needed)
- `src/data/mockListings.ts` — mock data is locked
- `src/lib/bridge.ts` — bridge API lib is complete

## Animation Spec
```css
/* Backdrop */
.backdrop-enter { opacity: 0; }
.backdrop-enter-active { opacity: 1; transition: opacity 300ms ease; }
.backdrop-exit-active { opacity: 0; transition: opacity 200ms ease; }

/* Panel */
.panel-enter { transform: translateX(100%); }
.panel-enter-active { transform: translateX(0); transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1); }
.panel-exit-active { transform: translateX(100%); transition: transform 200ms ease-in; }
```

## Validation
1. `npm run build` must pass with zero errors
2. Click listing card on `/search` → panel slides in from right, search page visible behind overlay
3. Close panel → return to search with same filters, scroll, map state
4. Direct navigation to `/property/[listingKey]/` → full standalone page (not modal)
5. Browser back button from panel → closes panel, returns to search
6. Mobile: panel takes full width, swipe or X to close
7. SEO: `/property/[listingKey]/` still has full metadata, OG tags, JSON-LD
