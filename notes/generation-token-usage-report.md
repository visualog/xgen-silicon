# Generation Token Usage Report

Date: 2026-06-02

## Summary

Added token usage tracking for image generation. After a generation completes, the app can now show the token amount used from node-setting prompt processing through the final image generation step.

## Files Changed

- `scripts/codex-worker.mjs`
- `src/lib/codex-worker-client.ts`
- `src/app/api/generate/route.ts`
- `src/app/page.tsx`
- `src/components/nodes/CanvasNode.tsx`

## Implementation

- Extracts token usage from Codex JSONL events using several likely usage field shapes:
  - `usage`
  - `token_usage`
  - `tokenUsage`
  - `metrics.usage`
  - `item.usage`
- Normalizes usage into:
  - `inputTokens`
  - `outputTokens`
  - `cachedInputTokens`
  - `totalTokens`
- Tracks and sums generation-stage usage:
  - Node setting prompt composition
  - Result metadata generation
  - Final image generation
- Returns `tokenUsage` and `tokenUsageBreakdown` from `/api/generate`.
- Stores token usage on each generated gallery result.
- Shows token usage in:
  - Canvas node: detailed total/input/output/cache and stage breakdown.
  - Gallery card: compact total token count.

## Verification

- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Relaunched packaged app with `open -n release/mac/xGen.app`.
- App ports after relaunch:
  - `127.0.0.1:4317`: xGen Codex worker listening.
  - `127.0.0.1:3001`: packaged Next app listening.
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`: `HTTP/1.1 200 OK`.
- Packaged app resources refreshed:
  - `release/mac/xGen.app/Contents/Resources/next/server.js`: 2026-06-02 14:32:52

## Screenshots

- Before: `notes/screenshots/generation-token-usage-2026-06-02/before-fullscreen.png`
- After: `notes/screenshots/generation-token-usage-2026-06-02/after-fullscreen.png`

## Remaining Risks

- Existing generated images do not have historical token usage, so they will not show a token count until regenerated.
- If Codex CLI changes its JSONL usage event shape beyond the covered fields, the UI will omit usage instead of showing an incorrect number.
- A full end-to-end image generation was not run during verification to avoid spending another generation; validation covered build, packaging, and app runtime.
