# Design System Dark Card Sharpness Plan

Date: 2026-06-18

## Request

Cards in `/design-system` dark mode look blurry and diffused. Confirm whether transparency is involved and make the cards read sharper.

## Before Screenshot

- `notes/screenshots/design-system-dark-card-sharpness-2026-06-18/before-fullscreen.png`

## Finding

The `Card` primitive uses opaque `bg-card`, but the `/design-system` card override adds a large soft outer shadow. In dark mode this shadow creates the diffused glow around each card.

## Plan

1. Keep the card background opaque with `var(--card)`.
2. Preserve the existing light-mode depth.
3. Add a dark-mode card override that removes the large outer shadow and uses a restrained inset highlight only.
4. Verify the design-system route and capture an after screenshot.
