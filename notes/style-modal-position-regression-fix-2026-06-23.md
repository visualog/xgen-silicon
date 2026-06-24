# Style Modal Position Regression Fix - 2026-06-23

## Summary

Adjusted the previous style-library scroll fix so it no longer makes the Style Add popup feel position-locked. Wheel handling is kept on the actual scroll areas, while modal-level `nowheel` handling and the fixed library-tab height were removed.

## Files Changed

- `src/components/StyleAddModal.tsx`
  - Removed modal-level `nodrag nowheel`.
  - Removed modal-body wheel propagation blocking.
  - Replaced the library tab fixed height with content-driven layout.
  - Kept vertical scrolling constrained to the library card list.

## Verification Plan

- Targeted eslint for `StyleAddModal.tsx`.
- `npm run build:next`.
- Verify local app route returns HTTP 200.
