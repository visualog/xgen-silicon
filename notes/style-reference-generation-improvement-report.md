# Style Reference Generation Improvement Report

- Date: 2026-05-30
- Goal source: `notes/style-reference-generation-improvement-meta-prompt.md`
- Planning note: `notes/style-reference-generation-improvement-plan.md`
- Worker dry-run artifact: `notes/style-reference-generation-improvement-worker-prompt-sample.md`
- Screenshot folder: `notes/screenshots/style-reference-generation-improvement-2026-05-30/`

## Result

Passed.

The style reference node now treats the active style reference image as a real generation reference instead of UI-only decoration. The generation payload sends the active style image, prompt, label, influence, and `style-only` mode to `/api/generate`, and the Codex worker attaches that image to the final `codex exec` image-generation request.

## What Changed

- `src/components/StyleAddModal.tsx`
  - `StyleEntry` now carries style influence metadata.
  - Newly added style references default to `weight: "medium"` and `mode: "style-only"`.
  - Library items tagged `needs-reference-image` are marked as image-required references.

- `src/components/nodes/StyleNode.tsx`
  - The active style card is labeled `생성에 사용`.
  - Inactive style cards are implicitly stored references, not sent to generation.
  - Added visible influence controls: `약하게`, `보통`, `강하게`.
  - Image-required references show `이미지 필수`.

- `src/components/nodes/OutputNode.tsx`
  - The prompt panel now states the active style reference image, influence, and style-only guard.

- `src/app/page.tsx`
  - Normalizes legacy style entries so older saved data gets `medium` style influence.
  - Builds `activeStyleReferenceImages` only from the connected active style.
  - Sends `styleReferenceImages` to `/api/generate`.
  - Adds truthful prompt preview lines for the active style image and style-only behavior.

- `src/app/api/generate/route.ts`
  - Accepts and forwards `styleReferenceImages`.

- `src/lib/codex-worker-client.ts`
  - Adds typed `styleReferenceImages` support to `generateViaWorker`.

- `scripts/codex-worker.mjs`
  - Normalizes `styleReferenceImages`.
  - Builds `STYLE REFERENCE IMAGES` structured prompt text.
  - Adds `ATTACHED STYLE REFERENCES` to the final generation instruction.
  - Serializes each style reference image into a temp file named `xgen-style-reference-*` and includes it in the `codex exec -i` image list.
  - Adds explicit content-leakage guards so style images transfer palette, medium, texture, lighting, rendering detail, atmosphere, and finish only.
  - Keeps the existing `IMAGE MIX REFERENCES` path intact.
  - Adds `--dry-run-style-reference` for deterministic prompt-path verification.

- `src/components/nodes/ImageMixNode.tsx`
  - Uses `Omit<StyleEntry, "weight">` so image mix can keep its existing `low | medium | high` weight scale while style references use `subtle | medium | strong`.

- `scratch/verify-style-reference-generation.mjs`
  - Verifies payload plumbing, worker guard text, image attachment behavior indicators, UI labels, and image mix preservation.

## Verification

```bash
node scripts/codex-worker.mjs --dry-run-style-reference > notes/style-reference-generation-improvement-worker-prompt-sample.md
```

Result: passed. The artifact shows:

- `styleReferenceCount: 1`
- `imageMixCount: 1`
- `hasStyleOnlyGuard: true`
- `hasImageMixGuard: true`
- final instruction includes `ATTACHED STYLE REFERENCES`
- final instruction includes `mode=style-only`

```bash
node scratch/verify-style-reference-generation.mjs
```

Result: passed.

```json
{
  "ok": true,
  "checks": 22,
  "dryRun": {
    "styleReferenceCount": 1,
    "imageMixCount": 1,
    "hasStyleOnlyGuard": true,
    "hasImageMixGuard": true
  }
}
```

```bash
npm run build:next
```

Result: passed. Next.js 16.2.6 compiled successfully, TypeScript completed, and 19 static pages were generated.

## Screenshots

Before:

- `before-fullscreen.png`
- `before-app-open.png`

After:

- `after-production-open.png`
- `after-style-reference-controls.png`

The key visual verification is `after-style-reference-controls.png`, which shows:

- active style label: `선택됨`
- active generation indicator: `생성에 사용`
- image-required indicator: `이미지 필수`
- influence controls: `약하게`, `보통`, `강하게`
- output prompt panel summary: style reference image, influence, and style-only guard

## Requirement Audit

| Requirement | Evidence | Status |
| --- | --- | --- |
| Active style reference image reaches generation worker | `page.tsx` sends `styleReferenceImages`; route and client forward it | Pass |
| Style reference image is attached to `codex exec` | worker serializes `xgen-style-reference-*` temp files and includes them in image paths | Pass |
| Style-only guard is present | dry-run artifact has `hasStyleOnlyGuard: true` and guard text | Pass |
| UI makes active style and influence clear | `after-style-reference-controls.png`; `StyleNode` labels and buttons | Pass |
| `needs-reference-image` is not treated as text-only | library entries carry `requiresImage`; UI marks `이미지 필수`; generation sends image URL | Pass |
| Existing image mix behavior is not broken | dry-run has `imageMixCount: 1` and `hasImageMixGuard: true` | Pass |
| `npm run build:next` passes | command completed successfully | Pass |
| Completion report documents verification evidence | this file | Pass |

## Remaining Risks

- This pass verifies the image attachment and final instruction deterministically, but it does not run a full paid/slow image-generation sample through Codex image output.
- User-uploaded external URL references still depend on whether the worker can fetch the URL at generation time.
- The first implementation intentionally uses only the active style reference for generation. Multi-style blending remains a future extension.
