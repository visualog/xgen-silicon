// src/app/api/translate/route.ts
// Ollama → Gemini API 전환: 구조화 JSON 출력으로 번역 + 프롬프트 강화 통합
import { NextResponse } from "next/server";
import { BrandGenAI } from "@/lib/ai-provider";

export async function POST(req: Request) {
  try {
    const { prompt, style, ratio, resolution } = await req.json();

    // 아무것도 연결되지 않은 경우 빈 응답
    if (!prompt && !style && !ratio && !resolution) {
      return NextResponse.json({ englishPrompt: "" });
    }

    // Gemini 구조화 출력으로 프롬프트 빌드
    const result = await BrandGenAI.buildPrompt({
      userInput: prompt || "",
      style,
      ratio,
      resolution,
    });

    // OutputNode에 표시할 영문 프롬프트 조합
    const parts: string[] = [];

    if (result.enhancedPrompt) parts.push(result.enhancedPrompt);
    if (result.styleKeywords?.length) parts.push(result.styleKeywords.join(", "));
    if (result.technicalTags?.length) parts.push(result.technicalTags.join(", "));

    const englishPrompt = parts.join(". ");

    return NextResponse.json({
      englishPrompt,
      // 구조화 데이터도 함께 반환 (향후 확장성)
      structured: result,
    });
  } catch (error: any) {
    console.error("Translate error:", error);

    // Gemini CLI 미설치 시 명확한 메시지
    if (error.message?.includes("Gemini CLI")) {
      return NextResponse.json(
        { error: "Gemini CLI가 설치되어 있지 않거나 실행할 수 없습니다. 터미널에서 'gemini --version'을 확인하세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
