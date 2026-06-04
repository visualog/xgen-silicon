# Token Usage Reduction Report

Date: 2026-06-02

## Summary

Applied the first TCREI iteration for token reduction. The high-cost prompt pipeline now avoids repeated Codex prompt rewriting for node settings and avoids the separate metadata Codex call during image generation.

## Changes

- `src/app/page.tsx`
  - Added compact deterministic execution prompt composition.
  - Replaced long `AUTHORITATIVE NODE SETTINGS` prompt expansion with a shorter structured brief.
  - Kept quality-critical guards: style-only reference behavior, role-weighted image mix, locks, orientation/mask instructions, no text/logo/watermark.

- `scripts/codex-worker.mjs`
  - `/translate` now returns a compact deterministic prompt instead of calling Codex.
  - `generateImageWithCodex` no longer re-attaches node settings/style references/image mix data when a prebuilt compact prompt is already provided.
  - Removed the separate Codex metadata generation call from the image generation path.
  - Final image instruction was shortened and de-duplicated.
  - Token breakdown now records prompt composition stages as `0` token model stages and keeps final image usage when available.

## Expected Token Reduction

- Node setting prompt generation: model token use reduced to 0 for the normal `/translate` path.
- Final prompt composition: model token use reduced to 0 when using the prebuilt compact execution prompt.
- Metadata generation: removed from image generation, reducing one extra Codex call per image.
- Final image generation: prompt is now shorter and avoids duplicated authoritative settings, style reference text, and image mix text.

## Verification

- `node --check scripts/codex-worker.mjs`: passed.
- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Relaunched app with `open -n release/mac/xGen.app`.
- App ports:
  - `127.0.0.1:4317`: worker listening.
  - `127.0.0.1:3001`: packaged Next app listening.
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`: `HTTP/1.1 200 OK`.
- `/api/translate` verification returned compact prompt immediately:
  - `xGen image brief.`
  - `Subject: 고급 스킨케어 병`
  - `Aspect ratio: 1:1`
  - `Resolution: HD`
  - `Background: clean studio background`
  - quality/no-text guard
- Packaged app resources refreshed:
  - `release/mac/xGen.app/Contents/Resources/next/server.js`: 2026-06-02 21:42:03

## Screenshots

- Before: `notes/screenshots/token-usage-reduction-2026-06-02/before-fullscreen.png`
- After: `notes/screenshots/token-usage-reduction-2026-06-02/after-fullscreen.png`

## Remaining Risks

- A full image generation was not run in this iteration, so the exact post-change token ratio needs one real generation sample.
- Quality should remain stable because constraints were compacted rather than removed, but visual comparison is still required.
- Some high-cost worker functions remain for other features such as style analysis and consistency analysis; this iteration only targets the main image-generation prompt path.

## Next Task

Run one controlled generation sample and compare:

- node setting prompt token use
- final prompt composition token use
- final image generation token use
- output quality against the previous prompt style

If quality drops, add only the missing quality guard back as a compact deterministic line.
