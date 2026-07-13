---
name: crafting-fantasy-cover-art
description: Use when crafting fantasy cover art, fantasy cover concepts, book-cover prompts, fantasy image-generation workflows, or pixel-review refinements for fantasy fiction.
---

# crafting-fantasy-cover-art

Crafting-fantasy-cover-art turns a spoiler-safe fantasy brief into a commercially coherent cover-concept package.
It is for reader-contract design, generation prompts, image review, and layout guidance.
It is not a prose skill and it does not own canon or story lifecycle.

## Use it for

- fantasy cover art briefs and concepts
- ebook front-cover direction
- print-cover front-panel concepting before wrap work
- fantasy image-generation prompts and refinement loops
- thumbnail, full-size, and typography-zone checks

## Inputs

Resolve or clearly mark assumptions about:

- subgenre and age market
- format and sales surface
- emotional promise and energy
- differentiator or hook
- allowed and forbidden story facts
- likely title, byline, and series-text zones
- generator constraints or preferred model behaviour

Do not block on low-risk omissions.
Infer sensible defaults when the omission is unlikely to change the design materially, and label the assumption.

## Output package

1. Compact reader-and-market brief.
2. Two or three genuinely distinct focal strategies.
3. Comparison and one recommendation.
4. One text-free portrait-generation prompt per direction.
5. The recommended image rendered when image tools exist, with prompt and generator metadata preserved.
6. Full-size pixel review and real-thumbnail review.
7. One corrected candidate when the pixels expose visible failures.
8. Layout and typography notes.
9. Short validation and rights/usage checks.

## Core workflow

1. Build the brief first.

State the reader contract before writing prompts: who the book is for, what fantasy shelf it belongs on, what emotional promise it makes, what differentiator must be visible, and which facts are off-limits.
If the brief is missing a low-risk piece, infer it and mark it as an assumption instead of stopping.

2. Refresh the shelf when possible.

Current fantasy-cover trends shift faster than durable principles.
When the task depends on market fit, scan recent comparable covers in the closest shelf first.
If that research is unavailable, say so and rely on durable principles from the bundled reference rather than claiming a trend scan happened.

3. Generate 2–3 distinct directions.

Each direction must make a different strategic choice, not just a palette swap.
Use a different dominant focal strategy, such as:

- character-led
- environment-led
- symbol/object-led
- creature-led

Each direction should explain why that strategy fits the brief and what reader expectation it creates.

4. Translate the differentiator into something visible.

Do not leave the hook as abstract lore.
Turn it into an action, object, posture, tool, mark, environment cue, or magical consequence that a thumbnail can actually read.
Spoiler-safe invention is allowed, but proposed visual devices are design choices, not canon.
Label invented cover devices as proposed rather than factual.

5. Compare and recommend.

Pick the direction that best satisfies the reader contract, age-market register, and thumbnail recognition while avoiding generic genre shorthand.
Say why the rejected directions lose on this brief.

6. Write prompt-ready cover specs.

Every prompt should be a coherent image specification, not a pile of aesthetic nouns.
Default to a tall portrait composition and keep the art text-free.
Specify, in this order:

- purpose and format
- subgenre, market, and emotional promise
- single focal subject and visible action/pose
- composition and exact title/byline zones
- environment, depth, and quiet fields
- lighting, palette, and contrast peak
- medium or rendering language
- exclusions

Typography must normally be added later.
Reserve exact quiet fields with value, detail, and light constraints, not vague “leave space” language.
Name where the title lives and where the byline lives, for example by specifying a low-detail upper band for title and a calmer lower band or margin band for byline, with no faces, hands, props, particles, architecture, or bright hotspots in those zones.

7. Render the recommendation when tools exist.

If image-generation tools are available in the current environment, generate the recommended direction and keep the prompt plus every model, size, seed, and generator detail the tool actually returns together with the output.
Do not invent metadata that the generator did not return.
Do not drop the prompt after the image is made.

8. Inspect the pixels, not just the prompt.

Review the result at full size and as a real thumbnail.
Create a separate thumbnail file—120 × 180 px for a 2:3 portrait, or the equivalent 120 px width for another ratio—and inspect it at 100% display size rather than imagining the full image smaller.
Check whether the title zone is actually quiet, the byline zone is actually usable, the differentiator survived, and the image still reads at small size.
Revise only the failures that are visible in the pixels.
If the first render misses the target, produce one corrected candidate rather than endless variants.

9. Record layout and typography notes.

The skill should leave the typography to later composition unless the user explicitly asks otherwise.
State the title zone, byline zone, and any collision risks clearly.
If the prompt can only support typography with overlays or panels later, say that directly.
Do not treat an ebook front as a print-ready full wrap.

10. Run the final validation and rights gate.

Use a short final gate:

- thumbnail silhouette and hierarchy
- greyscale/value readability
- genre and age-market recognition
- anatomy, perspective, and artefact check
- accidental letters, symbols, or logos
- technical delivery fit for the intended sales surface
- commercial-use and generator-terms check
- no living-artist imitation and no specific-cover copying

## Boundaries

- Do not reveal unpublished plot turns just to make the cover richer.
- Do not present proposed visual devices as story canon.
- Do not copy a specific existing cover.
- Do not imitate a living artist’s signature style.
- Do not use plot-collage prompts or token piles that hide the real design decision.
- Do not assume an ebook front is a print-ready wrap.

## Reference

Use `references/cover-principles.md` in this skill directory for the evidence-derived rationale, focal-strategy trade-offs, prompt anatomy, rendering review details, technical guidance, and source-role caveats.
