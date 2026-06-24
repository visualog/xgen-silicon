# Codex Worker Standard Runtime Report

## Summary

- Made `npm run dev` start the Codex worker and Next.js app together.
- Added Codex CLI binary auto-discovery for Apple Silicon and Intel Homebrew paths.
- Added a local worker `/health` endpoint.
- Updated user-facing docs and worker connection errors to match the new standard runtime.

## Changed Files

- `package.json`
- `scripts/dev-with-codex-worker.mjs`
- `scripts/codex-worker.mjs`
- `src/lib/codex-cli.ts`
- `src/lib/codex-worker-client.ts`
- `README.md`
- `docs/local-clone-run-guide.md`
- `docs/codex-backend-usage.md`

## Runtime Behavior

- `npm run dev` now runs `scripts/dev-with-codex-worker.mjs`.
- The script starts or reuses a Codex worker, waits for `/health`, then starts Next.js with `BRANDGEN_CODEX_WORKER_URL`.
- The script now owns the Codex worker by default so the worker process lifecycle is tied to the dev server. Set `BRANDGEN_DEV_REUSE_WORKER=1` only when intentionally reusing an external worker.
- Fixed a follow-up failure where the script reused an external worker that later died while Next.js kept running. The default path now starts an owned worker even if a previous worker existed.
- `npm run dev:next` remains available for Next-only development.
- `npm run codex-worker` remains available for worker-only operation.

## Codex Binary Resolution

Resolution order:

1. Explicit `CODEX_BIN`
2. `/opt/homebrew/bin/codex`
3. `/usr/local/bin/codex`
4. `codex` found through `PATH`

If `CODEX_BIN` is explicitly set but not executable, the worker fails with a clear error instead of silently falling back.

## Verification

- `npm run check:arm64` passed.
- `node --check scripts/dev-with-codex-worker.mjs` passed.
- `node --check scripts/codex-worker.mjs` passed.
- `curl -s -i http://127.0.0.1:4317/health` returned `HTTP/1.1 200 OK`.
- `/health` reported `codexBin: /opt/homebrew/bin/codex`.
- `npx tsc --noEmit --pretty false` passed.
- `npx eslint scripts/dev-with-codex-worker.mjs scripts/codex-worker.mjs src/lib/codex-cli.ts src/lib/codex-worker-client.ts` passed with 0 errors and 2 existing unused-function warnings in `scripts/codex-worker.mjs`.
- `npm run build` passed.
- After restarting `npm run dev`, logs showed the owned worker listening on `http://127.0.0.1:4317`, Next ready on `http://127.0.0.1:3000`, and `/api/translate` requests succeeding through the worker.
- `node --check scripts/dev-with-codex-worker.mjs` passed after the ownership fix.
- `npx eslint scripts/dev-with-codex-worker.mjs` passed after the ownership fix.

## Remaining Notes

- The current browser session can use the worker now running at `http://127.0.0.1:4317`.
- Full `npm run lint` still has unrelated existing errors in `codex/` and `scratch/`; this task used targeted lint for the changed runtime files.
