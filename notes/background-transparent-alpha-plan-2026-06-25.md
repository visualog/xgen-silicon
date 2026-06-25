# Background Transparent Alpha Plan

## Context

- Mask Edit background removal is not reliable enough for clean transparent PNG output.
- Transparent background is better handled as an upfront generation setting on the Background node.
- The existing Background node already serializes structured background settings into the generation prompt.

## Screenshot

- Before: `notes/screenshots/background-transparent-alpha-2026-06-25/before-fullscreen.png`

## Plan

1. Add a first-class transparent background recipe/environment to the Background node.
2. Make the generated background prompt explicitly require real PNG alpha and forbid checkerboard/grid preview patterns.
3. Prevent background reference images from being sent when the active background is transparent.
4. Reuse worker-side transparent-background postprocessing for transparent Background node requests.
5. Verify with TypeScript, targeted lint, production build, and browser readiness.
