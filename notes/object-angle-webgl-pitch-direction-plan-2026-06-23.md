# Object Angle WebGL Pitch Direction Plan

## Context

- User reported that horizontal dragging in the Object Angle node follows the drag direction, but vertical dragging feels inverted.
- Current input mapping already treats upward dragging as a positive pitch change.
- Prompt semantics in `ObjectAngleNode.tsx` define positive pitch as a top-down tilt.

## Plan

1. Keep drag and keyboard pitch semantics unchanged.
2. Invert only the Three.js object X-axis rotation used for rendering.
3. Run targeted lint/type verification for the affected component.
4. Record the fix and verification result in a completion note.

## Expected Result

Vertical dragging should visually follow the drag direction while keeping generated prompt values stable.
