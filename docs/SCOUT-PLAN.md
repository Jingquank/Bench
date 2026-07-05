# Plan: Add `/scout` — an "unknowns discovery" skill to the Bench pack

## Context

The user wants a new Bench skill based on Thariq's (@trq212) article *"the map is not the
territory."* Its thesis: with strong models like Fable 5, work quality is bottlenecked by the
user's ability to **clarify their unknowns**. The article gives a taxonomy of unknowns
(Known Knowns / Known Unknowns / Unknown Knowns / Unknown Unknowns) and a lifecycle toolkit of
cheap techniques to surface them *before, during, and after* implementation — because every
brainstorm, interview, prototype, and reference is a cheap way to find out what you didn't know
before it gets expensive to fix.

`/scout` packages that toolkit as a single, adaptive skill: point it at a problem and it
diagnoses where your unknowns are and runs the right technique to surface them — leaning on
HTML artifacts as the medium, matching the pack's editorial quality bar.

**Decisions locked with the user:**
- **Name:** `scout` (reconnaissance for unknowns; map/territory metaphor; fits the one-word pack style).
- **Scope:** full, self-contained lifecycle — includes its own interview + implementation-plan
  step. Overlap with the existing `/drill` skill is accepted (see "Relationship to /drill").
- **Structure:** multi-file (`SCOUT.md` + `scout/references/` + `scout/assets/`), mirroring `grid/`.
- **Memory loop:** scout persists learnings to a project-level `docs/scout-log.md` — resolved
  unknowns, plan deviations, quiz misses — and reads it at the start of the next run ("what you
  learn becomes the map for next time," per the article's lifecycle loop).
- **Artifact style:** match the Bench / WriteReport editorial system (Satoshi type, light/dark),
  not the article's cream/orange look — all Bench artifacts read as one family.
- **Bare `/scout`:** diagnose & recommend — ask the user where they are (starting? mid-build?
  done?) with as many questions as the diagnosis actually needs (no fixed cap), inspect repo
  state (git diff, existing artifacts, `docs/scout-log.md`), then recommend a technique and why.
- **Quiz gating:** soft gate — the quiz artifact scores live and shows PASS / RETRY; scout
  recommends not merging until pass but never blocks.

## The skill's shape

`/scout [MODE=blindspot|brainstorm|interview|reference|plan|notes|pitch|quiz | <free description>]`

**Design principle (progressive disclosure):** `SCOUT.md` stays lean — it gathers starting
context and *routes* to a technique. The deep per-technique detail lives in reference files
loaded only when needed. This matches Thariq's "skills are folders, not just markdown."

`SCOUT.md` body flow:
1. **Gather starting context** — who the user is, their experience with the problem/codebase,
   where they are in their thinking (the article's "give Claude your starting point" rule); read
   `docs/scout-log.md` if present. Ask as many questions as the diagnosis needs — no fixed cap.
2. **Diagnose & route** — read `references/taxonomy.md` to decide which quadrant of unknowns
   dominates and which lifecycle stage applies, then recommend a technique and say why. If
   `MODE` is supplied, jump straight to it.
3. **Run the technique** — follow the matching section of `references/playbook.md`. Render any
   visual output through `assets/scout-artifact.html`.
4. **Close the loop** — each artifact feeds the next stage (brainstorm → plan → implement →
   quiz); after a run, append durable learnings (resolved unknowns, deviations, quiz misses) to
   `docs/scout-log.md` so the next run starts with a better map.

### Bundled files

- **`scout/references/taxonomy.md`** — the diagnostic model. Defines the 4 quadrants and turns
  them into a routing table (quadrant → technique) plus a pre/during/post lifecycle overlay.
  Scout reads this to decide *which* technique to run.
- **`scout/references/playbook.md`** — operational manual, one section per technique
  (Blind Spot Pass · Brainstorm & Prototype · Interview · References · Implementation Plan ·
  Implementation Notes · Pitch/Explainer · Quiz). Each section: Targets (quadrant) · Reach for
  it when · Context to gather first · Procedure · Output · Anti-patterns/handoff · Example prompts
  (from the article).
- **`scout/assets/scout-artifact.html`** — self-contained, theme-aware (light/dark, print-safe)
  HTML shell all visual outputs render into: blindspot report, N brainstorm directions,
  decisions-first plan, pitch doc, and the quiz (live scoring, PASS / RETRY soft gate).
  Styled on the Bench / WriteReport editorial system: Satoshi type (reuse the pack's
  `fonts/Satoshi-Variable.woff2` as an optional binary file entry, with system-font fallback),
  matching the pack's light/dark treatment so all Bench artifacts read as one family.

### Relationship to `/drill`

`/drill` is the rigorous plan-review pass (grades plan items GREEN/YELLOW/RED, plan-mode aware).
`/scout` is broader and earlier: it helps you discover unknowns across the whole lifecycle and
its interview/plan steps are lighter-weight ideation. `SCOUT.md` will include a one-line pointer:
for a rigorous pre-code plan audit, hand off to `/drill`. No changes to `/drill` itself.

## Files to create

- `SCOUT.md` (repo root) — three `only:` frontmatter blocks (`cursor`, `claude`, `codex`) + body.
  - name: `scout`; Claude block adds `user-invocable: true`, `disable-model-invocation: true`,
    `argument-hint: [MODE=blindspot|brainstorm|interview|reference|plan|notes|pitch|quiz | <description>]`.
  - Follow the exact block syntax used in `XRAY.md` lines 1–21 (including body-level
    `<!-- only:claude,codex -->` fences where prose differs per agent).
- `scout/references/taxonomy.md`
- `scout/references/playbook.md`
- `scout/assets/scout-artifact.html`

## Files to modify (registration touchpoints — from the installer map)

1. **`bin/install.js`** — add to the hardcoded `skills` array (the single required registration):
   ```js
   {
     name: "scout",
     files: [
       { src: "SCOUT.md", dest: "SKILL.md" },
       { src: "scout/references/taxonomy.md", dest: "references/taxonomy.md" },
       { src: "scout/references/playbook.md", dest: "references/playbook.md" },
       { src: "scout/assets/scout-artifact.html", dest: "assets/scout-artifact.html" },
       { src: "fonts/Satoshi-Variable.woff2", dest: "fonts/Satoshi-Variable.woff2", binary: true, optional: true },
     ],
     implicitInvocation: false,   // must equal !disable-model-invocation
   },
   ```
2. **`package.json`** — add `"SCOUT.md"` and `"scout/"` to the `files` array; add `"scout"` to
   `keywords`; **bump the pack-wide `version`** (currently `1.10.0`). Per CLAUDE.md, the version
   bump must be confirmed with the user via AskUserQuestion before any push.
3. **`README.md`** — add a row to the skills table (`| **Scout** | `/scout` | Discover your
   unknowns … |`) and a dedicated `### Scout — /scout` section (arg-hint line + "**Files:**" line),
   matching the format of the existing sections.
4. **`src/components/TidalArtifact.jsx`** — add `SCOUT` to the two hardcoded ticker strings
   (~lines 214 & 217; the only place the live site enumerates skills).

## Verification

- **Installer dry-run / correctness:** run `node bin/install.js --claude` against a temp `HOME`
  (e.g. `HOME=/tmp/scout-test node bin/install.js --claude`) and confirm
  `~/.claude/skills/scout/{SKILL.md, references/taxonomy.md, references/playbook.md,
  assets/scout-artifact.html}` are written, frontmatter is the Claude block only, and the
  `.bench-install.json` manifest lists scout. Repeat with `--cursor` and `--codex`; for codex
  confirm `agents/openai.yaml` with `allow_implicit_invocation: false` is generated.
- **Per-agent block stripping:** verify the installed `SKILL.md` for each target contains only
  that agent's frontmatter and prose (no stray `only:` fences).
- **Artifact renders:** open `scout/assets/scout-artifact.html` in a browser (and via the
  pre-installed Chromium) — confirm it renders standalone, toggles light/dark, and the quiz
  live-scoring / PASS-RETRY soft gate works with sample data.
- **Lint:** `npm run lint` stays clean (the ticker edit and any JS in the HTML template).
- **Site:** `npm run dev` and confirm the ticker shows `SCOUT`.

## After implementation

- Save this plan (as approved) to a standalone markdown file in the repo — `docs/SCOUT-PLAN.md` —
  as a record of the skill's design rationale. Not listed in package.json `files` (repo-only,
  not shipped with the installed skill).

## Out of scope / notes

- No changes to other skills. No new npm dependencies.
- Version bump value to be confirmed with the user at push time (CLAUDE.md rule).
- All development on branch `claude/new-skill-design-xbxno7`.
