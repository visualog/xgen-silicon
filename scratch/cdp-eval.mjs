import { WebSocket } from "ws";

const targetUrlPart = process.argv[2] || "3851";
const expression = process.argv.slice(3).join(" ");
const targets = await fetch("http://127.0.0.1:9223/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.url.includes(targetUrlPart));
if (!target) throw new Error(`No target matching ${targetUrlPart}`);
const ws = new WebSocket(target.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();
ws.on("message", (raw) => {
  const message = JSON.parse(String(raw));
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
await new Promise((resolve) => ws.once("open", resolve));
const id = nextId++;
ws.send(JSON.stringify({ id, method: "Runtime.evaluate", params: { expression, returnByValue: true, awaitPromise: true } }));
const result = await new Promise((resolve) => pending.set(id, resolve));
console.log(JSON.stringify(result.result?.result?.value ?? result, null, 2));
ws.close();
