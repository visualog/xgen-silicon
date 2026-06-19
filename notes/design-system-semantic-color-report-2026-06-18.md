# Design System Semantic Color Report

Date: 2026-06-18
Route: `/design-system/foundation`

## Summary

Added a semantic color layer to the foundation page. The page now distinguishes primitive color tokens from semantic color roles, so color is documented as an information system rather than a simple list of CSS variables.

## Before

![Before full-screen capture](./screenshots/design-system-semantic-color-2026-06-18/before-fullscreen.png)

## After

![After full-screen capture](./screenshots/design-system-semantic-color-2026-06-18/after-fullscreen.png)

## Files Changed

- `src/app/design-system/_data/foundation.ts`
  - Added `FoundationSemanticColor`.
  - Added semantic roles for Canvas, Surface, Primary content, Secondary content, Action, Focus, and Critical.
- `src/app/design-system/_components/foundation-page-content.tsx`
  - Added the Semantic color section between primitive color tokens and typography.
  - Each role now shows meaning, usage, source token names, and a small preview.
- `notes/design-system-semantic-color-plan-2026-06-18.md`
  - Added the implementation plan.
- `notes/screenshots/design-system-semantic-color-2026-06-18/`
  - Added before and after full-screen captures.

## Verification

```bash
npm run lint -- src/app/design-system/_components/foundation-page-content.tsx src/app/design-system/_data/foundation.ts src/app/design-system/foundation/page.tsx
```

Result: passed.

```bash
curl -s -I --max-time 10 http://127.0.0.1:3000/design-system/foundation
```

Result: `HTTP/1.1 200 OK`.

```bash
npm run build:next
```

Result: first run failed while removing `.next/build` with `ENOTEMPTY`; immediate retry passed. The passing run compiled successfully, completed TypeScript, and generated `/design-system/foundation` as a static route.

## Remaining Risks

- Semantic roles currently map to existing shadcn source tokens. If the product later introduces success, warning, or info status colors, they should be added as explicit semantic tokens instead of one-off palette values.
- The page documents meaning and usage, but it does not yet enforce token usage automatically in code.

