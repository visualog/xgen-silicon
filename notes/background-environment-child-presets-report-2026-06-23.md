# Background Environment Child Presets Completion - 2026-06-23

## Summary

Changed Background node detail controls to an environment-first progressive disclosure structure. The detail switch still reveals the detail area, but the area now shows `환경` first and then only the child preset groups mapped to that environment.

## Environment Mapping

- `pure`: surface, treatment
- `studio`: surface, depth, treatment
- `workspace`: surface, detail, cleanliness
- `interior`: depth, detail, treatment
- `outdoor`: depth, treatment
- `urban`: surface, depth, detail
- `abstract`: depth, treatment, surface

## Screenshots

- Before: `notes/screenshots/background-environment-child-presets-2026-06-23/before-fullscreen.png`
- After: `notes/screenshots/background-environment-child-presets-2026-06-23/after-fullscreen.png`

## Files Changed

- `src/components/nodes/BackgroundNode.tsx`
  - Added `ChildPresetKey`.
  - Added `ENVIRONMENT_CHILD_PRESETS`.
  - Added `CHILD_PRESET_LABEL`.
  - Replaced always-visible fine-tuning groups with environment-based child group rendering.
- `notes/background-environment-child-presets-plan-2026-06-23.md`
  - Added implementation plan.

## Verification

- `./node_modules/.bin/eslint src/components/nodes/BackgroundNode.tsx`
  - Passed with one existing Next.js `<img>` optimization warning in the background reference thumbnail.
- `npm run build:next`
  - Passed.
- `curl -sS --max-time 10 -I http://127.0.0.1:3002/`
  - Returned HTTP 200.

## Remaining Risks

- Automated browser interaction was not run because Playwright is not installed in the current `node_modules`.
- Manual browser review should confirm each environment shows the intended child preset groups after toggling `세부 조정` on.
