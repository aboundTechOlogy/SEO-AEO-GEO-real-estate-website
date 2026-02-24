# 2026-02-22 Orchestration Handoff Snapshot

## Saved Reports
- `IDX-SEARCH-PARITY-REPORT.md`
- `IDX-SEARCH-PARITY-REPORT-v2.md`
- `CURSOR-CODEX-OVERLAY-REPORT-RAW.md` (raw paste from chat)

## Task Specs
- `/home/dreww/lux-mia-site/TASK-IDX-OVERLAY-PARITY-EXTREME.md`
- `/home/dreww/lux-mia-site/TASK-IDX-SEARCH-PARITY-EXTREME.md`
- `/home/dreww/lux-mia-site/TASK-AGENT-COORDINATION.md`

## Parallel-Agent Safety Rules
- Codex owns overlay detail files only.
- Claude Cloud Code owns search grid/map/list files only.
- No pushes to `main` until orchestration approval.

## Working Tree State (at handoff)
There are local uncommitted changes from active agent work. Verify with:
`git status --short`

## Intent
Use Opus 4.6 as orchestrator for:
- prompt generation
- contract QA
- artifact documentation
- merge sequencing and push controls
