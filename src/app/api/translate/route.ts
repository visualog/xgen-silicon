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

    // Gemini API 키 미설정 시 명확한 메시지
    if (error.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "Gemini API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
