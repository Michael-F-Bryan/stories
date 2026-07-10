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

---

## 2026-07-10 — Authors-voice skill rebuilt from the owner's voice notes

**Asked:** Owner supplied a detailed voice guide ("Michael's preferred AI story voice"): clear, scene-first genre fiction; phone-readable; priority order clarity → character action → momentum → tension → emotional consequence → style; scene contract; lore through pressure; genre pleasures preserved; a long list of banned AI-prose patterns; 20 worked do/don't examples.

**Done:**
- Stored the guide verbatim at `.claude/skills/authors-voice/references/michaels-voice-notes.md` — it is the source of truth and wins over any summary.
- Rewrote `SKILL.md` as the operational distillation. This replaces the first draft, which leaned too literary ("a little dry, craft hidden") — the owner's target is web-serial genre fiction where the prose disappears, not prestige-fantasy restraint.

**Decisions of note:**
- The reference file is required reading before a session's first draft; the revision checklist now leads with the owner's calibration test (profound-but-unclear → rewrite; mood-only paragraph → cut; thesis dialogue → make them want things and dodge).
- Kept the guide's darker/sensual-fantasy section in both files even though no current work uses it — it applies if a future work goes that direction.
