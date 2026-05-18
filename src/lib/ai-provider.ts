// src/lib/ai-provider.ts
// Gemini CLI 백엔드 방식 — 영상의 Codex CLI 접근법과 동일
// child_process.spawn으로 gemini CLI를 비대화형(headless) 모드로 실행
import { spawn } from "child_process";
import fs from "fs";


export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

export interface PromptBuildResult {
  enhancedPrompt: string;
  styleKeywords: string[];
  negativePrompt: string;
  technicalTags: string[];
}

// 해상도 매핑 (SD/HD/4K/8K → 픽셀)
const RESOLUTION_MAP: Record<string, number> = {
  SD: 512,
  HD: 1024,
  "4K": 2048,
  "8K": 2048,
};

// Plus X 브랜딩 스타일 컨텍스트 (GEMINI.md 스킬과 연동)
const BRAND_STYLE_CONTEXT = `
You are a brand design prompt engineer for BrandGen, specializing in "Plus X" illustration style.

STYLE RULES:
- Premium hand-drawn branding illustration, slightly irregular human-like lines
- Soft muted pastel color palette, gentle light source from upper left
- Subtle analog textures (watercolor/crayon), generous negative space
- Minimalist corporate editorial aesthetic

FORBIDDEN: photorealistic, 3D render, neon colors, high contrast, text, watermark, logo, complex backgrounds
`;

/**
 * Gemini CLI를 child_process로 실행 (영상의 codex exec 방식과 동일)
 * stderr는 분리하여 warnings/노이즈 필터링
 * stdout의 JSON에서 response 필드만 추출
 */
async function runGeminiCLI(prompt: string, timeoutMs = 60000): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "/usr/local/bin/gemini", // 절대 경로 사용 (Next.js 서버 PATH에 의존 안 함)
      [
        "--prompt", prompt,
        "--output-format", "json",  // 구조화 JSON 출력 (영상의 --output-schema 역할)
        "--yolo",                    // 자동 승인 (비대화형)
      ],
      {
        env: {
          ...process.env,
          TERM: "xterm-256color",   // 터미널 경고 억제
        },
      }
    );

    let stdout = "";
    let timeoutHandle: NodeJS.Timeout;

    proc.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    // stderr는 무시 (warnings, MCP 오류, Skill 충돌 메시지 필터링)
    proc.stderr.on("data", () => {});

    timeoutHandle = setTimeout(() => {
      proc.kill();
      reject(new Error("Gemini CLI 응답 시간 초과"));
    }, timeoutMs);

    proc.on("close", (code: number | null) => {
      clearTimeout(timeoutHandle);
      if (code === 0 && stdout) {
        try {
          // CLI JSON 출력 구조: { session_id, response, stats }
          const parsed = JSON.parse(stdout);
          resolve(parsed.response ?? stdout);
        } catch {
          resolve(stdout.trim());
        }
      } else {
        reject(new Error(`Gemini CLI 실행 실패 (code: ${code})`));
      }
    });

    proc.on("error", (err: Error) => {
      clearTimeout(timeoutHandle);
      reject(new Error(`Gemini CLI 실행 오류: ${err.message}`));
    });
  });
}

export class BrandGenAI {
  /**
   * 한국어 입력 → 구조화 JSON 프롬프트 빌드
   * 영상의 에이전트 백엔드 패턴: CLI가 작업을 수행하고 앱이 결과를 소비
   */
  static async buildPrompt(params: {
    userInput: string;
    style?: string | null;
    ratio?: string | null;
    resolution?: string | null;
  }): Promise<PromptBuildResult> {
    const instruction = `
${BRAND_STYLE_CONTEXT}

USER INPUT (Korean): "${params.userInput}"
SELECTED STYLE: ${params.style || "Default Plus X branding style"}
ASPECT RATIO: ${params.ratio || "1:1"}
RESOLUTION: ${params.resolution || "HD"}${
      params.resolution === "8K" || params.resolution === "4K"
        ? " — add 'ultra high resolution, incredibly detailed' to technicalTags"
        : ""
    }

Return ONLY a valid JSON object with this exact structure, no other text:
{
  "enhancedPrompt": "...",
  "styleKeywords": ["...", "..."],
  "negativePrompt": "...",
  "technicalTags": ["...", "..."]
}
`;

    const raw = await runGeminiCLI(instruction);

    // JSON 파싱 (응답에 마크다운 코드블록이 포함된 경우 제거)
    const cleaned = raw
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      return JSON.parse(cleaned) as PromptBuildResult;
    } catch {
      // 파싱 실패 시 기본값으로 fallback
      console.error("JSON 파싱 실패, raw output:", raw);
      return {
        enhancedPrompt: params.userInput,
        styleKeywords: ["hand-drawn", "branding illustration", "Plus X style"],
        negativePrompt: "photorealistic, 3D render, neon colors, text, watermark",
        technicalTags: ["high quality", "professional"],
      };
    }
  }

  /**
   * 구조화 출력 기반 Pollinations.ai 이미지 URL 생성
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

    if (ratio === "16:9") return { width: base, height: Math.round(base * (9 / 16)) };
    if (ratio === "9:16") return { width: Math.round(base * (9 / 16)), height: base };
    if (ratio === "4:3")  return { width: base, height: Math.round(base * (3 / 4)) };
    if (ratio === "3:4")  return { width: Math.round(base * (3 / 4)), height: base };
    return { width: base, height: base };
  }

  /**
   * Gemini CLI의 Nano Banana(/generate)를 통해 이미지 생성
   * 생성 성공 시 base64 data URL을 반환, 실패 시 null 반환
   */
  static async generateWithNanoBanana(prompt: string): Promise<string | null> {
    try {
      console.log("🍌 [Nano Banana] 이미지 생성 시작...");
      // 따옴표 및 줄바꿈 이스케이프 처리
      const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, " ");
      const cliPrompt = `/generate "${escapedPrompt}" --no-preview`;
      
      console.log(`🍌 [Nano Banana] CLI 실행 프롬프트: ${cliPrompt}`);
      const rawResponse = await runGeminiCLI(cliPrompt, 90000); // 90초 타임아웃
      
      console.log("🍌 [Nano Banana] CLI 응답 수신 완료!");
      
      // 파일 경로 추출 (nanobanana-output 폴더 내의 png, jpg, jpeg 파일 검색)
      const fileRegex = /([^\s\n\r\t•"']+\/nanobanana-output\/[^\s\n\r\t•"']+\.(?:png|jpg|jpeg))/gi;
      const matches = rawResponse.match(fileRegex);
      
      if (matches && matches.length > 0) {
        const filePath = matches[0].trim();
        console.log(`🍌 [Nano Banana] 생성된 이미지 파일 감지됨: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const base64 = fileBuffer.toString("base64");
          return `data:image/png;base64,${base64}`;
        } else {
          console.warn(`🍌 [Nano Banana] 파일이 경로에 존재하지 않습니다: ${filePath}`);
        }
      } else {
        console.warn("🍌 [Nano Banana] 응답에서 생성된 이미지 파일 경로를 찾지 못했습니다.", rawResponse);
      }
      return null;
    } catch (error) {
      console.error("🍌 [Nano Banana] 생성 실패:", error);
      return null;
    }
  }
}

