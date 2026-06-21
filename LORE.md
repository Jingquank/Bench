<!-- only:cursor -->
---
name: lore
description: Generate, iterate, and maintain a PRODUCT.md -- a living document of the product's user journeys, target users, and anti-goals. Use when the user says "lore", "update lore", "product.md", "user journeys", "log this feature", or "what does this product do". The doc evolves as features are added, modified, or removed.
---
<!-- /only -->
<!-- only:claude -->
---
name: lore
description: Generate, iterate, and maintain a PRODUCT.md -- a living document of the product's user journeys, target users, and anti-goals. Use when the user says "lore", "update lore", "product.md", "user journeys", "log this feature", or "what does this product do". The doc evolves as features are added, modified, or removed.
user-invocable: true
disable-model-invocation: false
argument-hint: [FOCUS=<journey-or-area>]
---
<!-- /only -->
<!-- only:codex -->
---
name: lore
description: Generate, iterate, and maintain a PRODUCT.md -- a living document of the product's user journeys, target users, and anti-goals. Use when the user says "lore", "update lore", "product.md", "user journeys", "log this feature", or "what does this product do". The doc evolves as features are added, modified, or removed.
---
<!-- /only -->

# /lore -- Product Journey Codex

Maintain `PRODUCT.md` at the project root: the canonical, living description of what the product is, who it's for, what it deliberately does NOT do, and the user journeys that make it real. `/lore` is the act, `PRODUCT.md` is the codex -- run it to write the codex from scratch on a new project, or to keep it in sync as features change.

---

## Mode Detection

Run a single check at the start of every invocation:

| Project state | Mode |
|---|---|
| No `PRODUCT.md` at repo root, project directory effectively empty (no source, no routes) | **BASELINE-EMPTY** |
| No `PRODUCT.md` at repo root, project has code | **BASELINE-DERIVE** |
| `PRODUCT.md` exists at repo root | **ITERATE** |

State the detected mode to the user in one sentence before proceeding. If the user wants to override (e.g., "redo from scratch even though PRODUCT.md exists"), let them.

### Optional: FOCUS argument

If `$ARGUMENTS` contains `FOCUS=<area>` (e.g., `/lore FOCUS=checkout` or `/lore FOCUS=signup`), narrow scope:

- **ITERATE mode:** only diff journeys whose title or `Evidence:` line mentions the focus area. Other journeys are skipped from the change preview entirely (treat as `KEEP` without re-deriving them).
- **BASELINE-DERIVE mode:** only draft journeys that touch the focus area. Add a placeholder note at the bottom: `<!-- other journeys: run /lore again without FOCUS to populate -->`.
- **BASELINE-EMPTY mode:** ignore the argument; there's nothing to focus on yet.

Match `FOCUS` loosely: substring match against journey titles, route segments, and file paths is enough. If nothing matches, ask the user to clarify rather than silently doing nothing.

---

## Phase 1 -- Silent Discovery

Do all of this silently -- no user interaction yet. Use parallel tool calls or explore subagents where independent.

### Step 1: Identify the Product

Read in priority order:

| Source | What to extract |
|---|---|
| `README.md`, `README.*` | Product name, purpose, target audience, value prop |
| `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` | `description`, dependencies (domain signals: Stripe = payments, Prisma = data app, Three.js = 3D, etc.) |
| `.env.example` | Third-party services in use |
| `docs/`, `CLAUDE.md` / `AGENTS.md`, plan files | Existing product context, design decisions |
| Existing `PRODUCT.md` (ITERATE mode) | Current journeys, personas, anti-goals -- treat as prior baseline, not ground truth |

**Caveat: README staleness.** READMEs lag behind reality, especially after pivots or fast-moving development. Cross-check claims against the codebase before quoting them -- if `git log -- README.md` shows it hasn't been touched in months while the rest of the repo has, treat it as historical context (the product's intent, not its current state) and prefer code, routes, and live UI as ground truth.

**Output (internal):** One paragraph: what this product is, who it's for, the core problem it solves.

### Step 2: Map User-Facing Surfaces

Detect the framework and enumerate user-facing entry points:

| Framework signal | Where to look |
|---|---|
| Next.js (`next` in deps) | `app/` or `pages/` |
| Remix (`@remix-run/*`) | `app/routes/` |
| React Router | `<Route>`, `createBrowserRouter`, route config |
| Vue Router | `router/index.ts` |
| SvelteKit | `src/routes/` |
| Nuxt | `pages/` |
| Static / vanilla | `index.html`, `*.html` |
| CLI tool | `bin/`, command definitions |
| Library | exported API surface, examples/, README usage |
| Backend-only | route definitions, API endpoints |

For each route/page/command, infer purpose from a quick read. As you draft each journey, you'll capture **how you learned it** in a one-line `Evidence:` summary -- not an exhaustive file index, just enough to point future runs at the right region.

**Monorepo check.** If `package.json` declares `workspaces`, or the repo has `apps/`, `packages/`, `pnpm-workspace.yaml`, or `turbo.json`, stop and ask the user which app `PRODUCT.md` should describe. One PRODUCT.md per consumer-facing app -- at the app's root, not the repo's root.

### Step 3: Live Browser Inspection (web apps only)

1. Check for a running dev server: `lsof -i :3000,5173,8080,4321,3001,8000` (or scan for vite/next/webpack output).
2. If a dev server is detected, navigate to it using your browser tool (Claude Code: Chrome MCP `mcp__claude-in-chrome__navigate`). If you have no browser tool, skip this step and note you have no visual context.
3. Screenshot each route relevant to a journey (landing, signup, core workflow, dashboard, settings, pricing).
4. Note visual state -- modals, empty states, conditional UI, animations -- that source code alone hides.
5. If no dev server is running, skip silently.

### Step 4 (ITERATE mode only): Diff Against Existing PRODUCT.md

#### Step 4a: Schema check & migration

Before diffing journeys, validate the existing `PRODUCT.md` matches the current schema:

- Front matter has `Last updated:` and `Journeys:` fields
- Top-level sections present: `## What this product is`, `## Target users`, `## Anti-goals`, `## User journeys`
- Each journey heading is sequentially numbered (`### 1. Title`, `### 2. Title`, ...) -- legacy un-numbered or `J#`-prefixed headings count as a migration
- Each journey uses the job-story format (`When ... want(s) to ... so ... can ...`)
- Each journey has an `**Evidence:**` line (legacy files may still have `**Source:**` -- treat as the same field and plan to rename it during this run)

If anything is missing, malformed, or in a legacy format, queue the structural change as a **MIGRATION** entry in the change set. Migrations are surfaced in Step 7c's change preview alongside content changes -- never silently rewritten. Common migrations: rename `Source:` -> `Evidence:`, renumber un-numbered or `J#`-prefixed headings to `### N. Title`, add a missing `## Anti-goals` section (with a single `(to be filled in)` bullet), reformat journeys that don't use the job-story shape.

#### Step 4b: Per-journey diff

For each journey in the existing PRODUCT.md:

- **Re-derive it from current code/UI** the same way you would in BASELINE-DERIVE. Use the journey's `Evidence:` line as a hint for where to look, but don't trust it as ground truth -- code may have moved.
- Compare the re-derived journey to what's written. If they match, mark **UNCHANGED**.
- If steps, outcome, or job-story have meaningfully shifted, mark **MAYBE-MODIFIED**.
- If the journey can't be re-derived at all (no code supports it anymore), mark **MAYBE-REMOVED**.

Then scan for journeys the codebase contains that PRODUCT.md does NOT:

- New routes, new commands, new exported APIs that don't appear in any existing journey -> **CANDIDATE-NEW**.

**Rename heuristic.** Before finalizing the change set, check for renames. If a `MAYBE-REMOVED` journey looks like a `CANDIDATE-NEW` flow under a different name (similar shape, similar component names, or `git log --follow --diff-filter=R` shows a rename in the same area), prefer to merge the two into a single `MODIFY` of the existing journey with an updated `Evidence:` line -- not a delete + add. When ambiguous, ask the user using descriptive titles, not journey numbers.

---

## Phase 2 -- Adaptive Interview

You are an interviewer, not an auditor. Ask only what the code cannot tell you. Ask with concrete, codebase-grounded options -- use your structured-question tool (e.g. `AskUserQuestion`) if you have one, otherwise lay out the options in plain prose.

### Step 5: Round 1 (always)

Ask 2-4 questions targeting gaps that block a good codex. Skip any question discovery already answered.

| Category | Example question |
|---|---|
| **Target user** | "Who is the primary user of [product]?" with options inferred from the codebase (e.g., "indie developers", "design teams", "operations folks") |
| **Primary job** | "What's the ONE thing a user must accomplish for the product to be valuable?" |
| **Anti-goals** | "What is this product deliberately NOT trying to be?" with options like "Not a project manager", "Not a chat app", "Not for enterprise" |
| **Stage** | "Is this in early prototype, active development, or shipped to users?" |

In ITERATE mode, also ask focused questions about the change set. Always use the journey's title in user-facing prose -- never `J3`, `J7`, or any internal numeric ID:

- For each `CANDIDATE-NEW` flow: "I see [file/route]. Is this a new journey, part of an existing one, or scaffolding I should ignore?"
- For each `MAYBE-REMOVED`: "The journey 'Invite teammate via SMS' looks gone -- I can't find code that supports it anymore. Remove it, mark it `(stale)`, or did it move somewhere I missed?"
- For each `MIGRATION`: "Your PRODUCT.md is missing the `## Anti-goals` section that the current `/lore` schema expects. Add it now (you'll be asked to fill it), or skip the migration this run?"

### Step 6: Round 2 (only if Round 1 surfaced major ambiguity)

Trigger a second batch ONLY when README is absent or unhelpful and Round 1 answers conflict with code signals, the user said "I'm not sure" twice or more, or multiple candidate journeys remain ambiguous. Otherwise, proceed to Phase 3 -- and respect "enough" if the user says move on.

---

## Phase 3 -- Draft or Diff

### Step 7a: BASELINE-EMPTY mode

Write a stub `PRODUCT.md` with section headers and short prompts inside each one explaining what to fill in later. Do NOT invent content. Tell the user: "Project is too early for journeys -- I left a stub. Run `/lore` again once you have routes or commands."

### Step 7b: BASELINE-DERIVE mode

1. **Re-check before drafting.** Confirm `PRODUCT.md` still does not exist at the project root. If it does (e.g., it was created during your session, or mode detection was overridden), abort BASELINE and switch to ITERATE mode.
2. Draft the full `PRODUCT.md` from discovery + interview answers. Use the format in **PRODUCT.md Template** below. (See Rules below for journey count -- match it to product complexity, not an arbitrary ceiling.)

### Step 7c: ITERATE mode -- Diff and Confirm

Produce a **change preview** (do not write to disk yet). Reference journeys by their **title**, not by `J#` -- the preview is something the user reads, so it should read naturally:

```
[MIGRATION] Schema upgrade
  Why: Existing PRODUCT.md uses legacy `Source:` field; current schema uses `Evidence:`.
  Action: Rename the field for all journeys. No content change.

[ADD] Export project as ZIP
  Why: New route detected at app/(app)/projects/[id]/export/page.tsx
  Job-story: When a user wants to back up their work, they want to download
             a ZIP of their project, so they can keep an offline copy.
  Steps: (preview)
  Evidence: New "Export" route under the projects area, plus a fresh helper in lib/export.

[MODIFY] Sign up & create first project
  Why: signup flow now requires email verification (recent commit added a verify step).
  Diff:
      4. Submits email + password
    + 5. Receives verification email and clicks confirm link
    (subsequent step numbers shift)

[REMOVE] Invite teammate via SMS
  Why: SMS invite code path is gone; no calls remain in the repo.

[KEEP] (4 journeys retained as-is): "Sign in", "Open a project",
       "Edit and save", "Share a read-only link"
```

Then ask the user to approve/reject each change (use your structured-question tool, e.g. `AskUserQuestion`), referencing the journey by title. Apply only what's approved. Never apply silently.

---

## Phase 4 -- Write & Verify

### Step 8: Write PRODUCT.md

Always at the project root: `PRODUCT.md`.

- **ITERATE mode:** use the Edit tool. Never use Write -- it would clobber any unrelated content (manual edits, comments).
- **BASELINE-DERIVE / BASELINE-EMPTY mode:** check absence one final time, then use the Write tool. If the file exists at this point, abort and switch to ITERATE.

### Step 9: Verify

1. Fetch today's date (`date +%Y-%m-%d` via Bash, or use the conversation's "Today's date" context). This goes into the front matter as the `Last updated:` value before writing in Step 8 -- never write the literal string `YYYY-MM-DD`.
2. Read the file back.
3. Confirm the front matter (`Last updated:` is today's date, `Journeys:` count matches the number of journey headings).
4. **Sequential numbering.** After any add / remove / reorder, renumber the journey headings as `### 1. Title`, `### 2. Title`, ... in document order. No gaps, no duplicates.
5. **Evidence sanity check.** For each journey's `Evidence:` line, spot-check any backticked file paths it mentions. If a referenced path doesn't exist:
   - **A peripheral path is broken** (one of several mentioned): rewrite the `Evidence:` line so it doesn't cite the missing file -- the journey itself is fine.
   - **The Evidence line points only to files that no longer exist:** the journey is orphaned. Surface to the user (via your structured-question tool, e.g. `AskUserQuestion`, using the journey's title): remove it, retain it with a `(stale)` marker in the title, or pause for manual fix.
6. Report a one-line summary to the user: "PRODUCT.md updated -- 6 journeys (1 added, 1 modified, 4 unchanged)."

---

## PRODUCT.md Template

```markdown
# Product Codex -- [Product Name]

> Last updated: <today's date, YYYY-MM-DD>
> Journeys: <count of journey headings below>

## What this product is

[One paragraph: what it does, who it's for, the core problem it solves.]

## Target users

- **[Persona name]** -- [one-line description and primary motivation]
- [Add 1-2 personas max. If single-persona, just one.]

## Anti-goals

What this product is deliberately NOT:

- [Anti-goal 1, e.g., "Not a replacement for full-fledged X"]
- [Anti-goal 2]
- [Anti-goal 3]

These exist to keep scope honest. If a feature drifts into anti-goal territory, that's a signal to reconsider.

## User journeys

Each journey is written as a job-story (motivation) plus concrete steps (mechanics). Headings are sequentially numbered (`1.`, `2.`, ...) for at-a-glance ordering -- re-number when journeys are added, removed, or reordered. An `Evidence:` line at the end says where the journey was learned from -- a one-line, human-readable summary, not an exhaustive file index.

---

### 1. [Short title -- e.g., "Sign in with Google or continue as a guest"]

**When** [trigger / context],
**[user] want(s) to** [action],
**so [they] can** [outcome].

**Steps:**
1. [Concrete step rooted in real UI / commands]
2. ...
3. ...

**Flow** *(optional -- include when the journey branches, loops, or hands off between actors; skip for purely linear flows)*:

```
/                  -> CTA "Get started"
                          |
                          v
/signup            -> [valid email?] -- no --> Inline error
                          | yes
                          v
/verify (email)    -> [confirmed?] -- no --> Resend prompt
                          | yes
                          v
/dashboard         -> empty-state CTA
```

**Outcome:** [What's true after the journey -- the user's new state]

**Evidence:** [One-line summary of where this was learned from -- e.g., "The signup-to-dashboard flow under `app/`, plus a screenshot of the empty dashboard state."]

---

### 2. [Next journey]

[...same shape...]

---
```

### Template variants for non-web projects

The main template above shows a web flow. For other project types, the shape is the same but the contents shift:

**CLI tool** -- `Steps:` are commands (with flags); `Evidence:` summarizes the entry script and command surface.

```markdown
### 1. Initialize a new project

**When** a developer wants to start a foo-cli project,
**they want to** scaffold the directory layout in one command,
**so they can** start editing immediately.

**Steps:**
1. Runs `foo init <name>`
2. Picks a template via interactive prompt
3. CLI writes files and prints next-steps

**Outcome:** Working scaffold in `<name>/`.

**Evidence:** The `init` command handler under `src/commands/`, plus the entry script in `bin/`.
```

**Library / SDK** -- `Steps:` are the typical API call sequence from a consumer's POV. `Evidence:` mentions the public-API surface and any example you read.

```markdown
### 1. Authenticate and fetch a record

**When** a consumer integrates foo-sdk into their app,
**they want to** authenticate once and read data,
**so they can** show it in their UI.

**Steps:**
1. `import { Client } from 'foo-sdk'`
2. `const client = new Client({ apiKey })`
3. `await client.records.get(id)`

**Outcome:** Has a typed record object.

**Evidence:** The exported `Client` and `records.get` API in `src/`, plus the basic example under `examples/`.
```

**Backend-only API** -- the "user" is the calling client. `Steps:` describe the request lifecycle (auth, validation, side effects, response). `Evidence:` mentions the route handler and any hot-path services it touches.

---

## Rules

- **One PRODUCT.md per repo (or per app, in monorepos).** At the project root. Never nest, never duplicate.
- **A journey is not a route.** A journey delivers user-visible value end-to-end. Skip 404 / error pages, health checks, OAuth callbacks (unless they're the entire signup story), admin-only debug views, scaffold or template routes that haven't been touched, and pages with no user-visible content. If you're unsure whether a route qualifies, ask.
- **Match count to complexity.** Don't impose an arbitrary ceiling. A landing page may have 1-2 journeys; a non-linear editor or rich SaaS may need 15+. Document every distinct user-visible value path; merge journeys that are actually variants of the same story.
- **One-line `Evidence:`, not a file index.** Each journey ends with a one-sentence summary of how you learned it -- the code area, screenshot, or doc. Specific file paths in backticks are welcome but not required, and they don't have to be exhaustive.
- **Don't invent journeys.** If the codebase doesn't support a journey, don't write one. The codex is what the product *does*, not what someone hopes it will do.
- **Anti-goals matter.** A product without explicit anti-goals drifts. Always ask, always include the section.
- **Speak in titles, not ordinals.** When asking the user about a journey, refer to it by its descriptive title ("the 'Sign in with Google or continue as a guest' journey"), not by its position number alone ("journey 3") or any legacy `J#` ID. The `N.` prefix in the heading is positional ordering for the reader -- it's fine in the doc, but in user-facing questions, lead with the meaning.
- **Respect "enough".** If the user says move on at any point during interview, move on.

---

## Integration with /drill

`/drill` reads `PRODUCT.md` (when present) during its context-gathering phase. This means:

- A plan that introduces a new feature is automatically compared against existing journeys -- `/drill` can ask, by title, "does this extend the 'Sign up & create first project' journey, or is it a new one?"
- A plan that touches files mentioned in a journey's `Evidence:` line (or files in the same code region) triggers `/drill` to ask about journey-level impact.

Keep `PRODUCT.md` accurate; `/drill` picks it up automatically.
