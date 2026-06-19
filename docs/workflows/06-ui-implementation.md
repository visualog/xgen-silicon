# UI Implementation Workflow

Use for screens, layouts, components, styles, icons, fonts, charts, and motion.

## Steps

1. Read the state docs.
2. Read `docs/ui-style-system.md` before choosing density, spacing, radius, and tone.
3. Use existing shadcn/ui primitives and local components first.
4. Follow Fabric Work Notes: plan, before screenshot, implementation, after screenshot, report.
5. Verify in the browser or app when the changed surface is visual.

## BrandGen Defaults

- Use Luma for xGen service UI and service previews.
- Use Vega/Rhea for the `/design-system` documentation shell.
- Use Nova/Mira only for dense operational surfaces.
- Use Lyra for technical/debug surfaces.
- Use Sera for editorial or marketing pages.

## Guardrails

- Do not install UI, icon, font, chart, or motion libraries without approval.
- Prefer spacing, typography, background tone, and subtle elevation over divider-heavy grouping.
- Avoid nested rounded surfaces unless the radius is intentionally calculated.
