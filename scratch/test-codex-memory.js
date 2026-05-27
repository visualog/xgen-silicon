const { spawnSync } = require("node:child_process");

function runCodex(args) {
  const result = spawnSync("codex", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(`Failed to start codex: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const stderr = result.stderr ? result.stderr.trim() : "";
    throw new Error(`codex exited with code ${result.status}${stderr ? `\n${stderr}` : ""}`);
  }

  return result.stdout;
}

function parseJsonlOutput(stdout) {
  const events = [];
  for (const rawLine of stdout.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      // Ignore non-JSON lines.
    }
  }
  return events;
}

function getThreadId(events) {
  const event = events.find((item) => item.type === "thread.started");
  return event ? event.thread_id : null;
}

function getFinalAgentMessage(events) {
  let finalMessage = null;
  for (const event of events) {
    if (
      event.type === "item.completed" &&
      event.item &&
      event.item.type === "agent_message" &&
      typeof event.item.text === "string"
    ) {
      finalMessage = event.item.text;
    }
  }
  return finalMessage;
}

const firstPrompt = "내 이름은 김파수야";
const secondPrompt = "내 이름이 뭐라고?";

const commonArgs = ["--json", "--skip-git-repo-check", "--sandbox", "read-only"];

const firstOutput = runCodex(["exec", ...commonArgs, firstPrompt]);
const firstEvents = parseJsonlOutput(firstOutput);
const threadId = getThreadId(firstEvents);
const firstReply = getFinalAgentMessage(firstEvents);

if (!threadId) {
  throw new Error("Could not find thread id from the first codex exec call.");
}

const secondOutput = runCodex([
  "exec",
  ...commonArgs,
  "resume",
  threadId,
  secondPrompt,
]);
const secondEvents = parseJsonlOutput(secondOutput);
const secondReply = getFinalAgentMessage(secondEvents);

if (!secondReply) {
  throw new Error("Could not find final reply from the second codex exec call.");
}

const passed = secondReply.includes("김파수");

console.log(`First reply: ${firstReply ?? "(none)"}`);
console.log(`Session ID: ${threadId}`);
console.log(`Second reply: ${secondReply}`);
console.log(`Memory test: ${passed ? "PASS" : "FAIL"}`);

if (!passed) {
  process.exit(1);
}
