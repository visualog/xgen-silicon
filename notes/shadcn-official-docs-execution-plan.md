# shadcn Official Docs Execution Plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Route: `/design-system/components`

## Design Context

The active design direction is shadcn/ui. Apps SDK UI is no longer an active reference.

Required behavior from the user:

- Do not invent custom spacing, font sizes, line heights, or visual tokens.
- Use installed shadcn/ui primitives and Tailwind/shadcn semantic tokens.
- Bring in required components through shadcn CLI/registry when possible.
- Replace content inside shadcn patterns instead of hand-designing new component shapes.
- Reduce initial loading cost by removing render-blocking or heavy initial content.

## Official References Reviewed

- Installation: `https://ui.shadcn.com/docs/installation`
- Components JSON: `https://ui.shadcn.com/docs/components-json`
- Package Imports: `https://ui.shadcn.com/docs/package-imports`
- Theming: `https://ui.shadcn.com/docs/theming`
- CLI: `https://ui.shadcn.com/docs/cli`
- Skills: `https://ui.shadcn.com/docs/skills`
- Typography: `https://ui.shadcn.com/docs/components/base/typography`
- Components: `https://ui.shadcn.com/docs/components`
- Blocks: `https://ui.shadcn.com/blocks`
- Charts: `https://ui.shadcn.com/charts/area`
- Directory: `https://ui.shadcn.com/docs/directory`
- MCP: `https://ui.shadcn.com/docs/mcp`

## Current Gaps

- `components.json` is missing, so shadcn CLI/skills/MCP cannot reliably infer project configuration.
- The page uses local shadcn-style primitives, but the official registry setup is not represented.
- Typography is partly aligned, but needs a focused pass against the typography utility examples.
- The body layout still needs to be split into shadcn-like docs, blocks, charts, and directory sections.
- Chart-like visuals are still local approximations, not Recharts/shadcn chart patterns.

## Task Breakdown

### Task 1: Restore shadcn Project Metadata

Goal: Add `components.json` so CLI, skills, and MCP can understand the project.

Actions:

- Add `components.json` using `style: "new-york"`, `rsc: true`, `tsx: true`.
- Point Tailwind CSS to `src/app/globals.css`.
- Keep aliases aligned with current project paths: `@/components`, `@/components/ui`, `@/lib/utils`.
- Run shadcn info if available.
- Write task report and handoff.

Success criteria:

- `components.json` exists at repo root.
- shadcn CLI can read or at least has a valid config target.
- Build still passes.

### Task 2: Typography Normalization

Goal: Align page typography with official shadcn typography utility examples.

Actions:

- Keep hero H1 on `scroll-m-20 text-4xl font-extrabold tracking-tight text-balance`.
- Use `text-xl text-muted-foreground` only for lead copy.
- Use `text-sm text-muted-foreground` for descriptions and metadata.
- Remove any remaining page-specific typography drift.
- Verify desktop and mobile text fit.

Success criteria:

- No arbitrary text sizes or line-height classes are introduced.
- Same content role uses the same typography class pattern.

### Task 3: Layout Recomposition From Docs/Blocks

Goal: Rebuild the page body around shadcn docs and blocks page structure.

Actions:

- Keep header as the already-updated docs-style nav.
- Recompose body into:
  - documentation hero
  - blocks preview
  - charts preview
  - directory/catalog section
- Use shadcn/Tailwind scale only: `container`, `px-4`, `py-24`, `gap-4`, `gap-6`, responsive grid utilities.
- Avoid nested cards and arbitrary bracket spacing.

Success criteria:

- First viewport centers like shadcn.
- Blocks section reads as a real block preview, not an ad-hoc card dump.

### Task 4: Component/Registry Alignment

Goal: Use shadcn components as the source of structure, then replace content with xGen content.

Actions:

- Inventory installed primitives.
- Add missing primitives only when needed.
- Prefer official shadcn component structure: CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button variants, Badge variants, Tabs.
- If network/CLI is available, use `npx shadcn@latest add`.

Success criteria:

- Page components are composed from local shadcn primitives.
- No custom component shell is introduced unless it wraps shadcn primitives.

### Task 5: Charts and Performance Pass

Goal: Treat chart-like UI through shadcn chart guidance and keep initial route light.

Actions:

- Decide whether to add Recharts/shadcn chart components or keep charts out of the first pass.
- Remove fake heavy previews from initial render if they do not serve the page purpose.
- Verify `npm run build:next` and route response size.

Success criteria:

- Initial route is not slowed by unnecessary catalog previews.
- Any chart section follows chart docs or is clearly scoped as a placeholder.

## Execution Rule

Complete one task at a time. For each task:

1. Save before screenshot under `notes/screenshots/`.
2. Implement the bounded change.
3. Run verification.
4. Save after screenshot.
5. Write report and handoff before moving to the next task.
