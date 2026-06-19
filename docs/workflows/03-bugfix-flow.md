# Bugfix Workflow

Use when something is broken, failing, not reflected, or causing a test error.

## Steps

1. Read the state docs.
2. Reproduce or inspect the failure with the narrowest useful command.
3. Trace the smallest responsible surface.
4. Patch the cause, not just the symptom.
5. Re-run the failing check or a targeted equivalent.
6. Record the fix and residual risk in a completion report for meaningful changes.

## Guardrails

- Do not reset or discard user changes.
- Avoid broad rewrites while debugging.
- If sandbox or network restrictions block an important command, request escalation instead of working around the restriction.
