# Apps SDK UI Foundation Plan

Date: 2026-06-04
Branch: `feature/apps-sdk-ui-foundation`

## Goal

Start applying the OpenAI Apps SDK UI design system in a small, reversible task while reducing visual noise in the node canvas.

## Scope

- Add the Apps SDK UI package and required Tailwind 4 support only if the package structure confirms it is usable in this Next app.
- Add a local foundation bridge instead of replacing the whole xGen visual system.
- Reduce React Flow edge colors to two semantic line types:
  - input line: node and setting inputs flowing into output/canvas
  - output line: generated image, layer, mask, and element-result outputs
- Keep existing node port colors for node identity and handles in this first task.

## Before Screenshot

- `notes/screenshots/apps-sdk-ui-foundation-2026-06-04/before-fullscreen.png`

## References Checked

- Next App Router CSS guide: global CSS and Tailwind import are supported through `src/app/globals.css`.
- `@openai/apps-sdk-ui@0.2.2` npm metadata: React 18/19 peer support and Tailwind 4 peer dependency.

## Task Split

1. Task 1: Foundation bridge and two edge colors.
2. Task 2: Convert option/select controls to Apps SDK UI patterns.
3. Task 3: Convert token usage and backend selection panels.
4. Task 4: Broader node shell cleanup after visual QA.

## Verification Plan

- Run TypeScript/lint or a focused build check after the first task.
- Capture an after screenshot.
- Write a handoff/completion note for this task before moving to the next task.

## Risks

- Apps SDK UI may assume Tailwind layer setup that conflicts with the existing custom CSS token system.
- Full component replacement could change xGen's canvas identity too much, so the first task only bridges foundation tokens and line semantics.
