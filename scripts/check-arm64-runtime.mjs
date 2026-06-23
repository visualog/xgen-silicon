#!/usr/bin/env node

const nodeArch = process.arch;

if (process.platform !== "darwin") {
  console.log(`[xGen] Non-macOS runtime detected: ${process.platform}/${nodeArch}`);
  process.exit(0);
}

if (nodeArch !== "arm64") {
  console.error(
    [
      `[xGen] Expected arm64 Node for Apple Silicon packaging, got ${nodeArch}.`,
      "Install or select an arm64 Node runtime, then reinstall dependencies before packaging.",
      "Current x64/Rosetta node_modules can leave x86_64 native binaries for Next.js, Sharp, and Electron.",
    ].join("\n"),
  );
  process.exit(1);
}

console.log(`[xGen] arm64 runtime ready: ${process.platform}/${nodeArch}`);
