import fs from "node:fs/promises";
import path from "node:path";

import { getDataDir, getOutputDirectory } from "@/lib/app-settings";

type JsonRecord = Record<string, unknown>;

export type GalleryStorePayload = {
  theme?: "light" | "dark";
  generatedResults?: unknown[];
  draft?: unknown;
  updatedAt?: string;
};

const DATA_DIR = getDataDir();
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

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function getTimestampFilePart(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "_",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

async function getUniqueFilePath(directory: string, fileBaseName: string, extension: string) {
  const safeBaseName = sanitizeFilePart(fileBaseName);
  const safeExtension = extension.startsWith(".") ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
  for (let index = 0; index < 1000; index += 1) {
    const suffix = index === 0 ? "" : `-${index + 1}`;
    const fileName = `${safeBaseName}${suffix}${safeExtension}`;
    const filePath = path.join(/* turbopackIgnore: true */ directory, fileName);
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        return { fileName, filePath };
      }
      throw error;
    }
  }
  throw new Error("저장할 이미지 파일명을 만들지 못했습니다.");
}

function getGalleryImageUrl(fileName: string, filePath: string) {
  return `/api/gallery/image/${encodeURIComponent(fileName)}?source=${base64UrlEncode(filePath)}`;
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
  if (!parsed) return { imageUrl: dataUrl };

  const outputDirectory = await getOutputDirectory();
  await fs.mkdir(outputDirectory, { recursive: true });
  const fileBase = fileBaseName.includes("_") ? fileBaseName : `${getTimestampFilePart()}_${fileBaseName}`;
  const { fileName, filePath } = await getUniqueFilePath(outputDirectory, fileBase, parsed.extension);
  await fs.writeFile(filePath, Buffer.from(parsed.base64, "base64"));
  return { imageUrl: getGalleryImageUrl(fileName, filePath), imagePath: filePath };
}

export async function saveGeneratedImageFromDataUrl(dataUrl: string, title?: string) {
  return writeImageAsset(dataUrl, `${getTimestampFilePart()}_${title?.trim() || "xgen-image"}`);
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
    if ((key === "imagePath" || key === "sheetImagePath") && typeof next[key] === "string") {
      changed ||= next[key] !== fieldValue;
      continue;
    }

    if ((key === "imageUrl" || key === "sheetImageUrl") && typeof fieldValue === "string") {
      const externalized = await writeImageAsset(fieldValue, `${id}-${key}`);
      next[key] = externalized.imageUrl;
      if (externalized.imagePath) {
        next[key === "sheetImageUrl" ? "sheetImagePath" : "imagePath"] = externalized.imagePath;
      }
      changed ||= externalized.imageUrl !== fieldValue || Boolean(externalized.imagePath);
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
  return path.join(
    /* turbopackIgnore: true */ IMAGE_DIR,
    sanitizeFilePart(path.basename(fileName, path.extname(fileName))) + path.extname(fileName).toLowerCase(),
  );
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
