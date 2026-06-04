# UI/UX QA Plan: Node Scroll and Fixed Element Behavior

Date: 2026-05-29

## Goal

Verify that newly added and affected UI in the xGen workspace passes detailed usability QA, with special focus on node-sized windows, modal windows, scroll containers, fixed action areas, and content overflow.

The target outcome is not just "the feature works." The target outcome is that users can operate prompt examples and style references without hidden controls, blocked actions, confusing scroll behavior, or layout shifts that make the workflow feel broken.

## Scope

Primary areas:

- Prompt node
  - prompt textarea
  - `예시 프롬프트` disclosure panel
  - category filters
  - example cards
  - `추가` and `적용` buttons
  - prompt output chip

- Style reference node
  - empty state
  - selected style cards
  - delete control
  - `추가` button
  - style output chip

- `StyleAddModal`
  - `업로드` tab
  - `URL` tab
  - `라이브러리` tab
  - search input
  - category filter row
  - style tag filter row
  - library card grid
  - loading, empty, and error states
  - close control

- Output prompt panel
  - generated prompt preview
  - selected style prompt inclusion
  - action button placement

Out of scope unless regressions are visible:

- actual image generation result quality
- Codex style analysis output quality
- gallery image storage architecture
- non-workspace marketing/library page design

## Known Risks To Retest

These issues were observed in the previous computer-use verification and must be treated as active QA targets:

1. Prompt examples panel can overlap the style reference node.
2. Style library renders only 80 cards while the footer can imply that all matching results are displayed.
3. Selected style node card does not show the library title, only the prompt preview.
4. Horizontal filter rows do not clearly indicate overflow.
5. Initial gallery thumbnails appeared broken on the app shell.

## Test Environments

Run at least these environments:

- Production standalone server
  - Required because it matches packaged runtime more closely.
  - Example:

```bash
npm run build:next
PORT=3851 HOSTNAME=127.0.0.1 XGEN_STYLE_REFERENCE_ROOT=/Users/im_018/Documents/GitHub/2026_important/BrandGen/style-references node .next/standalone/server.js
```

- Electron packaged app if available
  - Use `release/mac/xGen.app` after `npm run pack:mac`.
  - Confirm packaged style reference root behavior still works.

- Next dev server
  - Use only if it responds normally.
  - If dev server opens a port but hangs on first request, record it as an environment issue and continue QA on standalone.

## Viewports

Test these viewport sizes:

- Desktop large: `1440 x 1000`
- Desktop medium: `1280 x 800`
- Compact laptop: `1024 x 768`
- Narrow stress: `820 x 720`
- Short height stress: `1280 x 620`

For each viewport, test with:

- browser zoom 100%
- app canvas zoom default
- app canvas zoomed in once
- app canvas zoomed out once

## Core Pass Criteria

A screen passes only when all of the following are true:

- Every primary action remains reachable without guessing.
- Scrollable areas visibly scroll with mouse wheel or trackpad.
- Fixed controls that should remain reachable do not disappear below an internal scroll area.
- A node expansion does not permanently block another required node action.
- No action button is hidden behind another node, modal, browser edge, or canvas control.
- Text does not overlap icons, buttons, cards, or adjacent text.
- Long prompts and long labels are clipped, wrapped, or scrolled intentionally.
- The user can escape or close modal states without losing control.
- Loading, empty, and error states fit inside the same layout rules as successful states.

## Prompt Node QA

### P1. Default Prompt Node

Steps:

1. Open the workspace.
2. Locate the prompt node.
3. Inspect textarea, `예시 프롬프트`, and `설명 출력`.

Expected:

- Textarea is readable and not clipped.
- `예시 프롬프트` header is visible.
- `설명 출력` chip remains visible and clickable.
- The prompt node does not cover the style node in its collapsed state.

Pass evidence:

- Screenshot at default viewport.
- DOM or visual check showing all controls visible.

### P2. Prompt Examples Open State

Steps:

1. Open `예시 프롬프트`.
2. Scroll inside the examples list.
3. Move through all category filters.
4. Check first and last visible example cards.

Expected:

- The example list scrolls internally if content exceeds the available node area.
- Category chips remain reachable when examples are scrolled.
- `추가` and `적용` buttons are visible for each card when the card is in view.
- The expanded panel does not block the style node `추가` button or any required output action.

Fail examples:

- User must close examples before reaching style node controls.
- The panel grows so tall that another node's button is obscured.
- The list scrolls the entire canvas instead of the intended inner list.

### P3. Prompt Example Apply and Append

Steps:

1. Select a category such as `제품`.
2. Click `적용` on the first card.
3. Confirm textarea updates.
4. Reopen examples if needed.
5. Click `추가` on another card.

Expected:

- `적용` replaces the textarea value.
- `추가` appends with clear spacing.
- After applying or appending, the user still has a clear route to continue: close, keep scrolling, or move to another node.
- Any applied state indicator does not shift card height enough to cause accidental clicks.

## Style Reference Node QA

### S1. Empty State

Steps:

1. Load workspace with no style references.
2. Inspect style node.

Expected:

- Empty message fits within the node.
- `추가` button is visible without scrolling.
- `스타일 출력` chip is visible without scrolling.
- Prompt examples open state does not block `추가`.

### S2. One Selected Style

Steps:

1. Add one style from the library.
2. Inspect style node card.
3. Toggle selected state if supported.
4. Delete the style.

Expected:

- Selected badge remains visible.
- Thumbnail loads and does not distort the card height unexpectedly.
- Title or identifying label is visible, or the lack of title is recorded as a UX issue.
- Delete control is reachable and does not overlap text.
- `추가` remains reachable after one item is added.
- `스타일 출력` remains reachable after one item is added.

### S3. Many Selected Styles

Steps:

1. Add at least 5 style references.
2. Add at least 10 style references if practical.
3. Scroll the node contents.
4. Select a middle and lower item.
5. Delete a lower item.

Expected:

- Style card list scrolls inside the node or the node provides another clear overflow strategy.
- `추가` and `스타일 출력` remain reachable.
- If `추가` and `스타일 출력` are intended to be fixed controls, they stay pinned while the card list scrolls.
- If they are intended to scroll with the list, this must be intentional and documented; the user must not be trapped below a long list.
- Deleting an item does not jump scroll position unexpectedly.

Fail examples:

- User must scroll a very tall node through the canvas to reach `추가`.
- Output chip disappears below a long list with no visual indication.
- Delete button becomes inaccessible because the card is clipped.

## Style Add Modal QA

### M1. Modal Frame and Close

Steps:

1. Open `스타일 추가`.
2. Test close button.
3. Reopen modal.
4. Press Escape if supported.
5. Click outside if supported.

Expected:

- Modal fits inside viewport.
- Close button is always visible.
- Header does not scroll away unless intentionally designed.
- Tab segmented control remains visible when modal content scrolls.

### M2. Upload Tab

Steps:

1. Open upload tab.
2. Verify dropzone.
3. Add a large local image.
4. Inspect preview and prompt textarea.

Expected:

- Dropzone fits without clipping.
- Preview has stable height.
- Prompt textarea and action buttons remain reachable.
- `Codex 자동 분석` button does not overlap label or prompt textarea.

### M3. URL Tab

Steps:

1. Open URL tab.
2. Paste a short valid URL.
3. Paste a very long URL.
4. Load URL.

Expected:

- Input text does not push the button offscreen.
- Load button remains visible.
- Error state fits without covering the action row.
- Preview state keeps cancel/add actions reachable.

### M4. Library Loading State

Steps:

1. Open library tab with normal data.
2. Simulate slow API if possible.

Expected:

- Loading state is centered and readable.
- Header, tabs, and close button stay reachable.
- No layout jump hides controls when data appears.

### M5. Library Success State

Steps:

1. Open library tab.
2. Scroll card grid from top to bottom.
3. Scroll category row horizontally.
4. Scroll style tag row horizontally.
5. Select several filters.

Expected:

- Search input stays reachable.
- Category and style tag filters are scrollable and visibly indicate overflow.
- Card grid scrolls inside the modal, not the whole page.
- Modal footer/status remains visible or intentionally placed.
- Card grid does not cover close button or tabs.
- Cards maintain stable image and text dimensions while images load.

### M6. Library Search

Steps:

1. Search `macro`.
2. Search a title fragment.
3. Search a tag fragment.
4. Search an impossible string.
5. Clear the search.

Expected:

- Search input keeps focus while typing.
- Result count matches rendered count semantics.
- Empty state is visible and not overly tall.
- Clearing search restores full result set.
- The UI distinguishes "matching results" from "currently rendered cards" if virtualized or capped.

### M7. Library Card Selection

Steps:

1. Select a visible library card.
2. Confirm modal closes.
3. Confirm style node updates.
4. Confirm output prompt panel includes selected style prompt.

Expected:

- Click target is clear.
- Selection has no double-click requirement.
- Modal closes only after successful add.
- The selected card is identifiable in the style node.

## Output Prompt Panel QA

Steps:

1. Apply a prompt example.
2. Add a style reference.
3. Verify prompt panel.
4. Resize viewport shorter.

Expected:

- Prompt panel remains readable.
- Generated prompt preview scrolls or clips intentionally.
- `이미지 생성` button remains reachable.
- Selected style prompt appears only when style node is connected and active.
- Long style prompt does not push the generation button below the visible area without a clear scroll strategy.

## Regression Matrix

Run these combined flows:

1. Open prompt examples, apply prompt, close examples, add style from library.
2. Open prompt examples, leave it open, try to add style.
3. Add style first, then open prompt examples.
4. Add 5 styles, then open output prompt panel.
5. Search library, select style, delete style, reopen library.
6. Switch upload -> URL -> library -> upload repeatedly.
7. Narrow viewport, open style library, search, select card.
8. Short viewport, open prompt examples, scroll to lower cards, apply.

## Accessibility And Interaction Checks

Required checks:

- Tab order reaches modal tabs, search input, filters, cards, close button.
- Keyboard focus is visible.
- Escape closes modal or at least does not trap focus.
- Scroll wheel operates the hovered scroll area.
- Trackpad scroll behaves the same as mouse wheel.
- Buttons have clear labels or tooltips where icons are ambiguous.
- Text contrast remains acceptable in selected, disabled, loading, and error states.

## Evidence Requirements

For each QA pass, save:

- screenshot before interaction
- screenshot of maximum expanded prompt node
- screenshot of style modal library top
- screenshot of style modal library scrolled lower
- screenshot after search with non-empty results
- screenshot after empty search
- screenshot after selected style is added
- screenshot of output prompt panel with long style prompt

Store screenshots under:

```text
notes/screenshots/ui-ux-scroll-fixed-qa-2026-05-29/
```

Create a completion report under:

```text
notes/ui-ux-scroll-fixed-element-qa-report.md
```

## Severity Definitions

- P0: User cannot complete core workflow or UI becomes trapped.
- P1: Core workflow is possible only after unintuitive workaround, such as closing unrelated panels or resizing window.
- P2: Workflow works but causes confusion, hidden state, misleading count, unclear scroll area, or hard-to-hit control.
- P3: Polish issue with low workflow impact.

## Completion Gate

The QA objective is complete only when:

- All tests in this plan have been executed or explicitly marked not applicable with reason.
- Every P0 and P1 issue is fixed and retested.
- Every P2 issue is either fixed or documented with owner-approved deferral.
- Screenshots prove the final state for prompt node, style node, style modal, and output prompt panel.
- `npm run build:next` passes after any code changes.
- A final QA report lists:
  - environment
  - viewport coverage
  - commands run
  - issues found
  - fixes made
  - retest results
  - remaining risks
