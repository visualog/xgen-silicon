# Background Detail Toggle Completion - 2026-06-23

## Summary

Changed the Background node detail controls from a dropdown-style disclosure button to an explicit toggle switch. The switch reveals the existing fine-tuning options only when enabled, keeping the default Background node compact while making the interaction state clearer.

## Screenshots

- Before: `notes/screenshots/background-detail-toggle-2026-06-23/before-fullscreen.png`
- After: `notes/screenshots/background-detail-toggle-2026-06-23/after-fullscreen.png`

## Files Changed

- `src/components/nodes/BackgroundNode.tsx`
  - Removed the chevron/dropdown affordance for `세부 조정`.
  - Added a `role="switch"` toggle with `aria-checked`.
  - Kept the existing detailed controls behind `isDetailOpen`.

## Verification

- `./node_modules/.bin/eslint src/components/nodes/BackgroundNode.tsx`
  - Passed with one existing Next.js `<img>` optimization warning in the reference thumbnail area.
- `npm run build:next`
  - Passed.
- `curl -sS --max-time 10 -I http://127.0.0.1:3002/`
  - Returned HTTP 200.

## Remaining Risks

- The screenshot captures the app shell and current node layout, but detailed visual review should still be done in the browser with the Background node open and closed.
