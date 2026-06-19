# Work State

Last updated: 2026-06-18

## Current Operating Mode

BrandGen uses a non-destructive AgentOS-style router layered on top of the
existing project rules in `AGENTS.md`.

## Active Rule Set

- `AGENTS.md` is the first-read routing document.
- Existing Next.js, Fabric Work Notes, and shadcn/ui rules remain active.
- `notes/` remains the durable place for task plans, reports, screenshots, and handoffs.
- `docs/ui-style-system.md` remains the detailed style-system reference for UI work.

## Current Task

Merge operating rules without overwriting existing project instructions.

## Validation Expectations

- Documentation-only changes can use targeted text checks and diff review.
- UI or runtime changes should include visual/browser verification.
- Release, dependency, build config, or broad shared changes should use broader checks.

## Open Risks

- The full AgentOS ZIP packages are not installed wholesale. This is intentional to avoid overwriting existing BrandGen rules.
- Future agents should not assume every Enterprise/Lite package file exists in this repo.
