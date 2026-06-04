# BrandGen Infinite Canvas Handoff

Date: 2026-06-01

## Purpose

This handoff captures the next product direction for BrandGen:

- reduce visual complexity,
- remove the feeling of a rigid tool panel,
- make the workspace feel like an infinite canvas,
- show only what the user needs right now,
- let ideas expand and converge naturally.

## What The User Is Asking For

The interface should not try to show everything at once.

The user wants:

- a softer, less rigid visual tone,
- fewer simultaneous controls,
- a canvas that can expand without bounds,
- a system that reveals nodes only when they matter,
- a process where thought can spread and then resolve into output.

## Current Problem Statement

The current direction risks becoming:

- too dense,
- too tool-like,
- too boxed-in,
- too much like a settings dashboard,
- too eager to expose advanced options immediately.

That makes the product feel harder than it should.

## Design Principle

BrandGen should behave like an infinite working surface, not a dense control surface.

The workspace should feel like:

```text
seed thought
-> interpretation
-> one focused question
-> decision
-> generation
-> refinement
-> comparison
```

The canvas should represent the evolution of thought, not the inventory of all possible controls.

## What To Keep Visible

Keep these always easy to find:

- the user's current seed or active thought,
- the next important question,
- the current output or target result,
- the main action to continue,
- the most relevant reference or constraint.

## What To Hide Or Collapse

Hide or collapse these until they are needed:

- advanced output settings,
- rarely used node types,
- secondary control clusters,
- long lists of examples,
- dense style or reference libraries,
- deep technical prompt details.

## Infinite Canvas Rules

1. The canvas should never feel bounded by a panel layout.
2. New nodes should appear around the active thought, not force the user into a new screen.
3. Existing nodes should be movable, revisit-able, and collapsible.
4. Empty space is allowed and useful.
5. The workspace should support branching without requiring everything to stay visible.
6. Older or lower-priority branches should be visually de-emphasized, not deleted.

## Interaction Rules

- Ask only one important question at a time.
- Reveal only the controls needed for the current decision.
- Default to the simplest path that can produce a good result.
- Expand detail only after the user has committed to a direction.
- Keep the original thought visible so the user can track how the result evolved.

## Visual Rules

- Use lower visual noise.
- Prefer softer surfaces and lighter structure.
- Reduce hard borders, dense card stacks, and over-ornamented containers.
- Use spacing and scale to express importance.
- Let the canvas breathe.

## Implementation Direction

The next implementation should move in this order:

1. Simplify the first screen.
2. Make the canvas effectively infinite.
3. Reduce node chrome and density.
4. Collapse advanced settings behind progressive disclosure.
5. Keep the primary thought/result central.
6. Add branching only when the user or AI needs it.

## Working Model

The product should follow this loop:

```text
observe -> infer -> ask -> branch -> choose -> generate -> refine
```

Each step should become a visible canvas state, but only the active part of the loop should be emphasized.

## Files Likely To Be Touched

- `src/app/page.tsx`
- `src/components/nodes/PromptNode.tsx`
- `src/components/nodes/StyleNode.tsx`
- `src/components/nodes/OutputNode.tsx`
- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/StyleAddModal.tsx`
- `src/components/nodes/ImageMixNode.tsx`
- `src/lib/codex-worker-client.ts`
- `scripts/codex-worker.mjs`

## Verification Criteria

The direction is correct only if:

- the first screen feels open rather than packed,
- the user can identify the primary action immediately,
- advanced controls do not dominate the interface,
- the canvas can grow without forcing a new page,
- the thought-to-result flow stays readable,
- the product feels less rigid and less overexplained.

## Immediate Next Step

Build a minimal infinite-canvas presentation layer before adding more functionality. The first pass should simplify what is shown, not expand what exists.

