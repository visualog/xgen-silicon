# Codex Backend Usage Document Report

Date: 2026-06-22

## Summary

Created a Korean usage guide for running Codex as the backend layer in BrandGen/xGen.
Updated the guide with the current worker boundary, prompt composition flow, deployment assumptions, and future hardening items.

## Files Changed

- `docs/codex-backend-usage.md`
  - Added current architecture summary.
  - Documented local worker startup, Next.js/Electron integration, environment variables, worker endpoints, `codex exec` execution shape, image result recovery, and troubleshooting.
  - Clarified that the app uses the local installed/logged-in Codex CLI rather than embedding ChatGPT or requiring an OpenAI API key in the UI.
  - Added the host app / worker / Codex responsibility boundary.
  - Added the `/api/compose-prompt` prompt generation flow and node source classification.
  - Added Electron distribution prerequisites and future hardening checklist.
- `notes/codex-backend-usage-doc-plan.md`
  - Added the pre-edit planning note for this documentation task.

## Verification

- Reviewed `docs/codex-backend-usage.md` against the current source files.
- Ran `git diff --no-index --check /dev/null <file>` for the new documentation files.
- Result: no whitespace errors were reported.

## Screenshots

Not applicable. This was a documentation-only change with no UI surface change.

## Remaining Risks

- The guide reflects the current checked source files and existing Codex transition notes. It does not run a live Codex generation smoke test.
- `WORK_GUIDE.md` still contains older Gemini/Pollinations wording, so future guide cleanup may be useful if this document becomes the canonical backend reference.
