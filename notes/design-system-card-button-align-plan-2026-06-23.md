# Design System Card Button Align Plan - 2026-06-23

## Scope

- Align the `보기` button in `/design-system` overview cards to the right.
- Keep the existing card structure, spacing, and shadcn/ui primitives.

## Before Evidence

- Screenshot: `notes/screenshots/design-system-card-button-align-2026-06-23/before.png`

## Files To Change

- `src/app/design-system/_components/page-sections.tsx`

## Expected Change

- Add right alignment to the `LinkCardGrid` card footer.
- Do not change button text, size, variant, or card content layout.

## Verification

- Run targeted lint on the changed file.
- Inspect the changed `/design-system` surface in the browser when possible.
