# Cursor Codex Raw Report (pasted from chat)

No edits were made in this pass, and nothing was pushed.

## 1) Control Action Map (Every Icon/Button → Exact Behavior)

| Control | Ours (exact behavior) | Chad contract reference | Parity |
|---|---|---|---|
| Critical split A: header external-link/open icon (desktop) | `CircleIconButton` labeled “Open full details page” calls `openCanonicalDetailsPage()` → `window.location.assign('/property/[listingKey]/')` (`src/components/PropertyDetailPanel.tsx:492`, `src/components/PropertyDetailPanel.tsx:425`) | Header action item `.-open` exists with save/share/phone/open group (`/tmp/chad-new-search-rules.txt:689`) | Behavior PASS, icon semantics PARTIAL |
| Critical split B: black gallery expand icon (desktop media) | Black square button opens fullscreen photo viewer (`setIsPhotoViewerOpen(true)`) (`src/components/PropertyDetailPanel.tsx:527`) | Fullscreen media option button `.-full-screen .sf-icon-expand` (`/tmp/chad-new-search-rules.txt:725`) | PASS |
| Critical split C: desktop photo click | Clicking desktop photo tile sets active index and opens fullscreen viewer (`src/components/PropertyDetailPanel.tsx:571`) | Slider item is interactive; fullscreen/gallery modal contract exists (`/tmp/chad-new-search-rules.txt:652`, `/tmp/chad-new-search-rules.txt:1152`) | PASS |
| Desktop header save | Toggles localStorage `savedListings` (`src/components/PropertyDetailPanel.tsx:486`, `src/components/PropertyDetailPanel.tsx:367`) | Header `.-save` action slot (`/tmp/chad-new-search-rules.txt:689`) | PASS |
| Desktop header share | Native share, else clipboard, else new tab (`src/components/PropertyDetailPanel.tsx:489`, `src/components/PropertyDetailPanel.tsx:384`) | Header `.-share` action slot (`/tmp/chad-new-search-rules.txt:689`) | PASS |
| Desktop close (top-right floating) | Calls `handleClose()` → animated close + `router.back()` (`src/components/PropertyDetailPanel.tsx:455`, `src/components/PropertyDetailPanel.tsx:136`) | Close control exists in header action set (`/tmp/chad-new-search-rules.txt:695`) | PASS |
| Mobile header close | Circle close button calls `handleClose()` (`src/components/PropertyDetailPanel.tsx:480`) | Mobile close button sizing in contract (`/tmp/chad-new-search-rules.txt:695`) | PASS |
| Mobile top-left Photos chip | Visual active chip only, no click handler (`src/components/PropertyDetailPanel.tsx:501`) | Chad options switcher exists (`/tmp/chad-new-search-rules.txt:723`) | PARTIAL |
| Mobile top-left Map chip | Opens Google Maps if coords (`src/components/PropertyDetailPanel.tsx:507`, `src/components/PropertyDetailPanel.tsx:407`) | Chad map view mode exists (`/tmp/chad-new-search-rules.txt:744`) | PASS |
| Mobile top-left Virtual Tour chip | Disabled (`src/components/PropertyDetailPanel.tsx:513`) | Chad video option mode exists (`/tmp/chad-new-search-rules.txt:747`) | PARTIAL |
| Desktop PHOTOS tab | Static active button, no handler (`src/components/PropertyDetailPanel.tsx:522`) | Chad media view options are interactive (`/tmp/chad-new-search-rules.txt:723`) | PARTIAL |
| Desktop MAP VIEW tab | Opens Google Maps if coords (`src/components/PropertyDetailPanel.tsx:523`) | Chad map view mode (`/tmp/chad-new-search-rules.txt:744`) | PASS |
| Desktop VIRTUAL TOUR tab | Disabled (`src/components/PropertyDetailPanel.tsx:524`) | Chad has video mode (`/tmp/chad-new-search-rules.txt:747`) | PARTIAL |
| Main carousel prev/next | Changes `activePhoto` (`src/components/PropertyDetailPanel.tsx:599`, `src/components/PropertyDetailPanel.tsx:607`) | Chad slider controls implied by slider contract (`/tmp/chad-new-search-rules.txt:716`) | PASS |
| Street View pill | Opens Google Street View if coords (`src/components/PropertyDetailPanel.tsx:621`, `src/components/PropertyDetailPanel.tsx:416`) | Required by task; map/video option contract present (`/tmp/chad-new-search-rules.txt:723`) | PASS |
| Mobile action row save | Toggles saved listing (`src/components/PropertyDetailPanel.tsx:639`) | Mobile view-actions row with 4 buttons (`/tmp/chad-new-search-rules.txt:761`) | PASS |
| Mobile action row share | Share flow (`src/components/PropertyDetailPanel.tsx:647`) | Mobile view-actions row (`/tmp/chad-new-search-rules.txt:761`) | PASS |
| Mobile action row call | `tel:+13054559744` (`src/components/PropertyDetailPanel.tsx:653`) | Header/mobile action contains `.-phone` slot (`/tmp/chad-new-search-rules.txt:689`) | PASS |
| Mobile action row email | `mailto:Andrew@IamAndrewWhalen.com` (`src/components/PropertyDetailPanel.tsx:656`) | Email icon slot present in actions (`/tmp/chad-new-search-rules.txt:764`) | PASS |
| Description Read more/less | Toggles full/collapsed remarks (`src/components/PropertyDetailPanel.tsx:701`) | Chad description area (`/tmp/chad-new-search-rules.txt:779`) | PASS |
| “View Full Details” button | Navigates to canonical detail page (`src/components/PropertyDetailPanel.tsx:719`) | Chad has open/canonical action in header (`/tmp/chad-new-search-rules.txt:689`) | PASS |
| Fullscreen header save | Same toggleSaved handler (`src/components/PropertyDetailPanel.tsx:772`) | Fullscreen action strip includes `.-save` (`/tmp/chad-new-search-rules.txt:1161`) | PASS |
| Fullscreen header photos | Active visual button only (`src/components/PropertyDetailPanel.tsx:775`) | Fullscreen/gallery action strip exists (`/tmp/chad-new-search-rules.txt:1159`) | PARTIAL |
| Fullscreen header map | Opens map (`src/components/PropertyDetailPanel.tsx:781`) | Fullscreen action strip includes map-style actions (`/tmp/chad-new-search-rules.txt:1159`) | PASS |
| Fullscreen header email | `mailto` navigation (`src/components/PropertyDetailPanel.tsx:787`) | Action strip has communication actions (`/tmp/chad-new-search-rules.txt:1159`) | PASS |
| Fullscreen header share | Share flow (`src/components/PropertyDetailPanel.tsx:788`) | Action strip includes share slot (`/tmp/chad-new-search-rules.txt:1161`) | PASS |
| Fullscreen header close | Closes only fullscreen viewer (`src/components/PropertyDetailPanel.tsx:789`) | Fullscreen modal header controls (`/tmp/chad-new-search-rules.txt:1156`) | PASS |
| Fullscreen prev/next | Changes active photo (`src/components/PropertyDetailPanel.tsx:813`, `src/components/PropertyDetailPanel.tsx:821`) | Gallery/fullscreen modal contract (`/tmp/chad-new-search-rules.txt:1152`) | PASS |
| Main backdrop click | If click target is backdrop, close modal (`src/components/PropertyDetailPanel.tsx:433`) | Modal backdrop close behavior contract | PASS |
| Fullscreen backdrop click | If click target is fullscreen backdrop, close fullscreen only (`src/components/PropertyDetailPanel.tsx:754`) | Fullscreen/gallery overlay contract (`/tmp/chad-new-search-rules.txt:1152`) | PASS |
| ESC key | Closes fullscreen first, else closes modal (`src/components/PropertyDetailPanel.tsx:151`) | Modal close keyboard behavior expected | PASS |
| Swipe-right close | Right swipe >90px triggers close (`src/components/PropertyDetailPanel.tsx:257`) | Not explicit in Chad CSS contract | PARTIAL |
| “Back to Search” (property missing) | Calls close flow (`src/components/PropertyDetailPanel.tsx:286`) | Fallback behavior not in Chad contract | PASS |

Note: Chad interaction specifics mapped from shipped selector contract because live JS chunk is aggressively minified.

## 2) Measured Token Table (Chad vs Ours)

- Modal container desktop width/gap: Chad `calc(100% - 50px)` + 1200 cap at >=1300; ours `left/right 28px` + 1200 at 2xl.
- Modal content max width model differs (`96% max-width:1300` vs fixed shell insets).
- Header row: Chad fixed 70px; ours variable via content.
- Header padding mismatch (`10x15` vs approx `12x16`).
- Header title much larger on ours (34/40/44 vs 20).
- Circle action button size matched at 40x40.
- Icon sizes mixed mismatch.
- Media geometry mismatch (Chad fixed/ratio contracts vs ours vh-based heights).
- Mobile action row height mismatch (45 vs 56).
- Price/stats typography much larger in ours.
- Description title much larger in ours.
- Right rail width/sticky top mismatch (310/350 + top 82 vs fixed 340 + top 16).
- Fullscreen header geometry mismatch.
- Loading shell height/geometry mismatch.

## 3) DOM / Selector Map (summary)

- Overlay root/backdrop: Chad `.propertyDetailPage.modalDetail` / `.ms-sf-modal#modalDetail`; ours fixed overlay root/backdrop in `PropertyDetailPanel.tsx`.
- Header row: Chad `.ms-sf-modal-header .ms-sf-flex`; ours sticky header row block.
- Header actions: Chad `.-save/-phone/-share/-open`; ours `CircleIconButton` group.
- Media block/options: Chad `.ms-sf-media` and options incl. `.-full-screen`; ours media container + desktop tabs + black fullscreen.
- Mobile actions row: Chad `.ms-sf-view-actions`; ours `grid-cols-4` row.
- Price/stats strip: Chad `.ms-sf-detail`; ours custom stat panel.
- Description + right rail: mapped but not token-matched.
- Fullscreen modal: Chad `#fullScreenModal/#galleryModal`; ours `isPhotoViewerOpen` overlay.
- Scroll lock: Chad body class lock; ours inline body/html lock.

## 4) Checklist Status from `TASK-IDX-OVERLAY-PARITY.md`

1. Desktop equal left/right gap: PASS
2. Desktop starts at top / covers header area: PASS
3. Close visible + works: PASS
4. ESC + backdrop close: PASS
5. No background scroll while open: PASS
6. Internal modal scroll smooth: PASS
7. Save/share/map/street-view functional: PASS (code-path)
8. Loading skeleton matches final geometry: FAIL
9. Mobile behavior mirrors Chad flow: PASS (behavioral)
10. npm run build clean: PASS

Additional blockers flagged:
- typography/spacing still materially off vs Chad
- header “open canonical” icon behavior correct but visually ambiguous vs gallery expand glyph
