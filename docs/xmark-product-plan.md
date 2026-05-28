# xMark Product Plan

## Summary

xMark is a dedicated AI logo and brand mark design workspace. It should be separated from xGen so each product keeps a clear purpose:

- xGen: AI image generation workspace
- xMark: AI logo and brand mark design workspace

Logo generation should not be treated as a generic image generation task. A strong logo requires brand strategy, reference analysis, shape exploration, critique, refinement, usage testing, and export discipline.

## Why Separate xMark From xGen

xGen and xMark share image generation infrastructure, but their workflows are different.

### xGen

- Purpose: generate characters, products, scenes, style images, and reusable visual assets
- Core controls: prompt, style, references, image mix, ratio, resolution, consistency board
- Output: raster images
- Best UX: fast generation, library management, reference reuse, local folder saving

### xMark

- Purpose: design logos, symbols, app icons, and brand mark systems
- Core controls: brand brief, reference board, design principles, metaphor exploration, critique, refinement, usage tests
- Output: logo concepts, refined marks, app icon tests, monochrome variants, SVG/PNG exports, brand notes
- Best UX: exploration grid, candidate comparison, structured critique, iterative refinement, export readiness

Keeping xMark separate prevents xGen from becoming too broad and gives logo design the depth it needs.

## Product Positioning

xMark is not a simple logo image generator. It is a logo design process workspace.

Positioning:

> xMark helps users turn a brand idea into a distinctive, scalable logo mark through reference analysis, structured exploration, AI critique, refinement, and real usage testing.

## Naming

Recommended name: `xMark`

Reasoning:

- Fits the xGen product family
- Directly references brand marks and logo marks
- Broader than `xLogo`, because it can cover app icons, symbols, monograms, and identity marks
- More focused than `xBrand`, which sounds like a full brand strategy suite

Possible product family:

- xGen: image generation
- xMark: logo and brand mark generation
- xBrand: broader brand identity system, possible future product

## Core Philosophy

xMark should help users avoid one-shot logo generation. The workflow should guide them through:

1. Define the brand
2. Study references
3. Extract reusable design principles
4. Explore many distinct concepts
5. Critique and rank candidates
6. Refine selected directions
7. Test real-world usage
8. Export clean final assets

The product should encourage:

- Monochrome-first design
- High contrast
- Small-size readability
- Vector-friendly geometry
- Strong silhouette
- Clear negative space
- Avoidance of generic AI visual cliches
- Avoidance of copying reference logos

## Suggested Workflow

```text
Brand Brief
-> Reference Board
-> Principle Extraction
-> Metaphor Definition
-> Exploration Grid
-> Critique
-> Refinement
-> Usage Test
-> Export
```

## Node Model

xMark should keep the node-based interaction model from xGen, but with logo-specific nodes.

### Brand Brief Node

Captures core brand inputs:

- Brand name
- Product or service description
- Audience
- Personality
- Category
- Differentiators
- Must-have ideas
- Must-avoid ideas

### Reference Board Node

Organizes visual references by role:

- Good references
- Avoid references
- Competitor references
- Shape references
- Mood references
- App icon references

Important: references should be used for analysis, not copying.

### Principle Extraction Node

Extracts abstract design principles from references:

- Simplicity level
- Contrast
- Geometric construction
- Negative space strategy
- Symmetry or asymmetry
- Corner radius language
- Stroke/fill balance
- Number of visual elements
- Icon-size readability

### Metaphor Node

Defines visual metaphors to explore.

For xGen's own logo, examples include:

- Connected creative nodes
- Graph flowing into an image
- Aperture made from nodes
- Spark emerging from a network
- Modular X shape
- Image frame assembled from dots
- Consistency lock without a literal lock
- Local workspace orbit
- Prompt-to-output flow
- Reusable visual seed

### Exploration Grid Node

Generates a sheet of many distinct concepts.

Expected output:

- 16 to 24 logo mark concepts
- Black-and-white first
- No text unless explicitly requested
- Each concept should explore a different structure, not minor variations

### Critique Node

Evaluates candidates against logo-specific criteria:

- Recognizability at 24px
- Uniqueness
- Relevance to brand idea
- Monochrome strength
- Vectorization readiness
- Negative space quality
- App icon suitability
- Similarity risk
- Avoidance of generic AI, robot, sparkle, brain, camera, brush, and chat bubble cliches

### Refinement Node

Takes one or more selected concepts and produces focused variations.

Expected refinement dimensions:

- Balance
- Silhouette
- Negative space
- Geometry
- Small-size readability
- Distinctiveness
- Icon framing

### Usage Test Node

Tests final candidates in realistic contexts:

- White mark on black
- Black mark on white
- 24px toolbar icon
- macOS app icon
- Sidebar navigation icon
- Favicon
- Watermark on generated image
- Social avatar

### Export Node

Exports final assets:

- PNG
- SVG or vector-like source when available
- App icon preview
- Monochrome variants
- Prompt and design rationale
- Optional brand note

## Reference Strategy

One reference image is not enough for high-quality logo generation. xMark should support role-based reference groups.

Recommended reference categories:

- Structure references: node graphs, connected elements, flow diagrams
- Form references: circles, apertures, sparks, modular marks
- Mood references: dark design tools, premium creative software, clean SaaS
- Constraint references: examples of what to avoid
- Competitor references: marks that must not be copied

Recommended minimum:

- 6 to 12 references per exploration

Reference instruction:

```text
Use these references only to extract abstract design principles such as simplicity, contrast, geometry, negative space, and icon readability. Do not copy any specific silhouette, layout, or brand mark.
```

## Self-Evolving Design Memory

xMark should be designed to improve over time through a local, user-controlled design memory. The goal is not to train model weights directly in the first version. The practical approach is to collect structured signals from the user's work, analyze them, and feed them back into future prompts, critique criteria, and recommendations.

This is better described as:

```text
Personalized design memory
```

not:

```text
Real-time model fine-tuning
```

### Learning Loop

```text
Collect
-> Analyze
-> Structure
-> Store
-> Retrieve
-> Apply to next generation
-> Capture user feedback
-> Update preference profile
```

### Data xMark Should Learn From

xMark can learn from:

- Brand briefs the user writes
- Reference images and links the user adds
- Reference role labels such as good, avoid, competitor, mood, form, structure
- Exploration grids generated by the system
- Candidates the user opens, selects, refines, exports, or deletes
- Candidates the user ignores or rejects
- Final logo choices
- Prompt patterns that produce strong results
- Critique results that correlate with user choices
- Usage tests that reveal weak small-size readability

### Preference Profile

xMark should maintain a profile at multiple levels:

- Global user preference
- Project preference
- Brand-specific preference
- Reference-set preference

Example:

```json
{
  "brandPreferences": {
    "simplicity": "high",
    "geometry": "rounded-modular",
    "contrast": "monochrome-first",
    "negativeSpace": "strong",
    "avoid": ["generic sparkle", "robot", "camera", "thin orbital lines"]
  },
  "successfulPatterns": [
    {
      "metaphor": "connected nodes into spark",
      "referencePrinciples": ["bold silhouette", "3-part structure"],
      "promptPattern": "node graph converging into image core",
      "score": 0.86
    }
  ],
  "rejectedPatterns": [
    {
      "reason": "too generic AI logo",
      "visualTraits": ["single sparkle", "thin orbit line"]
    }
  ]
}
```

### Event Log

xMark should keep a lightweight event log so preferences can be inferred over time.

Example:

```json
{
  "event": "candidate_selected",
  "candidateId": "concept-08",
  "projectId": "xgen-logo",
  "timestamp": "2026-05-27T00:00:00.000Z",
  "context": {
    "metaphor": "node graph spark",
    "referenceSet": ["ref-01", "ref-04"],
    "critiqueScore": 0.82
  }
}
```

Useful events:

- `reference_added`
- `reference_labeled`
- `principles_extracted`
- `exploration_generated`
- `candidate_opened`
- `candidate_selected`
- `candidate_rejected`
- `candidate_refined`
- `candidate_exported`
- `usage_test_passed`
- `usage_test_failed`

### Brand Memory UI

The design memory should be visible and editable. Hidden learning can become confusing or biased.

Example UI copy:

```text
xMark learned this for this brand:

Prefers:
- monochrome symbols
- rounded geometric modules
- 3-node structures
- strong negative space

Avoids:
- single sparkle marks
- camera shapes
- complex circuit patterns
- thin orbital lines

Applied to next generation
[Edit] [Disable] [Reset]
```

### Storage

Recommended local-first storage:

```text
~/Library/Application Support/xMark/learning.json
~/Library/Application Support/xMark/reference-index.json
~/Library/Application Support/xMark/projects/{projectId}.json
```

The first version can store JSON files. SQLite can be introduced later if querying and versioning become more complex.

## External Reference Learning

External design sites can help xMark learn faster, especially when the initial user base is small. However, the safest and most durable approach is user-directed reference collection, not automated scraping.

### Safe Principle

xMark should learn from references by extracting abstract design principles, not by storing and imitating copyrighted visual work.

Store:

- Simplicity level
- Shape language
- Contrast style
- Composition
- Negative space strategy
- Color strategy
- Small-size readability traits
- User preference signals

Avoid storing as long-term training data:

- Full-resolution source images from third-party platforms
- Exact silhouettes
- Designer names for style imitation
- Downloaded portfolios
- Scraped search result archives

### Pinterest

Pinterest can be useful as a curated reference source, but xMark should avoid unauthorized automated scraping. The safer product pattern is:

- User pastes Pinterest pin or board URLs
- User uploads saved reference images
- xMark analyzes only references the user intentionally provides
- xMark stores design principles and optional short-lived thumbnails
- xMark does not build a large Pinterest image dataset

### Behance and Dribbble

Behance and Dribbble should not be treated as automatic crawling targets.

Dribbble's terms and API terms are especially restrictive around scraping, copying, saving, or storing data outside what is exposed by the API. Behance content is user-owned creative work under Adobe/Behance policies, and official API availability has been historically limited or unclear.

Recommended approach:

- Do not implement autonomous crawling of Behance or Dribbble pages.
- Do not bulk download portfolios or search results.
- Do not build a training dataset from their content.
- Allow user-provided URLs or uploads.
- Analyze references into abstract principles.
- Keep source attribution when a reference URL is retained.
- Provide a cache cleanup option.

### Reference Inbox

xMark should include a Reference Inbox for user-directed collection.

Inputs:

- Image upload
- Folder import
- URL paste
- Clipboard image
- Optional official API integration where permitted

Fields:

- Source URL
- Source type: Pinterest, Behance, Dribbble, upload, website, unknown
- Role: good, avoid, competitor, shape, mood, app-icon, typography
- Notes
- Extracted principles
- Keep original: yes/no
- Cache expiry

### Analysis-Only Mode

The default should be Analysis-Only Mode:

```text
Analyze this reference for abstract design principles. Do not copy the silhouette, layout, visual identity, or exact style. Extract only reusable design constraints such as simplicity, contrast, shape language, negative space, icon readability, and composition.
```

### Do-Not-Copy Guard

Every generation that uses external references should include a guard:

```text
Use references only for high-level design principles. Do not reproduce any specific logo, silhouette, composition, brand identity, or designer style. Create an original mark with a distinct structure.
```

### Better Long-Term Sources

For broader automated analysis, prioritize sources where licensing is clearer:

- Public domain mark archives
- Openly licensed icon sets
- User-owned reference libraries
- User-created screenshots
- Internal generated candidates
- Final accepted xMark outputs
- Explicitly licensed datasets

## Retrieval-Augmented Generation

xMark should use accumulated memory as retrieval context for new generations.

Before generating, xMark can retrieve:

- Relevant successful patterns
- Rejected visual traits
- Brand-specific values
- Reference-derived principles
- Usage test failures
- User preference profile

Then inject a compact summary into the generation prompt:

```text
Brand Memory:
- Prefer bold monochrome marks with 3-part rounded geometry.
- Strong negative space has performed well.
- Avoid thin orbital lines, single generic sparkles, robot/brain/camera metaphors.
- Prior successful metaphor: connected creative nodes converging into a central image core.
```

This gives xMark a practical way to evolve without directly training model weights.

## Prompt Templates

### Exploration Prompt

```text
We are designing a logo mark for [BRAND_NAME], [BRAND_DESCRIPTION].

Do not generate a final logo yet. First, create a black-and-white exploration sheet of 20 distinct logo mark concepts.

Brand idea:
[BRAND_IDEA]

Core values:
- [VALUE_1]
- [VALUE_2]
- [VALUE_3]
- [VALUE_4]
- [VALUE_5]

Visual metaphors to explore:
1. [METAPHOR_1]
2. [METAPHOR_2]
3. [METAPHOR_3]
4. [METAPHOR_4]
5. [METAPHOR_5]
6. [METAPHOR_6]
7. [METAPHOR_7]
8. [METAPHOR_8]
9. [METAPHOR_9]
10. [METAPHOR_10]

Constraints:
- no text
- no literal mascot
- no robot
- no brain
- no camera
- no brush
- no pencil
- no chat bubble
- no gradients
- no 3D
- no shadows
- no mockup
- no copied reference silhouettes
- must work as a 24px toolbar icon
- must work as a macOS app icon
- monochrome-first
- bold, geometric, vectorizable

Use references only to understand simplicity, contrast, geometry, and negative space. Do not copy shapes.

Output:
A clean 5x4 grid of distinct black-and-white logo marks on a neutral background.
Each mark should be different in structure, not just minor variations.
```

### Refinement Prompt

```text
Refine concept #[NUMBER] from the exploration sheet.

Preserve:
- the core silhouette
- the main metaphor
- the monochrome strength

Improve:
- balance
- negative space
- icon readability at 24px
- uniqueness
- geometric precision
- app icon suitability

Create 12 refined variations in a 4x3 grid.
No text, no gradients, no mockups.
```

### Usage Test Prompt

```text
Finalize the strongest variation as a clean vector-like logo mark.

Show it in six usage tests:
1. white mark on black square
2. black mark on white square
3. 24px toolbar icon
4. macOS rounded app icon
5. small watermark on generated image
6. sidebar navigation icon

Keep the mark simple, bold, geometric, and unique.
```

## xGen Logo Example Direction

If xMark is used to design a logo for xGen, the concept should express:

- Node-based creative workflow
- Connected prompt, style, reference, and output settings
- Multiple inputs converging into one generated image
- Reusable visual consistency
- Local user-owned image library

Recommended metaphor:

> Three connected creative nodes merging into a central spark or image core.

Avoid:

- Literal robot
- AI brain
- Camera
- Pencil
- Brush
- Chat bubble
- Generic sparkle-only logo
- Direct copying of Pinterest reference logos

## Architecture Direction

xMark can share infrastructure with xGen while keeping product logic separate.

Shared:

- Electron shell
- Codex worker
- Image generation API
- Local settings and output folder handling
- Gallery persistence
- Node canvas foundation
- Reference image handling

Separate:

- Node types
- Prompt builder
- Result schema
- Critique model
- Logo-specific gallery metadata
- Export workflow
- UI language

Possible future structure:

```text
apps/xgen
apps/xmark
packages/core
packages/electron-shell
packages/generation-worker
packages/node-canvas-ui
```

Short-term practical structure:

```text
src/app
src/app/logo
src/features/xgen
src/features/xmark
src/lib/shared
```

Start with `src/app/logo` or an xMark app mode in the current codebase. Split into a monorepo only after the workflow is validated.

## MVP Scope

Recommended first version:

1. xMark entry screen
2. Brand Brief Node
3. Reference Board Node
4. Metaphor Node
5. Exploration Grid generation
6. Candidate selection
7. Refinement generation
8. Usage Test generation
9. Save results to a separate xMark library

Do not start with full SVG extraction or automatic vectorization. First validate whether the structured workflow produces better logo directions.

## Success Criteria

xMark is working if users can:

- Add multiple references by role
- Generate 16 to 24 genuinely different logo concepts
- Select a candidate and refine it without losing the core idea
- See whether a logo works at small size
- Avoid direct copying of references
- Export usable PNG assets
- Understand why a candidate is stronger than another

## Open Questions

- Should xMark be a separate Electron app or a mode inside the current app first?
- Should xMark share the same user data folder or use a separate `xMark` folder?
- Should references be saved per project, per brand, or globally?
- Should critique be generated automatically after every exploration?
- Should SVG export be manual, AI-assisted, or deferred?
- Should xMark include competitor similarity warnings?
