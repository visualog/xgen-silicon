# Object Angle WebGL Pitch Direction Report

## Summary

- Fixed the Object Angle node's vertical visual rotation direction.
- Kept drag, keyboard, and prompt pitch semantics unchanged.
- Inverted only the Three.js X-axis rotation used by the WebGL object preview.

## Changed Files

- `src/components/nodes/ObjectAngleViewport.tsx`
- `notes/object-angle-webgl-pitch-direction-plan-2026-06-23.md`

## Verification

- `npx eslint src/components/nodes/ObjectAngleViewport.tsx` passed.
- `npx tsc --noEmit --pretty false` passed.

## Notes

- Positive pitch still means a top-down object tilt in the generated prompt.
- The visual preview now compensates for Three.js X-axis direction so vertical dragging feels aligned with the user's drag direction.
