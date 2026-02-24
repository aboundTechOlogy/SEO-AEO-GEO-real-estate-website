# IDX Search Parity Report
**Generated:** 2026-02-22
**Reference:** `https://thechadcarrollgroup.com/search/`
**Target:** `https://iamandrewwhalen.com/search/`
**Source data:** `reference/carroll-idx-search-filter.css` (386KB), `reference/carroll-search.html`, live site DOM, all search components

---

## 1. Summary

Both sites share the same fundamental search layout architecture: sticky filter bar → sorter row → content area (grid/map/list). Carroll uses the IDXBoost React plugin (`new_search_filter`) with a bespoke CSS class system (`ms-sf-*`). We use a custom Next.js implementation.

**Overall verdict:** Structure and filter bar are ~75% matching. Critical gaps exist in:
- View toggle implementation (P0 — wrong interaction pattern)
- Card aspect ratio (P0 — 4:3 vs 16:9)
- Card border radius missing (P1)
- Map layout height calculation (P1)
- Marker style (P1 — inverted colors)
- Pagination pattern (P1 — basic prev/next vs numbered)
- Filter state not wired to API (P0 — price/bed/bath/type filters apply no query params)
- No autocomplete on search input (P2)

The search input box, filter dropdowns, sorter row, and table view are closest to Carroll's implementation and require the least work.

---

## 2. Control Action Map

### Filter Bar Controls

| Control | Chad (Carroll) | Mine (Andrew) | Match? |
|---------|---------------|---------------|--------|
| **Location/address input** | Autocomplete input `width:290px` (768px+), `320px` (1220px+), `max-width:calc(100% - 75px)` mobile | Plain text input, no autocomplete, `flex-1 min-w-[220px] max-w-[400px]` desktop, `flex-1` mobile | Partial — no autocomplete |
| **For Sale filter** | Dropdown pill button, `h-[50px] rounded-[10px]` desktop; `h-[35px] rounded-full px-[18px]` mobile | Same dimensions: `h-[50px] rounded-[10px] pl-[15px] pr-[40px]` desktop, `h-[35px] rounded-full px-[18px]` mobile | ✅ Match |
| **Price filter** | Same pill style, dropdown with min/max inputs | Same pill style, dropdown with min/max inputs | ✅ Match (not wired to API) |
| **Bed/Bath filter** | Combined pill, dropdown with min/max per type | Combined pill, dropdown with min/max per type | ✅ Match (not wired to API) |
| **Property Type filter** | Pill, multi-select checkboxes | Pill, multi-select checkboxes | ✅ Match (not wired to API) |
| **More/Filters button** | Desktop: "More ≡" pill, opens mega accordion. Mobile: "≡ Filters" first in scroll | Desktop: "More" pill opens same accordion. Mobile: "≡ Filters" first | ✅ Match |
| **Save Search button** | Present in desktop filter bar header | Present (`bg-black text-white rounded-full px-6 h-[50px]`) | ✅ Match (not functional) |
| **View toggle (Grid/Map/List)** | Animated pill tab strip — 3 fixed buttons, 70px each (80px ≥1330px), height 50px, sliding white indicator `border-radius:50px`. Transitions `all .3s`. | Dropdown button — single button showing current view, click opens dropdown list | ❌ **Wrong pattern** |
| **Mobile filter scroll** | `overflow-x:scroll; scroll-snap-type:x mandatory; padding:9px 0 1px 15px` | `overflow-x-auto no-scrollbar; pb-2` | Partial — snap missing |

### View Toggle Details

| Attribute | Chad | Mine |
|-----------|------|------|
| Pattern | Inline 3-button pill with sliding indicator | Dropdown (single active button) |
| Container bg | `#f6f6f6` (bg-gray var) | `bg-white border border-gray-300` |
| Button width | 70px (80px ≥1330px) | Auto (content-width) |
| Button height | 50px | `md:h-[50px] h-[35px]` |
| Active indicator | Sliding white pill behind active, `border-radius:50px`, `border:1px solid #dedede` | N/A — dropdown collapses |
| Transition | `all 0.3s` (CSS transform left position) | N/A |
| Icon+Label | Icon + text label in each button | Icon + text in trigger, icon+text in dropdown |
| Default view | Grid (left position `left:0`) | Grid (hash-based URL) |

### Sorter Row Controls

| Attribute | Chad | Mine |
|-----------|------|------|
| Height | `40px` | `h-10` = 40px ✅ |
| Padding | `padding:0 15px` | `px-[15px]` ✅ |
| Background | `var(--color-white)` = #FFFFFF | `bg-white` ✅ |
| Count label | font-size: 13px, left-aligned | `text-[13px] text-gray-600` ✅ |
| Sort dropdown | "Sort by: **Value** ▾", 13px label | Same pattern ✅ |
| Border | Bottom `border-b border-gray-200` inferred | `border-b border-gray-200` ✅ |

### Card Controls

| Control | Chad | Mine |
|---------|------|------|
| Card click | Navigates to property detail page | Navigates to `/property/[id]` ✅ |
| Share button | Icon button top-right, opens share modal (copy link, email, social) | Icon button top-right (non-functional, `e.preventDefault()`) ❌ |
| Save/Favorite | Heart icon top-right, toggles saved state in IDXBoost account | Heart icon top-right (non-functional, `e.preventDefault()`) ❌ |
| Status badge | Top-left, dark label | Top-left, dark label ✅ |
| "View Map" link | Inside card overlay, opens map for this listing | Not present ❌ |
| Photo counter | "1 of N" counter | "1 of N" counter ✅ |
| Image slider | Multi-image Swiper slider per card in grid | Single static image ❌ |

### Map Controls

| Control | Chad | Mine |
|---------|------|------|
| Map provider | Google Maps (embedded iframe via IDXBoost) | Google Maps via `@vis.gl/react-google-maps` |
| Price markers | White bg, rounded, price label, shadow | Black bg, white text, `rounded-md border border-white/25` |
| Marker click | Opens property detail card/modal inline | Highlights card + scrolls card list |
| Draw/polygon select | Draw tool in map actions button group | MapDrawControl component ✅ |
| Map controls | Custom zoom +/- buttons, cluster mode, satellite toggle | No zoom control (`zoomControl={false}`), no cluster, scale only ❌ |
| Street view | Not visible in search | Disabled ✅ |
| Fullscreen map | Toggle on mobile — full viewport map | Not implemented ❌ |
| Map → card sync | Hovering marker highlights card; clicking opens detail | Marker click highlights card + scrolls ✅ |
| Card → marker sync | Hovering card highlights marker | Not implemented ❌ |

### List/Table Controls

| Control | Chad | Mine |
|---------|------|------|
| Table click to detail | Row click → property detail | Row click → router.push ✅ |
| Save button per row | Star/heart icon col 1 | Star icon col 1 ✅ |
| Sortable columns | Click column header → re-sort | Not clickable (sort via dropdown only) ❌ |
| Column: Development | Hidden <1500px | Hidden `2xl:table-cell` ✅ |
| Column: Price/sqft | Hidden <1300px | Hidden `xl:table-cell` ✅ |
| Column: Living Size | Hidden <990px | Hidden `lg:table-cell` ✅ |
| Mobile list card | Flex card: image-left (thumbnail) + text-right | Flex card: image-left + text-right ✅ |

### Pagination Controls

| Attribute | Chad | Mine |
|-----------|------|------|
| Pattern | Numbered page links (`ib-plitem`), prev/next arrows | "< Page X of Y >" — no numbered links |
| Load more | Numbered pages (click to paginate) | Prev/Next buttons |
| Infinite scroll | Not present (paginated) | Not present ✅ |

---

## 3. Measured Token Table

### Filter Bar

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Filter bar bg | `#FFFFFF` | `bg-white` | ✅ |
| Filter bar padding | `padding:10px 0` (flex wrap) | `px-[15px] pt-[20px] pb-[10px]` | Close |
| Filter bar z-index | `z-index:5` | `z-30` | Ours higher |
| Desktop button height | `50px` | `md:h-[50px]` | ✅ |
| Desktop button border-radius | `10px` | `md:rounded-[10px]` | ✅ |
| Desktop button left padding | `15px` | `md:pl-[15px]` | ✅ |
| Desktop button right padding | `40px` (room for chevron icon) | `md:pr-[40px]` | ✅ |
| Mobile button height | `35px` | `h-[35px]` | ✅ |
| Mobile button border-radius | `25px` (rounded-full) | `rounded-full` | ✅ |
| Mobile button padding | `0 18px` | `px-[18px]` | ✅ |
| Filter button font-size | `13px` desktop, inherited | `text-[13px] md:text-sm` | ✅ |
| Filter button font-weight | `600` | `font-semibold` | ✅ |
| Search input width (768px+) | `290px` | `min-w-[220px] max-w-[400px]` | Wider |
| Search input width (1220px+) | `320px` | Same `max-w-[400px]` | Close |
| Search input height | Inferred 50px from row | `h-[50px]` | ✅ |
| Search input border-radius | Not specified (rounded) | `rounded-[6px]` | Close |
| Mobile filter scroll padding | `padding:9px 0 1px 15px` | `pb-2 px-4` (outer) | Different |

### View Toggle

| Token | Chad | Mine |
|-------|------|------|
| Container bg | `#f6f6f6` | `bg-white border border-gray-300` |
| Container border-radius | `50px` (pill) | `md:rounded-[10px]` (square-ish) |
| Button width | `70px` (80px ≥1330px) | Content-width |
| Button height | `50px` | `md:h-[50px]` |
| Active indicator bg | `#FFFFFF` with `border:1px solid #dedede` | Not present |
| Active indicator border-radius | `50px` | N/A |
| Transition | `all 0.3s` sliding | N/A |
| Font size | `14px` (inside view type buttons) | `md:text-sm` = 14px |
| Font weight | `600` | `font-medium` = 500 |

### Sorter Row

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Row height | `40px` | `h-10` = 40px | ✅ |
| Padding | `0 15px` | `px-[15px]` | ✅ |
| Count label font-size | `13px` | `text-[13px]` | ✅ |
| Count label color | inherited dark | `text-gray-600` | ✅ |
| Sort label font-size | `13px` | `text-[13px]` | ✅ |
| Sort value font-weight | Bold (inferred from CSS) | `font-semibold` | ✅ |
| Background | `var(--color-white)` | `bg-white` | ✅ |

### Property Cards (Grid View)

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Card aspect ratio | **16:9** (`padding-bottom:56.25%`) | **4:3** (`aspect-ratio:4/3`) | ❌ Wrong |
| Card border-radius | `10px` at ≥768px | `0` (no border-radius) | ❌ Missing |
| Card border-radius mobile | `0` | `0` | ✅ |
| Card box-shadow | `#00000029 0 1px 4px` at ≥768px | None | ❌ Missing |
| Card bg | `var(--color-white)` | `bg-neutral-200` | Different |
| Grid item width mobile | `100%` | `grid-cols-1` = 100% | ✅ |
| Grid item width 768px+ | `50%` (2 cols) | `md:grid-cols-2` = 50% | ✅ |
| Grid item width desktop max | `50%` (max 2 col in Carroll's grid) | `xl:grid-cols-3` = 33% | ❌ Extra col |
| Grid item margin | `margin-bottom:10px; padding:0 5px` | `mb-[10px] px-[5px]` | ✅ |
| Grid outer padding | `padding:0 10px` | `px-[10px] pt-[10px]` | ✅ |
| Image object-fit | `object-fit:cover` | `object-cover` | ✅ |
| Overlay gradient | Bottom gradient (implied) | `bg-gradient-to-t from-black/80 via-black/40` | ✅ |
| Card price font-size | Inferred ~18-20px | `text-2xl` = 24px | Larger |
| Card price font-weight | Bold | `font-bold` | ✅ |
| Status badge bg | Dark/black | `bg-black` | ✅ |
| Status badge font-size | ~11px | `text-[11px]` | ✅ |
| Status badge padding | ~px-3 py-1 | `px-3 py-1` | ✅ |
| Action buttons top-right | 32px circle, white bg/90 | `w-8 h-8 rounded-full bg-white/90` | ✅ |
| Card image hover | Scale zoom | `group-hover:scale-105 duration-500` | ✅ |
| Image slider per card | ✅ Swiper multi-image | ❌ Single static image |

### Map Split Layout

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Map panel width (1024px+) | `60%` (position:fixed left) | `lg:w-[60%]` | ✅ |
| List panel width (1024px+) | `40%` (margin-left:60%) | `lg:w-[40%]` | ✅ |
| Map panel width (1330px+) | `50%` | — | ❌ Missing breakpoint |
| List panel width (1330px+) | `50%` (margin-left:50%) | `xl:w-1/2` applies at 1280px | Off-breakpoint |
| Map height | `position:fixed; bottom:0; height:100%` | `calc(100vh - 72px - 56px)` | Different approach |
| List cards in map mode | 1-col (100%) at 1024px-1330px; 2-col (50%) at 1330px+ | `lg:grid-cols-1 xl:grid-cols-2` | ✅ |
| Sorter visible in map | `width:40%; display:flex` on map body | Shown in right panel | ✅ |
| Map pagination | `display:none` on mobile map | Shown in right panel | Partial ❌ |
| Map position | `position:fixed` — stays fixed during scroll | Non-fixed (inside flex container) | ❌ |

### Map Markers

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Bg color | `var(--color-white)` = white | `bg-black` | ❌ Inverted |
| Text color | `var(--color-black)` = black | `text-white` | ❌ Inverted |
| Border-radius | `10px` | `rounded-md` = 6px | Different |
| Padding | `5px 10px` | `px-2.5 py-1` = 10px/4px | Similar |
| Font-size | `13px` | `text-[11px]` | Smaller |
| Box-shadow | `3px 3px 5px rgba(0,0,0,0.25)` | `shadow-lg` | Similar |
| Border | None | `border border-white/25` | Extra |

### List/Table View

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Table width | `width:100%; max-width:100%; border-collapse:collapse` | Same ✅ |
| Table border | `1px solid #dbdbdb` | `border border-gray-200` = `#e5e7eb` | Slightly lighter |
| Cell padding | `padding:12px` | `p-3` = 12px | ✅ |
| Cell font-size | Inferred 15px | `text-[15px]` | ✅ |
| Header bg | Inferred `#f5f5f5` from CLAUDE.md | `bg-[#f5f5f5]` | ✅ |
| Header font-size | Inferred 14px | `text-[14px]` | ✅ |
| Header font-weight | `font-semibold` | `font-semibold` | ✅ |
| Sticky header | `position:sticky; z-index:3` | `sticky z-[3]` | ✅ |
| Row hover bg | Light gray | `hover:bg-gray-50` | ✅ |
| Mobile card image | Small thumbnail left | `w-20 h-20` rounded-md | ✅ |

### Pagination

| Token | Chad | Mine | Delta |
|-------|------|------|-------|
| Pattern | Numbered page links + prev/next | Prev/Next only | ❌ |
| Alignment | Center, flex | Center flex | ✅ |
| Active page style | Bold/highlighted | N/A (no numbered) | ❌ |
| Button size | Icon arrows ~32px | `w-9 h-9` = 36px | Close |

---

## 4. DOM/Selector Map

### Carroll Key Selectors

```
.ms-sf-filter                          — root search filter container
  .ms-sf-filter-header                 — sticky filter bar (white bg, z-5)
    .ms-flex                           — flex row (padding:10px 0)
      .ms-sf-item.-search              — location autocomplete input (290px→320px)
      .ms-sf-item.-touch-scroll        — horizontal scroll filter pill row
        .ms-sf-btn-dropdown            — individual filter pill buttons
      .ms-sf-item (view-type)          — view toggle container
        .ms-sf-view-type               — pill wrapper (bg:#f6f6f6, border-radius:50px)
          .ms-sf-btn-view              — grid/map/list buttons (70px wide, h:50px)
  .ms-sf-filter-body.{grid|map|list}  — content area (class changes on view switch)
    .ms-sf-wrapper-sorter              — sorter row (h:40px, padding:0 15px)
      .ms-sf-flex-item                 — count label (13px left), sort select (13px right)
    .ms-sf-filter-grid                 — grid results (shown when body.grid)
      .ms-sf-property-list             — list container
        .ms-sf-property-results        — flex wrap, padding:0 10px
          .ms-sf-pitem                 — item (50% at 768px+)
            .ms-sf-property-card       — card root (position:relative)
              .ms-sf-property-card-dody — card body (border-radius:10px, box-shadow, bg:white)
                .ms-sf-property-card-slider — image container (padding-bottom:56.25% → 16:9)
                .ms-sf-property-card-detail — text overlay
    .ms-sf-filter-map                  — map panel (60% fixed left at 1024px+; 50% at 1330px+)
      iframe / map container
    .ms-sf-filter-list                 — list/table view (shown when body.list)
      .ms-sf-wrapper-table             — table wrapper (padding:0 15px 15px)
        .ms-sf-table                   — table (border:1px solid #dbdbdb)
    .ms-sf-wrapper-sorter (in map mode) — 40% width right side
    .ms-sf-property-list-pagination    — pagination
      .ms-sf-pagination                — flex center, numbered links
```

### Our Key Selectors

```
div[ref=filterBarRef]                  — sticky filter bar (top:[nav-height])
  .hidden.md:flex                      — DesktopSearchBar
    input[type=text]                   — search input (no autocomplete)
    ForSaleFilter, PriceFilter, etc.   — filter pills
    .ml-auto                           — Save Search + ViewToggle
      ViewToggle                       — dropdown button (wrong pattern)
  .md:hidden                           — MobileSearchBar
    Row 1: search input + ViewToggle
    Row 2: overflow-x-auto pill row

[view === "grid"]
  .bg-white.min-h-[calc(100vh-...)]   — grid content
    SorterRow                          — h-10 px-[15px] bg-white border-b
    .px-[10px].pt-[10px]              — grid wrapper
      .grid.grid-cols-1.md:grid-cols-2.xl:grid-cols-3  — grid container
        .px-[5px].mb-[10px]           — grid item
          SearchPropertyCard           — aspect-ratio:4/3, no border-radius

[view === "map"]
  .flex[style="height:calc(100vh-72px-56px)"]  — map container
    .w-full.lg:w-[60%].xl:w-1/2       — map panel (non-fixed)
      PropertyMap                      — Google Maps
    .hidden.lg:flex.lg:w-[40%].xl:w-1/2  — list panel
      SorterRow
      .grid.grid-cols-1.xl:grid-cols-2

[view === "list"]
  .bg-white
    SorterRow
    .hidden.md:block.px-[15px].pb-[15px]  — table wrapper
      table.w-full.border-collapse.border.border-gray-200
        thead.sticky.z-[3]
          tr > th (9 columns)
        tbody > tr (clickable)
    .md:hidden  — mobile card list
      MobileListCard (image + text flex)
    Pagination (prev/next only)
```

### Carroll CSS Variables Used in Search

```css
--color-white:       #FFFFFF
--color-black:       #000000
--color-border:      #dedede
--color-border-list: #dbdbdb
--color-bg-gray:     #f6f6f6  (view toggle bg)
--color-border-light: #e3e3e3
```

---

## 5. Pass/Fail Delta List

### P0 — Critical (breaks experience parity)

| ID | Issue | Chad | Mine |
|----|-------|------|------|
| P0-01 | **View toggle wrong pattern** | Inline 3-button pill with animated sliding indicator | Single dropdown button — completely different interaction |
| P0-02 | **Filters not wired to API** | All filter changes trigger immediate result refresh | Price/Bed/Bath/PropertyType filters have no query params sent to Bridge API — UI exists but does nothing |
| P0-03 | **Card aspect ratio** | 16:9 (56.25%) — landscape image | 4:3 (75%) — taller, inconsistent with Carroll |
| P0-04 | **Grid max 2 columns vs our 3** | Max 2 cols (50% per item) at all desktop widths | 3 cols at `xl` (1280px+) — breaks parity card density |

### P1 — High (visible parity failures)

| ID | Issue | Chad | Mine |
|----|-------|------|------|
| P1-01 | **Card border-radius missing** | `border-radius:10px` at ≥768px | `0` — square corners |
| P1-02 | **Card box-shadow missing** | `box-shadow:#00000029 0 1px 4px` at ≥768px | None |
| P1-03 | **Map markers inverted** | White bg, black text | Black bg, white text — visually opposite |
| P1-04 | **Map panel not position:fixed** | Map panel is `position:fixed` — scrolling list doesn't affect map | Map is inside flex container, may move on scroll |
| P1-05 | **Pagination — numbered links missing** | Numbered page list with prev/next | Only prev/next with "Page X of Y" text |
| P1-06 | **No image slider per card** | Each card shows multi-image Swiper slider on hover | Single static image only |
| P1-07 | **Map split breakpoint wrong** | 60/40 at 1024px → 50/50 at 1330px | 60/40 at 1024px → 50/50 at 1280px (our `xl`) — 50px offset |
| P1-08 | **Card → marker hover sync missing** | Hovering card highlights corresponding marker | Not implemented |
| P1-09 | **Share/Save button not functional** | Share opens social share modal; Save persists to account | Both are `e.preventDefault()` stubs |
| P1-10 | **Sortable column headers missing** | Click column header to re-sort | Not implemented — sort only via dropdown |

### P2 — Medium (enhancement/polish)

| ID | Issue | Chad | Mine |
|----|-------|------|------|
| P2-01 | **No location autocomplete** | Address autocomplete with dropdown suggestions | Plain text input, no suggestions |
| P2-02 | **Mobile filter scroll-snap missing** | `scroll-snap-type:x mandatory` | `overflow-x-auto` only |
| P2-03 | **Map zoom controls missing** | Custom +/- zoom buttons in map | `zoomControl={false}` |
| P2-04 | **No mobile map fullscreen toggle** | Mobile: "Map" view shows full-viewport map with floating card panel | Mobile map = same 60/40 flex (broken on small screens) |
| P2-05 | **View toggle font-weight** | `600` | `font-medium` = 500 |
| P2-06 | **"View Map" per-card button missing** | Each card has "View Map" anchor | Not present |
| P2-07 | **Map marker font-size** | `13px` | `text-[11px]` = 11px |
| P2-08 | **Map marker border-radius** | `10px` | `rounded-md` = 6px |
| P2-09 | **Filter state not persisted in URL** | IDXBoost manages filter state in URL params | Only view mode (`#grid`) in URL hash |
| P2-10 | **Loading skeleton differs** | CSS animation skeleton that mimics card shape | Simple `animate-pulse` gray block |
| P2-11 | **Card price font-size** | Inferred ~18-20px | `text-2xl` = 24px (bigger) |

---

## 6. Proposed Patch Plan

### Phase 1 — P0 Fixes (block everything else)

#### 1a. `src/components/SearchFilters.tsx` — View Toggle

**Problem:** Wrong interaction pattern. Carroll uses an inline 3-button pill with a CSS-animated sliding white indicator.

**Changes:**
- Replace `ViewToggle` dropdown component entirely
- New implementation: flex container, `bg-[#f6f6f6] rounded-[50px]`, 3 fixed-width buttons
- Active indicator: absolutely positioned white pill, CSS `left` property driven by active view
- Button widths: `70px` default, `80px` at ≥1330px (use `min-[1330px]:w-[80px]`)
- Button height: `50px`
- Transition: `transition: left 0.3s ease`
- Remove all dropdown logic from ViewToggle
- Touch: on mobile, pill container should be `h-[35px]` with smaller buttons

#### 1b. `src/app/search/page.tsx` + `src/app/api/search/route.ts` — Wire Filters to API

**Problem:** Price, Bed/Bath, Property Type filters are UI-only — zero API integration.

**Changes:**
- Add state in `SearchPage` for: `minPrice`, `maxPrice`, `minBeds`, `maxBeds`, `minBaths`, `maxBaths`, `propertyTypes[]`
- Thread these as props down to `DesktopSearchBar`/`MobileSearchBar`
- Pass filter values from `ForSaleFilter`, `PriceFilter`, `BedBathFilter`, `PropertyTypeFilter` back up via `onChange` callbacks
- Add corresponding Bridge API query params to `searchKey` useMemo (ListPrice ge/le, BedroomsTotal ge/le, BathroomsTotalInteger ge/le, PropertyType)
- Reset `page` to 1 on any filter change

#### 1c. `src/components/SearchPropertyCard.tsx` — Card Aspect Ratio + Border Radius

**Problem:** 4:3 aspect ratio and no border radius.

**Changes:**
- Change `style={{ aspectRatio: "4/3" }}` → `style={{ aspectRatio: "16/9" }}`
- Add `md:rounded-[10px]` to the outer `<Link>` (0 on mobile, 10px on desktop)
- Add `md:shadow-[0_1px_4px_rgba(0,0,0,0.16)]` (matches Carroll's `#00000029 0 1px 4px`)

#### 1d. `src/app/search/page.tsx` — Grid Column Count

**Problem:** 3 cols at xl vs Carroll's max 2.

**Changes:**
- Grid view: change `xl:grid-cols-3` → `lg:grid-cols-2` (keep 2 max, add breakpoint consistency)
- Map panel list: change `xl:grid-cols-2` → keep as 2 cols (correct)

---

### Phase 2 — P1 Fixes

#### 2a. `src/components/PropertyMap.tsx` — Map Panel + Markers

**Changes:**
- Marker style: change from `bg-black text-white border border-white/25` → `bg-white text-black border border-[#dedede]`
- Marker border-radius: `rounded-md` → `rounded-[10px]`
- Marker font-size: `text-[11px]` → `text-[13px]`
- Map container: add `zoomControl={true}` or implement custom zoom buttons
- Map layout: in map view, the map panel needs `position:fixed` behavior — currently uses `calc(100vh - 72px - 56px)` height, adjust so map truly stays fixed as list scrolls

#### 2b. `src/app/search/page.tsx` — Map Layout Fix

**Changes:**
- Map panel: add `sticky top-[nav+filterBar]` or change to `position:fixed` approach matching Carroll
- Ensure map panel stays visually anchored while right list scrolls independently
- Update height calc to match `100vh - filterBarHeight` dynamically

#### 2c. `src/app/search/page.tsx` — Pagination

**Changes:**
- Replace simple `Pagination` component with numbered page links
- Show up to 7 page numbers with ellipsis (like Carroll's `ib-paglinks`)
- Keep prev/next arrows flanking the numbered list
- Active page: bold + dark bg

#### 2d. `src/app/search/page.tsx` — Card → Marker Sync

**Changes:**
- Add `onMouseEnter`/`onMouseLeave` handlers on grid cards in map view
- Call a new `setHighlightedListingId` on hover (currently only set on marker click)
- PropertyMap: add highlighted prop, style highlighted marker differently (border or scale)

#### 2e. `src/app/search/page.tsx` — Sortable Table Columns

**Changes:**
- Add click handlers to `<th>` elements in list view
- Map column click to corresponding `orderby` parameter
- Visual sort indicator (arrow up/down) in active header

---

### Phase 3 — P2 Fixes

#### 3a. `src/components/SearchFilters.tsx` — Mobile Scroll Snap

**Changes:**
- Add `scroll-snap-type: x mandatory` to mobile filter scroll row
- Add `scroll-snap-align: start` to each filter pill

#### 3b. `src/components/SearchPropertyCard.tsx` — Image Slider

**Changes:**
- Accept `images: string[]` prop (array of CDN URLs)
- Add Swiper slider on hover (Carroll shows slider on card hover)
- Keep single image display by default, enable slider on mouseenter

#### 3c. `src/components/SearchFilters.tsx` — Location Autocomplete

**Changes:**
- Replace plain text input with Google Places Autocomplete
- Or add custom Bridge API address suggestions endpoint
- Trigger search on suggestion select

#### 3d. URL State Persistence

**Changes:**
- Replace hash-based view with URLSearchParams for all filter state
- Enables direct linking, browser back/forward through filter state

#### 3e. `src/app/search/page.tsx` — Mobile Map Fullscreen

**Changes:**
- On mobile in map view: show full-viewport map
- Float panel at bottom (sliding drawer) showing current property list
- Match Carroll's mobile map UX pattern

---

### Execution Order

```
1. P0-02 Filter API wiring (unblocks all filter validation)
2. P0-01 View toggle redesign
3. P0-03 Card aspect ratio + P0-04 grid columns (same file)
4. P1-01 + P1-02 Card border-radius + shadow
5. P1-03 Map marker colors + P1-04 map fixed position
6. P1-05 Numbered pagination
7. P1-08 Card-marker sync
8. P1-09 Share/Save stubs (need backend)
9. P2 items in dependency order
```

### Files Changed Summary

| File | Issues | Phase |
|------|--------|-------|
| `src/components/SearchFilters.tsx` | P0-01 (view toggle), P2-02 (scroll snap), P2-03 (autocomplete) | 1+3 |
| `src/components/SearchPropertyCard.tsx` | P0-03 (aspect ratio), P1-01 (border-radius), P1-02 (shadow), P1-06 (image slider) | 1+2 |
| `src/app/search/page.tsx` | P0-02 (filter wiring), P0-04 (grid cols), P1-04 (map fixed), P1-05 (pagination), P1-08 (hover sync), P1-10 (sortable cols), P2-04 (mobile map) | 1+2+3 |
| `src/components/PropertyMap.tsx` | P1-03 (marker style), P2-03 (zoom controls) | 2 |
| `src/app/api/search/route.ts` | P0-02 (filter params) | 1 |

---

## Appendix: Carroll Search CSS Key Rules Reference

```css
/* View toggle pill */
.ms-sf-view-type .ms-sf-wrapper {
  display: flex; border-radius: 50px;
  background-color: #f6f6f6; width: max-content; position: relative;
}
.ms-sf-view-type .ms-sf-wrapper:before {
  /* sliding indicator */
  content: ""; z-index: 0; width: 70px; height: 48px;
  position: absolute; left: 0; top: 50%; margin: 0 -1px;
  border-radius: 50px; transition: all .3s; transform: translateY(-50%);
  border: 1px solid #dedede; background-color: #FFFFFF;
}
.ms-sf-view-type .ms-sf-wrapper.map:before { left: 70px; }
.ms-sf-view-type .ms-sf-wrapper.list:before { left: 140px; }
.ms-sf-view-type .ms-sf-wrapper .ms-sf-btn-view {
  height: 50px; font-size: 14px; font-weight: 600;
  padding: 0 10px; border-radius: 50px; width: 70px; position: relative; z-index: 1;
}
@media (min-width: 1330px) {
  .ms-sf-view-type .ms-sf-wrapper .ms-sf-btn-view { width: 80px; }
  .ms-sf-view-type .ms-sf-wrapper:before { width: 80px; }
  .ms-sf-view-type .ms-sf-wrapper.map:before { left: 80px; }
  .ms-sf-view-type .ms-sf-wrapper.list:before { left: 160px; }
}

/* Sorter row */
.ms-sf-wrapper-sorter {
  height: 40px; display: flex; align-items: center;
  justify-content: space-between; padding: 0 15px;
}
.ms-sf-wrapper-sorter .ms-sf-flex-item .ms-sf-label { font-size: 13px; }

/* Card */
.ms-sf-property-card-dody {
  border-radius: 0; /* mobile */
}
@media (min-width: 768px) {
  .ms-sf-property-card-dody {
    border-radius: 10px; box-shadow: #00000029 0 1px 4px;
  }
}
/* Card image — 16:9 via padding hack */
.ms-sf-property-card-slider:after {
  content: ""; display: block; padding-bottom: 56.25%;
}

/* Map layout */
@media (min-width: 1024px) {
  .ms-sf-filter-body.map .ms-sf-filter-map {
    width: 60%; position: fixed; bottom: 0; left: 0;
  }
  .ms-sf-filter-body.map .ms-sf-filter-grid {
    width: 40%; display: block; margin-left: 60%;
  }
}
@media (min-width: 1330px) {
  .ms-sf-filter-body.map .ms-sf-filter-map { width: 50%; }
  .ms-sf-filter-body.map .ms-sf-filter-grid { width: 50%; margin-left: 50%; }
}

/* Map markers */
.ms-sf-richmarker {
  color: #000000; background-color: #FFFFFF;
  border-radius: 10px; padding: 5px 10px; font-size: 13px;
  box-shadow: 3px 3px 5px rgba(0,0,0,0.25);
}

/* Table */
.ms-sf-table {
  width: 100%; border-collapse: collapse;
  background-color: #FFFFFF; border: 1px solid #dbdbdb;
}
.ms-sf-table thead tr th,
.ms-sf-table tbody tr td {
  padding: 12px; border: 1px solid #dbdbdb;
}

/* Grid columns */
@media (min-width: 768px) {
  .ms-sf-pitem { width: 50%; margin-bottom: 10px; padding: 0 5px; }
}
/* No 3-col rule in Carroll — max is 2 cols in all grid views */
```
