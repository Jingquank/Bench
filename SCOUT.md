<!-- only:cursor -->
---
name: scout
description: Discover the unknowns in a task before, during, and after implementation -- blind spot passes, brainstorms and prototypes, interviews, reference hunting, implementation plans and notes, pitches, and comprehension quizzes, routed by where the unknowns hide. Use when the user says "scout", "blindspot", "blind spot pass", "unknown unknowns", "find my unknowns", or "what am I missing".
---
<!-- /only -->
<!-- only:claude -->
---
name: scout
description: Discover the unknowns in a task before, during, and after implementation -- blind spot passes, brainstorms and prototypes, interviews, reference hunting, implementation plans and notes, pitches, and comprehension quizzes, routed by where the unknowns hide. Use when the user says "scout", "blindspot", "blind spot pass", "unknown unknowns", "find my unknowns", or "what am I missing".
user-invocable: true
disable-model-invocation: true
argument-hint: [MODE=blindspot|brainstorm|interview|reference|plan|notes|pitch|quiz | <description>]
---
<!-- /only -->
<!-- only:codex -->
---
name: scout
description: Discover the unknowns in a task before, during, and after implementation -- blind spot passes, brainstorms and prototypes, interviews, reference hunting, implementation plans and notes, pitches, and comprehension quizzes, routed by where the unknowns hide. Use when the user says "scout", "blindspot", "blind spot pass", "unknown unknowns", "find my unknowns", or "what am I missing".
---
<!-- /only -->

# /scout -- Unknowns Discovery

The map is not the territory. The prompt, plan, and context the user gives you
are the **map**; the codebase and its real constraints are the **territory**.
The gap between them is the user's **unknowns** -- and the quality of agentic
work is bottlenecked by how well those unknowns get clarified. Scout's job is
to find them while they are still cheap to fix.

Scout is a **router**, not a single technique. It diagnoses where the user's
unknowns hide, picks the right discovery technique for that spot, runs it, and
records what was learned so the next run starts with a better map.

## Invocation

<!-- only:cursor -->
**Check the user's message** for a mode word or a problem description.
<!-- /only -->
<!-- only:claude,codex -->
**Check `$ARGUMENTS`** (and the user's message) for a mode or a problem description.
<!-- /only -->

- `MODE=<technique>` (or a bare technique word: `blindspot`, `brainstorm`,
  `interview`, `reference`, `plan`, `notes`, `pitch`, `quiz`) --> skip diagnosis,
  run that technique's playbook section directly. Still do Phase 1 first --
  every technique needs the starting point.
- **A free-text problem description** --> run all phases against that problem.
- **Nothing** --> run all phases against the project's current state.

## Phase 1 -- Gather the Starting Point

The single most important input is the user's starting point: what they know,
what they don't, and where they are in their thinking. Gather it from two
sides.

**From the project (silently):**

1. Read `docs/scout-log.md` if it exists -- what previous scout runs already
   resolved. Never re-ask what the log answers.
2. Check working state: current git diff/status, an `implementation-notes.md`
   if present, recent artifacts in `docs/scout/`.
3. Read `LORE.md` at the project root if it exists -- journeys and anti-goals
   frame which unknowns matter.
4. Skim the areas of the codebase the problem touches -- enough to ground
   questions in real files, not hypotheticals.

**From the user (interactively):**

Interview them about their starting point. Ask as many questions as the
diagnosis actually needs -- there is no fixed cap -- but every question must
earn its place; stop when you can classify their unknowns. Cover:

- Where are they in the lifecycle -- about to start, mid-build, or done and
  reviewing?
- How well do they know this part of the codebase? This problem domain?
- What have they explicitly not figured out yet?
- Is there taste involved -- criteria they would only recognize on sight?
- What does "good" look like, and do they know how good this can be?

Use your structured-question tool if you have one (e.g. `AskUserQuestion`);
otherwise ask in plain prose with concrete options.

## Phase 2 -- Diagnose and Route

Read `references/taxonomy.md`. Classify where the dominant unknowns sit across
the four quadrants (known knowns, known unknowns, unknown knowns, unknown
unknowns) and which lifecycle stage applies. Then recommend **one technique**
(or a short sequence) from the routing table and say why in a sentence or two,
citing what you learned in Phase 1.

If a `MODE` was given, skip the recommendation and go straight to Phase 3 --
but if Phase 1 revealed the chosen mode is clearly wrong for where the
unknowns actually are, say so before proceeding and let the user decide.

Wait for the user to confirm the route before running it.

## Phase 3 -- Run the Technique

Read the matching section of `references/playbook.md` and follow its
procedure. The playbook defines, per technique: what to gather first, the
steps, the output, and when to hand off instead.

**Visual outputs** (blindspot reports, brainstorm directions, plans, pitches,
quizzes) are built on `assets/scout-artifact.html` -- a self-contained,
theme-aware shell. Write finished artifacts to `docs/scout/` (e.g.
`docs/scout/blindspot-auth.html`) and open or present them to the user.

## Phase 4 -- Close the Loop

What was learned becomes the map for next time.

1. Append durable learnings to `docs/scout-log.md` (create it with a one-line
   header if missing). Log only what changes future behavior: resolved
   unknowns and the decision made, plan deviations and why, quiz questions the
   user missed, references adopted. One dated bullet per learning -- terse,
   append-only, newest last.
2. Tell the user the natural next move: a brainstorm usually feeds an
   interview or a plan; a plan feeds implementation with notes; a big diff
   feeds a quiz; a passed quiz feeds a pitch.

## The Scout Log

`docs/scout-log.md` is scout's memory. Format:

```markdown
# Scout log -- learnings that shape the next map

- 2026-07-05 · blindspot(auth): session middleware already handles refresh;
  plans must not add a second token store.
- 2026-07-05 · quiz(checkout-diff): missed that tax is computed server-side --
  read `src/api/tax.ts` before touching totals.
```

Read it at the start of every run. Never rewrite or delete entries; only
append.

## Relationship to Other Bench Skills

- **`/drill`** is the rigorous plan audit -- GREEN/YELLOW/RED labels,
  plan-mode aware. Scout's `plan` technique is lighter-weight ideation; when
  the user has a full plan that needs a line-by-line review before coding,
  hand off to `/drill`.
- **`/lore`** maintains the product codex. Scout reads `LORE.md` for context
  but never writes it -- product lore belongs to `/lore`, process learnings to
  the scout log.
- **`/writereport`** turns documents into polished editorial reports. A scout
  pitch is a working artifact; if the user wants a publication-grade document,
  suggest `/writereport`.

## Rules

- **Route first.** Never launch into a technique before Phase 1 and 2 --
  running the wrong technique wastes more than it finds. The only exception is
  an explicit `MODE`.
- **Ground every question.** Cite a file, a diff, a log entry, or something
  the user said. If you can't ground it, don't ask it.
- **Never edit product source files.** Scout writes only `docs/scout-log.md`,
  `docs/scout/*` artifacts, and (during the notes technique)
  `implementation-notes.md`. Implementation belongs to a normal session that
  consumes scout's artifacts.
- **Artifacts are self-contained.** Inline all CSS/JS in generated HTML; no
  CDNs, no external fonts, no build step. They must open from a double-click.
- **Suggest, don't prescribe.** Frame findings as options with trade-offs.
  The user owns the map.
- **Respect "good enough."** When the user wants to move on, close the loop
  and stop.
