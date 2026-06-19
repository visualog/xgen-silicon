# Release Workflow

Use for packaging, shipping, final checks, or versioned delivery.

## Steps

1. Read the state docs and the latest relevant handoff/report in `notes/`.
2. Check the working tree and branch.
3. Run the release-relevant build, test, package, or smoke checks.
4. Capture failures with exact commands and concise summaries.
5. Do not tag, publish, notarize, or push release artifacts unless requested.

## Verification

Release work usually needs broader checks than normal implementation work.
Use targeted checks only when the release surface is explicitly narrow.
