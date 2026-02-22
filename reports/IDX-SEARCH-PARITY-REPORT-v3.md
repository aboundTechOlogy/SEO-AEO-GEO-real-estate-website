# IDX Search Parity Report — v3

**Branch:** `fix/search-controls-p0-closure`
**Date:** 2026-02-22
**Status:** All P0 items resolved. Build: PASS (0 errors).

---

## Triage Summary

| Control | Before | After |
|---|---|---|
| Address Input | Uncontrolled, decorative, no API wiring | Controlled, city suggestions, Enter/select commits, clear X, wired to Bridge `q` param |
| For Sale dropdown | PASS | PASS |
| Price filter | PASS | PASS |
| Bed/Bath min | PASS | PASS |
| Bed/Bath max | Local state only, never sent to API | Wired end-to-end via MoreFilter Rooms accordion → `maxBeds`/`maxBaths` Bridge params |
| Any Type / hidePending | Types wired, hidePending local-only | Both wired; hidePending now in `SearchFilterValues` → `StandardStatus ne 'Pending'` |
| More filter (all 8 sub-filters) | 100% local-only state, zero API output | Fully controlled; all 8 sub-filters write to shared `filterValues` → API params |
| Save Search | No onClick, no behavior | localStorage save + 2.5s toast feedback |
| Grid/Map/List | PASS | PASS |
| Sort options | 4 misleading duplicates ("Modified Listings", "Just Reduced", "Highest/Lowest Price/Sq.Ft") | Removed. Clean 5-option list with accurate `orderby` values |
| URL persistence | Only `#view` hash survived refresh | All filter state + status + sort + page + view persisted to query string; hydrated on mount |

---

## P0 Fixes — Detail

### 1. Address Input → `q` param

**Before:** `<input type="text" placeholder="Search...">` — uncontrolled, no `value`/`onChange`, no API wiring.

**After:**
- New `AddressSearchInput` component (`SearchFilters.tsx`)
- Controlled via `filterValues.addressQuery` / `onFilterChange({ addressQuery: v })`
- 35 South Florida city suggestions, zip code detection (`/^\d{3,5}$/`)
- Keyboard nav: ArrowUp/Down/Enter/Escape
- Clear X button
- `onChange` fires only on Enter or suggestion click (not every keystroke)
- `page.tsx` `searchKey`: `if (filterValues.addressQuery) params.set("q", filterValues.addressQuery)`
- `route.ts`: `const q = search.get("q") || undefined`
- `bridge.ts` filter: `contains(tolower(UnparsedAddress), '${q}') or contains(tolower(City), '${q}') or contains(tolower(PostalCode), '${q}')`

---

### 2. Bed/Bath Max → `maxBeds` / `maxBaths` params

**Before:** `bedMax`/`bathMax` existed in local state inside `BedBathFilter` but were never lifted to parent or sent to API.

**After:**
- `bedMax`/`bathMax` added to `SearchFilterValues` interface and `DEFAULT_FILTER_VALUES`
- Moved to MoreFilter "Rooms" accordion (cleaner UX — min in filter bar, range in More)
- `page.tsx` `searchKey`: `if (filterValues.bedMax) params.set("maxBeds", filterValues.bedMax)`
- `route.ts`: `const maxBeds = parseNumber(search.get("maxBeds"))`
- `bridge.ts` filter: `BedroomsTotal le ${params.maxBeds}` / `BathroomsTotalInteger le ${params.maxBaths}`

---

### 3. hidePending → `StandardStatus ne 'Pending'`

**Before:** `hidePending` toggled inside `PropertyTypeFilter` local state; never reached API.

**After:**
- Added to `SearchFilterValues` + `DEFAULT_FILTER_VALUES`
- `PropertyTypeFilter` now accepts `hidePending` / `onHidePendingChange` props (fully controlled)
- MoreFilter "Property Type" accordion also exposes "Hide Pending / Contingent" checkbox
- `page.tsx` `searchKey`: `if (filterValues.hidePending) params.set("hidePending", "true")`
- `route.ts`: `const hidePending = search.get("hidePending") === "true"`
- `bridge.ts` filter: `StandardStatus ne 'Pending'`

---

### 4. MoreFilter — all 8 sub-filters wired

**Before:** `MoreFilter` had 100% local state. Opening/closing the panel reset all selections. Nothing was sent to the API.

**After:** Fully controlled component:

```
filterValues: SearchFilterValues  ← all state lives in page.tsx
onFilterChange: (partial) => void  ← writes back to page.tsx
```

| Sub-filter | Param name | Bridge field |
|---|---|---|
| Keyword Search | `keyword` | `PublicRemarks`, `BuildingName` |
| Property Search (address) | `q` | `UnparsedAddress`, `City`, `PostalCode` |
| Rooms (bed/bath min+max) | `beds`, `baths`, `maxBeds`, `maxBaths` | `BedroomsTotal`, `BathroomsTotalInteger` |
| Property Type + hidePending | `types`, `hidePending` | `PropertyType`, `StandardStatus` |
| Garage Spaces | `minGarage` | `GarageSpaces ge N` |
| Living Size | `minSqft`, `maxSqft` | `LivingArea ge/le N` |
| Waterfront | `waterfront` | `WaterfrontYN eq true` |
| Features | `features` | `PoolPrivateYN eq true` + keyword fallback |
| Days On Market | `maxDom` | `DaysOnMarket le N` |

- "Clear All" footer button resets all `filterValues` fields + status
- Footer "View N Properties" shows live `totalCount` from API

---

### 5. Save Search → localStorage + toast

**Before:** "Save Search" button rendered in `DesktopSearchBar` with no `onClick`.

**After:**
- `handleSaveSearch()` in `page.tsx`
- Serializes `{ label, url, filterValues, status, sortLabel, savedAt }` to `localStorage["savedSearches"]` (capped at 20 entries)
- 2.5s toast via `saveToast` state passed as `saveMessage` prop to `DesktopSearchBar`
- Toast renders as floating pill below the button

---

### 6. Sort Options — 4 misleading entries removed

**Before:**
```
{ label: "Modified Listings", orderby: "OnMarketTimestamp desc" }  // duplicate of Newest
{ label: "Just Reduced",      orderby: "ListPrice desc" }           // no Bridge field, same as Highest Price
{ label: "Highest Price/Sq.Ft", orderby: "ListPrice desc" }         // no $/sqft field, same as Highest Price
{ label: "Lowest Price/Sq.Ft",  orderby: "ListPrice asc" }          // same as Lowest Price
```

**After (5 clean options):**
```
{ label: "Newest Listings", orderby: "OnMarketTimestamp desc" }
{ label: "Highest Price",   orderby: "ListPrice desc" }
{ label: "Lowest Price",    orderby: "ListPrice asc" }
{ label: "Highest Sq.Ft",   orderby: "LivingArea desc" }
{ label: "Lowest Sq.Ft",    orderby: "LivingArea asc" }
```

---

### 7. URL Persistence — full round-trip

**Before:** Only `#view` hash was persisted. All filter state lost on refresh.

**After:**

**Serialize (write):** `buildSearchUrl()` helper writes all active filters as query params:
```
/search?beds=2&baths=1&minPrice=500000&types=Condominiums&status=For+Sale&q=Miami#grid
```

**Hydrate (read):** `hydrateFromUrl()` runs on mount, parses all params, sets state. Guarded by `hydrated` state to prevent sync-write loop on first render.

**Params persisted:**
`minPrice`, `maxPrice`, `beds`, `baths`, `maxBeds`, `maxBaths`, `types`, `q`, `keyword`, `garage`, `maxDom`, `waterfront`, `features`, `hidePending`, `minSqft`, `maxSqft`, `status`, `sort`, `page`, `#view`

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/bridge.ts` | Added 11 new fields to `BridgeIdxSearchParams`; added OData filter clauses; updated mock fallback |
| `src/app/api/search/route.ts` | Full rewrite — parses all new params with `parseDomMax()`, `parseGarage()`, feature-to-boolean mapping |
| `src/components/SearchFilters.tsx` | Full rewrite — new `SearchFilterValues` type, `AddressSearchInput`, controlled `MoreFilter`, new props for `DesktopSearchBar`/`MobileSearchBar` |
| `src/app/search/page.tsx` | Updated `searchKey` useMemo (11 new params); fixed `SORT_OPTIONS` (removed 4); added URL hydration/sync; added `handleSaveSearch`; updated call sites |

## Build

```
✓ Compiled successfully in 4.0s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
