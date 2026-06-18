# Design System CSS Task 3 Plan - Token Boundary

Date: 2026-06-10

## Goal

Clarify shadcn token source-of-truth and reduce token collisions in `src/app/globals.css`.

## Before Evidence

- `notes/screenshots/design-system-css-task3-token-boundary-2026-06-10/before-fullscreen.png`

## Findings

- `@layer base body` already applies `bg-background text-foreground`.
- A later global `html, body` rule overrides that with `background-color: var(--bg-canvas)`, `color: var(--text-primary)`, and `font: var(--ui-type-base)`.
- Root tokens mix shadcn source tokens and xGen compatibility aliases without a clear boundary.

## Plan

1. Mark shadcn tokens as the source-of-truth section.
2. Mark `--ui-*`, `--surface-*`, `--bg-*`, `--text-*`, and component aliases as migration compatibility aliases.
3. Remove color/font overrides from the later `html, body` rule so shadcn base tokens remain authoritative.
4. Build, verify design-system routes, capture after screenshot, and write report/handoff.
