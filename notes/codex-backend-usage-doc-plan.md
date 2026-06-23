# Codex Backend Usage Document Plan

Date: 2026-06-22

## Task

Create a Korean document that explains how this BrandGen/xGen project uses Codex as a backend.

## Scope

- Add one user-facing Korean guide under `docs/`.
- Summarize the current local worker architecture, runtime commands, environment variables, API flow, result handling, and troubleshooting points.
- Keep the existing implementation unchanged.

## Sources To Use

- `CODEX_REPLACEMENT_PLAN.md`
- `WORK_GUIDE.md`
- `package.json`
- `src/lib/codex-worker-client.ts`
- `scripts/codex-worker.mjs`
- Current API routes under `src/app/api/`

## Screenshots

Not applicable. This is a documentation-only change with no UI surface change.

## Verification

- Review the created Markdown for internal consistency.
- Run `git diff --check` for whitespace issues.
