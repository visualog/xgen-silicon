import { NextRequest, NextResponse } from "next/server";

import { getDefaultOutputDirectory, readAppSettings, writeAppSettings } from "@/lib/app-settings";

export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await readAppSettings();
    return NextResponse.json({
      outputDirectory: settings.outputDirectory || getDefaultOutputDirectory(),
      isDefaultOutputDirectory: !settings.outputDirectory,
    });
  } catch (error) {
    console.error("Settings read error:", error);
    return NextResponse.json({ error: "설정을 읽지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as { outputDirectory?: string | null };
    const settings = await writeAppSettings({
      outputDirectory: payload.outputDirectory?.trim() || undefined,
    });
    return NextResponse.json({
      outputDirectory: settings.outputDirectory || getDefaultOutputDirectory(),
      isDefaultOutputDirectory: !settings.outputDirectory,
    });
  } catch (error) {
    console.error("Settings write error:", error);
    return NextResponse.json({ error: "설정을 저장하지 못했습니다." }, { status: 500 });
  }
}
