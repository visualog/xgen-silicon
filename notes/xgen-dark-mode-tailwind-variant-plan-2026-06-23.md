# xGen Dark Mode Tailwind Variant Plan - 2026-06-23

## Scope

- Fix xGen main workspace colors that do not respond to dark mode.
- Keep the existing theme state, local persistence, and `data-theme` contract.
- Align the main xGen theme application with the design-system theme pattern.

## Root Cause

- The main xGen page sets `data-theme="dark"` on `document.documentElement`.
- shadcn/Tailwind components use `dark:` classes, which require a `.dark` ancestor.
- Browser inspection confirmed `data-theme: dark` and `hasDarkClass: false`.

## Before Evidence

- Screenshot: `notes/screenshots/xgen-dark-mode-tailwind-variant-2026-06-23/before.png`

## Files To Change

- `src/app/page.tsx`

## Expected Change

- Synchronize `document.documentElement.classList.toggle("dark", theme === "dark")` with the existing `data-theme` update.
- Set `colorScheme` to help native controls match the selected theme.

## Verification

- Run targeted lint on `src/app/page.tsx`.
- Browser-check that `data-theme="dark"` also has `.dark`.
- Confirm `dark:` component styles can now match.
