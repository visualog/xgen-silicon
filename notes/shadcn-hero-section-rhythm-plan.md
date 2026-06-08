# shadcn hero section rhythm plan

Date: 2026-06-08

## Scope

- Restore clearer spacing between the hero title, first showcase, and following sections on `/design-system/components`.
- Bring the hero h1 closer to shadcn typography scale.
- Allow the hero h1 to render on one line on wide screens while keeping responsive wrapping on smaller viewports.

## Before evidence

- `notes/screenshots/shadcn-hero-section-rhythm-2026-06-08/before-fullscreen.png`

## Findings

- The hero h1 currently uses `lg:text-6xl font-semibold`, which is larger than the common shadcn typography h1 example scale.
- The hero text group is constrained to `max-w-3xl`, causing the title to wrap on desktop.
- The first showcase and following `Blocks` section feel too close after the recent rail alignment changes.

## Tasks

- Adjust the h1 to a shadcn-like `text-4xl ... lg:text-5xl` scale.
- Widen the hero text group enough for the title to fit on one line on large screens.
- Add more vertical separation between hero/actions, showcase, and subsequent sections.
- Verify lint, build, route response, and after screenshot.
