---
version: alpha
name: Chart catalogue — Editorial
description: 28 chart forms keyed by data shape, with the geometry and engine each one needs. Selection reference for /writereport; visual language lives in DESIGN.md §7, working implementations in charts/gallery.html.
---

# Chart catalogue

28 forms, keyed by **data shape** — the question the data can honestly answer. Pick
by shape first and taste second; a form that misrepresents the data is not rescued
by looking good.

**Never invent a chart form.** Find the shape below, take one of its forms, then open
`charts/gallery.html`, find the banner comment naming that form, and copy its render function.
Re-bind it to the real data. **Do not re-derive the geometry** — every one of the 28 forms
already has working code, and re-deriving it is how charts drift out of the system.

Colour, type, motion, card structure and the responsive rule all come from
`DESIGN.md` §7. This file only decides **which form**.

---

## Choosing by data shape

Work down this list and stop at the first row that honestly describes the data.
"Honestly" is the operative word: a ranking is not a time series, and four
percentages are not a distribution.

| The data is…                                              | Go to             |
| --------------------------------------------------------- | ----------------- |
| One number that is the whole point                        | §8 Single value   |
| Values across categories, and the order is the story      | §1 Ranking        |
| Parts that sum to a meaningful whole                      | §2 Part-to-whole  |
| Values along a continuous time axis                       | §3 Over time      |
| Many records of one variable, and the spread is the story | §4 Distribution   |
| Two or more continuous variables per record               | §5 Correlation    |
| Two discrete dimensions crossed, with a value in each cell| §6 Two dimensions |
| Amounts moving between stages, or nested inside a total   | §7 Flow           |

**Vary the forms down a report.** The same shape repeated four times reads as a
template, not as analysis. If two sections genuinely share a data shape, reach for
the sibling form rather than repeating the first choice.

---

## 1. Ranking and comparison

Categories with one value each, where the order carries the meaning. Sort by value
unless the categories have an inherent order — never alphabetically by accident.

| Form            | Data shape                                   | Reach for it when                                   | Read | Engine | Card | Gallery |
| --------------- | -------------------------------------------- | --------------------------------------------------- | ---- | ------ | ---- | ------- |
| **Ranked Bars** | ≤10 categories, one value each               | The default. Long labels, and magnitude matters      | ~10s | SVG    | half | ✓       |
| **Counted Rows**| ≤8 categories, values are countable units    | The unit is meaningful — tickets, people, releases   | ~30s | SVG    | half | ✓       |
| **Dot Plot**    | ≤15 categories, one value each, tight range  | Bars would be mostly ink; the differences are small  | ~10s | SVG    | half | ✓       |
| **Dumbbell**    | ≤8 categories × 2 values (before/after)      | Comparing two states per category, not a trend       | ~30s | SVG    | half | ✓       |

Bars never break their axis — length is the contract. For an extreme value, let it
run, add an inset, or say plainly in the subtitle that the scale is clipped.

## 2. Part-to-whole

Parts summing to a meaningful 100%. If the parts do not sum to a whole, this is a
ranking, not a composition — go back to §1.

| Form                | Data shape                                | Reach for it when                                  | Read | Engine | Card | Gallery |
| ------------------- | ----------------------------------------- | -------------------------------------------------- | ---- | ------ | ---- | ------- |
| **Segmented Ring**  | ≤6 segments of a whole                    | The whole matters as much as the parts              | ~10s | SVG    | half | ✓       |
| **Waffle Grid**     | ≤5 categories, read as "N in every 100"   | The reader should be able to count                  | ~10s | SVG    | half | ✓       |
| **Unit Field**      | ≤6 categories, one mark per real record   | Records are few enough to show individually         | ~30s | SVG    | half | ✓       |
| **Stacked Bars**    | ≤5 categories × ≤4 segments               | Composition *and* total vary across categories      | ~30s | SVG    | half | ✓       |

Never use a pie. Segmented Ring exists because a ring reads its total; a pie asks
the reader to compare angles, which they cannot do.

## 3. Change over time

A continuous time axis. Categories that merely happen to be years are a ranking.

| Form             | Data shape                                     | Reach for it when                              | Read | Engine | Card | Gallery |
| ---------------- | ---------------------------------------------- | ----------------------------------------------- | ---- | ------ | ---- | ------- |
| **Thread Line**  | 1–3 series, 10–90 points                       | The default for a trend                         | ~10s | SVG    | half | ✓       |
| **Thread Area**  | 1 series, 30–120 points, meaningful zero       | Volume or accumulation, not just direction      | ~10s | SVG    | half | ✓       |
| **Slope**        | ≤12 entities × exactly 2 time points           | Only start and end matter, and rank changed     | ~30s | SVG    | half | ✓       |
| **Flow Ribbon**  | 2–5 series over continuous time, stacked       | Composition shifts *and* the total moves        | ~30s | SVG    | wide† | ✓       |
## 4. Distribution

Many records of one variable, where the spread — not the average — is the story.

| Form                | Data shape                                    | Reach for it when                               | Read | Engine | Card | Gallery |
| ------------------- | --------------------------------------------- | ------------------------------------------------ | ---- | ------ | ---- | ------- |
| **Binned Columns**  | 1 variable, 6–20 bins with business meaning   | The bins mean something — "under 6 hours"        | ~30s | SVG    | half | ✓       |
| **Box Plot**        | 2–8 groups, each summarisable to five numbers | Comparing groups, and outliers matter            | ~30s | SVG    | half | ✓       |
| **Beeswarm**        | 40–180 records, one variable                  | Every record deserves to be visible              | ~30s | SVG    | half | ✓       |
| **Ridgeline**       | 3–8 groups of continuous values               | Comparing the *shape* of several distributions   | >30s | SVG    | wide† | ✓       |
## 5. Correlation

Two or more continuous variables per record.

| Form                      | Data shape                          | Reach for it when                          | Read | Engine | Card | Gallery |
| ------------------------- | ----------------------------------- | ------------------------------------------- | ---- | ------ | ---- | ------- |
| **Scatter**               | ≤60 records × 2 continuous vars     | Testing whether two things move together    | ~30s | SVG    | half | ✓       |
| **Parallel Coordinates**  | ≤20 entities × 3–6 continuous vars  | Comparing entities across several measures  | >30s | SVG    | wide‡ | ✓       |
Never draw a trend line without stating the correlation and the sample size in the
subtitle. A line through eight points is decoration.

## 6. Two discrete dimensions

Two categorical axes crossed, with one value per cell. Intensity uses the **warm
ramp** — the jolt ramp is locked and never encodes magnitude (`DESIGN.md` §3).

| Form              | Data shape                              | Reach for it when                          | Read | Engine | Card | Gallery |
| ----------------- | --------------------------------------- | ------------------------------------------- | ---- | ------ | ---- | ------- |
| **Heat Matrix**   | ≤10 × ≤10 cells, one value each         | The pattern across the grid is the finding  | ~30s | SVG    | half | ✓       |
| **Calendar Heat** | 52 weeks × 7 days, one value per day    | A full year, and weekly rhythm matters      | ~30s | SVG    | wide‡ | ✓       |
| **Punch Card**    | 7 weekdays × 24 hours                   | Operational rhythm — when load arrives      | ~30s | SVG    | wide† | ✓       |
## 7. Flow and hierarchy

Amounts moving between stages, or nested inside a total. **The only three forms in
the catalogue that need a library.**

| Form           | Data shape                                  | Reach for it when                             | Read | Engine  | Card | Gallery |
| -------------- | ------------------------------------------- | ---------------------------------------------- | ---- | ------- | ---- | ------- |
| **Waterfall**  | ≤8 signed steps from an opening to a close  | Explaining how a total got from A to B         | ~30s | SVG     | half | ✓       |
| **Sankey**     | 2–3 stages, ≤20 flows, non-negative         | Where volume goes as it passes through stages  | ~30s | ECharts | wide‡ | ✓       |
| **Treemap**    | 2 levels, non-negative weights              | Share of a total, with nesting                 | ~30s | ECharts | half | ✓       |
| **Network**    | ≤60 nodes with meaningful edges             | The connections *are* the subject              | >30s | ECharts | wide‡ | ✓       |
Only reach for a library form when the shape genuinely demands it. Adding ECharts
pulls ~1 MB over the network into the report; a Sankey drawn because it looks
impressive, over data a Stacked Bars would carry, is not worth that.

## 8. Single value

| Form              | Data shape                          | Reach for it when                        | Read | Engine | Card | Gallery |
| ----------------- | ----------------------------------- | ----------------------------------------- | ---- | ------ | ---- | ------- |
| **Big Stat**      | One figure, optionally with a delta | The number *is* the section               | <5s  | HTML   | half | ✓       |
| **Progress Arc**  | One value against a known target    | Distance to a goal is the point           | <10s | SVG    | half | ✓       |
| **Bullet**        | Value + target + qualitative bands  | Performance against a target *and* a range| ~10s | SVG    | half | ✓       |
A single headline figure is a **Big Stat**, not a chart. Do not draw a one-bar bar
chart.

---

**Every form in this catalogue ships working code.** Open `charts/gallery.html`, find the form's
banner comment, copy its render function, re-bind it to real data. Do not re-derive the geometry.

† **Ships a narrow variant**, swapped automatically at `≤760px` by `VG.revealResponsive` — copy
that helper along with the render function. Flow Ribbon re-lays as Stacked Bars over six time
buckets, Ridgeline as a Box Plot of the same groups, Punch Card as a 7×4 grid of six-hour buckets.

‡ **Desktop only.** These forms cannot be made honest at phone width — 53 calendar columns, six
independent axes, or a force layout all need the room. **Do not put one in a report meant to be
read on a phone.** There is no narrow fallback by design; substituting a different form silently
would misrepresent the data.

**Calendar Heat sets its own height** (`840×200`). A 53-week grid is inherently short and wide;
padding it into a 300-unit card leaves two thirds of the card empty.

**Three forms need ECharts** — Sankey, Treemap and Network. Everything else is hand-drawn SVG or,
for Big Stat, plain HTML. `VG.echart` renders with the **SVG renderer** (canvas prints as a blurry
bitmap) and shows a visible message if the CDN is blocked, rather than an empty box.

---

## Hard rules

1. **One colour system per report.** Every chart in an output file uses the same
   system. If one chart cannot express itself in it, change the system for the whole
   report or drop the report to the warm ramp. Never mix per chart (`DESIGN.md` §3).
2. **One hero per chart.** A second hero dissolves the first.
3. **The warm ramp is assigned by importance, not by sequence.** The most important
   series takes `w1`, whatever order it appears in the data.
4. **Wide forms need a narrow variant.** Any form marked `wide` must ship a re-laid
   `400`-wide viewBox for `≤760px`, or be declared `desktop-only` and excluded from
   reports meant to be read on a phone.
5. **Colour is never the only cue.** Categories keep labels, ordinals keep length or
   position, the hero keeps an annotation.
6. **State the unit in the subtitle** whenever a mark represents a countable thing.
7. **Never fabricate individual records** to fill a unit chart. Show only units the
   data actually supports.

---
