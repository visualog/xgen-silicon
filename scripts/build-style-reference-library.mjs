import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const referencesRoot = path.join(root, "style-references");
const outputFile = path.join(root, "data", "style-reference-library.json");

function asArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function compactText(value, fallback) {
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return text || fallback;
}

function buildTitle(item, id) {
  const title = compactText(item.title, "");
  if (title && title !== "the requested subject") return title.slice(0, 90);
  const category = compactText(item.primaryCategory, "style reference").replace(/-/g, " ");
  return `${category} ${item.number || id}`.trim();
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function collectionNames() {
  const entries = await fs.readdir(referencesRoot, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function buildCollection(collection) {
  const collectionRoot = path.join(referencesRoot, collection);
  const itemsDir = path.join(collectionRoot, "items");
  const files = (await fs.readdir(itemsDir).catch(() => []))
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  const items = [];
  for (const file of files) {
    const item = await readJson(path.join(itemsDir, file));
    const id = path.basename(file, ".json");
    const imageFile = compactText(item.imageFile, "");
    if (!imageFile) continue;

    const prompt = compactText(item.convertedPrompt, compactText(item.cleanedPrompt, compactText(item.originalPrompt, "")));
    if (!prompt) continue;

    items.push({
      id,
      collection,
      title: buildTitle(item, id),
      imageUrl: `/api/style-references/image/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
      imageFile,
      imageRelativePath: path.posix.join(collection, "images", imageFile),
      prompt,
      primaryCategory: compactText(item.primaryCategory, "uncategorized"),
      styleTags: asArray(item.styleTags),
      subjectTags: asArray(item.subjectTags),
      productionTags: asArray(item.productionTags),
      reviewStatus: compactText(item.reviewStatus, "unknown"),
      conversionStatus: compactText(item.conversionStatus, "unknown"),
      sourcePage: compactText(item.sourcePage, ""),
      sourceId: compactText(item.sourceId, id),
    });
  }

  return items;
}

function counts(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function tagCounts(items, key) {
  return items.reduce((acc, item) => {
    for (const tag of item[key] || []) acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
}

const collections = await collectionNames();
const items = (await Promise.all(collections.map(buildCollection))).flat();
const generatedAt = new Date().toISOString();

const manifest = {
  version: 1,
  generatedAt,
  sourceRoot: "style-references",
  totalItems: items.length,
  collections: collections.map((collection) => ({
    id: collection,
    label: collection.replace(/[-_]+/g, " "),
    count: items.filter((item) => item.collection === collection).length,
  })),
  categoryCounts: counts(items, "primaryCategory"),
  styleTagCounts: tagCounts(items, "styleTags"),
  productionTagCounts: tagCounts(items, "productionTags"),
  subjectTagCounts: tagCounts(items, "subjectTags"),
  items,
};

await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Wrote ${items.length} style reference items to ${path.relative(root, outputFile)}`);
