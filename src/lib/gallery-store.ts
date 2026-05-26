import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type JsonRecord = Record<string, unknown>;

export type GalleryStorePayload = {
  theme?: "light" | "dark";
  generatedResults?: unknown[];
  draft?: unknown;
  updatedAt?: string;
};

function getDefaultDataDir() {
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "BrandGen", "data");
  }
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || os.homedir(), "BrandGen", "data");
  }
  return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), "BrandGen", "data");
}

const DATA_DIR = process.env.BRANDGEN_DATA_DIR || getDefaultDataDir();
const STORE_PATH = path.join(DATA_DIR, "gallery.json");
const IMAGE_DIR = path.join(DATA_DIR, "images");

function getImageExtension(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "png";
}

function sanitizeFilePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 80) || "image";
}

function parseDataImageUrl(value: string) {
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    base64: match[2],
    extension: getImageExtension(match[1]),
  };
}

async function writeImageAsset(dataUrl: string, fileBaseName: string) {
  const parsed = parseDataImageUrl(dataUrl);
  if (!parsed) return dataUrl;

  await fs.mkdir(IMAGE_DIR, { recursive: true });
  const fileName = `${sanitizeFilePart(fileBaseName)}.${parsed.extension}`;
  await fs.writeFile(path.join(IMAGE_DIR, fileName), Buffer.from(parsed.base64, "base64"));
  return `/api/gallery/image/${fileName}`;
}

async function externalizeImageUrls(value: unknown, pathParts: string[] = []): Promise<{ value: unknown; changed: boolean }> {
  if (Array.isArray(value)) {
    let changed = false;
    const items = await Promise.all(
      value.map(async (item, index) => {
        const result = await externalizeImageUrls(item, [...pathParts, String(index)]);
        changed ||= result.changed;
        return result.value;
      }),
    );
    return { value: items, changed };
  }

  if (!value || typeof value !== "object") {
    return { value, changed: false };
  }

  let changed = false;
  const source = value as JsonRecord;
  const next: JsonRecord = {};
  const id = typeof source.id === "string" ? source.id : pathParts.join("-");

  for (const [key, fieldValue] of Object.entries(source)) {
    if ((key === "imageUrl" || key === "sheetImageUrl") && typeof fieldValue === "string") {
      const externalized = await writeImageAsset(fieldValue, `${id}-${key}`);
      next[key] = externalized;
      changed ||= externalized !== fieldValue;
      continue;
    }

    const result = await externalizeImageUrls(fieldValue, [...pathParts, key]);
    next[key] = result.value;
    changed ||= result.changed;
  }

  return { value: next, changed };
}

async function normalizeGalleryPayload(payload: GalleryStorePayload, updatedAt = payload.updatedAt): Promise<{ payload: GalleryStorePayload; changed: boolean }> {
  const generatedResults = await externalizeImageUrls(
    Array.isArray(payload.generatedResults) ? payload.generatedResults : [],
    ["generatedResults"],
  );
  const draft = await externalizeImageUrls(payload.draft, ["draft"]);

  return {
    payload: {
      theme: payload.theme,
      generatedResults: generatedResults.value as unknown[],
      draft: draft.value,
      updatedAt,
    },
    changed: generatedResults.changed || draft.changed,
  };
}

export function getGalleryImagePath(fileName: string) {
  return path.join(IMAGE_DIR, sanitizeFilePart(path.basename(fileName, path.extname(fileName))) + path.extname(fileName).toLowerCase());
}

export async function readGalleryStore(): Promise<GalleryStorePayload> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as GalleryStorePayload;
    const normalized = await normalizeGalleryPayload(parsed);
    if (normalized.changed) {
      await fs.writeFile(STORE_PATH, `${JSON.stringify(normalized.payload, null, 2)}\n`, "utf8");
    }
    return normalized.payload;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return { generatedResults: [] };
    }
    throw error;
  }
}

export async function writeGalleryStore(payload: GalleryStorePayload) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const normalized = await normalizeGalleryPayload(payload, new Date().toISOString());
  await fs.writeFile(STORE_PATH, `${JSON.stringify(normalized.payload, null, 2)}\n`, "utf8");
  return normalized.payload;
}
