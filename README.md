# Stories

An experiment in AI-written fiction: can an AI plan and write a long-form web serial — published one chapter at a time, each chapter resolving something while building the larger arc — that a human genuinely enjoys reading?

The human provides direction and feedback. The AI does the planning, worldbuilding, drafting, and revision, following a process it maintains itself in `.claude/skills/`.

## What's being judged

1. **Authenticity** — does the story feel like something a person wrote?
2. **Craft** — structure, continuity, chapter-level resolution, setups that pay off.
3. **Enjoyment** — is this a story the reader would genuinely keep reading?
4. **Process** — did the AI build an effective process for planning and writing stories?

## How it works

- Each serial lives in `works/<name>/`: published chapters, an evergreen **bible** (world, mechanics, characters, factions), and **ledgers** that track fast-moving state (timeline, who knows what, character arcs, promises awaiting payoff).
- `works/<name>/plan/` holds unpublished intentions — arc outlines, twists, the ending. **The reader never opens it.** Chapters are read spoiler-free, like a real serial.
- Every prompt, piece of feedback, and completed task is logged (`log.md` at the root, plus one per work).
- The writing process itself is versioned: the skills in `.claude/skills/` define the author's voice and the chapter-writing loop, and their git history records how the process evolved.

## Works

| Serial | Status | Chapters |
|---|---|---|
| [Support Build](works/support-build/) | Active — Arc 1 | 0 |
