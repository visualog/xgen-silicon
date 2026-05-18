// src/app/api/analyze-style/route.ts
// Gemini CLI로 이미지 스타일 분석 — @파일경로 문법 활용
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

function runGeminiCLI(prompt: string, timeoutMs = 30000): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "gemini",
      ["--prompt", prompt, "--output-format", "json", "--yolo"],
      { env: { ...process.env, TERM: "xterm-256color" } }
    );

    let stdout = "";
    const timer = setTimeout(() => { proc.kill(); reject(new Error("시간 초과")); }, timeoutMs);

    proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on("data", () => {});
    proc.on("close", (code: number | null) => {
      clearTimeout(timer);
      if (code === 0 && stdout) {
        try { resolve(JSON.parse(stdout).response ?? stdout); }
        catch { resolve(stdout.trim()); }
      } else {
        reject(new Error(`Gemini CLI 실패 (code: ${code})`));
      }
    });
    proc.on("error", (e: Error) => { clearTimeout(timer); reject(e); });
  });
}

export async function POST(req: NextRequest) {
  let tmpFile: string | null = null;

  try {
    const { imageBase64, mimeType = "image/jpeg" } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "이미지가 필요합니다." }, { status: 400 });
    }

    // base64 → 임시 파일 저장
    const ext = mimeType.split("/")[1]?.split(";")[0] || "jpg";
    tmpFile = path.join(os.tmpdir(), `brandgen-style-${Date.now()}.${ext}`);
    const buffer = Buffer.from(imageBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
    fs.writeFileSync(tmpFile, buffer);

    // Gemini CLI로 이미지 분석
    const prompt = `You are a brand design expert. Analyze the visual style of this image and describe it as a concise image generation prompt.

Focus on:
- Drawing technique (e.g., hand-drawn, watercolor, line art, digital illustration)
- Color palette (e.g., muted pastels, monochrome, warm tones)
- Texture and mood (e.g., soft, rough, minimalist, detailed)
- Composition style

Return ONLY a single English prompt string (2-4 sentences max), no JSON, no bullet points, no explanation.

@${tmpFile}`;

    const raw = await runGeminiCLI(prompt, 30000);

    // 마크다운 강조 제거 및 정리
    const suggestedPrompt = raw
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\n+/g, " ")
      .trim();

    return NextResponse.json({ suggestedPrompt });
  } catch (error: any) {
    console.error("Style analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // 임시 파일 정리
    if (tmpFile) {
      try { fs.unlinkSync(tmpFile); } catch {}
    }
  }
}
