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
