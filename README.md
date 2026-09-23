```
██████╗ ███████╗███╗   ██╗ ██████╗██╗  ██╗
██╔══██╗██╔════╝████╗  ██║██╔════╝██║  ██║
██████╔╝█████╗  ██╔██╗ ██║██║     ███████║
██╔══██╗██╔══╝  ██║╚██╗██║██║     ██╔══██║
██████╔╝███████╗██║ ╚████║╚██████╗██║  ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
```

A skill pack for [Cursor](https://cursor.com), [Claude Code](https://claude.ai/code), and [Codex](https://developers.openai.com/codex) — editorial reports, plan drilling, product lore, and plain-language explanations.

**Live site:** [bench-skills.vercel.app](https://bench-skills.vercel.app/)

## Install

```sh
npx github:Jingquank/Bench
```

By default, this auto-detects which tools you have and installs to `~/.cursor/skills/`, `~/.claude/skills/`, and `~/.agents/skills/` (Codex) as appropriate.

To install for a specific target only:

```sh
npx github:Jingquank/Bench --cursor   # Cursor only
npx github:Jingquank/Bench --claude   # Claude Code only
npx github:Jingquank/Bench --codex    # Codex only
```

Each skill is one source file with per-agent blocks (`<!-- only:claude,cursor --> … <!-- /only -->`); the installer keeps the blocks for the target agent, emits the right frontmatter, and (for Codex) writes `agents/openai.yaml` for user-only skills.

## Upgrading

Already have an older Bench installed? Just re-run the installer:

```sh
npx github:Jingquank/Bench
```

It records a small manifest per target and **auto-removes stale files** left by previous versions — without touching anything you added yourself — and prints a short summary of what changed.

**Retired skills:** `/xray` (live debug panels) and `/grid` (layout grid overlay) are no longer shipped. Re-running the installer removes them from your skills folders.

## Skills

| Skill | Command | What it does |
|-------|---------|--------------|
| **WriteReport** | `/writereport` | Turn any doc or data into a polished editorial report (single-file HTML / PDF) |
| **Drill** | `/drill` | Interview that reviews your plan and fills the gaps before you code |
| **Lore** | `/lore` | Maintain a `LORE.md` of journeys, target users, and anti-goals |
| **Huh** | `/huh` | Say that again in plain language — bilingual, one level simpler each time |

### WriteReport — `/writereport`

`[TARGET=<file-or-path> | demo | setup]`

Turn any doc, data file, or notes into a polished **editorial report**, exported as a single HTML file and/or PDF.

- Magazine-style reflow — cover, lead, sections, styled tables, pull quotes
- **Charts chosen by the data's shape** (ranking, Likert, part-to-whole, trend…) — static SVG with print-safe interactivity, never one chart repeated
- **Dual-language** output (default EN + 简体中文) with an in-page toggle; **light / dark** themes
- **Satoshi** (Fontshare) and **Noto Sans SC** (Google Fonts) load from CDN with real fallback stacks, so the report needs a network connection; a built-in **anti-slop pass** audits and redesigns AI-design tells
- `/writereport demo` renders a bundled sample; persists `docs/.writereport.json` only when you pick a non-default language pair

**Files:** `SKILL.md`, `DESIGN.md`, `CHARTS.md`, `charts/gallery.html`, `DEMO.md`

### Drill — `/drill`

`[PLAN=<path-or-description>]`

Interview-style review of your implementation plan that surfaces gaps and unmade decisions before you start coding.

- Scans codebase + browser context to ask informed, project-specific questions
- Labels plan items **GREEN / YELLOW / RED** by confidence, with structured multiple-choice rounds
- Works in plan mode (edits the plan in-place) and agent mode (summary in chat); short-circuits when the plan is already complete

**File:** `DRILL.md`

### Lore — `/lore`

`[FOCUS=<journey-or-area>]`

Generate and maintain a `LORE.md` at the project root — a living codex of what the product is, who it's for, what it deliberately does **not** do, and the journeys that make it real.

- Auto-detects mode from `LORE.md` presence — baseline draft first, diff-and-confirm on later runs
- Job-story journeys (`When X, I want Y, so I can Z`) backed by concrete steps and source-file citations
- Monorepo-aware; `FOCUS=<area>` narrows the run; feeds `/drill` so plan reviews reference real journeys

**File:** `LORE.md`

### Huh — `/huh`

`[thing to explain]`

Stuck on an answer full of jargon? `/huh` says it again in **ASD-STE100 Simplified Technical English** — the controlled English of aircraft maintenance manuals — with your own language on the next line.

- Explains the **last response**, the **options in a question**, or whatever you type after the command
- **Bilingual by line** — English leads, your language in italics beneath, plus a glossary that gives each term in both languages
- Run it again and it goes one level simpler: fewer assumptions, not fewer words. It backs up further, adds one everyday analogy, then gives the one thing to know. Resets on a new topic
- Asks your language once per session and **writes nothing** — no config file, no `git status` noise
- Hit it on a **plan** and it walks the steps one line each, in order — then hands the real plan back for approval, never its own summary
- Written to be **scannable** — answer first, one idea per line, no nested bullets — and to arrive fast: zero tool calls

**File:** `HUH.md`

## License

MIT
