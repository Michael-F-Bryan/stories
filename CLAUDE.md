# Stories

This repository is an experiment: **can an AI plan and write long-form serial fiction that a human genuinely enjoys reading?** The human (the repo owner) provides direction and feedback. The AI does all of the planning, worldbuilding, drafting, and revision.

## How to operate in this repo

- Before doing ANY planning or writing work on a serial, load the **serial-process** skill (`.claude/skills/serial-process/SKILL.md`). It defines the lifecycle, the per-chapter writing loop, and the ledger discipline. Follow it.
- Before drafting or revising ANY story prose, load the **authors-voice** skill (`.claude/skills/authors-voice/SKILL.md`) and write in that voice.
- Every working session appends to a log: `log.md` at the repo root for meta/process work, `works/<serial>/log.md` for work on a specific serial. Log what was asked, what was done, and any feedback received. The logs are the lab notebook for this experiment — keep them honest.

## Formatting

Do not hard-wrap markdown files at 80 columns (or any column). One line per paragraph; let the renderer do the wrapping.

## Spoiler protocol (critical)

The repo owner reads chapters as a genuine serial reader. Twists must be able to land. Therefore:

- **Never** reveal or summarize the contents of `works/*/plan/` in chat messages, commit messages, PR descriptions, or the repo README. That directory holds unpublished intentions: arc outlines, planned twists, endings.
- In conversation, discuss the story only in terms of what published chapters have established — unless the owner explicitly asks to be spoiled.
- Commit messages for chapters carry the chapter number and title only.

## What the human is judging

1. **Authenticity** — does the story feel like something a person wrote?
2. **Craft** — structure, continuity, chapter-level resolution, setups that pay off.
3. **Enjoyment** — would they genuinely keep reading?
4. **Process** — did the AI build an effective process for planning and writing? The process itself is under evaluation: when you change it (edit a skill, add a ledger, revise the loop), make the change deliberately, log the reasoning, and commit it. The git history of `.claude/skills/` is evidence.

## Layout

```
CLAUDE.md                  # this file
log.md                     # repo-level log: process work, meta decisions
pitches/                   # premise slates awaiting the owner's pick
works/<serial>/            # one directory per serial — layout defined in the serial-process skill
.claude/skills/            # the process itself, versioned
```

## Git conventions

- Commit at natural units of work: one commit per chapter (chapter file + ledger updates + log entry together), one commit per process change.
- Never commit prose and process changes together in one commit.
