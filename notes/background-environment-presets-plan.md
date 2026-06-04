# Background Environment Presets Plan

Date: 2026-06-02

## Request

When selecting an environment in the background node, the preset controls below should be composed from presets that fit the selected environment.

## Current State

- `src/components/nodes/BackgroundNode.tsx` defines one global option list for each control.
- Environment, surface, depth, detail, treatment, and cleanliness are independent.
- Changing the environment only updates `environment`; it does not adjust the lower preset controls.

## Plan

1. Add environment-specific preset groups for surface, depth, detail, treatment, and cleanliness.
2. When the environment changes, apply that environment's default lower-control values.
3. Render lower-control option lists from the selected environment preset group instead of the global list.
4. Preserve custom additional background text when the environment changes.
5. Verify with `npm run build:next`.

## Screenshots

- Before: `notes/screenshots/background-environment-presets-2026-06-02/before-fullscreen.png`
