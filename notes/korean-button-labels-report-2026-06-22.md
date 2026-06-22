# Korean Button Labels Report - 2026-06-22

## Summary

- Replaced remaining English labels in the current xGen editor button set with Korean.
- Localized React Flow canvas control labels through `ariaLabelConfig`.
- Localized gallery/workspace accessibility labels that appeared in the current screen snapshot.

## Changed Files

- `src/components/nodes/OutputNode.tsx`
- `src/app/page.tsx`
- `notes/korean-button-labels-plan-2026-06-22.md`
- `notes/korean-button-labels-report-2026-06-22.md`
- `notes/screenshots/korean-button-labels-2026-06-22/before.png`
- `notes/screenshots/korean-button-labels-2026-06-22/after.png`

## Screenshot Evidence

- Before: `notes/screenshots/korean-button-labels-2026-06-22/before.png`
- After: `notes/screenshots/korean-button-labels-2026-06-22/after.png`

## Verification

- `npx eslint src/components/nodes/OutputNode.tsx src/app/page.tsx`
  - Result: passed with 0 errors.
  - Existing warnings remain in `src/app/page.tsx` for unused prompt helper functions.
- `npm run build`
  - Result: blocked by local darwin/x64 optional native binding availability.
  - Error: Turbopack native bindings were unavailable and only WASM bindings loaded.
- `npx next build --webpack`
  - Result: blocked by missing local optional native package `lightningcss.darwin-x64.node`.
  - This occurred while compiling existing CSS imports and is not tied to the label changes.
- Browser DOM verification on `http://localhost:3000/`
  - Editor screen had no matches for:
    - `Compose`
    - `Use For Generation`
    - `Copy`
    - `Light theme`
    - `Dark theme`
    - `Toggle Theme`
    - `Editor mode controls`
    - `Zoom In`
    - `Zoom Out`
    - `Fit View`
    - `Control Panel`

## Remaining Risks

- Non-button product terms such as `xMark` and library-generated attribution text remain unchanged by design.
