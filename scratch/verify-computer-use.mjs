import fs from "node:fs/promises";
import { WebSocket } from "ws";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3851";
const CDP_URL = process.env.CDP_URL || "http://127.0.0.1:9223";
const OUT_DIR = "notes/screenshots/computer-use-verification-2026-05-29";

async function cdpFetch(path, options) {
  const response = await fetch(`${CDP_URL}${path}`, options);
  if (!response.ok) throw new Error(`${path} failed: ${response.status}`);
  return response.json();
}

async function getPageTarget() {
  const targets = await cdpFetch("/json/list");
  const existing = targets.find((target) => target.type === "page" && target.url.startsWith(BASE_URL));
  if (existing) return existing;
  return cdpFetch(`/json/new?${encodeURIComponent(BASE_URL)}`, { method: "PUT" });
}

class Cdp {
  constructor(wsUrl, sessionId = null) {
    this.ws = new WebSocket(wsUrl);
    this.sessionId = sessionId;
    this.nextId = 1;
    this.pending = new Map();
    this.ws.on("message", (raw) => {
      const message = JSON.parse(String(raw));
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
    });
  }

  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.once("open", resolve);
      this.ws.once("error", reject);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = this.sessionId ? { id, method, params, sessionId: this.sessionId } : { id, method, params };
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.ws.close();
  }
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function expression(source) {
  return `(() => { ${source} })()`;
}

async function evalJson(cdp, source) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: expression(source),
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function screenshot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await fs.writeFile(`${OUT_DIR}/${name}.png`, Buffer.from(result.data, "base64"));
}

async function clickPoint(cdp, x, y) {
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}

async function clickByText(cdp, text, options = {}) {
  const { exact = false, scopeText = "" } = options;
  const point = await evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const root = ${JSON.stringify(scopeText)}
      ? [...document.querySelectorAll('body *')].find((el) => visible(el) && (el.innerText || '').includes(${JSON.stringify(scopeText)}))
      : document.body;
    const candidates = [...root.querySelectorAll('button, input, textarea, [role="button"], div, span, strong, p')]
      .filter(visible)
      .filter((el) => {
        const t = (el.innerText || el.value || el.getAttribute('placeholder') || el.getAttribute('aria-label') || '').trim();
        return ${exact} ? t === ${JSON.stringify(text)} : t.includes(${JSON.stringify(text)});
      });
    const preferred = candidates.find((el) => ['BUTTON', 'INPUT', 'TEXTAREA'].includes(el.tagName)) || candidates[0];
    if (!preferred) return null;
    const rect = preferred.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, tag: preferred.tagName, text: (preferred.innerText || preferred.value || '').trim() };
  `);
  if (!point) throw new Error(`Cannot find visible text: ${text}`);
  await clickPoint(cdp, point.x, point.y);
  return point;
}

async function typeText(cdp, text) {
  await cdp.send("Input.insertText", { text });
}

async function clickStyleAddButton(cdp) {
  const point = await evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const node = [...document.querySelectorAll('.react-flow__node')]
      .find((el) => visible(el) && (el.innerText || '').includes('스타일 참조'));
    if (!node) return null;
    const button = [...node.querySelectorAll('button')].find((el) => visible(el) && (el.innerText || '').includes('추가'));
    if (!button) return null;
    const rect = button.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, text: button.innerText.trim() };
  `);
  if (!point) throw new Error("Cannot find StyleNode add button");
  await clickPoint(cdp, point.x, point.y);
}

async function clickPromptExamplesHeader(cdp) {
  const point = await evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const node = [...document.querySelectorAll('.react-flow__node')]
      .find((el) => visible(el) && (el.innerText || '').includes('설명') && (el.innerText || '').includes('예시 프롬프트'));
    const button = node && [...node.querySelectorAll('button')].find((el) => visible(el) && (el.innerText || '').includes('예시 프롬프트'));
    if (!button) return null;
    const rect = button.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, text: button.innerText.trim() };
  `);
  if (!point) throw new Error("Cannot find prompt examples header");
  await clickPoint(cdp, point.x, point.y);
}

async function clickFirstLibraryCard(cdp) {
  const point = await evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const modal = [...document.querySelectorAll('body *')].find((el) => visible(el) && (el.innerText || '').includes('스타일 추가') && (el.innerText || '').includes('카테고리'));
    const card = modal && [...modal.querySelectorAll('button')].find((el) => visible(el) && el.querySelector('img') && (el.innerText || '').trim().length > 0);
    if (!card) return null;
    const rect = card.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + Math.min(180, rect.height / 2), text: card.innerText.trim().slice(0, 160) };
  `);
  if (!point) throw new Error("Cannot find first library card");
  await clickPoint(cdp, point.x, point.y);
  return point;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  console.log("cdp: locating target");
  const target = await getPageTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.ready();

  console.log("cdp: enabling domains");
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  console.log("cdp: setting viewport");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  console.log("cdp: navigating");
  await cdp.send("Page.navigate", { url: BASE_URL });
  await wait(2500);
  console.log("cdp: screenshot initial");
  await screenshot(cdp, "01-initial-app");
  await clickByText(cdp, "만들기", { exact: true });
  await wait(1000);
  await screenshot(cdp, "01b-workspace");

  console.log("test: prompt examples");
  await clickPromptExamplesHeader(cdp);
  await wait(400);
  await screenshot(cdp, "02-prompt-examples-open");

  await clickByText(cdp, "제품", { exact: true });
  await wait(250);
  await screenshot(cdp, "03-prompt-category-product");

  await clickByText(cdp, "적용", { exact: true });
  await wait(300);
  const promptApplied = await evalJson(cdp, `
    const textarea = [...document.querySelectorAll('textarea')].find((el) => el.placeholder.includes('무엇을 만들지'));
    return { value: textarea?.value || '', length: textarea?.value.length || 0 };
  `);
  await screenshot(cdp, "04-prompt-example-applied");
  await clickByText(cdp, "닫기", { exact: true });
  await wait(300);

  console.log("test: style library");
  await clickStyleAddButton(cdp);
  await wait(500);
  await screenshot(cdp, "05-style-add-modal-upload");

  await clickByText(cdp, "라이브러리", { exact: true });
  await wait(1800);
  await screenshot(cdp, "06-style-library-loaded");

  const libraryState = await evalJson(cdp, `
    const text = document.body.innerText;
    const cards = [...document.querySelectorAll('button')].filter((button) => button.querySelector('img') && (button.innerText || '').trim().length > 0);
    const imgs = [...document.querySelectorAll('img')].map((img) => ({
      src: img.getAttribute('src'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    })).filter((img) => img.src && img.src.includes('/api/style-references/image/'));
    return {
      hasLibrarySummary: /전체\\s+314개/.test(text),
      visibleCardCount: cards.length,
      loadedReferenceImages: imgs.filter((img) => img.complete && img.naturalWidth > 0).length,
      brokenReferenceImages: imgs.filter((img) => img.complete && img.naturalWidth === 0).length,
      firstReferenceImage: imgs[0] || null,
    };
  `);

  await clickByText(cdp, "제목, 프롬프트, 태그 검색");
  await typeText(cdp, "macro");
  await wait(400);
  await screenshot(cdp, "07-style-library-search-aurora");

  const searchedState = await evalJson(cdp, `
    const text = document.body.innerText;
    return {
      summaryLine: (text.match(/\\d+개 표시 · 전체 314개/) || [null])[0],
      hasEmpty: text.includes('조건에 맞는 스타일 참조가 없습니다.'),
    };
  `);

  await clickFirstLibraryCard(cdp);
  await wait(700);
  await screenshot(cdp, "08-style-library-item-added");

  const finalState = await evalJson(cdp, `
    const styleNode = [...document.querySelectorAll('.react-flow__node')]
      .find((el) => (el.innerText || '').includes('스타일 참조'));
    const styleText = styleNode?.innerText || '';
    const styleImages = styleNode ? [...styleNode.querySelectorAll('img')].map((img) => ({
      src: img.getAttribute('src'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    })) : [];
    return {
      styleNodeText: styleText,
      hasSelectedBadge: styleText.includes('선택됨'),
      styleImageCount: styleImages.length,
      loadedStyleImages: styleImages.filter((img) => img.complete && img.naturalWidth > 0).length,
      promptAppliedLength: ${promptApplied.length},
    };
  `);

  console.log(JSON.stringify({ promptApplied, libraryState, searchedState, finalState }, null, 2));
  cdp.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
