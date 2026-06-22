import { NextResponse } from "next/server";
import { composePromptViaWorker } from "@/lib/codex-worker-client";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = await composePromptViaWorker(payload);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "프롬프트 구성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
