# Design System Raw Color Scale Plan

Date: 2026-06-18
Route: `/design-system/foundation`

## Problem

The foundation page now has primitive color tokens and semantic color roles, but it still lacks the raw color scale layer underneath them. The intended structure should be:

```text
raw color scale -> semantic role/token -> component usage
```

## Before

![Before full-screen capture](./screenshots/design-system-raw-color-scale-2026-06-18/before-fullscreen.png)

## Scope

- Document the current raw OKLCH values that back the shadcn source tokens.
- Do not introduce unrelated brand colors or a second token system.
- Show how raw stops map to current CSS variables and semantic roles.
- Keep the change scoped to `/design-system/foundation`.

## Plan

1. Add raw color scale data for neutral and critical color families.
2. Render a Raw color scale section before the semantic color section.
3. Show each stop's value, mapped token names, and usage guidance.
4. Verify lint, route response, build, and after screenshot.

