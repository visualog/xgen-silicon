# Style Reference Library Completion Report

Date: 2026-05-29

## Scope

- Added a local style reference manifest build step.
- Added Next API routes for style reference metadata and image serving.
- Added a `라이브러리` tab to the style reference add modal.
- Kept original reference images outside the Electron package and included only the compact manifest.

## Implementation

- `scripts/build-style-reference-library.mjs`
  - Reads collected records from `style-references/*/items/*.json`.
  - Generates `data/style-reference-library.json`.
  - Current manifest count: 314 items.

- `src/lib/style-reference-library.ts`
  - Reads the manifest.
  - Strips local file paths from client metadata.
  - Resolves image files only through validated `collection` and `id` route tokens.
  - Uses `XGEN_STYLE_REFERENCE_ROOT` when a custom local reference root is needed.

- `src/app/api/style-references/route.ts`
  - Returns client-safe library metadata.

- `src/app/api/style-references/image/[collection]/[id]/route.ts`
  - Serves reference thumbnails from the local reference root.

- `src/components/StyleAddModal.tsx`
  - Added upload / URL / library segmented tabs for style mode.
  - Added search, category filters, style tag filters, and selectable library cards.
  - Selecting a library card adds it to the style reference node as a `StyleEntry`.

- `next.config.ts`
  - Excludes `style-references/**/*` from output tracing so source images are not bundled into the app.

## Screenshots

- Before: `notes/screenshots/style-reference-library-2026-05-29/before-fullscreen.png`
- After: `notes/screenshots/style-reference-library-2026-05-29/after-fullscreen.png`

## Verification

- `npm run build:style-reference-library`
  - Passed.
  - Wrote 314 style reference items to `data/style-reference-library.json`.

- Targeted ESLint:
  - Passed with 0 errors.
  - Remaining warnings are existing/new `<img>` usage warnings from Next lint.

- `npm run build:next`
  - Passed.
  - Verified the production route list includes:
    - `/api/style-references`
    - `/api/style-references/image/[collection]/[id]`

- `npm run pack:mac`
  - Passed.
  - Electron-builder warning remains for missing app `description`, `author`, and macOS code signing identity.

- Bundle check:
  - `.next/standalone`: 44 MB
  - `data/style-reference-library.json`: 460 KB
  - `style-references`: 267 MB
  - `release/mac`: 646 MB
  - Confirmed original `style-references` image folders are not copied into `release/mac`.
  - Confirmed only `data/style-reference-library.json` is copied into packaged app resources.

## Direct xGen Retest

- Opened the packaged xGen app from `release/mac/xGen.app`.
- Confirmed the app-owned Next server was running on `127.0.0.1:3001`.
- Found a packaging/runtime bug during direct testing:
  - `/api/style-references` returned the 314-item manifest.
  - `/api/style-references/image/...` returned 404 because the source image folder is intentionally excluded from the app bundle, but the packaged Next server did not receive an external reference root path.
- Fixed Electron startup so packaged and dev Electron modes pass `XGEN_STYLE_REFERENCE_ROOT` to the Next server when a local `style-references` folder exists.
- Rebuilt with `npm run pack:mac`.
- Confirmed after the fix:
  - `/api/style-references` returns 314 items.
  - `/api/style-references/image/aurora-prompts/001-nttxjRjN0` returns `200 OK` with `content-type: image/png`.
  - Original `style-references` source folder remains outside `release/mac`.
  - Packaged app includes only the manifest at `release/mac/xGen.app/Contents/Resources/next/data/style-reference-library.json`.
- Direct screenshot after the fix:
  - `notes/screenshots/style-reference-library-2026-05-29/direct-xgen-after-fix.png`

Limitation:

- Automated GUI clicking in the native xGen window was blocked by macOS Accessibility permission: `osascript에 보조 접근이 허용되지 않습니다 (-25211)`.
- Visual verification still confirmed loaded reference thumbnails in the running xGen app, and API verification confirmed the packaged app can now serve the library images.

## Notes

- The development server on port 3000 was an old running process and returned 404 for the new route.
- A separate dev server started on port 3010 but local `curl` requests timed out in this session, so route validation relied on production build, route manifest, packaging output, and packaged app launch.
- The packaged xGen app opened successfully after `npm run pack:mac`.
