import { NextRequest, NextResponse } from "next/server";
import { generateElementSheetViaWorker } from "@/lib/codex-worker-client";

export async function POST(req: NextRequest) {
  try {
    const { element, sourceImage, sourcePrompt = "", style = "" } = await req.json();
    const result = await generateElementSheetViaWorker({ element, sourceImage, sourcePrompt, style });
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Element sheet generation error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
