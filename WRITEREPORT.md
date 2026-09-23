<!-- only:cursor -->
---
name: writereport
description: Turn any doc, data file, or notes into a polished, well-organized editorial report -- exported as a single HTML file (light/dark + dual-language toggles) and/or PDF. Applies a bundled editorial design system and a 28-form chart catalogue. Use when the user says "write a report", "make a report", "turn this into a report", or "print this nicely".
---
<!-- /only -->
<!-- only:claude -->
---
name: writereport
description: Turn any doc, data file, or notes into a polished, well-organized editorial report -- exported as a single HTML file (light/dark + dual-language toggles) and/or PDF. Applies a bundled editorial design system and a 28-form chart catalogue. Use when the user says "write a report", "make a report", "turn this into a report", or "print this nicely".
user-invocable: true
disable-model-invocation: true
argument-hint: [TARGET=<file-or-path> | demo | setup]
---
<!-- /only -->
<!-- only:codex -->
---
name: writereport
description: Turn any doc, data file, or notes into a polished, well-organized editorial report -- exported as a single HTML file (light/dark + dual-language toggles) and/or PDF. Applies a bundled editorial design system and a 28-form chart catalogue. Use when the user says "write a report", "make a report", "turn this into a report", or "print this nicely".
---
<!-- /only -->

# /writereport -- Editorial Report Generator

Turn the most relevant document or data into a polished, well-organized editorial
report: an editorial layout, exported as a single HTML file and/or PDF, in two
languages, with light and dark themes. The look comes from a bundled editorial design system
(`DESIGN.md`) and a 28-form chart catalogue (`CHARTS.md` + `charts/gallery.html`), all shipped
alongside this skill — but the design system's **internal name never appears in the output**.
The HTML loads type from Fontshare and Google Fonts, so it **needs a network connection**.

Writing and translation stay inside the coding-agent workflow; there is no translation API. Step 4's
affordable writing-model dispatch produces polished copy in both languages before final assembly.

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

Read **`DESIGN.md` and `CHARTS.md` from this skill's own directory** (both ship alongside this
skill). Compile a **stylesheet from `DESIGN.md`'s literal token values** -- never emit
`var(--color-*)` references to a host project (they won't exist in the output file).

Pull these from `DESIGN.md` (values below are the current set -- if `DESIGN.md` differs,
`DESIGN.md` wins):

- **Color = the Viggle brandbook palette:** nine flat tokens per theme (light + dark), plus two
  derived 7-step ramps for charts and the overlay alpha scales. There are **no numbered steps** to
  reach for -- only **named roles**:

  | Role | Light | Dark |
  |---|---|---|
  | `BG` — page ground | `paper` `#fcfcfc` | `paper` `#151110` |
  | `BG-alt` — card ground / band | `beige` `#f1eeea` | `beige` `#221d18` |
  | `TXT` — text, heaviest data mark | `ink` `#29231e` | `ink` `#f4f1ec` |
  | `MUT` — muted text, axis labels | `taupe` `#74685a` | `taupe` `#a5988a` |
  | `GRID` — hairlines, tracks | `w6` `#dad7d3` | `w6` `#3b332c` |
  | `DATA` — all data marks | warm ramp `w1…w7` | warm ramp `w1…w7` |
  | `HERO` — one mark per chart | `#008125` | `#00e13f` |

  **Warm ramp** (light) `#29231e · #4d453d · #74685a · #9a8c7c · #bbb3aa · #dad7d3 · #f1eeea`;
  it inverts on dark so `w1` is always the heaviest mark on its own ground. **Jolt ramp**
  `#00300d · #005518 · #008125 · #00b132 · #00e13f · #acecbe · #e3f5e8` — **locked**, accent tones
  only, never magnitude. `silver`/`fill`/`mist` are hueless chrome colours and must never be
  spliced into the warm ramp. Hard gates: **4.5:1** body text, **3:1** shapes; **one colour system
  per report**; **colour is never the only cue**.

- **Type:** **Satoshi** from **Fontshare** (it is not on Google Fonts) plus **Noto Sans SC** from
  Google Fonts — Satoshi carries zero CJK glyphs and cannot set Chinese at all, and the default
  language pair is EN + 简体中文. Always emit a real fallback stack:
  `Satoshi, "Noto Sans SC", system-ui, sans-serif`. Hierarchy from **weight + size + tracking**,
  three tiers: Black `900` display, Bold `700` headings + labels, Medium `500` body. Sizes
  display-2xl→72 … title 36, h2 30, h3 24, h4 20, h5 18; body 16/1.55, body-sm 14, caption 13,
  overline 12, **micro 11**. **Chrome text** is tokenized to `--fs-overline/caption/micro`; chart
  SVG text is authored in **viewBox user units** (value 13 / label 11 / axis 9.5 / source 9), with
  a floor of 8 units on a half card and 7 on a wide one (`DESIGN.md` §1, §7).
- **Shape:** Radix radius scale — chips `--radius-1/2`, `full` on dots/pills, **chart cards 16px**
  (brandbook). Cards **flat — no border, no shadow**, separated by whitespace; `--shadow-1..6` is
  for tooltips/popovers only.
- **Spacing:** Radix `--space-1..9` (4px base) drives **all layout** — no hardcoded px (section
  rhythm `--space-9`/`8`, gaps `--space-4/5`, tight `--space-1..3`); only `clamp()` page padding
  and 1px hairlines.
- **Texture:** one fixed film-grain overlay -- light `multiply`/`.12` with a faint `jolt` tint;
  dark `screen`/`.15`. **Keep the green cast** — it's brand identity, not data-green.
- **Data-viz & icons:** charts are **selected from `CHARTS.md` and copied from
  `charts/gallery.html`** (Step 3) — never invented. Warm-ramp marks by importance, **one hero per
  chart**, fixed viewBox with the `≤760px` one-column breakpoint. Icons are **Radix Icons, inlined**
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

The **primary agent owns the editorial structure and factual scaffolding**: lock the outline,
claims, metrics, and a stable identifier for every human-readable content block before Step 4.
The writing model may polish the wording, but it must not introduce, remove, or reinterpret facts.

**Build with the anti-slop checklist in mind from the start** (varied charts, a real weight/size
hierarchy, trimmed copy, varied spacing) so the first render is already close — the Step 6 audit
then catches what slipped, rather than carrying the load alone.

### Charting data — analyze, select, then build

Charts are **first-class, interactive, and catalogued**. Work in this order: **analyze the raw
data → compute the metrics that matter → select the form from `CHARTS.md` → copy it from the
gallery → give most charts 2–3 meaningful views → annotate with metrics + insights.**

**Never invent a chart form and never improvise its geometry.** `CHARTS.md` carries 28 forms
keyed by data shape; `charts/gallery.html` carries a working implementation of each one that
is in the gallery. Selection is a lookup, not a judgment call about what looks good.

#### 1. Analyze the raw data and compute metrics

Don't just plot counts — **parse the source and compute the statistics that fit the data's
shape**, then surface the relevant ones (not all of them — only what earns insight):

| Data shape | Compute | Good views to offer |
|---|---|---|
| Multi-select (pick-any) | n, avg selections/respondent, top-item share %, % choosing ≥1, long-tail | count ↔ % of respondents ↔ sorted rank |
| Single-choice / part-to-whole | each share %, top share, top-2 concentration | 100% stacked ↔ ranked bar ↔ ring |
| Ordinal / Likert (1–n) | **mean, median, mode, std dev, % top-2-box, % bottom-2-box, net** | histogram ↔ diverging-from-midpoint ↔ cumulative |
| Numeric / continuous | mean, median, std dev, min/max, range/IQR, outliers, skew | histogram ↔ cumulative (ECDF) ↔ box |
| Time series | Δ first→last, % change, min/max, mean | line ↔ indexed-to-100 ↔ period-over-period |
| Two variables / two groups | correlation, difference, ratio, % gap | scatter ↔ dumbbell ↔ diverging |

Draw **mean/median reference lines** on distributions. Keep arithmetic honest (define n; note
multi-select totals exceed 100%).

#### 2. Select the form from the catalogue

Open **`CHARTS.md`**, find the row whose **data shape** honestly describes the data, and take one
of its forms. "Honestly" is the operative word: a ranking is not a time series, and four
percentages are not a distribution. Then:

Open `charts/gallery.html`, find the banner comment naming that form, copy the render function
verbatim, and re-bind it to the real data. Re-binding the data is the only change; the geometry and
styling ship as they are.

Copy the shared `VG` helper block along with the function — the render functions depend on it. For a
form marked **†** copy `VG.revealResponsive` too; it swaps in the narrow variant at `≤760px`. A form
marked **‡** is **desktop only** and must not go in a report meant to be read on a phone.

**Vary the forms down the report.** The same shape four times reads as a template, not analysis.
Where two sections share a data shape, reach for the sibling form rather than repeating the first
choice. A single headline figure is a **Big Stat**, not a chart.

**Only three forms need a library** — Sankey, Treemap and Network, all ECharts. Reaching for one
pulls ~1 MB over the network into the report; do it because the shape demands it, never because it
looks impressive.

#### 3. Colour — warm ramp carries the data, one hero per chart

Data marks come from the **warm ramp** (`DESIGN.md` §3), assigned **by importance, not by
sequence**: the most important series takes `w1`, the next `w2`, on down. Lightness *is* the
encoding.

**One hero per chart** — the subject of the point the section is making, *not* automatically the
maximum. `#008125` on light, `#00e13f` on dark. A second hero dissolves the first; if you cannot
name why a mark is the hero, it is `w1`.

**The jolt ramp is locked.** It never encodes magnitude — heat matrices, calendar heat and every
other ordinal scale use the warm ramp. **One colour system per report**: every chart in the output
file shares it. If one chart cannot express itself in it, change the system for the whole report,
never for that one chart.

**Colour is never the only cue.** Categories keep labels, ordinals keep length or position, the
hero keeps an annotation. Strip the colour out and the chart must still read.

#### 4. Geometry — fixed viewBox, one column on narrow

Charts are **fixed-`viewBox` SVG** (`400×300` half card, `840×300` wide), not fluid HTML/CSS. In
the editorial measure a half card renders near 1:1, so authored text sizes land as authored. The
`≤760px` one-column breakpoint is **mandatory** — without it two cards squeeze into a phone and the
text halves:

```css
@media (max-width:760px){ .vg-chartgrid{ grid-template-columns:1fr } }
```

**Every wide form must ship a narrow variant** — a re-laid `400`-wide viewBox swapped in at the
breakpoint — or be marked `desktop-only` in `CHARTS.md` and excluded from a report meant to be read
on a phone. Never let an `840` viewBox shrink onto a phone. Touch targets stay ≥ ~40px.

#### 5. Give most charts 2–3 **meaningful** views (toggleable)

Most charts ship **2–3 views the reader can toggle**, where **each view answers a different
question** — e.g. *absolute counts ↔ % share ↔ sorted rank*; *distribution ↔ cumulative*;
*grouped ↔ stacked ↔ 100%*; *raw ↔ deviation-from-mean*; or the same data **cut a different way**.
A cosmetic re-skin (same question, new colours) is **not** a view — if a second view adds no
insight, ship one. Simple data may stay single-view. **Don't spam** views or metrics.

#### 6. Make them interactive

Inline vanilla JS for everything except the three ECharts forms. Per chart, as it helps:

- **View toggle** — a segmented control (Radix chart-type icons, `DESIGN.md` §8) switching the
  2–3 views. Real `<button>`s, keyboard-reachable.
- **Hover/focus tooltip** — exact value + share + context, styled per §7.
- **Series focus** — hovering a legend key raises its series; others drop back via an overlay wash.
- **Sort toggle** where ranking is the point.
- **Replay** — the entrance replays on click, via the gallery's `VG.reveal` helper.

#### 7. Annotate with metrics **and insights**

Render the computed metrics as **callouts beside/above the chart** (styled per §7). **Every metric
gets a one-line, strictly descriptive insight** — what the number means in plain language, never a
bare figure and never a recommendation or buzzword. Deltas use Radix arrows (▲/▼) **with the sign**
(not colour alone).

#### 8. Card structure — four fixed parts

Every chart ships in the same frame (`DESIGN.md` §7), and none of the parts is optional:
**conclusion title** (states the finding, never the chart type) → **subtitle** (legend meaning,
unit, time range, `·` separated; name the unit whenever a mark is a countable thing) → **the
chart** → **source line** (form name · series · source, uppercase).

#### 9. Print / PDF fallback

The **primary view renders statically** with full labels and the key metric callouts. Alternate
views, tooltips and toggles are screen-only; the PDF captures **only the primary view + metrics**
(Step 7).

**`@media print` must force the final animation frame.** Entrance animations start marks at
`scale(0)`; a PDF exported before they settle is a page of empty cards. The gallery's print block
does this — carry it into every report.

---
## Step 4: Polish and translate with an affordable writing model

For **every normal run and `demo` run** (not `setup`), delegate copy polishing and translation to
one fast, affordable model with strong writing and multilingual ability whenever the coding agent
supports subagents. If the environment supports model selection:

- **Claude Code:** prefer the `sonnet` model alias (the current Sonnet; the affordable tier).
- **Other coding agents (including Cursor and Codex):** select the closest available equivalent
  optimized for writing quality, cost, and latency. Do not reflexively choose the cheapest model
  when it would materially weaken the prose, and do not prompt the user to choose a model.

Use **one writing subagent for the complete copy set** so voice, terminology, and block structure
stay consistent. Give it the source, the locked editorial outline, factual constraints, language
pair, and stable content-block identifiers from Step 3. It must work in this order:

1. Produce polished canonical copy in `langPair.a`. If the source is not in `langPair.a`, create a
   faithful primary-language version from the source first.
2. Translate that canonical copy into `langPair.b`.
3. Return paired `langPair.a` / `langPair.b` blocks with matching identifiers and structure.

Translate every human-readable string. Preserve Markdown structure and inline formatting; **do
not translate or alter** code, identifiers, URLs, numeric data, or factual claims. Copy polishing
may improve clarity, rhythm, and editorial flow only.

While the writing subagent works, the primary agent may continue language-neutral calculations,
chart planning, and layout preparation. It must validate the returned copy before final HTML
assembly: every identifier must be present in both languages, structures must align, and protected
content must remain unchanged. If the result is incomplete, mismatched, or weak, send **one
targeted correction** to the same affordable model; then have the primary agent repair anything
that still fails validation.

If model-selectable subagents are unavailable, use an available default subagent. If delegation
itself is unavailable, the primary agent performs the same polish-then-translate sequence. Never
add a translation API or block report generation because preferred model routing is unavailable.
Both language variants for every text block ship in the HTML.

---

## Step 5: Build the HTML

Emit **one** `.html` file. It loads its type and, where a chart needs it, one library from a CDN —
see **Network dependency** below.

- `<!doctype html><html data-theme="light" data-lang="<a>">` ... inline `<style>` only.
- **Fonts — two families, both from a CDN.** **Satoshi** from **Fontshare** for Latin; it is not on
  Google Fonts, so use the Fontshare endpoint. **Noto Sans SC** from Google Fonts for Chinese —
  Satoshi carries 431 glyphs and **zero CJK ideographs**, so it cannot set 简体中文 at all. Google
  slices Noto by `unicode-range`, so only the glyphs actually used are downloaded.

  ```html
  <link rel="preconnect" href="https://api.fontshare.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@400,500,700,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
  ```

  Always emit a real fallback stack — `Satoshi, "Noto Sans SC", system-ui, -apple-system,
  sans-serif` — so a blocked or cold CDN degrades to system type rather than to nothing. The
  display↔body contrast comes from the **weight jump** (display 900, headings 700, body 500), not a
  second typeface; the slop tell is a *flat* hierarchy, not one well-cut family. Satoshi has real
  lowercase, so headings stay **sentence/title case**.
- **Both languages in the DOM.** Wrap each translated block as `.lang-a` / `.lang-b`; CSS shows
  the block matching `html[data-lang]`. Language-neutral content (code, numbers, charts) is not
  duplicated.
- **Two themes via `data-theme`** light/dark, on the brandbook roles from Step 2. Emit the nine
  brand tokens for both themes, the **warm ramp** (`--w1..--w7`, inverted on dark), the **jolt
  ramp**, the role aliases (`--bg`, `--bg-alt`, `--txt`, `--mut`, `--grid`, `--hero`), the
  **overlay** scales (`--black-a1..12` / `--white-a1..12`), and the radius (`--radius-*`), space
  (`--space-*`) and shadow (`--shadow-1..6`) scales — plus `--fs-micro`. Define the light palette on
  bare `:root`, redeclare under `@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]) }`,
  and again under `:root[data-theme="dark"]` so the toggle wins both ways.
- **Charts** -- inline each render function from `charts/gallery.html` plus the shared `VG` helper
  block (Step 3), `width:100%; height:auto` on the fixed `viewBox`, the `≤760px` breakpoint from
  Step 3, and `≤420` stacking for the surrounding grid.
- **Token-driven layout & text:** layout spacing uses `--space-*` (no hardcoded px); chrome text uses
  `--fs-overline/caption/micro`; chart SVG text is in viewBox user units; metric value at `--fs-h4`.
- **Radix Icons, inlined.** Inline the SVG paths for the icons used (deltas, info, chart-type
  toggles — `DESIGN.md` §8) as `<svg viewBox="0 0 15 15" ...>` with `currentColor` fills. **No**
  `<img>`, npm, or icon fonts — the report already depends on CDNs for type and must not add more.
- **Page toggles** -- two small fixed controls (top-right): a **theme** toggle and a **language**
  toggle, flipping `data-theme` / `data-lang` on `<html>`.
- **Interactive charts.** Inline vanilla JS for every form except the three ECharts ones: the
  **view toggle** (segmented control with Radix icons), **hover/focus tooltips**, **series focus**,
  and the `VG.reveal` scroll-in entrance with click-to-replay (Step 3 / §7). The **primary view +
  metric callouts render statically**; the rest are screen-only enhancements.
- **Footer** -- one quiet line: `Generated with /writereport · <date>`. The design system's internal
  name and token jargon stay out of the output.
- **Film grain** overlay per Step 2 (kept).
- **Print CSS** -- `@page { margin }`, sensible page breaks (`break-inside: avoid` on cards,
  tables, charts, pull quotes), and `@media print { .vg-grain, .vg-toggles, .vg-viewtoggle,
  .vg-tooltip { display: none } }`. In print, **show only each chart's primary view** (hide the
  alternates) and the metric callouts. **Print must also force the final animation frame** —
  entrance animations start marks at `scale(0)`, so a PDF taken before they settle is a page of
  empty cards:

  ```css
  @media print{
    .vg-grow,.vg-rise,.vg-pop,.vg-fade{animation:none!important;transform:none!important;opacity:1!important}
    .vg-draw{animation:none!important;stroke-dasharray:none!important;stroke-dashoffset:0!important}
  }
  ```

### Network dependency

The output **requires a network connection to render as designed**. This is a deliberate trade for
the catalogue's range, matching how the reference systems in this space ship. Handle it honestly:

- Give every font a real fallback stack (above).
- **ECharts is emitted only when a chart in this report actually needs it** — Sankey, Treemap or
  Network. A report without one of those forms links no library at all.
  `<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>`
- **Tell the user in one line** that the report needs a connection, and say whether ECharts was
  included.

---
## Step 6: Anti-slop pass

**After the first render, before finalizing, audit the output and fix it.** Open the generated
HTML (with your browser tool if available; otherwise re-read the markup) and check it against the
**Anti-slop checklist** below. Then **redesign** anything it trips — honoring `DESIGN.md`'s
deliberate choices, but fixing clear slop. Re-render and repeat until clean. Highest-value checks:

- **Charts:** every form **selected from `CHARTS.md` by data shape and copied from the gallery** —
  none improvised? Forms varied, not the same shape all the way down? Do the **multiple views
  answer different questions** (not cosmetic re-skins)? Toggle, tooltip and series-focus work, and
  the **primary view + metrics read on their own**?
- **Metrics:** every metric callout has a **descriptive insight** (not a bare number, not a
  recommendation)? Arithmetic honest (n defined, multi-select >100% noted)?
- **Adaptive:** open it at ~390px — does the chart grid drop to **one column**, is every chart text
  legible, has every **wide form swapped to its narrow variant** or been excluded, do grids stack,
  and is there **no horizontal overflow**?
- **Type:** real weight/size hierarchy in Satoshi (Black 900 display vs Medium 500 body), beyond a
  couple of near-identical sizes?
- **Copy:** trim em-dash overuse, marketing buzzwords, and aphoristic "X, not Y" cadence.
- **Layout:** vary spacing (Radix `--space-*`, not one value); avoid identical card grids / nested
  cards; line length ≤ ~80 chars; don't lean on the eyebrow + `01/02` + oversized-headline combo.
- **One hero per chart:** data marks come from the **warm ramp assigned by importance**, with **at
  most one hero mark per chart** (the insight's subject) + mean line + delta. A second hero = fail.
  The **jolt ramp never encodes magnitude** — heat and intensity use the warm ramp.
- **One colour system per report:** every chart shares it. A chart that switched systems on its own
  = fail.
- **Colour is never the only cue:** strip the colour and the chart still reads — categories keep
  labels, ordinals keep length or position, the hero keeps an annotation.
- **Color/contrast:** colour from the brandbook **roles** (`BG`/`BG-alt`/`TXT`/`MUT`/`GRID`/`DATA`/
  `HERO`); **4.5:1** body text, **3:1** shapes; no `#00e13f` on a light ground (1.73:1 — use
  `#008125`); transparency from the overlay steps.
- **Tokenized text + spacing:** chrome text uses `--fs-overline/caption/micro`; chart SVG text is in
  viewBox user units and never below the 8-unit floor (7 on wide); layout spacing uses `--space-*`
  (no hardcoded px).
- **Radius/elevation:** cards flat — **no border, no shadow**, separated by whitespace; radius
  restrained (chart cards 16px, never 40px+).
- **Fills are solid:** no gradients, glows or drop shadows on marks. The only opacity that carries
  meaning is density in an overlay form.
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

**Wait for the page before printing.** The report pulls type from two CDNs, and ECharts from a
third when a chart needs it. Printing early yields fallback type and empty chart frames. Before
each print:

1. `await document.fonts.ready`.
2. Where ECharts is used, confirm `window.echarts` is defined.
3. Call `window.vgDrawAll()` — a chart that never scrolled into view has never rendered at all, so
   the print CSS has nothing to freeze. `VG.reveal` also force-draws on `beforeprint`, but headless
   printing does not always fire that event, so call it explicitly. Then allow ~1s to settle.

- Claude Code: Chrome MCP (or headless Chrome `--print-to-pdf`) -- serve the file over
  `http://127.0.0.1:<port>` and navigate there. Chrome MCP refuses `file://` URLs, and a `file://`
  page may also be blocked from reaching the CDNs.
- Other agents: use your browser-automation / headless-print tool, or a print CLI if available.
- Set `data-lang` to language A, print -> `*.en.pdf`; set to language B, print -> `*.cn.pdf`.
- **No browser/print tool?** Write the HTML and tell the user: "Open it and use Print -> Save as
  PDF (switch the language toggle for each version)."

---

## Step 8: Verify

1. Open the HTML with your browser tool (if available) and screenshot it (light + dark).
2. Confirm: the **language toggle** flips languages, the **theme toggle** flips light <-> dark,
   tables render, chart forms are varied (not one shape repeated), and the brandbook roles + warm
   ramp render correctly in both themes — including that the ramp **inverts** on dark.
3. Confirm the **chart interactivity**: per-chart **view toggle** switches between the 2–3
   meaningful views, **tooltips** show on hover/focus, and **metric callouts carry insights**.
   **Screenshot only after the entrances have finished** — a capture taken mid-entrance shows empty
   cards and is not evidence of a bug.
4. Confirm Radix **icons render inline**, and that the only external requests are the sanctioned
   ones: Fontshare, Google Fonts, and jsDelivr **only if** a chart needed ECharts. No `<img>`, no
   npm, no icon fonts, no fourth host.
5. **Reload with the network throttled or blocked** and confirm the page still lays out on the
   fallback font stack rather than collapsing.
6. Confirm the design system's name appears nowhere, and the footer is the quiet `/writereport` line.
7. Confirm the PDF(s) exist, open to the right language in light theme, show real Satoshi rather
   than fallback type, and show each chart's **primary view + metrics** fully drawn (lossy is
   expected; blank chart frames are not).
8. **Check the `≤760px` breakpoint** — at phone width the chart grid must be one column, and no
   wide-form chart may be present unless it swapped to its narrow variant.
9. Without a browser tool, state what you could not visually verify and ask the user to confirm.
10. Report the output paths.

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

- **Adaptive output.** The report must read on a phone: the `≤760px` one-column breakpoint, a
  narrow variant for every wide form (or exclusion), `≤420` grid stacking, touch targets around
  40px, no horizontal overflow (Step 3 §4).
- **Single file, three CDNs.** One `.html` with inline CSS, inline SVG charts and Radix icons, and
  inline vanilla JS. Type loads from Fontshare and Google Fonts with a real fallback stack; ECharts
  loads from jsDelivr only when a chart in that report needs it. Tell the user in one line that the
  report needs a connection. No npm, no `<img>`, no icon fonts.
- **Charts are selected and copied, never invented.** Compute the metrics that fit the data's shape,
  pick the form from `CHARTS.md`, copy it from `charts/gallery.html`, vary the forms down the
  report, and give each chart one hero mark (Step 3).
- **Interactive on screen, static in print.** Most charts carry 2–3 meaningful views, tooltips and
  series focus; the primary view plus metric callouts render statically and are all the PDF carries.
- **All literals from `DESIGN.md`.** Brandbook roles by name, the warm ramp for data, the locked
  jolt ramp for accents only, `--space-*` / `--fs-*` / `--radius-*` / `--shadow-*` tokens, 4.5:1
  text and 3:1 shapes, one colour system per report, colour never the only cue (Step 2).
- **Always editorial.** /writereport applies the bundled `DESIGN.md`, never the host project's
  design system, and never names it in the output; the footer is `Generated with /writereport ·
  <date>`.
- **Never overwrite the source.** Write `*.writereport.html` / `*.en.pdf` / `*.cn.pdf` beside it.
- **Languages.** Default silently to EN + 简体中文; persist to `docs/.writereport.json` only on an
  explicit non-default choice or `setup`. Both languages ship in the HTML; PDF exports one file per
  language. The affordable writing model polishes and translates on every normal and `demo` run
  (Step 4), never on `setup`.
- **Degrade gracefully** when a browser, print tool or CDN is unavailable: fall back and tell the
  user what changed.
- **Run the anti-slop pass** (Step 6) after the first render, before finalizing.
