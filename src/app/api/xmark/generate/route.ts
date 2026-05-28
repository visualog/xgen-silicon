import { NextRequest, NextResponse } from "next/server";

import { generateViaWorker } from "@/lib/codex-worker-client";
import { saveGeneratedImageFromDataUrl } from "@/lib/gallery-store";

export const runtime = "nodejs";

type XmarkMode = "explore" | "refine" | "usage-test";

type XmarkReference = {
  label?: string;
  role?: string;
  notes?: string;
  imageUrl?: string;
};

type XmarkPayload = {
  mode?: XmarkMode;
  brandName?: string;
  brandDescription?: string;
  audience?: string;
  personality?: string;
  values?: string;
  mustAvoid?: string;
  metaphors?: string;
  memory?: string;
  selectedConcept?: string;
  selectedImage?: string;
  references?: XmarkReference[];
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatReferences(references: XmarkReference[] = []) {
  const rows = references
    .map((reference, index) => {
      const role = clean(reference.role) || "reference";
      const label = clean(reference.label) || `reference ${index + 1}`;
      const notes = clean(reference.notes);
      return `${index + 1}. ${label} (${role})${notes ? `: ${notes}` : ""}`;
    })
    .filter(Boolean);

  if (rows.length === 0) return "No visual references were provided.";
  return rows.join("\n");
}

function buildPrompt(payload: XmarkPayload) {
  const brandName = clean(payload.brandName) || "Untitled brand";
  const brandDescription = clean(payload.brandDescription) || "A modern digital product";
  const audience = clean(payload.audience) || "design-conscious product users";
  const personality = clean(payload.personality) || "precise, memorable, refined";
  const values = clean(payload.values) || "clarity, originality, craft, trust";
  const mustAvoid = clean(payload.mustAvoid) || "generic AI sparkle, robot, brain, camera, brush, pencil, chat bubble, copied reference silhouettes";
  const metaphors = clean(payload.metaphors) || "connected nodes, generated image core, modular mark, reusable visual seed";
  const memory = clean(payload.memory) || "No prior design memory.";
  const referenceSummary = formatReferences(payload.references);
  const selectedConcept = clean(payload.selectedConcept) || "the strongest selected direction";

  const common = `
Brand: ${brandName}
Description: ${brandDescription}
Audience: ${audience}
Personality: ${personality}
Core values: ${values}
Visual metaphors: ${metaphors}
Must avoid: ${mustAvoid}

Brand Memory:
${memory}

Reference principles and labels:
${referenceSummary}

Use any image references only for high-level design principles: simplicity, contrast, geometry, negative space, icon readability, and composition. Do not reproduce a specific logo, silhouette, layout, brand identity, or designer style.
`.trim();

  if (payload.mode === "refine") {
    return `
Create a focused logo refinement sheet for ${brandName}.

${common}

Refine this selected direction: ${selectedConcept}

Preserve the core idea while improving balance, silhouette, negative space, uniqueness, geometric precision, and 24px icon readability.

Output:
A clean 4x3 grid of 12 refined logo mark variations. Black-and-white first. No text unless the mark requires an extremely abstract letterform. No gradients, no 3D, no shadows, no mockups.
`.trim();
  }

  if (payload.mode === "usage-test") {
    return `
Create a logo usage test sheet for ${brandName}.

${common}

Selected direction: ${selectedConcept}

Show one finalized vector-like logo mark in six usage contexts:
1. white mark on black square
2. black mark on white square
3. 24px toolbar icon
4. macOS rounded app icon
5. small watermark on a generated image
6. sidebar navigation icon

Keep the mark simple, bold, geometric, original, and readable at small sizes. No decorative mockup scene. Use a clean product-design presentation sheet.
`.trim();
  }

  return `
Design logo mark concepts for ${brandName}.

${common}

Do not generate a final logo yet. Create a black-and-white exploration sheet of 20 distinct logo mark concepts.

Each concept must explore a genuinely different structure, not minor variations. Explore metaphors such as connected creative nodes, graph flowing into an image, aperture made from modules, spark emerging from a system, modular symbol, image frame assembled from dots, consistency without a literal lock, local workspace orbit, prompt-to-output flow, and reusable visual seed.

Constraints:
- no text
- no literal mascot
- no robot, brain, camera, brush, pencil, chat bubble
- no gradients
- no 3D
- no shadows
- no copied reference silhouettes
- must work as a 24px toolbar icon
- must work as a macOS app icon
- monochrome-first
- bold, geometric, vectorizable

Output:
A clean 5x4 grid of distinct black-and-white logo marks on a neutral background.
`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as XmarkPayload;
    const mode: XmarkMode = payload.mode === "refine" || payload.mode === "usage-test" ? payload.mode : "explore";
    const prompt = buildPrompt({ ...payload, mode });
    const referenceImages = (payload.references || [])
      .filter((reference) => clean(reference.imageUrl))
      .slice(0, 8)
      .map((reference) => ({
        imageUrl: clean(reference.imageUrl),
        role: clean(reference.role) || "style",
        weight: "medium",
        prompt: clean(reference.notes) || clean(reference.label) || "Analyze visual principles only. Do not copy.",
        label: clean(reference.label) || "Reference",
      }));

    if (payload.selectedImage && mode !== "explore") {
      referenceImages.unshift({
        imageUrl: payload.selectedImage,
        role: "composition",
        weight: "high",
        prompt: `Use only as the selected concept direction: ${clean(payload.selectedConcept)}`,
        label: "Selected concept",
      });
    }

    const result = await generateViaWorker({
      prompt: "",
      prebuiltPrompt: prompt,
      ratio: "1:1",
      resolution: "HD",
      imageMixImages: referenceImages,
    });
    const savedImage = await saveGeneratedImageFromDataUrl(result.url, `xmark-${mode}-${payload.brandName || "logo"}`);

    return NextResponse.json({
      mode,
      url: savedImage.imageUrl,
      imagePath: savedImage.imagePath,
      prompt,
      title: `${payload.brandName || "xMark"} ${mode}`,
      createdAt: new Date().toISOString(),
      threadId: result.threadId,
    });
  } catch (error) {
    console.error("xMark generation error:", error);
    const message = error instanceof Error ? error.message : "xMark 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
