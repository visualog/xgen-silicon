# shadcn foundation compliance report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Rework `/design-system/components` to obey shadcn/ui foundation rules and improve cold initial load.

## Summary

Rebuilt `/design-system/components` around the installed local shadcn/ui primitives instead of custom-shaped layout and preview code.

The previous page mixed shadcn primitives with arbitrary bracket utilities, inline styles, heavy component preview functions, and a full detail overlay catalog rendered on the initial page. This pass removes that initial render burden and uses the default `Card`, `Button`, `Badge`, `Input`, and `ToggleGroup` spacing/typography behavior.

## Files changed

- `src/app/design-system/components/page.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/index.ts`
- `notes/shadcn-foundation-compliance-plan.md`
- `notes/shadcn-foundation-compliance-report.md`
- `notes/screenshots/shadcn-foundation-compliance-2026-06-05/`

## Foundation compliance

- Removed arbitrary active page utilities such as `max-w-[...]`, `min-h-[...]`, `w-[...]`, `grid-cols-[...]`, `text-[...]`, and inline `style` sizing from the page.
- Replaced custom prompt/search placeholders with the shadcn-style `Input` primitive.
- Kept component internals on the shadcn primitives' default padding and typography instead of overriding every `CardHeader`, `CardContent`, and `CardFooter`.
- Rebuilt layout from standard container/stack/grid patterns using Tailwind scale utilities.

## Performance impact

Before:

- Built route `Content-Length`: `581476` bytes.
- `src/app/design-system/components/page.tsx`: `1245` lines.
- Full component detail overlays and custom preview functions were present in the initial render path.

After:

- Built route `Content-Length`: `85444` bytes.
- `src/app/design-system/components/page.tsx`: `341` lines.
- Initial render now includes the hero, block cards, and lightweight catalog summary only.

## Verification

```bash
npm run build:next
```

Result:

- Passed.
- Next.js compiled successfully.
- TypeScript passed.
- Static generation completed for 19 pages.

Runtime:

```bash
curl -s -I --max-time 10 http://127.0.0.1:3013/design-system/components
```

Result:

- `HTTP/1.1 200 OK`
- `Content-Length: 85444`

Active Apps SDK UI check:

```bash
rg -n "@openai/apps-sdk-ui|apps-sdk-ui|Apps SDK UI" src package.json package-lock.json postcss.config.mjs
```

Result:

- No active code/package matches.

## Screenshots

- Before: `notes/screenshots/shadcn-foundation-compliance-2026-06-05/before-fullscreen.png`
- After: `notes/screenshots/shadcn-foundation-compliance-2026-06-05/after-fullscreen.png`

## Remaining risks

- The screenshot is a full-desktop capture, so other open windows are visible.
- This pass intentionally favors foundation compliance and load reduction over custom visual richness.
