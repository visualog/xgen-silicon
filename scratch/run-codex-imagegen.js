#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const PROMPT =
  "첨부한 이미지를 개발새발 세상에서 제일 하찮은 선으로 그려줘. 배경은 흰색, 그림판에서 마우스로 그린것 같은 맞는듯 아닌듯 비슷한듯 아닌듯 아리까리하게 픽셀단위의 그림으로 하찮음을 제대로 뽑내줘. 야 됐고 그냥 니맘대로 그려.";

function listCandidateImages(dirPath) {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dirPath, entry.name))
    .filter((filePath) => /\.(png|jpe?g|webp)$/i.test(filePath));
}

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function parseJsonLines(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Failed to parse JSONL line: ${line}`);
      }
    });
}

function getThreadId(events) {
  const event = events.find((item) => item.type === "thread.started");
  return event?.thread_id ?? null;
}

function findLatestGeneratedImage(threadId) {
  const generatedDir = path.join(
    os.homedir(),
    ".codex",
    "generated_images",
    threadId,
  );

  if (!fs.existsSync(generatedDir)) {
    return null;
  }

  const files = fs
    .readdirSync(generatedDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(generatedDir, entry.name))
    .filter((filePath) => /\.(png|jpe?g|webp)$/i.test(filePath))
    .map((filePath) => ({
      filePath,
      mtimeMs: fs.statSync(filePath).mtimeMs,
    }))
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  return files[0]?.filePath ?? null;
}

function main() {
  const workspaceRoot = path.resolve(__dirname, "..");
  const sourceDir = path.join(workspaceRoot, "sample", "gen");
  const candidates = listCandidateImages(sourceDir);

  if (candidates.length === 0) {
    throw new Error(`No input images found in ${sourceDir}`);
  }

  const selectedImage = chooseRandom(candidates);
  const commandArgs = [
    "exec",
    "--json",
    "--skip-git-repo-check",
    "--sandbox",
    "read-only",
    "-i",
    selectedImage,
    "--",
    PROMPT,
  ];

  const result = spawnSync("codex", commandArgs, {
    cwd: workspaceRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }

  const events = parseJsonLines(result.stdout || "");
  const threadId = getThreadId(events);
  const generatedImagePath = threadId ? findLatestGeneratedImage(threadId) : null;

  const output = {
    ok: result.status === 0 && Boolean(threadId) && Boolean(generatedImagePath),
    selectedImage,
    prompt: PROMPT,
    threadId,
    generatedImagePath,
    exitCode: result.status,
    stderr: (result.stderr || "").trim(),
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);

  if (!output.ok) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
