# TASK: Map Draw Tool + Map Controls (Carroll Parity)

## Reference
Chad Carroll's search page map has these controls in the upper-right corner:
1. **+ / −** zoom buttons (already present)
2. **Draw boundary** tool (polygon/freehand drawing on the map)
3. **Rotate/compass** (tilt the map, reset north)
4. **Street View** pegman
5. **Fullscreen** expand button

We currently have zoom, street view, fullscreen, and rotate enabled but are **missing the draw tool**.

## What to Build

### 1. Draw Boundary Control (`src/components/MapDrawControl.tsx`)

A custom map control button that:
- Renders as a small icon button in the map's top-right control area (matching the style of Google's built-in controls — white background, subtle shadow, ~40x40px)
- Icon: a polygon/pencil draw icon (use an inline SVG)
- On click, activates **freehand polygon drawing mode** on the map
- User draws a closed polygon on the map by clicking points
- Double-click or clicking back on the first point closes the polygon
- While a polygon is active:
  - The polygon fills with a semi-transparent overlay (light blue/gray, ~20% opacity, with a solid border)
  - A small "Clear" / "×" button appears to remove the polygon and exit draw mode
- The component exposes an `onBoundsChange` callback that passes the polygon coordinates as `Array<{lat: number, lng: number}>` — this will be used later for Bridge API geographic filtering

### 2. Integration into PropertyMap (`src/components/PropertyMap.tsx`)

- Import and render `MapDrawControl` inside the `<Map>` component
- Only render when `interactive={true}`
- Accept an optional `onDrawBounds?: (coords: Array<{lat: number, lng: number}> | null) => void` prop
- Pass it through to `MapDrawControl`

### 3. Integration into Search Page (`src/app/search/page.tsx`)

- In the map view, pass `onDrawBounds` to `PropertyMap`
- Store the drawn polygon coordinates in state (for future Bridge API filtering)
- No actual filtering needed yet — just store the state

## Technical Notes

- Use the `@vis.gl/react-google-maps` library (already installed). Check their docs for custom controls and drawing support.
- If `@vis.gl/react-google-maps` doesn't support the Drawing library directly, use `useMap()` hook to get the underlying `google.maps.Map` instance and attach a `google.maps.drawing.DrawingManager` or manual polygon drawing via click listeners.
- The Google Maps Drawing Library may need to be loaded explicitly. Use `useMapsLibrary("drawing")` from `@vis.gl/react-google-maps` if available, or load it via the `libraries` prop on `APIProvider`: `<APIProvider apiKey={key} libraries={["drawing"]}>`
- **DO NOT modify the search filter bar or search page layout** — only add the draw control to the map component
- **DO NOT change the map theme** — keep the current default Google Maps styling (no dark theme)
- Keep `gestureHandling="greedy"` on the map

## Style

- Draw button: white bg, subtle border/shadow, matches Google Maps' built-in control buttons
- Polygon fill: `rgba(66, 133, 244, 0.15)` (Google blue, 15% opacity)
- Polygon stroke: `#4285F4` (Google blue), 2px width
- Clear button: small red/gray × that appears near the polygon or as a floating control

## Files to Touch
- `src/components/MapDrawControl.tsx` (NEW)
- `src/components/PropertyMap.tsx` (add draw control + onDrawBounds prop)
- `src/app/search/page.tsx` (wire up onDrawBounds state)

## DO NOT Touch — CRITICAL
- **`src/components/SearchFilters.tsx` — DO NOT MODIFY. The search/filter bar layout is final. Do not change any styling, structure, dropdowns, or behavior.**
- **`src/components/SearchPropertyCard.tsx` — DO NOT MODIFY.**
- **`src/data/mockListings.ts` — DO NOT MODIFY.**
- Any page other than `src/app/search/page.tsx`
- The map dark theme is already removed — don't re-add it
- Do not change the search page layout, grid, list view, or sorter components
- The ONLY changes to `search/page.tsx` should be importing the draw bounds state and passing the callback to PropertyMap

## Test
- `npm run build` must pass with zero errors
- Map view on /search/ should show the draw button alongside other map controls
- Clicking draw → clicking map points → closing polygon should work
- Clear button should remove polygon
