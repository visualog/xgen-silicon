# shadcn/ui Style System

This document defines how to choose visual style presets for BrandGen and xGen UI work.

The active runtime foundation remains local shadcn/ui:

- `components.json`
- `src/app/globals.css`
- `src/components/ui/*`

The current repo registry config uses `style: "new-york"`, `baseColor: "neutral"`, and `iconLibrary: "lucide"`. The presets below are operating guidance for visual density, spacing, radius, and tone. They do not replace the local shadcn primitive source of truth.

Source note: this guide was merged from `/Users/im_018/Documents/GitHub/2026_important/shadcn ui style.ini`. Re-check upstream shadcn/ui docs before changing generated preset names, CLI behavior, or registry configuration.

## Core Rule

Use shadcn/ui style presets as visual foundations, not just color themes. Presets affect component spacing, geometry, density, structure, typography feel, and overall product tone.

## Presets

### Vega

Classic shadcn/ui look.

Use Vega as the neutral default for general SaaS, MVPs, basic apps, and balanced product UI. Keep spacing, radius, and density moderate. Avoid making the UI overly compact, overly rounded, or editorial.

Best for:

- General SaaS
- Basic product screens
- MVPs
- Account, settings, and dashboard foundations

Avoid for:

- Strong brand/editorial pages
- Very dense data operations screens

### Nova

Compact SaaS/product style.

Use Nova when Vega feels too spacious. Reduce padding and margins while preserving readability. Nova is a practical default for dashboards, admin panels, developer/product UI, settings, and information-heavy screens.

Best for:

- SaaS dashboards
- Admin panels
- Developer UI
- Billing, settings, and analytics overview screens

Avoid for:

- Relaxed consumer-facing screens
- Emotional onboarding or brand-first pages

### Luma

Soft, rounded, spacious product UI.

Use Luma for rounded geometry, soft surfaces, breathable spacing, and calm rhythm. It is appropriate when the user should feel comfortable exploring or creating rather than scanning dense data.

Best for:

- Consumer apps
- Onboarding
- Settings and profile screens
- Education and wellness products
- Friendly creative tools

Avoid for:

- Dense operational tooling
- Spreadsheet-like workflows

### Rhea

Compact Luma.

Use Rhea when Luma feels too spacious but the product should keep a rounded, soft foundation. Tighten cards, lists, buttons, inputs, and menus while keeping the UI approachable.

Best for:

- Analytics dashboards
- Admin screens with a softer product tone
- Internal tools
- Information-heavy product interfaces

Avoid for:

- Editorial landing pages
- Brand storytelling pages

### Mira

Dense, product-focused style.

Use Mira only for dense interfaces where operators need to scan and act on many controls or records. Prioritize data density, compact controls, tables, filters, and operational workflows.

Best for:

- Data tables
- CRM and inventory tools
- Orders, logs, and operations screens
- Spreadsheet-like product UI

Avoid for:

- Marketing pages
- Brand pages
- Onboarding
- Relaxed consumer UI

### Maia

Soft, rounded, generous style.

Use Maia for friendly consumer-facing products where warmth and approachability matter more than density. It should feel more generous than a typical dashboard.

Best for:

- Friendly landing pages
- Onboarding
- Personal dashboards
- Habit, family, education, and wellness apps

Avoid for:

- Technical/devtool UI
- Dense admin surfaces

### Lyra

Sharp, structured, technical style.

Use Lyra for boxy surfaces, lower radius, structured layouts, and mono-friendly typography. It should feel precise and technical.

Best for:

- Developer tools
- API dashboards
- Terminal-like UI
- Infrastructure and security products
- Technical AI agent consoles

Avoid for:

- Soft consumer apps
- Friendly onboarding

### Sera

Editorial, typographic style.

Use Sera for typography-led pages. Prefer serif headings, sans-serif body text, uppercase tracking, underlined controls, square corners, and print-inspired composition.

Best for:

- Marketing pages
- Editorial pages
- Publishing and portfolio pages
- Premium brand storytelling

Avoid for:

- Dense admin screens
- Operational dashboards

## Selection Table

| Style | Core Character | Keywords | Best For | Avoid |
| --- | --- | --- | --- | --- |
| Vega | Neutral, balanced | classic shadcn/ui look | General SaaS, basic apps, MVPs | Strong brand pages, dense data UI |
| Nova | Compact SaaS | reduced padding, compact layouts | Dashboards, admin, developer UI | Spacious consumer UI |
| Luma | Soft and spacious | rounded geometry, soft elevation, breathable layouts | Consumer apps, onboarding, settings | Dense operations tools |
| Rhea | Compact Luma | smaller spacing, denser surfaces | Analytics, admin, internal tools | Editorial/brand pages |
| Mira | Dense product UI | compact, dense interfaces | Data tables, operations, spreadsheet-like UI | Marketing, brand, onboarding |
| Maia | Soft and generous | soft, rounded, generous spacing | Friendly apps, landing, onboarding | Technical/devtool UI |
| Lyra | Sharp and technical | boxy, sharp, mono fonts | Developer tools, terminal, infra UI | Soft consumer apps |
| Sera | Editorial typography | serif heading, uppercase, underline controls | Marketing, editorial, portfolio | Admin, dense dashboard |

## BrandGen Defaults

Use these defaults unless the task gives a clearer direction:

- Main xGen creative workspace: Luma.
- Infinite canvas and generation flows: Luma for calmer creation. Use Rhea only when more controls must remain visible without changing the service tone.
- `/design-system` documentation shell: Vega or Rhea.
- `/design-system` service examples: Luma.
- Dense reference libraries, tables, and operational QA surfaces: Nova or Mira.
- Technical worker/debug views: Lyra.
- Marketing/editorial pages: Sera.

## BrandGen Style Boundary

The design-system site has two different visual responsibilities.

Use Vega/Rhea for the documentation shell:

- global design-system navigation
- page chrome
- explanatory copy
- page rail
- catalog layout
- implementation notes

Use Luma for service-facing examples inside the design system:

- foundation previews
- component examples
- pattern previews
- template previews
- any preview intended to represent the actual xGen service UI

In short:

```text
/design-system shell = compact documentation style, Vega/Rhea
/design-system service examples = actual service style, Luma
actual xGen service UI = Luma
```

Do not make the whole design-system site Luma. Treat the site as a compact exhibition space, and the examples inside it as the service UI being exhibited.

## Spacing System

Use a 4px spacing grid for all service UI and design-system work.

Allowed spacing values:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 40px
- 48px
- 64px

Rules:

- Use 4px increments for component internals.
- Use 8px increments for section and page rhythm when possible.
- Avoid `2px`, `3px`, `6px`, `10px`, and arbitrary spacing values in authored code.
- Exceptions are allowed for `1px` borders, focus rings, optical alignment inside an upstream shadcn primitive, and browser/primitive internals that are not authored locally.
- If a shadcn primitive uses non-4px values, do not patch the primitive casually. Correct service-facing compositions with wrappers, layout classes, or a documented exception.

Recommended hierarchy:

| Level | Example | Spacing |
| --- | --- | --- |
| Inline | icon + label, chip internals | 4px or 8px |
| Field | label + field, compact control groups | 8px |
| Component | fields inside a card/body | 12px or 16px |
| Surface | card padding, panel padding | 16px or 24px |
| Section | sections inside a page rail | 32px or 48px |
| Page | top/bottom page rhythm | 48px or 64px |

## Card Structure

shadcn Card is a slot-based primitive, not a single padded container.

The default local Card pattern is:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

This means spacing is distributed across slots:

- `Card` owns top/bottom padding and vertical gap.
- `CardHeader` owns header horizontal padding and header rhythm.
- `CardContent` owns body horizontal padding.
- `CardFooter` owns footer horizontal padding and bottom-area layout.

Use this structure when documenting shadcn primitives.

For service-facing Luma cards, prefer a composed wrapper when a single container-padding model is more natural:

```tsx
<LumaCard>
  <LumaCardHeader />
  <LumaCardBody />
  <LumaCardFooter />
</LumaCard>
```

Do not mix shadcn primitive slot padding and service-specific card padding in a global override. Keep the primitive source of truth clear.

## Nested Radius

Avoid nested rounded surfaces when possible.

When nested rounded surfaces are necessary, radius must follow the inset spacing so the curves feel parallel:

```text
inner radius = max(outer radius - inset spacing, 4px)
```

Examples:

| Outer Radius | Inset Spacing | Inner Radius |
| --- | --- | --- |
| 24px | 16px | 8px |
| 20px | 12px | 8px |
| 16px | 8px | 8px |
| 12px | 8px | 4px |

Rules:

- Radius and inset spacing should use 4px increments.
- Inner radius must not exceed outer radius.
- Prefer `8px` as the practical inner soft-surface radius.
- Use `4px` as the minimum non-pill radius.
- Pill/chip geometry may use `999px` as a deliberate exception.

## Divider And Border Discipline

Avoid divider lines between groups and elements by default.

Preferred grouping hierarchy:

1. Spacing
2. Typography hierarchy
3. Background tone
4. Subtle elevation
5. Border as a last resort

Rules:

- Do not use borders on every card or nested surface.
- Do not use divider lines simply to separate every group.
- Avoid card-inside-card compositions.
- Prefer spacing and alignment for related items.
- Prefer soft surface tone or subtle elevation for Luma service UI.
- Use borders when they clarify interactive boundaries, code/reference chips, form controls, dense data grids, focus states, or accessibility-critical states.

## Grid And Baseline Rhythm

Use grid-based layout for page structure and repeated content.

Rules:

- Use a consistent content rail.
- Use CSS grid for page sections, card grids, template previews, and repeated content.
- Avoid arbitrary widths, one-off offsets, and uneven columns.
- Prefer tokenized `grid`, `grid-cols-*`, `gap-*`, and `max-w-*` patterns.
- Keep section spacing on 8px increments where possible.

Use baseline-aware vertical rhythm for text-heavy surfaces.

Preferred line-height targets:

| Text Role | Preferred Line Height |
| --- | --- |
| Small text | 20px |
| Body text | 24px |
| Lead text | 28px |
| Small heading | 32px |
| Large heading | 40px or 48px |

Avoid arbitrary line-height values unless matching an upstream shadcn primitive exactly.

## CSS Ownership

Keep CSS responsibility separated:

- `src/components/ui/*`: local shadcn primitive source of truth.
- `/design-system` shell CSS: documentation shell only.
- service example wrappers: Luma service preview styling.
- legacy xGen compatibility aliases: migration support only.

Avoid global `.shadcn-docs-surface [data-slot="..."]` overrides for primitive internals unless a concrete collision has been identified and documented.

## Agent Prompt Snippet

```md
Use shadcn/ui style presets as visual foundations, not just color themes.
These presets affect component spacing, geometry, density, structure, and overall feel.

Use Vega for neutral product UI.
Use Nova for compact SaaS, admin, dashboard, and developer UI.
Use Luma or Maia for soft consumer-facing screens.
Use Rhea for rounded but information-heavy product UI.
Use Mira only for dense operations/data-table interfaces.
Use Lyra for technical/devtool surfaces.
Use Sera for editorial, marketing, portfolio, and typography-led pages.

For BrandGen, use Luma for service UI and service previews, and Vega/Rhea for the compact design-system documentation shell.
Keep spacing on a 4px grid, minimize dividers and borders, avoid nested rounded surfaces unless radius follows inset spacing, and use grid/baseline rhythm for layouts.
```
