# TASK: Rebuild Search Page to Match Carroll's IDXBoost Implementation

## Reference Source (MUST READ FIRST)
All CSS extracted from Carroll's actual IDXBoost plugin:
- `reference/carroll-idx-search-filter.css` — the full search filter CSS
- `reference/carroll-idx-search-shortcode.css` — shortcode wrapper CSS

## The Problem
Our search page uses dark backgrounds (`bg-[#0a0a0a]`) for the results area. Carroll's search results use a **WHITE background** for everything below the filter bar. The sort/count row, column headers, and data rows are all on white. Our implementation has been invisible because white elements on a dark page don't match Carroll's layout.

## What to Change

### 1. Search Results Background → WHITE
Carroll's entire `.ms-sf-filter-body` uses `background-color: var(--color-white)` (white). Change the results container for ALL three views (grid, map right panel, list) from `bg-[#0a0a0a]` to `bg-white`.

### 2. Sort/Count Row (`.ms-sf-wrapper-sorter`)
This row appears on ALL three views (grid, map, list). From Carroll's CSS:
```css
.ms-sf-wrapper-sorter {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
```
- **Left side:** `"{count} Properties"` — 13px font, normal weight
- **Right side:** `"Sort by: {selected} ▾"` — 13px font, selected value is `font-weight: 600`
- The sort uses a native `<select>` overlaid on a styled label with a dropdown SVG arrow (the select is `opacity: 0` positioned absolute over the label). This makes it look custom but uses native browser behavior.
- Background: white (inherits from parent)

### 3. List View Table (`.ms-sf-table`)
From Carroll's CSS:
```css
.ms-sf-table {
  width: 100%;
  max-width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid var(--color-border-list); /* light gray border */
}
```

**Table wrapper:** `.ms-sf-wrapper-table` has `padding: 0 15px 15px`

**Header row (`thead`):**
- `position: sticky; z-index: 3`
- `th` cells: `padding: 15px 8px; font-size: 14px; background-color: var(--color-bg-gray)` (light gray, ~#f5f5f5)
- Has a border-top and border-bottom via pseudo-element

**Data rows (`tbody`):**
- `td` cells: `padding: 12px; font-size: 15px; background-color: white`
- `tr:hover td` → `background-color: var(--color-bg-gray)` (light gray hover)
- Each cell has `border: 1px solid var(--color-border-list)` (very light gray)

**Column classes and responsive hiding:**
- `.-image` — hidden on desktop list view (shown as card on mobile)
- `.-address` — always visible
- `.-price` — always visible
- `.-price-status` — the % / $ column
- `.-bed`, `.-bath` — beds/baths
- `.-living-size` — hidden below 990px
- `.-price-sqft` — hidden below 1300px
- `.-development` — hidden below 1500px

**Mobile list view (below 768px):**
Carroll transforms the table into **card layout** — `display: block`, thead hidden, each `<tr>` becomes a flex-wrapped card with image on left, details on right. Use our existing `MobileListCard` approach but with WHITE background styling.

### 4. Grid View Cards
Grid cards sit on a white background. Card grid uses:
- Padding: `0 10px` on the results container
- Each card: `padding: 0 5px; margin-bottom: 10px`
- Responsive columns: 1 col mobile, 2 col ≥768px, 3 col ≥1200px, 4 col ≥1600px
- Our `PropertyCard` component already exists — just needs to be on white bg

### 5. Map View Layout
From Carroll's CSS:
- Below 1024px: map is full screen, grid hidden
- ≥1024px: map 60% left (fixed), grid 40% right (scrollable) — sort row + cards
- ≥1400px: 50/50 split, cards become 2-col grid

Map panel (left side) stays dark/neutral. Right panel (cards) is white.

### 6. Pagination
Carroll uses a simple pagination bar centered below results. Style with dark text on white background to match the white results area.

### 7. Text Colors
Since background is now WHITE, all text colors must flip:
- Property count: dark text (~`text-gray-600`)
- Sort label: dark text, selected value bold
- Table headers: dark gray text on light gray bg
- Table data: dark text (`text-gray-900` for price/address, `text-gray-500` for secondary)
- Address text: dark
- Price: dark, bold
- Beds/baths/sqft: dark
- Hover: light gray background
- Favorite star: outline gray, filled on hover
- Pagination: dark text, active page has dark bg + white text

### 8. Filter Bar
Keep the filter bar as-is (dark bg, sticky). It's the ONLY dark element. Everything below it flips to white.

## Files to Modify
1. `src/app/search/page.tsx` — Main search page (rebuild all three views)
2. Possibly `src/components/PropertyCard.tsx` — if card styles need adjustment for white bg

## Files NOT to Modify
- `src/components/SearchFilters.tsx` — filter bar stays as-is
- `src/data/mockListings.ts` — data stays as-is

## Implementation Notes
- Keep the `useEffect` for hash-based view persistence (`/search#list`)
- Keep the `SortDropdown` component but change colors for white bg (dark text)
- Keep the `MobileListCard` but change colors for white bg
- Keep the `formatPriceSqft` helper
- The `ResultsHeader` function is now dead code — remove it
- Keep all sort options as-is (9 options matching Carroll)

## Acceptance Criteria
- [ ] Grid view: white bg, sort/count row, 3-col cards on desktop
- [ ] Map view: dark map placeholder left, white card panel right (hidden on mobile)
- [ ] List view: white bg, sort/count row, light gray thead, white tbody with borders, hover state
- [ ] All text readable (dark on white)
- [ ] View persists via URL hash on refresh
- [ ] Mobile list view: card layout (not table)
- [ ] Responsive column hiding in list view (development hidden <1500px, price/sqft hidden <1300px, living size hidden <990px)
- [ ] Zero TypeScript errors
