# Figma Weave Reverse-Engineering Analysis

Date: 2026-06-01

## Scope

This document reverse-engineers Figma Weave from public evidence and translates the findings into practical implications for BrandGen and the separated IntentCanvas direction.

This is not based on private code or internal Figma materials. It is an inference from public product, help, pricing, blog, and investor materials.

## Sources

- Figma blog: https://www.figma.com/blog/welcome-weavy-to-figma/
- Figma Weave product page: https://weave.figma.com/
- Figma Weave pricing page: https://weave.figma.com/pricing
- Figma Weave Knowledge Center home: https://help.weavy.ai/en/
- Understanding Nodes: https://help.weavy.ai/en/articles/12292386-understanding-nodes
- Connecting Edges: https://help.weavy.ai/en/articles/14688276-connecting-edges-wires
- The Design App: https://help.weavy.ai/en/articles/12267755-the-design-app
- Iterators: https://help.weavy.ai/en/articles/12343281-iterators
- Helpers Overview: https://help.weavy.ai/en/articles/12268300-helpers-overview
- Figma Q3 2025 press release: https://s206.q4cdn.com/973901332/files/doc_events/2025/Nov/05/Figma-Q3-25-Press-Release.pdf
- Figma Q1 2026 earnings transcript: https://s206.q4cdn.com/973901332/files/doc_financials/2026/q1/242074090_1996479323_3727608_Transcript_EditedCopy_20260514230208.pdf

## High-Level Product Thesis

Figma Weave's core thesis is:

> AI generation is not a single prompt-to-output action. It is a creative pipeline where each generated or edited output can feed the next step.

Figma's acquisition blog frames the first prompt as a starting point rather than the final destination. The product page reinforces this by positioning Weave as a node-based platform where AI models and professional editing tools live in one workflow.

The important product insight is not merely "node UI." It is:

- AI model outputs are treated as media assets.
- Media assets can be transformed, branched, compared, edited, and reused.
- The workflow itself becomes a reusable production system.
- Expert users can expose a simplified "App Mode" on top of complex workflows.

## Reverse-Engineered System Model

### 1. Node Graph As Execution Pipeline

Official help docs define a node as a function with inputs on the left and outputs on the right. Each node either accepts direct user input or receives output from another node, then performs a specific action or transformation.

Inferred architecture:

```text
NodeDefinition
  id
  type
  inputPorts[]
  outputPorts[]
  parametersSchema
  executionKind: generative | nonGenerative | helper
  costModel
  run()
```

This separates canvas editing from execution. The canvas graph is not just UI state; it is a runnable workflow definition.

### 2. Typed Edges

The edge behavior is type-aware:

- text connects to text,
- image connects to image,
- video connects to video,
- unsupported connections are rejected,
- multiple-input nodes can dynamically add slots.

Inferred architecture:

```text
Port
  id
  direction: input | output
  dataType: text | image | video | mask | array | lora | model | threeD | any
  multiplicity: single | multiple
```

This is a key difference from decorative node canvases. Type compatibility protects users from broken workflows.

### 3. Generative vs Non-Generative Nodes

Weave distinguishes:

- generative AI nodes with a Run action and credit cost,
- non-generative/manual/professional editing nodes that do not consume generation credits.

This creates a clear cost and control model:

```text
Prompt -> Image Model -> Relight -> Upscale -> Compare -> Export
```

Not every step should call an AI model. Some steps are deterministic media operations, inspection, transformation, routing, preview, or export.

### 4. Multi-Model Abstraction

The product page lists many providers and models, including image, video, vector, 3D, and enhancement models. Pricing also exposes model-specific credit consumption.

Inferred architecture:

```text
ModelAdapter
  provider
  modelId
  modality
  inputTypes
  outputTypes
  parameters
  creditCost
  commercialRightsMetadata
```

The user sees models as nodes, but the system likely normalizes execution through provider adapters.

### 5. Professional Media Tool Layer

The product page and help docs list tools such as:

- crop,
- inpaint,
- outpaint,
- mask extractor,
- upscale,
- depth extraction,
- image describer,
- channels,
- painter,
- relight,
- compare,
- export,
- preview.

The lesson: Weave is not trying to make the prompt smarter only. It surrounds generation with post-generation craft controls.

### 6. Workflow To App Mode

The Design App feature is strategically important. A power user can build a complex workflow, add an Output node, then publish a simplified app exposing only unlocked input attributes.

Inferred pattern:

```text
Complex workflow graph
  -> selected exposed inputs
  -> output node
  -> generated simplified UI
  -> versioned published app
```

This turns expert workflow design into reusable team-facing tools.

### 7. Iterators And Batch Production

Weave supports text, image, and video iterators. Iterators keep inputs separate while sending many inputs through the same model or workflow.

Product implication:

```text
One workflow, many inputs, many outputs
```

This matters for marketing, commerce, social content, and brand production where volume matters.

### 8. Human Craft Positioning

Figma repeatedly positions Weave around human creativity plus AI, not AI replacing design judgment. Investor materials also frame Figma's AI strategy around context, control, and shared canvas work.

The differentiator is:

- keep humans in control,
- preserve visual manipulation,
- embed AI in the creative surface,
- reduce handoff between ideation, generation, editing, and production.

## Why Weave Works

Weave solves several pain points in AI image/video tools:

1. **Prompt fragility**
   - Users are not stuck rewriting a single prompt.
   - They can branch, remix, refine, and edit.

2. **Model fragmentation**
   - Many providers are accessible inside one workflow.
   - Users can choose the best model for each step.

3. **Loss of control**
   - Editing tools are built into the pipeline.
   - Outputs can be corrected rather than discarded.

4. **Non-repeatability**
   - Workflows can be reused, published, and batch-run.

5. **Team scaling**
   - App Mode lets experts package complex workflows for others.

## Weaknesses And Open Risks

These are inferred product risks from the public model:

1. **Workflow complexity**
   - Node graphs can become too complex for casual users.
   - App Mode exists partly to hide that complexity.

2. **Credit anxiety**
   - Generative nodes are credit-consuming.
   - Users need cost visibility before running expensive workflows.

3. **Provider inconsistency**
   - Different models have different strengths, parameters, rights, latency, and failure modes.
   - The system must normalize enough to be usable without hiding meaningful differences.

4. **Canvas sprawl**
   - Branching is powerful but can become visually unmanageable.
   - Routing, grouping, preview, compare, and app publishing are needed to prevent chaos.

5. **Figma integration gap**
   - The pricing FAQ says Figma and Figma Weave currently operate as separate products, with deeper canvas integration planned.

## Implications For BrandGen

BrandGen should not chase Weave feature-for-feature.

BrandGen's current strength is a focused image-generation node workspace. It should borrow only what improves that direction:

### Keep

- concrete output settings,
- prompt/style/reference nodes,
- style reference image guardrails,
- gallery and reuse workflow,
- Electron local runtime,
- deterministic prompt-path verification.

### Borrow From Weave

- typed node connections,
- clear generative vs non-generative node categories,
- visible run/cost status per generation node,
- preview/compare nodes,
- export node,
- batch/iterator concept for prompt or style variations,
- simplified workflow mode for non-expert users.

### Avoid

- adding too many model/provider options before the current generation path is stable,
- turning every setting into a visible node,
- encouraging unbounded branching,
- hiding the final prompt assembly from users.

## Implications For IntentCanvas

IntentCanvas can learn more directly from Weave, but the starting point is different.

Weave starts from production workflows.

IntentCanvas should start from intent discovery:

```text
User thought
-> AI interpretation
-> missing decisions
-> references/tools
-> generation-ready brief
-> runnable workflow
```

The key opportunity is to combine:

- IntentCanvas's thought-evolution nodes,
- Weave's typed workflow execution model,
- BrandGen's prompt handoff and style reference guardrails.

## Proposed Architecture For IntentCanvas Inspired By Weave

### Layer 1: Thought Graph

Nodes:

- `seed.thought`
- `intent.interpretation`
- `question.clarify`
- `decision.choice`
- `reference.rag`
- `memory.preference`

Purpose:

- discover and structure what the user wants.

### Layer 2: Brief Graph

Nodes:

- `brief.summary`
- `brief.prompt`
- `brief.constraints`
- `brief.style_reference`
- `brief.output_settings`

Purpose:

- turn thought into executable creative direction.

### Layer 3: Execution Graph

Nodes:

- `model.image_generate`
- `tool.describe`
- `tool.compare`
- `tool.upscale`
- `tool.export`
- `iterator.prompt_batch`

Purpose:

- generate, inspect, edit, compare, and export outputs.

## Product Principle To Adopt

The strongest Weave principle to adopt is:

> A creative AI product should make the process editable, not just the prompt.

For BrandGen, that means making prompt assembly, style references, and output decisions visible and reliable.

For IntentCanvas, that means showing how the user's thought becomes a brief and then a result.

## Practical Next Steps

### For BrandGen

1. Add a Compare node or gallery compare mode.
2. Add a lightweight Export node/action with clear output path.
3. Add typed-connection validation for optional image/text nodes.
4. Add batch generation later, starting with prompt/style variations.
5. Keep the current product focused; do not import IntentCanvas's broader thought-discovery flow into BrandGen.

### For IntentCanvas

1. Build mock thought graph first.
2. Add typed ports before adding many node types.
3. Add one-question-at-a-time intent discovery.
4. Add RAG/reference nodes as visible evidence.
5. Add execution graph only after the brief graph works.
6. Add App Mode later: publish a simplified interface from a workflow.

