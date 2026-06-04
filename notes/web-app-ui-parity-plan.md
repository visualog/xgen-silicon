# Web App UI Parity Plan

Date: 2026-06-02

## Goal

Make the packaged xGen app use the same UI and error handling currently visible in the web build.

## Diagnosis

The running web build uses the latest workspace code, but the packaged app resources are older:

- `release/mac/xGen.app/Contents/Resources/next/server.js`
- `release/mac/xGen.app/Contents/Resources/next/data/style-reference-library.json`

Those files were last written on 2026-06-01, before the latest UI/error-message changes.

## Plan

1. Rebuild the Next standalone output.
2. Repack the macOS app directory.
3. Confirm the packaged resources have a fresh timestamp.
4. Relaunch the app so Electron serves the updated resources.
5. Verify the app route responds and the style library routes still work.
