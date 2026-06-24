# Background Environment Child Presets Plan - 2026-06-23

## Goal

Change Background node detail controls from showing every fine-tuning group at once to a progressive environment-first structure. The user should choose an environment first, then only see the sub-presets that matter for that environment.

## Before Screenshot

- `notes/screenshots/background-environment-child-presets-2026-06-23/before-fullscreen.png`

## Scope

- Keep the existing background recipe, reference image, and detail toggle behavior.
- Keep `Environment` as the first detail control.
- Render only environment-relevant child preset groups below it.
- Preserve the existing `BackgroundModel` fields and prompt format so saved snapshots and worker prompt assembly remain compatible.

## Proposed Environment Mapping

- `pure`: surface, treatment
- `studio`: surface, depth, treatment
- `workspace`: surface, detail, cleanliness
- `interior`: depth, detail, treatment
- `outdoor`: depth, treatment
- `urban`: surface, depth, detail
- `abstract`: depth, treatment, surface

## Verification Plan

- Targeted eslint for `BackgroundNode.tsx`.
- `npm run build:next`.
- Verify local route returns HTTP 200.
- Capture after screenshot.
- Write completion report.
