# shadcn foundation registry rebuild plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Rebuild `/design-system/components` so it follows the official shadcn/ui foundation and block composition rules, not a local demo-card imitation.

## User issue

The page still does not look like the referenced shadcn/ui foundation because the previous implementation focused on centering and local primitive usage. It did not faithfully apply shadcn typography rhythm, line-height, spacing, internal component padding, responsive grid behavior, or block-level composition.

## Official references

- `https://ui.shadcn.com/docs/installation`
- `https://ui.shadcn.com/docs/components-json`
- `https://ui.shadcn.com/docs/package-imports`
- `https://ui.shadcn.com/docs/theming`
- `https://ui.shadcn.com/docs/cli`
- `https://ui.shadcn.com/docs/skills`
- `https://ui.shadcn.com/docs/components`
- `https://ui.shadcn.com/blocks`
- `https://ui.shadcn.com/charts/area`
- `https://ui.shadcn.com/docs/directory`

## Current verification

- `npx --yes shadcn@latest info` passes.
- Project config is `new-york`, `neutral`, Tailwind v4, CSS variables, RSC, TypeScript.
- Existing installed components are not enough for the requested block composition.

## Before screenshot

- `notes/screenshots/shadcn-foundation-registry-rebuild-2026-06-05/before-fullscreen.png`

## Plan

1. Add missing official shadcn registry components needed for form-like blocks and switches.
2. Replace the current first-screen card catalog with a shadcn-style foundation showcase stage.
3. Use installed shadcn components as the base and change only content to xGen-specific product language.
4. Preserve token-driven theming and avoid custom one-off colors, arbitrary padding, or non-shadcn component internals.
5. Keep directory/chart content below the first-screen showcase.
6. Verify with build, targeted ESLint, route check, and after screenshot.

## Risk

The shadcn CLI may update existing UI component files. Review generated changes before changing the page and do not overwrite unrelated user changes.
