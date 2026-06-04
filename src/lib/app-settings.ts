import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type AppSettings = {
  outputDirectory?: string;
};

export function getDefaultDataDir() {
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "xGen", "data");
  }
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || os.homedir(), "xGen", "data");
  }
  return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), "xGen", "data");
}

export function getDataDir() {
  return process.env.BRANDGEN_DATA_DIR || getDefaultDataDir();
}

export function getDefaultOutputDirectory() {
  return path.join(os.homedir(), "Pictures", "xGen");
}

const SETTINGS_PATH = path.join(/* turbopackIgnore: true */ getDataDir(), "settings.json");

export async function readAppSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf8");
    const parsed = JSON.parse(raw) as AppSettings;
    return {
      outputDirectory: typeof parsed.outputDirectory === "string" ? parsed.outputDirectory : undefined,
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export async function writeAppSettings(settings: AppSettings): Promise<AppSettings> {
  await fs.mkdir(getDataDir(), { recursive: true });
  const normalized: AppSettings = {
    outputDirectory: settings.outputDirectory?.trim() || undefined,
  };
  await fs.writeFile(SETTINGS_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

export async function getOutputDirectory() {
  const settings = await readAppSettings();
  return settings.outputDirectory || getDefaultOutputDirectory();
}
