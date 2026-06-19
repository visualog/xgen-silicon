<!-- BEGIN:brandgen-agentos-operating-rules -->
# BrandGen Operating Rules

This repository uses a non-destructive AgentOS-style operating layer. Existing
project rules remain active; the rules below define how to read and combine
them.

## Rule Priority

1. User instructions in the current conversation.
2. This `AGENTS.md` file.
3. BrandGen state and workflow docs under `docs/states/` and `docs/workflows/`.
4. Task notes and handoffs under `notes/`.
5. Generic package or framework guidance.

When rules overlap, use the more specific BrandGen rule. Do not remove or
override existing project rules unless the user explicitly asks for that.

## First-Read Router

- Read this file first.
- Do not scan the whole repository or the whole `docs/` / `notes/` tree by default.
- Classify the request before opening extra docs.
- For code or documentation changes, read:
  1. `docs/states/work-state.md`
  2. `docs/states/task-board.md`
  3. `docs/states/project-state.md`
- Then read exactly one matching workflow unless the workflow itself names an extra file.

## Task Types

| Type | Use When | Read |
| --- | --- | --- |
| General | question, explanation, review, comparison, file inspection | `docs/workflows/01-general-task.md` only if needed |
| Feature | add, create, implement, extend behavior | `docs/workflows/02-feature-development.md` |
| Bugfix | broken, failing, not reflected, test error | `docs/workflows/03-bugfix-flow.md` |
| Refactor | restructure, split files, remove duplication, cleanup | `docs/workflows/04-refactoring-flow.md` |
| Release | build, ship, package, final validation | `docs/workflows/05-release-flow.md` |
| UI | screen, layout, component, style, shadcn, icon, font, motion | `docs/workflows/06-ui-implementation.md` |
| Iteration | long task, repeated failure, recovery, verification loop | `docs/workflows/07-iteration-verification.md` |

## Work Boundaries

- Perform one bounded task at a time.
- Do not continue to the next queued task without explicit approval.
- Treat only these standalone messages as approval to continue: `진행`, `계속`, `다음`, `승인`, `다음 태스크 진행`, `진행해줘`.
- `해줘`, `수정해줘`, `검토해줘`, `설명해줘`, `다시 해줘`, and `오류 고쳐줘` are requests for the current task, not approval to start another task.
- Ask before package installs, project init, registry additions, MCP setup, destructive commands, or large file moves.
- Keep secrets, tokens, passwords, customer data, and personal data out of terminal output, notes, reports, and handoffs.

## Verification And Notes

- Prefer targeted verification for the changed surface.
- Run broader checks only for release work, dependency/build config changes, wide shared logic changes, or when targeted verification is insufficient.
- Keep the Fabric Work Notes block below for planning notes, screenshots, and completion reports.
- For UI/design work, combine this router with the shadcn/ui Style Rules block below.
<!-- END:brandgen-agentos-operating-rules -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:fabric-work-notes -->
# Fabric Work Notes

For meaningful implementation work in this repository:

1. Before editing code, create a planning note in `notes/`.
2. Capture relevant full-screen before screenshots and include them in the planning note.
3. Store screenshots under `notes/screenshots/<task-slug>-<YYYY-MM-DD>/`.
4. After implementation and verification, create a completion report note in `notes/`.
5. Include before/after screenshots in the completion report so the main screen changes can be reviewed visually.
6. In the completion report, summarize files changed, verification commands, results, and remaining risks.
<!-- END:fabric-work-notes -->

<!-- BEGIN:shadcn-style-rules -->
# shadcn/ui Style Rules

For UI/design implementation, use shadcn/ui as the active foundation. Refer to `docs/ui-style-system.md` before choosing visual density, spacing, radius, and tone.

Default choices:

- Use Vega for neutral product UI.
- Use Nova for compact SaaS, admin, dashboard, and developer UI.
- Use Luma or Maia for soft consumer-facing screens.
- Use Rhea for rounded but information-heavy product UI.
- Use Mira only for dense operations/data-table interfaces.
- Use Lyra for technical/devtool surfaces.
- Use Sera for editorial, marketing, portfolio, and typography-led pages.

BrandGen defaults:

- Use Luma for service UI and service previews: xGen creative workspace, foundation previews, component examples, pattern previews, and template previews.
- Use Vega/Rhea for the `/design-system` documentation shell: navigation, page chrome, explanatory copy, and catalog layout.
- Keep spacing, padding, gaps, and margins on a 4px grid. Prefer 8px increments for larger layout rhythm.
- Avoid divider lines and border-heavy grouping by default. Prefer spacing, typography, background tone, and subtle elevation first.
- Avoid nested rounded surfaces. When nesting is necessary, calculate inner radius from the outer radius and inset spacing.
- Use grid-based layout and baseline-aware vertical rhythm for page structure, repeated content, and text-heavy documentation.
<!-- END:shadcn-style-rules -->
