```
██████╗ ███████╗███╗   ██╗ ██████╗██╗  ██╗
██╔══██╗██╔════╝████╗  ██║██╔════╝██║  ██║
██████╔╝█████╗  ██╔██╗ ██║██║     ███████║
██╔══██╗██╔══╝  ██║╚██╗██║██║     ██╔══██║
██████╔╝███████╗██║ ╚████║╚██████╗██║  ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
```

A skill pack for [Cursor](https://cursor.com), [Claude Code](https://claude.ai/code), and [Codex](https://developers.openai.com/codex) — editorial reports, live debug panels, plan drilling, reality checks, product lore, and layout grids.

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

### WriteReport — Editorial Reports

Turn any doc, data file, or notes into a polished, well-organized **editorial report** and export it as a self-contained HTML and/or PDF.

- Reflows content into a magazine-style layout — cover, lead, sections, styled tables, pull quotes
- **Charts chosen by the data's shape** (ranking, Likert, part-to-whole, trend…), static SVG with optional, print-safe interactivity — not one chart type repeated
- **Dual-language** output (default EN + 简体中文) with an in-page toggle; PDF exports one file per language
- **Light / dark** themes; a bundled editorial design system (ships as `DESIGN.md`) — its name never appears in the output
- A single **Satoshi** superfamily (bundled, embedded and subset) on a full role-based scale (display→overline) with three weight tiers — Black 900 display, Bold 700 headings, Medium 500 body; fully self-contained HTML; PDF via the agent's browser print-to-PDF
- Built-in **anti-slop pass**: after the first render it audits the output against a catalogue of AI-design tells and redesigns what it trips
- `/writereport demo` renders a bundled sample; output defaults to EN + 简体中文 (no config file needed) and only persists `docs/.writereport.json` when you pick a different pair

**Files:** `SKILL.md`, `DESIGN.md`, `DEMO.md`

### Xray — Live Debug UI

Generate a temporary debug panel for any UI element. Point it at a component (by name, file path, or browser selection), and get a floating control panel to tweak visual and behavioral parameters in real time.

- Automatically extracts tweakable values (sizes, colors, opacities, animation speeds, text content)
- Maps parameters to appropriate controls (sliders, steppers, color pickers, text inputs, toggles)
- Portal-based overlay that never disrupts page layout
- Copy Config button exports your tweaks as JSON
- Run `/xray` with no target to clean up — your tweaked values get baked back into the source

**File:** `XRAY.md`

### Drill — Plan Review & Refinement

Interview-style skill that reviews your implementation plan, identifies gaps, and asks targeted questions to flesh out details before you start coding.

- Scans the codebase and browser context to ask informed, project-specific questions
- Labels plan items by confidence (GREEN / YELLOW / RED)
- Structured question rounds with concrete multiple-choice options
- Works in plan mode (updates plan file in-place) and agent mode (summary in chat)
- Short-circuits when the plan is fully specified — no forced questions

**File:** `DRILL.md`

### Reality Check — User Testing Questionnaire Generator

Review a project, form brutally honest hypotheses about product-market fit, and generate Likert-scale questionnaires to validate or falsify them. Think Steve Jobs — first principles, zero confirmation bias.

- Silently scans README, routes, dependencies, and UX patterns to understand the product
- Interviews the developer to fill gaps code can't answer (target user, problem severity, competition)
- Generates 3–8 impact-ranked hypotheses that challenge assumptions, not confirm them
- Names specific blind spots with codebase evidence ("You assume X, but the pricing page has no comparison table")
- Produces 15–20 Likert-scale questions ordered by emotional weight, with reverse-coded items
- Outputs to Notion (markdown fallback) with scoring guide and decision framework

**File:** `REALITYCHECK.md`

### Lore — Product Codex

Generate, iterate, and maintain a `PRODUCT.md` at the project root: a living document of what the product is, who it's for, what it deliberately does NOT do, and the user journeys that make it real.

- Auto-detects mode from `PRODUCT.md` presence — baseline draft on first run, diff-and-confirm against the existing codex on later runs
- Silently scans README, routes, dependencies, and the live dev server (screenshots key pages) before asking anything
- Job-story journeys (`When X, I want Y, so I can Z`) backed by concrete steps and source-file citations — so future runs can detect change automatically
- Templates for web apps, CLI tools, libraries, and backend APIs — not just sign-up flows
- Monorepo-aware — asks which app the codex should describe before scanning
- `FOCUS=<area>` argument narrows the run (`/lore FOCUS=checkout` only touches journeys matching `checkout`)
- Adaptive interview — one round by default, a second only when discovery surfaces real ambiguity
- Feeds into `/drill` so plan reviews can reference real journeys instead of re-deriving them

**File:** `LORE.md`

### Grid — Müller-Brockmann Grid Debug UI

Build a live, toggleable layout grid into a website or webapp — a visual overlay plus a floating control panel for tuning the grid against real content, following Josef Müller-Brockmann's construction method (type area → columns → fields → baseline) adapted for screens.

- A toggleable **overlay** with four layers — page margins, columns + gutters, baseline rhythm, and the `columns × rows` field matrix
- A floating **debug panel** that rewrites the product's grid custom properties live, so dragging a slider reflows the real layout — presets, copy-to-CSS / copy-to-JSON, localStorage persistence
- Derives the starting grid from the project's real type and tokens (`baseline` = body line-height, fields are integer baseline rows), not defaults
- Ships `grid.css` (the grid variables + `.grid` template + span/field utilities) so the real layout sits on the same grid the overlay draws
- Hotkeys: `shift+G` panel · `g` overlay · `m` cycle layers · `[` `]` nudge baseline. Tune against real content, then `copy css` and paste the `:root` block back in
- `/grid editorial`, `/grid columns=4 rows=8`, or `/grid` to derive from the project; a bookmarklet form for sites you don't control
- Reference docs (`references/method.md`, `references/overlay-api.md`) and a React overlay component (`assets/GridOverlay.jsx`) included

**Files:** `SKILL.md`, `references/`, `assets/`

## License

MIT
