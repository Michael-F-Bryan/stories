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

---

## 2026-07-10 — Second pitch slate: anime-fantasy

**Asked:** Four more premises, more in line with the anime-fantasy feel of the voice notes.

**Done:** `pitches/2026-07-10-anime-fantasy-slate.md` — Support Build (leaderboard world, untracked support class, worst team in the league), Calamity, Housebroken (failed hunter bonds a sealed calamity stuck as a housecat), Deadweight (oath-bound porter on the broadcast tower circuit breaks her oath on camera), The Thirteen Forms (duelling circuit where techniques have public prices; extinct school whose forms cost life). Leaned deliberately on the genre pleasures the voice notes protect: ranks, leagues, named techniques, declared costs, rival escalation, duo banter. Updated the README works table to point at both slates.

**Next:** Owner greenlights one pitch from either slate.

---

## 2026-07-11 — Process change: the slack rule added to authors-voice

**Why:** Owner feedback on Support Build ch. 1 identified an "uncanny valley… clipped" quality and confirmed the diagnosis: AI prose spends maximum craft on every line — sculpted fragments, beat-drop dialogue ("Contract."), personified abstractions, uniform quotability — so nothing on the page is allowed to be ordinary, and the reader feels performed at. The existing checklist made this *worse*: "rewrite the weakest sentences" and "cut the flabbiest 5%," applied uniformly, systematically remove slack.

**Change:** New section in `authors-voice/SKILL.md` — "The slack rule — one snap per beat" — with the owner-approved worked example, plus a cadence-audit step in the revision checklist and an explicit counterweight note on the punch-up steps. Owner's articulation of the goal, recorded verbatim: "there's no pressure to fill everything with smart quips, and it lets the story talk for itself rather than feeling like the author is trying to impress their readers with their literary skill."

**Evidence note for the experiment:** this is the first style rule discovered through the owner's reader feedback rather than authored up front — the feedback loop working as intended.

---

## 2026-07-11 — Process change: adversarial review formalized in the chapter loop

**Why:** The owner has requested an adversarial sub-agent review on both major artefacts so far (bible, ch. 1), and both times it caught blocker-grade problems (broken timeline, demo that proved nothing, out-of-character beat). Making it a standing loop step rather than an on-request extra.

**Change:** `serial-process/SKILL.md` chapter loop gains step 6 (adversarial review with required scope: banned patterns + slack rule, clarity, scene contracts, voices, canon/numbers audit, genre pleasure; must quote text, rank severity, and record what passes). Also noted PR-based review flow in the commit step: chapter branches + spoiler-free PR descriptions, per owner's new workflow.

**Also:** branch `claude/fiction-repo-setup-kstww0` renamed to `main` at owner's request; owner set it as GitHub default. (Old remote branch deletion returns 403 from this session — owner can remove it via the branches page.)

---

## 2026-07-11 — Process change: "numbers are stakes, not bookkeeping" added to authors-voice

**Why:** Owner PR-review comment on ch. 2 (the Trust counter scene): "AIs like to generate lots of logistics/accounting-ish prose, when really the reader doesn't care too much for the specific details… it's important that she notices they've messed up a payment and is correcting them, but we don't need to go into so much detail." Second style rule taught by the owner-as-reader (after the slack rule). Notable tension resolved: the adversarial reviewer had pushed *toward* on-page figures (auditability); the refined rule keeps both masters — events on the page, arithmetic in the ledgers.

**Change:** New bullet in the authors-voice slack-rule section. Chapter 2's Trust scene revised accordingly on the `chapter/002` PR branch (prose commit, separate from this one).

---

## 2026-07-11 — Process change: "vary the snap" added to the slack rule

**Why:** Owner follow-up on ch. 2 (from phone, after his three inline comments were applied): "we're still falling back into old habits... it's less about individual words or passages, and more about how frequently the same techniques are used close together." He asked me to infer the specifics. Inference, confirmed by inventorying ch. 2: the slack rule policed snap *density* (one per beat) but not snap *diversity* — the chapter's snaps were overwhelmingly one species (the wry qualifying tail), plus a running clipboard gag, duplicate greeting-intros, and a repeated simile formula. Same register in every beat = still machine-patterned, even at legal density.

**Change:** "Vary the snap" bullet added to the authors-voice slack-rule section, and the cadence-audit checklist step now requires a by-type inventory of surviving snaps across the chapter — any device used twice gets its second use converted or cut. Chapter 2 swept accordingly on the PR branch (8 edits, prose commit separate from this one). Third reader-taught rule in two days: slack (density) → numbers-are-stakes (content) → vary-the-snap (distribution).

---

## 2026-07-11 — Voice refinement: the North Star section

**Why:** Owner asked what I've learned about his style and which authors likely influenced him; my inference ("the author must be invisible — every flagged failure is the author visibly performing") was confirmed, and he corrected/completed the influence map: HxH, Naruto, Mushoku Tensei, So I'm a Spider So What? (early-twenties anime binge); Sanderson's Mistborn + Laws of Magic; Paolini's Inheritance Cycle ("one of the best written series I've ever read"); John Marsden (late teens); Ringworld / Rendezvous with Rama / Dragon's Egg. Pratchett clarified: banned as narrator register because AI overuses his techniques — "trying too hard to impress you with their literary genius rather than letting the story do the work."

**What the corrections changed in the model:** (1) Earnestness — Paolini/Naruto/Mushoku are sincere and played straight, so dryness is seasoning, not armour; big honest feelings are allowed without a defusing joke. This corrects a real miscalibration: my drafts default to wry exits on emotional beats. (2) Voice-y interiority is welcome (Spider/Mushoku) — personality inside the POV is character, not narrator performance; new test: "could this line be the character's literal italicised thought?" (3) Wonder beats as genre pleasure (the hard-SF shelf) — first honest reveal of a mechanism gets to breathe.

**Change:** "North Star — the positive model" section added to authors-voice: the confirmed shelf plus four operational upshots (earnest not ironic; interiority-is-character with the italicise test; wonder beats; growth as the long game). First skill section that says what to write TOWARD rather than what to avoid.

**Note for ch. 3+:** Ren's interiority can carry more personality than ch. 1–2 gave it; the first Gate entry (ch. 4) is the serial's first real wonder beat and should be written as one.

---

## 2026-07-11 — Process overhaul after ch. 3 rejection (PR #2)

**Why:** The owner rejected ch. 3 with 13 inline comments: "slipping into bad habits again and the adversarial review isn't catching them... I don't approve this PR to be merged without doing a massive overhaul." A mechanical device-counting audit (dispatched in response) proved the failure modes with a draft-vs-final diff. Three distinct failures:

1. **Rule failure — the character-performance loophole was wrong.** The owner overruled it explicitly: pithy/clipped/epigrammatic speech is banned for characters too, not just the narrator ("It doesn't matter whether it's the narrator or a character saying it"). The audit found 8/8 speaking characters landing crafted beat-drops — one author in eight costumes.
2. **Review-process failure — post-review revisions were unreviewed.** The audit's diff proved the revisions reinstalled the devices the review removed, including a literally duplicated simile fourteen lines apart that no reviewer ever saw together. Also: single-chapter reviews cannot see cross-chapter armature (3/3 identical opener shapes, 2 consecutive identical closers, 5th said-to-object attribution) — only counting across files exposes it. Also: shared-taste blind spots (a general reviewer reads diegetic-metaphor saturation as thematic coherence and callback density as payoff-craft).
3. **Continuity-process failure — the knowledge ledger was written from the bible, not the page.** The owner: "Who are the Okafors? And what about District Nine?" Neither the surname nor the Break backstory nor Pip's bow had ever appeared in published text; the ledger claimed they had; the continuity check verified against the ledger's fiction.

**Changes:**
- `authors-voice/SKILL.md`: new section "The plain-speech rule — the pithy register is banned globally" (with the owner's rulings verbatim: full sentences for everyone; balanced epigrams and fragment-speech banned in dialogue; numbers-in-fragments banned; "just tell me" — implications must state their takeaway; "X was a Y with a Z" intangible-metaphor pattern banned). North Star interiority bullet corrected: voice-y means chatty/conversational, never compressed — the italicise test is necessary, not sufficient. Vary-the-snap gains hard structural budgets (triads ≤1 incl. dialogue, personification ≤1, callbacks ≤2, scene-exit buttons a minority), a no-fixed-armature rule for chapter openers/closers, and a diegetic-metaphor saturation rule. Cadence audit now explicitly runs on the FINAL text with re-audit on post-review edits.
- `serial-process/SKILL.md`: continuity check gains the **first-mention audit** (every proper noun/backstory fact/gear verified against published chapter text by grep — the bible is what's true; the page is what's known) and a ledger-honesty rule; new loop step 8 **final-text style audit** (mechanical counting) after all revisions.

**Owner content request logged:** equipment/kit texture ("the story has felt remarkably silent" on gear and how people fight) — ch. 3 overhaul adds a loadout scene; standing item for future chapters.

**Meta-observation for the experiment:** the failure chain was rules→review→revision each individually passing while the composition failed. The counting audit (immune to shared taste) is the strongest tool added since the adversarial review itself.

---

## 2026-07-11 — The cold-reader rule (outside-reader feedback on Support Build)

**Why:** The owner had a second person read Support Build; they stopped at the end of ch. 1 scene 1. Their diagnosis, relayed by the owner: the author worldbuilt extensively, then wrote as if the reader had the lore already — "tossing lore-specific terminology like 'Striker' around like it's common knowledge." The failure class is the ch. 3 Okafors bug generalized: the bible is what's true, the page is what's known — and no page had ever established the premise. The first-mention audit added after ch. 3 was scoped to story facts (surnames, backstory, gear) and was never run against the premise vocabulary or against ch. 1–2 retroactively. A rule gap and a scope gap, not just an execution gap.

**Changes:**
- `authors-voice/SKILL.md`: new section "The cold-reader rule — the page owes the reader the world." Write for a reader who has only the published chapters; being used is not being introduced (first use owes enough context to say roughly what a term is); chapter 1 owes the premise itself, plainly — "lore through pressure" governs how lore arrives, not whether; budget ungrounded coinages (1–2 in flight, resolved within a page); revision test = quote the grounding sentence for every coined term or introduce/cut; and the counterweight — orientation as wiki-voice or stacked exposition paragraphs is the same failure inverted.
- `serial-process/SKILL.md`: first-mention audit extended to world terminology (classes, institutions, jargon, system terms), with "introduced means grounded, not merely used" and an instruction to run it hardest against the opening pages.

**Meta-observation:** every reader-taught rule so far (slack, vary-the-snap, plain-speech, numbers-as-stakes, now cold-reader) is a "the writer knows too much" failure in a different costume — style rules kept fixing how sentences perform while this one is about what the reader has been given. Worth noting that it took a SECOND human reader to surface it: the owner had the README premise and the pitch discussions in his head, so even he couldn't read ch. 1 cold. Outside readers are a detection instrument the process didn't have.
