# Codex Canvas Generation Design

## Context

xGen already has a node-based image generation workspace, a Next.js API layer,
and a local `codex-worker` that calls `codex exec`. The current flow can create
image prompts and image outputs, but the prompt composition, image generation,
and revision loop are tightly coupled. The reference video shows a more direct
workflow: Codex opens a local canvas, fills an image holder, the user marks
changes directly on top of the image, and Codex generates the next image while
leaving the prior image and annotations visible.

## Goal

Turn xGen into a node-driven prompt and annotation-driven image generation
workspace:

1. Node settings and user descriptions produce a visible optimized image prompt.
2. The optimized prompt can be edited before image generation.
3. Generated images can be annotated directly on the canvas.
4. Annotations become structured edit instructions for Codex.
5. Original image, annotations, and revised image remain visible as history.

## Selected Approach

Use the existing Codex CLI login/session model rather than embedding ChatGPT
login inside xGen. The app will treat Codex as the generation/edit engine and
make the user-facing surface feel like a canvas-based creative workflow.

This avoids fragile browser automation of ChatGPT, avoids requiring an API key
for the first slice, and matches the reference video's pattern: local app +
canvas state + Codex worker + generated image artifacts.

## Non-Goals

- Do not embed the ChatGPT web app or automate ChatGPT login.
- Do not introduce OpenAI API key management in this slice.
- Do not replace the current node editor.
- Do not build a full infinite whiteboard engine from scratch.
- Do not add a new package dependency unless an implementation task proves it is necessary.

## Architecture

### 1. Prompt Composer

Add a first-class prompt composition layer that converts connected node state
into a final image prompt. This layer should be callable without generating an
image.

Inputs:

- core prompt text
- selected style
- reference locks
- aspect ratio and resolution
- composition, background, constraints, mood, palette, camera, lighting, props
- image mix metadata

Outputs:

- optimized prompt
- source node summary
- warnings for missing or conflicting settings
- timestamp and version id

The first implementation can reuse existing deterministic prompt assembly in
`scripts/codex-worker.mjs` and expose it through a new route such as
`/api/compose-prompt`.

### 2. Prompt Review Panel

Expose the optimized prompt in the UI before generation. Users can edit it,
copy it, or send it to image generation.

The panel should make prompt provenance clear:

- generated from nodes
- manually edited
- used for result id

### 3. Annotation Layer

Add annotation data over generated images:

- arrow
- rectangle
- freehand stroke
- text note
- target point

The annotation layer should be stored as JSON, separate from the bitmap. Each
annotation should include:

- id
- type
- normalized coordinates
- style
- text
- target generated image id
- createdAt

### 4. Edit From Annotations

Add a command that sends the current image, current optimized prompt, and
annotation JSON to the worker. The worker converts the annotations into a
clear edit instruction, attaches the source image, and calls the existing Codex
image generation path.

The first version should generate a new image rather than in-place mutate the
old image. This keeps history clear and avoids destructive edits.

### 5. History

Represent each generation/edit as a result node:

- base result
- annotation set
- edit instruction
- revised result

The UI should show enough lineage to compare before/after without making the
main workspace feel like a generic file manager.

## Data Flow

```text
Node state
→ composePrompt()
→ optimizedPrompt
→ user review/edit
→ generateImage(optimizedPrompt)
→ generated result
→ user annotations over result
→ composeEditFromAnnotations(result, optimizedPrompt, annotations)
→ generateImage(edit prompt + source image)
→ revised result linked to original
```

## Error Handling

- If `codex-worker` is unavailable, show the existing worker connection message.
- If prompt composition fails, keep the last successful prompt visible.
- If annotations are empty, block edit generation with a clear message.
- If image generation fails, keep annotations intact so the user can retry.
- If source image file is missing, fall back to the saved gallery image URL when possible.

## Verification

The first implementation should verify:

- prompt composition works without image generation
- generated prompt can be manually edited
- annotations are saved in normalized coordinates
- edit generation payload includes image, prompt, and annotations
- existing `/api/generate` still works
- existing gallery persistence still works

## Open Questions

- Should prompt composition use deterministic assembly only, or optionally call Codex for prompt optimization?
- Should annotation tools live inside the existing preview area or a dedicated canvas mode?
- Should revised images appear as gallery cards first, or directly as canvas nodes?
