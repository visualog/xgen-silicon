import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "style-references", "aurora-prompts");
const itemsDir = path.join(outDir, "items");
const imagesDir = path.join(outDir, "images");
const collectionsDir = path.join(outDir, "collections");
const taxonomyPath = path.join(outDir, "taxonomy.json");
const metadataPath = path.join(outDir, "metadata.json");
const indexPath = path.join(outDir, "index.md");
const validationPath = path.join(outDir, "validation-report.md");

const taxonomy = {
  version: 1,
  updatedAt: "2026-05-29",
  description:
    "Operational taxonomy for Aurora prompt/image style references. Images stay in images/ and classification is managed through JSON metadata and generated Markdown collections.",
  fields: {
    primaryCategory: "Single representative use-case category for filtering and recommendation.",
    styleTags: "Reusable visual-style descriptors.",
    subjectTags: "Subject, material, object, or scene descriptors.",
    productionTags: "Composition, lighting, background, and workflow descriptors.",
    conversionStatus: "Prompt conversion state for service-readiness.",
    reviewStatus: "Whether automatic classification is sufficient or human review is recommended.",
  },
  primaryCategories: {
    beauty: "Skincare, cosmetics, skin, fragrance, beauty product, and beauty macro references.",
    "fashion-editorial": "Fashion, model, accessory, styling, magazine, and editorial campaign references.",
    "product-still-life": "Commercial product, package, bottle, shoe, furniture, and object still-life references.",
    portrait: "Human face, person, character portrait, and identity-focused photographic references.",
    "interior-architecture": "Rooms, furniture, architectural spaces, and spatial design references.",
    "character-3d": "3D character, cute mascot, toy-like, creature, and stylized character references.",
    "object-graphic": "Graphic object, icon, logo, abstract object, and rendered visual asset references.",
    "surreal-concept": "Dreamlike, symbolic, impossible, fantasy, and concept-art references.",
    "landscape-environment": "Nature, terrain, city, sky, mountain, water, and environment references.",
    "pure-style-reference": "Style-reference-only records whose usable direction depends on the saved image.",
  },
  styleTags: [
    "photorealistic",
    "studio-lighting",
    "macro-detail",
    "minimal",
    "cinematic",
    "editorial",
    "luxury",
    "surreal",
    "rendered-3d",
    "reference-image-led",
    "dark-moody",
    "soft-pastel",
    "high-contrast",
    "organic",
    "futuristic",
    "glossy",
  ],
  subjectTags: [
    "skin",
    "serum",
    "perfume",
    "beauty-product",
    "model",
    "face",
    "fashion-accessory",
    "shoe",
    "bottle",
    "furniture",
    "interior",
    "glass",
    "metal",
    "organic-material",
    "flower",
    "robotic-object",
    "animal",
    "landscape",
    "character",
    "abstract-object",
  ],
  productionTags: [
    "close-up",
    "top-view",
    "wide-shot",
    "black-background",
    "white-background",
    "transparent-background",
    "soft-light",
    "dramatic-light",
    "high-detail",
    "commercial-ready",
    "needs-reference-image",
    "single-subject",
    "texture-focused",
  ],
  conversionStatuses: {
    "clean-natural-language": "Original prompt was already mostly model-agnostic and natural language.",
    "converted-from-midjourney": "Model-specific syntax was removed and the usable prompt was rewritten.",
    "style-reference-only": "Prompt depends on the accompanying saved reference image.",
    "needs-human-review": "Converted prompt or classification should be checked before production use.",
  },
  reviewStatuses: {
    "auto-classified": "Classified by deterministic rules with enough textual evidence.",
    "needs-review": "Insufficient or ambiguous text; review image and prompt together before production use.",
  },
};

const categoryOrder = Object.keys(taxonomy.primaryCategories);

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function slugTag(value) {
  return value.toLowerCase().replace(/\s*\/\s*/g, "-").replace(/\s+/g, "-");
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function classifyPrimary(item, text, styleReferenceOnly) {
  if (styleReferenceOnly) return { category: "pure-style-reference", confidence: "low" };
  if (item.categoryLabel === "Beauty" || includesAny(text, [/serum|skincare|cosmetic|makeup|beauty|skin|perfume|fragrance/])) {
    return { category: "beauty", confidence: "high" };
  }
  if (includesAny(text, [/bed|room|interior|architecture|kitchen|chair|sofa|house|building|hotel|linen-covered/])) {
    return { category: "interior-architecture", confidence: "high" };
  }
  if (includesAny(text, [/character|cartoon|mascot|toy|creature|adorable|kawaii|3d-rendered digital/])) {
    return { category: "character-3d", confidence: "high" };
  }
  if (includesAny(text, [/fashion|model|vogue|editorial|accessor|wetsuit|jacket|headphones|mannequin|runway|styling/])) {
    return { category: "fashion-editorial", confidence: "high" };
  }
  if (includesAny(text, [/portrait|face|woman|man|person|figure|freckles|hair|lips|eyes|skin/])) {
    return { category: "portrait", confidence: "medium" };
  }
  if (includesAny(text, [/bottle|jar|shoe|sneaker|product|package|watch|chair|vase|drive|hard drive|gloves|lamp|sculpture|cassette|paper|book|key|glass|champagne|wine/])) {
    return { category: "product-still-life", confidence: "high" };
  }
  if (item.categoryLabel === "Graphic / Object" || includesAny(text, [/icon|logo|graphic|render|abstract object|glass with transparent/])) {
    return { category: "object-graphic", confidence: "medium" };
  }
  if (includesAny(text, [/surreal|dream|fantasy|symbolic|impossible|abstract|floating|galaxy|glowing circle|glyph/])) {
    return { category: "surreal-concept", confidence: "medium" };
  }
  if (includesAny(text, [/mountain|lake|sea|forest|sky|cloud|waterfall|landscape|city|desert|cliff|wave|snowy|grass|beach/])) {
    return { category: "landscape-environment", confidence: "medium" };
  }
  return { category: "object-graphic", confidence: "low" };
}

function buildStyleTags(item, text, styleReferenceOnly) {
  const fromExisting = (item.styleKeywords ?? []).map(slugTag).map((tag) => (tag === "rendered" ? "rendered-3d" : tag));
  const tags = [...fromExisting];
  if (styleReferenceOnly) tags.push("reference-image-led");
  if (includesAny(text, [/photo|photoreal|photograph|camera|lens|shot on/])) tags.push("photorealistic");
  if (includesAny(text, [/studio|softbox|lighting|lit|hdr/i])) tags.push("studio-lighting");
  if (includesAny(text, [/macro|close-up|close up|detail|texture|pores/])) tags.push("macro-detail");
  if (includesAny(text, [/minimal|neutral|clean|white space/])) tags.push("minimal");
  if (includesAny(text, [/cinematic|film|dvd screengrab|dramatic/])) tags.push("cinematic");
  if (includesAny(text, [/editorial|vogue|campaign|fashion/])) tags.push("editorial");
  if (includesAny(text, [/luxury|premium|elegan|refined/])) tags.push("luxury");
  if (includesAny(text, [/surreal|abstract|dream|fantasy|impossible/])) tags.push("surreal");
  if (includesAny(text, [/3d|render|cgi|octane|corona|redshift|cinema4d/])) tags.push("rendered-3d");
  if (includesAny(text, [/black background|dark|shadow|gothic|moody/])) tags.push("dark-moody");
  if (includesAny(text, [/pastel|soft pink|candy|kawaii/])) tags.push("soft-pastel");
  if (includesAny(text, [/high contrast|neon|chrome|glow|vibrant/])) tags.push("high-contrast");
  if (includesAny(text, [/organic|moss|plant|flower|wood|wool|felt/])) tags.push("organic");
  if (includesAny(text, [/futuristic|robotic|cyber|circuit|chrome/])) tags.push("futuristic");
  if (includesAny(text, [/glossy|glass|liquid|reflective|polished/])) tags.push("glossy");
  return uniq(tags).filter((tag) => taxonomy.styleTags.includes(tag));
}

function buildSubjectTags(item, text) {
  const tags = [];
  if (includesAny(text, [/skin|complexion|pores/])) tags.push("skin");
  if (includesAny(text, [/serum|dropper|skincare/])) tags.push("serum");
  if (includesAny(text, [/perfume|fragrance/])) tags.push("perfume");
  if (item.categoryLabel === "Beauty" || includesAny(text, [/cosmetic|beauty|makeup/])) tags.push("beauty-product");
  if (includesAny(text, [/model|fashion model/])) tags.push("model");
  if (includesAny(text, [/face|portrait|eyes|lips|freckles|hair/])) tags.push("face");
  if (includesAny(text, [/accessor|headphones|jacket|wetsuit|gloves|chain/])) tags.push("fashion-accessory");
  if (includesAny(text, [/shoe|sneaker/])) tags.push("shoe");
  if (includesAny(text, [/bottle|jar|vase/])) tags.push("bottle");
  if (includesAny(text, [/chair|sofa|bed|furniture/])) tags.push("furniture");
  if (includesAny(text, [/room|interior|kitchen|architecture|building/])) tags.push("interior");
  if (includesAny(text, [/glass|transparent|crystal|ice/])) tags.push("glass");
  if (includesAny(text, [/metal|chrome|silver|gold|metallic/])) tags.push("metal");
  if (includesAny(text, [/moss|plant|wood|wool|felt|linen|stone|clay|organic/])) tags.push("organic-material");
  if (includesAny(text, [/flower|rose|peony|lotus|petal/])) tags.push("flower");
  if (includesAny(text, [/robot|robotic|circuit|hard drive|mechanical/])) tags.push("robotic-object");
  if (includesAny(text, [/fish|horse|spider|animal|bird|koi/])) tags.push("animal");
  if (includesAny(text, [/mountain|lake|sea|forest|sky|landscape|cloud|waterfall|desert|cliff|wave/])) tags.push("landscape");
  if (includesAny(text, [/character|cartoon|mascot|creature|figure/])) tags.push("character");
  if (includesAny(text, [/abstract|icon|graphic|shape|object/])) tags.push("abstract-object");
  return uniq(tags);
}

function buildProductionTags(item, text, styleReferenceOnly) {
  const tags = ["high-detail", "commercial-ready"];
  if (styleReferenceOnly) tags.push("needs-reference-image");
  if (includesAny(text, [/close-up|close up|macro/])) tags.push("close-up");
  if (includesAny(text, [/top-down|top down|from above|high angle|overhead/])) tags.push("top-view");
  if (includesAny(text, [/wide-angle|wide shot|landscape/])) tags.push("wide-shot");
  if (includesAny(text, [/black background|pitch black|solid black/])) tags.push("black-background");
  if (includesAny(text, [/white background|polar white|solid white/])) tags.push("white-background");
  if (includesAny(text, [/transparent background/])) tags.push("transparent-background");
  if (includesAny(text, [/soft|ambient|diffused|natural light/])) tags.push("soft-light");
  if (includesAny(text, [/dramatic|high contrast|neon|glow|shadow/])) tags.push("dramatic-light");
  if (includesAny(text, [/single|minimal|centered|one variation|one subject/])) tags.push("single-subject");
  if (includesAny(text, [/texture|material|pores|fabric|stone|glass|metal|liquid/])) tags.push("texture-focused");
  return uniq(tags).filter((tag) => taxonomy.productionTags.includes(tag));
}

function conversionStatus(item, styleReferenceOnly, lowConfidence) {
  if (styleReferenceOnly) return "style-reference-only";
  if (lowConfidence) return "needs-human-review";
  if (item.conversionType === "natural-language-cleanup") return "clean-natural-language";
  return "converted-from-midjourney";
}

function classifyItem(item) {
  const text = [
    item.title,
    item.genre,
    item.categoryLabel,
    item.cleanedPrompt,
    item.originalPrompt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const styleReferenceOnly = item.conversionType === "reference-image-style-to-natural-language";
  const { category, confidence } = classifyPrimary(item, text, styleReferenceOnly);
  const styleTags = buildStyleTags(item, text, styleReferenceOnly);
  const subjectTags = buildSubjectTags(item, text);
  const productionTags = buildProductionTags(item, text, styleReferenceOnly);
  const lowConfidence =
    confidence === "low" ||
    styleReferenceOnly ||
    (subjectTags.length === 0 && !["pure-style-reference", "surreal-concept", "landscape-environment"].includes(category));

  return {
    primaryCategory: category,
    styleTags,
    subjectTags,
    productionTags,
    conversionStatus: conversionStatus(item, styleReferenceOnly, lowConfidence),
    reviewStatus: lowConfidence ? "needs-review" : "auto-classified",
  };
}

function itemMarkdown(item) {
  return `# ${item.number}. ${item.title}

![Reference image](../images/${item.imageFile})

## Source

- Source page: ${item.sourcePage}
- Image URL: ${item.imageUrl}
- Tool label: ${item.tool}
- Author: ${item.author || "Unknown"}
- Source ID: ${item.sourceId}
- Source slug: ${item.sourceSlug}
- Category: ${item.categoryLabel || item.genre || item.category}
- Image size: ${item.image.width} x ${item.image.height}

## Operations

- Primary category: ${item.primaryCategory}
- Style tags: ${item.styleTags.join(", ") || "none"}
- Subject tags: ${item.subjectTags.join(", ") || "none"}
- Production tags: ${item.productionTags.join(", ") || "none"}
- Conversion status: ${item.conversionStatus}
- Review status: ${item.reviewStatus}

## Original Prompt

\`\`\`text
${item.originalPrompt}
\`\`\`

## Converted Prompt

\`\`\`text
${item.convertedPrompt}
\`\`\`

## Conversion Notes

- Conversion type: ${item.conversionType}
- ${item.conversionNotes}
`;
}

function tableRows(items) {
  return items
    .map(
      (item) =>
        `| ${item.number} | [![${item.title}](../images/${item.imageFile})](../images/${item.imageFile}) | [${escapePipe(item.title)}](../items/${item.itemFile}) | ${item.categoryLabel || item.genre} | ${item.conversionStatus} | ${[...item.styleTags, ...item.subjectTags, ...item.productionTags].slice(0, 8).join(", ")} | [JSON](../items/${item.jsonFile}) |`,
    )
    .join("\n");
}

function escapePipe(value) {
  return String(value).replace(/\|/g, "\\|");
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countList(items, key) {
  return items.reduce((counts, item) => {
    for (const value of item[key] ?? []) {
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }, {});
}

function countTable(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => `| ${name} | ${count} |`)
    .join("\n");
}

function collectionMarkdown(category, items) {
  return `# ${taxonomy.primaryCategories[category] ? category : "uncategorized"}

${taxonomy.primaryCategories[category] ?? "Items that could not be mapped to a known category."}

- Items: ${items.length}
- Review needed: ${items.filter((item) => item.reviewStatus === "needs-review").length}

| # | Image | Title | Original category | Conversion status | Main tags | Links |
|---|---|---|---|---|---|---|
${tableRows(items)}
`;
}

function indexMarkdown(items, metadata) {
  const primaryCounts = countBy(items, "primaryCategory");
  const conversionCounts = countBy(items, "conversionStatus");
  const reviewCounts = countBy(items, "reviewStatus");
  const styleCounts = countList(items, "styleTags");
  const collectionLinks = categoryOrder
    .filter((category) => primaryCounts[category])
    .map((category) => `- [${category}](collections/${category}.md): ${primaryCounts[category]}`)
    .join("\n");

  return `# Aurora Prompt Style References

Collected from ${metadata.sourceUrl ?? "https://aurora.ai.kr/prompt"} on ${metadata.collectedAt ?? "2026-05-29"}.

This directory is managed as an operational style reference library for image generation search, filtering, recommendation, and prompt reuse. Images remain in \`images/\`; category membership is managed through item JSON metadata and generated collection indexes.

## Summary

- Total items: ${items.length}
- Downloaded images: ${metadata.downloadedImages ?? items.length}
- Converted prompts: ${metadata.convertedPrompts ?? items.length}
- Needs review: ${reviewCounts["needs-review"] ?? 0}
- Source data: ${metadata.cmsChunkUrl ? "Framer CMS chunk referenced by the public prompt page" : "local item JSON"}

## Collections

${collectionLinks}

## Category Counts

| Category | Count |
|---|---:|
${countTable(primaryCounts)}

## Conversion Status Counts

| Status | Count |
|---|---:|
${countTable(conversionCounts)}

## Review Status Counts

| Status | Count |
|---|---:|
${countTable(reviewCounts)}

## Top Style Tags

| Tag | Count |
|---|---:|
${countTable(Object.fromEntries(Object.entries(styleCounts).sort((a, b) => b[1] - a[1]).slice(0, 20)))}

## Operating Rules

- Use \`items/*.json\` as the source of truth for image, prompt, and classification metadata.
- Keep \`originalPrompt\` unchanged for provenance.
- Use \`convertedPrompt\` for service-facing image generation.
- Treat \`primaryCategory\` as the main filter and tags as secondary filters.
- Treat \`productionTags: ["needs-reference-image"]\` as a requirement to pass the saved image with the prompt.
- Review \`reviewStatus: "needs-review"\` before using the item in production recommendation flows.
- Do not duplicate images into category folders; generated collections link back to \`images/\` and \`items/\`.

## Items

| # | Image | Title | Category | Original category | Conversion | Review | Tags |
|---|---|---|---|---|---|---|---|
${items
  .map(
    (item) =>
      `| ${item.number} | [![${item.title}](images/${item.imageFile})](images/${item.imageFile}) | [${escapePipe(item.title)}](items/${item.itemFile}) | ${item.primaryCategory} | ${item.categoryLabel || item.genre} | ${item.conversionStatus} | ${item.reviewStatus} | ${[...item.styleTags, ...item.subjectTags, ...item.productionTags].slice(0, 8).join(", ")} |`,
  )
  .join("\n")}
`;
}

async function validate(items) {
  const errors = [];
  const warnings = [];
  const imageFiles = (await fs.readdir(imagesDir)).filter((file) => !file.startsWith("."));
  const jsonFiles = (await fs.readdir(itemsDir)).filter((file) => file.endsWith(".json"));
  const mdFiles = (await fs.readdir(itemsDir)).filter((file) => file.endsWith(".md"));
  const platformPattern = /--[a-z][\w-]*|\[[^\]]*(?:prompt|prmpt|subject|character|object)[^\]]*\]|https:\/\/s\.mj\.run/i;

  for (const item of items) {
    if (!item.sourceId) errors.push(`${item.jsonFile}: missing sourceId`);
    if (!item.imageFile) errors.push(`${item.jsonFile}: missing imageFile`);
    if (!item.originalPrompt) errors.push(`${item.jsonFile}: missing originalPrompt`);
    if (!item.convertedPrompt) errors.push(`${item.jsonFile}: missing convertedPrompt`);

    try {
      await fs.access(path.join(imagesDir, item.imageFile));
    } catch {
      errors.push(`${item.jsonFile}: missing linked image ${item.imageFile}`);
    }

    const mdPath = path.join(itemsDir, item.itemFile);
    try {
      const markdown = await fs.readFile(mdPath, "utf8");
      if (!markdown.includes(`Source ID: ${item.sourceId}`)) {
        errors.push(`${item.itemFile}: markdown does not include matching sourceId ${item.sourceId}`);
      }
    } catch {
      errors.push(`${item.jsonFile}: missing linked markdown ${item.itemFile}`);
    }

    if (platformPattern.test(item.convertedPrompt)) {
      errors.push(`${item.jsonFile}: convertedPrompt contains model-specific syntax or unresolved placeholder`);
    }

    for (const field of ["primaryCategory", "styleTags", "subjectTags", "productionTags", "conversionStatus", "reviewStatus"]) {
      if (!(field in item)) errors.push(`${item.jsonFile}: missing ${field}`);
    }

    if (!categoryOrder.includes(item.primaryCategory)) {
      errors.push(`${item.jsonFile}: unknown primaryCategory ${item.primaryCategory}`);
    }
  }

  if (items.length !== imageFiles.length) {
    warnings.push(`item count (${items.length}) and image count (${imageFiles.length}) differ`);
  }
  if (items.length !== jsonFiles.length) {
    errors.push(`item count (${items.length}) and JSON count (${jsonFiles.length}) differ`);
  }
  if (items.length !== mdFiles.length) {
    errors.push(`item count (${items.length}) and Markdown count (${mdFiles.length}) differ`);
  }

  return { errors, warnings, imageFiles, jsonFiles, mdFiles };
}

function validationMarkdown(items, result) {
  const primaryCounts = countBy(items, "primaryCategory");
  const conversionCounts = countBy(items, "conversionStatus");
  const reviewCounts = countBy(items, "reviewStatus");
  return `# Aurora Prompt Validation Report

Generated: 2026-05-29

## Result

- Status: ${result.errors.length === 0 ? "pass" : "fail"}
- Items: ${items.length}
- Images: ${result.imageFiles.length}
- JSON files: ${result.jsonFiles.length}
- Markdown files: ${result.mdFiles.length}
- Errors: ${result.errors.length}
- Warnings: ${result.warnings.length}

## Category Counts

| Category | Count |
|---|---:|
${countTable(primaryCounts)}

## Conversion Status Counts

| Status | Count |
|---|---:|
${countTable(conversionCounts)}

## Review Status Counts

| Status | Count |
|---|---:|
${countTable(reviewCounts)}

## Checks

- Each item has \`sourceId\`, \`imageFile\`, \`originalPrompt\`, and \`convertedPrompt\`.
- Each \`imageFile\` exists in \`images/\`.
- Each item Markdown file includes the same \`sourceId\` as its JSON file.
- Each \`convertedPrompt\` is checked for Midjourney/model-specific options, \`s.mj.run\` URLs, and unresolved prompt placeholders.
- Required operational fields are present on every item JSON.

## Errors

${result.errors.length ? result.errors.map((error) => `- ${error}`).join("\n") : "- None"}

## Warnings

${result.warnings.length ? result.warnings.map((warning) => `- ${warning}`).join("\n") : "- None"}
`;
}

async function main() {
  await fs.mkdir(collectionsDir, { recursive: true });
  const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
  const jsonFiles = (await fs.readdir(itemsDir)).filter((file) => file.endsWith(".json")).sort();
  const items = [];

  for (const jsonFile of jsonFiles) {
    const itemPath = path.join(itemsDir, jsonFile);
    const item = JSON.parse(await fs.readFile(itemPath, "utf8"));
    const classified = classifyItem(item);
    const nextItem = { ...item, ...classified };
    await fs.writeFile(itemPath, `${JSON.stringify(nextItem, null, 2)}\n`);
    await fs.writeFile(path.join(itemsDir, nextItem.itemFile), itemMarkdown(nextItem));
    items.push(nextItem);
  }

  const groups = Object.fromEntries(categoryOrder.map((category) => [category, []]));
  for (const item of items) groups[item.primaryCategory].push(item);

  for (const category of categoryOrder) {
    const collectionPath = path.join(collectionsDir, `${category}.md`);
    await fs.writeFile(collectionPath, collectionMarkdown(category, groups[category]));
  }

  const nextMetadata = {
    ...metadata,
    organizedAt: "2026-05-29",
    taxonomyFile: "taxonomy.json",
    collectionsDir: "collections",
    categoryCounts: countBy(items, "primaryCategory"),
    conversionStatusCounts: countBy(items, "conversionStatus"),
    reviewStatusCounts: countBy(items, "reviewStatus"),
    styleTagCounts: countList(items, "styleTags"),
    items: items.map((item) => ({
      number: item.number,
      title: item.title,
      sourceId: item.sourceId,
      itemFile: item.itemFile,
      jsonFile: item.jsonFile,
      imageFile: item.imageFile,
      primaryCategory: item.primaryCategory,
      styleTags: item.styleTags,
      subjectTags: item.subjectTags,
      productionTags: item.productionTags,
      conversionStatus: item.conversionStatus,
      reviewStatus: item.reviewStatus,
      originalPrompt: item.originalPrompt,
      convertedPrompt: item.convertedPrompt,
      conversionType: item.conversionType,
    })),
  };

  await fs.writeFile(taxonomyPath, `${JSON.stringify(taxonomy, null, 2)}\n`);
  await fs.writeFile(metadataPath, `${JSON.stringify(nextMetadata, null, 2)}\n`);
  await fs.writeFile(indexPath, indexMarkdown(items, nextMetadata));

  const validation = await validate(items);
  await fs.writeFile(validationPath, validationMarkdown(items, validation));

  if (validation.errors.length) {
    throw new Error(`Validation failed with ${validation.errors.length} errors. See ${validationPath}`);
  }

  console.log(
    JSON.stringify(
      {
        items: items.length,
        collections: categoryOrder.length,
        needsReview: nextMetadata.reviewStatusCounts["needs-review"] ?? 0,
        categoryCounts: nextMetadata.categoryCounts,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
