import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const collectedAt = "2026-05-29";

const taxonomy = {
  version: 1,
  updatedAt: collectedAt,
  description:
    "Operational taxonomy for prompt/image style references. Images stay in images/ and classification is managed through JSON metadata and generated Markdown collections.",
  fields: {
    primaryCategory: "Single representative use-case category for filtering and recommendation.",
    styleTags: "Reusable visual-style descriptors.",
    subjectTags: "Subject, material, object, or scene descriptors.",
    productionTags: "Composition, lighting, background, and workflow descriptors.",
    conversionStatus: "Prompt conversion state for service-readiness.",
    reviewStatus: "Whether automatic classification is sufficient or human review is recommended.",
  },
  primaryCategories: {
    beauty: "Skincare, cosmetics, skin, fragrance, beauty product, and beauty macro references.",
    "fashion-editorial": "Fashion, model, accessory, styling, magazine, and editorial campaign references.",
    "product-still-life": "Commercial product, package, bottle, shoe, furniture, and object still-life references.",
    portrait: "Human face, person, character portrait, and identity-focused photographic references.",
    "interior-architecture": "Rooms, furniture, architectural spaces, and spatial design references.",
    "character-3d": "3D character, cute mascot, toy-like, creature, and stylized character references.",
    "object-graphic": "Graphic object, icon, logo, abstract object, and rendered visual asset references.",
    "surreal-concept": "Dreamlike, symbolic, impossible, fantasy, and concept-art references.",
    "landscape-environment": "Nature, terrain, city, sky, mountain, water, and environment references.",
    "pure-style-reference": "Style-reference-only records whose usable direction depends on the saved image.",
  },
  styleTags: [
    "photorealistic",
    "studio-lighting",
    "macro-detail",
    "minimal",
    "cinematic",
    "editorial",
    "luxury",
    "surreal",
    "rendered-3d",
    "reference-image-led",
    "dark-moody",
    "soft-pastel",
    "high-contrast",
    "organic",
    "futuristic",
    "glossy",
  ],
  subjectTags: [
    "skin",
    "serum",
    "perfume",
    "beauty-product",
    "model",
    "face",
    "fashion-accessory",
    "shoe",
    "bottle",
    "furniture",
    "interior",
    "glass",
    "metal",
    "organic-material",
    "flower",
    "robotic-object",
    "animal",
    "landscape",
    "character",
    "abstract-object",
  ],
  productionTags: [
    "close-up",
    "top-view",
    "wide-shot",
    "black-background",
    "white-background",
    "transparent-background",
    "soft-light",
    "dramatic-light",
    "high-detail",
    "commercial-ready",
    "needs-reference-image",
    "single-subject",
    "texture-focused",
  ],
  conversionStatuses: {
    "clean-natural-language": "Original prompt was already mostly model-agnostic and natural language.",
    "converted-from-midjourney": "Model-specific syntax was removed and the usable prompt was rewritten.",
    "style-reference-only": "Prompt depends on the accompanying saved reference image.",
    "needs-human-review": "Converted prompt or classification should be checked before production use.",
  },
  reviewStatuses: {
    "auto-classified": "Classified by deterministic rules with enough textual evidence.",
    "needs-review": "Insufficient or ambiguous text; review image and prompt together before production use.",
  },
};

const categoryOrder = Object.keys(taxonomy.primaryCategories);
const auroraCategoryLabels = {
  C6_V54UF6: "Beauty",
  AuemOO7u5: "Style Reference",
  RDQg_eU9B: "Photo",
  kE0uvy9N5: "Graphic / Object",
};
const knownToolLabels = {
  y1JvE0IOh: "Midjourney",
  xUQF8mqTG: "Nano Banana",
};

function usage() {
  return `Usage:
  node scripts/collect-style-reference.mjs <url> --name <directory-name>

Examples:
  node scripts/collect-style-reference.mjs https://aurora.ai.kr/prompt --name aurora-prompts
  node scripts/collect-style-reference.mjs https://example.com/styles --name example-styles

Options:
  --name <name>        Output directory under style-references/
  --cms-url <url>      Optional Framer CMS chunk URL when automatic discovery cannot find it
  --limit <number>     Optional item limit for quick tests
  --keep-existing      Do not delete the output directory before writing
`;
}

function parseArgs(argv) {
  const args = { url: "", name: "", cmsUrl: "", limit: 0, keepExisting: false };
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index];
    if (value === "--name") args.name = argv[++index] ?? "";
    else if (value === "--cms-url") args.cmsUrl = argv[++index] ?? "";
    else if (value === "--limit") args.limit = Number(argv[++index] ?? 0);
    else if (value === "--keep-existing") args.keepExisting = true;
    else if (!args.url) args.url = value;
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!args.url) throw new Error(usage());
  args.name ||= defaultName(args.url);
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(args.name)) {
    throw new Error("--name must contain only letters, numbers, dots, dashes, or underscores.");
  }
  return args;
}

function defaultName(url) {
  const parsed = new URL(url);
  const pathSlug = parsed.pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return [parsed.hostname.replace(/^www\./, "").replace(/[^a-z0-9]+/gi, "-"), pathSlug].filter(Boolean).join("-");
}

function robotsUrlFor(sourceUrl) {
  const parsed = new URL(sourceUrl);
  return `${parsed.origin}/robots.txt`;
}

function knownCmsUrlsFor(sourceUrl) {
  const parsed = new URL(sourceUrl);
  if (parsed.hostname === "aurora.ai.kr" && parsed.pathname.replace(/\/+$/, "") === "/prompt") {
    return [
      "https://framerusercontent.com/cms/aEIlHRv10HYiuhbFOTm9/eIwrzkNcLsZ7bz9JAze7/mMl7hZ1Lg-chunk-default-0.framercms",
    ];
  }
  return [];
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchArrayBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  return response.arrayBuffer();
}

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
}

class Reader {
  constructor(buffer) {
    this.buffer = Buffer.from(buffer);
    this.offset = 0;
  }
  readUint8() {
    return this.buffer.readUInt8(this.offset++);
  }
  readInt8() {
    return this.buffer.readInt8(this.offset++);
  }
  readUint16() {
    const value = this.buffer.readUInt16BE(this.offset);
    this.offset += 2;
    return value;
  }
  readUint32() {
    const value = this.buffer.readUInt32BE(this.offset);
    this.offset += 4;
    return value;
  }
  readBigInt64() {
    const value = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;
    return value;
  }
  readFloat64() {
    const value = this.buffer.readDoubleBE(this.offset);
    this.offset += 8;
    return value;
  }
  readBytes(length) {
    const value = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }
  readString() {
    return this.readBytes(this.readUint32()).toString("utf8");
  }
  readJson() {
    return JSON.parse(this.readString());
  }
}

function readValue(reader) {
  const type = reader.readUint8();
  switch (type) {
    case 0:
      return null;
    case 1: {
      const length = reader.readUint16();
      return Array.from({ length }, () => readValue(reader));
    }
    case 2:
      return reader.readUint8() !== 0;
    case 3:
    case 5:
    case 6:
    case 12:
      return reader.readString();
    case 4:
      return new Date(Number(reader.readBigInt64())).toISOString();
    case 7:
    case 10:
      return reader.readJson();
    case 8:
      return reader.readFloat64();
    case 9: {
      const length = reader.readUint16();
      const value = {};
      for (let index = 0; index < length; index++) value[reader.readString()] = readValue(reader);
      return value;
    }
    case 11:
      return reader.readInt8() === 0 ? { richTextPointer: reader.readUint32() } : reader.readString();
    case 13:
      return { vectorSetItem: reader.readUint32() };
    default:
      throw new Error(`Unsupported CMS value type ${type}`);
  }
}

function readRecord(reader) {
  const fieldCount = reader.readUint16();
  const record = {};
  for (let index = 0; index < fieldCount; index++) record[reader.readString()] = readValue(reader);
  return record;
}

function decodeFramerCms(buffer) {
  const reader = new Reader(buffer);
  const count = reader.readUint32();
  const records = [];
  for (let index = 0; index < count; index++) records.push(readRecord(reader));
  if (reader.offset !== reader.buffer.length) {
    throw new Error(`CMS decode left unread bytes: ${reader.buffer.length - reader.offset}`);
  }
  return records;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function absoluteUrl(url, base) {
  try {
    return new URL(url, base).toString();
  } catch {
    return "";
  }
}

function extractUrls(text, base) {
  const urls = [
    ...text.matchAll(/https?:\/\/[^"'\s)]+/g),
    ...text.matchAll(/["']([^"']+)["']/g),
  ].map((match) => match[1] ?? match[0]);
  return unique(urls.map((url) => absoluteUrl(url, base)));
}

function extractFramerCmsUrls(text, base) {
  return extractUrls(text, base).filter((url) => /\.framercms(?:\?|$)/.test(url));
}

function extractScriptUrls(html, base) {
  return unique([
    ...[...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((match) => absoluteUrl(match[1], base)),
    ...extractUrls(html, base).filter((url) => /\.mjs(?:\?|$)/.test(url)),
  ]);
}

function hasResponsiveImage(value) {
  return value && typeof value === "object" && typeof value.src === "string" && /framerusercontent\.com\/images\//.test(value.src);
}

function findImage(record) {
  for (const [key, value] of Object.entries(record)) {
    if (hasResponsiveImage(value)) return { key, value };
  }
  return null;
}

function promptScore(value) {
  if (typeof value !== "string") return 0;
  const text = value.trim();
  if (text.length < 8) return 0;
  let score = 0;
  if (/--[a-z][\w-]*/i.test(text)) score += 8;
  if (/\[(?:your\s+)?(?:prompt|prmpt|subject|character|object)/i.test(text)) score += 6;
  if (/photo|portrait|image|render|style|lighting|background|close-up|cinematic|editorial|studio|surreal|product|model/i.test(text)) {
    score += 4;
  }
  if (text.length > 40) score += 3;
  if (text.length > 160) score += 2;
  if (/^https?:\/\//.test(text)) score -= 5;
  if (/^[a-z0-9_-]{8,}$/i.test(text)) score -= 2;
  return score;
}

function findPrompt(record) {
  if (typeof record.cdCpxAOwD === "string") return { key: "cdCpxAOwD", value: record.cdCpxAOwD };
  const candidates = Object.entries(record)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => ({ key, value, score: promptScore(value) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || right.value.length - left.value.length);
  return candidates[0] ?? null;
}

function extractCategory(record) {
  if (auroraCategoryLabels[record.vULIffZ7M]) return auroraCategoryLabels[record.vULIffZ7M];
  const values = [record.category, record.genre, record.type, record.vULIffZ7M, record.WX4bxcnCH].filter((value) => typeof value === "string");
  return values.find((value) => value.length > 2 && value.length < 40) ?? "Uncategorized";
}

function extractTool(record) {
  if (knownToolLabels[record.Kmf5Gvi8u]) return knownToolLabels[record.Kmf5Gvi8u];
  const values = [record.tool, record.model, record.platform, record.Kmf5Gvi8u].filter((value) => typeof value === "string");
  const known = values.find((value) => /midjourney|nano|stable|flux|dall|image|ai/i.test(value));
  return known ?? "Unknown";
}

function normalizeFramerRecords(records, sourceUrl, sourceData) {
  return records
    .map((record, index) => {
      const image = findImage(record);
      const prompt = findPrompt(record);
      if (!image || !prompt) return null;
      return {
        sourceId: String(record.id ?? `record-${index + 1}`),
        sourceSlug: String(record.Q9AyxrX65 ?? record.slug ?? ""),
        sourcePage: sourceUrl,
        sourceCreatedAt: record.createdAt ?? "",
        sourceUpdatedAt: record.updatedAt ?? "",
        sourceData,
        imageUrl: image.value.src,
        image: {
          width: image.value.pixelWidth ?? image.value.width ?? 0,
          height: image.value.pixelHeight ?? image.value.height ?? 0,
          alt: image.value.alt ?? "",
          srcSet: image.value.srcSet ?? "",
        },
        author: record.QP7e6fYF3 ?? record.author ?? "",
        category: record.vULIffZ7M ?? record.category ?? "",
        categoryLabel: extractCategory(record),
        tool: extractTool(record),
        originalPrompt: prompt.value,
        rawFields: Object.fromEntries(
          Object.entries(record)
            .filter(([, value]) => typeof value === "string")
            .slice(0, 16),
        ),
      };
    })
    .filter(Boolean);
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeGenericHtml(html, sourceUrl) {
  const imageMatches = [...html.matchAll(/<img\b[^>]*>/gi)];
  return imageMatches
    .map((match, index) => {
      const tag = match[0];
      const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1]?.split(/\s+/)[0];
      if (!src) return null;
      const imageUrl = absoluteUrl(decodeHtmlEntities(src), sourceUrl);
      const alt = decodeHtmlEntities(tag.match(/\balt=["']([^"']*)["']/i)?.[1] ?? "");
      const title = decodeHtmlEntities(tag.match(/\btitle=["']([^"']*)["']/i)?.[1] ?? "");
      const prompt = [title, alt].find((value) => promptScore(value) > 0);
      if (!prompt) return null;
      return {
        sourceId: `html-${index + 1}`,
        sourceSlug: "",
        sourcePage: sourceUrl,
        sourceCreatedAt: "",
        sourceUpdatedAt: "",
        sourceData: "generic-html",
        imageUrl,
        image: { width: 0, height: 0, alt, srcSet: "" },
        author: "",
        category: "",
        categoryLabel: "Uncategorized",
        tool: "Unknown",
        originalPrompt: prompt,
        rawFields: { alt, title },
      };
    })
    .filter(Boolean);
}

async function collectRecords(sourceUrl, options = {}) {
  const robotsUrl = robotsUrlFor(sourceUrl);
  const [html, robotsText] = await Promise.all([
    fetchText(sourceUrl),
    fetchText(robotsUrl).catch((error) => `robots.txt unavailable: ${error.message}`),
  ]);
  const cmsUrls = new Set([...knownCmsUrlsFor(sourceUrl), options.cmsUrl, ...extractFramerCmsUrls(html, sourceUrl)].filter(Boolean));
  const pendingScripts = extractScriptUrls(html, sourceUrl);
  const seenScripts = new Set();

  while (pendingScripts.length && seenScripts.size < 120) {
    const scriptUrl = pendingScripts.shift();
    if (!scriptUrl || seenScripts.has(scriptUrl)) continue;
    seenScripts.add(scriptUrl);
    try {
      const script = await fetchText(scriptUrl);
      for (const cmsUrl of extractFramerCmsUrls(script, scriptUrl)) cmsUrls.add(cmsUrl);
      for (const nestedScriptUrl of extractUrls(script, scriptUrl).filter((url) => /\.mjs(?:\?|$)/.test(url))) {
        if (!seenScripts.has(nestedScriptUrl)) pendingScripts.push(nestedScriptUrl);
      }
    } catch {
      // Some chunks are optional or blocked; continue with the sources that are readable.
    }
  }

  const sourceAttempts = [];
  for (const cmsUrl of cmsUrls) {
    try {
      const decoded = decodeFramerCms(await fetchArrayBuffer(cmsUrl));
      const records = normalizeFramerRecords(decoded, sourceUrl, cmsUrl);
      const known = knownCmsUrlsFor(sourceUrl).includes(cmsUrl) || options.cmsUrl === cmsUrl;
      sourceAttempts.push({ type: known ? "framer-cms-adapter" : "framer-cms", url: cmsUrl, decodedRecords: decoded.length, usableRecords: records.length, records });
    } catch (error) {
      sourceAttempts.push({ type: "framer-cms", url: cmsUrl, error: error.message, decodedRecords: 0, usableRecords: 0, records: [] });
    }
  }

  const bestCms = sourceAttempts
    .filter((attempt) => attempt.usableRecords > 0)
    .sort((left, right) => right.usableRecords - left.usableRecords)[0];
  if (bestCms) return { records: bestCms.records, robotsText, collector: bestCms, attempts: sourceAttempts };

  const htmlRecords = normalizeGenericHtml(html, sourceUrl);
  sourceAttempts.push({ type: "generic-html", url: sourceUrl, decodedRecords: imageMatchesCount(html), usableRecords: htmlRecords.length, records: [] });
  return { records: htmlRecords, robotsText, collector: sourceAttempts.at(-1), attempts: sourceAttempts };
}

function imageMatchesCount(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].length;
}

function imageExtension(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ext || ".png";
}

function sanitizePrompt(prompt) {
  return String(prompt)
    .replace(/\[\s*(?:your\s+)?(?:prompt|prmpt|subject|prompt\s+or\s+subject|edit\s+subject)\s*\]/gi, "the requested subject")
    .replace(/\[\s*character\s*\]/gi, "the requested character")
    .replace(/\[\s*object\s*\]/gi, "the requested object")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(?:shot)?ar\s+\d+:\d+-raw\b/gi, "")
    .replace(/\s*--[a-z][\w-]*(?:\s+(?!--)[^\s]+)*/gi, "")
    .replace(/\s*\+\s*$/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

function promptHasPlatformSyntax(prompt) {
  return /--[a-z][\w-]*|\[[^\]]*(?:prompt|prmpt|subject|character|object)[^\]]*\]|https:\/\/s\.mj\.run/i.test(prompt);
}

function isStyleReferenceOnly(originalPrompt, cleanedPrompt) {
  return promptHasPlatformSyntax(originalPrompt) && cleanedPrompt.replace(/^the requested subject$/i, "").trim().length < 24;
}

function inferField(cleanedPrompt, fallback, patterns) {
  const found = patterns.find(([pattern]) => pattern.test(cleanedPrompt));
  return found ? found[1] : fallback;
}

function inferStyleKeywords(cleanedPrompt, category, styleReferenceOnly) {
  const keywords = [];
  const tests = [
    ["photorealistic", /photo|photoreal|photograph|shot|camera/i],
    ["editorial", /editorial|campaign|fashion/i],
    ["studio lighting", /studio|softbox|lighting|lit/i],
    ["macro detail", /macro|close-up|close up|detail/i],
    ["cinematic", /cinematic|dramatic|film/i],
    ["minimal", /minimal|neutral|clean/i],
    ["luxury", /luxury|premium|elegan/i],
    ["surreal", /surreal|abstract|dream/i],
    ["rendered", /3d|render|corona|octane|cgi/i],
  ];
  for (const [label, pattern] of tests) if (pattern.test(cleanedPrompt)) keywords.push(label);
  if (category && category !== "Style Reference" && category !== "Uncategorized") keywords.push(category.toLowerCase());
  if (styleReferenceOnly) keywords.push("reference-image-led style");
  return unique(keywords).slice(0, 8);
}

function inferSubject(cleanedPrompt, category) {
  if (/serum|skin|perfume|skincare|beauty|face|portrait|model|woman|man|hair|makeup/i.test(cleanedPrompt)) {
    return "beauty, portrait, or fashion subject";
  }
  if (/bottle|watch|object|chair|room|bed|kitchen|product|jacket|gloves/i.test(cleanedPrompt)) {
    return "product, object, or interior subject";
  }
  if (category === "Beauty") return "beauty product or skincare subject";
  if (category === "Photo") return "photographic subject";
  return "requested subject";
}

function convertPrompt(sourceRecord) {
  const originalPrompt = sourceRecord.originalPrompt ?? "";
  const cleanedPrompt = sanitizePrompt(originalPrompt);
  const category = sourceRecord.categoryLabel ?? "Uncategorized";
  const styleReferenceOnly = isStyleReferenceOnly(originalPrompt, cleanedPrompt);
  const subject = inferSubject(cleanedPrompt, category);
  const styleKeywords = inferStyleKeywords(cleanedPrompt, category, styleReferenceOnly);
  const color = inferField(cleanedPrompt, "use the source reference image to preserve the main color palette", [
    [/black|dark|shadow|monochrome/i, "deep dark tones with controlled highlights"],
    [/green|orange|mandarin|fruit/i, "green and orange accents with natural warm highlights"],
    [/neutral|cream|beige|white|minimal/i, "clean neutral tones with subtle warm highlights"],
    [/silver|metal|chrome|metallic/i, "silver metallic tones with crisp reflections"],
    [/neon|pink|violet|saturated/i, "vivid accent colors with strong contrast"],
  ]);
  const lighting = inferField(cleanedPrompt, "clear intentional lighting that matches the reference image", [
    [/studio|softbox/i, "controlled studio lighting"],
    [/dramatic|highcontrast|high contrast/i, "dramatic high-contrast lighting"],
    [/sunlight|dappled|natural/i, "natural sunlight with organic shadows"],
    [/ambient/i, "soft ambient lighting"],
    [/glow|radiant/i, "soft glowing highlights"],
  ]);
  const composition = inferField(cleanedPrompt, "balanced composition with a clear focal subject", [
    [/close-up|close up|macro/i, "close-up composition emphasizing texture and detail"],
    [/high angle|from above|top view|overhead/i, "high-angle composition viewed from above"],
    [/over-shoulder|over shoulder/i, "over-the-shoulder composition focused on accessories and surface detail"],
    [/center|symmetry|minimalist/i, "centered composition with clean negative space"],
  ]);
  const texture = inferField(cleanedPrompt, "preserve tactile material detail from the source reference", [
    [/skin|pores|complexion/i, "natural skin detail and smooth tonal transitions"],
    [/rock|stone|marble/i, "stone, marble, or rough mineral texture"],
    [/metal|silver|chrome|liquid/i, "metallic, reflective, or liquid surface detail"],
    [/linen|wool|leather|fabric/i, "soft textile and material texture"],
    [/glass|water|transparent/i, "clear glass or liquid refraction detail"],
  ]);
  const mood = inferField(cleanedPrompt, "polished, high-quality, design-led", [
    [/luxury|premium|elegan|sophisticated/i, "luxury, refined, premium"],
    [/dramatic|monochrome|shadow/i, "dramatic, intense, editorial"],
    [/minimal|neutral|clean/i, "minimal, calm, clean"],
    [/surreal|abstract|dream/i, "surreal, imaginative, art-directed"],
    [/fashion|editorial/i, "fashion-forward, editorial, contemporary"],
  ]);

  const convertedPrompt = styleReferenceOnly
    ? [
        "Create an image of the requested subject using the accompanying reference image as the visual style guide.",
        "Preserve the reference's overall mood, color palette, lighting, composition, texture, and level of detail.",
        `Avoid model-specific parameters; express the result as polished natural-language image direction with a ${mood} mood.`,
      ].join(" ")
    : [
        `Create ${cleanedPrompt || "an image of the requested subject"}.`,
        `Use ${lighting}, ${color}, ${composition}, and ${texture}.`,
        `Keep the image ${mood}, with high detail and a polished finish suitable for our image generation service.`,
      ].join(" ");

  return {
    originalPrompt,
    cleanedPrompt,
    convertedPrompt,
    conversionType: styleReferenceOnly
      ? "reference-image-style-to-natural-language"
      : promptHasPlatformSyntax(originalPrompt)
        ? "platform-specific-to-natural-language"
        : "natural-language-cleanup",
    conversionNotes: styleReferenceOnly
      ? "Original prompt only contained model-specific style-reference syntax, so the converted prompt instructs the service to use the saved reference image as the visual source."
      : promptHasPlatformSyntax(originalPrompt)
        ? "Removed model-specific syntax and rewrote the usable content as natural language."
        : "Original was already natural language; the prompt was normalized and structured for direct service use.",
    subject,
    genre: category,
    styleKeywords,
    color,
    lighting,
    composition,
    texture,
    mood,
  };
}

function slugTag(value) {
  return value.toLowerCase().replace(/\s*\/\s*/g, "-").replace(/\s+/g, "-");
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function classifyPrimary(item, text, styleReferenceOnly) {
  if (styleReferenceOnly) return { category: "pure-style-reference", confidence: "low" };
  if (item.categoryLabel === "Beauty" || includesAny(text, [/serum|skincare|cosmetic|makeup|beauty|skin|perfume|fragrance/])) {
    return { category: "beauty", confidence: "high" };
  }
  if (includesAny(text, [/bed|room|interior|architecture|kitchen|chair|sofa|house|building|hotel|linen-covered/])) {
    return { category: "interior-architecture", confidence: "high" };
  }
  if (includesAny(text, [/character|cartoon|mascot|toy|creature|adorable|kawaii|3d-rendered digital/])) {
    return { category: "character-3d", confidence: "high" };
  }
  if (includesAny(text, [/fashion|model|vogue|editorial|accessor|wetsuit|jacket|headphones|mannequin|runway|styling/])) {
    return { category: "fashion-editorial", confidence: "high" };
  }
  if (includesAny(text, [/portrait|face|woman|man|person|figure|freckles|hair|lips|eyes|skin/])) {
    return { category: "portrait", confidence: "medium" };
  }
  if (includesAny(text, [/bottle|jar|shoe|sneaker|product|package|watch|chair|vase|drive|hard drive|gloves|lamp|sculpture|cassette|paper|book|key|glass|champagne|wine/])) {
    return { category: "product-still-life", confidence: "high" };
  }
  if (item.categoryLabel === "Graphic / Object" || includesAny(text, [/icon|logo|graphic|render|abstract object|glass with transparent/])) {
    return { category: "object-graphic", confidence: "medium" };
  }
  if (includesAny(text, [/surreal|dream|fantasy|symbolic|impossible|abstract|floating|galaxy|glowing circle|glyph/])) {
    return { category: "surreal-concept", confidence: "medium" };
  }
  if (includesAny(text, [/mountain|lake|sea|forest|sky|cloud|waterfall|landscape|city|desert|cliff|wave|snowy|grass|beach/])) {
    return { category: "landscape-environment", confidence: "medium" };
  }
  return { category: "object-graphic", confidence: "low" };
}

function buildStyleTags(item, text, styleReferenceOnly) {
  const tags = (item.styleKeywords ?? []).map(slugTag).map((tag) => (tag === "rendered" ? "rendered-3d" : tag));
  if (styleReferenceOnly) tags.push("reference-image-led");
  if (includesAny(text, [/photo|photoreal|photograph|camera|lens|shot on/])) tags.push("photorealistic");
  if (includesAny(text, [/studio|softbox|lighting|lit|hdr/i])) tags.push("studio-lighting");
  if (includesAny(text, [/macro|close-up|close up|detail|texture|pores/])) tags.push("macro-detail");
  if (includesAny(text, [/minimal|neutral|clean|white space/])) tags.push("minimal");
  if (includesAny(text, [/cinematic|film|dvd screengrab|dramatic/])) tags.push("cinematic");
  if (includesAny(text, [/editorial|vogue|campaign|fashion/])) tags.push("editorial");
  if (includesAny(text, [/luxury|premium|elegan|refined/])) tags.push("luxury");
  if (includesAny(text, [/surreal|abstract|dream|fantasy|impossible/])) tags.push("surreal");
  if (includesAny(text, [/3d|render|cgi|octane|corona|redshift|cinema4d/])) tags.push("rendered-3d");
  if (includesAny(text, [/black background|dark|shadow|gothic|moody/])) tags.push("dark-moody");
  if (includesAny(text, [/pastel|soft pink|candy|kawaii/])) tags.push("soft-pastel");
  if (includesAny(text, [/high contrast|neon|chrome|glow|vibrant/])) tags.push("high-contrast");
  if (includesAny(text, [/organic|moss|plant|flower|wood|wool|felt/])) tags.push("organic");
  if (includesAny(text, [/futuristic|robotic|cyber|circuit|chrome/])) tags.push("futuristic");
  if (includesAny(text, [/glossy|glass|liquid|reflective|polished/])) tags.push("glossy");
  return unique(tags).filter((tag) => taxonomy.styleTags.includes(tag));
}

function buildSubjectTags(item, text) {
  const tags = [];
  if (includesAny(text, [/skin|complexion|pores/])) tags.push("skin");
  if (includesAny(text, [/serum|dropper|skincare/])) tags.push("serum");
  if (includesAny(text, [/perfume|fragrance/])) tags.push("perfume");
  if (item.categoryLabel === "Beauty" || includesAny(text, [/cosmetic|beauty|makeup/])) tags.push("beauty-product");
  if (includesAny(text, [/model|fashion model/])) tags.push("model");
  if (includesAny(text, [/face|portrait|eyes|lips|freckles|hair/])) tags.push("face");
  if (includesAny(text, [/accessor|headphones|jacket|wetsuit|gloves|chain/])) tags.push("fashion-accessory");
  if (includesAny(text, [/shoe|sneaker/])) tags.push("shoe");
  if (includesAny(text, [/bottle|jar|vase/])) tags.push("bottle");
  if (includesAny(text, [/chair|sofa|bed|furniture/])) tags.push("furniture");
  if (includesAny(text, [/room|interior|kitchen|architecture|building/])) tags.push("interior");
  if (includesAny(text, [/glass|transparent|crystal|ice/])) tags.push("glass");
  if (includesAny(text, [/metal|chrome|silver|gold|metallic/])) tags.push("metal");
  if (includesAny(text, [/moss|plant|wood|wool|felt|linen|stone|clay|organic/])) tags.push("organic-material");
  if (includesAny(text, [/flower|rose|peony|lotus|petal/])) tags.push("flower");
  if (includesAny(text, [/robot|robotic|circuit|hard drive|mechanical/])) tags.push("robotic-object");
  if (includesAny(text, [/fish|horse|spider|animal|bird|koi/])) tags.push("animal");
  if (includesAny(text, [/mountain|lake|sea|forest|sky|landscape|cloud|waterfall|desert|cliff|wave/])) tags.push("landscape");
  if (includesAny(text, [/character|cartoon|mascot|creature|figure/])) tags.push("character");
  if (includesAny(text, [/abstract|icon|graphic|shape|object/])) tags.push("abstract-object");
  return unique(tags);
}

function buildProductionTags(text, styleReferenceOnly) {
  const tags = ["high-detail", "commercial-ready"];
  if (styleReferenceOnly) tags.push("needs-reference-image");
  if (includesAny(text, [/close-up|close up|macro/])) tags.push("close-up");
  if (includesAny(text, [/top-down|top down|from above|high angle|overhead/])) tags.push("top-view");
  if (includesAny(text, [/wide-angle|wide shot|landscape/])) tags.push("wide-shot");
  if (includesAny(text, [/black background|pitch black|solid black/])) tags.push("black-background");
  if (includesAny(text, [/white background|polar white|solid white/])) tags.push("white-background");
  if (includesAny(text, [/transparent background/])) tags.push("transparent-background");
  if (includesAny(text, [/soft|ambient|diffused|natural light/])) tags.push("soft-light");
  if (includesAny(text, [/dramatic|high contrast|neon|glow|shadow/])) tags.push("dramatic-light");
  if (includesAny(text, [/single|minimal|centered|one variation|one subject/])) tags.push("single-subject");
  if (includesAny(text, [/texture|material|pores|fabric|stone|glass|metal|liquid/])) tags.push("texture-focused");
  return unique(tags).filter((tag) => taxonomy.productionTags.includes(tag));
}

function classifyItem(item) {
  const text = [item.title, item.genre, item.categoryLabel, item.cleanedPrompt, item.originalPrompt].filter(Boolean).join(" ").toLowerCase();
  const styleReferenceOnly = item.conversionType === "reference-image-style-to-natural-language";
  const { category, confidence } = classifyPrimary(item, text, styleReferenceOnly);
  const styleTags = buildStyleTags(item, text, styleReferenceOnly);
  const subjectTags = buildSubjectTags(item, text);
  const productionTags = buildProductionTags(text, styleReferenceOnly);
  const lowConfidence =
    confidence === "low" ||
    styleReferenceOnly ||
    (subjectTags.length === 0 && !["pure-style-reference", "surreal-concept", "landscape-environment"].includes(category));
  return {
    primaryCategory: category,
    styleTags,
    subjectTags,
    productionTags,
    conversionStatus: styleReferenceOnly
      ? "style-reference-only"
      : lowConfidence
        ? "needs-human-review"
        : item.conversionType === "natural-language-cleanup"
          ? "clean-natural-language"
          : "converted-from-midjourney",
    reviewStatus: lowConfidence ? "needs-review" : "auto-classified",
  };
}

function escapePipe(value) {
  return String(value).replace(/\|/g, "\\|");
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countList(items, key) {
  return items.reduce((counts, item) => {
    for (const value of item[key] ?? []) counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countTable(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => `| ${name} | ${count} |`)
    .join("\n");
}

function itemMarkdown(item) {
  return `# ${item.number}. ${item.title}

![Reference image](../images/${item.imageFile})

## Source

- Source page: ${item.sourcePage}
- Source data: ${item.sourceData}
- Image URL: ${item.imageUrl}
- Tool label: ${item.tool}
- Author: ${item.author || "Unknown"}
- Source ID: ${item.sourceId}
- Source slug: ${item.sourceSlug}
- Category: ${item.categoryLabel || item.genre || item.category}
- Image size: ${item.image.width || "unknown"} x ${item.image.height || "unknown"}

## Operations

- Primary category: ${item.primaryCategory}
- Style tags: ${item.styleTags.join(", ") || "none"}
- Subject tags: ${item.subjectTags.join(", ") || "none"}
- Production tags: ${item.productionTags.join(", ") || "none"}
- Conversion status: ${item.conversionStatus}
- Review status: ${item.reviewStatus}

## Original Prompt

\`\`\`text
${item.originalPrompt}
\`\`\`

## Converted Prompt

\`\`\`text
${item.convertedPrompt}
\`\`\`

## Conversion Notes

- Conversion type: ${item.conversionType}
- ${item.conversionNotes}
`;
}

function tableRows(items) {
  return items
    .map(
      (item) =>
        `| ${item.number} | [![${escapePipe(item.title)}](../images/${item.imageFile})](../images/${item.imageFile}) | [${escapePipe(item.title)}](../items/${item.itemFile}) | ${item.categoryLabel || item.genre} | ${item.conversionStatus} | ${[...item.styleTags, ...item.subjectTags, ...item.productionTags].slice(0, 8).join(", ")} | [JSON](../items/${item.jsonFile}) |`,
    )
    .join("\n");
}

function collectionMarkdown(category, items) {
  return `# ${category}

${taxonomy.primaryCategories[category] ?? "Items that could not be mapped to a known category."}

- Items: ${items.length}
- Review needed: ${items.filter((item) => item.reviewStatus === "needs-review").length}

| # | Image | Title | Original category | Conversion status | Main tags | Links |
|---|---|---|---|---|---|---|
${tableRows(items)}
`;
}

function indexMarkdown(items, metadata) {
  const primaryCounts = countBy(items, "primaryCategory");
  const conversionCounts = countBy(items, "conversionStatus");
  const reviewCounts = countBy(items, "reviewStatus");
  const styleCounts = countList(items, "styleTags");
  const collectionLinks = categoryOrder
    .filter((category) => primaryCounts[category])
    .map((category) => `- [${category}](collections/${category}.md): ${primaryCounts[category]}`)
    .join("\n");
  return `# ${metadata.name} Style References

Collected from ${metadata.sourceUrl} on ${metadata.collectedAt}.

This directory is managed as an operational style reference library for image generation search, filtering, recommendation, and prompt reuse. Images remain in \`images/\`; category membership is managed through item JSON metadata and generated collection indexes.

## Summary

- Total items: ${items.length}
- Downloaded images: ${metadata.downloadedImages}
- Converted prompts: ${metadata.convertedPrompts}
- Needs review: ${reviewCounts["needs-review"] ?? 0}
- Collector: ${metadata.collector.type}
- Source data: ${metadata.collector.url}

## Collections

${collectionLinks}

## Category Counts

| Category | Count |
|---|---:|
${countTable(primaryCounts)}

## Conversion Status Counts

| Status | Count |
|---|---:|
${countTable(conversionCounts)}

## Review Status Counts

| Status | Count |
|---|---:|
${countTable(reviewCounts)}

## Top Style Tags

| Tag | Count |
|---|---:|
${countTable(Object.fromEntries(Object.entries(styleCounts).sort((a, b) => b[1] - a[1]).slice(0, 20)))}

## Operating Rules

- Use \`items/*.json\` as the source of truth for image, prompt, and classification metadata.
- Keep \`originalPrompt\` unchanged for provenance.
- Use \`convertedPrompt\` for service-facing image generation.
- Treat \`primaryCategory\` as the main filter and tags as secondary filters.
- Treat \`productionTags: ["needs-reference-image"]\` as a requirement to pass the saved image with the prompt.
- Review \`reviewStatus: "needs-review"\` before using the item in production recommendation flows.
- Do not duplicate images into category folders; generated collections link back to \`images/\` and \`items/\`.

## Items

| # | Image | Title | Category | Original category | Conversion | Review | Tags |
|---|---|---|---|---|---|---|---|
${items
  .map(
    (item) =>
      `| ${item.number} | [![${escapePipe(item.title)}](images/${item.imageFile})](images/${item.imageFile}) | [${escapePipe(item.title)}](items/${item.itemFile}) | ${item.primaryCategory} | ${item.categoryLabel || item.genre} | ${item.conversionStatus} | ${item.reviewStatus} | ${[...item.styleTags, ...item.subjectTags, ...item.productionTags].slice(0, 8).join(", ")} |`,
  )
  .join("\n")}
`;
}

async function validate(items, paths) {
  const errors = [];
  const warnings = [];
  const imageFiles = (await fs.readdir(paths.imagesDir)).filter((file) => !file.startsWith("."));
  const jsonFiles = (await fs.readdir(paths.itemsDir)).filter((file) => file.endsWith(".json"));
  const mdFiles = (await fs.readdir(paths.itemsDir)).filter((file) => file.endsWith(".md"));
  const platformPattern = /--[a-z][\w-]*|\[[^\]]*(?:prompt|prmpt|subject|character|object)[^\]]*\]|https:\/\/s\.mj\.run/i;

  for (const item of items) {
    for (const field of ["sourceId", "imageFile", "originalPrompt", "convertedPrompt"]) {
      if (!item[field]) errors.push(`${item.jsonFile}: missing ${field}`);
    }
    try {
      await fs.access(path.join(paths.imagesDir, item.imageFile));
    } catch {
      errors.push(`${item.jsonFile}: missing linked image ${item.imageFile}`);
    }
    try {
      const markdown = await fs.readFile(path.join(paths.itemsDir, item.itemFile), "utf8");
      if (!markdown.includes(`Source ID: ${item.sourceId}`)) errors.push(`${item.itemFile}: sourceId mismatch`);
      if (!markdown.includes(`../images/${item.imageFile}`)) errors.push(`${item.itemFile}: image link mismatch`);
    } catch {
      errors.push(`${item.jsonFile}: missing linked markdown ${item.itemFile}`);
    }
    if (platformPattern.test(item.convertedPrompt)) errors.push(`${item.jsonFile}: convertedPrompt contains model-specific syntax`);
    for (const field of ["primaryCategory", "styleTags", "subjectTags", "productionTags", "conversionStatus", "reviewStatus"]) {
      if (!(field in item)) errors.push(`${item.jsonFile}: missing ${field}`);
    }
    if (!categoryOrder.includes(item.primaryCategory)) errors.push(`${item.jsonFile}: unknown primaryCategory ${item.primaryCategory}`);
  }
  if (items.length !== imageFiles.length) warnings.push(`item count (${items.length}) and image count (${imageFiles.length}) differ`);
  if (items.length !== jsonFiles.length) errors.push(`item count (${items.length}) and JSON count (${jsonFiles.length}) differ`);
  if (items.length !== mdFiles.length) errors.push(`item count (${items.length}) and Markdown count (${mdFiles.length}) differ`);
  return { errors, warnings, imageFiles, jsonFiles, mdFiles };
}

function validationMarkdown(items, result, metadata) {
  return `# ${metadata.name} Validation Report

Generated: ${collectedAt}

## Result

- Status: ${result.errors.length === 0 ? "pass" : "fail"}
- Items: ${items.length}
- Images: ${result.imageFiles.length}
- JSON files: ${result.jsonFiles.length}
- Markdown files: ${result.mdFiles.length}
- Errors: ${result.errors.length}
- Warnings: ${result.warnings.length}

## Category Counts

| Category | Count |
|---|---:|
${countTable(countBy(items, "primaryCategory"))}

## Conversion Status Counts

| Status | Count |
|---|---:|
${countTable(countBy(items, "conversionStatus"))}

## Review Status Counts

| Status | Count |
|---|---:|
${countTable(countBy(items, "reviewStatus"))}

## Collector Attempts

${metadata.collectorAttempts
  .map((attempt) => `- ${attempt.type}: ${attempt.url} (${attempt.usableRecords}/${attempt.decodedRecords || 0} usable${attempt.error ? `, error: ${attempt.error}` : ""})`)
  .join("\n")}

## Checks

- Each item has \`sourceId\`, \`imageFile\`, \`originalPrompt\`, and \`convertedPrompt\`.
- Each \`imageFile\` exists in \`images/\`.
- Each item Markdown file includes the same \`sourceId\` as its JSON file.
- Each \`convertedPrompt\` is checked for model-specific options, \`s.mj.run\` URLs, and unresolved prompt placeholders.
- Required operational fields are present on every item JSON.

## Errors

${result.errors.length ? result.errors.map((error) => `- ${error}`).join("\n") : "- None"}

## Warnings

${result.warnings.length ? result.warnings.map((warning) => `- ${warning}`).join("\n") : "- None"}
`;
}

async function writeLibrary(sourceRecords, metadata, paths) {
  if (!metadata.keepExisting) await fs.rm(paths.outDir, { recursive: true, force: true });
  await fs.mkdir(paths.imagesDir, { recursive: true });
  await fs.mkdir(paths.itemsDir, { recursive: true });
  await fs.mkdir(paths.collectionsDir, { recursive: true });

  const seen = new Set();
  const records = sourceRecords.filter((record) => {
    const key = `${record.sourceId}:${record.imageUrl}:${record.originalPrompt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const limitedRecords = metadata.limit ? records.slice(0, metadata.limit) : records;
  const items = [];

  for (const [index, record] of limitedRecords.entries()) {
    const number = String(index + 1).padStart(3, "0");
    const conversion = convertPrompt(record);
    const imageFile = `${number}-${record.sourceId}${imageExtension(record.imageUrl)}`;
    const itemFile = `${number}-${record.sourceId}.md`;
    const jsonFile = `${number}-${record.sourceId}.json`;
    const titleSeed = conversion.cleanedPrompt || conversion.genre || "Style Reference";
    const title = titleSeed.replace(/^create\s+/i, "").split(/[,.]/)[0].trim().slice(0, 72);
    const baseItem = {
      number,
      title: title || `${conversion.genre} Style Reference`,
      ...record,
      imageFile,
      itemFile,
      jsonFile,
      categoryLabel: record.categoryLabel || conversion.genre,
      ...conversion,
      collectedAt,
    };
    const item = { ...baseItem, ...classifyItem(baseItem) };
    await download(record.imageUrl, path.join(paths.imagesDir, imageFile));
    await fs.writeFile(path.join(paths.itemsDir, itemFile), itemMarkdown(item));
    await fs.writeFile(path.join(paths.itemsDir, jsonFile), `${JSON.stringify(item, null, 2)}\n`);
    items.push(item);
  }

  const groups = Object.fromEntries(categoryOrder.map((category) => [category, []]));
  for (const item of items) groups[item.primaryCategory].push(item);
  for (const category of categoryOrder) {
    await fs.writeFile(path.join(paths.collectionsDir, `${category}.md`), collectionMarkdown(category, groups[category]));
  }

  const finalMetadata = {
    name: metadata.name,
    sourceUrl: metadata.sourceUrl,
    collectedAt,
    robots: metadata.robots,
    collector: metadata.collector,
    collectorAttempts: metadata.collectorAttempts.map(({ records, ...attempt }) => attempt),
    discoveredRecords: sourceRecords.length,
    collectedItems: items.length,
    downloadedImages: items.length,
    convertedPrompts: items.length,
    taxonomyFile: "taxonomy.json",
    collectionsDir: "collections",
    categoryCounts: countBy(items, "primaryCategory"),
    conversionStatusCounts: countBy(items, "conversionStatus"),
    reviewStatusCounts: countBy(items, "reviewStatus"),
    styleTagCounts: countList(items, "styleTags"),
    items: items.map((item) => ({
      number: item.number,
      title: item.title,
      sourceId: item.sourceId,
      itemFile: item.itemFile,
      jsonFile: item.jsonFile,
      imageFile: item.imageFile,
      primaryCategory: item.primaryCategory,
      styleTags: item.styleTags,
      subjectTags: item.subjectTags,
      productionTags: item.productionTags,
      conversionStatus: item.conversionStatus,
      reviewStatus: item.reviewStatus,
      originalPrompt: item.originalPrompt,
      convertedPrompt: item.convertedPrompt,
      conversionType: item.conversionType,
    })),
  };

  await fs.writeFile(path.join(paths.outDir, "taxonomy.json"), `${JSON.stringify(taxonomy, null, 2)}\n`);
  await fs.writeFile(path.join(paths.outDir, "metadata.json"), `${JSON.stringify(finalMetadata, null, 2)}\n`);
  await fs.writeFile(path.join(paths.outDir, "index.md"), indexMarkdown(items, finalMetadata));

  const validation = await validate(items, paths);
  await fs.writeFile(path.join(paths.outDir, "validation-report.md"), validationMarkdown(items, validation, finalMetadata));
  if (validation.errors.length) {
    throw new Error(`Validation failed with ${validation.errors.length} errors. See ${path.join(paths.outDir, "validation-report.md")}`);
  }
  return { items, metadata: finalMetadata, validation };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.join(root, "style-references", args.name);
  const paths = {
    outDir,
    imagesDir: path.join(outDir, "images"),
    itemsDir: path.join(outDir, "items"),
    collectionsDir: path.join(outDir, "collections"),
  };
  const collection = await collectRecords(args.url, { cmsUrl: args.cmsUrl });
  if (!collection.records.length) {
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(
      path.join(outDir, "collector-report.json"),
      `${JSON.stringify(
        {
          sourceUrl: args.url,
          collectedAt,
          status: "needs-manual-adapter",
          message: "No usable image/prompt records were found by the Framer CMS or generic HTML collectors.",
          attempts: collection.attempts.map(({ records, ...attempt }) => attempt),
        },
        null,
        2,
      )}\n`,
    );
    throw new Error(`No usable records found. Wrote ${path.relative(root, path.join(outDir, "collector-report.json"))}`);
  }

  const result = await writeLibrary(collection.records, {
    name: args.name,
    sourceUrl: args.url,
    keepExisting: args.keepExisting,
    limit: args.limit,
    robots: { url: robotsUrlFor(args.url), text: collection.robotsText.trim() },
    collector: { ...collection.collector, records: undefined },
    collectorAttempts: collection.attempts,
  }, paths);

  console.log(
    JSON.stringify(
      {
        output: path.relative(root, outDir),
        items: result.items.length,
        collector: result.metadata.collector.type,
        sourceData: result.metadata.collector.url,
        categoryCounts: result.metadata.categoryCounts,
        reviewStatusCounts: result.metadata.reviewStatusCounts,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
