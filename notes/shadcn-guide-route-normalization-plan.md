# shadcn guide route normalization plan

Date: 2026-06-08

## Scope

Normalize `/guide` after the shadcn conflict cleanup. This route is documentation-like, so it should follow the same foundation boundary as `/design-system/*` before touching the production editor surface.

## Before Screenshot

- `notes/screenshots/shadcn-guide-route-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `src/app/guide/page.tsx` uses inline `CSSProperties` for layout and typography.
- The page directly references archived xGen/design-md compatibility tokens such as `--ui-*`, `--bg-*`, `--text-*`, `--border-node`, and `--port-*`.
- It depends on production-specific classes such as `studio-topbar`, `brand-lockup`, `secondary-command`, `tool-pill`, and `system-pulse`.
- This creates drift from the shadcn foundation even though the page is a documentation/guide route.

## Tasks

1. Replace the custom inline style system with Tailwind utility classes backed by shadcn theme variables.
2. Render the page with installed shadcn primitives from `src/components/ui`.
3. Preserve guide content and information architecture.
4. Verify with targeted lint, production build, route smoke test, and after screenshot.

## Out Of Scope

- Do not refactor `src/app/page.tsx`.
- Do not migrate production node components in this task.
- Do not remove global compatibility tokens yet, because the editor still uses them.
