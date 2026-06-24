# Camera Angle WebGL Plan

## Context

- User requested the Camera Angle node to be implemented with WebGL.
- Object Angle already uses a small Three.js viewport with drag, keyboard control, double-click reset, and internal render-state checks.
- Camera Angle currently keeps a structured prompt model: `yaw`, `pitch`, `roll`, `lens`, and `distance`.

## Plan

1. Keep the existing camera prompt parser/formatter and model semantics unchanged.
2. Replace the current SVG/HTML orbit viewer with a new `CameraAngleViewport` Three.js component.
3. Preserve current controls for presets, axis snaps, distance, lens, advanced roll/lens sliders, prompt preview, reset, and output connection.
4. Make viewport interaction adjust only `yaw` and `pitch`; use the existing controls for `roll`, `lens`, and `distance`.
5. Verify with targeted lint, TypeScript, and build checks.

## Expected Result

The Camera Angle node should show a rendered 3D subject, orbit guide, camera marker, view direction, lens cone, and drag/keyboard controls while producing the same prompt format as before.
