# shadcn Task 5 Report: Chart Performance

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`

## Summary

Reduced the initial route impact of the official shadcn chart/Recharts component on `/design-system/components`.

The chart remains installed and visible, but Recharts is no longer pulled through the `@/components/ui` barrel export path.

## Files Changed

- `src/components/LazyRenderProgressChart.tsx`
- `src/app/design-system/components/page.tsx`
- `src/components/ui/index.ts`
- `notes/shadcn-task5-chart-performance-plan.md`
- `notes/shadcn-task5-chart-performance-report.md`
- `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/before-fullscreen.png`
- `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/after-fullscreen.png`
- `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/after-chart-section-fullscreen.png`

## Before / After

- Before: `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/before-fullscreen.png`
- After: `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/after-fullscreen.png`
- Chart section: `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/after-chart-section-fullscreen.png`

## What Changed

- Added `LazyRenderProgressChart` as a small client boundary using `next/dynamic`.
- Changed `/design-system/components` to import `LazyRenderProgressChart` instead of importing `RenderProgressChart` directly.
- Removed `chart.tsx` exports from `src/components/ui/index.ts`.
- Kept the official shadcn chart component available through direct import:
  - `@/components/ui/chart`

## Measured Results

Before Task 5:

- Route HTML `Content-Length`: `115829`
- Recharts-related static chunks found:
  - `334433` bytes
  - `100470` bytes
- Route entry JS included the Recharts-related chunk path through the chart/barrel import chain.
- Approximate initial route entry JS from manifest: `~512KB`

After Task 5:

- Route HTML `Content-Length`: `114738`
- Recharts-related static chunk remains as async chart payload:
  - `336206` bytes
- Route entry JS no longer includes `src/components/ui/chart.tsx` or `RenderProgressChart`.
- Approximate initial route entry JS from manifest: `~127KB`

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|---:|---:|---|
| 1 | Accessibility | 3 | Dynamic chart fallback uses `role="status"` and `sr-only` loading text. |
| 2 | Performance | 3 | Recharts moved out of initial route entry, but still exists as a large async chunk. |
| 3 | Responsive Design | 3 | Chart container uses `h-64 w-full`; page grid remains responsive. |
| 4 | Theming | 4 | Fallback and chart section use semantic shadcn tokens. |
| 5 | Anti-Patterns | 3 | Chart is below fold and product-scoped, not decorative. |
| Total |  | 17/20 | Good |

## Verification

- `npm run build:next`: passed.
- `npx --yes shadcn@latest info`: passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3013/design-system/components`: returned `200 OK`.
- Manifest review confirmed the route now references `LazyRenderProgressChart`, not `RenderProgressChart` or `chart.tsx` directly.

## Remaining Risks

- Recharts is still a large dependency. This is expected for the official shadcn chart pattern, but it should not be repeated across more first-load surfaces without a product need.
- `src/components/ui/chart.tsx` should remain direct-import only. Re-exporting it through the UI barrel will pull chart code back toward the route entry.
