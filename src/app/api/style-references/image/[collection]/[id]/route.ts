import fs from "node:fs/promises";

import { resolveStyleReferenceImage } from "@/lib/style-reference-library";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params;
  const resolved = await resolveStyleReferenceImage(collection, id);
  if (!resolved) {
    return Response.json({ error: "스타일 참조 이미지를 찾지 못했습니다." }, { status: 404 });
  }

  try {
    const buffer = await fs.readFile(resolved.imagePath);
    return new Response(buffer, {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "Content-Type": resolved.contentType,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return Response.json({ error: "스타일 참조 이미지를 찾지 못했습니다." }, { status: 404 });
    }
    return Response.json({ error: "스타일 참조 이미지를 읽지 못했습니다." }, { status: 500 });
  }
}
