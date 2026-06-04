import { NextResponse } from "next/server";

import { readStyleReferenceLibraryForClient } from "@/lib/style-reference-library";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const library = await readStyleReferenceLibraryForClient();
    return NextResponse.json(library);
  } catch (error) {
    console.error("Style reference library read error:", error);
    const message = error instanceof Error ? error.message : "스타일 참조 라이브러리를 읽지 못했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
