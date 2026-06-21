<!-- only:cursor -->
---
name: writereport
description: Turn any doc, data file, or notes into a polished, well-organized editorial report -- exported as a self-contained HTML (light/dark + dual-language toggles) and/or PDF. Applies a bundled editorial design system. Use when the user says "write a report", "make a report", "turn this into a report", or "print this nicely".
---
<!-- /only -->
<!-- only:claude -->
---
name: writereport
description: Turn any doc, data file, or notes into a polished, well-organized editorial report -- exported as a self-contained HTML (light/dark + dual-language toggles) and/or PDF. Applies a bundled editorial design system. Use when the user says "write a report", "make a report", "turn this into a report", or "print this nicely".
user-invocable: true
disable-model-invocation: true
argument-hint: [TARGET=<file-or-path> | demo | setup]
---
<!-- /only -->
<!-- only:codex -->
---
name: writereport
description: Turn any doc, data file, or notes into a polished, well-organized editorial report -- exported as a self-contained HTML (light/dark + dual-language toggles) and/or PDF. Applies a bundled editorial design system. Use when the user says "write a report", "make a report", "turn this into a report", or "print this nicely".
---
<!-- /only -->

# /writereport -- Editorial Report Generator

Turn the most relevant document or data into a polished, well-organized editorial
report: an editorial layout, exported as a self-contained HTML and/or PDF, in two
languages, with light and dark themes. The look comes from a bundled editorial design system
(`DESIGN.md`, shipped alongside this skill) — but its **internal name never appears in the output**.

**You are the translator** -- like Mastermind, there is no translation API. Translate first,
then build, so both languages are baked into the output.

## Dispatch

Read `$ARGUMENTS` (or the user's message):

- **`demo`** --> run the full flow on the bundled `DEMO.md` (a sample report sitting next to this
  skill). Write outputs into the current working directory.
- **`setup`** --> (re)configure languages only: ask primary/secondary, write `docs/.writereport.json`,
  confirm, stop.
- **a path / file / description, or nothing** --> normal run (below).

---

## Step 0: Language settings

The default pair is **English + 简体中文** — no config file or prompt is needed for it.

- **Default, silently:** if there is no `docs/.writereport.json`, just use EN + 简体中文. Do **not**
  prompt on first use, and do **not** create the file.
- **Honor an existing file:** if `docs/.writereport.json` exists, use it silently:

  ```json
  { "langPair": { "a": "en", "b": "zh-CN" } }
  ```

- **Persist only on an explicit non-default choice:** when the user asks for a different pair
  (in their message) or runs `/writereport setup`, confirm the two languages, create `docs/` if
  needed, write the file, and confirm in one line. That sticky setting is then reused silently.

`a` is primary (shown first / default-visible), `b` is secondary. A one-off pair given in the
message applies to that run only unless the user wants it persisted.

---

## Step 1: Resolve the target & detect type

**Pick the target** in this order:
1. The path/file in `$ARGUMENTS`.
2. Else the **most-recently created or edited file in this conversation**.
3. Else ask the user which file/data to turn into a report.

If the target is ambiguous (a vague description matching several files), ask which one.

**Detect the input type** and read it:
- **Prose / Markdown** -- articles, notes, READMEs, specs.
- **Tabular data** -- CSV / TSV / JSON arrays / Markdown tables.
- **Code / logs** -- source files, log output.

A single document may mix types (prose + a table + a code block) -- handle each region by its
kind.

---

## Step 2: Load the editorial design system

Read **`DESIGN.md` from this skill's own directory** (it ships alongside this skill). Compile
a **self-contained** stylesheet from its **literal token values** -- never emit `var(--color-*)`
references to a host project (they won't exist in the output file).

Pull these from `DESIGN.md` (values below are the current set -- if `DESIGN.md` differs,
`DESIGN.md` wins):

- **Color = a Radix custom palette:** two 12-step scales, **warm `gray`** + **`green`** accent,
  each with **light + dark** + alpha (`*-a*`) variants. Compile the literal steps from
  `DESIGN.md`'s frontmatter. Use **steps by role**, not ad-hoc colours:

  | Role | Step → token | Light | Dark |
  |---|---|---|---|
  | App background | `gray-1` `--bg` | `#fffdf9` | `#000000` |
  | Surface / panel | `gray-2` `--surface` | `#fcf9f4` | `#121315` |
  | Border (subtle/UI) | `gray-6`/`gray-7` | `#dfd8ce`/`#d5cdc3` | `#393a3f`/`#46474e` |
  | Muted text | `gray-11` `--text-muted` | `#686259` | `#b2b3bd` |
  | Text | `gray-12` `--text` | `#251f17` | `#eeeef0` |
  | Solid accent | `green-9` `--solid` | `#00e05a` | `#00e05a` |
  | Accent text / link | `green-11` `--accent-text` | `#00862c` | `#00dc56` |
  | Ink on accent | `green-contrast` `--on-solid` | `#142716` | `#142716` |
  | Accent surface | `green-surface` | `#f0fbf1cc` | `#162a1880` |

  Steps 11/12 are contrast-safe on steps 1–2. Derive transparency from the **alpha steps**
  (`--gray-a*` / `--green-a*`), not ad-hoc `rgba`/`color-mix`.

- **Type:** one **Satoshi** superfamily; hierarchy from **weight + size + tracking**. **Three weight
  tiers:** Black `900` display, Bold `700` headings + labels, Medium `500` body. Sizes (fluid display):
  display-2xl→72 … title 36, h2 30, h3 24, h4 20, h5 18; body 16/1.55, body-sm 14, caption 13,
  overline 12, **micro 11** (densest chrome). Tracking tightens with size (−0.035 → 0), opens on caps
  (+0.08). **Chrome text** (labels, captions, buttons, table heads, legends, byline, footer, metric
  labels) is **tokenized** to `--fs-overline/caption/micro` — no scattered rems; chart SVG text uses
  the dedicated **`--cfs-*`** scale (`DESIGN.md` §1, §7).
- **Shape:** Radix radius scale — cards/charts `--radius-3`, chips `--radius-1/2`, `full` on dots/pills.
  Cards **flat & border-defined**; `--shadow-1..6` (built on `--black-a*`) is for tooltips/popovers only.
- **Spacing:** Radix `--space-1..9` (4px base) drives **all layout** — no hardcoded px (section rhythm
  `--space-9`/`8`, gaps `--space-4/5`, tight `--space-1..3`); only `clamp()` page padding + 1px hairlines.
- **Color:** two 12-step scales + **overlay `black-a`/`white-a`** (true-neutral scrims/washes/shadows)
  + **P3** `@supports` variants (sRGB hex is the floor). Interactive states use steps **3/4/5**
  (rest/hover/active); focus ring `--focus` (gray-12).
- **Texture:** one fixed film-grain overlay -- light `multiply`/`.12` with a faint `green-9` tint;
  dark (`gray-1` `#000`) `screen`/`.15`. **Keep the green cast** — it's brand identity, not data-green.
- **Data-viz & icons:** charts are **interactive** (Step 3) with **green used surgically — one
  highlight per chart**, gray default marks, `--cfs-*` text; icons are **Radix Icons, inlined**
  (`currentColor`, 15×15) — see `DESIGN.md` §7–§8.

---

## Step 3: Reflow into an editorial layout

Reorganize the content into a magazine-style report (do not just dump the source):

- **Cover / masthead** -- a strong title derived from the content (one **accent word** is enough)
  and a date line. An eyebrow/kicker label is optional — use it once at most, not above every
  section.
- **Lead / summary** -- a short standfirst paragraph that states the gist.
- **Sections** -- clear titles with body copy. Numbering (`1.`, `2.`, …) is optional; add it only
  when it truly helps scanning, not as a reflex (`01 / 02 / 03` markers are a known AI tell).
- **Tables** -- tabular data as clean editorial tables (right-align numerics, hairline borders).
- **Charts** -- analyze the data, compute metrics, then visualize; see **Charting data** below.
  Interactive, with 2–3 meaningful views and metric callouts.
- **Pull quotes** -- lift a striking line into a large pull quote where it earns the space.
- **Code / logs** -- a framed monospace block, not restyled into prose.

Keep the source's meaning; improve its structure and hierarchy. Vary the rhythm — do not apply the
same block, spacing, or chart shape mechanically down the page.

**Build with the anti-slop checklist in mind from the start** (varied charts, a real weight/size
hierarchy, trimmed copy, varied spacing) so the first render is already close — the Step 6 audit
then catches what slipped, rather than carrying the load alone.

### Charting data — analyze, then visualize (interactive)

Charts are **first-class and interactive**, built on the Radix-token data-viz language
(`DESIGN.md` §7). Work in this order: **analyze the raw data → compute the metrics that matter →
choose the form(s) → give most charts 2–3 meaningful views → wire up interactivity → annotate with
metrics + insights.**

#### 1. Analyze the raw data and compute metrics

Don't just plot counts — **parse the source and compute the statistics that fit the data's
shape**, then surface the relevant ones (not all of them — only what earns insight):

| Data shape | Compute | Good views to offer |
|---|---|---|
| Multi-select (pick-any) | n, avg selections/respondent, top-item share %, % choosing ≥1, long-tail | count ↔ % of respondents ↔ sorted rank |
| Single-choice / part-to-whole | each share %, top share, top-2 concentration | 100% stacked ↔ ranked bar ↔ donut (sparingly) |
| Ordinal / Likert (1–n) | **mean, median, mode, std dev, % top-2-box, % bottom-2-box, net** | column histogram ↔ diverging-from-midpoint ↔ cumulative |
| Numeric / continuous | mean, median, std dev, min/max, range/IQR, outliers, skew | histogram ↔ cumulative (ECDF) ↔ summary (box) |
| Time series | Δ first→last, % change, min/max, mean | line ↔ indexed-to-100 ↔ period-over-period |
| Two variables / two groups | correlation, difference, ratio, % gap | scatter / grouped bar ↔ dumbbell ↔ diverging |

Draw **mean/median reference lines** on distributions. Keep arithmetic honest (define n; note
multi-select totals exceed 100%).

#### 2. Choose the form by judgment

**Pick the form that makes the point clearest — not a lookup table.** Vary forms across the
report; one chart type repeated is a tell. The pairings below are starting points — reach past
them (dot plot, heatmap, slope, small multiples, bullet, dumbbell, treemap…) when another form
communicates better. A single headline figure is a **big-stat**, not a chart.

| Often fits | Worth considering |
|---|---|
| Ranking / comparison across categories | sorted horizontal bar, dot plot |
| Ordinal scale or Likert | column, diverging bar, histogram |
| Part-to-whole (a few parts) | 100% stacked bar; donut only sparingly |
| Change over time | line / area; slope chart for two points |
| Two numeric variables | scatter |
| Before/after or two-way split | split bar, dumbbell, paired stat |

**Colour: neutral by default, green is surgical.** Default every data mark to **`--gray-9`**;
spend green on **one mark per chart — the insight's subject** (the point the section makes, *not*
always the max — e.g. the `$0` bar, the high Likert side, Blender), plus the mean line and metric
deltas. Sequential/diverging = gray ramps with green only on the emphasized end; **line/cumulative
= gray line + one green point** at the key threshold. *"Green = the point being made, once per
chart."* Chart text uses the dedicated **`--cfs-*`** (rem) scale. Full palette: `DESIGN.md` §7.

**Adaptive (must read on a phone).** Build dense charts — bars, columns, dots, stacked, grouped,
tables — as **responsive HTML/CSS elements**, *not* a fixed-`viewBox` SVG (a wide SVG scaled into a
phone column shrinks its text to ~4px). HTML/CSS bars reflow and keep real, legible text at every
width. Row order is **label → value → bar** (`minmax(0,1fr)` track) so the value never gets pushed
off-screen on narrow viewports. Reserve **SVG for line/area/scatter** only, and bump its text at
`≤760px`/`≤420px`. Add breakpoints that stack multi-column grids and keep touch targets ≥ ~40px.

#### 3. Give most charts 2–3 **meaningful** views (toggleable)

Most charts ship **2–3 views the reader can toggle**, where **each view answers a different
question** — e.g. *absolute counts ↔ % share ↔ sorted rank*; *distribution ↔ cumulative*;
*grouped ↔ stacked ↔ 100%*; *raw ↔ deviation-from-mean*; or the same data **cut a different way**.
A cosmetic re-skin (same question, new colours) is **not** a view — if a second view adds no
insight, ship one. Simple data may stay single-view. **Don't spam** views or metrics.

#### 4. Make them interactive (interactivity-first)

Inline vanilla JS only (no libraries). Per chart, as it helps:

- **View toggle** — a segmented control (Radix chart-type icons, `DESIGN.md` §8) switching the
  2–3 views. Real `<button>`s, keyboard-reachable.
- **Hover/focus tooltip** — exact value + share + context, styled per §7.
- **Series focus** — hovering a legend key highlights its series; others fade to `--gray-a6`.
- **Sort toggle** where ranking is the point.

#### 5. Annotate with metrics **and insights**

Render the computed metrics as **callouts beside/above the chart** (styled per §7). **Every metric
gets a one-line, strictly descriptive insight** — what the number means in plain language, never a
bare figure and never a recommendation or buzzword. Deltas use Radix arrows (▲/▼) **with the sign**
(not colour alone).

#### 6. Print / JS-off fallback (lossy by design)

The **primary view renders statically** (HTML/CSS marks, or inline `<svg>` for lines) with full
labels and the key metric callouts — it reads with JS off and **reflows to the page width**.
**Alternate views, tooltips, and toggles are screen-only**; the PDF export captures **only the
primary view + metrics** (see Step 7). Don't make the primary view depend on JS.

---

## Step 4: Translate into both languages

Translate every human-readable string into both `langPair.a` and `langPair.b`. Preserve Markdown
structure and inline formatting; **do not translate** code, identifiers, URLs, or numeric data.
Keep both language variants for every text block -- they both ship in the HTML.

---

## Step 5: Build the self-contained HTML

Emit **one** `.html` file, fully self-contained and **offline**:

- `<!doctype html><html data-theme="light" data-lang="<a>">` ... inline `<style>` only.
- **Fonts -- one real variable face, embedded and subset.** Use a single **Satoshi** superfamily
  for everything; the display↔body contrast comes from the **weight jump** (display 900, headings
  700, body 500), not a second typeface — the slop tell is a *flat* hierarchy, not one well-cut family.
  Satoshi ships with this skill in `fonts/` (`fonts/Satoshi-Variable.woff2`, weights 300–900) and
  has real lowercase, so headings stay **sentence/title case**. For CJK, fetch **Noto Sans SC** at
  build. Collect the glyph set actually used across both languages, subset (`pyftsubset
  --flavor=woff2 --unicodes=…`, keeping the weight axis, or `fonttools`), and base64-inline via
  `@font-face { src: url(data:font/woff2;base64,…) }` — small file, zero network at view time.
  **Degrade:** Satoshi missing → fall back to a system sans stack (still hold the weight hierarchy);
  no subsetter → embed the full woff2; no CJK source/network → link Noto Sans SC + a system
  fallback stack (`Satoshi, -apple-system, …, "Noto Sans SC", sans-serif`). Tell the user which
  path was taken.
- **Both languages in the DOM.** Wrap each translated block as `.lang-a` / `.lang-b`; CSS shows
  the block matching `html[data-lang]`. Language-neutral content (code, numbers, charts) is not
  duplicated.
- **Two themes via `data-theme`** light/dark, on the Radix scales from Step 2. Emit the raw steps
  (`--gray-1..12`, `--gray-a*`, `--green-1..12`, `--green-a*`, `--green-contrast`, surfaces), the
  **overlay** scales (`--black-a1..12` / `--white-a1..12`), the **semantic aliases** (`--bg`,
  `--surface`, `--ui`/`-hover`/`-active`, `--border`, `--solid`, `--text`, `--text-muted`,
  `--accent-text`, `--on-solid`, `--focus`), and the radius (`--radius-*`), space (`--space-*`),
  shadow (`--shadow-1..6`), and **chart text (`--cfs-*`)** scales — plus `--fs-micro`.
- **Wide gamut (P3):** wrap a `@supports (color: color(display-p3 1 1 1))` block that re-declares the
  `gray`/`green` (+ alpha) steps in `oklch`/`color(display-p3 …)` for both themes. sRGB hex stays the floor.
- **Adaptive HTML/CSS charts:** bars/columns/dots/stacked/grouped/tables are responsive HTML/CSS
  (label → value → bar, `minmax(0,1fr)` track), text in `--cfs-*`; only line/area is SVG (modest
  viewBox + small-screen text bump). Emit breakpoints (`≤760`, `≤420`) that stack grids; touch
  targets ≥ ~40px; no horizontal overflow.
- **Token-driven layout & text:** layout spacing uses `--space-*` (no hardcoded px); chrome text uses
  `--fs-overline/caption/micro`; interactive elements use the 3/4/5 state steps + `--focus`; metric
  value at `--fs-h4`.
- **Radix Icons, inlined.** Inline the SVG paths for the icons used (deltas, info, chart-type
  toggles — `DESIGN.md` §8) as `<svg viewBox="0 0 15 15" ...>` with `currentColor` fills. **No**
  `<img>`, CDN, npm, or icon fonts.
- **Page toggles** -- two small fixed controls (top-right): a **theme** toggle and a **language**
  toggle, flipping `data-theme` / `data-lang` on `<html>`.
- **Interactive charts (interactivity-first).** Emit per-chart inline vanilla JS (no libraries):
  the **view toggle** (segmented control with Radix icons), **hover/focus tooltips**, and
  **series focus** (Step 3 / §7). Each chart's 2–3 view geometries can be precomputed into the
  markup (hidden by CSS) or drawn by the inline JS. The **primary view + metric callouts render
  statically** (no JS needed); the rest are screen-only enhancements.
- **Footer** -- one quiet line: `Generated with /writereport · <date>`. **Never** print the design
  system's internal name or token jargon anywhere in the output.
- **Film grain** overlay per Step 2 (kept).
- **Print CSS** -- `@page { margin }`, sensible page breaks (`break-inside: avoid` on cards,
  tables, charts, pull quotes), and `@media print { .vg-grain, .vg-toggles, .vg-viewtoggle,
  .vg-tooltip { display: none } }`. In print, **show only each chart's primary view** (hide the
  alternates) and the metric callouts.

---

## Step 6: Anti-slop pass

**After the first render, before finalizing, audit the output and fix it.** Open the generated
HTML (with your browser tool if available; otherwise re-read the markup) and check it against the
**Anti-slop checklist** below. Then **redesign** anything it trips — honoring `DESIGN.md`'s
deliberate choices, but fixing clear slop. Re-render and repeat until clean. Highest-value checks:

- **Charts:** varied and matched to each dataset — not the same bar chart all the way down? Do
  the **multiple views answer different questions** (not cosmetic re-skins)? Toggle, tooltip, and
  series-focus work, and the **primary view + metrics read on their own** (JS off)?
- **Metrics:** every metric callout has a **descriptive insight** (not a bare number, not a
  recommendation)? Arithmetic honest (n defined, multi-select >100% noted)?
- **Adaptive:** open it at ~390px — do charts reflow (HTML/CSS, not a downscaled SVG), is all chart
  text legible (≥ ~11px, never 4px), do grids stack, and is there **no horizontal overflow**?
- **Type:** real weight/size hierarchy in Satoshi (Black 900 display vs Medium 500 body), beyond a
  couple of near-identical sizes?
- **Copy:** trim em-dash overuse, marketing buzzwords, and aphoristic "X, not Y" cadence.
- **Layout:** vary spacing (Radix `--space-*`, not one value); avoid identical card grids / nested
  cards; line length ≤ ~80 chars; don't lean on the eyebrow + `01/02` + oversized-headline combo.
- **Green is surgical:** charts default to **gray-9** marks with **at most one green highlight per
  chart** (the insight's subject) + mean line + delta. More than one green data mark = fail. Off
  charts: no `green-9` as text; accent stays purposeful.
- **Color/contrast:** colour from Radix **steps by role** (text `gray-11/12`, solid `green-9`, accent
  text `green-11`); no gray-on-green that fails contrast; transparency from `*-a*`/overlay steps.
- **Tokenized text + spacing:** chrome text uses `--fs-overline/caption/micro` and charts `--cfs-*`
  (no scattered literal rems, no oversized chart text); layout spacing uses `--space-*` (no hardcoded px).
- **Radius/elevation:** cards flat & border-defined (no soft-shadow "ghost cards"); radius
  restrained (`--radius-3` on cards, never 40px+).
- **Icons:** Radix Icons used with restraint (no icon-tile-above-heading feature cards); one icon
  per control/label; inlined SVG, not fetched.
- **Branding:** the design system's name appears nowhere in the output.

If a design-critique skill (e.g. `/critique`) is available you may also run it — never required.

---

## Step 7: Export

Ask the user which format(s): **HTML**, **PDF**, or **both**. Write **next to the source file**
(never overwrite the source): for `report.md` ->

- **HTML** -> `report.writereport.html`
- **PDF** -> `report.en.pdf` and `report.cn.pdf` (one per language)

**PDF rendering** -- print the HTML to PDF with your browser tool, in the **light theme with grain
off**. The PDF is **lossy by design**: it captures each chart's **primary view + metric callouts
only** (alternate views, tooltips, and toggles are screen-only). Tell the user the HTML is the
richer, interactive artifact.
- Claude Code: Chrome MCP (or headless Chrome `--print-to-pdf`) -- navigate to the HTML `file://`
  URL and print.
- Other agents: use your browser-automation / headless-print tool, or a print CLI if available.
- Set `data-lang` to language A, print -> `*.en.pdf`; set to language B, print -> `*.cn.pdf`.
- **No browser/print tool?** Write the HTML and tell the user: "Open it and use Print -> Save as
  PDF (switch the language toggle for each version)."

---

## Step 8: Verify

1. Open the HTML with your browser tool (if available) and screenshot it (light + dark).
2. Confirm: the **language toggle** flips languages, the **theme toggle** flips light <-> dark,
   tables render, chart types are varied (not one shape repeated), and the Radix palette + radius
   render in both themes.
3. Confirm the **chart interactivity**: per-chart **view toggle** switches between the 2–3
   meaningful views, **tooltips** show on hover/focus, and **metric callouts carry insights**.
4. Confirm Radix **icons render inline** and the page has **no external requests** (only `data:`
   URIs — no `http(s)`/CDN/`<link rel>`/`<img>`).
5. Confirm the design system's name appears nowhere, and the footer is the quiet `/writereport` line.
6. Confirm the PDF(s) exist, open to the right language in light theme, and show each chart's
   **primary view + metrics** (lossy is expected).
7. Without a browser tool, state what you could not visually verify and ask the user to confirm.
8. Report the output paths.

---

## Anti-slop checklist

Generic AI-generated design converges on recognizable tells. Audit every report against these
(condensed from **impeccable.style/slop** — the catalog catches both waves: the **2022** wave is
purple/blue gradients, glassmorphism, and neon glow; the **2026** wave is "tasteful" cream
surfaces, italic-serif heroes, eyebrow pills, `01/02` markers, single-weight type flatness, and
em-dash/aphoristic copy). Fix what you trip.

- **Visual details:** thick colored border clashing with the radius; glassmorphism / frosted
  cards; one-side colored stripe; hairline + wide soft shadow "ghost" cards; repeating-gradient
  stripes; extreme radius (40px+); crude hand-drawn mascot SVGs.
- **Typography:** flat hierarchy (weights/sizes too close) — including a single family used
  **without** real weight contrast (the tell is the flatness, not the one family); icon-tile-above-
  heading feature cards; italic-serif startup hero; hero eyebrow / pill chip; repeated uppercase
  kicker labels; oversized full-sentence headline; crushed letter-spacing; overused fonts (Inter,
  Geist, Space Grotesk, Instrument Serif); all-caps body text.
- **Color & contrast:** purple/violet gradients, cyan-on-dark; dark mode with glowing accent
  shadows; decorative gradient text; gray text on a colored background; reflexive cream/beige
  "tasteful AI" surface.
- **Layout & space:** hero big-number + three-stats; identical card grids; one spacing value
  everywhere; nested cards (cards in cards); `01 / 02 / 03` section markers; line length > ~80
  chars; content overflow; clipped tooltips/menus.
- **Motion:** bounce/elastic easing; animating layout props (width/height); image hover
  scale/rotate.
- **Copy:** em-dash overuse; marketing buzzwords (streamline, empower, supercharge); aphoristic
  "X, not Y" cadence; theater/performative framing.
- **Imagery:** broken or placeholder images.
- **General quality:** cramped padding; text flush to the viewport edge; justified text (rivers);
  contrast below WCAG AA; skipped heading levels; line-height < 1.3; body text < 12px; body
  letter-spacing > 0.05em.

A few of these overlap deliberate `DESIGN.md` choices (cream surface, an eyebrow, numbered
sections). Keep those when used with craft and restraint — the failure mode is applying them
reflexively and everywhere. When in doubt, earn the element or cut it.

---

## Rules

- **Adaptive output.** The report must read on a phone: **HTML/CSS charts reflow** (SVG only for
  lines), grids stack at `≤760`/`≤420`, chart text stays legible, touch targets ≥ ~40px, no
  horizontal overflow.
- **Self-contained output.** Inline CSS, HTML/CSS charts (+ inline SVG for lines), **inline Radix
  icon SVGs**, embedded
  (subset) fonts, baked colour literals -- **no external runtime, CDN, npm, `<img>`, or icon
  fonts.** Inline vanilla JS powers the toggles and chart interactivity.
- **Interactivity-first charts.** Most charts ship **2–3 meaningful (not cosmetic) toggleable
  views**, hover/focus tooltips, and **computed metrics with plain-language insights** (Step 3 /
  `DESIGN.md` §7). The **primary view + metrics render statically** (read JS-off); alternate views,
  tooltips, and toggles are screen-only and **omitted from the lossy PDF**.
- **Radix token foundation.** Colour = the Radix custom **gray + green** 12-step scales (+ overlay
  `black-a`/`white-a`, + P3 `@supports`), used **by step role** (text `gray-11/12`, solid `green-9`,
  accent text `green-11`, ink-on-green `green-contrast`, states `3/4/5`, focus `--focus`); alpha from
  `*-a*`/overlay steps. Radius `--radius-*`, spacing `--space-*` (**all layout**, no hardcoded px),
  shadow `--shadow-1..6` (tooltips only; cards flat). Text: editorial `--fs-*` for content, chrome on
  `--fs-overline/caption/micro`, charts on `--cfs-*`. **In charts green is surgical — one highlight
  per chart**, gray default marks. All literals from `DESIGN.md` — no ad-hoc colours.
- **Opinionated, always editorial.** Unlike `/xray`, /writereport does **not** adopt the host
  project's design system -- it always applies the bundled `DESIGN.md`.
- **Never overwrite the source.** Always write new `*.writereport.html` / `*.en.pdf` / `*.cn.pdf`.
- **Default language silently** to EN + CN with no config file or first-run prompt; persist to
  `docs/.writereport.json` only on an explicit non-default choice (or `/writereport setup`), then reuse
  it silently.
- **Both languages always ship** in the HTML; PDF exports one file per language.
- **Degrade gracefully** when a browser/print tool or font subsetter is unavailable -- never hard
  fail; fall back and tell the user what changed.
- **One Satoshi superfamily, weight-driven hierarchy.** Display uses Satoshi Black 900, headings
  Bold 700, in **sentence/title case** (Satoshi has lowercase — don't force all-caps); body is
  Satoshi Medium 500. The display↔body contrast must come from a real weight/size jump — never a
  flat single-weight page.
- **Analyze, then visualize.** Compute the metrics that fit the data's shape (%, mean, median,
  std dev, mode, top-box, deltas…) and surface the ones that earn insight — each with a
  descriptive one-line takeaway. Choose each chart form by judgment (see **Charting data**); don't
  repeat one chart type down the whole report.
- **Run the anti-slop pass** (Step 6) after the first render — audit against the **Anti-slop
  checklist** and redesign what it trips before finalizing.
- **Don't name the design system in the output.** No internal design-system name or token jargon;
  the footer is `Generated with /writereport · <date>`.
