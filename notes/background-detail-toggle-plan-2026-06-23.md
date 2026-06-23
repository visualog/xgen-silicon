# Background Detail Toggle Plan

Date: 2026-06-23

## Goal

Replace the Background node's detail-section dropdown affordance with a proper toggle switch. When the switch is on, the fine-tuning controls are visible; when off, they are hidden.

## Before Screenshot

- `notes/screenshots/background-detail-toggle-2026-06-23/before-fullscreen.png`

## Scope

- Change only the Background node detail-section trigger.
- Remove the chevron/dropdown visual language.
- Keep the existing `isDetailOpen` state and all fine-tuning controls.
- Preserve recipe and background-reference behavior from the previous task.

## Verification Plan

- ESLint touched files.
- `npm run build:next`.
- Verify local app route returns `HTTP 200`.
- Capture after screenshot and write completion report.
