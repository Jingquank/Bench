# Overlay API & integration

Two interchangeable implementations of the overlay live in `assets/`:
`grid-overlay.js` (vanilla, drop-in / bookmarklet) and `GridOverlay.jsx`
(React). On top of the vanilla engine, `grid-debug.js` adds the live debug
panel. All read the same config.

## Debug panel (grid-debug.js)

The panel drives the overlay and rewrites the product's `--grid-*` custom
properties in place, so moving a slider reflows the real layout (not just the
overlay). Load the engine first, then the panel:

```html
<link rel="stylesheet" href="grid.css">
<script src="grid-overlay.js" data-auto="false"></script>
<script src="grid-debug.js"></script>
```

It auto-mounts on load. Pass `data-auto="false"` on the debug script to mount
manually via `GridDebug.mount()`. Gate it to development so it never ships:

```js
// Vite
if (import.meta.env.DEV) { await import('./grid-overlay.js'); await import('./grid-debug.js'); }
```

```jsx
// React — mount once in a dev-only effect
useEffect(() => { if (import.meta.env.DEV) import('./grid-debug.js'); }, []);
```

What it offers:

- **Layers** — the six modes as buttons (all / columns / baseline / fields /
  margins / off), the active one highlighted.
- **Grid** — a slider + number field for every config key, with a live
  `columns × rows = N fields` readout in the header.
- **Colour** — pickers for the line and field colours.
- **Presets** — Müller-Brockmann 8 (2×4), 20 (4×5), 32 (4×8), plus editorial 6,
  general 12, dashboard 16.
- **Export** — `copy css` emits a `:root { --grid-* }` block of the current
  values to paste back into `grid.css`; `copy json` emits the overlay config.
- **Reset** — clears saved state and re-reads `:root` defaults.

The panel lives in a shadow root, so the product's CSS can't style it and its
styles can't leak out. State persists to `localStorage('grid-debug')` and
restores on reload. Drag it by the header; `shift+G` shows/hides it. Globals:
`GridDebug.mount()`, `.unmount()`, `.reset()`.

Because the panel writes the same `--grid-*` variables that `grid.css` reads,
shipping `grid.css` is what makes tuning affect real layout — pair them.

## Layers and modes

The overlay paints four layers; the mode controls which are visible.

- **margins** — the two guides at the inner content edge (where the columns start)
- **columns** — the column tracks with gutters, inside the measure
- **baseline** — horizontal lines at every baseline row (scrolls with content)
- **fields** — shaded column × row modules (scrolls with content)

Modes cycle: `all → columns → baseline → fields → margins → off`.

### The overlay shares the content box (no centered-container drift)

The overlay must draw its columns where the content's columns actually are, or
it "drifts" — the classic *"the grid is just slapped on top and misaligned"*
bug. It happens when the overlay treats `margin` as space *outside* the measure
while the content treats it as padding *inside* a centered `max-width` container:
once the viewport is wider than `maxWidth`, the overlay's columns end up
`2 × margin` wider than the real ones.

This overlay uses the **same model as `grid.css`**: an outer box capped at
`maxWidth` and centered, with `margin` as padding *inside* it, so the column
area is `maxWidth − 2·margin`. The overlay columns therefore coincide with the
content columns at every width — provided your content uses the matching CSS
(`max-width: var(--grid-max-width); margin-inline: auto; padding-inline:
var(--grid-margin)`, i.e. what `grid.css .grid` already does). Use `verify-grid.js`
to prove 0px adherence above and below `maxWidth`.

## Config

| Key            | Default   | Meaning                                            |
|----------------|-----------|----------------------------------------------------|
| `columns`      | 12        | number of columns                                  |
| `rows`         | 0         | number of field rows; `0` = tile down a scrolling page |
| `gutter`       | 24        | px between columns                                 |
| `rowGutter`    | 1         | baseline rows between field rows                    |
| `margin`       | 32        | px page margin (each side)                         |
| `maxWidth`     | 1200      | px outer box width (margins are padding inside it); columns span `maxWidth − 2·margin`. `0` = full bleed |
| `baseline`     | 24        | px baseline rhythm — set to body line-height       |
| `baselineOffset`| 0        | px offset of first baseline / matrix top from doc top |
| `rowHeight`    | 4         | baseline rows per field row (field depth)          |
| `color`        | `#3b6fff` | column + baseline colour                           |
| `accent`       | `#ff4d6d` | field + margin colour                              |
| `opacity`      | 1         | whole-overlay opacity                              |
| `start`        | `all`     | initial mode, or `off`                             |
| `hud`          | true      | show the readout chip                              |
| `zIndex`       | 2147483000| stacking; raise if app chrome covers it            |

With `rows: 0` the field rows tile down the page as you scroll. With `rows: N`
the overlay draws a bounded N-row matrix anchored to the top of the content
(offset by `baselineOffset`), with top and bottom edges — total fields shown is
`columns × rows`. The HUD reports the matrix (e.g. `4 × 5 = 20 fields`).

## Hotkeys

`g` toggle on/off · `m` cycle mode · `]` baseline +1px · `[` baseline −1px.
Hotkeys ignore keystrokes inside inputs, textareas, and selects.

## Vanilla — config sources (first found wins)

1. `GridOverlay.init({ columns: 6, baseline: 28 })`
2. script attributes: `<script src="grid-overlay.js" data-columns="6" data-baseline="28">`
3. global: `window.__GRID_CONFIG__ = { columns: 6 }` before the script
4. CSS custom properties on `:root` — `--grid-columns`, `--grid-gutter`,
   `--grid-margin`, `--grid-max-width`, `--grid-baseline`, `--grid-row-height`,
   `--grid-rows`, `--grid-row-gutter`, `--grid-color`, `--grid-accent`
5. built-in defaults

Source 4 means: if the project already ships `grid.css`, the overlay reads the
real grid with zero extra config. Pair them.

### Recipes

Static page, auto-init from CSS vars:
```html
<link rel="stylesheet" href="grid.css">
<script src="grid-overlay.js"></script>
```

Explicit config, no auto-init:
```html
<script src="grid-overlay.js" data-auto="false"></script>
<script>
  GridOverlay.init({ columns: 6, gutter: 32, maxWidth: 720, baseline: 28 });
</script>
```

Runtime control (devtools, a debug menu, a keyboard shortcut of your own):
```js
GridOverlay.set({ columns: 16 });   // live-edit any key
GridOverlay.setMode('fields');      // jump to a layer
GridOverlay.toggle();               // on/off
GridOverlay.destroy();              // remove entirely
```

Bookmarklet — inspect any site's grid without touching its code. Host
`grid-overlay.js` somewhere and use:
```js
javascript:(function(){var s=document.createElement('script');s.src='https://YOUR_HOST/grid-overlay.js';s.dataset.columns=12;s.dataset.baseline=24;document.body.appendChild(s);})();
```

## React

```jsx
import GridOverlay from './GridOverlay';

export default function App() {
  return (
    <>
      <YourApp />
      {import.meta.env.DEV && (
        <GridOverlay columns={12} gutter={24} margin={32} maxWidth={1200} baseline={24} />
      )}
    </>
  );
}
```

Props match the config table. Gate it behind a dev flag so it never ships to
users. Hotkeys are on by default; pass `hotkeys={false}` to disable.

## Tailwind

Tailwind's spacing scale is a 4px step, so a baseline of 24 = `space-y-6`,
field rows of 4 = `h-24`. Set the overlay to `baseline={24}` and lay out with
`grid grid-cols-12 gap-6 max-w-[1200px] mx-auto px-8`. Here `px-8` (32px) is the
**inner padding**, which must equal the overlay's `margin` (32) — the overlay
models margin as padding inside `max-w`, so they have to match or the columns
drift. The overlay confirms whether your `gap`, `max-w`, padding, and vertical
spacing actually agree with each other.

## Optical alignment (grid-optical.js)

An optional, opt-in module for the last bit of polish on large display type.
Big glyphs carry a left side-bearing, so a headline whose box is on the column
line still looks indented; `grid-optical.js` measures the first glyph's ink
offset in the loaded font and nudges `margin-left` so the **ink** lands on the
line, re-running after webfonts load and on resize.

```html
<script src="grid-optical.js"></script>
<script>GridOptical.align('.masthead, h1, .numeral');</script>
```

`GridOptical.once(sel)` aligns without binding resize; `GridOptical.clear()`
removes the nudges. It does nothing until you call it, and you should point it
only at large display elements — never body text. The measurement is
font-specific, so it's correct only with the real webfont loaded (for offline
verification, embed the font via `@font-face`). See `method.md` →
"Optical alignment".

## Verification (verify-grid.js)

`verify-grid.js` proves a page actually sits on its grid — in the page, no Node
or Puppeteer. Inject it and call `GridVerify()`:

```js
GridVerify();                          // current viewport: returns + logs PASS/FAIL
GridVerify({ optical: '.masthead, h1' });   // also check ink-on-line
GridVerify({ grid: '.grid', baseline: 24, tol: 0.75 });
```

It returns `{ viewport, colErr, overlayChecked, overlayErr, baselineErr,
inkChecked, inkErr, pass }`. Checks: column adherence (both column-start and
column-end edge sets — an item spanning "to line N" ends at the far gutter edge,
so single-edge math falsely reports a one-gutter error), overlay-vs-content
match (only if the overlay is mounted — this is what proves the overlay shares
the content box), baseline rhythm (tops modulo the unit, tolerance ≈ ½ unit), and
optical ink (only if `optical` is given). Run it at widths above **and** below
`maxWidth` — resize the window or drive the viewport from your tools between
calls; the centered-container drift only appears above `maxWidth`.

Default colours are a neutral blue/red so the grid reads over any UI. Override
`color` and `accent` (or `--grid-color` / `--grid-accent`) to match a working
palette — e.g. a single accent over a muted line colour for a quieter overlay.
Drop `opacity` to ~0.6 when checking the grid against a busy page.

## Limits

The overlay measures the viewport, not arbitrary scroll containers — for a
panel with its own scrollbar, the baseline layer tracks the window, not the
panel. The baseline layer assumes content starts at the document top; use
`baselineOffset` when a fixed header pushes the first baseline down.

The overlay centers its measure in the **viewport**, so it assumes the content
measure is viewport-centered too: reset the body margin (`grid.css` sets
`body { margin: 0 }`) and center the container (`margin-inline: auto`). A stray
body margin or a left-anchored container shifts the real columns off the overlay
below `--grid-max-width` (above it the symmetric auto-margins absorb it). If a
fixed left sidebar offsets the content, the overlay won't follow it.
