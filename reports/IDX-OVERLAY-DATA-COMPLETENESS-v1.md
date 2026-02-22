# IDX Overlay Data Completeness — v1

**Branch:** `feat/overlay-data-completeness-v1`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/components/PropertyDetailPanel.tsx`, `src/lib/bridge.ts`

---

## Summary

Expanded the search overlay (PropertyDetailPanel) from a single "Key Details" section (8 static rows with `-` placeholders) into 7 data-driven sections that hide entirely when no data exists.

---

## Files Changed

| File | Lines | Change |
|---|---|---|
| `src/lib/bridge.ts` | +84 | Added 29 fields to `BridgeProperty` interface, `normalizeProperty()`, and `mockListingToBridgeProperty()` |
| `src/components/PropertyDetailPanel.tsx` | +146/−24 | Replaced static `detailItems` with `collectRows` pattern + 7 sections; added `DetailSection` component; added Legal/Courtesy block |

---

## Overlay Section Coverage

### 1) Price Strip
**Status:** Already implemented (no changes)

| Field | Source | Rendered |
|---|---|---|
| Price | ListPrice / ClosePrice | Yes |
| Est. Payment | Calculated (6.5% / 30yr / 20% down) | Yes |
| Beds | BedroomsTotal | Yes |
| Baths | BathroomsTotalInteger | Yes |
| Half Bath | BathroomsHalf (desktop only) | Yes |
| Sq.Ft | LivingArea | Yes |
| $/SqFt | Calculated | Yes |

### 2) Description
**Status:** Already implemented (no changes)

| Field | Source | Rendered |
|---|---|---|
| PublicRemarks | PublicRemarks | Yes (truncated at 340 chars + "Read more") |

### 3) Basic Information
**Status:** NEW — expanded from 8 rows to up to 22 rows (only non-empty shown)

| Label | BridgeProperty Field | Format |
|---|---|---|
| Property Type | PropertyType | String |
| Sub Type | PropertySubType | String |
| Status | StandardStatus | String |
| Year Built | YearBuilt | Number |
| Living Area | LivingArea | N,NNN Sq.Ft |
| Lot Size | LotSizeSquareFeet / LotSizeArea | N,NNN Sq.Ft |
| Lot Acres | LotSizeAcres | N.NN Acres |
| Stories | StoriesTotal | Number |
| Subdivision | SubdivisionName | String |
| Building | BuildingName | String |
| County | CountyOrParish | String |
| Architectural Style | ArchitecturalStyle[] | Comma-separated |
| Construction | ConstructionMaterials[] | Comma-separated |
| Garage Spaces | GarageSpaces | Number |
| Attached Garage | AttachedGarageYN | "Yes" or hidden |
| Covered Spaces | CoveredSpaces | Number |
| Days on Market | DaysOnMarket | Number |
| List Date | ListingContractDate | MMM D, YYYY |
| Original List Price | OriginalListPrice | $N,NNN |
| Close Date | CloseDate | MMM D, YYYY |
| Close Price | ClosePrice | $N,NNN |
| Association Fee | AssociationFee + Frequency | $N,NNN / Monthly |
| Direction Faces | DirectionFaces | String |

### 4) Exterior Features
**Status:** NEW

| Label | BridgeProperty Field | Format |
|---|---|---|
| Exterior Features | ExteriorFeatures[] | Comma-separated |
| Roof | Roof[] | Comma-separated |
| Pool Features | PoolFeatures[] | Comma-separated |
| Pool | PoolPrivateYN | "Private Pool" or hidden |
| Patio / Porch | PatioAndPorchFeatures[] | Comma-separated |
| Lot Features | LotFeatures[] | Comma-separated |
| View | View[] | Comma-separated |
| Waterfront | WaterfrontYN | "Yes" or hidden |
| Water Source | WaterSource[] | Comma-separated |
| Sewer | Sewer[] | Comma-separated |

### 5) Interior Features
**Status:** NEW

| Label | BridgeProperty Field | Format |
|---|---|---|
| Interior Features | InteriorFeatures[] | Comma-separated |
| Appliances | Appliances[] | Comma-separated |
| Flooring | Flooring[] | Comma-separated |
| Cooling | Cooling[] | Comma-separated |
| Heating | Heating[] | Comma-separated |
| Levels | Levels[] | Comma-separated |

### 6) Property Features
**Status:** NEW

| Label | BridgeProperty Field | Format |
|---|---|---|
| Parking | ParkingFeatures[] | Comma-separated |
| Building Features | BuildingFeatures[] | Comma-separated |
| Community Features | CommunityFeatures[] | Comma-separated |
| Pets Allowed | PetsAllowed[] | Comma-separated |
| Listing Terms | ListingTerms[] | Comma-separated |
| Possession | Possession[] | Comma-separated |
| Occupant Type | OccupantType | String |

### 7) Tax Information
**Status:** NEW (only shown when tax data exists)

| Label | BridgeProperty Field | Format |
|---|---|---|
| Tax Annual Amount | TaxAnnualAmount | $N,NNN |
| Tax Year | TaxYear | Number |
| Tax Legal Description | TaxLegalDescription | String |

### 8) Legal / Courtesy Block
**Status:** NEW — dynamic agent/office/phone line above static MLS disclaimer

| Field | Source | Rendered |
|---|---|---|
| Agent Name | ListAgentFullName | "Courtesy of {name}" |
| Office Name | ListOfficeName | ", {office}" |
| Office Phone | ListOfficePhone | "({phone})" |
| MLS Disclaimer | Hardcoded | Always shown |

---

## New BridgeProperty Fields (29 added)

| Field | Type | Used In |
|---|---|---|
| ListOfficePhone | string \| null | Legal/Courtesy |
| SubdivisionName | string \| null | Basic Information |
| LotSizeAcres | number \| null | Basic Information |
| LotSizeSquareFeet | number \| null | Basic Information |
| CountyOrParish | string \| null | Basic Information |
| CoveredSpaces | number \| null | Basic Information |
| StoriesTotal | number \| null | Basic Information |
| AttachedGarageYN | boolean | Basic Information |
| DirectionFaces | string \| null | Basic Information |
| OccupantType | string \| null | Property Features |
| TaxAnnualAmount | number \| null | Tax Information |
| TaxLegalDescription | string \| null | Tax Information |
| TaxYear | number \| null | Tax Information |
| ArchitecturalStyle | string[] | Basic Information |
| ConstructionMaterials | string[] | Basic Information |
| CommunityFeatures | string[] | Property Features |
| Flooring | string[] | Interior Features |
| Levels | string[] | Interior Features |
| ListingTerms | string[] | Property Features |
| LotFeatures | string[] | Exterior Features |
| PatioAndPorchFeatures | string[] | Exterior Features |
| PetsAllowed | string[] | Property Features |
| PoolFeatures | string[] | Exterior Features |
| Possession | string[] | Property Features |
| Roof | string[] | Exterior Features |
| Sewer | string[] | Exterior Features |
| View | string[] | Exterior Features |
| WaterSource | string[] | Exterior Features |

---

## Implementation Pattern

- `collectRows()` filters out null/empty values — sections with zero rows are hidden entirely
- `fmtArr()` joins string arrays with commas
- `fmtSqft()` / `fmtAcres()` / `fmtDate()` format with locale
- `DetailSection` component renders a titled grid of `DetailRow` items
- No fake placeholders — if data doesn't exist, the row is omitted

---

## Known Gaps

| Gap | Reason |
|---|---|
| Some fields may be empty in Bridge test dataset | Test dataset has limited data coverage; production will have more |
| No `VirtualTourURLUnbranded` field | Not in current BridgeProperty — can add later |
| No room dimensions / floor plan | Not available in standard RESO fields from Bridge |
| `getProperty()` fetches full record (no `$select`) | Already correct — returns all available fields |
| `IDX_SELECT_FIELDS` not expanded | Intentional — search cards don't need overlay-detail fields |

---

## Build Result

```
✓ Compiled successfully in 10.0s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
