import { NextResponse } from "next/server";
import { translateKoreanViaWorker } from "@/lib/codex-worker-client";

export async function POST(req: Request) {
  try {
    const { englishPrompt } = await req.json();

    if (!englishPrompt || !String(englishPrompt).trim()) {
      return NextResponse.json({ koreanPrompt: "" });
    }

    const data = await translateKoreanViaWorker({ englishPrompt: String(englishPrompt) });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Translate Korean error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    if (message.includes("Codex worker")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
