# Camera Angle Lens Direction Fix

## Summary

- Fixed the Camera Angle WebGL marker so the lens faces the subject cube.
- The camera orbit position, prompt model, yaw, pitch, roll, lens, and distance values are unchanged.

## Cause

- The camera group is oriented with `lookAt(0, 0, 0)`, but the visible lens mesh was attached to the opposite local Z side of the camera body.
- This made the camera position correct while the lens appeared to point away from the subject.

## Fix

- Moved the lens mesh to the target-facing side of the camera body.

## Verification

- `npx eslint src/components/nodes/CameraAngleViewport.tsx src/components/nodes/CameraAngleNode.tsx` passed.
- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed.
