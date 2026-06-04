# Token Reference Budget Plan

Date: 2026-06-03

## Task

Continue reducing the 31,636 token image generation cost by limiting which references are attached as image inputs.

## Context

- Text prompt compaction is already active.
- Image input optimization is already active.
- Remaining high cost is likely caused by attaching too many image references.
- `sharp` resolves at runtime but is not listed as a direct dependency.

## Requirements

- Preserve visual quality for high-impact references.
- Do not attach low-impact references when a prompt/label can carry the intent.
- Keep mask/generated-layer references attached because they are spatial edit sources.
- Add explicit dependency stability for `sharp`.

## Small Tasks

1. Add a reference attachment budget in the worker.
2. Attach only strong style references by default; use text guidance for medium/subtle style references.
3. Attach only high/medium image mix references; use text guidance for low-impact mix references.
4. Always attach mask/generated-layer references.
5. Make style/mix text guidance show skipped references so quality direction is not lost.
6. Verify syntax, build, package, and app runtime.

## Verification Commands

- `node --check scripts/codex-worker.mjs`
- `npm run build:next`
- `npm run pack:mac`
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`

## Artifacts

- Before screenshot: `notes/screenshots/token-reference-budget-2026-06-03/before-fullscreen.png`
- Completion report: `notes/token-reference-budget-report.md`

## Pass Criteria

- Build passes.
- Worker keeps high-impact references attached.
- Worker skips low-impact image attachments while preserving prompt guidance.
- Packaged app runs.
