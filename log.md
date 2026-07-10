# Repo log

Lab notebook for meta and process work. One entry per session that touches process, structure, or direction. Newest entries at the bottom. Per-serial work is logged in `works/<serial>/log.md`.

---

## 2026-07-10 — Repo scaffolded

**Asked:** Set up the repository for an experiment in AI-written fiction; brainstorm and build the structure.

**Direction received:**
- Format: web serial — chaptered, each chapter has its own resolution while building the larger arc.
- The owner is mostly hands-off: AI does all planning and writing; owner provides direction and feedback.
- Evaluation criteria: authenticity, craft, genuine enjoyment, and whether the AI builds an effective process.
- Two skills to start: the author's voice, and the overall process (worldbuilding/planning/drafting/proofreading/chapter handoff), directed by CLAUDE.md. More specialised skills may come later.
- Bible split into two kinds of entry: evergreen notes (worldbuilding, backstories, mechanics, factions) and ledgers (events, who-knows-what, character development).
- Keep a log of prompts, feedback, and completed tasks.
- Owner reads spoiler-free: `plan/` directories are never revealed in chat or commits.
- First serial: fantasy / progression. Owner picks from a pitched slate.
- Formatting: never hard-wrap markdown at 80 columns.

**Done:**
- `CLAUDE.md` — operating instructions, spoiler protocol, evaluation criteria, layout, git conventions.
- `.claude/skills/serial-process/SKILL.md` — lifecycle (pitch → greenlight → bible → arcs → chapters → retrospective), the 10-step chapter loop, ledger discipline, process-evolution rule.
- `.claude/skills/authors-voice/SKILL.md` — POV/tense defaults, prose principles, banned-tics list, revision checklist.
- `pitches/2026-07-10-fantasy-slate.md` — four fantasy/progression pitches: Compound Interest, Palimpsest, Undermarch, Chosen Twice.
- `README.md`, this log.

**Decisions of note:**
- Secrets live in `plan/`, not the bible — the bible and ledgers describe published canon only, which is also what keeps the chapter-writing loop honest about what the reader knows.
- Added a `promises.md` ledger (setups awaiting payoff) beyond the owner's requested ledgers, to make the craft criterion auditable.
- Deferred a dedicated continuity-editor skill: let the basic loop run first; add it if continuity errors actually slip through (that decision itself is data for the process criterion).

**Next:** Owner greenlights a pitch (with any direction); then worldbuilding and arc planning begin.
