# arm64 Electron Target Report - 2026-06-22

## Summary

Updated the mac packaging path so `npm run pack:mac` targets Apple Silicon
(`arm64`) and fails before packaging when the active Node runtime is still
x64/Rosetta. Reinstalled platform-specific dependencies under an arm64 Node
runtime and produced an arm64 Electron app directory. The standard shell path
now resolves `node`, `npm`, and `npx` from Apple Silicon Homebrew.

## Screenshots

- Before: `notes/screenshots/arm64-electron-target-2026-06-22/before.png`
- After: `notes/screenshots/arm64-electron-target-2026-06-22/after.png`

## Files Changed

- `package.json`
  - Added `check:arm64`.
  - Updated `pack:mac` to run the arm64 check and call `electron-builder --mac --arm64 --dir`.
  - Disabled automatic signing identity discovery for the local `--dir` package to avoid duplicate local certificate ambiguity.
- `scripts/check-arm64-runtime.mjs`
  - Added a macOS runtime guard that requires `process.arch === "arm64"` before arm64 packaging.
- `~/.zprofile`
  - Added Apple Silicon Homebrew shell initialization.
- `~/.zshrc`
  - Added Apple Silicon Homebrew shell initialization.
- `notes/arm64-electron-target-plan-2026-06-22.md`
  - Added the planning note required before the change.

## Verification

- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json ok')"`
  - Passed.
- `npm run build`
  - Passed outside the sandbox. The sandbox blocks Turbopack's worker/port path.
- `PATH=/Users/im_018/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm install --include=optional --force`
  - Passed. Replaced platform packages with arm64 variants.
- `PATH=/Users/im_018/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ELECTRON_INSTALL_ARCH=arm64 npx install-electron --no`
  - Passed. Installed the arm64 Electron binary after clearing the stale x64 generated dist.
- `PATH=/Users/im_018/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run check:arm64`
  - Passed.
- `PATH=/Users/im_018/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run pack:mac`
  - Passed.
- `/opt/homebrew/bin/brew install node`
  - Passed. Installed Apple Silicon Homebrew Node.
- `zsh -lc 'which node'`
  - `/opt/homebrew/bin/node`.
- `zsh -lc 'node -p "process.arch + \" \" + process.version"'`
  - `arm64 v26.3.1`.
- `zsh -lc 'npm install --include=optional'`
  - Passed. Confirmed standard terminal dependencies under `/opt/homebrew` Node.
- `zsh -lc 'npm run pack:mac'`
  - Passed without temporary PATH overrides.
- `file release/mac-arm64/xGen.app/Contents/MacOS/xGen`
  - `Mach-O 64-bit executable arm64`.
- `file 'release/mac-arm64/xGen.app/Contents/Frameworks/Electron Framework.framework/Electron Framework'`
  - `Mach-O 64-bit dynamically linked shared library arm64`.
- `du -sh release/mac-arm64/xGen.app`
  - `669M`.
- `curl -s -I http://localhost:3000`
  - Returned `HTTP/1.1 200 OK`.

## Remaining Risk

The generated app directory is ad-hoc signed, not notarized. A distributable
release still needs a clean signing identity and notarization setup.

The existing `/usr/local/bin/node` still exists, but new zsh sessions now resolve
Node from `/opt/homebrew/bin/node` first.
