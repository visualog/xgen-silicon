# Codex Worker Standard Runtime Plan

## Context

- Image generation failed because the Next.js app was running without the local Codex worker.
- The worker also defaulted to `/usr/local/bin/codex`, which is not valid on the current Apple Silicon machine.
- The installed Codex CLI is available at `/opt/homebrew/bin/codex`.

## Plan

1. Add robust Codex binary auto-discovery to worker code.
2. Keep `CODEX_BIN` as an explicit override, but fail clearly if that explicit path is invalid.
3. Add a worker `/health` endpoint so the app/dev scripts can verify worker readiness.
4. Make `npm run dev` start both Codex worker and Next.js without adding a process-manager dependency.
5. Keep `npm run dev:next` as a Next-only escape hatch.
6. Update setup/backend docs to match the new standard runtime.
7. Verify with arm64 check, worker health, API error boundary, TypeScript, targeted lint, and build.
