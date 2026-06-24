#!/usr/bin/env node

import { spawn } from "node:child_process";
import net from "node:net";

const nextPort = Number(process.env.PORT || 3000);
const workerPort = Number(process.env.BRANDGEN_CODEX_WORKER_PORT || 4317);
const shouldReuseWorker = process.env.BRANDGEN_DEV_REUSE_WORKER === "1";
const children = new Set();
let shuttingDown = false;

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function isPortOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function isHttpReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

async function waitForHttp(url, timeoutMs = 90000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt <= timeoutMs) {
    if (await isHttpReady(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function findAvailablePort(preferredPort, host = "127.0.0.1") {
  for (let port = preferredPort; port < preferredPort + 30; port += 1) {
    if (!(await isPortOpen(port, host))) return port;
  }
  throw new Error(`No available port found near ${preferredPort}`);
}

function spawnChild(label, command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...options.env },
  });
  children.add(child);
  child.once("exit", (code, signal) => {
    children.delete(child);
    if (!shuttingDown && code !== 0) {
      console.error(`[xgen:dev] ${label} exited`, { code, signal });
      shutdown(1);
    }
  });
  child.once("error", (error) => {
    children.delete(child);
    console.error(`[xgen:dev] ${label} failed`, error);
    shutdown(1);
  });
  return child;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill();
  setTimeout(() => process.exit(exitCode), 250);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

async function main() {
  let activeWorkerPort = workerPort;
  const preferredWorkerUrl = `http://127.0.0.1:${workerPort}/health`;
  if (shouldReuseWorker && (await isHttpReady(preferredWorkerUrl))) {
    console.log(`[xgen:dev] using existing Codex worker on ${preferredWorkerUrl}`);
  } else {
    if (await isPortOpen(workerPort)) {
      activeWorkerPort = await findAvailablePort(workerPort + 1);
      console.log(`[xgen:dev] worker port ${workerPort} is occupied; starting owned worker on ${activeWorkerPort}`);
    }
    spawnChild("codex-worker", process.execPath, ["scripts/codex-worker.mjs"], {
      env: { BRANDGEN_CODEX_WORKER_PORT: String(activeWorkerPort) },
    });
    await waitForHttp(`http://127.0.0.1:${activeWorkerPort}/health`, 60000);
  }

  let activeNextPort = nextPort;
  if (await isPortOpen(nextPort)) {
    activeNextPort = await findAvailablePort(nextPort + 1);
    console.log(`[xgen:dev] Next port ${nextPort} is occupied; starting Next on ${activeNextPort}`);
  }

  spawnChild("next", npmCommand(), ["run", "dev:next"], {
    env: {
      PORT: String(activeNextPort),
      HOSTNAME: "127.0.0.1",
      BRANDGEN_CODEX_WORKER_URL: `http://127.0.0.1:${activeWorkerPort}`,
    },
  });
  await waitForHttp(`http://127.0.0.1:${activeNextPort}/`, 90000);
  console.log(`[xgen:dev] app ready: http://127.0.0.1:${activeNextPort}`);
  console.log(`[xgen:dev] Codex worker: http://127.0.0.1:${activeWorkerPort}`);
}

main().catch((error) => {
  console.error("[xgen:dev]", error);
  shutdown(1);
});
