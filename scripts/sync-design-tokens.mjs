import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const designDir = path.join(rootDir, "design-md");
const tokensPath = path.join(designDir, "tokens.json");
const variablesPath = path.join(designDir, "variables.css");
const themePath = path.join(designDir, "theme.css");

if (process.env.DESIGN_MD_ALLOW_SYNC !== "1") {
  console.error(
    "design-md token sync is archived. Set DESIGN_MD_ALLOW_SYNC=1 only for historical export work, not app runtime styling."
  );
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

function formatFont(value) {
  if (!value) return null;
  return `'${value}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
}

function addTokenLines(lines, group, prefix, options = {}) {
  const entries = Object.entries(tokens[group] ?? {});
  for (const [key, token] of entries) {
    if (!token || !("$value" in token)) continue;
    const cssName = options.name ? options.name(key) : `--${prefix}-${key}`;
    const value = options.value ? options.value(token.$value, key, token) : token.$value;
    lines.push(`  ${cssName}: ${value};`);
  }
}

function addSemanticAliasLines(lines) {
  lines.push("", "  /* Semantic Aliases */");

  const colorAliases = {
    "ui-ink-primary": "color-midnight-ink",
    "ui-ink-secondary": "color-graphite",
    "ui-ink-tertiary": "color-steel-gray",
    "ui-ink-muted": "color-silver-mist",
    "ui-ink-strong": "color-jet-black",
    "ui-ink-link": "color-deep-gray",
    "ui-ink-inverse": "color-cloud-white",
    "ui-border-subtle": "color-faded-gray",
    "ui-surface-white": "color-cloud-white",
    "ui-surface-page": "color-canvas-white",
    "ui-surface-card": "color-whisper-gray",
    "ui-accent-magenta": "color-vibrant-magenta",
    "ui-accent-ember": "color-ember-glow",
  };
  for (const [alias, tokenName] of Object.entries(colorAliases)) {
    lines.push(`  --${alias}: var(--${tokenName});`);
  }

  for (const key of Object.keys(tokens.spacing ?? {})) {
    const tokenName = key === "unit" ? "spacing-unit" : `spacing-${key}`;
    lines.push(`  --ui-space-${key}: var(--${tokenName});`);
  }
  lines.push("  --ui-space-10: calc(var(--ui-space-unit) * 2.5);");
  lines.push("  --ui-space-18: calc(var(--ui-space-unit) * 4.5);");
  lines.push("  --ui-space-56: calc(var(--ui-space-unit) * 14);");

  for (const key of Object.keys(tokens.radius ?? {})) {
    lines.push(`  --ui-radius-${key}: var(--radius-${key});`);
  }
  lines.push("  --ui-radius-card: var(--radius-cards);");
  lines.push("  --ui-radius-pill: var(--radius-full-5);");

  for (const key of Object.keys(tokens.shadow ?? {})) {
    lines.push(`  --ui-shadow-${key}: var(--shadow-${key});`);
  }
  lines.push("  --ui-shadow-node: var(--shadow-md);");
  lines.push("  --ui-shadow-button: var(--shadow-subtle);");
  lines.push("  --ui-shadow-card: var(--shadow-subtle-2);");

  lines.push("  --ui-font-sans: var(--font-cosmica);");
  for (const key of Object.keys(tokens.typography ?? {})) {
    lines.push(`  --ui-type-${key}: var(--type-${key});`);
    lines.push(`  --ui-type-${key}-size: var(--type-${key}-size);`);
    lines.push(`  --ui-type-${key}-weight: var(--type-${key}-weight);`);
    lines.push(`  --ui-type-${key}-line: var(--type-${key}-line);`);
  }
}

function buildVariablesCss() {
  const lines = [
    "/* Generated from design-md/tokens.json. Do not edit by hand. */",
    ":root {",
    "  /* Colors */",
  ];

  addTokenLines(lines, "color", "color");

  lines.push("", "  /* Typography - Font Families */");
  for (const [key, token] of Object.entries(tokens.font ?? {})) {
    const fontValue = formatFont(token.$value);
    if (fontValue) lines.push(`  --font-${key}: ${fontValue};`);
  }

  lines.push("", "  /* Typography - Scale */");
  addTokenLines(lines, "typography", "type", {
    name: (key) => `--type-${key}`,
    value: (value) => {
      if (typeof value !== "object" || !value) return value;
      return `${value.fontWeight} ${value.fontSize}/${value.lineHeight} ${formatFont(value.fontFamily)}`;
    },
  });
  addTokenLines(lines, "typography", "type", {
    name: (key) => `--type-${key}-size`,
    value: (value) => (typeof value === "object" && value ? value.fontSize : value),
  });
  addTokenLines(lines, "typography", "type", {
    name: (key) => `--type-${key}-weight`,
    value: (value) => (typeof value === "object" && value ? value.fontWeight : value),
  });
  addTokenLines(lines, "typography", "type", {
    name: (key) => `--type-${key}-line`,
    value: (value) => (typeof value === "object" && value ? value.lineHeight : value),
  });

  lines.push("", "  /* Spacing */");
  addTokenLines(lines, "spacing", "spacing", {
    name: (key) => (key === "unit" ? "--spacing-unit" : `--spacing-${key}`),
  });

  lines.push("", "  /* Border Radius */");
  addTokenLines(lines, "radius", "radius");

  lines.push("", "  /* Named Radii */");
  const radiusAliases = {
    cards: "3xl-3",
    badges: "xl",
    inputs: "xl",
    buttons: "xl",
    imagemasks: "full",
    navigation: "xl",
    smallercards: "3xl-2",
    largeelements: "full-3",
    iconcontainers: "3xl-4",
  };
  for (const [alias, key] of Object.entries(radiusAliases)) {
    lines.push(`  --radius-${alias}: var(--radius-${key});`);
  }

  lines.push("", "  /* Shadows */");
  addTokenLines(lines, "shadow", "shadow");

  lines.push("", "  /* Surfaces */");
  addTokenLines(lines, "surface", "surface");

  lines.push("", "  /* Component Sizes */");
  addTokenLines(lines, "size", "size");

  lines.push("", "  /* Component Tokens */");
  addTokenLines(lines, "component", "component");

  lines.push("", "  /* Semantic Port & Flow Colors */");
  addTokenLines(lines, "port", "port");

  addSemanticAliasLines(lines);

  lines.push("}", "");
  return lines.join("\n");
}

function buildThemeCss() {
  const lines = [
    "/* Generated from design-md/tokens.json. Do not edit by hand. */",
    "@theme {",
    "  /* Colors */",
  ];

  addTokenLines(lines, "color", "color");

  lines.push("", "  /* Typography */");
  for (const [key, token] of Object.entries(tokens.font ?? {})) {
    const fontValue = formatFont(token.$value);
    if (fontValue) lines.push(`  --font-${key}: ${fontValue};`);
  }

  lines.push("", "  /* Spacing */");
  addTokenLines(lines, "spacing", "spacing", {
    name: (key) => (key === "unit" ? "--spacing-unit" : `--spacing-${key}`),
  });

  lines.push("", "  /* Border Radius */");
  addTokenLines(lines, "radius", "radius");

  lines.push("", "  /* Shadows */");
  addTokenLines(lines, "shadow", "shadow");

  lines.push("", "  /* Component Sizes */");
  addTokenLines(lines, "size", "size");

  lines.push("", "  /* Component Tokens */");
  addTokenLines(lines, "component", "component");

  lines.push("", "  /* Semantic Port & Flow Colors */");
  addTokenLines(lines, "port", "port");

  addSemanticAliasLines(lines);

  lines.push("}", "");
  return lines.join("\n");
}

fs.writeFileSync(variablesPath, buildVariablesCss());
fs.writeFileSync(themePath, buildThemeCss());

console.log(`Synced design tokens from ${path.relative(rootDir, tokensPath)}`);
