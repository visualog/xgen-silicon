# Camera Angle Fixed Subject Fix

## Summary

- Fixed the Camera Angle WebGL preview so the subject cube stays fixed while the camera moves.

## Cause

- The preview was applying small yaw/pitch-based rotation to `subjectGroup` to make view changes more visible.
- That behavior conflicted with the Camera Angle node's meaning: camera angle should move the camera, not rotate the subject.

## Fix

- Reset `subjectGroup.rotation` to `(0, 0, 0)` inside camera model updates.
- Keep camera orbit position, lens direction, target line, lens cone, prompt model, and UI controls unchanged.

## Verification

- `npx eslint src/components/nodes/CameraAngleViewport.tsx src/components/nodes/CameraAngleNode.tsx` passed.
- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed.
