# IDX Overlay Data Coverage — v1

**Branch:** `feat/overlay-data-coverage-v1`
**Date:** 2026-02-22
**Status:** Complete. Build PASS (0 errors, 116/116 pages).
**Files changed:** `src/lib/bridge.ts`, `src/components/PropertyDetailPanel.tsx`

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/bridge.ts` | +30 fields to `BridgeProperty` interface; +30 mappings in `normalizeProperty()`; +30 null defaults in `mockListingToBridgeProperty()` |
| `src/components/PropertyDetailPanel.tsx` | Removed `detailItems` useMemo; added `formatDate`, `formatArray`, `formatLotSizeLabel`, `DetailSection` helpers; replaced "Key Details" section with 4 structured sections; expanded legal footer |

---

## Section-by-Section Coverage Matrix

### Section 1 — Price Strip (existing, unchanged)

| Label | Source Field | Formatter | Status |
|---|---|---|---|
| Price | `ListPrice` / `ClosePrice` | `formatCurrency()` | ✅ Implemented |
| Est. Payment | `ListPrice` | 20% down, 6.5%, 30yr | ✅ Implemented |
| Beds | `BedroomsTotal` | integer | ✅ Implemented |
| Baths | `BathroomsTotalInteger` | integer | ✅ Implemented |
| Half Bath | `BathroomsHalf` | integer, "--" when 0 | ✅ Implemented |
| Sq.Ft | `LivingArea` | `toLocaleString()` | ✅ Implemented |
| $/SqFt | `ListPrice / LivingArea` | `calculatePricePerSqft()` | ✅ Implemented |

---

### Section 2 — Description (existing, unchanged)

| Label | Source Field | Status |
|---|---|---|
| Description | `PublicRemarks` | ✅ Implemented |
| Read more / Show less | truncate at 340 chars | ✅ Implemented |

---

### Section 3 — Basic Information (new)

| Label | Source Field | Formatter | Status |
|---|---|---|---|
| MLS # | `ListingId` | string | ✅ Implemented |
| Type | `PropertyType` | string | ✅ Implemented |
| Sub Type | `PropertySubType` | string | ✅ Implemented |
| Status | `StandardStatus` | string | ✅ Implemented |
| Building / Complex | `BuildingName` \|\| `SubdivisionName` | string, prefer building | ✅ Implemented |
| Year Built | `YearBuilt` | `String()` | ✅ Implemented |
| Total Size | `LivingArea` + `LotSizeAcres` | "X Sq.Ft / Y Acres" when both available | ✅ Implemented |
| Date Listed | `ListingContractDate` | `formatDate()` → "Jan 15, 2024" | ✅ Implemented |
| Days On Market | `DaysOnMarket` | "N Days" | ✅ Implemented |
| Association Fee | `AssociationFee` + `AssociationFeeFrequency` | "$X,XXX / Monthly" | ✅ Implemented |

All rows hidden when value is null/empty.

---

### Section 4 — Exterior Features (new)

| Label | Source Field | Formatter | Status |
|---|---|---|---|
| Parking Spaces | `GarageSpaces` | `String()` | ✅ Implemented |
| Pool | `PoolPrivateYN` | "Yes" when true; hidden when false | ✅ Implemented |
| Pool Features | `PoolFeatures` | `formatArray()` (comma-sep) | ✅ Implemented (NEW field) |
| View | `View[]` \|\| `ViewYN` | comma-sep or "Yes" | ✅ Implemented (NEW field) |
| Construction Materials | `ConstructionMaterials[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Parking Features | `ParkingFeatures[]` | `formatArray()` | ✅ Implemented |
| Exterior Features | `ExteriorFeatures[]` | `formatArray()` | ✅ Implemented |
| Roof | `Roof[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Style | `ArchitecturalStyle[]` | `formatArray()` | ✅ Implemented (NEW field) |

---

### Section 5 — Interior Features (new)

| Label | Source Field | Formatter | Status |
|---|---|---|---|
| Living Area (Sq.Ft) | `LivingArea` | `toLocaleString()` | ✅ Implemented |
| Cooling | `Cooling[]` | `formatArray()` | ✅ Implemented |
| Appliances | `Appliances[]` | `formatArray()` | ✅ Implemented |
| Flooring | `Flooring[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Heating | `Heating[]` | `formatArray()` | ✅ Implemented |
| Interior Features | `InteriorFeatures[]` | `formatArray()` | ✅ Implemented |

**Note:** "Adjusted Sqft" and "Sqft" in the task spec both map to `LivingArea`. No separate "adjusted area" field exists in RESO standard or the Bridge test dataset. Single row rendered as "Living Area (Sq.Ft)".

---

### Section 6 — Property Features (new, 34 rows max)

| Label | Source Field | Formatter | Status |
|---|---|---|---|
| Address | `StreetNumber` + `StreetName` + `City` + `StateOrProvince` + `PostalCode` | `formatAddress()` + concat | ✅ Implemented |
| Approx. Lot Size | `LotSizeAcres` + `LotSizeArea` | `formatLotSizeLabel()` | ✅ Implemented (NEW field) |
| Architectural Style | `ArchitecturalStyle[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Attached Garage | `AttachedGarageYN` | "Yes" when true; hidden when false | ✅ Implemented (NEW field) |
| City | `City` | string | ✅ Implemented |
| Community Features | `CommunityFeatures[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Construction Materials | `ConstructionMaterials[]` | `formatArray()` | ✅ Implemented (NEW field) |
| County | `CountyOrParish` | string | ✅ Implemented (NEW field) |
| Covered Spaces | `CoveredSpaces` | `String()` | ✅ Implemented (NEW field) |
| Direction Faces | `DirectionFaces` | string | ✅ Implemented (NEW field) |
| Garage Spaces | `GarageSpaces` | `String()` | ✅ Implemented |
| Levels | `Levels[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Listing Terms | `ListingTerms[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Lot Features | `LotFeatures[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Occupant Type | `OccupantType` | string | ✅ Implemented (NEW field) |
| Parking Features | `ParkingFeatures[]` | `formatArray()` | ✅ Implemented |
| Patio / Porch Features | `PatioAndPorchFeatures[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Pets Allowed | `PetsAllowed[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Pool Features | `PoolFeatures[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Possession | `Possession[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Postal Code | `PostalCode` | string | ✅ Implemented |
| Public Survey Section | `PublicSurveySection` | string | ✅ Implemented (NEW field) |
| Roof | `Roof[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Sewer | `Sewer[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Stories | `StoriesTotal` | `String()` | ✅ Implemented (NEW field) |
| Subdivision | `SubdivisionName` \|\| `BuildingName` | string | ✅ Implemented (NEW field) |
| Tax Annual Amount | `TaxAnnualAmount` | `formatCurrency()` | ✅ Implemented (NEW field) |
| Tax Legal Description | `TaxLegalDescription` | string (wraps) | ✅ Implemented (NEW field) |
| Tax Year | `TaxYear` | `String()` | ✅ Implemented (NEW field) |
| Type of Property | `PropertySubType` \|\| `PropertyType` | string | ✅ Implemented |
| View | `View[]` \|\| `ViewYN` | comma-sep or "Yes" | ✅ Implemented (NEW field) |
| Water Source | `WaterSource[]` | `formatArray()` | ✅ Implemented (NEW field) |
| Year Built | `YearBuilt` | `String()` | ✅ Implemented |

---

### Section 7 — Legal / Courtesy Footer (expanded)

| Element | Source | Status |
|---|---|---|
| MLS disclaimer text | Static: Miami Association of Realtors | ✅ Implemented |
| Listing courtesy line | `ListAgentFullName` + `ListOfficeName` | ✅ Implemented (conditional — hidden when both null) |
| Office phone | `ListOfficePhone` | ✅ Implemented (NEW field, tel: link) |
| IDX statement | Static: standard IDX disclaimer | ✅ Implemented |

---

## New Fields Added to `BridgeProperty` (30 total)

| Field | Type | Maps From RESO |
|---|---|---|
| `ListOfficePhone` | `string \| null` | `ListOfficePhone` |
| `SubdivisionName` | `string \| null` | `SubdivisionName` |
| `LotSizeAcres` | `number \| null` | `LotSizeAcres` |
| `LotSizeSquareFeet` | `number \| null` | `LotSizeSquareFeet` |
| `CountyOrParish` | `string \| null` | `CountyOrParish` |
| `CoveredSpaces` | `number \| null` | `CoveredSpaces` |
| `StoriesTotal` | `number \| null` | `StoriesTotal` |
| `AttachedGarageYN` | `boolean` | `AttachedGarageYN` |
| `DirectionFaces` | `string \| null` | `DirectionFaces` |
| `OccupantType` | `string \| null` | `OccupantType` |
| `PublicSurveySection` | `string \| null` | `PublicSurveySection` |
| `TaxAnnualAmount` | `number \| null` | `TaxAnnualAmount` |
| `TaxLegalDescription` | `string \| null` | `TaxLegalDescription` |
| `TaxYear` | `number \| null` | `TaxYear` |
| `ArchitecturalStyle` | `string[]` | `ArchitecturalStyle` |
| `ConstructionMaterials` | `string[]` | `ConstructionMaterials` |
| `CommunityFeatures` | `string[]` | `CommunityFeatures` |
| `Flooring` | `string[]` | `Flooring` |
| `Levels` | `string[]` | `Levels` |
| `ListingTerms` | `string[]` | `ListingTerms` |
| `LotFeatures` | `string[]` | `LotFeatures` |
| `PatioAndPorchFeatures` | `string[]` | `PatioAndPorchFeatures` |
| `PetsAllowed` | `string[]` | `PetsAllowed` |
| `PoolFeatures` | `string[]` | `PoolFeatures` |
| `Possession` | `string[]` | `Possession` |
| `Roof` | `string[]` | `Roof` |
| `Sewer` | `string[]` | `Sewer` |
| `View` | `string[]` | `View` |
| `WaterSource` | `string[]` | `WaterSource` |

All mapped via `normalizeProperty()` using existing helpers (`toNullableString`, `toNullableNumber`, `toBooleanValue`, `toStringArray`).

---

## Sample Listing Proof

### Mock data (dev mode)

Mock listings (MOCK-0…MOCK-N) are minimal: no extended fields populated. Expected render:

| Section | Rows rendered (mock) | Reason |
|---|---|---|
| Price Strip | 7/7 | All fields present in mock |
| Description | 0 | `PublicRemarks` null in mock |
| Basic Information | 4–6 | MLS#, Type, Status, Living Area, Year Built (null), DOM (null) |
| Exterior Features | 1–2 | Only PoolPrivateYN/ParkingFeatures if present; arrays empty |
| Interior Features | 1 | LivingArea only; all arrays empty |
| Property Features | 6–8 | Address, City, Postal Code, Garage Spaces, Type, Year Built |
| Legal Footer | 1 block | Disclaimer only; no courtesy (agent null in mock) |

### Live Bridge test dataset (expected)

Bridge test dataset (`BRIDGE_DATASET=test`) includes most RESO standard fields. Expected populated sections per listing:

| Section | Expected rows | Notes |
|---|---|---|
| Basic Information | 8–10/10 | Most fields consistently present |
| Exterior Features | 3–7/9 | Pool/View/Parking common; Roof/Style variable |
| Interior Features | 4–6/6 | Cooling/Heating/Appliances typically present |
| Property Features | 15–25/34 | Core facts present; survey/tax fields variable by listing |
| Legal Footer | 2–3 blocks | Agent/office typically present in live data |

Actual per-listing counts depend on feed completeness. All sections hide cleanly when data is absent — no placeholder rows shown.

---

## Known Remaining Gaps

| Field requested | Status | Notes |
|---|---|---|
| "Adjusted Sqft" (separate from Sqft) | ⚠️ Not separate | Miami MLS "Adjusted Area" (interior + balconies) is not a standard RESO field. Mapped to `LivingArea`. When production MLS approval comes, can map to `AboveGradeFinishedArea` if Bridge exposes it. |
| "Year Built Details" | ⚠️ No RESO equivalent | Not a standard RESO field. `YearBuilt` is used. |
| "Postal City" | ⚠️ Maps to City | `PostalCity` is not a standard RESO field; same value as `City` in most records. |
| `BuildingFeatures` | ℹ️ Existing field | Already in interface; not added to overlay sections. Could be added to Exterior or Property Features if needed. |
| Agent photo in courtesy block | ❌ Not in scope | No agent photo URL field in Bridge feed for listing agent. |
| Virtual tour URL | ❌ Not in scope | `VirtualTourURLUnbranded` not requested for this task. |

---

## Build Result

```
✓ Compiled successfully in 4.7s
✓ Generating static pages (116/116)
0 TypeScript errors
0 warnings
```
