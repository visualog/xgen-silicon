# BrandGen Stabilization Plan

Date: 2026-06-01

## Goal

Complete the BrandGen stabilization priorities before moving to Figma Weave reverse-engineering analysis.

## Priority Checklist

1. Create a release/handoff note for the current BrandGen state.
2. Investigate and fix, or document, the remaining gallery thumbnail `404` issue.
3. Re-verify Electron packaging behavior.
4. Re-verify the style reference generation path end to end.
5. Document commit grouping and large-file exclusion guidance.
6. Then collect current Figma Weave evidence and write a reverse-engineering analysis.

## Current Evidence

- `npm run build:next` passed on 2026-06-01.
- Next route handlers were checked against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`.
- The local BrandGen gallery store contains old image URLs such as `/api/gallery/image/result-1779843257921-imageUrl.png` without `source` query params or `imagePath` fields.
- The newer xGen gallery store contains image URLs with `source` query params and absolute `imagePath` fields, which match the current storage strategy.

## Screenshot Folder

`notes/screenshots/brandgen-stabilization-2026-06-01/`

## Planned Verification

- API checks for `/api/gallery` and representative `/api/gallery/image/...` paths.
- `npm run build:next`.
- `npm run pack:mac` or equivalent packaging validation.
- Style reference worker dry-run:
  - `node scratch/verify-style-reference-generation.mjs`
  - `node scripts/codex-worker.mjs --dry-run-style-reference`

## Risks

- Old gallery records may reference images that no longer exist anywhere on disk. In that case the correct fix is graceful handling and migration documentation, not inventing unavailable image files.
- Large `style-references/` and `sample/` folders must not be accidentally bundled or committed.

