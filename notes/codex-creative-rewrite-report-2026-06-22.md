# Codex Creative Rewrite Report - 2026-06-22

## Summary

- `/compose-prompt` now sends only creative node inputs through Codex CLI for prompt optimization.
- Reference locks, locked constraints, and the quality guard remain deterministic host-owned sections.
- If Codex rewrite fails, the worker falls back to the previous deterministic prompt composition and includes a warning.

## Changed Files

- `scripts/codex-worker.mjs`
- `src/lib/codex-worker-client.ts`
- `notes/codex-creative-rewrite-plan-2026-06-22.md`
- `notes/codex-creative-rewrite-report-2026-06-22.md`
- `notes/screenshots/codex-creative-rewrite-2026-06-22/before.png`
- `notes/screenshots/codex-creative-rewrite-2026-06-22/after.png`

## Screenshot Evidence

- Before: `notes/screenshots/codex-creative-rewrite-2026-06-22/before.png`
- After: `notes/screenshots/codex-creative-rewrite-2026-06-22/after.png`

## Verification

- `node --check scripts/codex-worker.mjs`
  - Result: passed.
- `npx eslint scripts/codex-worker.mjs src/lib/codex-worker-client.ts`
  - Result: passed with existing worker warnings for unused legacy helpers.
- Restarted `npm run codex-worker` through the arm64 login shell.
- `POST http://127.0.0.1:4317/compose-prompt`
  - Result: returned `rewriteStatus: "codex"`.
  - Creative direction was rewritten by Codex.
  - Object lock, aspect ratio, resolution, camera angle, object orientation, constraints, and quality guard remained deterministic sections.
- `POST http://localhost:3000/api/compose-prompt`
  - Result: returned `rewriteStatus: "codex"` through the Next API route.
- Browser smoke on `http://localhost:3000/`
  - Entered a prompt in the current editor screen.
  - Clicked `프롬프트 생성`.
  - The optimized prompt textarea was filled with a Codex-rewritten creative direction.
  - `생성에 사용` and `복사` became enabled.
- `zsh -lc 'npm run build'`
  - Sandboxed run was blocked by Turbopack internal process/port permissions.
  - Escalated verification passed.

## Remaining Risks

- Codex rewrite adds latency to prompt composition, usually several seconds.
- Existing legacy worker helpers still trigger unused-function lint warnings.
