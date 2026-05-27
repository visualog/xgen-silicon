const { spawnSync } = require("node:child_process");

const prompt = "What is 49+2";
const codexArgs = [
  "exec",
  "--json",
  "--skip-git-repo-check",
  "--sandbox",
  "read-only",
  prompt,
];

const result = spawnSync("codex", codexArgs, {
  cwd: process.cwd(),
  encoding: "utf8",
});

if (result.error) {
  console.error(`Failed to start codex: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  process.exit(result.status ?? 1);
}

const lines = result.stdout
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

let finalMessage = null;

for (const line of lines) {
  try {
    const event = JSON.parse(line);
    if (
      event.type === "item.completed" &&
      event.item &&
      event.item.type === "agent_message" &&
      typeof event.item.text === "string"
    ) {
      finalMessage = event.item.text;
    }
  } catch {
    // Ignore non-JSON lines and continue scanning for the final agent message.
  }
}

if (!finalMessage) {
  console.error("Could not find a final agent message in codex output.");
  process.exit(1);
}

process.stdout.write(`${finalMessage}\n`);
