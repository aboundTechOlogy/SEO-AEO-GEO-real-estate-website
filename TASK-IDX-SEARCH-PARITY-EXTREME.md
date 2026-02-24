# TASK — IDX Search Experience Parity (Claude Code, Analysis-First)

## Owner
Claude Code in Cursor

## Priority
P0 — parallel track while overlay parity is being completed

## Core Instruction
You are **explicitly** comparing:
1. Chad’s live `/search` experience, and
2. My site’s `/search` experience.

Do **not** redesign. Do **contract-parity analysis** first.

---

## Comparison Targets

### Reference (Chad)
- `https://thechadcarrollgroup.com/search/`

### Target (Mine)
- `https://iamandrewwhalen.com/search/`

Compare desktop + mobile for both.

---

## Scope

### In scope
- Search page and all views:
  - Grid view
  - Map view
  - List view
- Search filters and sorting UX
- Pagination/infinite controls
- Map markers and interactions
- Card interactions and route behavior into overlay
- Toolbar controls and header behavior specific to search page
- Loading/skeleton states for search results

### Out of scope (for this task)
- Overlay property detail page implementation work
- Canonical `/property/[listingKey]` page implementation
- Non-search pages

---

## Required Process (No Shortcuts)

### Step 1: Extract Chad’s contract
- Pull DOM structure and selector map for `/search` key UI blocks.
- Pull relevant shipped CSS/JS assets and identify search-specific rules.
- Capture breakpoint behavior differences (mobile vs desktop).

### Step 2: Compare with mine
For each section, map **Chad vs Mine** for:
- Structure
- Styling tokens
- Functional behavior
- Route transitions

### Step 3: Produce report first
Do not modify code until report is complete and approved.

---

## Required Deliverables (before any coding)

1. **CONTROL ACTION MAP (Chad vs Mine)**
   - Every clickable control and expected behavior
   - Include filters, view toggles, sort, map controls, marker clicks, card clicks

2. **MEASURED TOKEN TABLE (Chad vs Mine)**
   - font-size, line-height, weight
   - paddings/margins/gaps
   - container widths and panel splits
   - card sizes and image ratios
   - row heights (toolbars, filters, cards)
   - icon/button dimensions and spacing
   - breakpoint changes

3. **DOM/SELECTOR MAP**
   - key selectors and sections required to replicate behavior and appearance

4. **PASS/FAIL DELTA LIST**
   - clear, itemized differences
   - severity tag (P0/P1/P2)

5. **PROPOSED PATCH PLAN**
   - grouped by files
   - ordered by risk and dependency

---

## Functional Areas to Verify Explicitly
- Grid/Map/List toggle parity
- Result count + sort bar behavior
- Filter apply/reset flows
- Map marker ↔ list/card sync behavior
- Card click behavior (route, overlay open, back behavior)
- URL/query param handling and persistence
- Mobile search UX (drawer/panel behavior)
- Desktop split-pane proportions
- Empty states and loading states

---

## Allowed Differences
Only these may differ intentionally:
1. Branding/contact identity
2. Legal/disclaimer text
3. Listing data values

Everything else should target parity.

---

## Stop Conditions (Do not claim done if true)
- Any control behavior not verified
- Any key token guessed without comparison
- Any major section missing from Chad vs Mine table
- Any coding started before report approval

---

## Output Format (required)
Create:
- `reports/IDX-SEARCH-PARITY-REPORT.md`

With sections exactly:
1. Summary
2. Control Action Map
3. Measured Token Table
4. DOM/Selector Map
5. Pass/Fail Delta List
6. Proposed Patch Plan (no code yet)
