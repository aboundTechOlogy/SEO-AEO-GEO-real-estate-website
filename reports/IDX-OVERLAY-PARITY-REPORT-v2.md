# IDX Overlay Parity Report v2

## Scope
Overlay-only parity pass on:
- `src/components/PropertyDetailPanel.tsx`
- `src/app/search/@modal/(..)property/[listingKey]/loading.tsx`

Explicitly untouched (per safety constraint):
- `src/app/search/page.tsx`
- `src/components/SearchFilters.tsx`
- `src/components/SearchPropertyCard.tsx`
- `src/app/api/search/route.ts`
- `src/lib/bridge.ts`

## Updated PASS/FAIL Matrix
| Item | Status | Evidence |
|---|---|---|
| Desktop overlay has symmetric left/right gaps | PASS | `md:left-[25px] md:right-[25px]` + `1200px` center cap in modal + loading shell |
| Desktop overlay starts at top and fully covers header area | PASS | `fixed inset-0` shell retained |
| Close button always visible and works | PASS | Desktop top-right close + mobile close button still wired to `handleClose` |
| ESC and backdrop close work | PASS | Existing handlers preserved (`onEscape`, backdrop target checks) |
| Background page never scrolls while modal open | PASS | Existing body/html lock strategy unchanged |
| Internal modal scroll works smoothly | PASS | Existing `overflow-y-auto overscroll-contain` preserved |
| Save/share/map/street-view controls functional | PASS | Handlers preserved (`toggleSaved`, `shareListing`, `openMapView`, `openStreetView`) |
| Loading skeleton matches final modal geometry | PASS | Loading shell now mirrors header/media/action row + right rail geometry contract |
| Mobile behavior mirrors Chad flow (no desktop-only leakage) | PASS | Fullscreen triggers remain desktop-only; mobile action row and media controls remain scoped |
| `npm run build` passes clean | PASS | Build succeeded (Next.js production build completed) |

## Chad vs Ours Token Table (Before/After)
| Token | Chad Contract | Ours Before | Ours After |
|---|---|---|---|
| Overlay side gap (desktop/tablet) | `calc(100% - 50px)` | `28px` each side at `lg` | `25px` each side at `md` |
| Max modal width | `1200px` cap (legacy) / `1300px` content cap | `1200px` at `2xl` | `1200px` at `min-[1300px]` |
| Header row height | `70px` | Variable (content-driven) | `70px` fixed |
| Header padding | `10px 15px` | `py-3 px-4` | `py-[10px] px-[15px]` |
| Header title size | `20px` | `34/40/44px` | `20px` |
| Price size | `22px` | `58px` | `22px` |
| Stats strong/value size | `17px` (desktop can reach `24px`) | `42px` value + `34px` label | `17px` with `lg:24px` |
| Stats label size | `14px` family with compact labels | Oversized inline labels | `11px` (`lg:12px`) compact uppercase |
| Description title | `18px` | `30px` | `18px` |
| Description body | `14px`, `line-height:1.6` | `15px`, relaxed | `14px`, `1.6` |
| Description spacing | `20px 15px` | Split card style, larger rhythm | `px-[15px] py-[20px]` |
| Right rail width | `310px` at >=1024, `350px` at >=1300 | Fixed `340px` | `310px` / `350px` at >=1300 |
| Right rail sticky top | `82px` | `16px` | `82px` |
| Media (mobile) | `56.25%` ratio | `42vh` + min-height | `aspect-video` |
| Media (desktop) | `450px` | `62vh` + min/max | `450px` |
| Mobile action row height | `45px` | `56px` | `45px` |
| Gallery expand trigger size | `35px` contract in options view | `44px` | `35px` |
| Loading header row | Should match `70px` | `80px` | `70px` |
| Loading media geometry | Should match final media | `42vh/62vh` model | `aspect-video` mobile + `450px` desktop |
| Loading mobile action row | Should match final | `56px` | `45px` |

## Exact Controls Behavior Table
| Control | Behavior (v2) | Status |
|---|---|---|
| Header save icon | Toggle local saved state | PASS |
| Header share icon | Native share -> clipboard -> fallback window open | PASS |
| Header external-link icon | Opens canonical `/property/[listingKey]/` (not fullscreen) | PASS |
| Black gallery expand icon | Opens fullscreen photo viewer | PASS |
| Desktop photo click | Opens fullscreen photo viewer at selected index | PASS |
| Prev/next arrows | Cycles active photo | PASS |
| Street View | Opens Google Street View when coords valid | PASS |
| Map View | Opens Google Maps when coords valid | PASS |
| Mobile action row save/share/call/email | All wired and functional | PASS |
| Modal close button | Closes overlay (`router.back` after animation) | PASS |
| Backdrop click | Closes overlay | PASS |
| ESC key | Closes fullscreen first, then overlay | PASS |
| Fullscreen close/backdrop | Closes fullscreen viewer only | PASS |

## Exact Files Changed
- `src/components/PropertyDetailPanel.tsx`
- `src/app/search/@modal/(..)property/[listingKey]/loading.tsx`
- `reports/IDX-OVERLAY-PARITY-REPORT-v2.md`

## Build Result
- `npm run build`: PASS
