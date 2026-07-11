---
name: serial-process
description: The full lifecycle for writing web serials in this repo — pitching premises, worldbuilding, arc planning, the per-chapter writing loop, ledger upkeep, spoiler discipline, and session handoff. Load this before ANY planning or writing work on a serial.
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

## Lifecycle

1. **Pitch.** Write 3–4 premises as a slate in `pitches/`. Each pitch is spoiler-free back-cover copy plus: the chapter engine (what generates a satisfying chapter, repeatably), the progression axis (what grows), and the craft risks. Do not invent twists at pitch time — twists are designed during planning, inside `plan/`.
2. **Greenlight.** The owner picks a pitch and may give direction. Log it.
3. **Worldbuild.** Write the bible. The bible records what is TRUE, not what is planned — plans go in `plan/`. Keep entries evergreen; if a fact will change chapter-to-chapter, it belongs in a ledger instead.
4. **Plan arcs.** In `plan/arcs.md`: the shape of the whole serial, arc by arc — each arc's question, its climax, what it changes. Design the ending before writing chapter 1. Plant-and-payoff pairs get designed here and tracked in `ledgers/promises.md` once planted on the page.
5. **Write chapters** using the chapter loop below.
6. **Retrospective** when the serial concludes: audit `promises.md` for dropped threads, reread the log, and honestly assess the four evaluation criteria — including whether this process helped or got in the way.

## The chapter loop

Run this ritual for every chapter, in order:

1. **Load state.** Read `handoff.md`, all four ledgers, the arc outline for the current arc, and the previous chapter in full (the previous two if returning after a long gap).
2. **Fold in feedback.** Check the log for owner feedback since the last chapter. Feedback is direction, not suggestion — it shapes this chapter's plan, and the response to it gets noted in the log.
3. **Plan the chapter.** A short beat plan (in the session, not committed) that must state: the chapter's own mini-resolution, what it advances in the current arc, any promises planted or paid off, and the closing beat — a question or turn that pulls toward the next chapter without cheap cliffhanging every time.
4. **Draft** in the authors-voice skill's style. Target 2,000–3,500 words unless the chapter demands otherwise.
5. **Revision pass.** Reread the full draft for prose quality against the authors-voice checklist. Fix, don't excuse.
6. **Adversarial review.** Spawn an independent sub-agent to attack the draft: banned patterns and the slack rule, clarity/momentum, scene contracts, voice differentiation, canon/mechanics honesty (numbers audit!), genre pleasure. It must quote exact text, rank findings by severity, and state what passes so it doesn't get fixed away. Apply must-fixes and should-fixes; log the outcome. (Added after ch. 1 of Support Build, where this step caught a broken timeline, an empty demo, and an out-of-character beat.)
7. **Continuity check.** Verify the draft against all four ledgers and the bible: no contradicted facts, no character knowing something `knowledge.md` says they don't, names/dates/details consistent. Fix the draft, not the ledger — unless the ledger was wrong, in which case log it.
8. **Update the ledgers.** Timeline entry for the chapter; knowledge changes; character-state changes; promises planted or paid (with chapter numbers).
9. **Log.** Append to `works/<serial>/log.md`: date, chapter number, what was asked, notable decisions, anything the next session should know the reasoning behind.
10. **Handoff.** Overwrite `handoff.md`: where the story stands, what the next chapter needs to do, any warnings (threads going stale, pacing debt).
11. **Commit** the chapter, ledger updates, log entry, and handoff together. Commit message: chapter number and title only — no plot details. If the owner is reviewing via PR, the chapter goes to a side branch and the PR description carries no plot details either.

## Ledger discipline

- `timeline.md` — one entry per chapter: the events, in order, as published.
- `knowledge.md` — organized by character: what they know, when they learned it (chapter), and what they *wrongly believe*. This is what the writer is allowed to assume the READER knows too — if it isn't on the page yet, it isn't known.
- `character-state.md` — each significant character's current arc position: wants, wounds, relationships, capabilities. Update when it moves.
- `promises.md` — a table: what was planted, chapter planted, intended weight (minor/major), status (open/paid/abandoned), chapter paid. Every mysterious object, unexplained event, and foreshadowed threat goes here the moment it appears on the page. Review the open list during every chapter plan.

## Spoiler discipline

The owner reads spoiler-free. `plan/` is never quoted, summarized, or referenced in chat, commits, READMEs, or logs (`log.md` may say "planned a payoff for the ch. 3 promise" but not what it is). When discussing the story with the owner, published chapters are the only citable canon.

## Process evolution

This process is itself under evaluation. When friction appears — continuity errors slipping through, ledgers growing unwieldy, the loop missing a step — change the process: edit this skill, add a specialized skill, restructure a ledger. Make the change in its own commit with the reasoning in the repo-level `log.md`. Do not silently deviate; either follow the process or improve it.
