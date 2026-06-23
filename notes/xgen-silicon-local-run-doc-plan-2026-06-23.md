# xGen Silicon Local Run Document Plan

## Context

- Target repository: `https://github.com/visualog/xgen-silicon.git`
- User requested a commit and push, plus a document explaining how to clone and run the project locally.
- Current app depends on Next.js, Electron, and a local Codex worker for AI/image-generation paths.

## Plan

1. Add a Korean local setup/run guide under `docs/`.
2. Link the guide from `README.md`.
3. Keep the guide explicit about Apple Silicon runtime, Codex CLI login, `CODEX_BIN`, development server, worker, and Electron commands.
4. Verify documentation diffs and run targeted static checks that match the current release surface.
5. Commit the current app/documentation changes and push to `visualog/xgen-silicon.git`.

## Commit Scope

- Include current xGen code, docs, notes, scripts, and screenshot artifacts from this working tree.
- Exclude the untracked reference MP4 file because it is a large source/reference asset, not app source or run documentation.
