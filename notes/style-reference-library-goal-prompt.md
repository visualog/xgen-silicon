# Goal Prompt: xGen Style Reference Library Integration

## Role

You are a senior product-minded coding agent working in the BrandGen / xGen repository.

Your task is to implement a practical way for users to add collected and organized style references from the local style reference library into the existing xGen Style Reference node.

## Context

The app already has a `StyleNode` and `StyleAddModal`.

Current style entries use this shape:

```ts
export interface StyleEntry {
  id: string;
  imageUrl: string;
  prompt: string;
  label: string;
}
```

Important current files:

- `src/components/nodes/StyleNode.tsx`
- `src/components/StyleAddModal.tsx`
- `src/app/page.tsx`
- `src/app/api/analyze-style/route.ts`
- `scripts/collect-style-reference.mjs`
- `style-references/aurora-prompts/items/*.json`
- `style-references/aurora-prompts/images/*`
- `style-references/aurora-prompts/metadata.json`
- `style-references/aurora-prompts/taxonomy.json`

The collected references are currently organized under `style-references/`. These assets are large and must not be bundled into the Electron app by accident.

## Product Goal

Users should be able to open the Style Reference node, choose `추가`, then add a style from the collected reference library without manually browsing image files or copying prompt text.

The feature should feel like a curated library, not a raw file picker.

## UX Direction

Extend the existing style add flow instead of creating a separate large screen.

Recommended modal structure:

```text
스타일 추가
├─ 업로드
├─ URL
├─ 라이브러리
   ├─ 검색
   ├─ 카테고리 필터
   ├─ 태그 필터
   ├─ 썸네일 카드 그리드
   └─ 선택 / 추가
```

The library tab should show:

- thumbnail image
- readable title
- category
- style tags
- short converted prompt preview
- add/select action

The user should be able to search by:

- title
- prompt text
- primary category
- style tags
- production tags
- subject tags

## Architecture Direction

Do not import large images directly into frontend source.

Do not move the entire `style-references` folder into `public/`.

Do not accidentally include `style-references` in `.next/standalone` or the Electron package.

Use a small generated manifest for metadata and a server-side image serving route for thumbnails.

Recommended architecture:

1. Generate an app-facing manifest from `style-references/**/items/*.json`.
2. Store the manifest as a small JSON file, for example:

```text
data/style-reference-library.json
```

3. Add an API route to read the manifest:

```text
src/app/api/style-references/route.ts
```

4. Add an API route to serve reference images by collection and id:

```text
src/app/api/style-references/image/[collection]/[id]/route.ts
```

5. The frontend should use API URLs as `imageUrl`, for example:

```ts
`/api/style-references/image/${collection}/${id}`
```

6. When a library item is added to the Style node, convert it to:

```ts
{
  id: `library-${collection}-${id}`,
  imageUrl: `/api/style-references/image/${collection}/${id}`,
  prompt: convertedPrompt || prompt || description,
  label: title,
}
```

## Important Packaging Constraint

There is already evidence that `style-references` can be traced into `.next/standalone`, increasing package size significantly.

Before finishing, verify that the production package does not include the full style reference image directory.

You must inspect the build trace if needed.

Expected direction:

- Metadata manifest may be included if small.
- Large image folders should be treated as external local data.
- Electron packaged app should not silently contain hundreds of MB of collected references.

If the app needs access to references in packaged mode, use one of these approaches:

1. User-configurable external style library folder.
2. App support directory cache.
3. Optional import step that copies selected references only.

Do not solve packaged-library distribution by bundling all collected images into the app.

## Implementation Plan

Before editing code:

1. Create a Fabric-style planning note in `notes/`.
2. Capture relevant before screenshots if UI changes are made.
3. Read the relevant Next.js docs in `node_modules/next/dist/docs/` before touching API routes because this repo uses a newer Next.js version with breaking changes.

Then:

1. Inspect representative style reference item JSON files.
2. Define a normalized library item type.
3. Add a script to build the small app-facing manifest.
4. Add the manifest output path.
5. Add API route for library metadata.
6. Add safe API route for image serving.
7. Extend `StyleAddModal` with a `라이브러리` tab.
8. Add search and filters.
9. Convert selected library references into `StyleEntry`.
10. Keep existing upload, URL, and Codex analyze flows working.
11. Update docs/notes with the final behavior.

## Data Normalization

A normalized item should contain at least:

```ts
type StyleReferenceLibraryItem = {
  id: string;
  collection: string;
  title: string;
  imagePath: string;
  imageUrl: string;
  prompt: string;
  primaryCategory: string;
  styleTags: string[];
  subjectTags: string[];
  productionTags: string[];
  reviewStatus: string;
  conversionStatus: string;
};
```

The frontend should not receive arbitrary filesystem paths unless needed. Prefer API image URLs in UI state.

The server route may map `collection + id` to a validated local file path.

## Security / Safety Rules

- Validate `collection` and `id`.
- Prevent path traversal.
- Only serve image files from approved style reference roots.
- Return `404` for missing items or invalid paths.
- Do not expose arbitrary local filesystem reads.

## UI Quality Requirements

- Keep the modal compact and consistent with the current xGen design.
- Do not create a landing page or separate decorative library page unless necessary.
- Use dense, scannable controls.
- Add loading, empty, and error states.
- Avoid text overflow in cards.
- Use existing design tokens and node/modal patterns.
- Use existing icons from `lucide-react`.

## Prompt Behavior

When a library style is selected, the selected style prompt should be passed through the existing style connection flow.

Current generation code reads active style prompt through the Style node connection. Preserve that behavior.

Short-term requirement:

- selected library item contributes `prompt`

Future-ready direction:

- preserve selected library item `imageUrl` so image-reference generation can later use the actual reference image

Do not break current generation if the image API route is unavailable.

## Validation Requirements

Run at minimum:

```bash
./node_modules/.bin/eslint src/components/StyleAddModal.tsx src/components/nodes/StyleNode.tsx src/app/page.tsx
npm run build:next
```

If API routes or scripts are added, also run the relevant script and inspect output.

If packaging is affected, run:

```bash
npm run pack:mac
du -sh release/mac/xGen.app .next/standalone
```

Verify:

- style library tab opens
- library metadata loads
- search works
- category/tag filtering works
- selecting a library item adds a StyleEntry
- active style can be selected in the Style node
- generation settings still include the selected style prompt
- large `style-references/images` directory is not bundled unintentionally

## Completion Report

After implementation:

1. Capture after screenshots.
2. Create a Fabric-style completion report in `notes/`.
3. Include before/after screenshots.
4. Summarize files changed.
5. Summarize validation commands and results.
6. Explicitly state whether large reference images were bundled or kept external.

## Non-Goals

- Do not implement autonomous web crawling in this task.
- Do not add Pinterest, Behance, or Dribbble scraping in this task.
- Do not redesign the whole xGen UI.
- Do not replace the existing upload/URL/analyze style workflows.
- Do not bundle the full reference image library into the app.

## Expected Outcome

The Style Reference node should gain a library-based add path that lets the user quickly select from the curated local reference collection. The implementation should preserve current workflows, keep app packaging under control, and create a foundation for future self-learning or external-reference ingestion.
