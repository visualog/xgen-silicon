# Object angle WebGL plan

## Context

- Date: 2026-06-23
- Surface: xGen image-generation canvas
- Target node: `src/components/nodes/ObjectAngleNode.tsx`
- Before screenshot: `notes/screenshots/object-angle-webgl-2026-06-23/before.png`

## Goal

Improve the object-angle adjustment UX by replacing the current CSS/SVG-style
spherical orientation control with a lightweight WebGL/Three.js mini viewport.

## Scope

This task is limited to the Object Angle node first. The Camera Angle node should
keep its current UI, but the new implementation should establish a pattern that
can be reused there later.

## Implementation Plan

1. Add `three` as the WebGL runtime dependency.
2. Create a focused reusable `ObjectAngleViewport` component.
3. Render a dark-token-aware Three.js scene with:
   - a central object proxy
   - orientation grid/rings
   - front/back/side visual cues
   - a marker and drag interaction bound to yaw/pitch
4. Keep the existing `yaw`/`pitch` parsing and prompt formatting contract.
5. Add reduced-motion/performance protections:
   - render on state/input changes, not a continuous animation loop
   - cap pixel ratio
   - dispose Three.js resources on unmount
6. Verify in browser:
   - canvas is nonblank
   - drag changes yaw/pitch
   - no layout overlap
   - desktop and mobile viewport checks

## Risks

- `three` changes app/package-lock state.
- WebGL canvas inside React Flow nodes must avoid wheel/drag conflicts.
- Canvas pixel verification is needed because visual failure may not appear in DOM text.
