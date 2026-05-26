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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const filePath = getGalleryImagePath(file);

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
