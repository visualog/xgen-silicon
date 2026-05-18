// src/lib/ai-provider.ts
// Gemini API 기반 AI Provider — 구조화 JSON 출력 (responseSchema)
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

// 구조화 출력 스키마 (영상의 --output-schema와 동일한 역할)
export interface PromptBuildResult {
  enhancedPrompt: string;
  styleKeywords: string[];
  negativePrompt: string;
  technicalTags: string[];
}

// 해상도 매핑 (SD/HD/4K/8K)
const RESOLUTION_MAP: Record<string, number> = {
  SD: 512,
  HD: 1024,
  "4K": 2048, // Pollinations.ai 최대값 캡핑
  "8K": 2048, // 동일하게 캡핑, 프롬프트에 "ultra high resolution" 추가
};

// Plus X 브랜딩 스타일 — GEMINI.md 스킬과 연동
const BRAND_STYLE_CONTEXT = `
You are an expert prompt engineer for the BrandGen system, specializing in "Plus X" branding illustration style.

STYLE DEFINITION:
- Premium hand-drawn branding illustration
- Slightly irregular, human-like lines (not perfect vector)
- Soft muted pastel color palette, low saturation
- Gentle light source from upper left
- Subtle analog textures (watercolor or crayon)
- Generous negative space, minimalist corporate editorial aesthetic

STRICTLY FORBIDDEN in prompts:
- photorealistic, photography, 3D render
- neon colors, high contrast, bright saturated colors
- complex backgrounds, busy scenes
- text, watermark, logo
`;

export class BrandGenAI {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    return new GoogleGenerativeAI(apiKey);
  }

  /**
   * 한국어 입력을 브랜딩 최적화 영문 프롬프트로 변환 (구조화 JSON 출력)
   * 영상의 --output-schema 방식과 동일한 역할
   */
  static async buildPrompt(params: {
    userInput: string;
    style?: string | null;
    ratio?: string | null;
    resolution?: string | null;
  }): Promise<PromptBuildResult> {
    const genAI = this.getClient();

    const schema = {
      type: SchemaType.OBJECT as const,
      properties: {
        enhancedPrompt: {
          type: SchemaType.STRING as const,
          description: "Main image generation prompt in English, optimized for Plus X branding style",
        },
        styleKeywords: {
          type: SchemaType.ARRAY as const,
          items: { type: SchemaType.STRING as const },
          description: "Array of style keywords to append to the prompt",
        },
        negativePrompt: {
          type: SchemaType.STRING as const,
          description: "Elements to exclude from the image, comma-separated",
        },
        technicalTags: {
          type: SchemaType.ARRAY as const,
          items: { type: SchemaType.STRING as const },
          description: "Technical quality tags like 'high quality', 'professional'",
        },
      },
      required: ["enhancedPrompt", "styleKeywords", "negativePrompt", "technicalTags"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const userInstruction = `
${BRAND_STYLE_CONTEXT}

USER INPUT (Korean): "${params.userInput}"
SELECTED STYLE: ${params.style || "None — use default Plus X style"}
ASPECT RATIO: ${params.ratio || "1:1"}
RESOLUTION: ${params.resolution || "HD"}${params.resolution === "8K" || params.resolution === "4K" ? " (add 'ultra high resolution, incredibly detailed' to technical tags)" : ""}

Convert the Korean input into an optimized English branding illustration prompt.
Return ONLY the JSON object. No explanation.
`;

    const result = await model.generateContent(userInstruction);
    const text = result.response.text();
    return JSON.parse(text) as PromptBuildResult;
  }

  /**
   * 구조화 출력을 조합하여 최종 Pollinations.ai 이미지 URL 생성
   */
  static buildImageUrl(
    buildResult: PromptBuildResult,
    options: { width: number; height: number; seed?: number }
  ): string {
    const { width, height, seed = Math.floor(Math.random() * 1000000) } = options;

    const BASE_STYLE =
      "premium hand-drawn branding illustration, Plus X style, slightly irregular human-like lines, soft muted pastel color palette, gentle light source from upper left, subtle analog textures, generous negative space, minimalist corporate editorial aesthetic";

    const fullPrompt = [
      BASE_STYLE,
      buildResult.enhancedPrompt,
      ...buildResult.styleKeywords,
      ...buildResult.technicalTags,
    ]
      .join(", ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encoded = encodeURIComponent(fullPrompt);
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
  }

  /**
   * 해상도 문자열 → 픽셀 크기 변환
   */
  static getPixelSize(resolution: string, ratio: string): { width: number; height: number } {
    const base = RESOLUTION_MAP[resolution] ?? 1024;

    if (ratio === "16:9") {
      return { width: base, height: Math.round(base * (9 / 16)) };
    } else if (ratio === "9:16") {
      return { width: Math.round(base * (9 / 16)), height: base };
    } else if (ratio === "4:3") {
      return { width: base, height: Math.round(base * (3 / 4)) };
    } else if (ratio === "3:4") {
      return { width: Math.round(base * (3 / 4)), height: base };
    }
    return { width: base, height: base };
  }
}
