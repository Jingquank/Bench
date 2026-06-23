<!-- only:cursor -->
---
name: drill
description: Interview the user about their plan to flesh out details, clear ambiguity, suggest ideas, and surface unmade decisions. Gathers codebase and browser context to ask informed, project-specific questions. Use when the user says "drill", "drill down", "flesh out the plan", "review plan", or "finalize plan". Works in both plan mode and agent mode.
---
<!-- /only -->
<!-- only:claude -->
---
name: drill
description: Interview the user about their plan to flesh out details, clear ambiguity, suggest ideas, and surface unmade decisions. Gathers codebase and browser context to ask informed, project-specific questions. Use when the user says "drill", "drill down", "flesh out the plan", "review plan", or "finalize plan".
user-invocable: true
disable-model-invocation: true
argument-hint: [PLAN=<path-or-description>]
---
<!-- /only -->
<!-- only:codex -->
---
name: drill
description: Interview the user about their plan to flesh out details, clear ambiguity, suggest ideas, and surface unmade decisions. Gathers codebase and browser context to ask informed, project-specific questions. Use when the user says "drill", "drill down", "flesh out the plan", "review plan", or "finalize plan".
---
<!-- /only -->

# /drill -- Plan Interview

Read the current plan, gather context from the codebase and running app, then **ask the user a series of targeted questions** to turn a rough plan into a detailed, unambiguous spec ready for execution.

This is not a verification tool. The primary output is *questions and suggestions*. Context-gathering exists so those questions reference real files, real components, and real project state -- not generic hypotheticals.

---

## Phase 1 -- Gather Context

Do all of this silently. No user interaction yet.

### Step 1: Locate the Plan

Find and read the active plan:

<!-- only:cursor -->
1. Check `.cursor/plans/` in the workspace for `.plan.md` files. If multiple exist, pick the most recently modified one.
<!-- /only -->
<!-- only:claude,codex -->
1. If `$ARGUMENTS` specifies a plan path, use that directly. Otherwise, look in your environment's plans location for plan files (Claude Code: `~/.claude/plans/`), picking the most recently modified. If your environment has no standard plans directory, ask the user for the path or reconstruct the plan from the conversation.
<!-- /only -->
2. If no plan file exists, check whether the conversation history contains a plan (the assistant may have outlined one in a previous message). If so, reconstruct it.
3. If no plan exists at all, tell the user and stop: "No plan found. Create a plan first, then run /drill."

Read the full plan. Parse out:
- **Plan items**: the numbered steps, bullet points, or task descriptions
- **Referenced files**: any file paths, component names, function names, or API routes mentioned
- **Referenced dependencies**: any libraries, packages, or external services mentioned
- **Todos**: any todo items in the plan frontmatter

### Step 2: Map the Codebase

Use parallel explore subagents or direct tool calls to quickly gather:

1. **Project structure**: directory tree (top 2-3 levels), `src/` layout
2. **Key configs**: `package.json` (dependencies, scripts), `tsconfig.json`, framework configs (vite, next, webpack), `.env.example`
3. **Existing patterns**: scan for routers, state management, API layers, component libraries, utility hooks, shared types -- anything the plan might want to reuse or needs to be consistent with
4. **Design system**: check for CSS variables, Tailwind config, theme files, or design system skills
5. **Product codex**: if `LORE.md` exists at the project root, read it. Map plan items to existing journeys -- a plan that touches files cited in a journey's `Evidence:` line (or files in the same code region the journey describes) is likely modifying that journey; a plan that doesn't match any existing journey is likely introducing a new one. When asking journey-level questions, refer to journeys by their **title**, not by internal IDs: "Your plan touches `app/signup/page.tsx`, which sits inside the 'Sign up & create first project' journey -- does this change the user-visible flow, or is it a refactor?"

The goal is to understand what already exists so you can ask: "Did you know X is already in the codebase?" and "Your plan creates Y, but the project already does it this way -- should you match that pattern?"

### Step 3: Check Live State

<!-- only:cursor -->
1. Read terminal files in the terminals folder. Look for a running dev server (vite, next dev, webpack-dev-server, etc.).
<!-- /only -->
<!-- only:claude,codex -->
1. Check for a running dev server by examining common ports (e.g., `lsof -i :3000,5173,8080` or checking recent process output).
<!-- /only -->
2. If a dev server is running:
   - Identify the local URL (typically `http://localhost:PORT`)
   - Navigate to that URL using whatever browser tool you have (Cursor: in-editor preview; Claude Code: Chrome MCP `mcp__claude-in-chrome__navigate`). If you have no browser tool, skip the visual steps below and note you have no visual context.
   - Identify pages/routes that are relevant to the plan items
   - Navigate to each relevant page and take a screenshot
   - Note the current visual state: what's already built, what's missing, what the layout looks like
3. If no dev server is running, skip this step. Note that you have no visual context and move on.

### Step 4: Scan Dependencies

For each new library, package, or external service mentioned in the plan:

1. Use WebSearch to verify it exists, is actively maintained, and the version is reasonable
2. Check if the project already has a similar dependency installed (e.g., plan says "add axios" but `fetch` wrapper already exists, or plan says "add lodash" but the project uses `ramda`)
3. Note any findings -- these become questions or suggestions in Phase 2

---

## Phase 2 -- Interview the User

This is the core of the skill. You are an interviewer, not an auditor.

### Step 5: Label Plan Items

For each plan item, assign a confidence label:

| Label | Meaning | Action |
|---|---|---|
| **GREEN** | Fully specified, no ambiguity, references check out | No questions needed |
| **YELLOW** | Underspecified -- missing details, vague scope, or implicit assumptions | Ask clarifying questions |
| **RED** | Blocker -- contradicts codebase, references nonexistent files, has multiple valid interpretations, or missing a critical decision | Must resolve before execution |

Present the labeled plan to the user as a summary before asking questions. This gives them the full picture of where the gaps are.

**If all items are GREEN**, tell the user: "The plan is fully specified -- no ambiguities found. Ready to execute." Skip to Phase 3 and finalize without changes. Do not force questions when there are none to ask.

### Step 6: Ask Round 1 -- Big Picture

For YELLOW and RED items, ask questions that resolve high-level decisions. Use concrete options wherever possible -- don't make the user type freeform answers for things that have a finite set of choices.

**Question categories to cover:**

- **Scope**: "The plan says 'add auth.' Do you mean login/logout only, or also registration, password reset, and session management?"
- **Approach**: "There are two ways to do this -- X and Y. The project already uses pattern Z elsewhere. Which approach?"
- **Reuse**: "The plan creates a new utility, but `src/utils/formatDate.ts` already does something similar. Should we extend it or create a separate one?"
- **Missing pieces**: "The plan adds a new API route but doesn't mention error handling. What should happen on 404? On validation failure?"
- **Dependencies**: "The plan uses library X, but the project already has library Y which does the same thing. Use Y instead, or is there a reason to add X?"
- **Visual/UX**: Reference screenshots if available. "Looking at the current page, where should this new component go? Above the fold, in the sidebar, or as a modal?"

**Proactive suggestions:**

Don't just ask about what's in the plan. Suggest things the user might not have thought of:

- "I noticed the project has a `useDebounce` hook. The search feature in your plan could benefit from it."
- "The plan doesn't mention loading states. Should we add skeleton screens for the new data-fetching components?"
- "There's an existing color token system. Should the new component use `--color-accent` or introduce a new semantic color?"

### Step 7: Ask Round 2+ -- Details

Based on Round 1 answers, drill deeper. Each round should get more specific:

- **Round 2**: Component structure, data flow, state management, prop interfaces
- **Round 3**: Edge cases, error states, accessibility, performance considerations
- **Further rounds**: Only if new questions emerge from previous answers

**When to stop asking:**
- All plan items are GREEN
- The user says they're satisfied ("good enough", "let's go", "that's enough detail")
- You've done 3 rounds with no new RED or YELLOW items emerging

Between rounds, briefly summarize what was resolved and what's left. Don't re-ask questions the user already answered.

---

## Phase 3 -- Finalize

### Step 8: Update the Plan

<!-- only:cursor -->
**In plan mode** (a `.plan.md` file exists): edit the plan file in-place with:
<!-- /only -->
<!-- only:claude,codex -->
**In plan mode** (a plan file exists in your environment's plans location, e.g. `~/.claude/plans/`): edit the plan file in-place with:
<!-- /only -->

1. **Confidence labels**: Add GREEN/YELLOW/RED next to each item (all should be GREEN by now)
2. **Resolved details**: Inline the user's answers where they add specificity. For example, if the plan said "add auth" and the user chose JWT, update it to "add JWT-based authentication with refresh tokens"
3. **New todos**: If the interview surfaced additional work items (e.g., "we also need a migration script"), add them to the plan's todo list
4. **Accepted suggestions**: If the user accepted any proactive suggestions, add them as plan items or enrich existing ones
5. **Dependency decisions**: Record which libraries/approaches were chosen and why

Do NOT remove anything the user didn't ask to remove. Only add and refine.

After updating, present a brief summary of changes made to the plan.

<!-- only:cursor -->
**Outside plan mode** (no `.plan.md`, or the plan was only in conversation): present the same information as a structured summary in chat -- resolved decisions, new items, and dependency choices. The user can then create a plan from it or proceed directly.
<!-- /only -->
<!-- only:claude,codex -->
**Outside plan mode** (no plan file, or the plan was only in conversation): present the same information as a structured summary in chat -- resolved decisions, new items, and dependency choices. The user can then create a plan from it or proceed directly.
<!-- /only -->

---

## Rules

<!-- only:cursor -->
- **Never edit project files.** The plan file (`.plan.md`) is the sole exception -- editing it is allowed even when plan mode restricts other writes.
<!-- /only -->
<!-- only:claude,codex -->
- **Never edit project files.** The plan file (in your environment's plans location, e.g. `~/.claude/plans/`) is the sole exception -- editing it is allowed even when plan mode restricts other writes.
<!-- /only -->
- **Always ask with concrete options** when a question has a finite set of valid answers -- use your structured-question tool if you have one (e.g. `AskUserQuestion`), otherwise lay out the numbered options in plain prose. Freeform is fine for open-ended "what should this look like?" questions.
- **Reference real code.** Every question should cite a file path, component name, or dependency when relevant. Don't ask "how should auth work?" -- ask "the project uses Express with `cookie-session` (from `package.json`). Should auth use the existing session middleware or switch to JWT?"
- **Don't ask more than 3-5 questions per round.** Batch related questions. Too many at once overwhelms the user.
- **Don't repeat yourself.** Track what's been answered. Never re-ask a resolved question.
- **Suggest, don't prescribe.** Frame ideas as options, not directives. "Have you considered X?" not "You should do X."
- **Respect "good enough."** If the user wants to move on, stop drilling and finalize with what you have.
- **No generic questions.** Every question must be grounded in something specific: a file you read, a pattern you found, a screenshot you took, or a dependency you checked. If you can't ground a question, don't ask it.
