import fs from "node:fs/promises";
import path from "node:path";

import { getGalleryImagePath } from "@/lib/gallery-store";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function decodeSourcePath(value: string | null) {
  if (!value) return null;
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const sourcePath = decodeSourcePath(new URL(request.url).searchParams.get("source"));
  const filePath =
    sourcePath && path.basename(sourcePath) === path.basename(file)
      ? sourcePath
      : getGalleryImagePath(file);

  try {
    const buffer = await fs.readFile(filePath);
    return new Response(buffer, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": MIME_BY_EXTENSION[path.extname(filePath)] || "application/octet-stream",
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return Response.json({ error: "이미지를 찾지 못했습니다." }, { status: 404 });
    }
    return Response.json({ error: "이미지를 읽지 못했습니다." }, { status: 500 });
  }
}
