---
name: serial-process
description: Use when any serial work needs lifecycle, state, spoilers, ledgers, handoff, logs, or commit discipline. It owns planning, grounding, and updates; story-engine owns story design and developmental review; authors-voice owns composition and prose audit.
---

# The serial process

A web serial publishes one chapter at a time. That format imposes two duties on every chapter: it must resolve something on its own (a reader who got only this chapter should feel it went somewhere), and it must advance the larger arc it belongs to. This process exists to make both happen reliably across dozens of chapters written in separate sessions with no shared memory except these files.

## Layout of a work

```
works/<serial-name>/
  README.md              # premise (spoiler-free), status, steering notes
  handoff.md             # state of play for the next session — overwritten each cycle
  plan/                  # SPOILERS. The owner never reads this directory.
    pitch.md             # the chosen pitch, expanded: full premise, intended ending
    arcs.md              # arc-level outline: twists, reveals, where arcs end
  bible/                 # evergreen canon — slow-changing truths
    world.md             # geography, history, cosmology
    mechanics.md         # how the magic/power system works, its rules and costs
    characters.md        # backstories, personalities, voices, appearance
    factions.md          # groups, their goals, their relationships
  ledgers/               # fast-changing state — updated after EVERY chapter
    timeline.md          # what has happened, chapter by chapter
    knowledge.md         # who knows what — and who wrongly believes what
    character-state.md   # where each character's arc currently sits
    promises.md          # every setup awaiting payoff
  chapters/
    001-chapter-title.md
  log.md                 # lab notebook: prompts, feedback, decisions, tasks
  retrospective.md       # written when the serial ends or is abandoned
```

Each published chapter starts with metadata rather than an in-body H1:

```yaml
---
index: 1
title: Chapter Title
description: "A short, spoiler-safe description for listings and social cards."
---
```

`index` must match the numeric filename prefix. `title` contains only the title, without the chapter number. The Markdown body starts with prose; the publisher supplies the visible heading and recreates EPUB headings from this metadata.

## Lifecycle

1. **Pitch.** Write 3–4 premises as a slate in `pitches/`. Each pitch is spoiler-free back-cover copy plus: the chapter engine (what generates a satisfying chapter, repeatably), the progression axis (what grows), and the craft risks. Do not invent twists at pitch time — twists are designed during planning, inside `plan/`.
2. **Greenlight.** The owner picks a pitch and may give direction. Log it.
3. **Worldbuild.** Write the bible. The bible records what is TRUE, not what is planned — plans go in `plan/`. Keep entries evergreen; if a fact will change chapter-to-chapter, it belongs in a ledger instead.
4. **Plan arcs.** Use `story-engine` to design `plan/arcs.md`: the shape of the whole serial, arc by arc — each arc's question, its climax, what it changes. Design the ending before writing chapter 1. Plant-and-payoff pairs get designed here and tracked in `ledgers/promises.md` once planted on the page.
5. **Write chapters** using the chapter loop below.
6. **Retrospective** when the serial concludes: audit `promises.md` for dropped threads, reread the log, and honestly assess the four evaluation criteria — including whether this process helped or got in the way.

## The chapter loop

Run this ritual for every chapter, in order:

### 1. State

Read `handoff.md`, all four ledgers, the arc outline for the current arc, and the previous chapter in full (the previous two if returning after a long gap). Treat the ledgers as the canonical state for fast-changing facts. Keep `plan/` private; only published chapter text can be cited as reader knowledge.

### 2. Design

Use `story-engine` to shape the chapter before prose exists. It owns the chapter's mini-resolution, arc movement, promise movement, reader pull, and developmental questions. Keep the packet compact; do not turn this into a new checklist or load any voice registry.

### 3. Compose

Draft in `authors-voice composition mode` from the approved design packet. Keep the chapter's voice, scene movement, and line-level choices inside `authors-voice`; do not load the rule registry while composing.

### 4. Develop

Run `story-engine` developmental review on the draft. It diagnoses causal movement, agency, structural repetition, promise movement, and reader anticipation. It does not rewrite prose or rule on canon. Apply only the accepted fixes, then rerun this gate if the draft changed materially.

### 5. Ground

Run the canon/reader-knowledge gate against the bible, the ledgers, and the published chapter text. Use published chapter text, not the bible, to decide what the reader knows. Keep Ledger honesty: `knowledge.md` and `promises.md` record only what a published page established. If this gate finds a contradiction or spoiler leak, fix the draft and reopen only the affected gates.

### 6. Audit

Run `authors-voice audit mode` on the final prose. This is a prose audit, not a new design review. If edits are required, reopen only the affected gates; prose re-audit is limited to materially changed passages. Do not audit unchanged text again just because earlier gates revised nearby material.

### 7. Update

Update the ledgers: timeline entry for the chapter; knowledge changes; character-state changes; promises planted or paid (with chapter numbers). Then append to `works/<serial>/log.md`, overwrite `handoff.md`, and commit the chapter, ledger updates, log entry, and handoff together. Commit message: chapter number and title only — no plot details. If the owner is reviewing via PR, the chapter goes to a side branch and the PR description carries no plot details either.

## Ledger discipline

- `timeline.md` — one entry per chapter: the events, in order, as published.
- `knowledge.md` — organized by character: what they know, when they learned it (chapter), and what they *wrongly believe*. It tracks character knowledge, not a shortcut to reader knowledge. Treat a fact as shared with the reader only after published prose establishes it.
- `character-state.md` — each significant character's current arc position: wants, wounds, relationships, capabilities. Update when it moves.
- `promises.md` — a table: what was planted, chapter planted, intended weight (minor/major), status (open/paid/abandoned), chapter paid. Every mysterious object, unexplained event, and foreshadowed threat goes here the moment it appears on the page. Review the open list during every chapter plan.

## Spoiler discipline

The owner reads spoiler-free. `plan/` is never quoted, summarized, or referenced in chat, commits, READMEs, or logs (`log.md` may say "planned a payoff for the ch. 3 promise" but not what it is). When discussing the story with the owner, published chapters are the only citable canon.

## Process evolution

This process is itself under evaluation. When friction appears — continuity errors slipping through, ledgers growing unwieldy, the loop missing a step — change the process: edit this skill, add a specialized skill, restructure a ledger. Make the change in its own commit with the reasoning in the repo-level `log.md`. Do not silently deviate; either follow the process or improve it.
