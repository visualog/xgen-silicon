# Design system locale/theme toggle report

Date: 2026-06-17

## Summary

- Added design-system scoped preferences for Korean/English and light/dark mode.
- Added header toggle controls for language and theme across `/design-system/*`.
- Converted design-system navigation, page hero copy, section copy, cards, and major preview labels to localized Korean/English copy.
- Theme switching now applies both `data-theme` and the `.dark` class so shadcn tokens and Tailwind dark variants stay aligned.

## Screenshots

- Before: `notes/screenshots/design-system-locale-theme-toggle-2026-06-17/before-fullscreen.png`
- After: `notes/screenshots/design-system-locale-theme-toggle-2026-06-17/after-fullscreen.png`

## Files changed

- `src/app/design-system/_components/design-system-preferences.tsx`
- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/design-system/_components/page-sections.tsx`
- `src/app/design-system/_components/components-page-content.tsx`
- `src/app/design-system/_components/patterns-page-content.tsx`
- `src/app/design-system/_data/design-system.ts`
- `src/app/design-system/page.tsx`
- `src/app/design-system/foundation/page.tsx`
- `src/app/design-system/components/page.tsx`
- `src/app/design-system/patterns/page.tsx`
- `src/app/design-system/templates/page.tsx`

## Verification

- `npm run build:next` passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3002/design-system` returned `HTTP/1.1 200 OK`.
- Browser screenshot confirmed Korean default copy and visible language/theme controls.

## Notes and risks

- The existing `127.0.0.1:3001` process is a running `xGen` app and did not reflect source edits immediately, so visual verification used `npm run dev:next -- -p 3002 --webpack`.
- The browser console showed a hydration warning for an externally injected `data-fabric-scheme` attribute on `<html>`. This appears unrelated to the design-system code and did not block rendering.
- Some component/API names such as `Button`, `CardHeader`, and token class names intentionally remain English because they document source primitives.
