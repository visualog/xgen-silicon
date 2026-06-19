# Design System Raw Color Scale Report

Date: 2026-06-18
Route: `/design-system/foundation`

## Summary

Added the raw color scale layer underneath the semantic color section. The foundation page now shows the intended color structure:

```text
raw color scale -> semantic role/token -> component usage
```

The new section documents the current OKLCH values from the shadcn source tokens and maps each stop to the token names it backs.

## Before

![Before full-screen capture](./screenshots/design-system-raw-color-scale-2026-06-18/before-fullscreen.png)

## After

![After full-screen capture](./screenshots/design-system-raw-color-scale-2026-06-18/after-fullscreen.png)

## Files Changed

- `src/app/design-system/_data/foundation.ts`
  - Added `FoundationRawColorStop` and `FoundationRawColorScale`.
  - Added raw Neutral and Critical scales using the current OKLCH source values.
- `src/app/design-system/_components/foundation-page-content.tsx`
  - Added the Raw color scale section before Semantic color.
  - Each stop shows swatch, raw OKLCH value, mapped token names, and usage guidance.
- `notes/design-system-raw-color-scale-plan-2026-06-18.md`
  - Added the implementation plan.
- `notes/screenshots/design-system-raw-color-scale-2026-06-18/`
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

Result: first run failed while removing `.next/server` with `ENOTEMPTY`; immediate retry passed. The passing run compiled successfully, completed TypeScript, and generated `/design-system/foundation` as a static route.

## Remaining Risks

- The raw scale is documented in page data, not yet exported as first-class CSS primitive variables like `--neutral-100`. That is intentional for this pass to avoid introducing a second token system before the naming is approved.
- If xGen later needs success, warning, or info semantics, the raw palette should grow first, then semantic roles should map to those stops.

