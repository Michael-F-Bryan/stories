# Plan: Make Support Build Chapter 7 an exciting team-combo climax

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. Use the repository-local `serial-process`, `story-engine`, and `authors-voice` skills in their documented modes. If anything in “STOP conditions” occurs, stop and write a handback rather than improvising.
>
> **Drift check (run first)**: `git diff c5fa55b9bdeae28a70db1d76fb5b507640cab4db -- works/support-build/chapters/006-the-sluice.md works/support-build/chapters/007-counterweight.md works/support-build/chapters/008-passenger.md works/support-build/chapters/009-morrow-yard.md works/support-build/ledgers works/support-build/handoff.md works/support-build/log.md`
> Expected before implementation: no source changes in these paths beyond the design-review log entry already committed at the planned revision. If chapter, ledger, or handoff content differs, stop and reconcile the design against the live files.

## Status

- **Effort**: M
- **Risk**: HIGH
- **Depends on**: `docs/superpowers/specs/2026-07-14-support-build-chapter-7-excitement-revision-design.md`
- **Planned at**: revision `c5fa55b9bdeae28a70db1d76fb5b507640cab4db`, 2026-07-14

## Why this matters

Chapter 7 currently resolves the first C-grade clear correctly but spends too long on stretcher geometry, gives rookie Ren implausible command authority, and underuses the party’s established skills. The approved revision must turn the crane guardian into a clear, fast three-turn team fight under Cass’s command while preserving skill-text honesty, the first-symptom stop rule, Ilyas’s danger, and the published aftermath.

## Current state

- `works/support-build/chapters/006-the-sluice.md:53-139` makes Ren carry Hold Fast’s upkeep, reach tunnel vision, release Carry, and stop all skill use before Chapter 7.
- `works/support-build/chapters/007-counterweight.md:7-57` inspects the crane and rigs the stretcher before the guardian attacks.
- `works/support-build/chapters/007-counterweight.md:103-107` lets Ren assign Doc, Theo, Juno, Pip, and Cass their battle roles while Cass merely nods.
- `works/support-build/chapters/007-counterweight.md:121-155` uses Mark and heat, but the fight is not shaped around an interdependent skill combo.
- `works/support-build/chapters/008-passenger.md:171-175` currently says Ren reached tunnel vision at the sluice and then moved the stretcher without later skill use.
- `works/support-build/chapters/009-morrow-yard.md` establishes the next-day medical clearance and later named techniques. Preserve those beats unless a sentence becomes literally false.
- Exact Attendant and roster skill text lives in `works/support-build/bible/mechanics.md:69-105`. Published prose and ledgers, not unpublished planning, govern reader knowledge.
- The approved and adversarially revised dramatic design is `docs/superpowers/specs/2026-07-14-support-build-chapter-7-excitement-revision-design.md`.
- Prose composition follows `.agents/skills/authors-voice/references/compose.md`; the fresh-context final audit follows `.agents/skills/authors-voice/references/audit.md` and `rule-registry.md`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `pnpm test` | all Node tests pass |
| Complete build | `pnpm build` | site, EPUB, and output verification complete successfully |
| Whitespace | `git diff --check` | exit 0, no output |
| Working tree | `git status --short` | only intended in-scope files before commit; clean after commit |
| Chapter metadata/build presence | `test -f _site/support-build/007-counterweight/index.html` | exit 0 |

## Scope

**In scope**:

- `works/support-build/chapters/006-the-sluice.md`
- `works/support-build/chapters/007-counterweight.md`
- `works/support-build/chapters/008-passenger.md` only for the smallest factual bridge correction
- `works/support-build/chapters/009-morrow-yard.md` only if a sentence becomes literally false
- `works/support-build/ledgers/timeline.md`
- `works/support-build/ledgers/knowledge.md`
- `works/support-build/ledgers/character-state.md`
- `works/support-build/ledgers/promises.md` only if an existing promise entry becomes false
- `works/support-build/handoff.md`
- `works/support-build/log.md`

**Out of scope**:

- `works/support-build/plan/` — unpublished plans remain sealed and unchanged
- `works/support-build/bible/` — no canon rule changes are approved
- repository skills or process rules — this change implements the approved story design, not a new process
- Chapters 1–5 — no scene in them depends on the revised Focus timing
- publishing code, tests, or site styling — build artefacts may regenerate, but source tooling must not change

## Steps

### Step 1: Adjust Chapter 6’s Focus handoff

Revise only the doorkeeper sequence and immediate medical check needed to leave Ren with one bounded activation for the crane:

- Carry still takes Hold Fast’s upkeep and visibly costs Ren.
- Ren releases at a clear pre-symptom warning rather than formal tunnel vision.
- Cass and Doc preserve the safety doctrine: one short activation remains available only if Cass judges it necessary, and Ren must release at the first recognised symptom.
- Keep Cass’s shoulder injury, the doorkeeper victory, the stair climb, the broken return route, and the crane route reveal unchanged.

Do not invent a new Focus symptom. Use ordinary strain before the established tunnel-vision threshold.

**Verify**: read the revised Chapter 6 in full and confirm there is no claim that Ren has tunnel vision, is done until tomorrow, or arrives at the crane with all skills prohibited; `git diff --check` exits 0.

### Step 2: Rewrite Chapter 7 around three causal turns

Use the approved design, not the current chapter’s tactical sequence, as the source of shape:

1. Open on the guardian’s first hook attack. Reveal crane geometry only as it changes an immediate action.
2. Cass commands the team. Ren reports one precise mechanical/support observation; Cass turns it into the order.
3. Keep Ilyas on the crane, take the machine away from the guardian, then break control and clear the Gate.

Required outcomes:

- Several established skills are causally necessary, but the scene does not pause for one showcase per roster member.
- Escort is a short, expensive crossing on existing steel. It prevents Theo from stumbling; it does not preserve the structure or negate impact.
- Ren reaches tunnel vision during or immediately after Escort, reports it, releases, and uses no further System skills.
- Ren remains necessary after the stop through the physical counterweight save. The rope work happens under attack and produces the already-published raw palms.
- Cass remains commander. Ren never assigns the whole team their attacks.
- Ilyas remains medically endangered. Doc’s judgement controls stretcher movement.
- Use at most one or two pressure-release lines after reversals.
- Preserve the Core break, aperture exit, official CLEAR, medical handoff, and all six Grave Society members returning.

Aim for clear phone-readable action rather than a fixed word count. A longer chapter is acceptable only when the added words are action, choice, or consequence rather than route explanation.

**Verify**: read Chapter 7 aloud; a cold reader must be able to state the three turns, who commanded, what Ren contributed before and after stopping, and why the skills combined to win. `git diff --check` exits 0.

### Step 3: Repair only literal downstream continuity

Inspect Chapters 8–9 and all four ledgers against the revised Chapter 6–7 text.

- Correct Chapter 8’s account of where Ren used Escort and where tunnel vision began.
- Preserve the public “passenger” misread, absent interior footage, medical restriction, later technique labels, and later emotional beats.
- Do not touch Chapter 9 unless the revised sequence makes a sentence literally false.
- Update timeline, knowledge, character-state, promises if needed, and handoff from published text only.
- Append an honest implementation/review entry to `works/support-build/log.md`.

**Verify**: search the in-scope files for `tunnel vision`, `done until tomorrow`, `crane`, `Escort`, and `passenger`; inspect every hit for consistency. `git diff --check` exits 0.

### Step 4: Run an independent developmental review

Start a fresh reviewer context with `story-engine/references/developmental-read.md`. Review Chapters 6–7 together against the approved design and Michael’s feedback.

The review must challenge:

- opening speed and excitement;
- causal three-turn shape rather than checklist coverage;
- Cass’s command authority;
- Ren’s meaningful agency without implausible command;
- team skills being necessary and fun;
- distinction from Chapter 6’s doorkeeper fight and Chapter 9’s later competence clear;
- seriousness of Ilyas’s extraction;
- earned release at CLEAR.

Apply only accepted structural findings, then rerun the developmental gate if the causal spine changes materially.

**Verify**: the reviewer returns `good as-is` or all material findings are repaired and the affected gate is rerun.

### Step 5: Run an independent grounding review

Use a fresh reviewer against Chapters 6–9, `bible/mechanics.md`, `bible/characters.md`, the ledgers, and handoff.

Check exact skill text, Escort’s meaning, Focus order and recovery, injuries, party boundaries, crane geometry, rope/stretcher handling, Core access, lost camera, timeline, inventory, and every downstream account of Ren’s contribution.

Apply accepted repairs narrowly. Reopen developmental review only if a repair changes scene shape or agency.

**Verify**: grounding returns PASS with no material canon, mechanics, inventory, timing, knowledge, or downstream-continuity finding.

### Step 6: Run fresh-context prose audit and ordinary-reader review

Run the repository’s authors-voice audit on only materially changed prose, then a separate ordinary-reader review without the design checklist.

The ordinary reader should answer:

- Did the chapter start quickly?
- Was the fight easy to picture?
- Did it feel exciting and fun rather than engineered?
- Did Cass feel like the captain?
- Did Ren matter before and after his skill stop?
- Did Ilyas remain a serious rescue stake?
- Did CLEAR feel earned?

Apply accepted line-level findings without reopening settled structural choices. Rerun audit on materially changed passages.

**Verify**: authors-voice audit returns `good as-is` or all material findings are repaired; ordinary-reader review has no material boredom, clarity, command, protagonist, tone, or payoff finding.

### Step 7: Verify, log, and commit the revision

Run:

```bash
pnpm test
pnpm build
test -f _site/support-build/007-counterweight/index.html
git diff --check
git status --short
```

Read final Chapters 6–9 from disk after all reviewers finish. Confirm frontmatter remains valid and no drafting/review scaffolding entered published prose.

Commit the complete story revision, ledgers, handoff, and log as one logical chapter-revision unit. Do not include design/plan commits in the prose commit; they are already separate.

Suggested commit message: `Chapter 7: Counterweight`

**Verify**: `git status --short --branch` shows a clean branch ahead of `origin/main`; `git log -1 --oneline` shows the chapter revision commit.

## Test plan

- Existing Node tests: `pnpm test`.
- Complete publication build and generated-output verification: `pnpm build`.
- Fresh developmental review of Chapters 6–7.
- Fresh canon/mechanics grounding review of Chapters 6–9 and state files.
- Fresh authors-voice audit of changed prose.
- Independent ordinary-reader review focused on enjoyment rather than checklist compliance.
- Final on-disk read after all review edits.

## Done criteria

- [ ] Chapter 6 preserves one bounded activation without breaking Focus doctrine.
- [ ] Chapter 7 opens on attack and follows three causal turns.
- [ ] Cass commands; Ren contributes without commanding veterans.
- [ ] Established skills causally combine without a roster-checklist feel.
- [ ] Ren’s Escort costs enough to trigger tunnel vision, after which he stops.
- [ ] Ren’s physical counterweight save remains decisive after the stop.
- [ ] Ilyas remains a serious rescue stake.
- [ ] Chapters 8–9 and all state files are literally consistent.
- [ ] Independent Develop, Ground, prose audit, and ordinary-reader gates pass.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] `git diff --check` passes.
- [ ] Final working tree is clean after commit.

## STOP conditions

Stop and write a handback if:

- Honest Escort use would require Ren not to accompany Theo, would protect against structural failure, or would contradict its published text.
- Preserving one Chapter 7 activation requires inventing a new Focus symptom or changing the recovery rules.
- Crane geometry cannot be made clear without returning to an extended pre-fight route explanation.
- A downstream continuity repair requires changing Chapter 9’s major scene or public result.
- A review finding requires hidden-plan material to justify the prose.
- The work appears to require editing the bible, repository skills, publishing code, or Chapters 1–5.
- Any verification gate fails twice after a reasonable repair.

On stopping, write a handback with the current state, desired outcome, and unresolved fork. Do not choose a new design silently.

## Maintenance notes

Future chapters may reference the first C-grade clear through the revised published text and ledgers only. Preserve the distinction between Ren making a precise support observation and Cass exercising command. The key mechanical precedent is narrow: Escort can support a fast crossing over existing footing at terrain-scaled Focus cost; it does not stabilise the environment.
