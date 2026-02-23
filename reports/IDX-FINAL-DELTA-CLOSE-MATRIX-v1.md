# IDX Final Delta-Close Matrix v1

Date: 2026-02-23  
Branch: `fix/idx-final-delta-close-v1`

## Requirement Matrix (1..18)

| # | Requirement | Status | Evidence (file:line) | Before -> After |
|---|---|---|---|---|
| 1 | Favorites icon parity (heart icon in all search views, consistent style/state) | PASS | `src/components/SearchPropertyCard.tsx:193`, `src/app/search/page.tsx:383`, `src/app/search/page.tsx:989` | Star/mixed favorite affordances -> single `IconLove` heart used in grid/map/table/mobile with active/inactive state. |
| 2 | Favorites click toggles save/unsave and does not open listing | PASS | `src/components/SearchPropertyCard.tsx:109`, `src/app/search/page.tsx:339`, `src/app/search/page.tsx:983` | Favorite click could bubble to card/row open -> click handlers now call `preventDefault` + `stopPropagation` and only toggle save. |
| 3 | Remove duplicate address rendering (one address only per listing) | PASS | `src/app/search/page.tsx:996`, `src/app/search/page.tsx:1017` | Address duplicated in subdivision column -> subdivision column now uses `buildingName` only, address remains single-render in Address column. |
| 4 | Mobile/tablet top control parity (dropdown view control + max address width) | PASS | `src/components/SearchFilters.tsx:155`, `src/components/SearchFilters.tsx:1769`, `src/components/SearchFilters.tsx:1776` | Segmented mobile view selector + constrained address width -> dropdown view control and full-width-capable address input. |
| 5 | Filters/More parity (remove extra Filters chip; More placement by breakpoint) | PASS | `src/components/SearchFilters.tsx:1695`, `src/components/SearchFilters.tsx:1817` | Wrong extra Filters chip in top row -> desktop uses More filter control; mobile uses More entrypoint in chip row/sheet flow. |
| 6 | Grid image area height parity on mobile/grid | PASS | `src/components/SearchPropertyCard.tsx:145` | Shorter card image ratio -> taller mobile ratio (`aspect-[4/3]`) with desktop ratio retained (`md:aspect-[16/9]`). |
| 7 | Grid columns parity (3-column at reported desktop viewport, not forced 4) | PASS | `src/app/search/page.tsx:311`, `src/app/search/page.tsx:806` | 4-column desktop behavior at wider breakpoints -> capped to `xl:grid-cols-3`. |
| 8 | Save Search alignment parity | PASS | `src/components/SearchFilters.tsx:1709`, `src/components/SearchFilters.tsx:1711`, `src/app/search/page.tsx:768` | Save Search placement diverged and floating pattern was used -> desktop Save Search aligned in right action group, floating control removed from search page flow. |
| 9 | Overlay + canonical are parity siblings (same structure/order/presentation behavior) | PASS | `src/components/PropertyDetailPanel.tsx:1013`, `src/app/property/[listingKey]/page.tsx:228`, `src/components/PropertyDetailPanel.tsx:244`, `src/app/property/[listingKey]/page.tsx:192` | Overlay/canonical used different section component stacks -> both now consume shared section and media-tab components in matching order. |
| 10 | Section title bars use gray strip styling | PASS | `src/components/PropertyDetailPanel.tsx:59`, `src/components/PropertyDetailPanel.tsx:998`, `src/app/property/[listingKey]/page.tsx:220` | Plain headings/non-strip treatment -> gray strip title bars across sections (`bg-[#f5f5f5]` with border). |
| 11 | Section content style parity (list/bullet style, not boxed rows) | PASS | `src/components/PropertyDetailPanel.tsx:67`, `src/components/PropertyDetailPanel.tsx:93`, `src/components/PropertyDetailPanel.tsx:111` | Boxed/card-like feature blocks -> list rows and bullet list presentation for detail content/amenities. |
| 12 | Basic info icon fidelity/size/weight parity | PASS | `src/components/PropertyDetailPanel.tsx:567`, `src/components/PropertyDetailPanel.tsx:1013` | Approximate icon mapping -> explicit label-to-icon map with shared icon sizing (`w-full h-full` in 16px container). |
| 13 | Sticky inquiry panel persists through full content range | PASS | `src/components/PropertyDetailPanel.tsx:1031`, `src/components/PropertyDetailPanel.tsx:1032`, `src/app/property/[listingKey]/page.tsx:242`, `src/app/property/[listingKey]/page.tsx:243` | Inquiry rail did not remain sticky through long scroll ranges -> sticky aside rail (`sticky top-[82px]`) in both overlay and canonical layouts. |
| 14 | Map interactive/tools working (not dead/static block) | PASS | `src/components/PropertyDetailPanel.tsx:151`, `src/components/PropertyDetailPanel.tsx:160`, `src/components/PropertyDetailPanel.tsx:430`, `src/components/PropertyDetailPanel.tsx:447` | Static/non-interactive location block -> embedded map iframe with actionable Street View controls in both location section and media tab map view. |
| 15 | Similar listings 4-slot contract in overlay + canonical (exclude current, placeholders for <4 and 0) | PASS | `src/lib/property-utils.ts:389`, `src/lib/property-utils.ts:394`, `src/lib/property-utils.ts:423`, `src/components/PropertyDetailPanel.tsx:196`, `src/app/property/[listingKey]/page.tsx:234` | Variable card counts and inconsistent fallback behavior -> enforced 4-slot output with exclusion of current listing and deterministic placeholders. |
| 16 | Street View control parity (visible + functional) | PASS | `src/components/PropertyDetailPanel.tsx:160`, `src/components/PropertyDetailPanel.tsx:447` | Street View control missing/inconsistent by surface -> visible Street View buttons in location section and map tab, opening Google pano target. |
| 17 | Overlay gap/scroll behavior parity (side gap + scrollbar feel) | PASS | `src/components/PropertyDetailPanel.tsx:564`, `src/components/PropertyDetailPanel.tsx:891` | Inner-pane spacing/scrollbar behavior mismatch -> panel container now uses Chad-like side margins at desktop, stable scrollbar gutter, and controlled inner scrolling. |
| 18 | Canonical gallery parity with overlay top gallery format | PASS | `src/components/PropertyDetailPanel.tsx:244`, `src/components/PropertyDetailPanel.tsx:940`, `src/app/property/[listingKey]/page.tsx:192` | Canonical gallery used divergent component/format -> canonical now renders shared `PropertyMediaTabs` used by overlay. |

## Similar Listings 4-Slot Contract Confirmation

- Contract source: `buildSimilarListingSlots` in `src/lib/property-utils.ts:389`.
- Excludes current listing key: `src/lib/property-utils.ts:394`.
- Always returns exactly 4 slots via fill loop: `src/lib/property-utils.ts:423`.
- `<4` feed case: fills remaining slots with `"short-feed"` placeholders (`src/lib/property-utils.ts:420` -> `src/lib/property-utils.ts:437`).
- `=0` feed case: still renders 4 placeholders with empty-state messaging and `"empty-feed"` reason (`src/lib/property-utils.ts:421` -> `src/lib/property-utils.ts:434`).
- Rendered in both surfaces through shared section component: `src/components/PropertyDetailPanel.tsx:187`, `src/app/property/[listingKey]/page.tsx:234`.
