# Design system locale/theme toggle plan

Date: 2026-06-17

## Scope

- Add visible Korean/English and light/dark controls to `/design-system` pages.
- Keep the change inside the design-system docs site shell and route content.
- Preserve the current shadcn-based docs structure and avoid touching unrelated xGen app surfaces.

## Before screenshot

- `notes/screenshots/design-system-locale-theme-toggle-2026-06-17/before-fullscreen.png`

## Implementation plan

1. Add a small client-side preferences provider for design-system locale and theme.
2. Persist preferences in `localStorage` and apply theme through both `data-theme` and `.dark`.
3. Extend design-system data and page copy with Korean/English text.
4. Add compact header toggle buttons that remain usable on desktop and mobile.
5. Verify with build and browser screenshots.

## Risks

- Existing design-system files are already modified in the working tree, so edits must preserve current local state.
- Some primitive example labels may remain intentionally component/API-like, but page navigation and descriptive copy should switch language.
