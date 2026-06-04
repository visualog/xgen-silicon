# Style Reference Generation Improvement Meta Prompt

Use this document as the goal prompt for the next implementation pass.

## Goal

Improve the BrandGen style reference node so it produces generation results that match the user's intent.

The goal is achieved only when selected style reference images are not merely displayed in the UI, but are actually passed into the image-generation path as controlled style reference inputs. The generated prompt and worker instruction must clearly separate:

- what the user wants to generate,
- which image or text is only a visual style reference,
- how strongly each style reference should influence the output,
- what must not be copied from the reference image.

## Current Problem To Fix

The current style reference feature can mislead users.

The UI stores and shows a style reference image, but the generation path sends only the selected style entry's `prompt` text to `/api/generate`. The selected `imageUrl` is not passed to the worker as an attached reference image. This makes many library entries behave incorrectly, especially entries tagged as `needs-reference-image`.

Known current path:

```text
src/components/StyleAddModal.tsx
  -> adds StyleEntry { id, imageUrl, prompt, label }

src/app/page.tsx
  -> sends style: activeStyle?.prompt
  -> does not send activeStyle?.imageUrl as a generation reference

scripts/codex-worker.mjs
  -> receives style text
  -> imageMixImages can attach images
  -> style reference images are not attached separately
```

The core fix is to make style references real image references in the generation payload and worker path.

## Required Context Before Editing

Read the relevant Next.js guidance in `node_modules/next/dist/docs/` before editing App Router code, because this repository's Next.js version has breaking changes.

Inspect these files before making changes:

- `src/app/page.tsx`
- `src/components/StyleAddModal.tsx`
- `src/components/nodes/StyleNode.tsx`
- `src/components/nodes/OutputNode.tsx`
- `src/lib/codex-worker-client.ts`
- `scripts/codex-worker.mjs`
- `data/style-reference-library.json`
- `src/lib/style-reference-library.ts`
- `src/app/api/style-references/route.ts`
- `src/app/api/style-references/image/[collection]/[id]/route.ts`

Also review the prior analysis and completion notes:

- `notes/style-reference-library-goal-prompt.md`
- `notes/style-reference-library-completion-report.md`
- `notes/computer-use-node-feature-verification-report.md`
- `notes/ui-ux-scroll-fixed-element-qa-report.md`

## Implementation Requirements

### 1. Add real style reference image plumbing

Extend the generation payload so the active style reference can carry image data into the worker.

Expected shape may be similar to:

```ts
styleReferenceImages: Array<{
  imageUrl: string;
  prompt: string;
  label: string;
  weight: "subtle" | "medium" | "strong";
  mode: "style-only";
}>
```

The final design can differ if it better matches the existing code, but it must preserve the same semantic information.

The worker must serialize these style reference images to temporary files and pass them to `codex exec` as attached images, similar to the existing `imageMixImages` path.

### 2. Preserve the user's subject prompt

Style reference images must not override the user's requested subject.

The worker prompt must explicitly say:

```text
Use attached style reference images only for visual style: palette, medium, texture, lighting, rendering detail, atmosphere, and overall finish.
Do not copy the reference image's subject, object identity, person identity, layout, pose, text, logo, or exact composition unless the user explicitly asks for it.
The core prompt controls what appears in the final image.
```

### 3. Add style influence control

Add a practical influence control for each style reference or at least for the active style reference.

Acceptable first version:

- `subtle`
- `medium`
- `strong`

The selected weight must be visible in the UI, persisted in the style entry state, and included in the worker instruction.

### 4. Clarify one-style vs multi-style behavior

The current UI can contain multiple style entries, but only one active style is effectively used.

Pick one approach and make it explicit:

Option A:

- only the active style is used for generation,
- UI clearly labels it as the active generation style,
- inactive styles are visibly stored but not sent.

Option B:

- multiple enabled styles can be sent,
- each style has a weight,
- the worker receives all enabled style references in a deterministic order.

Prefer Option A for a lower-risk first implementation unless the existing UI already supports a clean enabled/disabled pattern.

### 5. Handle `needs-reference-image` entries correctly

The local library includes entries whose prompt depends on the accompanying image.

For any style reference item tagged `needs-reference-image`:

- do not treat the text prompt alone as sufficient,
- pass the image to generation,
- if the image cannot be loaded, show a clear UI error or warning before generation.

### 6. Improve prompt preview truthfulness

The output prompt panel should reflect what is actually sent.

It does not need to display raw base64 or temporary file paths, but it should make the reference state clear, for example:

```text
Style reference image: pure style reference 001
Style influence: medium
Style-only guard: subject and composition are controlled by the core prompt.
```

### 7. Avoid reference content leakage

The worker instruction must explicitly guard against copying unwanted content from style references.

The final behavior should align with common image-generation reference guidance:

- style references should transfer color, lighting, texture, medium, and mood,
- character or object identity should belong to character/object reference nodes, not the style node,
- subject and composition should remain controlled by the core prompt and connected setting nodes,
- stronger style influence can increase visual similarity but must not silently replace the requested subject.

## Testing Requirements

Create or update verification coverage for the generation payload and worker instruction.

At minimum, verify:

1. A selected library style with `imageUrl` is included in `/api/generate` payload as a style reference image.
2. `styleReferenceImages` reaches `scripts/codex-worker.mjs`.
3. The worker attaches style reference image files to `codex exec`.
4. The worker prompt includes the style-only guard.
5. `needs-reference-image` entries do not degrade into text-only style prompts.
6. Existing `imageMixImages`, character reference, object reference, element sheet, and node settings behavior still works.
7. `npm run build:next` passes.

If full image generation cannot be run safely in the environment, add a deterministic debug or dry-run verification path that proves the final worker instruction and attached image list are correct.

## Required Notes And Screenshots

Follow the repository Fabric Work Notes:

1. Before editing code, create a planning note in `notes/`.
2. Capture relevant full-screen before screenshots and include them in the planning note.
3. Store screenshots under:

```text
notes/screenshots/style-reference-generation-improvement-2026-05-30/
```

4. After implementation and verification, create a completion report in `notes/`.
5. Include before/after screenshots in the completion report.
6. Summarize changed files, verification commands, results, and remaining risks.

## Suggested File Outputs

Planning note:

```text
notes/style-reference-generation-improvement-plan.md
```

Completion report:

```text
notes/style-reference-generation-improvement-report.md
```

Screenshot folder:

```text
notes/screenshots/style-reference-generation-improvement-2026-05-30/
```

Optional debug artifact:

```text
notes/style-reference-generation-improvement-worker-prompt-sample.md
```

## Success Criteria

The goal is complete only when all of the following are true:

- The active style reference image is passed to the generation worker when available.
- The style reference image is attached to the final `codex exec` image-generation request.
- The style-only guard is present in the final worker instruction.
- The UI makes active style and influence clear.
- `needs-reference-image` entries are not silently treated as text-only references.
- Existing image mix behavior is not broken.
- `npm run build:next` passes.
- A completion report documents the exact verification evidence.

## Non-Goals

Do not rebuild the entire reference library system.

Do not bundle the full `style-references/` image directory into the Electron package.

Do not replace character or object reference behavior with style references.

Do not implement a custom ML/IPAdapter/ControlNet backend in this pass.

Do not make broad unrelated UI redesigns.

## Final Response Requirements

When complete, report:

- which files changed,
- how style reference images now reach the worker,
- how style-only leakage is prevented,
- what verification passed,
- what remains risky or deferred.
