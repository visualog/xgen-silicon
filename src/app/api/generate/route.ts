// src/app/api/generate/route.ts
// Gemini 구조화 출력 기반 이미지 생성 파이프라인
import { NextRequest, NextResponse } from "next/server";
import { BrandGenAI } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      style,
      customStyle,
      ratio = "1:1",
      resolution = "HD",
    } = await req.json();

    if (!prompt && !style) {
      return NextResponse.json({ error: "프롬프트 또는 스타일이 필요합니다." }, { status: 400 });
    }

    // Step 1: Gemini로 구조화 프롬프트 빌드 (영상의 에이전트 백엔드 역할)
    console.log("🤖 Gemini로 프롬프트 빌드 중...");
    const buildResult = await BrandGenAI.buildPrompt({
      userInput: prompt || style || "",
      style: customStyle ? "an image reference style provided by user" : style,
      ratio,
      resolution,
    });
    console.log("✅ 구조화 프롬프트:", buildResult);

    // Step 2: 픽셀 크기 계산 (4K/8K는 2048로 캡핑)
    const { width, height } = BrandGenAI.getPixelSize(resolution, ratio);
    console.log(`📐 이미지 크기: ${width}x${height} (${resolution}, ${ratio})`);

    // Step 3: Pollinations.ai URL 생성
    const imageUrl = BrandGenAI.buildImageUrl(buildResult, { width, height });
    console.log("🎨 이미지 생성 URL:", imageUrl);

    // Step 4: 이미지 프록시 (CORS 우회)
    console.log("⏳ Pollinations.ai에서 이미지 가져오는 중...");
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(90000), // 90초 타임아웃
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
    return NextResponse.json({
      url: dataUrl,
      // 사용된 프롬프트 정보도 반환 (투명성)
      meta: {
        enhancedPrompt: buildResult.enhancedPrompt,
        styleKeywords: buildResult.styleKeywords,
        resolution: `${width}x${height}`,
      },
    });
  } catch (error: any) {
    console.error("Generation error:", error);

    const errorMessage =
      error.name === "TimeoutError"
        ? "이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요."
        : error.message?.includes("GEMINI_API_KEY")
        ? "Gemini API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요."
        : error.message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
