# Design Foundation Rules Report

Date: 2026-06-18

## Summary

Documented and applied the foundation rules discussed with the user.

The rules now distinguish between the compact design-system documentation shell and the Luma service UI examples shown inside the design-system site. They also define spacing, card structure, nested radius, border/divider discipline, grid layout, baseline rhythm, and CSS ownership.

## Files Changed

- `AGENTS.md`
  - Added concise BrandGen shadcn/ui operating rules.
  - Clarified that service UI and service previews use Luma.
  - Clarified that the `/design-system` documentation shell uses Vega/Rhea.
  - Added 4px grid, divider/border, nested radius, grid, and baseline rhythm rules.
- `docs/ui-style-system.md`
  - Added BrandGen style boundary.
  - Added spacing system.
  - Added Card slot structure explanation.
  - Added nested radius formula and examples.
  - Added divider and border discipline.
  - Added grid and baseline rhythm rules.
  - Added CSS ownership boundaries.
- `notes/design-foundation-rules-plan.md`
  - Planning note.
- `notes/design-foundation-rules-report.md`
  - Completion report.

## Screenshots

- Before: `notes/screenshots/design-foundation-rules-2026-06-18/before-fullscreen.png`
- After: `notes/screenshots/design-foundation-rules-2026-06-18/after-fullscreen.png`

## Verification

Command:

```bash
rg -n "BrandGen Style Boundary|Spacing System|Card Structure|Nested Radius|Divider And Border Discipline|Grid And Baseline Rhythm|CSS Ownership|4px|Vega/Rhea|service examples|agentOS|AGENTS" AGENTS.md docs/ui-style-system.md notes/design-foundation-rules-plan.md
```

Result:

- Passed. The expected operating rules and documentation sections are present.

## Process Compliance

The repository currently defines task workflow through `AGENTS.md`, not a separate `agentOS` file.

For this task:

- Created a planning note before edits.
- Captured a before screenshot.
- Applied the documentation and operating-rule updates.
- Captured an after screenshot.
- Created this completion report.

## Remaining Risks

- This pass updates rules only. It does not yet refactor the existing overlapping CSS.
- The current `/design-system` implementation still needs a follow-up cleanup to separate docs shell styling, service preview Luma styling, and primitive exceptions.
