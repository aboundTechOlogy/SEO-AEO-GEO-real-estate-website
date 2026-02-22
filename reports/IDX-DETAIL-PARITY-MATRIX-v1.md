# IDX Detail Parity Matrix v1

Date: 2026-02-22
Branch: `fix/idx-detail-parity-v2`
PRD: `reference/PRD-IDX-DETAIL-PARITY-SECTION-LOCK-v1.md`

## Acceptance Matrix

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Section order matches Chad contract exactly | PASS | Overlay and canonical both render: Description -> Basic Information -> Amenities (conditional) -> Exterior Features -> Interior Features -> Property Features -> Location -> Similar Properties For Sale -> Legal/Courtesy. |
| 2 | Basic Information label set + icon mapping parity | PASS | Shared label set in `buildIdxDetailSections()`; icon mapping in both surfaces uses `MLS # -> search`, `Type -> home`, `Status -> info`, `Subdivision/Complex -> department`, `Year Built -> tool`, `Price Range -> dollar`, `Total Size -> ruler`, `Date Closed -> calendar`, `Date Listed -> calendar`, `Days On Market -> time`, `Community Name -> county`. |
| 3 | Amenities section exists in proper position | PASS | `AmenitiesSection` rendered immediately after Basic Information in both overlay and canonical; hidden when amenities list is empty. |
| 4 | Exterior/Interior/Property features label sets parity | PASS | Shared section builder in `src/lib/property-utils.ts` provides one label contract for both surfaces. |
| 5 | No standalone Tax section if not Chad-parity | PASS | `Tax Information` standalone block removed; tax fields are now grouped under Property Features labels (`Tax Amount`, `Tax Legal desc`, `Tax Year`). |
| 6 | No “View Full Details” bar in wrong location | PASS | Overlay “View Full Details” bar removed from in-panel flow. |
| 7 | Map tab behavior correct (in-panel) | PASS | Overlay `MAP VIEW` tab now sets in-panel media state and renders embedded map pane; no offsite redirect for tab action. |
| 8 | Sticky right rail persists through bottom sections | PASS | Map, Similar, and Legal blocks moved inside left column of the same two-column grid so sticky inquiry rail stays active through bottom content range. |
| 9 | Similar properties + legal placement parity | PASS | Both surfaces use `Similar Properties For Sale` followed by legal/courtesy block at bottom of detail flow. |
| 10 | Overlay/canonical output parity (same row groupings) | PASS | Both surfaces consume `buildIdxDetailSections()` + `buildIdxLegalDisclosure()` from `src/lib/property-utils.ts`. |
| 11 | Build passes (`npm run build`) | PASS | Build completed successfully with Next.js production build + type check. |

## Explicit Rendered Labels By Section

### Basic Information
- MLS #
- Type
- Status
- Subdivision/Complex
- Year Built
- Price Range
- Total Size
- Date Closed
- Date Listed
- Days On Market
- Community Name

### Amenities
- Amenities values rendered as list items from shared amenities array (conditional hide when none).

### Exterior Features
- Waterfront
- Parking Spaces
- Pool
- View
- Construction Type
- Waterfront Description
- Parking Description
- Exterior Features
- Roof Description
- Style

### Interior Features
- Adjusted Sqft
- Cooling Description
- Equipment Appliances
- Floor Description
- Heating Description
- Interior Features
- Sqft

### Property Features
- Address
- Aprox. Lot Size
- Architectural Style
- Association Fee Frequency
- Attached Garage
- City
- Community Features
- Construction Materials
- County
- Covered Spaces
- Direction Faces
- Frontage Length
- Furnished Info
- Garage
- Levels
- Listing Terms
- Lot Features
- Occupant Type
- Parking Features
- Patio And Porch Features
- Pets Allowed
- Pool Features
- Possession
- Postal City
- Public Survey Section
- Public Survey Township
- Roof
- Sewer Description
- Short Sale
- Stories
- HOA Fees
- Subdivision Complex
- Subdivision Info
- Tax Amount
- Tax Legal desc
- Tax Year
- Terms Considered
- Type of Property
- View
- Water Source
- Window Features
- Year Built Details
- Waterfront Description

## Overlay vs Canonical Section Diff

### Section order arrays
- Overlay: `[Description, Basic Information, Amenities, Exterior Features, Interior Features, Property Features, Location, Similar Properties For Sale, Legal/Courtesy]`
- Canonical: `[Description, Basic Information, Amenities, Exterior Features, Interior Features, Property Features, Location, Similar Properties For Sale, Legal/Courtesy]`

### Diff result
- Added in overlay: `[]`
- Added in canonical: `[]`
- Reordered sections: `0`
- Grouping diffs: `0`
