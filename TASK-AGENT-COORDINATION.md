# Agent Coordination Protocol (Cursor Codex + Cursor Cloud Code)

## Goal
Run both agents in parallel without stomping files or introducing hidden regressions.

## Hard Rules
1. **Separate branches, always**
   - Codex branch: `feat/idx-overlay-parity-codex`
   - Cloud Code branch: `feat/idx-search-parity-cloudcode`
2. **Separate working directories/worktrees** (recommended)
   - Never run both agents in same live file tree.
3. **No pushes to `main`** until both reports are approved.
4. **No broad formatting/refactors** outside owned files.
5. **Each agent outputs report first, implementation second.**

## File Ownership (No Overlap)
### Codex (Overlay Detail)
- `src/components/PropertyDetailPanel.tsx`
- `src/app/search/@modal/(..)property/[listingKey]/loading.tsx`
- optional: `src/app/search/@modal/(..)property/[listingKey]/page.tsx`

### Cloud Code (Search Grid/Map/List)
- `src/app/search/page.tsx`
- `src/components/SearchPropertyCard.tsx`
- `src/components/SearchFilters.tsx`
- `src/components/PropertyMap.tsx`
- any search-list/map specific components

## Forbidden Cross-Edits
- Cloud Code must not edit overlay detail files.
- Codex must not edit search list/map/grid files.

## Reporting Contract (Required)
Each agent must produce:
- report file in `/reports`
- PASS/FAIL checklist
- token table (Chad vs ours)
- exact files changed
- `npm run build` result

## Integration Sequence
1. Review Codex report + patch (overlay only)
2. Review Cloud Code report + patch (search only)
3. Merge one branch at a time into integration branch:
   - `integration/idx-parity`
4. Full build + quick regression check
5. Then and only then merge to `main`

## Conflict Protocol
If both touched same file accidentally:
1. Stop both agents.
2. Keep owner branch version only.
3. Re-run non-owner task with updated ownership constraints.

## Commit Message Prefixes
- Codex: `idx-overlay:`
- Cloud Code: `idx-search:`

## Minimum QA Gate Before Any Push
- No TypeScript errors
- Build passes
- No background scroll bleed in overlay
- Correct icon behavior split:
  - Header external-link icon => canonical detail page
  - Gallery expand / photo click => fullscreen viewer
