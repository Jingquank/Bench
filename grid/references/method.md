# The grid construction method (Müller-Brockmann → web)

This is the method from *Grid Systems in Graphic Design* (Josef Müller-Brockmann),
mapped onto screens. Read it before configuring an overlay so the grid you draw
is derived, rather than guessed.

## What the grid is for

Müller-Brockmann frames the grid as an ordering system — the will to clarity,
objectivity, and rational, reproducible structure. On the page it does three
jobs: it fixes where text and image sit, it makes the relationships between
elements legible, and it lets several people work on one publication and keep a
coherent whole. The same holds for a product UI: the grid is what keeps fifty
screens by five designers reading as one system.

## The four-sketch method (book, "Construction of the grid")

The book builds a grid in four sketches. Treat them as the order of operations:

1. **Determine the type area.** Sketch the type area 1:1 — the depth and breadth
   that read well both functionally and aesthetically against the page
   proportions. On screen this is the content **measure** (max-width) and the
   page **margins** around it.

2. **Divide the type area into columns.** Split the measure into 2, 3, or more
   columns separated by an intervening space (the **gutter**). Book examples run
   double-page spreads at 5/6 and 8/10 columns; web grids commonly use 12.

3. **Divide the columns into grid fields.** Cut the columns horizontally into
   rows, producing the **fields** (*Rasterfelder*) — the column × row modules
   that every block snaps to. Common field counts in the book: 8, 20, 32.

4. **Match field depth to the lines of text.** Choose type size and leading
   (the book's worked figure is a 10-pt face on 3-pt leading), then size each
   field to hold a whole number of text lines so the field's top and bottom
   edges land exactly on baselines. This is the step that ties the grid to the
   type.

After all four, step back and judge the margin proportions against the page —
if the relationship is off, start again. The book is explicit that this is
iterative and partly a matter of aesthetic judgment, not a fixed formula.

## The load-bearing rule: the baseline grid

Everything hangs on one rule: **the field height is an integer number of
baseline rows, and edges align to baselines.** The baseline rhythm equals the
body line-height. Titles are sized so their own leading is a multiple that
re-aligns to the body baseline — the book's example sets a 20-pt title on 4-pt
leading (24 pt), which equals two 10-pt body lines on 2-pt leading (2 × 12 pt).
Pictures, tables, and statistics are treated as grid fields too: sized to the
field, with upper and lower edges sitting on text lines.

On the web this becomes: pick a body `line-height` (say 24px), make that your
`--grid-baseline`, and size every block — images, cards, section padding — to a
multiple of it. A field of 4 rows is 96px tall; combine fields with one blank
row between them and the combined block still lands on the baseline.

Two sharp rules make this hold in practice:

- **Set display line-heights in px, not unitless.** A unitless `line-height` on
  large type resolves to a non-baseline multiple and pushes the box off the
  rhythm. Give headings an explicit px line-height that is a whole multiple of
  `--grid-baseline` (e.g. `line-height: 48px` for a heading on two baselines).
- **Media heights = whole multiples of the leading.** Size images and embeds to
  `calc(var(--grid-baseline) * N)` so the top *and* the bottom both land on
  lines; arbitrary px heights or `aspect-ratio` left to chance will drift. The
  `.media-N` helpers in `grid.css` do this.

## Print → web translation

| Book term            | Web equivalent                          | In this skill            |
|----------------------|------------------------------------------|--------------------------|
| Type area / Satzspiegel | Content measure + margins             | `maxWidth`, `margin`     |
| Column (Spalte)      | Column track                             | `columns`                |
| Row of fields        | Row track                                | `rows`                   |
| Intervening space    | Column gutter / row gutter               | `gutter`, `rowGutter`    |
| Grid field (Rasterfeld) | One cell of the columns × rows matrix | `rowHeight` (field depth)|
| Line of text / leading | Baseline rhythm = line-height          | `baseline`               |
| Field combination    | Spanning cells / merged modules          | `.col-span-*`, `.row-span-*` |

The grid is a matrix: total fields = `columns` × `rows`. The book's canonical
counts come straight out of this — 8 fields (e.g. 2 × 4), 20 fields (4 × 5),
32 fields (4 × 8). Set `rows: 0` for an open page where the field rhythm tiles
down as the reader scrolls; set `rows: N` for a bounded matrix (a poster, a
hero, a fold-aware region, a print-like page) anchored to the top of the
content, with exactly N rows between a top and bottom edge.

Two things change off the page. Screens are fluid, so columns are fractional
tracks (`1fr`) inside a centered measure rather than fixed picas; the overlay
recomputes on resize. And screens scroll, so the field matrix either anchors to
the document top and scrolls with it (bounded `rows`) or tiles its row rhythm
down an open page (`rows: 0`); the fine baseline layer always tiles the
viewport so you can check rhythm anywhere. The overlay handles the scroll
offsets for each.

## Placing elements: by line, not by eye

The book snaps every block to a grid field; on the web the faithful equivalent
is to place by **column line**, not by a guessed span. A top-level `.grid` child
can use `.col-span-N`, but nested layouts drift — a `.col-span-6` inside a
`.col-span-6` re-divides only half the page, so its lines no longer match the
page's. Use a **subgrid band**: a full-width element (`grid-column: 1 / -1`) that
re-exposes the parent columns (`grid-template-columns: subgrid`), so its children
place against the *same* lines as everything else (`grid-column: 1 / 6`,
`6 / 13`). Lines run `1 … columns + 1`; the gutter lives between adjacent tracks,
so an element ending "at line N" stops at the far side of that gutter. `grid.css`
ships `.band` with a non-subgrid fallback.

## Optical alignment: align the ink, not the box

A subtle finish on large display type: a headline whose layout **box** sits
exactly on the column line still *looks* indented, because the letterform's
**ink** is inset by its left side-bearing. Box-on-grid ≠ ink-on-grid. The cure
is to measure the first glyph's actual ink offset in the loaded font and nudge
the element left so the visible ink lands on the line. `grid-optical.js` does
this at runtime (`GridOptical.align('.masthead, h1')`), re-running after webfonts
load and on resize. Apply it only to large display type — mastheads, big
numerals, section heads — never body text, where the side-bearing is invisible.
**Caveat:** the offset is font-specific, so the measurement is only right when
the real webfont is loaded (a fallback grotesque gives a different, wrong nudge).

## Images and captions (book, "Construction of the grid")

- A picture, whatever its size, fills whole fields; its top and bottom edges sit
  on text lines and its width matches the column(s) it spans.
- Reserve caption space inside the field — the book shows grids with 1 line and
  with 3 lines set aside under the image for the legend.
- Combine fields freely into larger blocks, but the merged block's edges must
  still meet the baselines.

## Deriving a config from type

Given a body face at font-size `F` and line-height `L` (px):

1. `baseline = L`.
2. Choose `columns` from content density — 12 is a flexible default; editorial
   text reads well at 6; dense dashboards may want 16 or 24.
3. Choose `rows`. For a bounded region (poster, hero, fold) pick the number of
   field rows directly — `columns × rows` is the field count, so 4 columns × 5
   rows gives the book's 20-field grid. For an open scrolling page use
   `rows: 0` and the field rhythm tiles down.
4. `rowHeight` = baselines per field row, so a field is a useful block height.
   With `L = 24`, `rowHeight = 4` → 96px fields; `rowHeight = 3` → 72px.
5. `rowGutter = 1` keeps one blank baseline row between stacked rows.
6. Set `margin` and `maxWidth` by eye against the viewport, then judge the
   proportion — the book's final check. A common starting point: `maxWidth`
   1100–1280, `margin` 24–48.
7. `gutter` is usually around one baseline (`24`), tightened or opened to taste.

Run the overlay, view the four layers together, and adjust until type lands on
the baseline and images fall on field edges. That visual check is the whole
point — the grid is correct when the page sits on it.
