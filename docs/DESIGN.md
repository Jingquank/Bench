---
version: alpha
name: P.I.N.O.C. — Editorial
description: Editorial system on the Viggle brandbook palette — a Satoshi superfamily with weight-driven hierarchy over nine brand tokens per theme, two derived 7-step chart ramps, Radix radius/space scales, film grain, and a catalogued interactive data-viz layer.
scope: the generated /writereport output (one standalone HTML file with an inline stylesheet)
colors:
  # Brand palette — Viggle brandbook (viggle-www/docs/brandbook.html). Nine flat
  # tokens per theme, NOT a 12-step scale. Charts need ordered ladders, so two
  # 7-step ramps are derived from these anchors: a WARM ramp that carries all data
  # encoding, and a JOLT ramp that supplies accent tones only. Derived steps sit on
  # the brand's own hue curve and are marked NEW — they do not appear in brandbook.html.
  light:
    paper:        "#fcfcfc"   # page ground
    beige:        "#f1eeea"   # card ground / band
    ink:          "#29231e"   # text; heaviest data mark
    bark:         "#4d453d"
    taupe:        "#74685a"   # muted text
    mist:         "#e1e1e1"
    silver:       "#9a9a9a"
    fill:         "#d9d9d9"
    jolt:         "#00e13f"   # brand accent
    on-media:     "#fcfcfc"
    on-media-ink: "#29231e"
    cta-ink:      "#29231e"
  dark:
    paper:        "#151110"
    beige:        "#221d18"
    ink:          "#f4f1ec"
    bark:         "#d9d2c8"
    taupe:        "#a5988a"
    mist:         "#e1e1e1"
    silver:       "#6b6b6b"
    fill:         "#2e2a25"
    jolt:         "#00e13f"
  # WARM data ramp — w1 = most important, w7 = lightest / ground. Lightness IS the
  # data (§7). The ramp inverts by theme so w1 is always the heaviest mark on its
  # own ground. w4/w5/w6 are derived; every other step is a brandbook token.
  warm:
    light: ["#29231e","#4d453d","#74685a","#9a8c7c","#bbb3aa","#dad7d3","#f1eeea"]
    dark:  ["#f4f1ec","#d9d2c8","#a5988a","#7f6f60","#594f44","#3b332c","#221d18"]
    # light L*  14  30  45  59* 73* 86* 94    (* derived, hue 33)
    # dark  L*  95  85  64  48* 34* 22* 11    (* derived, hue 30)
  # JOLT accent ramp — hue 137 throughout, brandbook --jolt pinned at g5.
  # LOCKED: the jolt ramp never encodes magnitude. It supplies accent tones only.
  # Heat, intensity and every other ordinal encoding uses the WARM ramp (§7).
  jolt:
    ramp:     ["#00300d","#005518","#008125","#00b132","#00e13f","#acecbe","#e3f5e8"]
    # L*         16      31      47      63      79      88      95
    on-light: "#008125"   # g3 — 4.91:1 on paper. Accent text, hairlines, the one mark.
    on-dark:  "#00e13f"   # g5 — 10.58:1 on dark paper. The literal brandbook value.
    contrast: "#00300d"   # ink on a jolt fill
  # Semantic roles — the whole colour vocabulary. §7 charts use these names.
  roles:
    BG:     paper              # page ground
    BG-alt: beige              # card ground / band
    TXT:    ink                # text, and the heaviest data mark
    MUT:    taupe              # muted text, axis labels
    GRID:   warm-6             # gridlines, hairlines, bar tracks
    DATA:   warm-1 … warm-7    # assigned by importance, never by sequence
    HERO:   jolt.on-light / jolt.on-dark   # one mark per chart, never two
  # Overlay alpha — true-neutral transparent scales (fixed, theme-independent) for
  # scrims / hover washes / the shadow ladder. Not for the grain tint (§5).
  overlay:
    black-a: ["rgba(0,0,0,.05)","rgba(0,0,0,.1)","rgba(0,0,0,.15)","rgba(0,0,0,.2)","rgba(0,0,0,.3)","rgba(0,0,0,.4)","rgba(0,0,0,.5)","rgba(0,0,0,.6)","rgba(0,0,0,.7)","rgba(0,0,0,.8)","rgba(0,0,0,.9)","rgba(0,0,0,.95)"]
    white-a: ["rgba(255,255,255,.05)","rgba(255,255,255,.1)","rgba(255,255,255,.15)","rgba(255,255,255,.2)","rgba(255,255,255,.3)","rgba(255,255,255,.4)","rgba(255,255,255,.5)","rgba(255,255,255,.6)","rgba(255,255,255,.7)","rgba(255,255,255,.8)","rgba(255,255,255,.9)","rgba(255,255,255,.95)"]
typography:
  # Role-based Satoshi scale — emitted as CSS tokens in the report's inline
  # stylesheet (--fs-* / --lh-* / --ls-* / --fw-* + --font-sans). One
  # Satoshi superfamily throughout; hierarchy comes from weight, size, and
  # tracking — not a second face. Three weight tiers: Black 900 display, Bold
  # 700 headings + labels, Medium 500 body. Headings are sentence/title case.
  # Values below are the resolved token values. See §1.
  display-2xl:         # --fs-display-2xl + --lh-display-2xl — hero / poster (the largest)
    fontFamily: Satoshi
    fontSize: 4.5rem                            # clamp(2.5rem, 5.5vw + 1rem, 4.5rem) ~40–72px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: -0.035em
  display-xl:          # --fs-display-xl + --lh-display-xl — marketing hero / section opener
    fontFamily: Satoshi
    fontSize: 3.75rem                           # clamp(2.25rem, 4vw + 1rem, 3.75rem) ~36–60px
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: -0.03em
  display-lg:          # --fs-display-lg + --lh-display-lg — large headline
    fontFamily: Satoshi
    fontSize: 3rem                              # clamp(2rem, 2.5vw + 1rem, 3rem) ~32–48px
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: -0.025em
  title:               # --fs-title + --lh-title — page title (h1)
    fontFamily: Satoshi
    fontSize: 2.25rem                           # 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  h2:                  # --fs-h2 + --lh-h2 — section heading
    fontFamily: Satoshi
    fontSize: 1.875rem                          # 30px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h3:                  # --fs-h3 + --lh-h3 — subsection
    fontFamily: Satoshi
    fontSize: 1.5rem                            # 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.015em
  h4:                  # --fs-h4 + --lh-h4 — card / block heading
    fontFamily: Satoshi
    fontSize: 1.25rem                           # 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  h5:                  # --fs-h5 + --lh-h5 — minor heading
    fontFamily: Satoshi
    fontSize: 1.125rem                          # 18px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: -0.005em
  body-lg:             # --fs-body-lg + --lh-body-lg — lead / standfirst, long-form
    fontFamily: Satoshi
    fontSize: 1.125rem                          # 18px
    fontWeight: 500
    lineHeight: 1.6
  body:                # --fs-body + --lh-body — default UI / paragraph
    fontFamily: Satoshi
    fontSize: 1rem                              # 16px
    fontWeight: 500
    lineHeight: 1.55
  body-sm:             # --fs-body-sm + --lh-body-sm — secondary / dense UI
    fontFamily: Satoshi
    fontSize: 0.875rem                          # 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0.005em
  caption:             # --fs-caption + --lh-caption — metadata / helper text
    fontFamily: Satoshi
    fontSize: 0.8125rem                         # 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  micro:               # --fs-micro — densest UI chrome (legend, table head, dense labels)
    fontFamily: Satoshi
    fontSize: 0.6875rem                         # 11px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.02em
  overline:            # --fs-overline + --lh-overline — eyebrows / labels (UPPERCASE)
    fontFamily: Satoshi
    fontSize: 0.75rem                           # 12px; uppercase via tracking, not a second face
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.08em
rounded:
  # Radix radius scale (restrained). --radius-1..6; full for pills/dots only.
  none: 0
  "1": 3px      # chips, tags, small inputs
  "2": 4px      # buttons, inputs
  "3": 6px      # default mid-size surface
  "4": 8px      # larger cards, media frames
  "5": 12px
  "6": 16px     # chart cards (brandbook)
  full: 9999px
spacing:
  # Radix space scale (--space-1..9), 4px base.
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 40px
  "8": 48px
  "9": 64px
shadows:
  # Radix-style elevation ladder (--shadow-1..6). Overlays use the true-neutral
  # black-a steps. Reserved for tooltips / popovers / raised chrome only — cards
  # stay flat, no border and no shadow (soft-shadow "ghost cards" remain an anti-slop tell).
  "1": "0 1px 2px var(--black-a3)"
  "2": "0 2px 4px var(--black-a3), 0 1px 2px var(--black-a4)"
  "3": "0 4px 12px var(--black-a4), 0 1px 3px var(--black-a3)"
  "4": "0 8px 20px var(--black-a5), 0 2px 6px var(--black-a4)"
  "5": "0 12px 32px var(--black-a5), 0 4px 10px var(--black-a4)"
  "6": "0 24px 56px var(--black-a6), 0 6px 16px var(--black-a5)"
---

# Design System: P.I.N.O.C. — Editorial

The editorial system styles the generated report (one standalone HTML file with an
inline stylesheet). It
runs a single Satoshi superfamily — Black 900 display, Bold 700 headings, Medium
500 body — over the **Viggle brandbook palette**: nine flat brand tokens per theme
(light and dark), two 7-step ramps derived from them for charts, a Radix
radius/space scale, and a film-grain overlay, punctuated by full-bleed dark and
jolt "magazine" bands.

It carries the brand DNA — warm paper, electric jolt accent, film grain, a
disciplined role vocabulary — and expresses it through four signature moves:

1. **Display headings** in Satoshi Black 900, sentence/title case; titles and
   section/card headings step down to Bold 700 (§1).
2. **Satoshi body** at Medium 500, with labels and eyebrows set in the same family
   at Bold 700 — the display↔body contrast is the weight jump, not a second face (§1).
3. **Role-driven brand colour** — every surface, border, and text colour resolves
   to a named role (`BG`, `TXT`, `MUT`, `GRID`, `DATA`, `HERO`), so light/dark and
   emphasis are systematic, not ad-hoc. Full-bleed bands use the dark theme values
   or a `jolt` fill (§3).
4. **A catalogued, interactive data-viz layer** — forms are selected from
   `CHARTS.md` by data shape and copied from `charts/gallery.html`, then carry
   meaningful toggleable views, tooltips, computed metrics with plain-language
   insights, and Radix icons for labels and hierarchy (§7).

Chart cards are flat and separated by whitespace — no border, no shadow; radius and
space come from the token scales, colour from the brand roles.

---

## 1. Typography — one Satoshi superfamily

Satoshi is a Swiss-style modernist grotesque (ITF / Deni Anggara): geometric, a
tall x-height, lining figures set to cap-height. Two traits drive the scale:

1. **Tall x-height** → body needs *more* leading than a typical sans to avoid a
   dense, dark block. Body sits at **1.5–1.6**.
2. **Slightly wide default spacing** → large sizes look loose untreated. Tracking
   **tightens as size grows, opens as it shrinks**, and opens generously on caps.

The report runs this **single family** and builds hierarchy from **weight, size,
and tracking** — never a second face. Because Satoshi has true lowercase, headings
are **sentence/title case**, never forced all-caps.

**Latin:** Satoshi, loaded **from Fontshare**, its own foundry — Satoshi is not on
Google Fonts:

```html
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@400,500,700,900&display=swap" rel="stylesheet">
```

**CJK:** Satoshi carries 431 glyphs and **zero CJK ideographs** — it cannot set
Chinese at all. Reports default to English + 简体中文, so the stack always pairs it
with **Noto Sans SC** from Google Fonts, which is sliced by `unicode-range` so only
the glyphs actually used are downloaded:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
```

Always give the stack a real fallback so a blocked CDN degrades to system type:

```css
font-family: Satoshi, "Noto Sans SC", system-ui, -apple-system, sans-serif;
```

Weights map across both families: Satoshi 900/700/500 pair with Noto Sans SC
900/700/400. Exposed as the token **`--font-sans`**:

```css
--font-sans: "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, "Liberation Mono", monospace;
```

Headings and body share `--font-sans`; only the **weight token** differs. A failed
Satoshi load degrades to the system sans in that stack. (No Inter / Geist — see
the anti-slop overused-font list.) Satoshi's own `tnum` figures cover numerics, so
`--font-mono` is rarely needed.

### Weight roles — three tiers

Hierarchy is carried by **three working weights**:

| Token          | Weight | Used for                                                    |
| -------------- | ------ | ----------------------------------------------------------- |
| `--fw-black`   | 900    | Display — `display-2xl/xl/lg` (hero, poster, large headline) |
| `--fw-bold`    | 700    | Headings + labels — `title`, `h2`–`h5`, `overline`; in-body **strong** |
| `--fw-medium`  | 500    | Body + support — `body-lg`, `body`, `body-sm`, `caption`     |

`--fw-light` (300) and `--fw-regular` (400) are **unused by default**. Keep **400**
as a fallback for article-length running text if Medium body reads too dense in a
long column. Lighter in-body emphasis uses *italics* — there is no 600 weight.

### Scale

The role scale lives as **CSS tokens on `:root`** in the report's inline
stylesheet. Sections reference these tokens directly; keep `clamp()`,
line-height, and `em` tracking literals out of section CSS.

**Sizes** (fluid `clamp()` on the three display steps so heroes don't overflow on
mobile; fixed below):

| Token              | Value                                   | ≈ px  | Weight | Used for                       |
| ------------------ | --------------------------------------- | ----- | ------ | ------------------------------ |
| `--fs-display-2xl` | `clamp(2.5rem, 5.5vw + 1rem, 4.5rem)`   | 40–72 | 900    | Hero / poster — **the largest** |
| `--fs-display-xl`  | `clamp(2.25rem, 4vw + 1rem, 3.75rem)`   | 36–60 | 900    | Marketing hero / section opener |
| `--fs-display-lg`  | `clamp(2rem, 2.5vw + 1rem, 3rem)`       | 32–48 | 900    | Large headline                  |
| `--fs-title`       | `2.25rem`                               | 36    | 700    | Page title (`h1`)               |
| `--fs-h2`          | `1.875rem`                              | 30    | 700    | Section heading                 |
| `--fs-h3`          | `1.5rem`                                | 24    | 700    | Subsection                      |
| `--fs-h4`          | `1.25rem`                               | 20    | 700    | Card / block heading            |
| `--fs-h5`          | `1.125rem`                              | 18    | 700    | Minor heading                   |
| `--fs-body-lg`     | `1.125rem`                              | 18    | 500    | Lead / standfirst, long-form    |
| `--fs-body`        | `1rem`                                  | 16    | 500    | Default UI / paragraph          |
| `--fs-body-sm`     | `0.875rem`                              | 14    | 500    | Secondary / dense UI            |
| `--fs-caption`     | `0.8125rem`                             | 13    | 500    | Metadata / helper text          |
| `--fs-overline`    | `0.75rem`                               | 12    | 700    | Eyebrows / labels — UPPERCASE   |
| `--fs-micro`       | `0.6875rem`                             | 11    | 700    | Densest chrome (legend, table head) |

**Line-heights** (tight in the text range, opening up at display):

| Token              | Value | Token          | Value | Token         | Value |
| ------------------ | ----- | -------------- | ----- | ------------- | ----- |
| `--lh-display-2xl` | 1.0   | `--lh-title`   | 1.15  | `--lh-body-lg`| 1.6   |
| `--lh-display-xl`  | 1.05  | `--lh-h2`      | 1.2   | `--lh-body`   | 1.55  |
| `--lh-display-lg`  | 1.08  | `--lh-h3`      | 1.25  | `--lh-body-sm`| 1.5   |
|                    |       | `--lh-h4`      | 1.3   | `--lh-caption`| 1.4   |
|                    |       | `--lh-h5`      | 1.35  | `--lh-overline`| 1.2  |

**Letter-spacing** — the tracking curve (negative tightens large display type,
positive opens up caps):

| Token              | Value     | Token         | Value    |
| ------------------ | --------- | ------------- | -------- |
| `--ls-display-2xl` | -0.035em  | `--ls-h4`     | -0.01em  |
| `--ls-display-xl`  | -0.03em   | `--ls-h5`     | -0.005em |
| `--ls-display-lg`  | -0.025em  | `--ls-body`   | 0        |
| `--ls-title`       | -0.02em   | `--ls-body-sm`| 0.005em  |
| `--ls-h2`          | -0.02em   | `--ls-caption`| 0.01em   |
| `--ls-h3`          | -0.015em  | `--ls-overline`| 0.08em  |

Every `letter-spacing` in the report references a `--ls-*` token.

### Role classes

Each role binds family + weight + size + line-height + tracking in one shorthand:

```css
.text-display-2xl { font: var(--fw-black) var(--fs-display-2xl)/var(--lh-display-2xl) var(--font-sans); letter-spacing: var(--ls-display-2xl); }
.text-display-xl  { font: var(--fw-black) var(--fs-display-xl)/var(--lh-display-xl) var(--font-sans);   letter-spacing: var(--ls-display-xl); }
.text-display-lg  { font: var(--fw-black) var(--fs-display-lg)/var(--lh-display-lg) var(--font-sans);   letter-spacing: var(--ls-display-lg); }
.text-title       { font: var(--fw-bold) var(--fs-title)/var(--lh-title) var(--font-sans);             letter-spacing: var(--ls-title); }
.text-h2          { font: var(--fw-bold) var(--fs-h2)/var(--lh-h2) var(--font-sans);                   letter-spacing: var(--ls-h2); }
.text-h3          { font: var(--fw-bold) var(--fs-h3)/var(--lh-h3) var(--font-sans);                   letter-spacing: var(--ls-h3); }
.text-h4          { font: var(--fw-bold) var(--fs-h4)/var(--lh-h4) var(--font-sans);                   letter-spacing: var(--ls-h4); }
.text-h5          { font: var(--fw-bold) var(--fs-h5)/var(--lh-h5) var(--font-sans);                   letter-spacing: var(--ls-h5); }
.text-body-lg     { font: var(--fw-medium) var(--fs-body-lg)/var(--lh-body-lg) var(--font-sans);       letter-spacing: var(--ls-body); }
.text-body        { font: var(--fw-medium) var(--fs-body)/var(--lh-body) var(--font-sans);             letter-spacing: var(--ls-body); }
.text-body-sm     { font: var(--fw-medium) var(--fs-body-sm)/var(--lh-body-sm) var(--font-sans);       letter-spacing: var(--ls-body-sm); }
.text-caption     { font: var(--fw-medium) var(--fs-caption)/var(--lh-caption) var(--font-sans);       letter-spacing: var(--ls-caption); }
.text-overline    { font: var(--fw-bold) var(--fs-overline)/var(--lh-overline) var(--font-sans);       letter-spacing: var(--ls-overline); text-transform: uppercase; }
```

### Numerics & OpenType

Satoshi ships proportional lining figures by default, plus tabular figures and
fractions. Set numeric context explicitly:

```css
--font-feature-text: "kern" 1, "liga" 1, "calt" 1;   /* default running text */
.tabular   { font-feature-settings: "tnum" 1, "lnum" 1; }   /* tables, prices, timers, chart metrics */
.fractions { font-feature-settings: "frac" 1; }
```

Single-storey `a`/`g` alternates (`ss01`/`ss02`) are an **off-by-default** brand
toggle — they cool the editorial-warm voice toward geometric/technical. Verify the
exact `ssXX` tags in a glyph inspector before committing.

### UI / chrome text

All non-editorial **chrome** — eyebrows, captions, buttons, toggles, table headers,
legends, byline, footer, metric labels/insights — is **tokenized** to the bottom
tiers; never scatter literal `rem`s:

| Chrome element                                   | Token                          |
| ------------------------------------------------ | ------------------------------ |
| Eyebrow / label / uppercase kicker / table head  | `--fs-overline` (12, `--ls-overline` +0.08em caps) |
| Densest chrome (legend, dense table head, tags)   | `--fs-micro` (11, +0.02em)     |
| Caption / note / insight / byline / footer        | `--fs-caption` (13, +0.01em)   |
| Metric value (big number)                         | `--fs-h4` (20) Black 900       |

This is a **consistency treatment**: the editorial display/body **sizes are
unchanged** (the Satoshi standard); the point is that every text element — chrome
included — draws size, line-height, and tracking from the same `--fs-*`/`--lh-*`/
`--ls-*` tokens, so tracking stays unified across the whole scale (display tighter,
caps wider). Chart SVG text is authored in viewBox user units (§7).

### Editorial role mapping

The rest of this doc names editorial roles; they map onto the role scale:

| Editorial role           | Role token(s)                  |
| ------------------------ | ------------------------------ |
| Hero headline            | `display-xl` / `display-2xl`   |
| Section / punch titles    | `title` / `h2`                 |
| Card / sub / step titles | `h3` / `h4`                    |
| Lead / standfirst         | `body-lg`                      |
| Body                     | `body`                         |
| Eyebrows / labels / tags  | `overline`                     |
| Captions / counters       | `caption`                      |

> **Heading-tag mapping:** `h1` → `--fs-title` /
> `--lh-title` + `--fw-bold`; `h2`–`h5` → matching `--fs-*` / `--lh-*` + `--fw-bold`;
> the hero headline takes a `display-*` class at `--fw-black`. A section's `.title`
> typically sets only its `--fs-*` size; weight, line-height, and tracking come from
> the role class or tag rule, so most titles need a single declaration.

> **Line-height floor:** keep each role at or above its `--lh-*` value; a heavy
> weight cramps and risks clipping at `line-height: 1`. Display sits at 1.0–1.08,
> headings 1.15–1.35, body at 1.5–1.6.

---

## 2. Shape — Radix radius scale

Corners come from the **Radix radius scale** (`--radius-1`…`--radius-6` =
3/4/6/8/12/16px) — restrained, never extreme (40px+ "blob" radius is an anti-slop
tell). Map by element size:

| Token         | px  | Used for                                   |
| ------------- | --- | ------------------------------------------ |
| `--radius-1`  | 3   | Chips, tags, small inputs, legend swatches |
| `--radius-2`  | 4   | Buttons, inputs, view-toggle segments      |
| `--radius-3`  | 6   | Default mid-size surface                   |
| `--radius-4`  | 8   | Larger cards, media frames                 |
| `--radius-5`  | 12  | Feature panels (sparingly)                 |
| `--radius-6`  | 16  | **Chart cards** (brandbook, §7)            |
| `--radius-full` | 9999 | Pills, dots, avatars, circular controls |

`border-radius: 9999px`/`50%` is for genuinely round elements only (dots, pills,
avatars, nav buttons). Cards stay **flat — no border, no shadow** — and separate by
whitespace (soft-shadow "ghost cards" are a slop tell); `--shadow-*` is for
tooltips/popovers.

---

## 3. Color — brandbook tokens, role-driven

Colour is the **Viggle brandbook palette**: nine flat tokens per theme (`paper`,
`beige`, `ink`, `bark`, `taupe`, `mist`, `silver`, `fill`, `jolt`) in light and
dark, plus the overlay alpha scales. It is **not** a 12-step scale — there are no
numbered steps to reach for, only **named roles**.

### Roles carry the meaning

Every colour decision resolves to a role. Never reach for a raw hex.

| Role     | Light                | Dark                 | Job                                  |
| -------- | -------------------- | -------------------- | ------------------------------------ |
| `BG`     | `paper` `#fcfcfc`    | `paper` `#151110`    | Page ground                          |
| `BG-alt` | `beige` `#f1eeea`    | `beige` `#221d18`    | Card ground, full-bleed band         |
| `TXT`    | `ink` `#29231e`      | `ink` `#f4f1ec`      | Text; the heaviest data mark         |
| `MUT`    | `taupe` `#74685a`    | `taupe` `#a5988a`    | Muted text, axis labels, captions    |
| `GRID`   | `warm-6` `#dad7d3`   | `warm-6` `#3b332c`   | Gridlines, hairlines, bar tracks     |
| `DATA`   | warm ramp `w1…w7`    | warm ramp `w1…w7`    | All data marks (§7)                  |
| `HERO`   | `#008125` (jolt g3)  | `#00e13f` (jolt g5)  | **One** accent mark — never two      |

`silver`, `fill` and `mist` are **pure neutrals with no hue**. They are chrome
colours — dividers, disabled states, inert UI — and must never be spliced into the
warm ramp, which would break its hue continuity mid-ladder.

### The two ramps

The brandbook's warm family (`ink → bark → taupe`) is already an even ladder at
~15 L\* per step, then stops dead: there is a **49.5 L\* gap** to `beige` with
nothing warm inside it. Three steps are derived on the brand's own hue-33 curve,
with chroma falling as lightness rises, to close it:

| Step | Light     | L\* | Dark      | L\* | Source  |
| ---- | --------- | --- | --------- | --- | ------- |
| `w1` | `#29231e` | 14  | `#f4f1ec` | 95  | `ink`   |
| `w2` | `#4d453d` | 30  | `#d9d2c8` | 85  | `bark`  |
| `w3` | `#74685a` | 45  | `#a5988a` | 64  | `taupe` |
| `w4` | `#9a8c7c` | 59  | `#7f6f60` | 48  | derived |
| `w5` | `#bbb3aa` | 73  | `#594f44` | 34  | derived |
| `w6` | `#dad7d3` | 86  | `#3b332c` | 22  | derived |
| `w7` | `#f1eeea` | 94  | `#221d18` | 11  | `beige` |

The ramp **inverts by theme**, so `w1` is always the heaviest mark on its own
ground and "most important = furthest from the page" holds in both.

The **jolt ramp** runs hue 137 throughout with the brandbook `--jolt` pinned at
`g5`, each step lightness-matched to its warm twin:

| Step | Hex       | L\* | On paper  | On dark paper |
| ---- | --------- | --- | --------- | ------------- |
| `g1` | `#00300d` | 16  | 14.33:1   | 1.28:1        |
| `g2` | `#005518` | 31  | 8.85:1    | 2.07:1        |
| `g3` | `#008125` | 47  | **4.91:1** | 3.72:1       |
| `g4` | `#00b132` | 63  | 2.79:1    | 6.55:1        |
| `g5` | `#00e13f` | 79  | 1.73:1    | **10.58:1**   |
| `g6` | `#acecbe` | 88  | 1.32:1    | 13.84:1       |
| `g7` | `#e3f5e8` | 95  | 1.11:1    | 16.52:1       |

**The jolt ramp is locked.** It never encodes magnitude — not in heat matrices, not
in calendar heat, not in any ordinal scale. Those all use the warm ramp. The jolt
ramp exists so the accent has a *correct value on every surface*: `g3` on light,
`g5` on dark. Both clear 3:1; `g5` alone on paper measures 1.73:1 and would be the
faintest mark on the chart, which is why it is never used there.

### Accent discipline

`HERO` marks **one thing** — the subject of the point the section is making. A
second hero dissolves the first. Outside charts, the accent covers solid CTA fills,
the one accent word in a headline, links and accent text (`g3` on light), and
`jolt` washes via the overlay alphas. Never paint large neutral areas with it.

### Surfaces & full-bleed bands

- **Dark band:** switch the section to the dark theme values — `BG` becomes
  `#151110`, `TXT` `#f4f1ec`, `GRID` `#3b332c`. The warm ramp inverts with it.
- **Jolt band:** fill with `jolt` `#00e13f`; all content inks in `jolt.contrast`
  (`#00300d`). A second jolt fill on jolt disappears — one fill, ink on top.

### Interactive states

Rest / hover / active climb the warm ramp from the ground: `w7` → `w6` → `w5` on
light, and the same three steps on dark. Borders rest/hover use `GRID` then `w5`.
**Focus ring = `TXT`, 2px, 2px offset** — the brand has no mid-tone that clears 3:1
on both grounds, so the high-contrast token carries it.

### The hard gates

1. **Contrast.** Body and small labels ≥ **4.5:1** against their ground; large text
   and shape boundaries ≥ **3:1**. Adjust lightness to fix a failure — never shift
   a brand hue.
2. **One system per report.** A single output file locks one colour system for
   every chart in it. If one chart cannot express itself in that system, change the
   system globally or drop the whole report to the warm ramp. Never mix per chart.
3. **Colour is never the only cue.** Categories keep labels, ordinals keep length
   or position, the hero keeps an annotation. Strip the colour out and the chart
   must still read.

> **Role-only colour.** No hardcoded one-offs. Derive transparency from the overlay
> alpha steps rather than ad-hoc `rgba`/`color-mix`. Data-viz colour is specced in §7.

---
## 4. Spacing — Radix space scale

Spacing is the **Radix space scale** (`--space-1`…`--space-9` = 4/8/12/16/24/32/
40/48/64px, 4px base). Component-internal padding lives at the low end; section
rhythm at the high end:

| Token        | px  | Used for                                          |
| ------------ | --- | ------------------------------------------------- |
| `--space-1..3` | 4–12 | Inline gaps, chip/label padding, tight stacks   |
| `--space-4..5` | 16–24 | Card padding, intra-component spacing           |
| `--space-6..7` | 32–40 | Block separation within a section               |
| `--space-8`  | 48  | Section padding on **mobile**                      |
| `--space-9`  | 64  | Section padding on **desktop**, major rhythm       |

Vary spacing intentionally — one value everywhere is a slop tell. Generosity
belongs **between** blocks; keep within-block spacing tighter.

> **Layout references `--space-*` — no hardcoded px.** Margins, gaps, and padding
> all resolve to space tokens (e.g. section rhythm `--space-9`/`8`, grid/stack gaps
> `--space-4`/`5`, tight gaps `--space-1..3`), exactly as colour resolves to steps
> and corners to `--radius-*`. The only literals are fluid `clamp()` page padding
> and 1px hairlines.

---

## 5. Texture — film grain

A single fixed grain element (`.vg-grain`) is emitted once at the top of the
report's `<body>`. Mechanics:

- A `position: fixed; inset: 0` overlay at **`--z-grain`** (300),
  `pointer-events: none`, `contain: strict` — it sits above all content and
  passes input through.
- Texture is an inline SVG **`feTurbulence` `fractalNoise`** desaturated to grey
  (`feColorMatrix saturate 0`).
- **Light theme:** `opacity: 0.12`, `mix-blend-mode: multiply`, plus a `.tint`
  layer washing `jolt` (`#00e13f`) at ~30% with `mix-blend-mode: color` (the
  subtle green cast).
- **Dark theme:** background is dark `paper` (`#151110`); grain uses
  `mix-blend-mode: screen`, `opacity: 0.15`, tint hidden.
- A top-to-bottom mask fades the grain in from `0.35` → `1.0` so the top of the
  viewport stays cleaner.

The report supports light and dark via `data-theme`; the grain inherits the
active theme, so the two blend branches above switch with it.

### Layering

The grain sits at the top of the shared z-index ladder:

| Token         | Value | Layer                                            |
| ------------- | ----- | ------------------------------------------------ |
| `--z-base`    | 0     | Default stacking context.                        |
| `--z-overlay` | 100   | Modals, overlays, drawers.                       |
| `--z-toast`   | 200   | Toasts — always above overlays.                  |
| `--z-grain`   | 300   | Film grain — above everything, non-interactive.  |

---

## 6. Accessibility & motion

- Respect `prefers-reduced-motion: reduce` — animation collapses to near-instant
  (~0.01ms), applied globally in the inline stylesheet.
- Guard hover-only affordances (lifts, underlines, glows) with `(hover: hover)`
  so touch devices skip phantom hover states.
- Focus ring: 2px solid **`TXT`** with 2px offset, via `:focus-visible` (keyboard
  only) — the brand has no mid-tone that clears the 3:1 non-text floor on both
  grounds, so the high-contrast role carries it (§3). All interactive chart controls
  (view toggles, legend buttons) are real `<button>`s and must be keyboard-reachable.
- Contrast: `TXT` and `MUT` clear 4.5:1 on `BG` and `BG-alt`; shape boundaries
  clear 3:1. Text on a `jolt` fill uses `jolt.contrast` (`#00300d`). Re-check
  any colour pairing the steps don't already guarantee.
- **Adaptive / responsive:** the output must read on a phone. Use breakpoints
  (≈`760px` tablet, `420px` phone): stack multi-column grids (stats, metrics,
  small-multiples) to 1–2 columns; charts are fixed-`viewBox` SVG and stay legible
  only through the mandatory `≤760px` one-column rule and the narrow variants in §7;
  keep interactive controls ≥ ~40px touch targets; never let a chart force
  horizontal overflow. Honour safe-area insets.

---

## 7. Data visualization

Charts are **first-class, interactive, and catalogued**. This section defines the
*visual language*. **`CHARTS.md` defines which form to reach for**, and
`charts/gallery.html` holds a working implementation of each one. The skill
(`WRITEREPORT.md` §3) defines the *behaviour* — meaningful views, tooltips, and
computed metrics with plain-language insights.

**Never invent a chart form.** Select from `CHARTS.md` by data shape, then copy the
matching render function out of `charts/gallery.html` and re-bind it to the real
data. All 28 catalogued forms ship working code — there is no case in which
improvising the geometry is correct.

### The card — four fixed parts

Every chart ships in the same frame. The parts are not optional.

1. **Conclusion title** (`h4`, Bold 700). States the finding, never the chart type.
   *"Where we gained, where we bled"* — not *"Revenue bar chart"*.
2. **Subtitle** (`--fs-caption`, `MUT`). Legend meaning, unit, and time range,
   separated by `·`. If a mark encodes a unit, say so here: *"one dot = one person"*.
3. **The chart.**
4. **Source line** (`--fs-micro`, uppercase, `+0.08em`, `GRID` colour). Form name ·
   series · data source.

Card ground `BG-alt`, radius **16px** (brandbook), **no border and no shadow** —
cards separate by whitespace. Padding `--space-6 --space-6 --space-5`.

### Geometry — fixed viewBox, one column on narrow

Charts are authored as **fixed-`viewBox` SVG**, not fluid HTML/CSS. In writereport's
editorial measure (~720px content column) a half-width card renders a `400` viewBox
at roughly **1:1**, so a user unit is about a pixel and authored text sizes land as
authored. At `≤760px` the grid drops to one column and the same card renders at
about **0.9×** — still legible. That breakpoint is mandatory:

```css
.vg-chartgrid { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-5) }
@media (max-width:760px){ .vg-chartgrid{ grid-template-columns:1fr } }
```

| Card    | viewBox   | Desktop | Phone (1-col) |
| ------- | --------- | ------- | ------------- |
| half    | `400×300` | ~1.0×   | ~0.9×         |
| wide    | `840×300` | ~0.86×  | **~0.43×**    |

A wide card at one column halves its text, so **every wide form must ship a narrow
variant** — a re-laid `400`-wide viewBox swapped in at the breakpoint — or be marked
`desktop-only` in `CHARTS.md`, which excludes it from reports meant to be read on a
phone. There is no third option: never let a `840` viewBox shrink to a phone.

Use `preserveAspectRatio="xMidYMid meet"` and set `width:100%; height:auto`.

### Chart text scale

Because the viewBox renders near 1:1, chart text is authored in **user units** and
reads as px. Chart text stays at or below body size.

| Role                          | Units | Weight | Notes                        |
| ----------------------------- | ----- | ------ | ---------------------------- |
| Value / data label            | 13    | 800    | `tnum`, `TXT`                |
| Category / series label       | 11    | 500    | `TXT`                        |
| Axis tick / legend            | 9.5   | 600    | `MUT`                        |
| Source line                   | 9     | 500    | `GRID`, uppercase `+0.08em`  |

**Floor: 8 units on a half card, 7 on a wide one.** Information that does not fit
moves to hover — never shrink text below the floor to force it in.

### Palette — warm ramp carries the data

Data marks come from the **warm ramp** (§3), assigned **by importance, not by
sequence**: the most important series takes `w1`, the next `w2`, and so on down the
ladder. Lightness *is* the encoding.

| Role                              | Light            | Dark             |
| --------------------------------- | ---------------- | ---------------- |
| Default data mark                 | `w1` `#29231e`   | `w1` `#f4f1ec`   |
| Second / third series             | `w2`, `w3`       | `w2`, `w3`       |
| Receding / context marks          | `w4`, `w5`       | `w4`, `w5`       |
| Bar track / empty / gridline      | `w6`             | `w6`             |
| **HERO — the insight's subject**  | `#008125` (g3)   | `#00e13f` (g5)   |
| Axis tick labels                  | `MUT`            | `MUT`            |
| Value labels                      | `TXT`            | `TXT`            |
| Reference line (mean / median)    | `#008125` dashed | `#00e13f` dashed |

**One hero per chart.** If you cannot name why a mark is the hero, it is `w1`.
Ordinal and sequential encodings — heat matrices, calendar heat, intensity — use the
**warm ramp**, never the jolt ramp (§3, locked). Always direct-label marks: a
near-monochrome palette demands it.

**Fills are solid.** No gradients, no glows, no drop shadows on marks. Texture comes
from lightness contrast and shape alone. The one exception is an overlay form where
opacity itself encodes density — there the transparency is data, not decoration.

### Craft details

- **Bar caps:** capsule ends, radius 999. Vertical bars round the top only;
  horizontal bars round the outer end only.
- **Hairlines:** 1 unit, `GRID`. Baselines and zero lines 1.5 units, `w4`.
- **Dots:** r 4 on half cards, r 3 on wide. Unit dots r 2.5.
- **Never break a bar axis.** A bar's contract is length ∝ value. For an extreme
  value, either let it run to the top, or add an inset detail chart, or state
  plainly in the subtitle that the scale is clipped.
- **Area encodings use `√value` for radius** — never the raw value.
- **Demo or placeholder data must be deterministic.** A seeded generator, never
  `Math.random()`; a refresh has to render identically or screenshots and PDF
  exports stop matching.

### Motion

Use the brandbook's own tokens: `--out-strong cubic-bezier(.23,1,.32,1)`, entrance
`--disc 180ms` for chrome, ~700ms for a chart entrance. Fast in, no bounce.

- Marks enter on scroll into view, once, and replay on click.
- Stagger dots 12ms each, bars 100ms each.
- **`prefers-reduced-motion: reduce` disables every entrance** and renders the final
  state immediately. Non-negotiable.
- **Motion never outranks structure.** An effect that needs a new layout to hold it
  does not belong.

### Metric callouts — numbers + insight

Computed metrics render as callouts beside or above the chart they explain:

- **Value:** Black 900, `TXT`, tabular (`tnum`), at `--fs-h4`.
- **Label:** `--fs-overline` (Bold 700, `MUT`, 0.08em caps).
- **Delta:** `▲` hero colour (up) / `▼` `MUT` (down) / `–` `w4` (flat) — via Radix
  arrows (§8); never colour-only, always pair the arrow with the sign.
- **Insight:** one `--fs-caption` line in `MUT`, strictly descriptive — what the
  number means. Never a bare figure, never a recommendation.

### Interactive chrome

- **View toggle** (segmented control): `--radius-2` buttons on `w6`; hover `w5`;
  **active = `TXT` fill + `BG` text**; labels `--fs-micro`; Radix chart-type icons
  (§8). Real `<button>`s, keyboard-reachable.
- **Tooltip:** `TXT` ground with `BG` text on light, inverted on dark; `--radius-2`,
  `--shadow-3`, no border. Shows on hover **and** focus.
- **Series focus:** hovering or focusing a legend key raises its series and drops
  the rest back via an overlay alpha wash.

### Print, PDF, and the network

Output loads Satoshi from Fontshare, Noto Sans SC from Google Fonts, and ECharts
from jsDelivr for the three forms that need it. **The report therefore requires a
network connection to render as designed** — this is a deliberate trade for the
catalogue's range (see `WRITEREPORT.md` Rules).

- Give every font a real fallback stack so a cold or blocked CDN degrades to
  system type rather than to nothing.
- The **primary view renders statically** with full labels and metric callouts.
  Toggles, tooltips and alternate views are screen-only.
- **PDF export must wait for fonts and any library to finish loading before
  printing** — `document.fonts.ready`, plus an explicit readiness check for ECharts
  where it is used. Printing early produces a page of fallback type and empty
  chart frames.
- `@media print` hides toggles, tooltips and the grain, and shows only each chart's
  primary view.

---
## 8. Icons — Radix Icons, inlined

Iconography is **Radix Icons** (15×15, `currentColor`, MIT / WorkOS). **Inline the
SVG paths** directly in the output — never `npm`, CDN, `<img>`, or icon fonts (it
the report already depends on three CDNs and must not add a fourth). Colour
inherits via `currentColor`; size via
`width`/`height`.

- **Size:** 15px inline with body/caption; 16–18px in controls/headings. Optically
  centre with text (flex `align-items:center`, or `vertical-align:-0.125em`).
- **Colour:** default `MUT`; emphasis the hero tone (`#008125` light / `#00e13f`
  dark); on a `jolt` fill `jolt.contrast`.
- **Sanctioned uses (with restraint — icons clarify, never decorate):**
  - Metric deltas — `ArrowUpIcon` / `ArrowDownIcon` / `MinusIcon`.
  - Info / definition on a metric or chart — `InfoCircledIcon`,
    `QuestionMarkCircledIcon` (hover/focus reveals the note).
  - View-toggle & chart-type controls — `BarChartIcon`, `PieChartIcon`,
    `ActivityLogIcon` (distribution), `StackIcon` (cumulative), `ChevronDownIcon`,
    `CaretSortIcon` (rank). *(Note: there is no `DotChartIcon` in Radix.)*
  - Sort / filter affordances — `CaretSortIcon`, `MixerHorizontalIcon`.
  - The odd section eyebrow — **one** icon, sparingly.
- **Restraint:** one icon per control/label at most; **no** icon-tile-above-heading
  feature cards (a slop tell); consistent Radix stroke weight; don't introduce a
  second icon set.

---

## Quick reference

1. **Type?** One Satoshi family via `--font-sans`, sentence/title case, three
   weight tiers: **Black 900** display, **Bold 700** headings + labels, **Medium
   500** body. Contrast is the weight jump, never a second face.
2. **Big-heading line-height** stays at or above its `--lh-*` (display 1.0–1.08);
   the hero is the largest, in `display-2xl`/`display-xl` at Black 900.
3. **Color?** Nine brandbook tokens per theme + two derived 7-step ramps + overlay
   alphas. Pick by **role**: `BG` paper, `BG-alt` beige, `TXT` ink, `MUT` taupe,
   `GRID` w6, `DATA` warm ramp, `HERO` jolt `g3` on light / `g5` on dark. The jolt
   ramp is **locked** — it never encodes magnitude. Alpha from overlay steps only.
4. **Corners?** Radix radius scale — chips `--radius-1/2`; `full` on dots/pills;
   **chart cards 16px** (brandbook). Cards flat; `--shadow-*` for tooltips only.
5. **Spacing?** Radix `--space-*` everywhere in layout (no hardcoded px) — section
   padding `--space-9`/`8`, within-block `--space-1..5`. Vary it.
6. **Text size?** Editorial `--fs-*` (display→caption) for content; chrome uses
   `--fs-overline`/`caption`/`micro`; chart SVG text is in viewBox user units (§7).
7. **Charts?** Select the form from `CHARTS.md` by data shape, copy it from
   `charts/gallery.html` — never invent one. Warm-ramp marks assigned by importance;
   **one hero per chart**. Fixed viewBox + a `≤760px` one-column breakpoint. 2–3
   toggleable views, tooltips, metric callouts **with insights** (§7).
8. **Icons?** Radix Icons, **inlined** SVG, `currentColor`, with restraint (§8).
9. **Texture?** One `GrainOverlay`, keeps its green cast; neutral overlays use `*-a` steps.
