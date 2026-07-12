# Cover principles for crafting-fantasy-cover-art

This reference condenses the research synthesis, baseline failures, and rendered-image review into reusable guidance for fantasy cover work.
It is the rationale behind the skill, not a separate prompt cookbook.

## What changed the design target

The text-only baseline was already competent at the broad fantasy job: it understood reader contract, subgenre signalling, focal discipline, and the need for cover-aware prompts.
The pixel review exposed the missing layer: the model often ignored the intended quiet title and byline spaces, translated distinctive hooks into broader fantasy shorthand, and introduced hotspot competition that looked acceptable in text but failed in rendered images.

That means the skill cannot stop at “good prompt wording.”
It has to produce a concept package, render at least the recommendation when image tools exist, and inspect what the pixels actually did.

## Durable principles that still hold

### 1. Reader contract first

A fantasy cover is packaging, not synopsis art.
The first task is to state who the book is for, what shelf it belongs on, what emotional promise it makes, and what differentiator must be visible.
If those pieces are not explicit, the prompt tends to drift into generic fantasy imagery.

### 2. Choose the precise shelf

“Fantasy” is too broad for reliable cover decisions.
Epic fantasy, progression fantasy, urban fantasy, cosy fantasy, dark fantasy, YA fantasy, and romantasy share tools but not the same signals.
The skill therefore asks for a current comparable-cover scan when market fit matters.
If that scan is unavailable, the skill should say so and fall back to durable principles rather than pretending current trend knowledge.

### 3. One dominant focal idea beats a collage

A cover can centre a character, an environment, an object, or a creature, but the viewer should not have to choose between five equally weighted ideas.
The job is familiar structure plus a distinctive hook.
That hook is what keeps the art from becoming generic.

### 4. Artwork must be built around later typography

The art layer is not the whole cover.
It has to leave controlled space for title and byline, with enough quiet value and detail separation that typography can be added later.
A vague “leave space” request is not enough.
The prompt must identify an exact quiet field and say what cannot intrude there.

### 5. Palette and contrast are a system

One dominant palette family plus one accent usually reads better than many competing colours.
Value contrast should peak where the focal point needs it, not where a stray effect looks dramatic in isolation.
If the image collapses in greyscale, the hierarchy is weak.

### 6. Typography is usually separate

Generated lettering is unreliable and often forces the model to spend capacity on text instead of image structure.
The safer default is text-free artwork, then later composition of title, series line, and byline.
The skill may describe typography direction, but it should not usually ask the model to spell the title.

### 7. Thumbnail recognition is a hard gate

A cover is usually first seen small.
At thumbnail size, the cover must still show one readable subject or symbol, a clear light/dark pattern, and the intended mood.
If the thumbnail is muddy, the answer is not more detail.
It is simplification, stronger contrast, cleaner silhouette, or a better focal strategy.

## Focal-strategy trade-offs

### Character-led

Best when the book sells personality, competence, power fantasy, relationship tension, or direct adventure.
It works well when the protagonist’s silhouette can carry the image alone.
Risk: it can drift into generic hero packaging if the differentiator is not visible in the pose, tool, or expression.

### Environment-led

Best when the book sells scale, wonder, journey, danger, or world immersion.
It works when the setting itself is the promise.
Risk: the cover can become scenic wallpaper unless a human or symbolic anchor keeps it grounded.

### Symbol/object-led

Best when the book sells mystery, lore, elegance, or a more literary register.
It works when the object can stand in for the premise.
Risk: the image can become too abstract, too quiet, or too generic if the object does not clearly map to the book’s differentiator.

### Creature-led

Best when the book sells spectacle, danger, or a strongly fantastical premise.
It works when the creature is unmistakable at small size.
Risk: it can crowd out the title zone and overpower the rest of the composition.

## What the rendered baselines taught us

### Support Build

The rendered cover had good hierarchy but failed the promised quiet title field and lower byline area.
The brightest ceiling light competed with the focal point.
The image read more as a powerful shield caster than as a distinct support-role or rules-mastery concept.
Lesson: a prompt must reserve quieter fields more aggressively, and the differentiator has to appear as a visible action or symbol, not just a premise label.

### Aqueduct engineer

The aqueduct itself rendered strongly, and the adult register was clear.
But the engineering hook collapsed into “man with tools on a giant bridge.”
Water-pressure mechanics were not visible, and the prompt had not controlled typography space or accent colour.
Lesson: infrastructure can carry an epic shelf, but the differentiator still needs a visible mechanism or action.

### Travelling night market

This was the best at title space: the upper sky was genuinely quiet and useful.
But the lower byline area was still too busy, and the lantern created a mild hotspot.
The cosy fantasy signal was strong, but the family-fantasy drift remained a risk at small size.
Lesson: age-market register must be checked in pixels, not just described, and byline space often needs separate treatment from title space.

## Prompt anatomy

A prompt should read like a compact art brief, not a token pile.
Order the information from highest priority to lowest priority:

1. purpose and format
2. subgenre, age market, and emotional promise
3. focal subject and visible action
4. composition and exact title/byline zones
5. environment and depth
6. lighting, palette, and contrast
7. medium or rendering language
8. exclusions and failure controls

The strongest prompts say what the art is for, what it must communicate, where visual activity belongs, and where it must not go.
They also define the title and byline zones by value, detail, and light, not just by empty-space language.

## Rendering and review workflow

When image tools exist, the recommended direction should be generated, preserved, and reviewed.
The review should happen at full size and on a separate thumbnail file viewed at 100% display size: use 120 × 180 px for a 2:3 portrait, or preserve the ratio at 120 px wide.
Look specifically for:

- whether the title zone is actually quiet
- whether the byline zone is actually usable
- whether the differentiator survived the render
- whether any hotspot competes with the focal point
- whether the age-market register still reads correctly
- whether accidental glyphs, logos, or weird textures appeared
- whether the figure, object, or architecture still makes visual sense

If the review finds a visible problem, revise only the visible problem.
Do not wander into new concept territory just because a render exists.
If the first render is materially off, produce one corrected candidate and compare it against the failure.

## Technical guidance

### Ebook front cover versus print wrap

An ebook cover is not a print wrap.
Ebook work should be sized for the sales surface and kept separate from spine and back-cover production.
Do not let the skill pretend the front panel is the whole print product.

### Metadata and reproducibility

When generating art, preserve the prompt, model, size, seed, and any other generator metadata that helps reproduce or audit the result.
Without those details, later refinement becomes guesswork.

### Delivery checks

The exact technical target depends on the sales surface, but the check should always cover the intended ratio, file format, and platform limits.
The skill does not need to restate platform specs in full every time, but it should verify that the output fits the intended use.

## Source-role caveats

### Durable principles versus current trends

The synthesis draws on practitioner guidance with strong agreement on reader contract, focal discipline, hierarchy, and thumbnail readability.
Those principles are durable.
Palette fashion, motif frequency, and subgenre styling move faster and should be refreshed with a recent comparable-cover scan when the market matters.

### Practitioner advice is not law

Designer and marketplace sources are useful because they reflect how covers are actually sold and read.
But they are still advice, not universal truth.
Use them to shape the brief, not to enforce one rigid aesthetic.

### Invention labelling is separate from spoiler safety

A cover may need visual inventions that are not explicit in the supplied brief.
That is fine, as long as the skill labels them as proposed cover devices rather than canon facts.
Spoiler-safe sourcing is a different question: do not reveal unpublished plot turns merely to improve the art.

### Rights and imitation

Do not imitate a living artist’s signature style.
Do not reverse-engineer a specific existing cover.
Do not rely on prompt padding or token piles to dodge the design decision.
Check the generation service’s commercial-use terms before publication.

## Bottom line

The skill should keep the output compact, decision-oriented, and cover-aware.
The user needs a reader brief, a comparison of a few genuinely different directions, one recommendation, a text-free prompt that reserves typography properly, and a pixel review that catches what the wording missed.
