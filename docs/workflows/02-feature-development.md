# Feature Development Workflow

Use when adding or extending behavior.

## Steps

1. Read `docs/states/work-state.md`, `docs/states/task-board.md`, and `docs/states/project-state.md`.
2. Identify the smallest useful feature slice.
3. Read only the code and notes needed for that slice.
4. Follow Fabric Work Notes before editing.
5. Implement without unrelated refactors.
6. Run targeted verification for the changed behavior.
7. Write a completion report when the change is meaningful.

## Guardrails

- Ask before new dependencies, init commands, registry additions, MCP setup, or large file moves.
- Preserve existing user changes.
- Prefer existing local helpers and patterns.
