```
██████╗ ███████╗███╗   ██╗ ██████╗██╗  ██╗
██╔══██╗██╔════╝████╗  ██║██╔════╝██║  ██║
██████╔╝█████╗  ██╔██╗ ██║██║     ███████║
██╔══██╗██╔══╝  ██║╚██╗██║██║     ██╔══██║
██████╔╝███████╗██║ ╚████║╚██████╗██║  ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
```

A skill pack for [Cursor](https://cursor.com), [Claude Code](https://claude.ai/code), and [Codex](https://developers.openai.com/codex) — editorial reports, live debug panels, plan drilling, product lore, layout grids, and unknowns discovery.

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

**One behavior change to know:** `/writereport` is now an **editorial report generator**; the original terminal/HUD design-system skill was retired.

## Skills

| Skill | Command | What it does |
|-------|---------|--------------|
| **WriteReport** | `/writereport` | Turn any doc or data into a polished editorial report (self-contained HTML / PDF) |
| **Xray** | `/xray` | Live debug-UI panel to tweak any element's parameters in real time |
| **Drill** | `/drill` | Interview that reviews your plan and fills the gaps before you code |
| **Lore** | `/lore` | Maintain a `LORE.md` of journeys, target users, and anti-goals |
| **Grid** | `/grid` | Toggleable Müller-Brockmann layout grid overlay + tuning panel |
| **Scout** | `/scout` | Discover your unknowns before, during, and after implementation |

### WriteReport — `/writereport`

`[TARGET=<file-or-path> | demo | setup]`

Turn any doc, data file, or notes into a polished **editorial report**, exported as a self-contained HTML and/or PDF.

- Magazine-style reflow — cover, lead, sections, styled tables, pull quotes
- **Charts chosen by the data's shape** (ranking, Likert, part-to-whole, trend…) — static SVG with print-safe interactivity, never one chart repeated
- **Dual-language** output (default EN + 简体中文) with an in-page toggle; **light / dark** themes
- Bundled **Satoshi** superfamily (embedded + subset) and a built-in **anti-slop pass** that audits and redesigns AI-design tells
- `/writereport demo` renders a bundled sample; persists `docs/.writereport.json` only when you pick a non-default language pair

**Files:** `SKILL.md`, `DESIGN.md`, `DEMO.md`

### Xray — `/xray`

`[TARGET=<component-name-or-file>]`

Generate a temporary debug panel for any UI element — point it at a component (by name, file path, or browser selection) and tweak visual/behavioral parameters in real time.

- Auto-extracts tweakable values (sizes, colors, opacities, speeds, text) and maps them to the right controls (sliders, steppers, pickers, toggles)
- Portal-based overlay that never disrupts layout; **Copy Config** exports your tweaks as JSON
- Run `/xray` with no target to clean up — tweaked values get baked back into the source

**File:** `XRAY.md`

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

### Grid — `/grid`

`[preset | key=value …]`

Build a live, toggleable **Müller-Brockmann** layout grid into a site or webapp — a visual overlay plus a floating panel for tuning the grid against real content.

- Overlay with four layers — page margins, columns + gutters, baseline rhythm, and the `columns × rows` field matrix
- Debug panel rewrites the product's grid custom properties live — presets, copy-to-CSS / JSON, localStorage persistence
- Derives the starting grid from the project's real type and tokens, and ships `grid.css` so the real layout sits on the overlay's grid
- Hotkeys: `shift+G` panel · `g` overlay · `m` cycle layers · `[` `]` nudge baseline · invoke as `/grid editorial`, `/grid columns=4 rows=8`, or bare `/grid`

**Files:** `SKILL.md`, `references/`, `assets/`

### Scout — `/scout`

`[MODE=blindspot|brainstorm|interview|reference|plan|notes|pitch|quiz | <description>]`

Discover the unknowns in your task while they're still cheap to fix — the gap between your prompt (the map) and the codebase's real constraints (the territory).

- Diagnoses where your unknowns hide (known unknowns, "I'll know it when I see it", never-considered) and routes to the right technique
- Eight techniques across the lifecycle — blind spot pass, brainstorm & prototype, interview, references, implementation plan (pre) · implementation notes (during) · pitch and comprehension quiz with a PASS / RETRY soft gate (post)
- Persists learnings to `docs/scout-log.md` — what you learn becomes the map for next time; artifacts render on a self-contained editorial HTML shell
- Bare `/scout` interviews you about your starting point, inspects repo state, then recommends a technique and why

**Files:** `SKILL.md`, `references/`, `assets/`

## License

MIT
