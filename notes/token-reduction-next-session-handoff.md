# Token Reduction Next Session Handoff

Date: 2026-06-03

## Current Goal

Reduce BrandGen image generation token consumption to roughly 10-20% of the current observed usage while preserving image quality.

The latest user-reported generation used **31,636 tokens**, which is still too high compared with target references around several thousand tokens for 4K image generation. The next session should continue from current repo state and should not reconstruct the full previous conversation.

## Required Operating Method

Use the TCREI + automatic verification loop described in:

`/Users/im_018/Documents/TCREI-auto-verification-loop.md`

Key rules for the next session:

- Do not restore or infer the entire old conversation.
- Use current repo state, this handoff, and existing plan/report notes only.
- Work in small iterations.
- Each iteration must include:
  - Task
  - Context
  - Requirements
  - Small Tasks
  - Verification Commands
  - Artifacts
  - Pass Criteria
  - Next Task Trigger
- Each implementation iteration must end with:
  - targeted verification
  - updated note/report artifact
  - blocker/next-task summary

## Relevant Repo

`/Users/im_018/Documents/GitHub/2026_important/BrandGen`

## AGENTS.md Constraints

For meaningful implementation work in this repository:

1. Create a planning note in `notes/` before editing code.
2. Capture relevant full-screen before screenshots under `notes/screenshots/<task-slug>-<YYYY-MM-DD>/`.
3. After implementation and verification, create a completion report note in `notes/`.
4. Include before/after screenshots in the completion report.
5. Summarize changed files, verification commands, results, and remaining risks.
6. If touching Next.js APIs/conventions, read the relevant guide in `node_modules/next/dist/docs/` first.

## Rollback / Safety

A rollback checkpoint was previously created:

`stash@{0}` named `checkpoint-before-figma-weave-implementation-2026-06-01`

Do not use destructive git commands unless explicitly requested. The worktree is dirty with many existing changes. Treat them as user/agent work and do not revert unrelated files.

## Completed Token Reduction Work

### Iteration 1: Token Usage Reporting

Report:

`notes/generation-token-usage-report.md`

Implemented:

- Extract token usage from Codex JSONL events.
- Return `tokenUsage` and `tokenUsageBreakdown` from `/api/generate`.
- Store token usage on generated results.
- Show detailed token usage in `CanvasNode`.
- Show compact total token count in gallery cards.

Validation:

- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Packaged app launched and responded on `127.0.0.1:3001`.

### Iteration 2: Text Prompt and Metadata Reduction

Report:

`notes/token-usage-reduction-report.md`

Implemented:

- `/translate` no longer calls Codex for automatic node setting prompt generation.
- Client creates compact deterministic execution prompts.
- Worker no longer re-attaches duplicated node settings/style reference/image mix text when a prebuilt prompt is present.
- Separate Codex metadata generation call was removed from the image generation path.
- Token breakdown records prompt composition stages as zero-token deterministic stages.

Expected impact:

- Node setting prompt generation model tokens should be near zero.
- Final prompt composition model tokens should be near zero.
- One extra metadata Codex call per image is removed.

Validation:

- `node --check scripts/codex-worker.mjs`: passed.
- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- `/api/translate` returned compact prompt without Codex execution logs.

### Iteration 3: Image Input Optimization

Report:

`notes/token-image-input-optimization-report.md`

Implemented:

- Added `sharp`-based optimization before passing reference images to `codex exec`.
- Style refs capped to WebP max 768px.
- Element sheet refs capped to WebP max 1024px.
- Image mix refs capped to WebP max 1024px.
- Generated layer / mask edit refs capped to WebP max 1280px.
- Fallback to original image write if optimization fails.

Expected impact:

- Lower input tokens from attached reference images.

Validation:

- `sharp` availability check: passed.
- `node --check scripts/codex-worker.mjs`: passed.
- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Direct packaged app run responded on `127.0.0.1:3001`.

### Iteration 4: Reference Attachment Budget

Report:

`notes/token-reference-budget-report.md`

Implemented:

- Strong style references remain attached as image inputs.
- Medium/subtle style references become text-only guidance if prompt guidance exists.
- Medium/high image mix references remain attached.
- Low-impact image mix references become text-only guidance.
- Generated-layer / mask-edit references remain attached.
- Attached reference sizes were further reduced:
  - strong style: max 640px
  - fallback style: max 512px
  - high mix: max 768px
  - medium mix: max 640px
  - mask/generated layer: max 1024px
- Skipped references are preserved as:
  - `TEXT-ONLY STYLE GUIDANCE`
  - `TEXT-ONLY MIX GUIDANCE`
- Added `sharp` as a direct dependency in `package.json` and root `package-lock.json`.

Validation:

- `node --check scripts/codex-worker.mjs`: passed.
- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Direct packaged app run responded on `127.0.0.1:3001`.

Runtime note:

- Repeated `open -n release/mac/xGen.app` left several xGen processes around. They were cleaned up at the end of the iteration.
- The app server was intentionally not left running.

## Current Known Problem

The latest measured generation before the final reference-budget changes used **31,636 tokens**.

Subsequent controlled measurements now show the floor of this path:

| Setup | Total | Input | Output | Cached | Attached refs |
|---|---:|---:|---:|---:|---:|
| Two attached refs | 32,773 | 32,567 | 206 | 2,432 | 2 |
| One attached style ref, image mix text-only | 22,047 | 21,836 | 211 | 3,456 | 1 |
| No attached refs, hidden default style removed | 21,341 | 21,242 | 99 | 2,432 | 0 |

The prompt-only floor only improved by **706 tokens** from the one-reference run and by **1,432 tokens** from the two-reference run. That means additional prompt trimming is no longer the right lever. The remaining cost is dominated by the image-generation backend itself.

Decision: stop further token-reduction work on this path unless a new backend-level cost lever appears. Future work should focus on exposing the cost floor to users, not chasing marginal prompt savings.

## Important Diagnostic Hypothesis

Text prompt token usage has already been reduced heavily. If total usage remains high, the likely sources are:

1. Remaining attached image input tokens.
2. Hidden overhead from the Codex image-generation backend.
3. Output token accounting for image generation that may not be directly comparable with Gemini-style image token tables.
4. Too many high-impact references still attached.
5. Generated-layer / mask-edit reference still too large for the target budget.

## Next Task

No more prompt-trimming iterations are worth doing on this path. If token work resumes, it should be a backend cost/accounting change or a product-facing cost display, not another prompt reduction pass.

### Task

Document the measured floor and stop further reduction work unless a backend change is introduced.

### Context

Use current repo state and the reports listed above. Do not re-read the whole conversation.

### Requirements

- Use the same or as close as possible generation setup to the one that used 31,636 tokens.
- Record:
  - total tokens
  - input tokens
  - output tokens
  - cached input tokens
  - token breakdown rows shown in the Canvas node
  - number/type of attached references
  - visual quality notes
- Do not spend multiple generations unless the user approves.

### Small Tasks

1. Preserve the current measurement reports.
2. Update any handoff or summary notes that still imply more prompt trimming is likely to help.
3. If needed later, add a backend-cost or user-facing cost display task instead of another generation measurement task.

### Verification Commands

Use as needed:

- `node --check scripts/codex-worker.mjs`
- `npm run build:next`
- `npm run pack:mac`
- `lsof -nP -iTCP -sTCP:LISTEN | rg 'xGen|3001|4317'`
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`

### Artifacts

Suggested paths:

- Planning note: `notes/token-controlled-generation-measurement-plan.md`
- Screenshots: `notes/screenshots/token-controlled-generation-measurement-2026-06-03/`
- Report: `notes/token-controlled-generation-measurement-report.md`

### Pass Criteria

- The measured floor is recorded.
- The evidence supports stopping prompt-only reduction work.
- The next action is a backend or product-cost task, not another prompt cut.

### Next Task Trigger

If a future backend change becomes available:

- Re-measure only if the backend token accounting changes or a new image-input compression lever is introduced.
- Do not schedule another prompt-only measurement; the floor is already established.
- If the product needs a clearer cost story now, prioritize a UI or report that exposes the observed floor to users.

## Candidate Next Reductions If Needed

The prompt-only path is already at a practical floor. Further prompt reductions are not recommended.

If a new backend lever appears later, revisit only one of these:

1. Make medium image mix references text-only by default.
2. Lower mask/generated layer reference cap from 1024px to 768px, only for non-mask generation.
3. Add a user-facing “reference budget” control:
   - Economy: attach only one strong reference
   - Balanced: attach strong style + high mix
   - Fidelity: attach all high/medium references
4. Store analyzed style prompts for library references and prefer text-only style guidance unless the user explicitly selects strong visual style.

## New Session Prompt

Use the following prompt to start the next session:

```text
토큰 소모를 줄이기 위한 prompt-trimming 작업은 현재 측정된 floor에 도달했다.

이전 대화 전체를 복원하지 말고, 현재 repo/file 상태와 아래 문서만 기준으로 판단해줘.

Repo:
/Users/im_018/Documents/GitHub/2026_important/BrandGen

반드시 먼저 읽을 문서:
- /Users/im_018/Documents/TCREI-auto-verification-loop.md
- notes/token-reduction-next-session-handoff.md
- notes/token-prompt-only-styleless-controlled-measurement-report.md
- notes/token-no-reference-controlled-measurement-report.md
- notes/token-medium-image-mix-controlled-measurement-report.md
- notes/token-reference-budget-report.md

현재 결론:
- prompt-only floor는 여전히 21k tokens 수준이다.
- 추가 prompt trimming은 더 이상 유의미하지 않다.
- 다음 작업은 backend cost/accounting 또는 product-facing cost display 여야 한다.

다음 태스크:
현재 measured floor를 바탕으로, 사용자에게 비용 floor를 노출하는 UI/report 작업 또는 backend accounting 분리 작업 중 하나를 선택해서 1회만 구현/검증해줘.

진행 규칙:
- 작업 전 notes/ 아래에 계획 노트를 작성해줘.
- 필요한 경우에만 before/after 전체 화면 스크린샷을 저장해줘.
- 한 번에 여러 번 측정하지 말고, 구현 후 검증은 최소 횟수로 끝내줘.
- 변경 후에는 report note에 실제 수치와 결론을 기록해줘.
- 완료라고 말하기 전에 검증 명령과 산출물 경로를 보고해줘.
```
