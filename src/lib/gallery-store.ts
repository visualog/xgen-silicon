import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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

export async function readGalleryStore(): Promise<GalleryStorePayload> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as GalleryStorePayload;
    return {
      theme: parsed.theme,
      generatedResults: Array.isArray(parsed.generatedResults) ? parsed.generatedResults : [],
      draft: parsed.draft,
      updatedAt: parsed.updatedAt,
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return { generatedResults: [] };
    }
    throw error;
  }
}

export async function writeGalleryStore(payload: GalleryStorePayload) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const normalized: GalleryStorePayload = {
    theme: payload.theme,
    generatedResults: Array.isArray(payload.generatedResults) ? payload.generatedResults : [],
    draft: payload.draft,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(STORE_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}
