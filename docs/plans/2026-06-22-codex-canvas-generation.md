# Codex Canvas Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Codex-driven prompt composition and annotation-based image edit loop for xGen.

**Architecture:** Add a prompt composition API over the existing node-generation state, expose the optimized prompt for review, store annotations as JSON overlays on generated images, and route annotation edit requests through the existing `codex-worker` image generation pipeline. Keep image outputs immutable and link revisions to their source image.

**Tech Stack:** Next.js App Router, React 19, TypeScript, existing `codex-worker.mjs`, existing gallery persistence, existing xGen node state.

---

### Task 1: Add Prompt Composition API

**Files:**
- Modify: `scripts/codex-worker.mjs`
- Create: `src/app/api/compose-prompt/route.ts`
- Modify: `src/lib/codex-worker-client.ts`

**Step 1: Add worker response type and client call**

In `src/lib/codex-worker-client.ts`, add:

```ts
export interface WorkerComposePromptResponse {
  optimizedPrompt: string;
  sourceSummary: string[];
  warnings: string[];
  createdAt: string;
}

export function composePromptViaWorker(payload: {
  prompt?: string;
  style?: string | null;
  characterReference?: string | null;
  objectReference?: string | null;
  ratio?: string;
  resolution?: string;
  composition?: string | null;
  background?: string | null;
  constraints?: string | null;
  mood?: string | null;
  palette?: string | null;
  cameraAngle?: string | null;
  objectAngle?: string | null;
  lighting?: string | null;
  gesture?: string | null;
  propsPrompt?: string | null;
  detailLevel?: string | null;
  imageMixPrompt?: string | null;
}) {
  return postToWorker<WorkerComposePromptResponse>("/compose-prompt", payload, 90000);
}
```

**Step 2: Add worker handler**

In `scripts/codex-worker.mjs`, extract the deterministic prompt assembly currently used by `handleTranslate` into a helper:

```js
function composeOptimizedPrompt(payload) {
  const {
    prompt,
    style,
    characterReference,
    objectReference,
    ratio,
    resolution,
    composition,
    background,
    constraints,
    mood,
    palette,
    cameraAngle,
    objectAngle,
    lighting,
    gesture,
    propsPrompt,
    detailLevel,
    imageMixPrompt,
  } = payload;

  const sourceSummary = [];
  const warnings = [];
  if (prompt) sourceSummary.push("Core prompt");
  if (style) sourceSummary.push("Style");
  if (characterReference) sourceSummary.push("Character lock");
  if (objectReference) sourceSummary.push("Object lock");
  if (!prompt && !style && !characterReference && !objectReference) {
    warnings.push("No subject, style, or reference lock is connected.");
  }

  const optimizedPrompt = compactJoin([
    "xGen image brief.",
    prompt ? `Subject: ${prompt}` : "",
    style ? `Style: ${style}` : "",
    characterReference ? `Character lock: ${characterReference}` : "",
    objectReference ? `Object lock: ${objectReference}` : "",
    ratio ? `Aspect ratio: ${ratio}` : "",
    resolution ? `Resolution: ${resolution}` : "",
    composition ? `Composition: ${composition}` : "",
    background ? `Background: ${background}` : "",
    constraints ? `Constraints: ${constraints}` : "",
    mood ? `Mood: ${mood}` : "",
    palette ? `Palette: ${palette}` : "",
    cameraAngle ? `Camera: ${cameraAngle}` : "",
    objectAngle ? `Object orientation: ${objectAngle}` : "",
    lighting ? `Lighting: ${lighting}` : "",
    gesture ? `Gesture: ${gesture}` : "",
    propsPrompt ? `Props: ${propsPrompt}` : "",
    detailLevel ? `Detail: ${detailLevel}` : "",
    imageMixPrompt || "",
    "Quality: premium brand image, coherent composition, high detail, no readable text, no logo, no watermark.",
  ]);

  return {
    optimizedPrompt,
    sourceSummary,
    warnings,
    createdAt: new Date().toISOString(),
  };
}
```

Add:

```js
async function handleComposePrompt(payload) {
  return composeOptimizedPrompt(payload);
}
```

Route it in the server:

```js
if (req.url === "/compose-prompt") return handleComposePrompt(payload);
```

**Step 3: Add Next route**

Create `src/app/api/compose-prompt/route.ts`:

```ts
import { NextResponse } from "next/server";
import { composePromptViaWorker } from "@/lib/codex-worker-client";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = await composePromptViaWorker(payload);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "프롬프트 구성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

**Step 4: Verify**

Run:

```bash
npm run codex-worker
```

In another terminal:

```bash
curl -s -X POST http://localhost:3000/api/compose-prompt \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"premium ramen poster","ratio":"1:1","resolution":"HD"}'
```

Expected: JSON with `optimizedPrompt`, `sourceSummary`, `warnings`, and `createdAt`.

**Step 5: Commit**

```bash
git add src/lib/codex-worker-client.ts src/app/api/compose-prompt/route.ts scripts/codex-worker.mjs
git commit -m "feat: add codex prompt composition endpoint"
```

### Task 2: Add Prompt Review State And Panel

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/types/xgen.d.ts` if shared result types need extension

**Step 1: Add state**

In `src/app/page.tsx`, add state near existing prompt state:

```ts
const [optimizedPrompt, setOptimizedPrompt] = useState("");
const [optimizedPromptEdited, setOptimizedPromptEdited] = useState(false);
const [promptComposeStatus, setPromptComposeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
const [promptComposeError, setPromptComposeError] = useState("");
```

**Step 2: Add compose callback**

Create `composePromptFromNodes` using the same payload currently sent to `/api/translate` or `/api/generate`.

Expected behavior:

- set status to `loading`
- POST to `/api/compose-prompt`
- update `optimizedPrompt`
- reset `optimizedPromptEdited` to `false`
- preserve existing prompt if request fails

**Step 3: Render review panel**

Add a compact prompt review section near the output/preview controls:

```tsx
<textarea
  value={optimizedPrompt}
  onChange={(event) => {
    setOptimizedPrompt(event.target.value);
    setOptimizedPromptEdited(true);
  }}
/>
```

Include controls:

- Compose Prompt
- Use For Generation
- Copy

Do not add large marketing text. Keep this as a tool surface.

**Step 4: Wire generation**

When `optimizedPrompt` exists, pass it as `prebuiltPrompt` to `/api/generate`.

Expected payload change:

```ts
prebuiltPrompt: optimizedPrompt.trim() || visibleEnglishPrompt || null
```

**Step 5: Verify**

Run:

```bash
npm run lint
```

Expected: existing lint failures may remain in `codex/` and `scratch/`; no new errors in modified app files.

Run browser smoke:

```bash
npm run dev
npm run codex-worker
```

Expected:

- Compose Prompt fills the prompt panel.
- Editing the panel marks it as edited.
- Generate uses the edited prompt.

**Step 6: Commit**

```bash
git add src/app/page.tsx src/types/xgen.d.ts
git commit -m "feat: add prompt review panel"
```

### Task 3: Add Annotation Data Model

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/lib/gallery-store.ts`
- Modify: `src/types/xgen.d.ts`

**Step 1: Define annotation types**

Add:

```ts
export type ImageAnnotation =
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      text: string;
      color: string;
      createdAt: string;
    }
  | {
      id: string;
      type: "arrow";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      text?: string;
      color: string;
      createdAt: string;
    }
  | {
      id: string;
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      text?: string;
      color: string;
      createdAt: string;
    };
```

Coordinates must be normalized from `0` to `1` relative to the displayed image.

**Step 2: Extend generated result**

Add optional fields:

```ts
annotations?: ImageAnnotation[];
sourceResultId?: string;
editInstruction?: string;
```

**Step 3: Persist annotations**

Ensure gallery snapshot save/load preserves `annotations`, `sourceResultId`, and `editInstruction`.

**Step 4: Verify**

Create a temporary result with annotations, save, reload page, confirm annotations remain in local state.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/lib/gallery-store.ts src/types/xgen.d.ts
git commit -m "feat: persist image annotations"
```

### Task 4: Build Minimal Annotation Overlay

**Files:**
- Modify: `src/app/page.tsx`
- Optional create: `src/components/ImageAnnotationOverlay.tsx`

**Step 1: Create overlay component**

Create `src/components/ImageAnnotationOverlay.tsx` if `page.tsx` becomes too large.

Props:

```ts
type Props = {
  imageUrl: string;
  annotations: ImageAnnotation[];
  mode: "view" | "annotate";
  onChange: (annotations: ImageAnnotation[]) => void;
};
```

**Step 2: Implement first slice**

Support only text notes and arrows first.

Interactions:

- click image to add text note
- drag from point A to B to add arrow
- delete selected annotation

**Step 3: Render existing annotations**

Use absolutely positioned HTML/SVG over the image.

Do not rasterize annotations into the bitmap.

**Step 4: Verify**

Browser smoke:

- add text annotation
- add arrow annotation
- delete annotation
- reload page and verify persistence

**Step 5: Commit**

```bash
git add src/components/ImageAnnotationOverlay.tsx src/app/page.tsx
git commit -m "feat: add image annotation overlay"
```

### Task 5: Add Edit From Annotations Worker Route

**Files:**
- Modify: `src/lib/codex-worker-client.ts`
- Create: `src/app/api/edit-from-annotations/route.ts`
- Modify: `scripts/codex-worker.mjs`

**Step 1: Add client type**

```ts
export interface WorkerEditFromAnnotationsResponse {
  url: string;
  threadId: string;
  filePath: string;
  title: string;
  englishPrompt: string;
  koreanPrompt: string;
}
```

**Step 2: Add worker helper**

In `scripts/codex-worker.mjs`, create:

```js
function formatAnnotationsForPrompt(annotations = []) {
  return annotations.map((annotation, index) => {
    if (annotation.type === "text") {
      return `${index + 1}. Text note at (${annotation.x}, ${annotation.y}): ${annotation.text}`;
    }
    if (annotation.type === "arrow") {
      return `${index + 1}. Arrow from (${annotation.x1}, ${annotation.y1}) to (${annotation.x2}, ${annotation.y2}): ${annotation.text || "apply the requested visual change at the target"}`;
    }
    if (annotation.type === "rect") {
      return `${index + 1}. Region (${annotation.x}, ${annotation.y}, ${annotation.width}, ${annotation.height}): ${annotation.text || "revise this area"}`;
    }
    return `${index + 1}. Unknown annotation: ${JSON.stringify(annotation)}`;
  }).join("\n");
}
```

**Step 3: Add handler**

The handler should require:

- `sourceImage`
- `basePrompt`
- non-empty `annotations`

Build an edit prompt:

```text
Revise the attached generated image using the annotation list.
Preserve unannotated areas unless an annotation implies a global adjustment.
Base prompt: ...
Annotations:
...
Return one revised image only.
```

Then call `generateImageWithCodex` with:

- `prebuiltPrompt` as the edit instruction
- `imageMixImages` containing the source image as a `composition` or `layer-edit` reference

**Step 4: Add Next route**

Create `/api/edit-from-annotations`.

**Step 5: Verify**

Use a known saved image URL and a small annotation payload.

Expected:

- worker receives source image and annotations
- returns new generated image payload

**Step 6: Commit**

```bash
git add src/lib/codex-worker-client.ts src/app/api/edit-from-annotations/route.ts scripts/codex-worker.mjs
git commit -m "feat: generate edits from annotations"
```

### Task 6: Wire Edit Command In UI

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add edit action**

Add `editFromAnnotations` callback:

- require active result
- require annotations
- POST to `/api/edit-from-annotations`
- save returned result as a new generated result
- set `sourceResultId` to the original result id
- set `editInstruction` from the annotation summary

**Step 2: Add button**

Add a compact button near preview controls:

```text
Edit From Annotations
```

Disable it when no active result or no annotations exist.

**Step 3: Show lineage**

For revised results, show a small source indicator:

```text
Edited from previous image
```

**Step 4: Verify**

Manual smoke:

- generate image
- add annotations
- click edit
- verify new result appears
- verify source result remains unchanged

**Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire annotation edit command"
```

### Task 7: Final Verification And Report

**Files:**
- Create: `notes/codex-canvas-generation-report-2026-06-22.md`

**Step 1: Run checks**

Run:

```bash
npm run build
npm run lint
```

Expected:

- `npm run build` passes.
- `npm run lint` may still report pre-existing `codex/` and `scratch/` issues unless those are addressed in a separate task.

**Step 2: Browser verification**

Run:

```bash
npm run dev
npm run codex-worker
```

Verify:

- prompt composition
- prompt editing
- image generation
- annotation creation
- edit from annotations
- history/lineage visibility

**Step 3: Write report**

Include:

- files changed
- verification commands
- results
- screenshots
- remaining risks

**Step 4: Commit**

```bash
git add notes/codex-canvas-generation-report-2026-06-22.md
git commit -m "docs: report codex canvas generation workflow"
```
