# Opus 4.6 Handoff Prompt (Copy/Paste)

You are stepping in as orchestrator for a high-stakes IDX parity project.

## Mission
Rebuild parity between Andrew’s site and Chad Carroll’s IDX search/detail UX with **contract-level fidelity** (not approximation), while preserving architecture split and preventing regression.

## Environment + Project
- Repo: `/home/dreww/lux-mia-site`
- Andrew’s site: `https://iamandrewwhalen.com`
- Chad reference: `https://thechadcarrollgroup.com/search/`

## Business Context
This work will be productized and sold to other real estate professionals. Documentation quality must be high enough to become a repeatable delivery SOP.

## Critical Architecture Split (do not conflate)
1. **Overlay detail view** (opened from `/search` via intercepting route)
2. **Canonical detail page** (`/property/[listingKey]`) reached from overlay’s header external-link icon

Also note this separate control in overlay media:
- Black gallery expand icon + clicking photos => full-photo viewer mode

These are distinct behaviors and must remain distinct.

## Parallel Agent Setup (must be managed carefully)
Two Cursor agents are being used in parallel:
- **Cursor Codex**: overlay detail parity track
- **Cursor Cloud/Claude Code**: search grid/map/list parity track

### Safety rules
- Separate branches/worktrees
- Strict file ownership (no overlap)
- No push to `main` until orchestrator QA signoff
- Report-first, implementation-second discipline

Reference coordination doc:
- `/home/dreww/lux-mia-site/TASK-AGENT-COORDINATION.md`

## Existing Task Specs
- Overlay deep-dive task:
  - `/home/dreww/lux-mia-site/TASK-IDX-OVERLAY-PARITY-EXTREME.md`
- Search deep-dive task:
  - `/home/dreww/lux-mia-site/TASK-IDX-SEARCH-PARITY-EXTREME.md`

## Saved Reports (must read first)
- `/home/dreww/lux-mia-site/reports/IDX-SEARCH-PARITY-REPORT.md`
- `/home/dreww/lux-mia-site/reports/IDX-SEARCH-PARITY-REPORT-v2.md`
- `/home/dreww/lux-mia-site/reports/2026-02-22-orchestration-handoff/CURSOR-CODEX-OVERLAY-REPORT-RAW.md`
- `/home/dreww/lux-mia-site/reports/2026-02-22-orchestration-handoff/README.md`

## Current Known Truths
- Search report identified P0 blockers (toggle pattern, filter API wiring, card ratio, grid columns).
- Overlay report indicates behavior mostly wired but visual token parity still off and loading geometry mismatch remains.
- There are active local uncommitted changes from parallel work; do not blindly merge/push.

## Orchestrator Responsibilities
1. Validate report provenance (live shipped CSS/JS/DOM from Chad, not summary-only scraping).
2. Keep agents in lane by ownership and branch discipline.
3. Require PASS/FAIL matrices before any integration.
4. Sequence merges safely: one track at a time into integration branch.
5. Maintain production-grade documentation for future client delivery.

## Required Workflow
1. Read all task files + reports listed above.
2. Produce an updated orchestration plan with:
   - branch status
   - ownership boundaries
   - implementation order
   - QA gates
3. Approve/steer agents for next implementation steps.
4. Block push to `main` until both tracks pass QA checklist.
5. Write an updated summary at:
   - `reports/2026-02-22-orchestration-handoff/OPUS-ORCHESTRATION-STATUS.md`

## Non-Negotiables
- No corner cutting.
- No “close enough.”
- No mixing overlay and canonical page behavior.
- No undocumented decisions.

## Deliverable expected from you (Opus)
A clean orchestration status doc with:
- exact next prompts for each agent
- acceptance criteria per track
- merge plan
- rollback plan
- documentation artifact checklist for productizing this process.
