# Web/App UI Parity Report

Date: 2026-06-02

## Summary

The web/app UI mismatch was caused by the packaged macOS app still serving stale bundled resources from the previous build. The web dev server was running the current source, while `release/mac/xGen.app` was still using an older packaged Next server and data payload.

## Evidence

- Before repackaging, `release/mac/xGen.app/Contents/Resources/next/server.js`, bundled `.next/package.json`, and `next/data/style-reference-library.json` were dated 2026-06-01.
- After `npm run pack:mac`, those same packaged resources were refreshed to 2026-06-02 13:48.
- The old app process was still running after repackaging, so it had to be fully terminated and relaunched.
- The `127.0.0.1:3846` endpoint is not the app UI; it returned `404 Not Found` for `/`, while the actual web dev server on `127.0.0.1:3000` returned `200 OK`.

## Actions

- Rebuilt the Next app and repackaged the macOS app with `npm run pack:mac`.
- Terminated the old `xGen` app processes that were still serving stale resources.
- Relaunched `release/mac/xGen.app` using the normal macOS app launch path.

## Verification

- `npm run pack:mac`: completed successfully.
- Packaged app resource timestamps: refreshed to 2026-06-02 13:48.
- Packaged app ports after relaunch:
  - `127.0.0.1:4317`: xGen Codex worker listening.
  - `127.0.0.1:3001`: packaged Next app listening.
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`: `HTTP/1.1 200 OK`.
- `curl -s --max-time 5 http://127.0.0.1:3001/api/style-references`: returned style library payload with `totalItems: 314`.
- Direct app run log showed `[electron] loaded http://127.0.0.1:3001` and successful `/translate` requests.

## Screenshots

- Before relaunch: `notes/screenshots/web-app-ui-parity-2026-06-02/before-relaunch-fullscreen.png`
- After relaunch: `notes/screenshots/web-app-ui-parity-2026-06-02/after-relaunch-fullscreen.png`

## Remaining Risks

- The app is unsigned in the local `--dir` package, so macOS may behave differently from a signed distributable.
- If the app is already running during future repackaging, it must be fully relaunched; otherwise it can continue serving stale in-memory child processes.
- The `3000` web dev server and `3001` packaged app server are separate runtimes. UI parity requires rebuilding/repackaging after code changes, not only restarting the web dev server.
