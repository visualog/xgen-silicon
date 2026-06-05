# shadcn Header Alignment Plan

Date: 2026-06-05

## Scope

Align the `/design-system/components` header with the shadcn/ui site header pattern before continuing deeper layout and component work.

## Before Capture

- `notes/screenshots/shadcn-header-alignment-2026-06-05/before-fullscreen.png`

## Observed Drift

- Current header foregrounds the `xGen` brand, while the shadcn reference starts with compact documentation navigation.
- Navigation set is incomplete compared with the reference: missing Charts, Directory, and Create.
- The search placeholder is generic instead of documentation-oriented.
- Right-side utilities do not match the reference rhythm: GitHub, star count, theme icon, and New action are not represented.

## Implementation Tasks

1. Rebuild the header with installed shadcn/ui primitives and existing Tailwind token classes.
2. Keep spacing, type, height, and color on the project/shadcn token scale only.
3. Add the reference navigation pattern and right-side utility controls.
4. Verify with build, runtime 200 check, and after screenshot.
