# UI/UX Scroll and Fixed Element QA Report

- Date: 2026-05-29
- Scope: node-window scroll behavior, fixed/reachable controls, style reference modal, prompt/output overflow, and related regression paths
- Runtime: production standalone Next server at `http://127.0.0.1:3851`
- Browser automation: Chrome CDP `http://127.0.0.1:9223`
- Screenshot evidence: `notes/screenshots/ui-ux-scroll-fixed-qa-2026-05-29/`
- QA summary artifact: `notes/screenshots/ui-ux-scroll-fixed-qa-2026-05-29/qa-summary.json`

## Result

Passed for the primary QA goal.

All planned node-window scroll/fixed-control checks were executed across the selected viewport matrix. The P1/P2 UX issues found during inspection were fixed and re-tested. The remaining open observation is unrelated to node scroll/fixed behavior: some previously saved gallery thumbnails return 404 through `/api/gallery/image/[file]`.

## Viewport Matrix

| Viewport | Prompt examples overlap style node | Prompt examples internal scroll | Style modal fits viewport | Library cards rendered | Broken library images | Search footer | Empty state | Style selected | Output reflects style |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1440x1000 | Pass | Pass | Pass | 80 | 0 | Pass | Pass | Pass | Pass |
| 1280x800 | Pass | Pass | Pass | 80 | 0 | Pass | Pass | Pass | Pass |
| 1024x768 | Pass | Pass | Pass | 80 | 0 | Pass | Pass | Pass | Pass |
| 820x720 | Pass | Pass | Pass | 80 | 0 | Pass | Pass | Pass | Pass |
| 1280x620 | Pass | Pass | Pass | 80 | 0 | Pass | Pass | Pass | Pass |

The verified library search footer text was:

```text
80개 표시 · 검색 결과 126개 · 전체 314개. 카드를 선택하면 스타일 참조 노드에 바로 추가됩니다.
```

## Key Screenshots

- `large-02-prompt-examples-open.png`: prompt examples panel open, internal list visible, style node not blocked.
- `short-07-style-library-top.png`: style modal fits a 620px-tall viewport and keeps key controls reachable.
- `large-09-style-library-search-macro.png`: search results and count footer visible.
- `large-10-style-library-empty-search.png`: empty result state visible.
- `large-11-style-added-output.png`: selected style appears in the style node and output prompt.
- `large-12-many-styles.png`: multiple selected styles stay inside the style node's internal scroll area.
- `large-13-style-modal-opens-while-prompt-open.png`: style modal opens while prompt examples are expanded without layout collision.

## Issues Found and Fixed

| Severity | Issue | Fix | Verification |
| --- | --- | --- | --- |
| P1 | Expanded prompt examples panel could overlap the style node and make the style add flow feel blocked. | Gave the expanded prompt node a fixed internal layout with its own scroll region, clamped example copy, and moved default style/output nodes down. | `promptOverlapsStyleAfterOpen: false` for all 5 viewports. |
| P2 | Prompt example category filters had weak horizontal overflow affordance. | Kept the filter row horizontally scrollable and added a visible scroll hint/fade affordance. | Product filter path captured in every viewport. |
| P2 | Style library footer implied the full dataset was visible while only the first 80 cards were rendered. | Added explicit displayed/result/total count text. | Footer text verified in `qa-summary.json`. |
| P2 | Selected style cards in the style node did not expose the style title clearly. | Added a visible title line with prompt text below it. | `styleSelected: true` and direct screenshot review. |
| P2 | Long output prompts could push or obscure fixed actions. | Added internal overflow limits for Korean and English prompt text areas. | Output node remained usable after prompt apply/append and style selection. |
| P2 | Re-adding the same library card could produce duplicate React keys. | Made library-derived style IDs unique per add action. | Multi-style add regression passed with 6 selected styles. |
| P3 | Modal Escape close behavior was not covered by the QA script. | Added Escape handling to the style add modal and exercised it during the prompt-open modal regression path. | Regression path completed after Escape without blocking later steps. |

## Files Changed

- `src/app/page.tsx`
- `src/components/StyleAddModal.tsx`
- `src/components/nodes/PromptNode.tsx`
- `src/components/nodes/StyleNode.tsx`
- `src/components/nodes/OutputNode.tsx`
- `scratch/run-ui-ux-scroll-qa.mjs`

## Verification Commands

```bash
npm run build:next
```

Result: passed. Next.js 16.2.6 compiled successfully, TypeScript completed, and 19 static pages were generated.

```bash
BASE_URL=http://127.0.0.1:3851 CDP_URL=http://127.0.0.1:9223 node scratch/run-ui-ux-scroll-qa.mjs
```

Result: passed. Generated 58 QA artifacts including screenshots and `qa-summary.json`.

```bash
curl -s -I http://127.0.0.1:3851/api/gallery/image/result-1779843257921-imageUrl.png
```

Result: `404 Not Found`. This is documented as a remaining gallery-image data/path issue outside the node scroll/fixed-control QA target.

## Completion Gate

- Plan and meta prompt reviewed: complete.
- All planned viewport sizes executed: complete.
- Prompt node expanded/collapsed behavior verified: complete.
- Style node empty, selected, and multi-selected states verified: complete.
- Style add modal upload, URL, library, search, empty, and selection states verified: complete.
- Fixed/reachable controls checked under short and narrow viewports: complete.
- P0/P1 issues: none remaining in target scope.
- P2 issues in target scope: fixed and re-tested.
- Remaining risk: gallery thumbnail 404s should be handled in a separate gallery storage/image route pass.
