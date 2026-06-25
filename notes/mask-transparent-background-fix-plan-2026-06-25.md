# Mask Transparent Background Fix Plan

## Context

- When the Mask Edit node is set to background and the user asks to remove the background as a transparent PNG, generation can render a checkerboard pattern instead of producing true transparency.
- The current mask edit flow sends the generated layer as an image mix reference and relies on prompt text for the masked region behavior.
- The worker does not currently know that this specific mask edit is a transparent-background request.

## Screenshot

- Before: `notes/screenshots/mask-transparent-background-fix-2026-06-25/before-fullscreen.png`

## Plan

1. Classify background-removal/transparent-PNG mask edits in the app before sending image mix references to the worker.
2. Pass explicit mask edit metadata with the generated layer reference.
3. In the worker, add true-alpha guidance for transparent background edits and prohibit visible checkerboard/grid/tile patterns.
4. Preserve PNG input format for layer-edit references so alpha-capable assets are not unnecessarily converted.
5. Verify with TypeScript, targeted lint, and production build.
