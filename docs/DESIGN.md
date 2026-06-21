---
version: alpha
name: P.I.N.O.C. — Editorial
description: Editorial system on a Radix-based token foundation — a single Satoshi superfamily with weight-driven hierarchy over a Radix custom warm-gray + green palette (12-step scales), Radix radius/space scales, film grain, and an interactive data-viz layer.
scope: src/components/landing/**  (rendered under [data-pinoc-landing])
colors:
  # Radix custom palette — two 12-step scales (warm gray + green accent), light
  # + dark, generated from seeds accent=#00E05A, gray=#F3EEE7, dark-bg=#000000
  # (radix-ui.com/colors/custom). Steps carry fixed roles (§3): 1–2 backgrounds,
  # 3–5 component bg, 6–8 borders/focus, 9–10 solid accent, 11 low-contrast text,
  # 12 high-contrast text. Semantic aliases below map roles → steps.
  light:
    gray:   ["#fffdf9","#fcf9f4","#f4efe8","#efe7dd","#e7e0d6","#dfd8ce","#d5cdc3","#c1bab0","#928b82","#888177","#686259","#251f17"]
    gray-a: ["#ffaa0006","#ba74000b","#864e0017","#874b0022","#6a3f0029","#59350031","#4d2b003c","#3721004f","#2113007d","#20130088","#170e00a6","#0f0900e8"]
    green:  ["#fafefa","#f3fcf4","#ddfcdf","#c6f8cb","#aff1b7","#96e6a1","#75d685","#37c35b","#00e05a","#00d649","#00862c","#174320"]
    green-a:["#00cc0005","#00c0160c","#00e90f22","#00e01739","#00d31a50","#00c31b69","#00b41e8a","#00b32ec8","#00e05a","#00d649","#00862c","#00300ae8"]
    green-contrast: "#142716"   # ink on solid accent (step 9/10)
    green-surface:  "#f0fbf1cc" # tinted accent surface
    gray-surface:   "#ffffffcc"
  dark:
    gray:   ["#000000","#121315","#1f1f22","#27282c","#2f3035","#393a3f","#46474e","#5e606a","#6c6e79","#797b86","#b2b3bd","#eeeef0"]
    gray-a: ["#00000000","#dbe7ff15","#e9e9ff22","#e3e8ff2c","#e3e7ff35","#e7ebff3f","#e5e9ff4e","#e3e7ff6a","#e4e8ff79","#e7ebff86","#f0f2ffbd","#fdfdfff0"]
    green:  ["#000000","#0b150c","#0e2a13","#0b3b17","#114a1f","#195928","#206a32","#247f3a","#00e05a","#00d54f","#00dc56","#abf5b4"]
    green-a:["#00000000","#86ff9215","#55ff742a","#30ff643b","#3bff6b4a","#48ff7359","#4dff796a","#49ff757f","#00ff67e0","#00ff5fd5","#00ff64dc","#b2ffbbf5"]
    green-contrast: "#142716"
    green-surface:  "#162a1880"
    gray-surface:   "#1f1f2280"
  # Semantic aliases (reference the steps; theme-independent)
  aliases:
    bg: gray-1                  # app background
    bg-subtle: gray-2
    surface: gray-2             # panels / cards (flat, border-defined)
    ui: gray-3                  # component bg
    ui-hover: gray-4
    ui-active: gray-5
    border-subtle: gray-6
    border: gray-7
    border-hover: gray-8        # focus ring
    solid: green-9              # solid accent
    solid-hover: green-10
    accent-text: green-11       # accent text / links (low-contrast accent)
    on-solid: green-contrast    # text on solid accent
    accent-surface: green-surface
    text: gray-12               # high-contrast text
    text-muted: gray-11         # low-contrast text
    text-subtle: gray-10
    focus: text                 # focus ring = gray-12 (high-contrast; step-8 fails 3:1)
  # Overlay alpha — true-neutral transparent scales (Radix blackA/whiteA, fixed,
  # theme-independent) for scrims / hover washes / shadows. NOT for the grain tint
  # (the grain keeps its green cast, §5). Wide-gamut: every gray/green token also
  # ships a P3 variant via @supports (display-p3); sRGB hex above is the floor.
  overlay:
    black-a: ["rgba(0,0,0,.05)","rgba(0,0,0,.1)","rgba(0,0,0,.15)","rgba(0,0,0,.2)","rgba(0,0,0,.3)","rgba(0,0,0,.4)","rgba(0,0,0,.5)","rgba(0,0,0,.6)","rgba(0,0,0,.7)","rgba(0,0,0,.8)","rgba(0,0,0,.9)","rgba(0,0,0,.95)"]
    white-a: ["rgba(255,255,255,.05)","rgba(255,255,255,.1)","rgba(255,255,255,.15)","rgba(255,255,255,.2)","rgba(255,255,255,.3)","rgba(255,255,255,.4)","rgba(255,255,255,.5)","rgba(255,255,255,.6)","rgba(255,255,255,.7)","rgba(255,255,255,.8)","rgba(255,255,255,.9)","rgba(255,255,255,.95)"]
typography:
  # Role-based Satoshi scale — CSS tokens scoped to [data-pinoc-landing] in
  # -landing-root.css (--fs-* / --lh-* / --ls-* / --fw-* + --font-sans). One
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
  "3": 6px      # cards, charts (default surface radius)
  "4": 8px      # larger cards, media frames
  "5": 12px
  "6": 16px
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
  # stay flat & border-defined (soft-shadow "ghost cards" remain an anti-slop tell).
  "1": "0 1px 2px var(--black-a3)"
  "2": "0 2px 4px var(--black-a3), 0 1px 2px var(--black-a4)"
  "3": "0 4px 12px var(--black-a4), 0 1px 3px var(--black-a3)"
  "4": "0 8px 20px var(--black-a5), 0 2px 6px var(--black-a4)"
  "5": "0 12px 32px var(--black-a5), 0 4px 10px var(--black-a4)"
  "6": "0 24px 56px var(--black-a6), 0 6px 16px var(--black-a5)"
---

# Design System: P.I.N.O.C. — Editorial

The editorial system styles the marketing landing (everything under
`src/components/landing/`, rendered inside the `[data-pinoc-landing]` scope). It
runs a single Satoshi superfamily — Black 900 display, Bold 700 headings, Medium
500 body — over a **Radix-based token foundation**: two 12-step scales (warm gray
+ green accent, light and dark), a Radix radius/space scale, and a film-grain
overlay, punctuated by full-bleed dark and green "magazine" bands.

It carries the brand DNA — warm paper, electric-green accent, film grain, a
disciplined token scale — and expresses it through four signature moves:

1. **Display headings** in Satoshi Black 900, sentence/title case; titles and
   section/card headings step down to Bold 700 (§1).
2. **Satoshi body** at Medium 500, with labels and eyebrows set in the same family
   at Bold 700 — the display↔body contrast is the weight jump, not a second face (§1).
3. **Radix step-driven colour** — every surface, border, and text colour maps to a
   numbered step (1–12), so light/dark and emphasis are systematic, not ad-hoc.
   Full-bleed bands (dark Hero, green Testimonials) use the dark scale / `green-9`
   surface (§3).
4. **An interactive data-viz layer** — charts carry 2–3 meaningful toggleable
   views, hover tooltips, computed metrics with plain-language insights, and Radix
   icons for labels and hierarchy (§7).

Cards stay flat and border-defined (no shadows); the radius, space, and palette
all come from the Radix token scales.

---

## 1. Typography — one Satoshi superfamily

Satoshi is a Swiss-style modernist grotesque (ITF / Deni Anggara): geometric, a
tall x-height, lining figures set to cap-height. Two traits drive the scale:

1. **Tall x-height** → body needs *more* leading than a typical sans to avoid a
   dense, dark block. Body sits at **1.5–1.6**.
2. **Slightly wide default spacing** → large sizes look loose untreated. Tracking
   **tightens as size grows, opens as it shrinks**, and opens generously on caps.

The landing runs this **single family** and builds hierarchy from **weight, size,
and tracking** — never a second face. Because Satoshi has true lowercase, headings
are **sentence/title case**, never forced all-caps.

**Font:** Satoshi — self-hosted variable font `/fonts/Satoshi-Variable.woff2`
(weights 300–900), `@font-face { font-weight: 300 900 }` in `global.css`. Exposed
as the scoped token **`--font-sans`** on `[data-pinoc-landing]` in
`-landing-root.css`:

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

The role scale lives as **CSS tokens scoped to `[data-pinoc-landing]`** in
`-landing-root.css`. Sections reference these tokens directly; keep `clamp()`,
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

Every landing `letter-spacing` references a `--ls-*` token.

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
caps wider). Chart SVG text uses the dedicated `--cfs-*` scale (§7).

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

> **Heading-tag mapping** (in `-landing-root.css`): `h1` → `--fs-title` /
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
| `--radius-3`  | 6   | **Cards, charts** — the default surface    |
| `--radius-4`  | 8   | Larger cards, media frames                 |
| `--radius-5`  | 12  | Feature panels (sparingly)                 |
| `--radius-6`  | 16  | Largest containers (rare)                  |
| `--radius-full` | 9999 | Pills, dots, avatars, circular controls |

`border-radius: 9999px`/`50%` is for genuinely round elements only (dots, pills,
avatars, nav buttons). Cards stay **flat and border-defined** — no drop shadows
(soft-shadow "ghost cards" are a slop tell); `--shadow-*` is for tooltips/popovers.

---

## 3. Color — two Radix scales, step-driven

Colour is a **Radix custom palette**: a warm **gray** neutral and a **green**
accent, each a 12-step scale with light + dark themes plus alpha (`*-a*`) and
`green-contrast` / surface tokens (see frontmatter). The brand green and warm
paper are the generator seeds (`green-9 = #00E05A`, light `gray-1 = #FFFDF9`,
dark `gray-1 = #000000`).

### Steps carry fixed roles

Each step does one job — never reach for an ad-hoc value:

| Step | Role                                  | Typical token                |
| ---- | ------------------------------------- | ---------------------------- |
| 1    | App background                        | `--bg` → `--gray-1`          |
| 2    | Subtle background / panels            | `--surface` → `--gray-2`     |
| 3    | UI element background                 | `--ui` → `--gray-3`          |
| 4    | Hovered UI background                 | `--ui-hover` → `--gray-4`    |
| 5    | Active / selected UI background       | `--ui-active` → `--gray-5`   |
| 6    | Subtle borders & separators           | `--border-subtle` → `gray-6` |
| 7    | UI element border                     | `--border` → `--gray-7`      |
| 8    | Hovered border / **focus ring**       | `--border-hover` → `gray-8`  |
| 9    | **Solid** accent                      | `--solid` → `--green-9`      |
| 10   | Hovered solid                         | `--solid-hover` → `green-10` |
| 11   | Low-contrast (muted) text             | `--text-muted` → `gray-11`   |
| 12   | High-contrast text                    | `--text` → `--gray-12`       |

Steps 11/12 are contrast-guaranteed (APCA Lc 60 / 90) over steps 1–2 of the same
scale. **Accent text** uses `green-11` (`--accent-text`), never `green-9` (that's
a solid-background colour, weak as text). Text on a solid-accent surface uses
`green-contrast` (`--on-solid`, `#142716`).

### Surfaces & full-bleed bands

The editorial "magazine" bands still apply — expressed in steps:

- **Dark band (Hero):** switch the section to the **dark scale** (`gray-1`…`gray-12`
  dark) — `--bg` becomes `#000000`, text `gray-12` (`#EEEEF0`), borders `gray-6/7`.
- **Green band (Testimonials):** fill with `--solid` (`green-9`); all content uses
  `--on-solid` (`green-contrast`) for text and `green-a*` alphas for hairlines.
  A second green fill on green disappears — keep one fill, ink in `on-solid`.

### Accent discipline

Green stays **surgical**: solid CTA fills, the one accent word in a headline,
`green-11` for links/accent text, and `green-a*` alphas for subtle washes/hover.
**In charts green is reserved for a single highlight per chart** (§7) — data marks
default to neutral gray. Don't paint large neutral areas green; that's the gray
scale's job.

### Interactive states (Radix 3/4/5 model)

Drive every interactive element from the step scale: **bg rest → `--ui` (3),
hover → `--ui-hover` (4), active/selected → `--ui-active` (5)**; borders rest/hover
= `7`/`8`. **Focus ring = `--focus` (`--text`/gray-12), 2px, 2px offset** — a step-8
ring fails the 3:1 non-text floor, so use the high-contrast token (or `--accent-text`).

### Overlays & wide gamut

- **Overlay alpha** `--black-a1..12` / `--white-a1..12` (true-neutral, fixed) for
  scrims, hover washes, and the `--shadow-*` ladder. Prefer these over `gray-a*`
  when you want a *neutral* overlay (dark `gray-a` is cool-tinted). The **grain
  keeps its green cast** (§5) — don't neutralize it.
- **Wide gamut (P3):** each `gray`/`green` token ships a P3/`oklch` variant in an
  `@supports (color: color(display-p3 1 1 1))` block; the green reads noticeably
  richer on P3 displays. **sRGB hex is the floor** — never P3-only.

> **Token-only color, from the steps.** No hardcoded one-offs. Derive transparency
> from the **alpha steps** (`--gray-a*` / `--green-a*` / `--black-a*` / `--white-a*`)
> rather than ad-hoc `color-mix`/`rgba`. Data-viz colour is specced in §7.

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

A single shared **`GrainOverlay`** component (`src/components/layout/GrainOverlay.tsx`)
is mounted once at the top of the landing tree (`PinocLandingPage.tsx`).
Mechanics:

- A `position: fixed; inset: 0` overlay at **`--z-grain`** (300),
  `pointer-events: none`, `contain: strict` — it sits above all content and
  passes input through.
- Texture is an inline SVG **`feTurbulence` `fractalNoise`** desaturated to grey
  (`feColorMatrix saturate 0`).
- **Light theme:** `opacity: 0.12`, `mix-blend-mode: multiply`, plus a `.tint`
  layer washing `--solid` (`green-9`) at ~30% with `mix-blend-mode: color` (the
  subtle green cast).
- **Dark theme:** background is dark `gray-1` (`#000000`); grain uses
  `mix-blend-mode: screen`, `opacity: 0.15`, tint hidden.
- A top-to-bottom mask fades the grain in from `0.35` → `1.0` so the top of the
  viewport stays cleaner.

The landing supports light and dark via `data-theme`; the grain inherits the
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
  (~0.01ms), applied globally in `global.css`.
- Guard hover-only affordances (lifts, underlines, glows) with `(hover: hover)`
  so touch devices skip phantom hover states.
- Focus ring: 2px solid **`--text`** (`gray-12`) with 2px offset, via
  `:focus-visible` (keyboard only) — a step-8 ring fails the 3:1 non-text contrast
  floor on light surfaces, so use a high-contrast token (`--text`, or `--accent-text`
  green-11) instead. All interactive chart controls (view toggles, legend buttons)
  are real `<button>`s and must be keyboard-reachable.
- Contrast: lean on Radix steps — body text `gray-12` / muted `gray-11` clear
  APCA Lc 60/90 on steps 1–2; text on `green-9` uses `green-contrast`. Re-check
  any colour pairing the steps don't already guarantee.
- **Adaptive / responsive:** the output must read on a phone. Use breakpoints
  (≈`760px` tablet, `420px` phone): stack multi-column grids (stats, metrics,
  small-multiples) to 1–2 columns; charts are HTML/CSS so they reflow without
  shrinking text; keep interactive controls ≥ ~40px touch targets; never let a chart
  force horizontal overflow. Honour safe-area insets.

---

## 7. Data visualization

Charts are **first-class, interactive, and adaptive**, built on the Radix tokens.
This section defines the *visual language*; the skill (`WRITEREPORT.md` §3) defines
the *behavior* — multiple meaningful views, hover tooltips, and computed metrics
with plain-language insights.

### Adaptive by construction — HTML/CSS bars, SVG only for lines

**Dense charts (bars, columns, dots, stacked, grouped, tables) are built from
HTML/CSS elements — not a fixed-`viewBox` SVG.** A `viewBox` SVG scaled to a phone
column downscales its text to ~4px; HTML/CSS bars **reflow and keep real, legible
text at every width**. Reserve **SVG for genuinely graphical forms (line / area /
scatter)**; give those a modest `viewBox` and **bump their text on small screens**
(media query) since their labels are sparse. Row layout is **label → value → bar**
(value *before* the growing bar/track), so the value never gets pushed off a narrow
viewport. Use `minmax(0,1fr)` for the flexible bar track.

### Chart text scale (dedicated, rem)

Chart text uses its **own small scale** (`--cfs-*`, in **rem** so it scales with the
root and stays accessible), tuned independently of the editorial `--fs-*`:

| Token         | rem (≈px) | Used for                              |
| ------------- | --------- | ------------------------------------- |
| `--cfs-value` | .8125 (13) | Data / value labels (`tnum`)         |
| `--cfs-label` | .8125 (13) | Category / series labels             |
| `--cfs-axis`  | .6875 (11) | Axis ticks, legend, mean-line label  |

Keep chart text at or **below** body size. For the residual SVG line charts only,
author the `viewBox` modestly (~560 wide) and bump `ls-*` text at `≤760px`/`≤420px`.

### Chart palette — neutral by default, **green is surgical**

Data marks are **neutral gray**; green marks **one thing per chart — the insight's
subject** (the point the section makes), plus the mean line and metric deltas.

| Role                              | Token                                            |
| --------------------------------- | ------------------------------------------------ |
| **Default data mark** (bar/column/dot) | `--gray-9`                                   |
| **Highlight** (the insight's subject) | `--solid` (`green-9`) — **once per chart**    |
| Secondary / comparison series     | `--gray-7` / `--gray-11`                          |
| Bar track / empty                 | `--gray-a3`                                       |
| Ordinal / sequential ramp         | gray ramp `gray-5 → 7 → 9 → 11`, **green only on the emphasized step** |
| Diverging (for/against, ±)        | grays both sides; **green only on the emphasized extreme** (no 2nd hue, never red) |
| **Line / cumulative**             | **`--gray-9` line + one `--solid` point** at the key threshold |
| Gridlines / baseline              | `--gray-6` (or `--gray-a6`) · zero line `gray-7` |
| Axis tick labels                  | `--gray-11` (`--cfs-axis`)                        |
| Value / data labels               | `--gray-12` (`--cfs-value`, `tnum`)              |
| Reference line (mean / median)    | `green-11`, dashed, labeled                       |

Chart surface: page `--bg` or `--surface`, radius `--radius-3`, **no shadow**.
Bars `--radius-1/2`; dots `r≈6`. **Rule: green = the point being made, once per
chart.** If you can't name why a mark is green, it's gray. Always direct-label
marks — a near-monochrome palette demands it.

### Metric callouts — numbers + insight

Computed metrics (%, mean, median, std dev, top-box, deltas…) render as callouts
beside or above the chart they explain:

- **Value:** Black 900, `--text`, tabular (`tnum`), at **`--fs-h4`** (~20px — not h3).
- **Label:** `--fs-overline` (Bold 700, `--text-muted`, 0.08em caps).
- **Delta:** `▲` `green-11` (up) / `▼` `gray-11` (down) / `–` `gray-10` (flat) —
  via Radix arrows (§8); never red/green-only — pair the arrow with the sign.
- **Insight:** one `--fs-caption` line in `--text-muted`, strictly descriptive (what
  the number means), never a bare figure and never a recommendation.

### Interactive chrome

Drive states from the **3/4/5 step model** (§3); focus ring = `--focus`.

- **View toggle** (segmented control): `--radius-2` buttons on `--ui` (3); hover
  `--ui-hover` (4); **active = `--solid` fill + `--on-solid` text**; labels at
  `--fs-micro`; Radix chart-type icons (§8). Real `<button>`s, keyboard-reachable.
- **Tooltip:** `--surface` bg, 1px `--border`, **`--shadow-3`**, `--radius-2`; value
  `gray-12` (`tnum`), context `gray-11`. Shows on hover **and** focus.
- **Series focus / legend:** hovering/clicking a legend key highlights its series;
  others drop back via a `--black-a* / --white-a*` wash.

### Print / static fallback

The **primary view** renders statically (HTML/CSS marks, or inline `<svg>` for
lines) with full labels and the key metric callouts, so it reads with JS off and in
PDF. Toggles, tooltips, and alternate views are screen-only enhancements (the skill
exports the primary view to PDF). Because charts are HTML/CSS, they **reflow to the
print/page width** as well as the screen.

---

## 8. Icons — Radix Icons, inlined

Iconography is **Radix Icons** (15×15, `currentColor`, MIT / WorkOS). **Inline the
SVG paths** directly in the output — never `npm`, CDN, `<img>`, or icon fonts (it
must stay self-contained). Colour inherits via `currentColor`; size via
`width`/`height`.

- **Size:** 15px inline with body/caption; 16–18px in controls/headings. Optically
  centre with text (flex `align-items:center`, or `vertical-align:-0.125em`).
- **Colour:** default `--text-muted` (`gray-11`); emphasis `--accent-text`
  (`green-11`); on a solid-accent surface `--on-solid`.
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
3. **Color?** Two Radix 12-step scales (warm `gray`, `green` accent) + overlay
   `black-a`/`white-a` + P3. Pick by **step role**: bg `gray-1/2`, component bg
   `3/4/5` (rest/hover/active), borders `6/7/8`, solid accent `green-9`, muted text
   `gray-11`, text `gray-12`, accent text `green-11`, ink-on-green `green-contrast`,
   focus `--focus`. Alpha from `*-a*`/overlay steps — no ad-hoc rgba.
4. **Corners?** Radix radius scale — cards/charts `--radius-3` (6px); chips
   `--radius-1/2`; `full` only on dots/pills. Cards flat; `--shadow-*` for tooltips only.
5. **Spacing?** Radix `--space-*` everywhere in layout (no hardcoded px) — section
   padding `--space-9`/`8`, within-block `--space-1..5`. Vary it.
6. **Text size?** Editorial `--fs-*` (display→caption) for content; chrome uses
   `--fs-overline`/`caption`/`micro`; charts use the dedicated `--cfs-*` scale.
7. **Charts?** Neutral `gray-9` marks; **green is surgical — one highlight per chart**
   (the insight's subject) + mean line + delta. 2–3 toggleable views, tooltips,
   metric callouts **with insights** (§7).
8. **Icons?** Radix Icons, **inlined** SVG, `currentColor`, with restraint (§8).
9. **Texture?** One `GrainOverlay`, keeps its green cast; neutral overlays use `*-a` steps.
