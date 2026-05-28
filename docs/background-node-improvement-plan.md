# Background Node Improvement Plan

## Goal

Upgrade the xGen Background node from four fixed presets into a compact background builder that can describe the environment as layered, controllable generation guidance.

## Current Problem

The current node only supports:

- Pure white
- Minimal
- Office
- Outdoor

This is too limited because image backgrounds are not a single choice. They are a combination of environment, surface, spatial depth, detail density, visual treatment, and safety constraints.

## Design Direction

The improved node should keep xGen's node language:

- compact card inside the React Flow canvas
- structured controls as the primary decision surface
- generated prompt preview
- existing output handle behavior

Do not duplicate the same decision with both a preset row and detailed segmented controls. The top-level background choice should live in `Environment`; future templates, if needed, should be a collapsed optional helper rather than a second always-visible control row.

The app-level state remains:

```ts
backgroundPrompt: string
```

This keeps older saved projects compatible and avoids a broad schema migration.

## Background Model

The node should encode the following layers:

- `Environment`: pure, studio, workspace, interior, outdoor, urban, abstract
- `Surface`: none, tabletop, floor, wall, paper, fabric, concrete, metal, glass
- `Depth`: flat, shallow, medium, deep
- `Detail`: none, low, medium, high
- `Treatment`: solid, soft gradient, soft blur, subtle pattern, shadow only, bokeh
- `Cleanliness`: clean, lightly lived-in, curated props, busy
- `Additional direction`: user-written extra background instruction

## Prompt Format

The output should be structured but natural:

```text
Background: minimal warm studio environment with a matte off-white wall.
Surface: light concrete tabletop.
Depth: shallow spatial depth with clean negative space.
Detail density: low, no distracting props.
Treatment: softly blurred background, subject remains dominant.
Safety: no readable text, logos, signs, clutter, or busy patterns.
Additional direction: keep the background quiet and brand-safe.
```

## Safety Defaults

Default background behavior should keep the subject dominant:

- low detail
- clean negative space
- no readable text
- no logos or signage
- no distracting props
- no complex patterns unless explicitly selected

## MVP Scope

Implement:

1. Environment segmented controls
2. Surface segmented controls
3. Depth segmented controls
4. Detail density segmented controls
5. Treatment segmented controls
6. Cleanliness segmented controls
7. Additional direction textarea
8. Generated prompt preview
9. Existing output chip and disconnect behavior

## Verification

Completion requires:

- `BackgroundNode` supports structured controls instead of only four presets
- Existing `backgroundPrompt` string pipeline remains intact
- ESLint passes for touched files
- `npm run build:next` passes
- `npm run pack:mac` completes
- A markdown verification report is saved
