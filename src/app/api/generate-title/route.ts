import { NextResponse } from "next/server";
import { generateTitleViaWorker } from "@/lib/codex-worker-client";

export async function POST(req: Request) {
  try {
    const { prompt, englishPrompt, koreanPrompt } = await req.json();

    if (!prompt && !englishPrompt && !koreanPrompt) {
      return NextResponse.json({ title: "새 브랜드 이미지" });
    }

    const data = await generateTitleViaWorker({
      prompt,
      englishPrompt,
      koreanPrompt,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Generate title error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    if (message.includes("Codex worker")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
