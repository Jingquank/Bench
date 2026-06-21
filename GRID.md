<!-- only:cursor -->
---
name: grid
description: Build a live, toggleable Müller-Brockmann grid debug UI into a website or webapp — an overlay (page margins, columns, baseline rhythm, and the columns × rows field matrix) plus a floating control panel for tuning the grid against real content and copying the result back into the product's CSS. Use when the user says "/grid", "grid", "show the grid", "add a grid overlay", "grid debug UI", "tune the grid", "visualize the baseline grid", "set up a column or baseline grid", "Swiss grid", or "Müller-Brockmann grid".
---
<!-- /only -->
<!-- only:claude -->
---
name: grid
description: Build a live, toggleable Müller-Brockmann grid debug UI into a website or webapp — an overlay (page margins, columns, baseline rhythm, and the columns × rows field matrix) plus a floating control panel for tuning the grid against real content and copying the result back into the product's CSS. Use when the user says "/grid", "grid", "show the grid", "add a grid overlay", "grid debug UI", "tune the grid", "visualize the baseline grid", "set up a column or baseline grid", "Swiss grid", or "Müller-Brockmann grid".
user-invocable: true
disable-model-invocation: true
argument-hint: [preset | key=value …]
---
<!-- /only -->
<!-- only:codex -->
---
name: grid
description: Build a live, toggleable Müller-Brockmann grid debug UI into a website or webapp — an overlay (page margins, columns, baseline rhythm, and the columns × rows field matrix) plus a floating control panel for tuning the grid against real content and copying the result back into the product's CSS. Use when the user says "/grid", "grid", "show the grid", "add a grid overlay", "grid debug UI", "tune the grid", "visualize the baseline grid", "set up a column or baseline grid", "Swiss grid", or "Müller-Brockmann grid".
---
<!-- /only -->

# Grid

Build a Müller-Brockmann grid into a web page or app: a visual overlay plus a
live debug panel for tuning the grid against real content. Follows the book's
construction method (type area → columns → fields → baseline alignment), adapted
for screens.

## What this produces

- A toggleable **overlay** with four layers — page margins, columns + gutters,
  the baseline rhythm, and the grid fields (the `columns × rows` matrix).
- A floating **debug panel** that drives the overlay and rewrites the product's
  grid custom properties in place, so dragging a slider reflows the real layout.
  Presets, live `columns × rows` field count, copy-to-CSS / copy-to-JSON, and
  localStorage persistence.
- The **CSS** (`grid.css`) that makes the real layout sit on the same grid the
  overlay draws and the panel tunes.

Hotkeys: `shift+G` show/hide panel · `g` toggle overlay · `m` cycle layers ·
`[` `]` nudge baseline.

## Invocation and arguments

Installed as a skill, this is invocable as `/grid` (the directory name is the
command). `$ARGUMENTS` is an optional quick spec:

- a preset name — `editorial`, `general`, `dashboard`, or a Müller-Brockmann
  field count like `20` (4 × 5), `32` (4 × 8)
- `key=value` pairs — `columns=6 rows=8 baseline=28 margin=40`

With no arguments, derive the grid from the project's type and mount the debug
UI. Parse `$ARGUMENTS` as a loose blob; ignore anything you can't map.

## Decide the job first

| User wants                                   | Do this                                              |
|----------------------------------------------|------------------------------------------------------|
| Tune the grid in the product they're building| Install overlay + debug panel + `grid.css`, mount in dev |
| See the grid on a page                       | Add the overlay, derive config from their type       |
| Check if an existing layout aligns           | Add the overlay in `all` mode, point out drift       |
| A grid for a specific medium                 | Pick `columns` and `rows` to match, then overlay     |
| Inspect a site they don't control            | Give them the bookmarklet form                        |

## Workflow

### 1. Read the method

Read `references/method.md` before choosing numbers. The grid is derived from the
body type — `baseline` equals the body line-height, fields are an integer number
of baseline rows, and the grid is a `columns × rows` matrix (the book's 8 / 20 /
32 fields). The reference carries the four-sketch method and the print→web map.

### 2. Find the project's type and grid

Look for the body `font-size` and `line-height`, and any existing grid tokens
(`--grid-*`, a column count, a container max-width). Derive the starting config:

- `baseline` = body line-height (e.g. 24)
- `columns` = density of the medium: 6 editorial, 12 general, 16–24 dashboard
- `rows` = field rows for a bounded region (poster, hero, fold); `rows: 0` for an
  open scrolling page. `columns × rows` is the field count
- `rowHeight` = 3–4 baselines · `rowGutter` = 1 baseline
- `margin` / `maxWidth` set against the viewport, then judged for proportion
- `gutter` ≈ one baseline

State the config you chose and why in a line or two.

### 3. Install into the project

Copy from `assets/`. The debug UI is the main deliverable:

- `grid.css` — the grid variables, `.grid` template, span/field utilities. The
  overlay and panel read these off `:root`, so this is the source of truth.
- `grid-overlay.js` — the overlay engine.
- `grid-debug.js` — the debug panel (depends on the engine). Mount it dev-only.

Wire a dev-only mount so it never ships:

```html
<!-- static -->
<link rel="stylesheet" href="grid.css">
<script src="grid-overlay.js" data-auto="false"></script>
<script src="grid-debug.js"></script>
```

```jsx
// React / Vite — dev only
import './grid.css';
if (import.meta.env.DEV) {
  await import('./grid-overlay.js');
  await import('./grid-debug.js');
}
```

For a site the user doesn't control, give the bookmarklet from
`references/overlay-api.md` instead.

### 4. Tune, then lock it in

Open the panel (`shift+G`), tune against real content until text sits on the
baseline and image edges fall on field edges, then `copy css` and paste the
`:root` block into `grid.css`. Lay content out with `.grid` + `.col-span-N` /
`.row-span-N` (add `.matrix` to lock an exact `rows` count), `.field-N` for block
heights outside a grid, `.grid-img` for images that fill their cell. For nested
regions, prefer a `.band` (subgrid) and place its children by column **line**
(`grid-column: 1 / 6`) so they snap to the same lines as everything else rather
than re-eyeballing spans. The test of a correct grid is visual — the page should
sit on it.

### 5. Verify — don't trust, measure

The visual check is the point, but you can prove it. Inject `assets/verify-grid.js`
into the running page (paste in the console, or — in Claude Code — load it through
the browser tools) and call `GridVerify()`. It measures, for the current
viewport, how well the real layout adheres: column edges, the overlay-vs-content
match, baseline rhythm, and (with `GridVerify({ optical: '.masthead, h1' })`) the
ink-on-line of display type. It returns `{ colErr, overlayErr, baselineErr,
inkErr, pass }` and logs a one-line PASS/FAIL.

Run it at a few widths **above and below** `--grid-max-width` (e.g. 1440 / 1180 /
900) — resize the window or set the viewport via the browser tools between calls.
The classic centered-container drift (overlay or content columns disagreeing)
only shows when the viewport is wider than the max, so testing only one narrow
width hides it. A clean result is `col≈0 overlay≈0 baseline≤½ baseline` at every
width.

## Using it in your project

The skill operates on the real repo. Detect the framework (plain HTML, React,
Vue, Next, Svelte), find where global styles and the app entry live, place the
three assets there, and add the dev-only mount in the right spot (the app's dev
entry, or a `_app` / root layout behind a dev flag). Read the project's current
type and grid tokens first so the panel opens reflecting the product's real grid
rather than defaults. Then tell the user the hotkeys and that `/grid` reopens it.

## Reference files

- `references/method.md` — Müller-Brockmann's construction method, the baseline
  rule, the `columns × rows` matrix, image/caption handling, print→web mapping.
  Read this first.
- `references/overlay-api.md` — overlay config table, the debug panel (controls,
  presets, export, persistence, shadow DOM, React mount), hotkeys, every
  integration recipe (static, React, bookmarklet, Tailwind), theming, limits.

## Assets

- `assets/grid.css` — `:root` grid variables, `.grid` template, `.band` subgrid, span/field/media utilities
- `assets/grid-overlay.js` — overlay engine (drop-in or bookmarklet)
- `assets/grid-debug.js` — live debug panel (mount dev-only)
- `assets/GridOverlay.jsx` — React overlay component (overlay only, no panel)
- `assets/grid-optical.js` — opt-in optical alignment for display type (ink-on-line)
- `assets/verify-grid.js` — in-page grid-adherence checker (prove 0px, no Node deps)
