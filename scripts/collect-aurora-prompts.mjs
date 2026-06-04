import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const sourceUrl = "https://aurora.ai.kr/prompt";
const robotsUrl = "https://aurora.ai.kr/robots.txt";
const cmsChunkUrl =
  "https://framerusercontent.com/cms/aEIlHRv10HYiuhbFOTm9/eIwrzkNcLsZ7bz9JAze7/mMl7hZ1Lg-chunk-default-0.framercms";

const outDir = path.join(root, "style-references", "aurora-prompts");
const imagesDir = path.join(outDir, "images");
const itemsDir = path.join(outDir, "items");

const collectedAt = "2026-05-29";

const categoryLabels = {
  C6_V54UF6: "Beauty",
  AuemOO7u5: "Style Reference",
  RDQg_eU9B: "Photo",
  kE0uvy9N5: "Graphic / Object",
};

const toolLabels = {
  y1JvE0IOh: "Midjourney",
  xUQF8mqTG: "Nano Banana",
};

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
      return reader.readString();
    case 4:
      return new Date(Number(reader.readBigInt64())).toISOString();
    case 5:
      return reader.readString();
    case 6:
      return reader.readString();
    case 7:
      return reader.readJson();
    case 8:
      return reader.readFloat64();
    case 9: {
      const length = reader.readUint16();
      const value = {};
      for (let index = 0; index < length; index++) {
        value[reader.readString()] = readValue(reader);
      }
      return value;
    }
    case 10:
      return reader.readJson();
    case 11:
      return reader.readInt8() === 0 ? { richTextPointer: reader.readUint32() } : reader.readString();
    case 12:
      return reader.readString();
    case 13:
      return { vectorSetItem: reader.readUint32() };
    default:
      throw new Error(`Unsupported CMS value type ${type}`);
  }
}

function readRecord(reader) {
  const fieldCount = reader.readUint16();
  const record = {};
  for (let index = 0; index < fieldCount; index++) {
    record[reader.readString()] = readValue(reader);
  }
  return record;
}

async function fetchArrayBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.arrayBuffer();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function decodeCms(buffer) {
  const reader = new Reader(buffer);
  const count = reader.readUint32();
  const records = [];
  for (let index = 0; index < count; index++) {
    records.push(readRecord(reader));
  }
  if (reader.offset !== reader.buffer.length) {
    throw new Error(`CMS decode left unread bytes: ${reader.buffer.length - reader.offset}`);
  }
  return records;
}

function imageExtension(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ext || ".png";
}

function sanitizePrompt(prompt) {
  return prompt
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
  for (const [label, pattern] of tests) {
    if (pattern.test(cleanedPrompt)) keywords.push(label);
  }
  if (category && category !== "Style Reference") keywords.push(category.toLowerCase());
  if (styleReferenceOnly) keywords.push("reference-image-led style");
  return [...new Set(keywords)].slice(0, 8);
}

function inferField(cleanedPrompt, fallback, patterns) {
  const found = patterns.find(([pattern]) => pattern.test(cleanedPrompt));
  return found ? found[1] : fallback;
}

function buildConversion(record) {
  const originalPrompt = record.cdCpxAOwD ?? "";
  const cleanedPrompt = sanitizePrompt(originalPrompt);
  const category = categoryLabels[record.vULIffZ7M] ?? "Uncategorized";
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
  const mood = inferField(cleanedPrompt, "polished, high-quality, design-led mood", [
    [/luxury|premium|elegan|sophisticated/i, "luxury, refined, premium"],
    [/dramatic|monochrome|shadow/i, "dramatic, intense, editorial"],
    [/minimal|neutral|clean/i, "minimal, calm, clean"],
    [/surreal|abstract|dream/i, "surreal, imaginative, art-directed"],
    [/fashion|editorial/i, "fashion-forward, editorial, contemporary"],
  ]);

  const convertedPrompt = styleReferenceOnly
    ? [
        "Create an image of the requested subject using the accompanying reference image as the visual style guide.",
        `Preserve the reference's overall mood, color palette, lighting, composition, texture, and level of detail.`,
        `Avoid Midjourney or model-specific parameters; express the result as a polished natural-language image direction with ${mood} mood.`,
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
      ? "Original prompt only contained model-specific style-reference syntax, so the converted prompt instructs the service to use the saved reference image as the visual style source."
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

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
}

function markdownItem(item) {
  return `# ${item.number}. ${item.title}

![Reference image](../images/${item.imageFile})

## Source

- Source page: ${item.sourcePage}
- Image URL: ${item.imageUrl}
- Tool label: ${item.tool}
- Author: ${item.author || "Unknown"}
- Source ID: ${item.sourceId}
- Source slug: ${item.sourceSlug}
- Category: ${item.category}
- Image size: ${item.image.width} x ${item.image.height}

## Original Prompt

\`\`\`text
${item.originalPrompt}
\`\`\`

## Converted Prompt

\`\`\`text
${item.convertedPrompt}
\`\`\`

## Metadata

- Subject: ${item.subject}
- Genre: ${item.genre}
- Style keywords: ${item.styleKeywords.join(", ") || "reference image, visual style"}
- Color: ${item.color}
- Lighting: ${item.lighting}
- Composition: ${item.composition}
- Texture: ${item.texture}
- Mood: ${item.mood}
- Conversion notes: ${item.conversionNotes}
`;
}

function indexMarkdown(items, robotsText) {
  const table = items
    .map(
      (item) =>
        `| ${item.number} | [${item.title}](items/${item.itemFile}) | ${item.author || "Unknown"} | ${item.genre} | ${item.tool} | ${item.image.width} x ${item.image.height} | ${item.conversionType} |`
    )
    .join("\n");

  return `# Aurora Prompt Style References

Collected from ${sourceUrl} on ${collectedAt}.

Robots status checked: ${robotsUrl}

\`\`\`text
${robotsText.trim()}
\`\`\`

## Summary

- Collected items: ${items.length}
- Downloaded images: ${items.length}
- Converted prompts: ${items.length}
- Source data: Framer CMS chunk referenced by the public prompt page
- Notes: many source prompts are Midjourney style-reference-only prompts, so those converted prompts explicitly use the saved reference image as the visual style guide.

## Items

| # | Title | Author | Genre | Tool | Image size | Conversion |
|---|---|---|---|---|---|---|
${table}

## Conversion Rules Applied

- Removed Midjourney-specific flags such as \`--sref\`, \`--oref\`, \`--sw\`, \`--stylize\`, \`--style\`, \`--ar\`, \`--s\`, \`--q\`, \`--chaos\`, \`--seed\`, \`--exp\`, \`--sv\`, and \`--v\`.
- Removed direct model reference URLs such as \`https://s.mj.run/...\` from converted prompts.
- Replaced \`[your prompt]\` placeholders with natural-language "requested subject" phrasing.
- Converted style-reference-only prompts into reusable prompts that point to the saved reference image and specify mood, color, lighting, composition, texture, and detail requirements.
- Preserved the original prompt and source image URL in each item file.
`;
}

const [cmsBuffer, robotsText] = await Promise.all([fetchArrayBuffer(cmsChunkUrl), fetchText(robotsUrl)]);
const records = decodeCms(cmsBuffer)
  .filter((record) => record.id && record.LKNqDH4dk?.src && record.cdCpxAOwD)
  .sort((left, right) => new Date(right.createdAt ?? 0) - new Date(left.createdAt ?? 0));

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(imagesDir, { recursive: true });
await fs.mkdir(itemsDir, { recursive: true });

const items = [];

for (const [index, record] of records.entries()) {
  const number = String(index + 1).padStart(3, "0");
  const conversion = buildConversion(record);
  const imageUrl = record.LKNqDH4dk.src;
  const imageFile = `${number}-${record.id}${imageExtension(imageUrl)}`;
  const itemFile = `${number}-${record.id}.md`;
  const jsonFile = `${number}-${record.id}.json`;
  const imagePath = path.join(imagesDir, imageFile);

  await download(imageUrl, imagePath);

  const titleSeed = conversion.cleanedPrompt || conversion.genre || "Style Reference";
  const title = titleSeed
    .replace(/^create\s+/i, "")
    .split(/[,.]/)[0]
    .trim()
    .slice(0, 72);

  const item = {
    number,
    title: title || `${conversion.genre} Style Reference`,
    sourceId: record.id,
    sourceSlug: record.Q9AyxrX65 ?? "",
    sourcePage: sourceUrl,
    sourceCreatedAt: record.createdAt ?? "",
    sourceUpdatedAt: record.updatedAt ?? "",
    imageUrl,
    imageFile,
    itemFile,
    jsonFile,
    image: {
      width: record.LKNqDH4dk.pixelWidth,
      height: record.LKNqDH4dk.pixelHeight,
      alt: record.LKNqDH4dk.alt ?? "",
      srcSet: record.LKNqDH4dk.srcSet ?? "",
    },
    author: record.QP7e6fYF3 ?? "",
    category: record.vULIffZ7M ?? "",
    categoryLabel: conversion.genre,
    tool: toolLabels[record.Kmf5Gvi8u] ?? "Unknown",
    rawFields: {
      WX4bxcnCH: record.WX4bxcnCH ?? "",
      Kmf5Gvi8u: record.Kmf5Gvi8u ?? "",
      vULIffZ7M: record.vULIffZ7M ?? "",
      DYKpmRfgV: record.DYKpmRfgV ?? "",
      d2mAxFlHt: record.d2mAxFlHt ?? "",
      yfMyxHF_8: record.yfMyxHF_8 ?? "",
    },
    ...conversion,
    collectedAt,
  };

  await fs.writeFile(path.join(itemsDir, itemFile), markdownItem(item));
  await fs.writeFile(path.join(itemsDir, jsonFile), `${JSON.stringify(item, null, 2)}\n`);
  items.push(item);
}

await fs.writeFile(path.join(outDir, "index.md"), indexMarkdown(items, robotsText));
await fs.writeFile(
  path.join(outDir, "metadata.json"),
  `${JSON.stringify(
    {
      sourceUrl,
      cmsChunkUrl,
      collectedAt,
      robots: {
        url: robotsUrl,
        text: robotsText.trim(),
      },
      cmsRecordsDecoded: decodeCms(cmsBuffer).length,
      collectedItems: items.length,
      downloadedImages: items.length,
      convertedPrompts: items.length,
      conversionCounts: items.reduce((acc, item) => {
        acc[item.conversionType] = (acc[item.conversionType] ?? 0) + 1;
        return acc;
      }, {}),
      items: items.map((item) => ({
        number: item.number,
        title: item.title,
        sourceId: item.sourceId,
        itemFile: item.itemFile,
        jsonFile: item.jsonFile,
        imageFile: item.imageFile,
        originalPrompt: item.originalPrompt,
        convertedPrompt: item.convertedPrompt,
        conversionType: item.conversionType,
      })),
    },
    null,
    2
  )}\n`
);

console.log(`Decoded ${records.length} prompt records and wrote ${items.length} references to ${path.relative(root, outDir)}`);
