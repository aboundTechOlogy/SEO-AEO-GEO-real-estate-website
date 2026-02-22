# TASK: Bridge API IDX Integration — Phase 1 (Live Search)

## Goal
Replace mock listing data on `/search/` with live Bridge API data. Property cards, map pins, and filters should all work with real MLS data from the Bridge OData API.

## Architecture

### API Route: `src/app/api/search/route.ts` (NEW)

Server-side Next.js route that proxies Bridge API requests. This keeps the Bridge server token secret (never exposed to client).

**Request params (all optional query string):**
- `top` — results per page (default 24)
- `skip` — offset for pagination
- `orderby` — sort field (default `ListPrice desc`)
- `minPrice` / `maxPrice` — price range filter
- `beds` — minimum bedrooms
- `baths` — minimum bathrooms
- `status` — `Active`, `Pending`, `Closed` (default `Active`)
- `type` — property type filter
- `swLat`, `swLng`, `neLat`, `neLng` — bounding box (map viewport)

**OData query construction:**
```
Base: https://api.bridgedataoutput.com/api/v2/OData/test/Property
Auth: Bearer ${process.env.BRIDGE_SERVER_TOKEN}
$select: ListingKey,ListPrice,StandardStatus,PropertyType,City,StateOrProvince,PostalCode,
         UnparsedAddress,BedroomsTotal,BathroomsTotalInteger,LivingArea,YearBuilt,
         Latitude,Longitude,Media,DaysOnMarket,OnMarketTimestamp,ClosePrice,CloseDate,
         BuildingName,LotSizeAcres,GarageSpaces,AssociationFee
$count: true
$top: {top}
$skip: {skip}
$orderby: {orderby}
$filter: (built dynamically from params)
```

**Filter construction:**
- Always include: `StandardStatus eq 'Active'` (unless status param overrides)
- Price: `ListPrice ge {minPrice} and ListPrice le {maxPrice}`
- Beds: `BedroomsTotal ge {beds}`
- Baths: `BathroomsTotalInteger ge {baths}`
- Bounding box: `Latitude ge {swLat} and Latitude le {neLat} and Longitude ge {swLng} and Longitude le {neLng}`
- Combine all with ` and `

**Response shape (transform Bridge data to frontend-friendly):**
```typescript
interface SearchResponse {
  listings: Array<{
    id: string;           // ListingKey
    price: number;        // ListPrice
    status: string;       // StandardStatus
    address: string;      // UnparsedAddress
    city: string;
    state: string;
    zip: string;
    beds: number;
    baths: number;
    sqft: number | null;  // LivingArea
    lat: number;          // Latitude
    lng: number;          // Longitude
    photos: Array<{ url: string; order: number }>;  // from Media
    daysOnMarket: number | null;
    listDate: string | null;  // OnMarketTimestamp
    photoCount: number;
    propertyType: string | null;
    yearBuilt: number | null;
    buildingName: string | null;
  }>;
  total: number;          // @odata.count
  hasMore: boolean;       // whether nextLink exists
}
```

**Caching:** Use `next: { revalidate: 300 }` (5 minute ISR cache).

**Error handling:** Return `{ listings: [], total: 0, hasMore: false, error: string }` on failure.

### API Route: `src/app/api/search/markers/route.ts` (NEW)

Lightweight endpoint that returns ONLY coordinates + price + listingKey for map pins. Returns up to 500 results for the current viewport.

**Request params:**
- `swLat`, `swLng`, `neLat`, `neLng` — bounding box (required)
- `minPrice` / `maxPrice` — optional price filter
- Same filter params as main search

**Response shape:**
```typescript
interface MarkersResponse {
  markers: Array<{
    id: string;
    lat: number;
    lng: number;
    price: number;
  }>;
  total: number;
}
```

**OData query:** Same filters but `$select=ListingKey,Latitude,Longitude,ListPrice` and `$top=500`.

### Search Page Updates: `src/app/search/page.tsx`

Convert from static mock data to dynamic API calls.

**State management:**
```typescript
const [listings, setListings] = useState<Listing[]>([]);
const [markers, setMarkers] = useState<Marker[]>([]);
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  status: 'Active',
  minPrice: undefined,
  maxPrice: undefined,
  beds: undefined,
  baths: undefined,
  type: undefined,
  orderby: 'ListPrice desc',
  page: 1,
});
const [mapBounds, setMapBounds] = useState(null);
const [drawBounds, setDrawBounds] = useState(null); // polygon from draw tool
```

**Data fetching:**
- On filter change → fetch `/api/search` with current filters
- On map viewport change → fetch `/api/search/markers` with bounding box
- On draw polygon close → calculate bounding box from polygon vertices → fetch with bounds → client-side filter to exact polygon using point-in-polygon (`@turf/boolean-point-in-polygon`)
- Show loading skeleton while fetching

**Listing card updates:**
- `href` → `/property/{listing.id}/`
- `image` → `listing.photos[0]?.url` (first photo)
- `listDate` → `listing.listDate` (for relative time badge)
- `photoCount` → `listing.photoCount`
- Keep the SearchPropertyCard component UNCHANGED — just pass different props

**Map pin updates:**
- Pass `markers` array to `PropertyMap` component
- Each marker shows price label (already supported by PropertyMap)
- On marker click → scroll to / highlight the listing card

**Pagination:**
- Use `skip` = `(page - 1) * 24`
- Show "Page X of Y" with next/prev buttons
- Total from API response

### Environment Variables (already set in Vercel)
- `BRIDGE_SERVER_TOKEN` — already set as `BRIDGE_SERVER_TOKEN`
- `BRIDGE_API_BASE` — already set as `BRIDGE_API_BASE`
- `BRIDGE_DATASET` — already set as `BRIDGE_DATASET`

### Dependencies to Install
```bash
npm install @turf/boolean-point-in-polygon @turf/helpers swr
```
- `@turf/boolean-point-in-polygon` — for draw tool polygon filtering
- `@turf/helpers` — create Turf.js geometries
- `swr` — client-side data fetching with caching

## Files to Create
- `src/app/api/search/route.ts` — main search API route
- `src/app/api/search/markers/route.ts` — lightweight markers API route
- `src/lib/bridge.ts` — shared Bridge API utility (query builder, auth, types)

## Files to Modify
- `src/app/search/page.tsx` — convert from mock data to live API calls

## DO NOT Touch — CRITICAL
- **`src/components/SearchFilters.tsx` — DO NOT MODIFY**
- **`src/components/SearchPropertyCard.tsx` — DO NOT MODIFY**
- **`src/components/PropertyMap.tsx` — DO NOT MODIFY**
- **`src/components/MapDrawControl.tsx` — DO NOT MODIFY**
- **`src/data/mockListings.ts` — DO NOT DELETE** (keep as fallback)

## Important Notes
- The Bridge API test dataset uses synthetic data (fake addresses like "210 Stracke Pines Trail"). This is expected — we'll switch to real MLS data when approved.
- Photos come from CloudFront CDN: `https://dvvjkgh94f2v6.cloudfront.net/test_data/listings/`
- Add `dvvjkgh94f2v6.cloudfront.net` to `next.config.ts` image domains for `next/image` support
- All API calls go through our server route — NEVER expose the Bridge server token to the client
- The existing SearchPropertyCard accepts `image`, `price`, `address`, `city`, `state`, `zip`, `beds`, `baths`, `sqft`, `status`, `href`, `listDate`, `photoCount` — map Bridge response fields to these props
- For the "24 Properties" count text in the search page, use the API `total` value

## Test
- `npm run build` must pass with zero errors
- `/search/` should load and display live Bridge API listings
- Filter dropdowns should trigger new API calls
- Map should show price pins for listings in the viewport
- Clicking a listing card should navigate to `/property/{listingKey}/`
- Draw tool polygon should filter results to listings within the drawn area
