# TASK: Bridge API Integration + Google Maps

Read `CLAUDE.md` for project context, design system, and critical rules.

This task integrates the Bridge Interactive MLS API for live property data and Google Maps for interactive maps. Use the **test dataset** (`test`) for development — production dataset ID will be swapped in later.

---

## API Reference

### Bridge API

- **Base URL:** `https://api.bridgedataoutput.com/api/v2/OData/test/Property`
- **Auth:** Server-side calls use `Authorization: Bearer {SERVER_TOKEN}` header
- **Protocol:** OData v4 — supports `$filter`, `$select`, `$orderby`, `$top`, `$skip`, `$count`
- **Server Token env var:** `BRIDGE_SERVER_TOKEN`
- **Dataset:** `test` (10,000 records, 620 fields, mock data — swap to real dataset ID for production)

**Important:** Bridge API calls MUST be server-side only (Next.js API routes or server components). The server token is IP-restricted to the deployment server. Never expose it to the client.

### Key Fields to Use

**Listing card display:**
```
ListingId, ListingKey, ListPrice, StandardStatus, PropertyType, PropertySubType,
StreetNumber, StreetName, StreetSuffix, UnitNumber, City, StateOrProvince, PostalCode,
BedroomsTotal, BathroomsTotalInteger, BathroomsFull, BathroomsHalf, LivingArea,
Media (array of { MediaURL, Order, MediaCategory }),
DaysOnMarket, OriginalListPrice, ListingContractDate
```

**Property detail page:**
```
All of the above, plus:
PublicRemarks, YearBuilt, LotSizeArea, GarageSpaces, AssociationFee, AssociationFeeFrequency,
Latitude, Longitude, Appliances, InteriorFeatures, ExteriorFeatures, Cooling, Heating,
ParkingFeatures, BuildingFeatures, BuildingName, WaterfrontYN, PoolPrivateYN, ViewYN,
ListAgentFullName, ListOfficeName, ClosePrice, CloseDate,
BelowGradeFinishedArea, AboveGradeFinishedArea, Basement
```

**Photo structure:**
```json
{
  "MediaURL": "https://dvvjkgh94f2v6.cloudfront.net/test_data/listings/21.jpg",
  "Order": 1,
  "MimeType": "image/jpeg",
  "MediaCategory": "Photo"
}
```
Each listing has ~8 photos. Filter by `MediaCategory === "Photo"` and sort by `Order`.

### OData Filter Examples
```
$filter=ListPrice ge 500000 and ListPrice le 1000000
$filter=BedroomsTotal ge 3
$filter=StandardStatus eq 'Active'
$filter=PropertyType eq 'Residential'
$filter=WaterfrontYN eq true
$orderby=ListPrice desc
$top=24&$skip=0  (pagination)
$count=true  (returns total count in @odata.count)
```

### Google Maps

- **API Key env var:** `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (client-side, domain-restricted)
- **APIs enabled:** Maps JavaScript API, Places API, Geocoding API
- **Package:** Use `@vis.gl/react-google-maps` (Google's official React wrapper)

---

## 1. Environment Variables

**File:** `.env.local` (create if not exists, already in .gitignore)

```env
BRIDGE_SERVER_TOKEN=7e1b0b08b0a3fc2f24fc3e1453febfe3
BRIDGE_DATASET=test
BRIDGE_API_BASE=https://api.bridgedataoutput.com/api/v2/OData
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyB8oHVdGsS7Fd4jQFa6jvjibhkCxLav7Wk
```

Also add these to Vercel environment variables (production + preview).

---

## 2. Bridge API Client Library

**File:** `src/lib/bridge.ts`

Create a typed Bridge API client:

```typescript
// Types
export interface BridgeProperty {
  ListingKey: string;
  ListingId: string;
  ListPrice: number;
  StandardStatus: string; // Active, Pending, Closed, etc.
  PropertyType: string;
  PropertySubType: string;
  StreetNumber: string;
  StreetName: string;
  StreetSuffix: string | null;
  UnitNumber: string | null;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  BathroomsFull: number;
  BathroomsHalf: number;
  LivingArea: number;
  LotSizeArea: number | null;
  YearBuilt: number | null;
  PublicRemarks: string | null;
  Latitude: number;
  Longitude: number;
  DaysOnMarket: number | null;
  OriginalListPrice: number | null;
  ListingContractDate: string;
  ClosePrice: number | null;
  CloseDate: string | null;
  AssociationFee: number | null;
  AssociationFeeFrequency: string | null;
  GarageSpaces: number | null;
  BuildingName: string | null;
  WaterfrontYN: boolean;
  PoolPrivateYN: boolean;
  ViewYN: boolean;
  Appliances: string[];
  InteriorFeatures: string[];
  ExteriorFeatures: string[];
  Cooling: string[];
  Heating: string[];
  ParkingFeatures: string[];
  BuildingFeatures: string[];
  ListAgentFullName: string | null;
  ListOfficeName: string | null;
  Media: BridgeMedia[];
}

export interface BridgeMedia {
  MediaURL: string;
  Order: number;
  MimeType: string;
  MediaCategory: string;
  ShortDescription: string | null;
}

export interface BridgeSearchParams {
  status?: "Active" | "Pending" | "Closed" | string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  waterfront?: boolean;
  pool?: boolean;
  city?: string;
  postalCode?: string;
  sort?: string; // OData $orderby value
  page?: number;
  limit?: number;
}

export interface BridgeSearchResult {
  properties: BridgeProperty[];
  totalCount: number;
  nextLink: string | null;
}
```

Implement these functions:
- `searchProperties(params: BridgeSearchParams): Promise<BridgeSearchResult>` — builds OData query from params
- `getProperty(listingKey: string): Promise<BridgeProperty | null>` — single listing by key
- `getRecentListings(limit?: number): Promise<BridgeProperty[]>` — latest active listings
- `getSoldListings(limit?: number): Promise<BridgeProperty[]>` — recently closed
- `getListingPhotos(property: BridgeProperty): BridgeMedia[]` — filters and sorts Media array

Helper: `formatAddress(property: BridgeProperty): string` — combines street parts into display address.

All functions are server-side only. Use `fetch()` with the server token. Cache responses with Next.js `unstable_cache` or `revalidate` options (revalidate every 15 minutes for search, 1 hour for detail pages).

---

## 3. Search API Route

**File:** `src/app/api/search/route.ts`

Accept GET requests with query params matching `BridgeSearchParams`. Translate to OData, call Bridge, return typed results.

Query params:
- `status` (default: "Active")
- `type` (property type)
- `minPrice`, `maxPrice`
- `beds`, `baths`
- `sort` (default: "ListingContractDate desc")
- `page` (default: 1)
- `limit` (default: 24)
- `q` (text search — filter on City, PostalCode, or StreetName contains)

Return:
```json
{
  "properties": [...],
  "totalCount": 1234,
  "page": 1,
  "totalPages": 52
}
```

---

## 4. Update Search Page to Use Live Data

**File:** `src/app/search/page.tsx`

Convert from `MOCK_SEARCH` to real Bridge API data:

- Make the page a server component (or use client-side fetch with SWR/React Query)
- Read URL search params for filters
- Call `/api/search` with those params
- Replace `MOCK_SEARCH` with live results
- Update `SearchPropertyCard` to accept `BridgeProperty` data:
  - Use `Media[0].MediaURL` for the card image
  - Format address from Bridge fields
  - Show actual `DaysOnMarket` for "New — X days ago" badge
  - Show `Media.length` for photo count ("1 of 12")
  - Calculate price/sqft from `ListPrice / LivingArea`
- Update pagination to use real `totalCount`
- Wire filter dropdowns to URL params (update URL → refetch)

### Filter → URL Param Mapping
| Filter | URL Param | Example |
|--------|-----------|---------|
| For Sale/Rent/Sold | `status` | `?status=Active` |
| Price range | `minPrice`, `maxPrice` | `?minPrice=800000&maxPrice=2000000` |
| Beds | `beds` | `?beds=3` |
| Baths | `baths` | `?baths=2` |
| Property Type | `type` | `?type=Residential` |
| Sort | `sort` | `?sort=ListPrice+desc` |
| Page | `page` | `?page=2` |

---

## 5. Property Detail Page

**File:** `src/app/property/[listingKey]/page.tsx`

Dynamic route for individual listings. This is a major new page.

### Layout (match Carroll's property detail):

**Photo Gallery (top):**
- Main large photo + 2 smaller thumbnails in a row (3-photo preview)
- Click to open fullscreen lightbox/carousel
- Photo count badge: "1 of {n}"
- Use `Media` array from Bridge, filtered to `MediaCategory === "Photo"`, sorted by `Order`

**Stats Bar (below gallery):**
- Price (large, bold)
- Price change indicator if `OriginalListPrice !== ListPrice` (show % difference)
- Beds | Baths | Half Bath | Sq.Ft | $/Sq.Ft

**Two-column layout (below stats):**

**Left column (65%):**
- **Description** — `PublicRemarks` (expandable if long)
- **Property Details** — grid of key facts:
  - Property Type, Sub Type
  - Year Built
  - Lot Size
  - Living Area
  - Garage Spaces
  - Association Fee + Frequency
  - Days on Market
- **Features & Amenities** — 3-column bullet grid:
  - Interior Features
  - Exterior Features
  - Appliances
  - Cooling/Heating
  - Parking
  - Building Features (if condo)
- **Location Map** — Google Maps embed centered on `Latitude`/`Longitude` with a marker
- **MLS Compliance** — listing agent name, office, MLS attribution text

**Right column (35%) — Sticky sidebar:**
- Agent contact card:
  - Andrew's headshot + name + LoKation
  - Phone: (305) 455-9744
  - Lead form: First Name, Last Name, Email, Phone
  - Pre-filled message: "I am interested in {address}"
  - Submit button (amber): "Request Information"
- Form POST to `/api/contact` with listing context

**Mobile:** Single column, sidebar becomes bottom section.

### SEO:
- `generateMetadata()` with listing address + price in title
- `RealEstateListing` JSON-LD schema with all available fields
- OpenGraph image from first photo

### Static generation:
- Do NOT use `generateStaticParams` (too many listings)
- Use dynamic rendering with ISR: `export const revalidate = 3600` (1 hour)

---

## 6. Google Maps Components

**Package:** Install `@vis.gl/react-google-maps`

### 6a. PropertyMap Component

**File:** `src/components/PropertyMap.tsx`

Reusable map component for:
- Search page (map view) — shows all results as price markers
- Neighborhood pages — centered on neighborhood with boundary
- Property detail — single marker on the property

Props:
```typescript
interface PropertyMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    price?: number;
    listingKey?: string;
    label?: string;
  }>;
  className?: string;
  interactive?: boolean; // zoom/pan controls
  onClick?: (listingKey: string) => void; // marker click
}
```

Style: Dark mode map theme to match the site aesthetic. Use `mapId` with a styled map, or apply custom JSON styles.

### 6b. Search Page Map View

Update the map view in `src/app/search/page.tsx`:
- Replace the "Interactive Map — coming soon" placeholder
- Show `PropertyMap` with markers for all visible listings
- Price labels on markers (`$1.2M` format)
- Click marker → scroll to listing card OR open detail
- Map auto-pans when results change

### 6c. Neighborhood Pages Map

Update `src/app/neighborhoods/page.tsx` and county pages:
- Replace map placeholder with Google Maps
- Center on the county/region
- Optionally show neighborhood boundaries (future — for now just center + zoom)

### 6d. Property Detail Map

In the property detail page (section 5):
- Small map showing property location
- Single marker at `Latitude`/`Longitude`
- Street-level zoom (~16)

---

## 7. Our Listings Page — Live Data

**File:** `src/app/our-listings/page.tsx`

Replace `MOCK_EXCLUSIVE` with live Bridge API data:
- Call `getRecentListings(24)` server-side
- Display in the same grid layout
- If no results (test data won't have "our" listings), fall back to latest active listings

Also update the homepage `ExclusiveListings` component:
- **File:** `src/components/ExclusiveListings.tsx`
- Fetch latest 8 active listings from Bridge API for the carousel
- Since this is a client component with Swiper, create a server component wrapper that fetches data and passes it as props

---

## 8. Recently Sold Page — Live Data

**File:** `src/app/recent-sales/page.tsx`

Replace `MOCK_SOLD` with live Bridge API data:
- Call `getSoldListings(24)` — filter by `StandardStatus eq 'Closed'`
- Show `ClosePrice` instead of `ListPrice` where available
- Show "SOLD" badge on cards

---

## 9. Homepage Recently Sold Section

Uncomment and wire up the `RecentlySold` component on the homepage:
- **File:** `src/components/RecentlySold.tsx` — update to accept props from server
- **File:** `src/app/page.tsx` — uncomment, wrap with data-fetching server component
- Fetch 8 most recently closed listings

---

## 10. Environment Setup

Create `.env.local`:
```
BRIDGE_SERVER_TOKEN=7e1b0b08b0a3fc2f24fc3e1453febfe3
BRIDGE_DATASET=test
BRIDGE_API_BASE=https://api.bridgedataoutput.com/api/v2/OData
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyB8oHVdGsS7Fd4jQFa6jvjibhkCxLav7Wk
```

Add to `.env.example` (same keys, no values) for documentation.

---

## Order of Operations

1. Install `@vis.gl/react-google-maps`
2. Create `.env.local` and `.env.example`
3. Build `src/lib/bridge.ts` (API client + types)
4. Build `src/app/api/search/route.ts`
5. Build `src/components/PropertyMap.tsx`
6. Build `src/app/property/[listingKey]/page.tsx` (property detail)
7. Update `src/app/search/page.tsx` (live data + real map)
8. Update `src/app/our-listings/page.tsx` (live data)
9. Update `src/app/recent-sales/page.tsx` (live data)
10. Update homepage components (ExclusiveListings + RecentlySold with live data)
11. Update neighborhood page maps
12. Run `npm run build` — fix ALL errors
13. Test: search with filters, property detail, map markers

## Critical Rules
- **ALL Bridge API calls are server-side only** — never expose the server token to the client
- **Phone number:** (305) 455-9744 for all Andrew contact info
- **Email:** Andrew@IamAndrewWhalen.com
- Use `unstable_cache` or `revalidate` for caching — don't hit Bridge on every request
- Google Maps key is `NEXT_PUBLIC_` prefixed (client-side is OK, it's domain-restricted)
- **Test dataset returns mock data** — fake cities, random states. This is expected. Production data will be real South Florida listings.
- Keep `MOCK_SEARCH` and `MOCK_EXCLUSIVE` as fallbacks — if Bridge API fails, gracefully degrade to mock data
- Follow CLAUDE.md design system for all new components
- Mobile-first — all new pages must work at 375px
- Run `npm run build` and fix all errors before done
