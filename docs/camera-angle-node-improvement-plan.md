# Camera Angle Node Improvement Plan

## Goal

Replace the current fixed camera-angle presets with a camera control model closer to 3D software orbit controls, while keeping xGen's existing node workflow and prompt pipeline stable.

## Current Problem

The current Camera Angle node only offers four presets:

- Front
- Side
- Low
- Top view

This is too coarse for controlled image generation. It also makes the node feel different from how users think about camera placement in 3D tools.

## Desired Direction

The node should behave like a compact 3D camera control surface:

- `Yaw`: horizontal orbit around the subject
- `Pitch`: vertical camera height and angle
- `Roll`: camera tilt
- `Distance`: close, medium, wide, establishing
- `Lens`: wide, natural, portrait, telephoto

The UI should remain simple enough for xGen's node canvas:

- Keep quick presets for common views
- Add an orbit pad for yaw and pitch
- Add compact sliders for roll and lens
- Add segmented distance controls
- Show a generated camera prompt summary

## Prompt Strategy

Image models do not reliably follow exact 3D degrees, so each numeric control should be translated into both:

1. structured camera values
2. natural language camera direction

Example:

```text
Camera orbit: yaw +35° right, pitch -12° low angle, roll 0° level, distance medium shot, lens 50mm natural perspective. Compose as a three-quarter front view from slightly below eye level.
```

This gives the generation model a better chance of following the intended camera direction than numbers alone.

## UI Specification

### Orbit Pad

- Horizontal drag changes `yaw` from `-180` to `180`
- Vertical drag changes `pitch` from `60` high angle to `-75` low angle
- A dot indicates the current camera position
- Labels indicate left, right, high, low

### Sliders

- `Roll`: `-45` to `45`
- `Lens`: `18mm` to `135mm`

### Distance

Segmented buttons:

- Close
- Medium
- Wide
- Establishing

### Presets

Presets should set the numeric model instead of replacing the prompt with a static string:

- Front
- 3/4
- Side
- Low
- Top

## Compatibility

Keep the existing app-level state field:

```ts
cameraAngle: string
```

Reason:

- Existing snapshots remain compatible
- Output prompt generation already reads `cameraAngle`
- No API/schema migration is required

The node can encode the camera model into a structured prompt string. If an older preset string is loaded, the node can fall back to the nearest default camera model.

## Implementation Steps

1. Replace the four-button preset grid in `CameraAngleNode`.
2. Add a local camera model parser and formatter.
3. Add orbit pad pointer controls.
4. Add roll and lens sliders.
5. Add distance segmented controls.
6. Keep the existing output handle and remove button behavior.
7. Verify lint and production build.

## Success Criteria

- User can adjust camera direction continuously, not only by four presets.
- The generated prompt includes numeric and natural-language camera direction.
- The node remains visually consistent with xGen nodes.
- Existing `cameraAngle` prompt pipeline continues to work.
- ESLint and `npm run build:next` pass.
