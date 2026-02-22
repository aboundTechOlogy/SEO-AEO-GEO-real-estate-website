# No-Mock Fallback in Production — v1

**Branch:** `hotfix/no-mock-fallback-prod`
**Date:** 2026-02-22
**Status:** Complete. Build PASS. Proof PASS (6/6).
**Files changed:** `src/lib/bridge.ts` only. `route.ts` required no changes.

---

## Problem

`bridge.ts` had 6 silent mock fallback sites. On any Bridge API failure, the production site would silently return fake listing data (`MOCK-*` records) to the client with no way to distinguish real from synthetic. Critical impact on the overlay/detail path:

```
Bridge fails
  ↓
fetchIdxSearch catch → buildMockIdxSearchResponse() → MOCK-0…MOCK-N IDs in results
  ↓
User clicks card → getProperty("MOCK-0")
  ↓
getMockPropertyByListingKey → fake BridgeProperty { ListPrice: $1.2M, beds: 3, ... }
  ↓
PropertyDetailPanel renders fake stats as real listing data  ← BUG
```

---

## Fix

Single constant added at top of `bridge.ts`:

```typescript
const IS_DEV = process.env.NODE_ENV !== "production";
```

All 6 fallback sites gated behind `if (IS_DEV)`:

| Function | Old catch behavior | New prod catch behavior |
|---|---|---|
| `fetchIdxSearch` | `buildMockIdxSearchResponse()` + error string | `{ listings: [], total: 0, hasMore: false, error: "Listing data temporarily unavailable." }` |
| `fetchIdxMarkers` | `buildMockIdxMarkersResponse()` + error string | `{ markers: [], total: 0, error: "Map data temporarily unavailable." }` |
| `searchProperties` | `getMockSearchResult()` silently | `{ properties: [], totalCount: 0, nextLink: null }` |
| `getRecentListings` | `MOCK_EXCLUSIVE` silently | `[]` |
| `getSoldListings` | `MOCK_SOLD` silently | `[]` |
| `getProperty` | `getMockPropertyByListingKey()` always ran | Guard wrapped in `if (IS_DEV)` — returns `null` in prod, overlay shows "Property not found" |

Dev/local: behavior unchanged — mock data still returned on failure to allow local development without Bridge credentials.

---

## Overlay/Detail Path After Fix

```
Bridge fails (prod)
  ↓
fetchIdxSearch catch → { listings: [], total: 0, error: "..." } — no MOCK-* IDs
  ↓
Search grid shows 0 results + amber error banner
  ↓
User cannot click a MOCK-* listing → overlay never opens with fake stats  ✓

Direct URL /property/REAL-ID/ when Bridge down:
  ↓
getProperty catch → null (unchanged, always was null)
  ↓
PropertyDetailPanel renders "Property not found" panel  ✓

Direct URL /property/MOCK-0/ in prod:
  ↓
getMockPropertyByListingKey guard skipped (IS_DEV = false)
  ↓
Bridge called with "MOCK-0" filter → returns empty → null
  ↓
PropertyDetailPanel renders "Property not found" panel  ✓
```

---

## Build

```
✓ Compiled successfully in 8.2s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```

---

## Forced-Failure Proof

Script: `scripts/test-no-mock-prod.mjs`

```
NODE_ENV=production node scripts/test-no-mock-prod.mjs
```

Output:
```
NODE_ENV = "production"
IS_DEV   = false

── fetchIdxSearch on Bridge failure ──────────────────────────────
  ✓ PASS  OLD: returns mock listings (MOCK-* IDs) even in production [EXPECTED BUG]
  ✓ PASS  NEW (prod): returns empty listings — no mock IDs
  ✓ PASS  NEW (prod): returns error string instead of fake data
  ✓ PASS  NEW (prod): total is 0 — no fake count inflating UI

── getProperty MOCK-* key guard ──────────────────────────────────
  ✓ PASS  OLD: getProperty('MOCK-0') returns fake property in all envs [EXPECTED BUG]
  ✓ PASS  NEW (prod): getProperty('MOCK-0') returns null — overlay shows 'not found' instead of fake stats

── Results ────────────────────────────────────────────────────────
  6 passed, 0 failed
```

Dev mode still works:
```
NODE_ENV=development node scripts/test-no-mock-prod.mjs
→ 4 passed, 0 failed  (mock data still returned in dev)
```

---

## What Was NOT Changed

- `src/app/api/search/route.ts` — no changes needed; it passes `fetchIdxSearch` result as-is
- `src/components/PropertyDetailPanel.tsx` — not in scope; "Property not found" panel already renders correctly on `null`
- All search UI controls/layout — untouched per task scope
- Mock data construction functions (`buildMockIdxSearchResponse`, `filterIdxMockListings`, etc.) — kept intact for dev use
