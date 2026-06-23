# BrandGen Update Summary - 2026-06-23

## Overview

Today’s work focused on improving reference-image workflows, rebuilding the Background node around reusable recipes and references, and fixing usability issues in the Style Add library popup.

Committed and pushed:

- Branch: `feature/apps-sdk-ui-foundation`
- Commit: `1520385 Improve reference image and background controls`
- Remote: `origin https://github.com/visualog/brand-gen.git`

## 1. Image Mix Symbol Reference

Updated Image Mix so uploaded symbol/logo images can be treated as symbol references instead of generic style references.

Key changes:

- Added a `symbol` image-mix role.
- New image uploads default to symbol-focused behavior where relevant.
- Prompt assembly now preserves symbol/logo-mark identity while avoiding full composition copying.
- Worker-side image attachment logic now handles symbol references intentionally.

Primary files:

- `src/components/nodes/ImageMixNode.tsx`
- `src/app/page.tsx`
- `scripts/codex-worker.mjs`

Reference notes:

- `notes/symbol-render-workflow-plan-2026-06-23.md`
- `notes/symbol-render-workflow-report-2026-06-23.md`

## 2. Background Node Recipe And Reference Workflow

Reworked the Background node from a flat preset picker into a recipe-first background system.

Key changes:

- Added background recipes such as app icon, product studio, brand graphic, lifestyle interior, desk workspace, abstract campaign, outdoor natural, and urban architecture.
- Added background reference image support.
- Added background-specific analysis copy in `StyleAddModal`.
- Background reference images can now be passed into generation as background-role references.
- Prompt assembly now includes background reference count and background reference summaries.

Primary files:

- `src/components/nodes/BackgroundNode.tsx`
- `src/components/StyleAddModal.tsx`
- `src/lib/codex-worker-client.ts`
- `src/app/page.tsx`
- `scripts/codex-worker.mjs`

Reference notes:

- `notes/background-node-recipe-reference-plan-2026-06-23.md`
- `notes/background-node-recipe-reference-report-2026-06-23.md`

## 3. Background Detail Toggle

Changed Background node fine-tuning controls from a dropdown-like disclosure button into a clear toggle switch.

Key changes:

- Replaced chevron/dropdown affordance with a `role="switch"` control.
- Fine-tuning options remain hidden until the toggle is enabled.
- The control keeps the Background node compact by default.

Primary file:

- `src/components/nodes/BackgroundNode.tsx`

Reference notes:

- `notes/background-detail-toggle-plan-2026-06-23.md`
- `notes/background-detail-toggle-report-2026-06-23.md`

## 4. Environment-Based Background Child Presets

Adjusted Background node detail controls so every low-level preset group is not shown at once.

Key changes:

- `환경` is now the top-level detail choice.
- Only environment-relevant child preset groups are shown after environment selection.
- Existing prompt fields are preserved, so snapshots and worker prompt assembly remain compatible.

Environment mapping:

- `pure`: surface, treatment
- `studio`: surface, depth, treatment
- `workspace`: surface, detail, cleanliness
- `interior`: depth, detail, treatment
- `outdoor`: depth, treatment
- `urban`: surface, depth, detail
- `abstract`: depth, treatment, surface

Primary file:

- `src/components/nodes/BackgroundNode.tsx`

Reference notes:

- `notes/background-environment-child-presets-plan-2026-06-23.md`
- `notes/background-environment-child-presets-report-2026-06-23.md`

## 5. Style Add Library Scroll Fix

Fixed scroll behavior in the Style Add popup library tab.

Key changes:

- Category and style-tag rows now use horizontal scroll behavior correctly.
- Vertical wheel movement on horizontal filter rows is converted to horizontal movement.
- The library card list now has its own constrained vertical scroll area.
- React Flow canvas wheel handling is prevented only inside the actual scroll areas.
- A follow-up regression fix removed modal-level wheel blocking so the popup itself no longer feels position-locked.

Primary file:

- `src/components/StyleAddModal.tsx`

Reference notes:

- `notes/style-library-scroll-fix-plan-2026-06-23.md`
- `notes/style-library-scroll-fix-report-2026-06-23.md`
- `notes/style-modal-position-regression-fix-2026-06-23.md`

## Verification

Checks run during today’s work:

- `./node_modules/.bin/eslint src/components/nodes/BackgroundNode.tsx`
- `./node_modules/.bin/eslint src/components/StyleAddModal.tsx`
- `node --check scripts/codex-worker.mjs`
- `npm run build:next`
- `curl -sS --max-time 10 -I http://127.0.0.1:3002/`

Results:

- Next build passed.
- Local app route returned HTTP 200.
- Targeted eslint checks passed with existing Next.js `<img>` optimization warnings only.
- `scripts/codex-worker.mjs` syntax check passed.

## Screenshots

Before/after screenshots were saved under:

- `notes/screenshots/symbol-render-workflow-2026-06-23/`
- `notes/screenshots/background-node-recipe-reference-2026-06-23/`
- `notes/screenshots/background-detail-toggle-2026-06-23/`
- `notes/screenshots/background-environment-child-presets-2026-06-23/`
- `notes/screenshots/style-library-scroll-fix-2026-06-23/`

## Remaining Notes

- `gh` CLI is not installed in the local environment, so no PR was created.
- The requested GitHub push was completed directly with `git push`.
- Manual browser review is still useful for confirming exact trackpad and mouse scroll feel inside the Style Add popup.
