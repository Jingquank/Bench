<!-- only:cursor -->
---
name: xray
description: Generate a live debug UI panel for any selected element so designers and developers can tweak visual and behavioral parameters in real time. Use when the user selects a browser element and says "xray", "debug ui", "tweak panel", or "parameter controls". Running without a selection removes all previously generated xray debug artifacts.
---
<!-- /only -->
<!-- only:claude -->
---
name: xray
description: Generate a live debug UI panel for any component so designers and developers can tweak visual and behavioral parameters in real time. Use when the user says "xray", "debug ui", "tweak panel", or "parameter controls". Running without a target removes all previously generated xray debug artifacts.
user-invocable: true
disable-model-invocation: true
argument-hint: [TARGET=<component-name-or-file>]
---
<!-- /only -->
<!-- only:codex -->
---
name: xray
description: Generate a live debug UI panel for any component so designers and developers can tweak visual and behavioral parameters in real time. Use when the user says "xray", "debug ui", "tweak panel", or "parameter controls". Running without a target removes all previously generated xray debug artifacts.
---
<!-- /only -->

# /xray -- Live Debug UI Generator

Build a temporary debug panel for any UI element. Tweak parameters live, copy the result, then clean up when done.

## Mode Detection

<!-- only:cursor -->
**Check the user message for a browser element selection** (the `browser_element` code block Cursor attaches when the user clicks an element in the preview).

- **Selection present** --> **Build mode** (generate a debug panel for that element)
- **No selection** --> **Clean mode** (find and remove all xray artifacts from the codebase)
<!-- /only -->
<!-- only:claude,codex -->
**Check whether a target was provided** via `$ARGUMENTS` or in the user's message.

- **Target provided** (component name, file path, or description) --> **Build mode** (generate a debug panel for that component)
- **No target** --> **Clean mode** (find and remove all xray artifacts from the codebase)

If the target is ambiguous (e.g., a generic name that matches multiple components), ask the user to clarify which component they mean.
<!-- /only -->

---

## Build Mode

Follow these steps in order. Do not skip steps.

### Step 1: Read the Component Source and Understand Intent

<!-- only:cursor -->
1. From the `browser_element` metadata, extract the `component` name and `component_stack`.
2. Find and read the source file for the innermost component.
3. If the element is plain HTML (no framework component), read the file that renders it.
<!-- /only -->
<!-- only:claude,codex -->
1. From `$ARGUMENTS`, identify the target component. Search the codebase for the component file by name, file path, or description.
2. Find and read the source file for the target component.
3. If the target is plain HTML (no framework component), read the file that renders it.
<!-- /only -->
4. **Check the user's message for scope hints.** If they mention a specific concern (e.g., "tweak the animation", "adjust spacing", "play with colors"), note that domain. In Step 2, focus parameter extraction on that domain only -- do not extract every tweakable value in the file. If the user gives no hint, extract broadly.

### Step 2: Extract Tweakable Parameters

Scan the source for hardcoded values that control the element's appearance or behavior. Look for:

| What to find | Examples |
|---|---|
| Numeric literals in style objects or CSS | `width: 320`, `padding: 12`, `borderRadius: 8`, `gap: 8` |
| Animation/physics constants | `const SPEED = 0.04`, `const SCALE = 3`, `MAX_TILT = 7` |
| Color values | `'#00FF41'`, `'rgba(0, 255, 65, 0.2)'`, `'hsl(120, 100%, 50%)'` |
| Opacity values | `opacity: 0.8`, `globalAlpha = 0.3` |
| Boolean flags | `const ENABLE_GLOW = true`, `autoPlay`, `loop` |
| String enums / modes | `mode = 'flow'`, `variant = 'primary'`, `position = 'top'` |
| Timing values | `duration: 300`, `delay: 0.15`, `interval: 1000` |
| Transform parameters | `rotateX(${rx}deg)`, `perspective(800px)`, `scale(1.2)` |
| CSS custom property overrides | `var(--ink)`, `var(--color-accent)` |

**Heuristics for what to include:**
- Values that directly affect how the element looks, moves, or behaves
- Constants defined at the top of the file or in a config object
- Magic numbers inside render/draw/animation functions
- Props with default values

**What to exclude:**
- Structural values (array indices, loop counters, API endpoints)
- Values derived from other values (computed, not independently tweakable)
- IDs, keys, refs, or callback definitions

For each parameter, record: `key` (descriptive camelCase name), `defaultValue`, `type` (number, boolean, color, enum).

### Step 3: Choose Controls

Map each parameter to the right UI control:

| Parameter type | Control | Config |
|---|---|---|
| Number (continuous range, e.g. opacity, speed, frequency) | **Slider** | `min`, `max`, `step` |
| Number (small integer, e.g. pixel count, scale) | **Stepper** (+/- buttons) | `min`, `max`, `step` |
| Boolean | **Toggle switch** | -- |
| Color (hex/rgb/hsl) | **Color picker** `<input type="color">` | -- |
| String enum (2-4 options) | **Segmented button group** | `options[]` |
| String enum (5+ options) | **Select dropdown** | `options[]` |

**Range heuristics for sliders/steppers:**
- Opacity/alpha: 0--1, step 0.01
- Pixel sizes (padding, gap, radius): 0--100, step 1
- Frequencies: 1--30, step 0.5
- Speeds/rates (small floats): 0.001--1, step 0.005
- Angles (degrees): 0--360, step 1
- Durations (ms): 0--5000, step 50
- Percentages: 0--100, step 1
- Scale factors: 0.1--10, step 0.1
- When unsure, use `defaultValue * 0.1` as min and `defaultValue * 3` as max

Group parameters by category (e.g., "Layout", "Animation", "Colors", "Behavior") for the panel UI.

### Step 4: Confirm with User

**STOP here. Do not generate any code until the user confirms.**

Present a summary to the user:

1. **Target**: component name, file path, and a one-line description of what it does
2. **Proposed parameters** grouped by category -- for each, show:
   - Parameter name
   - Control type (slider, stepper, toggle, color picker, segmented group)
   - Default value
   - Range (min/max/step for numeric controls, options for enums)
3. **Ask the user to**:
   - Confirm the list looks good
   - Remove any parameters they do not want
   - Add any parameters the agent missed
   - Adjust any ranges that look wrong

Only proceed to Step 5 after the user explicitly approves. If the user removes or adds parameters, update the plan accordingly before continuing.

### Step 5: Detect Framework and Design Tokens

**Framework detection** -- read the project's `package.json` dependencies:

| Dependency found | Framework |
|---|---|
| `react` or `react-dom` | React |
| `vue` | Vue 3 |
| `svelte` | Svelte |
| `@angular/core` | Angular |
| None of the above | Vanilla JS |

**Design token detection** -- scan for the project's styling system to adapt the panel:

1. Check for **design system documentation files** in the project root and common directories (`src/`, `docs/`, `.cursor/skills/`): files named `design.md`, `DESIGN.md`, `design-system.md`, `SKILL.md`, or any markdown file whose title or frontmatter indicates it defines a design system (e.g., contains "design system", "design tokens", or CSS custom property definitions). If found, read the file and extract visual guidance -- color tokens, spacing scale, typography, border-radius rules, font stacks, and any explicit styling constraints.
2. Check for CSS custom properties in the root stylesheet (`:root { --* }`)
3. Check for Tailwind config (`tailwind.config.*`)
4. Check for theme files (`theme.ts`, `tokens.css`, `variables.scss`)
5. Read any design-system skill already installed in the project (e.g., one that exports CSS custom properties or documents design tokens)

Map the discovered tokens onto the panel's own chrome -- **design system documentation files take highest priority**, then CSS custom properties, then Tailwind config, then theme files:

| Panel part | Token to use |
|---|---|
| Panel surface / background | the system's surface / card background |
| Labels & values (text) | the system's primary text color |
| Panel border & row dividers | the system's border / outline token |
| Active control fills, focus rings, slider thumbs | the system's accent / primary color |
| Panel & control corners | the system's border-radius scale |
| Typography (family, weight, letter-spacing, case) | the system's font stack and label conventions |
| Panel elevation | the system's shadow / elevation token |
| Row padding & gaps | the system's spacing scale |

Honor **non-color rules too**, not just colors: border style (e.g. dashed), border-radius, shadow/elevation, typography conventions, and any reduced-motion guidance.

**Match the active theme.** If the project supports theming, detect the active mechanism -- a `data-theme` attribute on `<html>` / `<body>`, or `prefers-color-scheme` -- and render the panel in whichever theme is currently active, reading that theme's token values. If the user toggles theme, the panel follows.

If no tokens or design documentation are found, fall back to a neutral, theme-agnostic palette:

```
background: #1a1a1a, text: #e0e0e0, border: rgba(255,255,255,0.15),
accent: #6366f1, font: system-ui monospace, radius: 6px
```

### Step 6: Generate the Debug Panel

Create a new component file for the debug panel. **Every generated element MUST have `data-xray="true"` as an attribute.** Every generated code block MUST begin with a `// @xray-generated` comment.

The panel component receives two props:
- `config` -- the current parameter values object
- `onChange` -- a setter/callback to update the config

**Critical layout rules:**

1. The panel MUST be rendered as an **overlay** (`position: fixed` or `position: absolute` relative to the viewport), not as an inline element in the document flow. It must **never** wrap, reparent, or shift the target element or any of its ancestors.
2. The panel MUST NOT cover the element being tweaked. Choose a placement (right, left, bottom, top) where there is enough viewport space. If the target is on the left half of the screen, place the panel to the right, and vice versa. If few parameters, use a compact floating panel. If many parameters, use a taller sidebar-style panel with internal scroll.
3. The panel MUST be toggleable on/off.
4. Use a high `z-index` (e.g., 99999) so the panel floats above all page content.
5. Render both the panel and the toggle button via a **portal** (body-level mount) so they are completely outside the target's DOM hierarchy. See the Framework-Specific Patterns section for portal APIs per framework.
6. The panel MUST be **draggable**. The panel header/title bar (`XRAY: ComponentName`) acts as the drag handle. Implement via pointer events (`pointerdown` / `pointermove` / `pointerup`) on the handle -- no external dependencies. Store `top` / `left` in component state and apply to the fixed-position container's inline style. Use `cursor: grab` on the handle (switch to `cursor: grabbing` during drag). **Clamp to the viewport** on every `pointermove` and on `window.resize` so the handle can never be dragged off-screen (`left` within `[0, innerWidth - panelWidth]`, `top` within `[0, innerHeight - headerHeight]`). **Persist the position**: write `{ top, left }` to `localStorage` under `xray:<ComponentName>:pos` on drag end, and on mount restore it (re-clamped to the current viewport). Use the placement heuristic (away from the target) only on first render when no stored position exists.

**Panel structure:**

```
+--[ ≡ XRAY: ComponentName ]------+   <-- drag handle
| [Mode: flow / noise]         |  <-- enum controls at top
|-------------------------------|
| CATEGORY LABEL                |
|   Param Name    [control] val |
|   Param Name    [control] val |
| CATEGORY LABEL                |
|   Param Name    [control] val |
|-------------------------------|
| Preset [ select v ] [Save][x] |  <-- named presets
| [ COPY CONFIG ]  [ RESET ]   |
+-------------------------------+
```

All panel state is namespaced per target component in `localStorage` under
`xray:<ComponentName>:*` keys. **Every `localStorage` access MUST be wrapped in a
`typeof window !== 'undefined'` guard and a `try/catch`** so the panel is safe under SSR and
private-browsing modes.

**Copy Config button** -- copies all current parameter values as formatted JSON to the clipboard (exclude internal keys like `mode` if they map to existing component state). Show brief "Copied!" feedback.

**Reset button** -- restores all values to the defaults object **and clears `xray:<ComponentName>:config`** so the next load starts from `XRAY_DEFAULTS`.

**Persist tweaks** -- on every config change, write the current values to `xray:<ComponentName>:config` (debounced). On mount, the parent initializes state from this stored config if present, else `XRAY_DEFAULTS` (see Step 7). Tweaks therefore survive a page reload or dev-server hot-reload, not just a Copy Config.

**Presets** -- a name input + Save button stores the current config under `xray:<ComponentName>:presets` (a `{ name: config }` map); a dropdown loads a saved preset and a small `x` deletes one. Pure inline code -- no dependencies.

**Toggle button** -- a small button rendered via portal at body level, positioned via JavaScript to float near the target element's bounding rect (e.g., bottom-right corner). Use `getBoundingClientRect()` to calculate position. This button also carries `data-xray="true"`.

### Step 7: Wire Into the Component Tree

1. **Create a defaults object** in the target component's file (or a nearby shared file). Export it with an `XRAY_` prefix. Values MUST be the exact hardcoded values from the source before xray modified anything -- this ensures Reset restores the true pre-xray state.
2. **Replace hardcoded values** with reads from a `config` prop, falling back to defaults: `config?.scale ?? XRAY_DEFAULTS.scale`.
3. **Add state** in the nearest parent component, initialized from persisted tweaks if present, else the defaults -- e.g. in React `useState(() => loadXrayConfig('<ComponentName>') ?? { ...XRAY_DEFAULTS })`, where `loadXrayConfig` reads `xray:<ComponentName>:config` from `localStorage` (guarded). See Framework-Specific Patterns for other frameworks.
4. **Render the panel and toggle as a portal overlay.** Do NOT wrap the target in a new parent div. The target stays exactly where it is in the DOM. Position the toggle near the target via `getBoundingClientRect()`. Position the panel where it won't cover the target.
5. **Do not report done yet.** Proceed to Step 8.

### Step 8: Verify in Browser

This step is mandatory. Do not skip it.

1. Open the page where the target component renders, using whatever browser tool your environment provides:
   - **Cursor:** open the in-editor browser preview at the URL.
   - **Claude Code:** navigate with Chrome MCP (`mcp__claude-in-chrome__navigate`).
   - **Any other agent:** use your available browser-automation tool. If you have none, ask the user to open the URL and confirm what they see — proceed on their report instead of screenshots.
2. Click the xray toggle button to open the panel.
3. Take a screenshot to confirm the panel renders correctly alongside the target element (without a browser tool, ask the user to confirm).
4. Move at least one slider or control and take another screenshot to verify the target updates in real time.
5. If anything is broken (panel doesn't render, controls don't update the target, layout is overlapping), fix it before reporting done.
6. Only after visual confirmation, report to the user that the debug panel is ready.

---

## Clean Mode

<!-- only:cursor -->
When the user runs `/xray` with no element selected, remove all xray artifacts.
<!-- /only -->
<!-- only:claude,codex -->
When the user runs `/xray` with no target argument, remove all xray artifacts.
<!-- /only -->

### Step 1: Find All Xray Artifacts

Search the entire `src/` directory (or project root) for:
- Files containing `data-xray` in JSX/HTML/template attributes
- Files containing `// @xray-generated` comments
- Files containing `XRAY_DEFAULTS` or `XRAY_` prefixed exports
- Standalone component files whose name contains `Xray` (e.g., `XrayPanel.jsx`)

### Step 2: Preserve Current Values

Before removing anything, recover the most recent values to bake back:

1. **Prefer persisted runtime tweaks.** If the dev server is running, read `xray:<ComponentName>:config` from the page's `localStorage` via your browser tool (Claude Code: Chrome MCP `javascript_tool` running `localStorage.getItem('xray:<ComponentName>:config')`; other agents: your browser tool, or ask the user to paste it from devtools). This reflects the user's latest tweaks even if they never clicked "Copy Config".
2. **Otherwise fall back to `XRAY_DEFAULTS`** in the source, which reflects the last explicitly saved state.

**Note**: runtime tweaks are persisted to `localStorage`, so they survive reloads and are recoverable here -- unless storage was cleared or the page never persisted them. These baked-back values become hardcoded constants in the component.

### Step 3: Confirm with User Before Removing

**STOP here. Do not remove anything until the user confirms.**

Present a summary to the user:

1. **Files to delete**: list standalone xray component files (e.g., `XrayPanel.jsx`)
2. **Files to modify**: list files where xray code will be removed and original values restored
3. **Values to bake back**: show the current `XRAY_DEFAULTS` values that will replace the config prop reads
4. **Warning**: if any values in `XRAY_DEFAULTS` differ from what the original hardcoded values were, highlight them so the user knows which tweaks will be preserved
5. **Remind the user**: "Your latest tweaks are read back from the running page's `localStorage` and baked in. If the dev server isn't running (or storage was cleared), only the last saved `XRAY_DEFAULTS` can be restored -- start it first if you want to keep recent tweaks."

Only proceed after the user confirms.

### Step 4: Remove Artifacts

For each affected file:

1. **Standalone xray files** (e.g., `XrayPanel.jsx`) -- delete them entirely.
2. **Modified component files** -- for each `// @xray-generated` block:
   - Remove the block
   - If the block was a defaults export, bake the current values back as hardcoded constants in the places they were originally extracted from
   - Remove `config` props that were added for xray
   - Remove xray-related imports
3. **Parent/wrapper files** -- remove:
   - `xrayConfig` state declarations
   - `xrayOpen` toggle state
   - Layout wrapper divs marked `data-xray="true"`
   - Import statements for deleted xray components
4. **Restore original component signatures** -- remove `config` from props if it was added by xray.
5. **Clear persisted xray state.** Remove every `xray:<ComponentName>:*` key (`:pos`, `:config`, `:presets`) from the page's `localStorage` via your browser tool (e.g. Chrome MCP `javascript_tool`: `Object.keys(localStorage).filter(k => k.startsWith('xray:')).forEach(k => localStorage.removeItem(k))`). If you have no browser tool, tell the user to clear them.

### Step 5: Verify Clean

1. Search the codebase for any remaining `data-xray` or `@xray-generated` references.
2. If any are found, remove them.
3. Run linter to confirm no broken imports or unused variables.
4. Confirm no `xray:` keys remain in the page's `localStorage` (via your browser tool, if available).

---

## Framework-Specific Patterns

| Framework | State | Props / Events | Portal API |
|---|---|---|---|
| **React** | `useState` in parent | standard props | `createPortal(<Panel />, document.body)` |
| **Vue 3** | `ref()` in `<script setup>` | `defineProps` / `defineEmits` | `<Teleport to="body">` |
| **Svelte** | `let config = {...}` in parent | `export let config` / dispatch | Svelte action appending to `document.body` |
| **Vanilla JS** | `window.__xray` or module-scoped object | direct mutation + re-render callback | `document.createElement` appended to `document.body` |

---

## Rules

- **Never add runtime dependencies.** The debug panel is pure inline code.
- **Always use `data-xray="true"`** on every generated DOM element.
- **Always use `// @xray-generated`** as the first line of every generated code block.
- **Keep the target component's public API unchanged.** The `config` prop is additive and optional with fallback defaults.
- **Adapt styling to the host project.** Read their design tokens first, honor non-color rules, and match the active theme.
- **Persist panel state to `localStorage`** under `xray:<ComponentName>:*` keys (position, config, presets); guard every access for SSR / private mode and clear them all on clean.
- **Preserve user tweaks on clean.** Recover the latest values (persisted config, else `XRAY_DEFAULTS`) and bake them back before removing.
- **Check for existing xray artifacts before building.** If artifacts already exist:
  - If they target a **different** component, ask the user: "Xray is already active on [ComponentA]. Add a panel for [ComponentB] alongside it, or clean [ComponentA] first?"
  - If they target the **same** component, ask: "Xray is already active on this component. Update the existing panel with new parameters, or rebuild from scratch?"
  - Act on the user's choice.
