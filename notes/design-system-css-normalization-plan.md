# Design System CSS Normalization Plan

Date: 2026-06-10

## Issue

The design-system body content still appears visually pinned to the left, and DevTools shows background/color classes stacked across multiple elements. The current shell applies `bg-background text-foreground` while `.shadcn-docs-surface` also sets background, color, and font. Component-level shadcn classes then add their own surface tokens again.

## Before Evidence

- `notes/screenshots/design-system-css-normalization-2026-06-10/before-fullscreen.png`

## Plan

1. Make the design-system shell use CSS hook classes for surface, header, and body rail instead of repeating background/color utility classes.
2. Move body rail sizing into `.shadcn-docs-body` with explicit `width: min(...)` and `margin-inline: auto`.
3. Reduce `.shadcn-docs-surface` to page-level surface responsibility and keep component token styling on the components themselves.
4. Build, verify route response, capture after screenshot, and write completion/handoff notes.

## Expected Result

The body wrapper should be easy to identify in DevTools, centered independently of the header rail, and no longer carry repeated background/text utility classes.
