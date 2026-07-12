# Human-Prose Skill System Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the correction-heavy two-skill fiction workflow with a tested three-skill spine that generates prose from character pressure and attention before applying corrective audits.

**Architecture:** Keep `serial-process` as the authoritative coordinator, add `story-engine` as the owner of positive dramatic design and generation packets, and refactor `authors-voice` into selectively loaded composition and audit modes. The draft context must not load the full defect registry. Qualitative changes are adopted only after blinded old-versus-candidate comparisons and independent review.

**Tech stack:** Agent Skills Markdown, JSON evaluation fixtures, Hermes `gpt-5.4-mini` subagents for bounded generation and review.

---

## Constraints

- Work only on branch `feat/human-prose-system` in `.worktrees/human-prose-system/`.
- Preserve the spoiler protocol and all published-page/ledger honesty rules.
- Keep three skills only: `serial-process`, `story-engine`, and `authors-voice`.
- Do not create separate reviewer skills.
- Keep the full defect registry out of composition context.
- Preserve the original reader-visible defect and provenance when consolidating or reframing a rule.
- No live-story prose changes in this process-change branch.
- Evaluate skill changes through focused review, real context-loading behaviour, and blind prose trials. Do not encode Markdown wording or heading structure as JavaScript tests.

## Task 1: Capture the baseline and review contract

**Files:**
- Create: `evals/human-prose-system/evals.json`
- Modify: `log.md`

**Steps:**

1. Define three non-canon evaluation scenarios: social dialogue, causal action, and emotional aftermath.
2. Record a review checklist requiring:
   - `.claude/skills/story-engine/SKILL.md`;
   - a compact generation-packet contract;
   - `authors-voice/references/compose.md` and `audit.md`;
   - `authors-voice/references/rule-registry.md`;
   - selective mode loading and no full defect catalogue in the main voice router;
   - `serial-process` stage order: state → design → compose → develop → ground → audit → update;
   - clear ownership boundaries and spoiler discipline.
3. Dispatch all three evaluation prompts against the current skills. Save outputs under ignored `_working/skill-system-evals/iteration-1/<case>/old-system/`.
4. Record timing and agent self-reported process notes separately from final prose.
5. Commit plan, baseline fixtures, and log entry.

## Task 2: Implement `story-engine`

**Files:**
- Create: `.claude/skills/story-engine/SKILL.md`
- Create: `.claude/skills/story-engine/references/generation-packet.md`
- Create: `.claude/skills/story-engine/references/developmental-read.md`

**Steps:**

1. Write a compact skill router whose description triggers on premise, arc, chapter, scene, pacing, character pressure, reader pull, and developmental review work.
2. Define one generation packet containing reader pull, promise movement, character pressure, attention field, causal spine, shape choice, explanation budget, and voice anchors.
3. Define developmental review as diagnosis only: exact evidence, reader consequence, materiality, owning layer, and `good as-is`.
4. State that story-engine cannot adjudicate canon or rewrite prose.
5. Run a focused spec review and an independent quality/adoption-safety review.
6. Commit as `feat: add positive story generation engine`.

## Task 3: Refactor `authors-voice` into isolated modes

**Files:**
- Modify: `.claude/skills/authors-voice/SKILL.md`
- Create: `.claude/skills/authors-voice/references/compose.md`
- Create: `.claude/skills/authors-voice/references/audit.md`
- Create: `.claude/skills/authors-voice/references/rule-registry.md`
- Preserve: `.claude/skills/authors-voice/references/michaels-voice-notes.md`

**Steps:**

1. Replace the large main skill with a compact mode router and shared voice contract.
2. Put positive composition guidance in `compose.md`: character-owned attention, social action beneath dialogue, uneven narrative weight, ordinary connective tissue, clear causal action, and genre pleasure.
3. Put corrective checks in `audit.md`: exact-text evidence, severity, reader consequence, smallest repair, and permission to pass.
4. Move existing reader-taught rules into `rule-registry.md` with defect, provenance, scope, exceptions, and status.
5. Keep the raw owner calibration notes unchanged as evidence.
6. Verify the compose reference does not contain the full banned-pattern catalogue or mechanical structural budgets.
7. Run a focused spec review and an independent quality/adoption-safety review.
8. Commit as `refactor: separate prose composition from audit`.

## Task 4: Refactor `serial-process` as coordinator

**Files:**
- Modify: `.claude/skills/serial-process/SKILL.md`
- Modify: `CLAUDE.md`

**Steps:**

1. Keep lifecycle, filesystem layout, spoiler discipline, canonical state, ledgers, handoff, logs, and commits in `serial-process`.
2. Route story design and developmental review to `story-engine`.
3. Route composition and prose audit to the isolated `authors-voice` modes.
4. Replace broad adversarial review with named developmental, canon/reader-knowledge, and prose-audit gates.
5. Require material edits to reopen only affected gates.
6. Update `CLAUDE.md` triggers so all three skills load at the correct stages.
7. Run a focused spec review and an independent quality/adoption-safety review.
8. Commit as `refactor: coordinate three-stage fiction workflow`.

## Task 5: Run candidate and blind evaluations

**Files:**
- Create ignored outputs under `_working/skill-system-evals/iteration-1/`
- Create: `evals/human-prose-system/rubric.md`
- Create: `evals/human-prose-system/benchmark.md`

**Steps:**

1. Dispatch the same three prompts against the candidate skills, one fresh subagent per case.
2. Verify output files and capture timings.
3. Randomise old/candidate labels deterministically into comparison pairs without revealing the mapping to graders.
4. Run independent graders on human-feeling prose, desire to continue, character specificity, clarity without visible management, rhythm, and regressions against known defects.
5. Run mechanical checks for word count, unresolved placeholders, banned high-confidence phrase patterns, and output shape.
6. Aggregate results and analyse variance rather than relying on a single win.
7. If the candidate loses or merely shifts defects, revise the smallest owning skill and rerun the affected case.
8. Record final benchmark and honest limitations.

## Task 6: Final integration and review

**Files:**
- Modify: `log.md`
- Modify: any skill file only for verified review findings

**Steps:**

1. Dispatch a spec-compliance review against the approved architecture.
2. Resolve all Blocker and Important findings, then rerun spec review.
3. Dispatch a quality/adoption-safety review covering duplication, trigger clarity, context separation, spoiler safety, and over-constraint.
4. Resolve all Blocker and Important findings, then rerun quality review.
5. Run `pnpm test` and `pnpm build` for the repository's executable publishing behaviour.
6. Run `git diff --check` and inspect the complete branch diff.
7. Append an honest process entry to `log.md` with evaluation results and adoption decision.
8. Commit final review changes as a task-scoped process commit.
9. Use the finishing-development-branch workflow; do not auto-merge.

## Evaluation acceptance gates

The candidate may be adopted only when:

- focused skill reviews pass;
- all three skills have one authoritative responsibility;
- the composition context excludes the full defect registry;
- candidate output wins a majority of blind pairwise judgements overall;
- it does not regress literal clarity, scene causality, or high-confidence reader-taught defects;
- no final review has open Blocker or Important findings; and
- full repository tests and build pass.
