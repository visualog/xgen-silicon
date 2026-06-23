# Object angle WebGL report

## Summary

Implemented the first WebGL angle-control pass for the xGen Object Angle node.

The node now keeps the existing prompt contract (`yaw` / `pitch` parsed from and
written back into `objectAngle`) while replacing the old CSS 3D sphere control
with a small Three.js viewport.

## Files Changed

- `package.json`
- `package-lock.json`
- `src/components/nodes/ObjectAngleNode.tsx`
- `src/components/nodes/ObjectAngleViewport.tsx`
- `notes/object-angle-webgl-plan-2026-06-23.md`
- `notes/object-angle-webgl-report-2026-06-23.md`
- `notes/screenshots/object-angle-webgl-2026-06-23/`

## Implementation

- Added `three` runtime dependency.
- Added `@types/three` development dependency.
- Created `ObjectAngleViewport`:
  - dynamically imports Three.js on the client
  - renders a central object proxy, edge outlines, orbit rings, and a front marker
  - updates object rotation from `yaw` and `pitch`
  - supports pointer drag, arrow-key adjustment, and double-click reset
  - caps pixel ratio for small-node performance
  - renders only on setup/resize/state changes, not a continuous animation loop
  - disposes Three.js resources on unmount
- Replaced the old CSS 3D sphere inside `ObjectAngleNode` with the new viewport.
- Preserved preset buttons, node output chip, labels, and prompt generation.

## Verification

Commands:

- `npx eslint src/components/nodes/ObjectAngleNode.tsx src/components/nodes/ObjectAngleViewport.tsx`
  - Passed.
- `npx tsc --noEmit --pretty false`
  - Passed.
- `npm run build`
  - First sandboxed attempt failed because Turbopack could not bind an internal port.
  - Re-ran with elevated permissions.
  - Passed.

Browser checks at `http://localhost:3000/`:

- Added Object Angle node from the settings node menu.
- Confirmed DOM exposes `role="slider"` with label `오브젝트 3D 앵글 조정`.
- Confirmed WebGL canvas exists inside `[data-testid="object-angle-webgl"]`.
- Confirmed internal canvas pixel sample:
  - `data-render-state="painted"`
  - `data-center-pixel="51,51,51,255"`
- Confirmed keyboard interaction updated values and prompt text:
  - `Yaw 5 deg`
  - `Pitch 5 deg`
  - prompt included `yaw 5 deg, pitch 5 deg`
- Checked desktop and mobile viewport metrics:
  - canvas remained mounted
  - parent node content remained internally bounded
  - React Flow may position the node outside the visible viewport depending on current pan/zoom state, but the node layout itself did not overflow its own content box.
- Browser console error/warning log was empty.

## Screenshot Notes

- Before: `notes/screenshots/object-angle-webgl-2026-06-23/before.png`
- After: `notes/screenshots/object-angle-webgl-2026-06-23/after.png`

The Codex browser screenshot API timed out repeatedly for this page. macOS
screen capture was available, but the active desktop did not reliably show the
in-app browser, so DOM and internal WebGL pixel-state evidence are the stronger
verification artifacts for this task.

## Remaining Risks

- This first pass only updates Object Angle. Camera Angle still uses the current
  SVG/HTML orbit UI.
- `npm install` reported existing audit warnings: 8 vulnerabilities
  (1 low, 4 moderate, 3 high). They were not introduced by code changes in the
  node component itself, but the install surfaced them.
- Default npm cache had root-owned files. `@types/three` was installed with a
  temporary cache path: `/private/tmp/npm-cache-brandgen`.
