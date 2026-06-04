# Computer Use Verification: Prompt and Style Reference Nodes

Date: 2026-05-29

## Scope

Used Chrome DevTools Protocol as the computer-use path to operate the real app UI in Chrome:

- Prompt node: example prompt panel, category filter, apply action.
- Style reference node: add modal, library tab, search, thumbnail loading, card selection, active style propagation into the prompt panel.

Screenshots are saved under:

- `notes/screenshots/computer-use-verification-2026-05-29/`

## Runtime

- `npm run build:next`
  - Passed.
  - Confirmed production routes include `/api/style-references` and `/api/style-references/image/[collection]/[id]`.

- Standalone server:
  - `PORT=3851 HOSTNAME=127.0.0.1 XGEN_STYLE_REFERENCE_ROOT=/Users/im_018/Documents/GitHub/2026_important/BrandGen/style-references node .next/standalone/server.js`
  - `GET /` returned `200 OK`.

Note: `next dev` opened a port but did not return a response to the first page request in this session, even after restarting on a clean port. Production standalone was used for the actual app verification because it was responsive and closer to the packaged Electron runtime.

## Evidence

- Initial app shell: `notes/screenshots/computer-use-verification-2026-05-29/01-initial-app.png`
- Workspace after entering make flow: `notes/screenshots/computer-use-verification-2026-05-29/01b-workspace.png`
- Prompt examples open: `notes/screenshots/computer-use-verification-2026-05-29/02-prompt-examples-open.png`
- Prompt category filter: `notes/screenshots/computer-use-verification-2026-05-29/03-prompt-category-product.png`
- Prompt example applied: `notes/screenshots/computer-use-verification-2026-05-29/04-prompt-example-applied.png`
- Style add modal upload tab: `notes/screenshots/computer-use-verification-2026-05-29/05-style-add-modal-upload.png`
- Style library loaded: `notes/screenshots/computer-use-verification-2026-05-29/06-style-library-loaded.png`
- Style library search: `notes/screenshots/computer-use-verification-2026-05-29/07-style-library-search-aurora.png`
- Style item added to node: `notes/screenshots/computer-use-verification-2026-05-29/08-style-library-item-added.png`

## Results

Prompt node:

- Opened the `예시 프롬프트` panel in the real app.
- Selected the `제품` category.
- Applied the `프리미엄 디바이스` prompt.
- Verified the prompt textarea value was updated to the selected example text.
- Captured applied prompt length: 145 characters.

Style reference node:

- Opened `스타일 추가`.
- Switched to `라이브러리`.
- Verified the library loaded 314 total items.
- Verified visible card rendering and thumbnail loading:
  - visible library cards detected: 80
  - loaded reference images detected in viewport/cache: 16
  - broken reference images detected: 0
- Searched for `macro`.
  - result summary: `126개 표시 · 전체 314개`
  - empty state did not appear.
- Selected a library card.
- Verified the style node showed `선택됨`.
- Verified the selected reference thumbnail loaded inside the style node.
- Verified the output prompt panel included the selected style prompt.

API checks:

- `/api/style-references` returned `totalItems: 314`.
- `/api/style-references/image/aurora-prompts/001-nttxjRjN0` returned:
  - `200 OK`
  - `content-type: image/png`

## Problems Found

1. Prompt examples panel overlaps the style reference node.

   On the default canvas layout, expanding `예시 프롬프트` pushes over the `스타일 참조` node area. The style add button is effectively blocked until the prompt examples panel is closed. This is visible in `04-prompt-example-applied.png`.

2. Library result count is misleading when more than 80 items match.

   The UI renders `filteredLibraryItems.slice(0, 80)` but the footer says the full matching count is displayed. For example, after searching `macro`, the footer says `126개 표시 · 전체 314개`, but only 80 cards are rendered.

3. Selected style card does not show the library title in the node.

   After adding a library item, the style node card only shows the prompt preview. The title/label is stored, but it is not visible in the node, so users cannot easily distinguish multiple style references with similar prompts.

4. Horizontal filter rows have weak overflow affordance.

   Category and style tag filters scroll horizontally, but the UI does not make that obvious. Long labels can be clipped at the right edge.

5. Separate observation: initial library gallery thumbnails appeared broken.

   The first app screen showed image placeholders with alt text instead of rendered gallery images. This is outside the prompt/style-node scope, but it is visible in `01-initial-app.png` and should be checked separately.

## Recommended Improvements

1. Change the prompt examples panel layout so it does not cover the style node.

   Options:
   - cap the examples panel height more aggressively;
   - render examples in an internal scroll area without expanding the node so far;
   - auto-collapse examples after `적용`;
   - adjust the default vertical spacing between prompt and style nodes.

2. Fix the library footer count.

   Show both rendered and matching counts, for example:

   - `80개 표시 · 검색 결과 126개 · 전체 314개`

   Or add pagination / load-more instead of silently slicing to 80.

3. Show style title in the selected style node card.

   Add a compact title line above the prompt preview so entries like `pure style reference 001` and `a close-up shot...` are distinguishable.

4. Improve filter row discoverability.

   Add a subtle horizontal fade, sticky row labels, or a compact dropdown alternative for category/tag filters.

5. Add a small automated browser smoke test.

   The CDP script in `scratch/verify-computer-use.mjs` can be turned into a repeatable smoke test for:

   - prompt examples open/apply;
   - style library load;
   - search;
   - card selection;
   - prompt panel style propagation.
