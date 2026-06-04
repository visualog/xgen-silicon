import fs from "node:fs";
import { execFileSync } from "node:child_process";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const page = read("src/app/page.tsx");
const route = read("src/app/api/generate/route.ts");
const client = read("src/lib/codex-worker-client.ts");
const worker = read("scripts/codex-worker.mjs");
const styleNode = read("src/components/nodes/StyleNode.tsx");
const outputNode = read("src/components/nodes/OutputNode.tsx");

const dryRunRaw = execFileSync("node", ["scripts/codex-worker.mjs", "--dry-run-style-reference"], {
  encoding: "utf8",
});
const dryRun = JSON.parse(dryRunRaw);

assert(page.includes("styleReferenceImages: activeStyleReferenceImages"), "page.tsx does not send active style reference images");
assert(page.includes("activeStyleReferenceImages"), "page.tsx does not derive active style reference images");
assert(page.includes("styleReferenceSummary: activeStyleReferenceSummary"), "OutputNode does not receive style reference summary");
assert(route.includes("styleReferenceImages"), "generate route does not forward styleReferenceImages");
assert(client.includes("styleReferenceImages?"), "worker client type does not include styleReferenceImages");
assert(worker.includes("normalizeStyleReferenceImages"), "worker does not normalize styleReferenceImages");
assert(worker.includes("xgen-style-reference"), "worker does not serialize style reference temp files");
assert(worker.includes("ATTACHED STYLE REFERENCES"), "worker instruction does not include attached style references");
assert(worker.includes("Use attached style reference images only for visual style"), "worker lacks style-only guard");
assert(worker.includes("do not copy the style reference image's subject"), "worker lacks content leakage guard");
assert(worker.includes("IMAGE MIX REFERENCES"), "worker image mix behavior is no longer represented");
assert(styleNode.includes("생성에 사용"), "style node does not label active generation style");
assert(styleNode.includes("이미지 필수"), "style node does not show image-required state");
assert(styleNode.includes("handleWeightChange"), "style node does not expose influence controls");
assert(outputNode.includes("스타일 참조 이미지"), "output prompt panel does not show style reference image truthfully");
assert(dryRun.styleReferenceCount === 1, "dry run did not include one style reference");
assert(dryRun.attachedStyleReferenceCount === 1, "dry run did not attach the strong style reference");
assert(dryRun.imageMixCount === 1, "dry run did not preserve image mix reference");
assert(dryRun.attachedImageMixCount === 0, "dry run should make medium image mix text-only by default");
assert(
  typeof dryRun.textOnlyMixGuidance === "string" && dryRun.textOnlyMixGuidance.includes("TEXT-ONLY MIX GUIDANCE"),
  "dry run did not preserve medium image mix as text-only guidance",
);
assert(dryRun.hasStyleOnlyGuard === true, "dry run style-only guard missing");
assert(dryRun.hasImageMixGuard === true, "dry run image mix guard missing");
assert(dryRun.instruction.includes("ATTACHED STYLE REFERENCES"), "dry run missing attached style section");
assert(dryRun.instruction.includes("mode=style-only"), "dry run missing style-only mode");
assert(dryRun.instruction.includes("ATTACHED IMAGE MIX:\n- none"), "dry run should not attach medium image mix");
assert(dryRun.instruction.includes("TEXT-ONLY MIX GUIDANCE"), "dry run missing text-only mix guidance");
assert(dryRun.instruction.includes("assigned roles and influence levels"), "dry run missing image mix requirement");

console.log(JSON.stringify({
  ok: true,
  checks: 28,
  dryRun: {
    styleReferenceCount: dryRun.styleReferenceCount,
    attachedStyleReferenceCount: dryRun.attachedStyleReferenceCount,
    imageMixCount: dryRun.imageMixCount,
    attachedImageMixCount: dryRun.attachedImageMixCount,
    hasStyleOnlyGuard: dryRun.hasStyleOnlyGuard,
    hasImageMixGuard: dryRun.hasImageMixGuard,
  },
}, null, 2));
