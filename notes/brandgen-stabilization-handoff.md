# BrandGen Stabilization Handoff

Date: 2026-06-01

## Summary

BrandGen stabilization priorities were reviewed after the IntentCanvas split. The current BrandGen direction is to preserve the existing node-based image generation workspace and finish the active style reference, output settings, packaging, and QA work cleanly.

## Changes Made In This Pass

- Aligned the default local data directory with the Electron product name `xGen`.
  - File: `src/lib/app-settings.ts`
  - Previous default: `~/Library/Application Support/BrandGen/data`
  - New default: `~/Library/Application Support/xGen/data`
- Added `.gitignore` exclusions for large local source/reference folders:
  - `codex/`
  - `sample/`
  - `style-references/`
- Created stabilization planning and evidence files:
  - `notes/brandgen-stabilization-plan.md`
  - `notes/brandgen-stabilization-handoff.md`

## Gallery 404 Finding

The previously observed gallery thumbnail `404` was caused by a data-path mismatch.

- Standalone Next defaulted to `~/Library/Application Support/BrandGen/data`.
- Packaged Electron uses `app.getPath("userData")`, and the app name is set to `xGen`, so packaged app data lives under `~/Library/Application Support/xGen/data`.
- The old BrandGen gallery store had 25 records with image URLs such as `/api/gallery/image/result-1779843257921-imageUrl.png`, but those records did not include `source` query params or `imagePath` fields.
- The current xGen gallery store has 19 records with `source` query params and absolute `imagePath` fields.

After aligning the default data dir with `xGen`, standalone verification reads the current xGen gallery records and the first gallery image returns `200 OK`.

## Screenshot Evidence

Folder:

`notes/screenshots/brandgen-stabilization-2026-06-01/`

Files:

- `before-gallery-default-data.png`
  - Captured before the data-dir alignment.
  - Standalone server read the old BrandGen gallery store.
- `after-gallery-xgen-data.png`
  - Captured after the data-dir alignment.
  - Browser-side check found 19 gallery images and 0 broken images.

## Verification Commands

```bash
npm run build:next
```

Result: passed.

```bash
node scratch/verify-style-reference-generation.mjs
```

Result: passed with 22 checks.

```bash
node scripts/codex-worker.mjs --dry-run-style-reference > notes/style-reference-generation-improvement-worker-prompt-sample.md
```

Result: passed. The dry-run prompt includes style-only guardrails and attached style reference metadata.

```bash
npm run pack:mac
```

Result: passed. `electron-builder` skipped code signing because no valid signing identity is installed.

```bash
du -sh release/mac/xGen.app .next/standalone data/style-reference-library.json
find release/mac/xGen.app/Contents/Resources -maxdepth 4 -name style-references -o -name style-reference-library.json
find release/mac/xGen.app/Contents/Resources/next/data -maxdepth 2 -type f -print -exec ls -lh {} \;
```

Result:

- `release/mac/xGen.app`: 647M
- `.next/standalone`: 44M
- `data/style-reference-library.json`: 460K
- Packaged app includes `release/mac/xGen.app/Contents/Resources/next/data/style-reference-library.json`.
- The full local `style-references/` source folder is not bundled into app resources.

## Commit Grouping Recommendation

Recommended commit groups:

1. Style reference library and modal
   - `scripts/build-style-reference-library.mjs`
   - `scripts/collect-style-reference.mjs`
   - `scripts/collect-aurora-prompts.mjs`
   - `scripts/organize-aurora-prompts.mjs`
   - `src/app/api/style-references/**`
   - `src/lib/style-reference-library.ts`
   - `data/style-reference-library.json`
   - `src/components/StyleAddModal.tsx`
   - related notes and screenshots

2. Style reference generation prompt handoff
   - `scripts/codex-worker.mjs`
   - `src/lib/codex-worker-client.ts`
   - `src/app/api/generate/route.ts`
   - `src/app/page.tsx`
   - `src/components/nodes/StyleNode.tsx`
   - `src/components/nodes/OutputNode.tsx`
   - `src/components/nodes/ImageMixNode.tsx`
   - `scratch/verify-style-reference-generation.mjs`
   - related notes and prompt sample

3. UI/UX QA and output settings
   - `src/components/nodes/PromptNode.tsx`
   - `src/components/nodes/OutputSettingsNode.tsx`
   - `src/components/nodes/RatioNode.tsx`
   - `scratch/run-ui-ux-scroll-qa.mjs`
   - related notes and screenshots

4. Electron/runtime stabilization
   - `electron/dev.mjs`
   - `electron/main.mjs`
   - `next.config.ts`
   - `package.json`
   - `src/lib/app-settings.ts`
   - `.gitignore`
   - `notes/brandgen-stabilization-plan.md`
   - `notes/brandgen-stabilization-handoff.md`

## Do Not Commit

These are local/source/generated folders and should remain excluded:

- `codex/` currently about 495M
- `sample/` currently about 214M
- `style-references/` currently about 267M
- `release/`
- `.next/`

## Remaining Risks

- macOS code signing is not configured, so packaged app validation is unsigned-dir packaging only.
- Old records under `~/Library/Application Support/BrandGen/data/gallery.json` still exist on disk, but the app now defaults to `xGen/data`. Keep this in mind only if a user explicitly needs legacy BrandGen gallery migration.
- Style reference generation is verified through deterministic prompt-path checks, not a live external image generation call.

