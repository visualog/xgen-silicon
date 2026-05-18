// src/app/api/generate/route.ts
// 이미지 생성 파이프라인 — translate에서 이미 생성된 프롬프트 재사용
import { NextRequest, NextResponse } from "next/server";
import { BrandGenAI } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      style,
      ratio = "1:1",
      resolution = "HD",
      // translate API에서 이미 생성된 영문 프롬프트가 있으면 재사용 (Gemini CLI 이중 호출 방지)
      prebuiltPrompt,
    } = await req.json();

    if (!prompt && !style && !prebuiltPrompt) {
      return NextResponse.json({ error: "프롬프트 또는 스타일이 필요합니다." }, { status: 400 });
    }

    const { width, height } = BrandGenAI.getPixelSize(resolution, ratio);
    console.log(`📐 이미지 크기: ${width}x${height} (${resolution}, ${ratio})`);

    let imageUrl: string;

    if (prebuiltPrompt) {
      // translate 결과 재사용 — Gemini CLI 추가 호출 없음
      console.log("✅ 기존 프롬프트 재사용:", prebuiltPrompt.slice(0, 80) + "...");
      const fullPrompt = [
        "premium hand-drawn branding illustration, Plus X style, slightly irregular human-like lines, soft muted pastel color palette, gentle light source from upper left, subtle analog textures, generous negative space, minimalist corporate editorial aesthetic",
        prebuiltPrompt,
      ].join(", ").replace(/\n/g, " ").trim();

      const encoded = encodeURIComponent(fullPrompt);
      const seed = Math.floor(Math.random() * 1000000);
      imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
    } else {
      // 프롬프트 없는 경우에만 Gemini CLI 호출
      console.log("🤖 Gemini로 프롬프트 빌드 중...");
      const buildResult = await BrandGenAI.buildPrompt({
        userInput: prompt || style || "",
        style,
        ratio,
        resolution,
      });
      console.log("✅ 구조화 프롬프트:", buildResult);
      imageUrl = BrandGenAI.buildImageUrl(buildResult, { width, height });
    }

    console.log("🎨 이미지 생성 URL:", imageUrl.slice(0, 100) + "...");

    // Pollinations.ai에서 이미지 가져오기
    console.log("⏳ Pollinations.ai에서 이미지 가져오는 중...");
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(90000),
    });

    if (!response.ok) {
      console.error("Pollinations 오류:", response.status, response.statusText);
      throw new Error(
        `AI 서버가 응답하지 않습니다 (상태: ${response.status}). 잠시 후 다시 시도해 주세요.`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log("✅ 이미지 생성 완료!");
    return NextResponse.json({ url: dataUrl });
  } catch (error: any) {
    console.error("Generation error:", error);
    const errorMessage =
      error.name === "TimeoutError"
        ? "이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요."
        : error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
