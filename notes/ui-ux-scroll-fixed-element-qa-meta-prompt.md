# Meta Prompt: Complete UI/UX Scroll and Fixed Element QA

## Objective

You are working in `/Users/im_018/Documents/GitHub/2026_important/BrandGen`.

Your goal is to complete the QA plan in:

```text
notes/ui-ux-scroll-fixed-element-qa-plan.md
```

The goal is achieved only when the prompt node, style reference node, style add modal, and output prompt panel pass detailed UI/UX QA for scroll behavior, fixed controls, overflow handling, and interaction reachability.

Do not stop at identifying issues. Fix P0/P1 issues, retest them in the real app, and document the final results.

## Operating Principles

- Treat the running app as authoritative.
- Use computer-use style verification: open the real app, click actual controls, type into actual fields, scroll actual containers, and capture screenshots.
- Prefer production standalone or packaged Electron verification when dev server behavior is unreliable.
- Do not claim completion from code inspection alone.
- Do not redefine the goal around easier smoke tests.
- If a workflow is possible only because you know a workaround, record that as a UX problem.

## Required Context

Read these files first:

```text
notes/ui-ux-scroll-fixed-element-qa-plan.md
notes/computer-use-node-feature-verification-report.md
src/components/nodes/PromptNode.tsx
src/components/nodes/StyleNode.tsx
src/components/StyleAddModal.tsx
src/app/page.tsx
```

If editing Next.js routes or framework-sensitive behavior, read the relevant docs in:

```text
node_modules/next/dist/docs/
```

## Initial Setup

Create the screenshot directory:

```text
notes/screenshots/ui-ux-scroll-fixed-qa-2026-05-29/
```

Start from the current worktree. Do not revert unrelated user changes.

Run a production build:

```bash
npm run build:next
```

Run the production standalone app for QA:

```bash
PORT=3851 HOSTNAME=127.0.0.1 XGEN_STYLE_REFERENCE_ROOT=/Users/im_018/Documents/GitHub/2026_important/BrandGen/style-references node .next/standalone/server.js
```

If port `3851` is occupied, choose a nearby free port and record it in the QA report.

## Test Execution Requirements

Execute the full plan, not just the happy path.

Required viewport coverage:

- `1440 x 1000`
- `1280 x 800`
- `1024 x 768`
- `820 x 720`
- `1280 x 620`

Required workflows:

1. Prompt node collapsed state.
2. Prompt examples open state.
3. Prompt category filter.
4. Prompt `적용`.
5. Prompt `추가`.
6. Style node empty state.
7. Style add modal upload tab.
8. Style add modal URL tab.
9. Style add modal library tab.
10. Library search with non-empty result.
11. Library search with empty result.
12. Library category and tag horizontal scroll.
13. Library card grid vertical scroll.
14. Library card select.
15. Style node with one selected style.
16. Style node with many selected styles.
17. Output prompt panel after prompt + style selection.
18. Short viewport stress where output button and modal close button must remain reachable.

For every workflow, verify:

- what scroll container moves;
- whether primary controls remain visible;
- whether any required control becomes hidden;
- whether content is clipped intentionally or accidentally;
- whether state changes cause layout jumps;
- whether the user can recover without closing unrelated UI.

## Known Issues To Validate

Start by confirming whether these still reproduce:

1. Prompt examples panel overlaps or blocks the style reference node.
2. Library footer count says more items are displayed than are actually rendered.
3. Selected style card lacks a visible title.
4. Horizontal filter rows have weak overflow affordance.
5. Initial gallery thumbnails show broken images.

If any of these reproduce:

- classify severity;
- fix P0/P1 immediately;
- fix P2 when reasonably scoped;
- document any deferred P2/P3 with a concrete reason.

## Fixing Guidance

When fixing UI:

- Preserve existing design tokens and visual language.
- Keep node surfaces compact and operational.
- Prefer internal scroll containers for long lists.
- Keep modal header, close button, and tabs reachable.
- Keep destructive controls visible but not visually dominant.
- Avoid cards inside cards.
- Do not introduce decorative layout changes unrelated to QA.
- Do not let text overflow outside buttons, chips, cards, or modal bounds.

Likely fix areas:

```text
src/components/nodes/PromptNode.tsx
src/components/nodes/StyleNode.tsx
src/components/StyleAddModal.tsx
src/app/page.tsx
```

## Verification Commands

After fixes, run:

```bash
npm run build:next
```

If any test automation script is used, record:

- command
- target URL
- viewport
- screenshots produced
- pass/fail summary

Manual computer-use screenshots are acceptable if they clearly show the tested state.

## Required Final Artifacts

Create:

```text
notes/ui-ux-scroll-fixed-element-qa-report.md
```

The report must include:

- date
- runtime used
- viewport matrix
- screenshots
- test results by section
- issues found with severity
- files changed
- verification commands
- retest results
- remaining risks

Screenshot directory:

```text
notes/screenshots/ui-ux-scroll-fixed-qa-2026-05-29/
```

## Completion Audit

Before claiming completion, audit every requirement in `notes/ui-ux-scroll-fixed-element-qa-plan.md`.

For each requirement, identify evidence:

- screenshot
- DOM/runtime observation
- command output
- fixed code reference
- retest result

The goal is not complete if:

- any P0/P1 issue remains;
- any required workflow has not been tested;
- screenshots do not cover final fixed states;
- `npm run build:next` has not passed after changes;
- the final report does not explicitly list remaining risks.

Only mark the task complete when the QA plan has been executed, blocking issues are fixed, and the final report proves the pass state.
