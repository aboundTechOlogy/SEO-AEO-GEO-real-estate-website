# IDX Search Actions + Sold Sub-Filters Fix — v1

**Branch:** `fix/search-card-actions-and-sold-subfilters`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/components/SearchPropertyCard.tsx`, `src/components/SearchFilters.tsx`, `src/app/search/page.tsx`, `src/app/api/search/route.ts`, `src/lib/bridge.ts`

---

## Fix A — Card Actions (Share + Heart)

### Problem

Both buttons in `SearchPropertyCard` called `e.preventDefault()` with no functionality:

```typescript
<button onClick={(e) => e.preventDefault()}>Share</button>
<button onClick={(e) => e.preventDefault()}>Heart</button>
```

### Fix

**Share button:**
- `navigator.share` if available (native mobile share sheet)
- Clipboard fallback: `navigator.clipboard.writeText(url)` with `window.location.origin + href`
- Visual feedback: icon swaps to green checkmark for 2 seconds after copy
- `e.stopPropagation()` prevents Link navigation on click

**Heart button:**
- Added `listingKey?: string` prop (passed as `listing.id` from `page.tsx`)
- `localStorage` key `savedListings` stores `string[]` of saved listing IDs
- On mount: `useEffect` hydrates `isSaved` from localStorage
- On click: toggles `isSaved` state + updates localStorage
- Visual state: filled rose heart when saved, outline gray heart when not

```typescript
// Saved state persists across page reloads via localStorage
const SAVED_KEY = "savedListings";
function getSavedSet(): Set<string> { ... }
function saveSet(set: Set<string>) { ... }
```

**No new dependencies** — uses only native browser APIs.

---

## Fix B — Sold Time-Range Sub-Options

### Problem

When users selected "Sold" in the ForSaleFilter dropdown, no time-range sub-options appeared. The API call sent `StandardStatus eq 'Closed'` with no date filter — returning all sold records regardless of age.

### Fix

**8 time-range options added:**

| Label | Value (days) | OData filter |
|---|---|---|
| Last 1 Week | `"7"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 1 Month | `"30"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 3 Months | `"90"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 6 Months | `"180"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 1 Year | `"365"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 2 Years | `"730"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 3 Years | `"1095"` | `CloseDate ge 'YYYY-MM-DD'` |
| Last 5 Years | `"1825"` | `CloseDate ge 'YYYY-MM-DD'` |

### Data flow

```
User selects "Sold" + "Last 1 Month"
  ↓
filterValues.soldRange = "30"
  ↓
searchKey: params.set("soldRange", "30")
  ↓
/api/search?status=Closed&soldRange=30
  ↓
route.ts parseSoldRange("30") → "YYYY-MM-DD" (today − 30 days)
  ↓
fetchIdxSearch({ status: "Closed", minCloseDate: "YYYY-MM-DD" })
  ↓
bridge.ts buildIdxFilters() → "CloseDate ge 2026-01-23"
  ↓
Bridge OData: StandardStatus eq 'Closed' and CloseDate ge 2026-01-23
```

### Reset behavior

- Switching away from "Sold" (to "For Sale" or "For Rent") clears `soldRange` to `""`
- ForSaleFilter panel "Reset" button appears when Sold is selected → clears soldRange
- `DEFAULT_FILTER_VALUES.soldRange = ""` — global Reset clears it

### URL persistence

- `soldRange` serialized to URL param only when status is Sold and value is non-empty
- Hydrated on page load via `hydrateFromUrl()`

---

## Files Changed

| File | Change |
|---|---|
| `src/components/SearchPropertyCard.tsx` | +`listingKey` prop; +`useState` for `isSaved`/`shareLabel`; +`handleShare`/`handleSave` functions; +localStorage helpers; visual heart/share state in JSX |
| `src/components/SearchFilters.tsx` | +`soldRange` field to `SearchFilterValues` + `DEFAULT_FILTER_VALUES`; +`SOLD_RANGE_OPTIONS` constant; `ForSaleFilter`: +`soldRange`/`onSoldRangeChange` props + sub-option UI; `MoreFilter`: +same props + sub-options in Property Search accordion; `DesktopSearchBar`/`MobileSearchBar`: pass props through, clear `soldRange` on status change |
| `src/app/search/page.tsx` | +`listingKey={listing.id}` on `SearchPropertyCard`; +`soldRange` in `buildSearchUrl`, `hydrateFromUrl`, `searchKey` useMemo |
| `src/app/api/search/route.ts` | +`parseSoldRange()` helper; +`minCloseDate` parsed from `soldRange` param; passed to `fetchIdxSearch` |
| `src/lib/bridge.ts` | +`minCloseDate?: string` to `BridgeIdxSearchParams`; +`CloseDate ge` OData filter in `buildIdxFilters()` |

---

## Build Result

```
✓ Compiled successfully in 4.2s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
