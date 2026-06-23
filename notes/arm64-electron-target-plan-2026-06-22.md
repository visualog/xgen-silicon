# arm64 Electron Target Plan - 2026-06-22

## Goal

Align the local BrandGen/xGen packaging path with Apple Silicon (`arm64`) Macs.

## Before Screenshot

- `notes/screenshots/arm64-electron-target-2026-06-22/before.png`

## Current Findings

- Host machine architecture: `arm64`.
- Current Node binary: `/usr/local/bin/node`, `x86_64`.
- Current Node runtime: `x64 darwin v24.15.0`.
- Installed native packages are x64 variants:
  - `@next/swc-darwin-x64`
  - `@img/sharp-darwin-x64`
  - Electron binary: `x86_64`

## Planned Changes

- Make the mac packaging script target `arm64` explicitly.
- Add an architecture check script so the repo can fail fast when the wrong Node architecture is active.
- Do not run package installation yet because BrandGen rules require asking before package installs, and this machine currently has no arm64 Node binary available in the checked paths.

## Verification Plan

- Run the new architecture check.
- Run a production build if the architecture precondition can be satisfied.
- Record any blocker clearly in the completion report.
