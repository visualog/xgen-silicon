// src/app/api/generate/route.ts
// Codex worker 이미지 생성 파이프라인
import { NextRequest, NextResponse } from "next/server";
import { generateViaWorker } from "@/lib/codex-worker-client";
import { saveGeneratedImageFromDataUrl } from "@/lib/gallery-store";

export const runtime = "nodejs";

function resolveImageInputUrl(imageUrl: string, origin: string) {
  const trimmed = imageUrl.trim();
  if (!trimmed.startsWith("/")) return imageUrl;
  return new URL(trimmed, origin).toString();
}

function resolveImageInputList(items: unknown, origin: string): string[] | undefined {
  if (!Array.isArray(items)) return undefined;
  return items
    .filter((item): item is string => typeof item === "string")
    .map((item) => resolveImageInputUrl(item, origin));
}

function resolveImageObjectList<T extends { imageUrl?: unknown }>(items: unknown, origin: string): T[] | undefined {
  if (!Array.isArray(items)) return undefined;
  return items.map((item) => {
    if (!item || typeof item !== "object" || !("imageUrl" in item)) return item;
    return {
      ...item,
      imageUrl:
        typeof (item as { imageUrl?: unknown }).imageUrl === "string"
          ? resolveImageInputUrl((item as { imageUrl: string }).imageUrl, origin)
          : (item as { imageUrl?: unknown }).imageUrl,
    };
  }) as T[];
}

export async function POST(req: NextRequest) {
  try {
    const requestOrigin = req.nextUrl.origin;
    const {
      prompt,
      style,
      characterReference,
      objectReference,
      ratio = "1:1",
      resolution = "HD",
      composition,
      background,
      constraints,
      mood,
      palette,
      cameraAngle,
      objectAngle,
      lighting,
      gesture,
      propsPrompt,
      detailLevel,
      prebuiltPrompt,
      elementSheetImages,
      styleReferenceImages,
      imageMixImages,
    } = await req.json();

    if (!prompt && !style && !prebuiltPrompt && (!Array.isArray(styleReferenceImages) || styleReferenceImages.length === 0)) {
      return NextResponse.json({ error: "프롬프트 또는 스타일이 필요합니다." }, { status: 400 });
    }

    const result = await generateViaWorker({
      prompt,
      style,
      characterReference,
      objectReference,
      ratio,
      resolution,
      composition,
      background,
      constraints,
      mood,
      palette,
      cameraAngle,
      objectAngle,
      lighting,
      gesture,
      propsPrompt,
      detailLevel,
      prebuiltPrompt,
      elementSheetImages: resolveImageInputList(elementSheetImages, requestOrigin),
      styleReferenceImages: resolveImageObjectList(styleReferenceImages, requestOrigin),
      imageMixImages: resolveImageObjectList(imageMixImages, requestOrigin),
    });

    const savedImage = await saveGeneratedImageFromDataUrl(result.url, result.title);

    console.log("✅ 이미지 생성 완료!");
    return NextResponse.json({
      url: savedImage.imageUrl,
      threadId: result.threadId,
      filePath: result.filePath,
      imagePath: savedImage.imagePath,
      title: result.title,
      englishPrompt: result.englishPrompt,
      koreanPrompt: result.koreanPrompt,
      tokenUsage: result.tokenUsage ?? null,
      tokenUsageBreakdown: result.tokenUsageBreakdown ?? [],
    });
  } catch (error: unknown) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    const errorMessage =
      error instanceof Error && error.name === "TimeoutError"
        ? "이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요."
        : message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
