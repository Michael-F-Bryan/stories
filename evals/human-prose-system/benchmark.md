# Human-Prose Skill System Benchmark

## Status

Iteration 1 model grading and owner blind review are complete. The candidate won two of three owner comparisons. Michael accepted the new skill set for adoption; the quiet-aftermath loss was retained as diagnostic evidence and produced a bounded audit correction before release.

## Procedure

- Three non-canon cases: social pressure, causal action, and quiet aftermath.
- Frozen old-system scenes compared with candidate-system scenes generated in isolated composition contexts.
- Candidate drafts used `story-engine` plus positive `authors-voice` composition guidance without loading the audit, rule registry, or raw notes.
- Develop, Ground, and Audit ran later in fresh contexts.
- Only accepted material findings were repaired. Two factually false under-length findings were rejected; a later audit expansion into unchanged prose was rejected to stop a correction spiral.
- Labels were deterministically randomised independently per case.
- Three blind `gpt-5.4-mini` graders read prose only and scored the five rubric dimensions.
- Mechanical checks covered word range, unresolved placeholders, and exact high-confidence phrase flags.

## Pairwise result

All three graders preferred the candidate in all three cases:

| Case | Candidate preferences | Old preferences | Ties |
| --- | ---: | ---: | ---: |
| Social pressure | 3 | 0 | 0 |
| Causal action | 3 | 0 | 0 |
| Quiet aftermath | 3 | 0 | 0 |

Michael's blind result differed from the model graders on the quiet scene:

| Case | Michael's preference |
| --- | --- |
| Social pressure | Candidate, narrowly |
| Causal action | Candidate |
| Quiet aftermath | Old system |

The candidate therefore passed the two-of-three owner-majority threshold, but the loss matters diagnostically. Michael identified clipped negation, fragment reveals, stacked negative beats, broad interpretive narration, and figurative cleverness spent on routine explanatory work in the candidate quiet excerpt. The fresh-context prose audit had incorrectly marked that passage `good as-is`.

## Mean scores

Scores are means across three graders on a 1–5 scale.

| Dimension | Candidate | Old | Difference |
| --- | ---: | ---: | ---: |
| Genuine human texture | 4.22 | 3.22 | +1.00 |
| Desire to continue | 4.11 | 3.67 | +0.44 |
| Character specificity | 4.56 | 3.67 | +0.89 |
| Clarity without visible management | 3.89 | 4.56 | -0.67 |
| Rhythm and narrative weight | 4.11 | 3.44 | +0.67 |
| **Overall** | **4.18** | **3.71** | **+0.47** |

Per-case overall means:

| Case | Candidate | Old |
| --- | ---: | ---: |
| Social pressure | 4.33 | 3.87 |
| Causal action | 4.13 | 3.93 |
| Quiet aftermath | 4.07 | 3.33 |

## Mechanical checks

All six scenes:

- were within the required 800–1,100 words;
- contained no unresolved placeholders; and
- triggered no exact high-confidence phrase-pattern flags.

No grader identified a critical candidate regression in literal action, causality, mechanics, or prompt truth.

## Reading of the result

The candidate's strongest gains were human texture and character specificity. Graders consistently preferred scenes where concrete observation changed social leverage, physical action, or a practical decision. The old system retained a measurable clarity advantage, suggesting that the candidate sometimes makes readers infer more of the tactical or emotional logic.

After Michael's review, a fresh auditor with no access to his feedback reran the affected quiet scene against the corrected audit guidance. It independently caught the clipped explanatory cluster around the basket, stone, and inquiry as a material high-confidence defect while preserving the opening and ending as good as-is. This validates the audit correction without adding the rejected patterns to composition context.

That trade-off matters. The target is clarity without visible management, not obscurity in pursuit of subtlety. Final review should preserve the candidate's texture gains while checking whether the composition guidance or audits are encouraging implication past the point of easy first-read understanding.

## Limitations

- All three graders used the same model family as the generation subagents, so their unanimous result is correlated evidence rather than three independent human readers.
- Three synthetic scenes cannot establish long-form serial durability, chapter-to-chapter voice separation, or whether the audit remains restrained over repeated use.
- Mechanical phrase checks catch exact known shapes, not broader engineered texture.
- Michael's short-excerpt judgements are the taste authority. The unanimous model preference on quiet aftermath was wrong relative to his judgement, confirming that model graders are diagnostic evidence only.
- The quiet-aftermath audit guidance was corrected before release. Michael chose to lock the skill set without another generated-scene round.
