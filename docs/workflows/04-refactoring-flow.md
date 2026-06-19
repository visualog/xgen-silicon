# Refactoring Workflow

Use for structure cleanup, file splitting, duplication removal, and local simplification.

## Steps

1. Read the state docs.
2. Define the behavior that must remain unchanged.
3. Keep the refactor scoped to one ownership boundary.
4. Prefer existing abstractions and local patterns.
5. Run targeted verification proving behavior is preserved.
6. Document changed files and remaining risk.

## Guardrails

- Do not combine refactor work with unrelated feature changes.
- Keep files below the repo's preferred size limits when practical.
- Do not move large directories without approval.
