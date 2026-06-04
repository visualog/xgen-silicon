import fs from "node:fs/promises";
import path from "node:path";

export type StyleReferenceLibraryItem = {
  id: string;
  collection: string;
  title: string;
  imageUrl: string;
  imageFile: string;
  imageRelativePath: string;
  prompt: string;
  primaryCategory: string;
  styleTags: string[];
  subjectTags: string[];
  productionTags: string[];
  reviewStatus: string;
  conversionStatus: string;
  sourcePage?: string;
  sourceId?: string;
};

export type StyleReferenceLibrary = {
  version: number;
  generatedAt: string;
  sourceRoot: string;
  totalItems: number;
  collections: { id: string; label: string; count: number }[];
  categoryCounts: Record<string, number>;
  styleTagCounts: Record<string, number>;
  productionTagCounts: Record<string, number>;
  subjectTagCounts: Record<string, number>;
  items: StyleReferenceLibraryItem[];
};

export type StyleReferenceLibraryClientItem = Omit<StyleReferenceLibraryItem, "imageFile" | "imageRelativePath">;

const MANIFEST_PATH = path.join(process.cwd(), "data", "style-reference-library.json");
const DEFAULT_REFERENCE_ROOT = path.join(/*turbopackIgnore: true*/ process.cwd(), "style-references");
const SAFE_TOKEN = /^[a-zA-Z0-9._-]+$/;
const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

let cachedLibrary: StyleReferenceLibrary | null = null;

function assertSafeToken(value: string) {
  return SAFE_TOKEN.test(value);
}

function getReferenceRoot() {
  return process.env.XGEN_STYLE_REFERENCE_ROOT || DEFAULT_REFERENCE_ROOT;
}

function toClientItem(item: StyleReferenceLibraryItem): StyleReferenceLibraryClientItem {
  return {
    id: item.id,
    collection: item.collection,
    title: item.title,
    imageUrl: item.imageUrl,
    prompt: item.prompt,
    primaryCategory: item.primaryCategory,
    styleTags: item.styleTags,
    subjectTags: item.subjectTags,
    productionTags: item.productionTags,
    reviewStatus: item.reviewStatus,
    conversionStatus: item.conversionStatus,
    sourcePage: item.sourcePage,
    sourceId: item.sourceId,
  };
}

export async function readStyleReferenceLibrary() {
  if (cachedLibrary) return cachedLibrary;
  const raw = await fs.readFile(MANIFEST_PATH, "utf8");
  cachedLibrary = JSON.parse(raw) as StyleReferenceLibrary;
  return cachedLibrary;
}

export async function readStyleReferenceLibraryForClient() {
  const library = await readStyleReferenceLibrary();
  return {
    ...library,
    items: library.items.map(toClientItem),
  };
}

export async function resolveStyleReferenceImage(collection: string, id: string) {
  if (!assertSafeToken(collection) || !assertSafeToken(id)) return null;

  const library = await readStyleReferenceLibrary();
  const item = library.items.find((candidate) => candidate.collection === collection && candidate.id === id);
  if (!item) return null;

  const root = path.resolve(/*turbopackIgnore: true*/ getReferenceRoot());
  const imagePath = path.resolve(/*turbopackIgnore: true*/ root, item.imageRelativePath);
  if (!imagePath.startsWith(`${root}${path.sep}`)) return null;

  const extension = path.extname(imagePath).toLowerCase();
  const contentType = IMAGE_MIME_BY_EXTENSION[extension];
  if (!contentType) return null;

  return { imagePath, contentType };
}
