import fs from "node:fs/promises";
import { WebSocket } from "ws";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3851";
const CDP_URL = process.env.CDP_URL || "http://127.0.0.1:9223";
const OUT_DIR = "notes/screenshots/ui-ux-scroll-fixed-qa-2026-05-29";

const viewports = [
  { name: "large", width: 1440, height: 1000 },
  { name: "medium", width: 1280, height: 800 },
  { name: "compact", width: 1024, height: 768 },
  { name: "narrow", width: 820, height: 720 },
  { name: "short", width: 1280, height: 620 },
];

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
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
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.ws.close();
  }
}

async function cdpFetch(path, options) {
  const response = await fetch(`${CDP_URL}${path}`, options);
  if (!response.ok) throw new Error(`${path} failed: ${response.status}`);
  return response.json();
}

async function getTarget() {
  const targets = await cdpFetch("/json/list");
  const existing = targets.find((target) => target.type === "page");
  if (existing) return existing;
  return cdpFetch(`/json/new?${encodeURIComponent(BASE_URL)}`, { method: "PUT" });
}

function wrap(source) {
  return `(() => { ${source} })()`;
}

async function evalJson(cdp, source) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: wrap(source),
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
  return result.result.value;
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
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

async function key(cdp, keyName) {
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName });
}

async function typeText(cdp, text) {
  await cdp.send("Input.insertText", { text });
}

async function setLibrarySearch(cdp, value) {
  await evalJson(cdp, `
    const input = [...document.querySelectorAll('input')].find((el) => el.placeholder.includes('제목, 프롬프트'));
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    return true;
  `);
}

async function clickByText(cdp, text, { exact = false, rootIncludes = "" } = {}) {
  const point = await evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const root = ${JSON.stringify(rootIncludes)}
      ? [...document.querySelectorAll('body *')].find((el) => visible(el) && (el.innerText || '').includes(${JSON.stringify(rootIncludes)})) || document.body
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
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, text: (preferred.innerText || preferred.value || preferred.getAttribute('placeholder') || '').trim() };
  `);
  if (!point) throw new Error(`Cannot find visible text: ${text}`);
  await clickPoint(cdp, point.x, point.y);
  return point;
}

async function clickPromptExamples(cdp) {
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
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  `);
  if (!point) throw new Error("Cannot find prompt examples toggle");
  await clickPoint(cdp, point.x, point.y);
}

async function clickStyleAdd(cdp) {
  const point = await evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const node = [...document.querySelectorAll('.react-flow__node')]
      .find((el) => visible(el) && (el.innerText || '').includes('스타일 참조'));
    const button = node && [...node.querySelectorAll('button')].find((el) => visible(el) && (el.innerText || '').trim() === '추가');
    if (!button) return null;
    const rect = button.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  `);
  if (!point) throw new Error("Cannot find style add button");
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
    return { x: rect.left + rect.width / 2, y: rect.top + Math.min(160, rect.height / 2), text: card.innerText.slice(0, 120) };
  `);
  if (!point) throw new Error("Cannot find library card");
  await clickPoint(cdp, point.x, point.y);
  return point.text;
}

async function setViewport(cdp, viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}

async function enterWorkspace(cdp) {
  await cdp.send("Page.navigate", { url: BASE_URL });
  await wait(900);
  await evalJson(cdp, `localStorage.clear(); sessionStorage.clear(); return true;`);
  await cdp.send("Page.navigate", { url: BASE_URL });
  await wait(1100);
  await clickByText(cdp, "만들기", { exact: true });
  await wait(900);
}

async function inspect(cdp) {
  return evalJson(cdp, `
    const visible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1;
    };
    const viewport = { width: innerWidth, height: innerHeight };
    const nodes = [...document.querySelectorAll('.react-flow__node')].map((node) => {
      const rect = node.getBoundingClientRect();
      return { text: (node.innerText || '').slice(0, 200), x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom, right: rect.right };
    });
    const prompt = nodes.find((node) => node.text.includes('설명') && node.text.includes('예시 프롬프트')) || null;
    const style = nodes.find((node) => node.text.includes('스타일 참조')) || null;
    const output = nodes.find((node) => node.text.includes('프롬프트') && node.text.includes('이미지 생성')) || null;
    const modal = [...document.querySelectorAll('div')].map((el) => {
      const rect = el.getBoundingClientRect();
      const text = el.innerText || '';
      return visible(el) && text.includes('스타일 추가') && text.includes('업로드') && text.includes('URL')
        ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom, text: text.slice(0, 1000) }
        : null;
    }).filter(Boolean).sort((a, b) => a.width * a.height - b.width * b.height)[0] || null;
    const promptExampleList = [...document.querySelectorAll('.react-flow__node div')].find((el) => visible(el) && (el.innerText || '').includes('프리미엄 디바이스') && el.scrollHeight > el.clientHeight);
    const libraryGrid = [...document.querySelectorAll('body *')].find((el) => visible(el) && (el.innerText || '').includes('검색 결과') && el.scrollHeight > el.clientHeight);
    const cards = [...document.querySelectorAll('button')].filter((button) => visible(button) && button.querySelector('img') && (button.innerText || '').trim());
    const imgs = [...document.querySelectorAll('img')].filter((img) => visible(img));
    const brokenImgs = imgs.filter((img) => img.complete && img.naturalWidth === 0).length;
    const libraryFooter = [...document.querySelectorAll('body *')]
      .map((el) => (visible(el) ? (el.innerText || '').trim() : ''))
      .find((text) => /^\\d+개 표시 · 검색 결과 \\d+개 · 전체 \\d+개/.test(text)) || null;
    const styleNode = [...document.querySelectorAll('.react-flow__node')].find((el) => visible(el) && (el.innerText || '').includes('스타일 참조'));
    const styleList = styleNode ? [...styleNode.querySelectorAll('.nodrag')].find((el) => el.scrollHeight > el.clientHeight + 2) : null;
    return {
      viewport,
      prompt,
      style,
      output,
      modal,
      promptOverlapsStyle: !!(prompt && style && prompt.bottom > style.y),
      promptExampleListScrollable: !!promptExampleList,
      libraryCardCount: cards.length,
      brokenImgs,
      libraryFooter,
      styleListScrollable: !!styleList,
      bodyScroll: { scrollHeight: document.documentElement.scrollHeight, clientHeight: document.documentElement.clientHeight },
      text: document.body.innerText.slice(0, 5000),
    };
  `);
}

async function runMainFlow(cdp, viewport) {
  const prefix = viewport.name;
  await setViewport(cdp, viewport);
  await enterWorkspace(cdp);
  await screenshot(cdp, `${prefix}-01-workspace-default`);
  const collapsed = await inspect(cdp);

  await clickPromptExamples(cdp);
  await wait(400);
  await screenshot(cdp, `${prefix}-02-prompt-examples-open`);
  const promptOpen = await inspect(cdp);

  await clickByText(cdp, "제품", { exact: true });
  await wait(200);
  await screenshot(cdp, `${prefix}-03-prompt-product-filter`);

  await clickByText(cdp, "적용", { exact: true });
  await wait(200);
  await clickByText(cdp, "추가", { exact: true, rootIncludes: "프리미엄 디바이스" });
  await wait(250);
  await screenshot(cdp, `${prefix}-04-prompt-apply-append`);
  const promptValue = await evalJson(cdp, `
    const textarea = [...document.querySelectorAll('textarea')].find((el) => el.placeholder.includes('무엇을 만들지'));
    return textarea?.value || '';
  `);

  await clickStyleAdd(cdp);
  await wait(450);
  await screenshot(cdp, `${prefix}-05-style-modal-upload`);
  const modalUpload = await inspect(cdp);

  await clickByText(cdp, "URL", { exact: true });
  await wait(150);
  await clickByText(cdp, "이미지 URL 붙여넣기");
  await typeText(cdp, "https://example.com/assets/very/long/path/that/should/not/push/the/confirm/button/offscreen/reference-image-with-a-long-name-and-query-string.png?token=abcdefghijklmnopqrstuvwxyz");
  await wait(150);
  await screenshot(cdp, `${prefix}-06-style-modal-url-long`);

  await clickByText(cdp, "라이브러리", { exact: true });
  await wait(1200);
  await screenshot(cdp, `${prefix}-07-style-library-top`);
  const libraryTop = await inspect(cdp);

  await cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: viewport.width * 0.36, y: viewport.height * 0.68, deltaX: 0, deltaY: 720 });
  await wait(300);
  await screenshot(cdp, `${prefix}-08-style-library-scrolled`);

  await clickByText(cdp, "제목, 프롬프트, 태그 검색");
  await setLibrarySearch(cdp, "macro");
  await wait(300);
  await screenshot(cdp, `${prefix}-09-style-library-search-macro`);
  const searchMacro = await inspect(cdp);

  await setLibrarySearch(cdp, "zzzz-no-result");
  await wait(300);
  await screenshot(cdp, `${prefix}-10-style-library-empty-search`);
  const emptySearch = await inspect(cdp);

  await setLibrarySearch(cdp, "macro");
  await wait(300);
  const selectedCard = await clickFirstLibraryCard(cdp);
  await wait(500);
  await screenshot(cdp, `${prefix}-11-style-added-output`);
  const afterAdd = await inspect(cdp);

  return {
    viewport,
    collapsed,
    promptOpen,
    modalUpload,
    libraryTop,
    searchMacro,
    emptySearch,
    afterAdd,
    promptValueLength: promptValue.length,
    selectedCard,
  };
}

async function addMoreStylesAndInspect(cdp) {
  const added = [];
  for (let i = 0; i < 5; i += 1) {
    await clickStyleAdd(cdp);
    await wait(200);
    await clickByText(cdp, "라이브러리", { exact: true });
    await wait(500);
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 430, y: 610, deltaX: 0, deltaY: i * 260 });
    await wait(120);
    added.push(await clickFirstLibraryCard(cdp));
    await wait(250);
  }
  await screenshot(cdp, "large-12-many-styles");
  return { added, state: await inspect(cdp) };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const target = await getTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Input.setIgnoreInputEvents", { ignore: false });

  const results = [];
  for (const viewport of viewports) {
    results.push(await runMainFlow(cdp, viewport));
  }

  await setViewport(cdp, viewports[0]);
  await enterWorkspace(cdp);
  await clickPromptExamples(cdp);
  await wait(200);
  await clickStyleAdd(cdp);
  await wait(300);
  await screenshot(cdp, "large-13-style-modal-opens-while-prompt-open");
  const promptOpenStyleModal = await inspect(cdp);
  await key(cdp, "Escape");
  await wait(200);

  await clickStyleAdd(cdp);
  await wait(250);
  await clickByText(cdp, "라이브러리", { exact: true });
  await wait(900);
  await clickFirstLibraryCard(cdp);
  await wait(400);
  const manyStyles = await addMoreStylesAndInspect(cdp);

  const summary = {
    baseUrl: BASE_URL,
    viewports: viewports.map((viewport) => `${viewport.width}x${viewport.height}`),
    results: results.map((result) => ({
      viewport: result.viewport,
      promptOverlapsStyleAfterOpen: result.promptOpen.promptOverlapsStyle,
      promptExampleListScrollable: result.promptOpen.promptExampleListScrollable,
      promptValueLength: result.promptValueLength,
      modalFitsUpload: result.modalUpload.modal ? result.modalUpload.modal.bottom <= result.viewport.height : false,
      libraryVisibleCards: result.libraryTop.libraryCardCount,
      libraryBrokenImages: result.libraryTop.brokenImgs,
      searchText: result.searchMacro.libraryFooter,
      emptyState: result.emptySearch.text.includes("조건에 맞는 스타일 참조가 없습니다."),
      styleSelected: result.afterAdd.style?.text.includes("선택됨") || false,
      outputHasStyle: result.afterAdd.output?.text.includes("스타일") || false,
    })),
    promptOpenStyleModal: {
      modalOpened: !!promptOpenStyleModal.modal,
      promptOverlapsStyle: promptOpenStyleModal.promptOverlapsStyle,
    },
    manyStyles: {
      addedCount: manyStyles.added.length + 1,
      styleListScrollable: manyStyles.state.styleListScrollable,
      styleSelected: manyStyles.state.style?.text.includes("선택됨") || false,
    },
  };
  await fs.writeFile(`${OUT_DIR}/qa-summary.json`, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  cdp.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
