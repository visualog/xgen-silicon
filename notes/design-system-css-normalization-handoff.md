# Design System CSS Normalization Handoff

Date: 2026-06-10

## Current State

The design-system shell has been normalized so DevTools shows fewer stacked background/layout utility classes:

- `main` is now `class="shadcn-docs-surface"`.
- `header` is now `class="shadcn-docs-header"`.
- Body wrapper is now:

```html
<div data-slot="design-system-body" class="shadcn-docs-body">
```

The body rail is controlled in CSS:

```css
.shadcn-docs-body {
  box-sizing: border-box;
  width: min(calc(100% - 2rem), 1040px);
  margin-inline: auto;
  padding-block: 4rem;
}
```

Global `body` remains the source of page background/text color through the existing shadcn base layer.

## Validation

- `npm run build:next` passed.
- Local server is running:

```text
http://127.0.0.1:3002/design-system/patterns
```

- `/design-system/patterns` returns `HTTP/1.1 200 OK`.
- Built output confirms the new shell/header/body classes.

## Key Files

- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/globals.css`
- `notes/design-system-css-normalization-plan.md`
- `notes/design-system-css-normalization-report.md`
- `notes/screenshots/design-system-css-normalization-2026-06-10/`

## QA Notes

In DevTools, select the body content wrapper directly after `header`. It should show:

```html
data-slot="design-system-body"
class="shadcn-docs-body"
```

Header and body rails are intentionally separate:

- Header inner rail still uses `max-w-7xl`.
- Body rail uses `1040px`.

## Next Suggested Task

If visual balance still feels left-heavy after this CSS cleanup, the next task should adjust `PageHero` and section composition in `src/app/design-system/_components/page-sections.tsx`, not the shell CSS.

## Copy-Paste Continuation Prompt

```text
Continue in /Users/im_018/Documents/GitHub/2026_important/BrandGen. The latest task normalized design-system CSS: main/header/body wrapper now use shadcn-docs-surface, shadcn-docs-header, and shadcn-docs-body. The body rail is centered via width: min(calc(100% - 2rem), 1040px); margin-inline: auto. Build passed, server is running at http://127.0.0.1:3002, and /design-system/patterns returns 200. Review notes/design-system-css-normalization-report.md before continuing.
```
