<!-- only:cursor -->
---
name: realitycheck
description: Review a project, form first-principles hypotheses about product-market fit, and generate Likert-scale questionnaires to validate or falsify them. Brutally honest, zero confirmation bias. Use when the user says "reality check", "realitycheck", "user test", "questionnaire", "survey my users", or "test my assumptions".
---
<!-- /only -->
<!-- only:claude -->
---
name: realitycheck
description: Review a project, form first-principles hypotheses about product-market fit, and generate Likert-scale questionnaires to validate or falsify them. Brutally honest, zero confirmation bias. Use when the user says "reality check", "realitycheck", "user test", "questionnaire", "survey my users", or "test my assumptions".
user-invocable: true
disable-model-invocation: false
argument-hint: [FOCUS=<area-or-hypothesis>]
---
<!-- /only -->
<!-- only:codex -->
---
name: realitycheck
description: Review a project, form first-principles hypotheses about product-market fit, and generate Likert-scale questionnaires to validate or falsify them. Brutally honest, zero confirmation bias. Use when the user says "reality check", "realitycheck", "user test", "questionnaire", "survey my users", or "test my assumptions".
---
<!-- /only -->

# /realitycheck -- Product Hypothesis Questionnaire Generator

Review a project's codebase, interview the developer, form brutally honest hypotheses about the product, and generate a Likert-scale questionnaire to validate or falsify them.

This is not a cheerleading tool. The goal is to surface the assumptions most likely to be wrong and craft questions that expose the truth. Think first principles. Think Steve Jobs. Be specific, be honest, be useful.

---

## Phase 0 -- Scope & Project Type

Before any discovery, establish what you're checking and how deep to go.

### Step 0a: Confirm Scope

If `$ARGUMENTS` specifies a focus area (e.g., `/realitycheck onboarding`), use it as the scope and skip to Step 0b.

If no focus is specified, ask (via your structured-question tool, e.g. `AskUserQuestion`):
- "What would you like to reality check?" with options:
  - "The entire product"
  - "Onboarding / first-run experience"
  - "Core workflow / main feature"
  - "Pricing & monetization"
  - (Other — freeform)

### Step 0b: Detect Project Type

Do a quick scan of the codebase (route count, auth presence, test coverage, git history depth) to infer project type:

- **Landing page** — single `index.html` or 1-2 routes, no auth, no data layer
- **Quick demo / prototype** — few routes, minimal error handling, no tests, recent git history
- **Full product** — multiple routes, auth, data layer, tests, mature git history

Present the inferred type to the user for confirmation. Project type drives the entire strategy:

| Project type | Hypothesis focus | Question count | Interview depth |
|---|---|---|---|
| **Landing page** | First impression, value prop clarity, CTA effectiveness | 8-12 questions | 1 round max |
| **Quick demo** | Value prop, usability of core flow, "should this exist" | 12-16 questions | 2 rounds |
| **Full product** | Full spectrum (see hypothesis categories below) | 15-20 questions | 2-3 rounds |

---

## Phase 1 -- Silent Discovery

Do all of this silently. No user interaction yet. Use parallel explore subagents or direct tool calls to gather Steps 1-4 simultaneously where possible (e.g., read README and scan routes in parallel).

### Step 1: Identify the Product

Read these files in priority order to build a picture of what this product is and who it's for:

| Source | What to extract |
|---|---|
| `README.md`, `README.*` | Product name, purpose, target audience, key features, value proposition |
| `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` | `description`, `keywords`, dependencies (domain signals: Stripe = payments, SendGrid = email, Prisma = database-backed app) |
| `.env.example` / `.env.local.example` | Third-party integrations, API keys that reveal services used |
| `docs/` directory | PRDs, specs, architecture docs, user guides |
| Plan files (e.g. `~/.claude/plans/`, `.cursor/plans/`) | Active plans reveal what the team is building next |
| `CLAUDE.md` / `AGENTS.md` / project config files | Project conventions, team context |

**Output (internal):** One paragraph describing the product, who it's for, and what problem it solves.

### Step 2: Map Core User Flows

Detect the project's framework and scan for user-facing flows:

| Framework signal | Where to look |
|---|---|
| Next.js (`next` in deps) | `app/` or `pages/` directory -- each file/folder is a route |
| Remix (`@remix-run/*`) | `app/routes/` |
| React Router (`react-router`) | Search for `<Route`, `createBrowserRouter`, route config files |
| Vue Router (`vue-router`) | `router/index.ts` or `router.js` |
| SvelteKit (`@sveltejs/kit`) | `src/routes/` |
| Nuxt (`nuxt`) | `pages/` directory |
| Static / vanilla | `index.html`, `*.html` files |
| Backend-only (Express, FastAPI, Django, etc.) | Route definitions, API endpoint files, CLI entry points |
| CLI tool | `bin/`, main entry point, command definitions |
| Library | Exported API surface, examples/, README usage section |

For each discovered route/page/endpoint:
- Record the path and infer its purpose from naming (e.g., `/pricing` = monetization, `/dashboard` = core value, `/settings` = retention, `/onboarding` = first-run)
- For key pages, read the component to understand what the user does there
- Identify the **critical path**: signup -> core action -> value delivery -> retention loop

For monorepos (detected via `workspaces` in package.json, `apps/` or `packages/` directories, `pnpm-workspace.yaml`): ask the user which app to focus on before proceeding.

**Output (internal):** Ordered list of screens/routes/endpoints with purpose labels.

### Step 3: Detect Product Stage (Full Products Only)

Skip this step for landing pages and quick demos — project type from Step 0b is sufficient. For full products, use these heuristic signals to sub-classify:

| Signal | MVP | Growth | Mature |
|---|---|---|---|
| Number of routes/pages | 1-5 | 6-20 | 20+ |
| Auth system | None or basic | Full (OAuth, roles) | Enterprise (SSO, RBAC) |
| Analytics integration | None | Basic (GA, Mixpanel) | Full stack (segments, funnels, A/B) |
| Payment integration | None | Simple (one plan) | Complex (tiers, trials, usage-based) |
| Error handling | Minimal | Structured | Comprehensive (Sentry, error boundaries) |
| Test coverage | None/sparse | Some | Extensive |
| i18n | None | None or 1 extra locale | Multiple locales |
| Git history depth | Weeks | Months | Years |

Product stage drives hypothesis count and category priorities:
- **MVP** -> focus on existential questions (value prop, problem severity)
- **Growth** -> focus on usability, retention, differentiation
- **Mature** -> full spectrum analysis

**Output (internal):** Stage classification with confidence level and reasoning.

### Step 4: Identify UX Decisions

Scan for deliberate UX choices that become hypothesis material:

- **Onboarding**: Is there a first-run experience? How many steps? What does it ask?
- **Empty states**: What do users see before they have data?
- **Error handling**: How does the product communicate failures?
- **Pricing**: How is it structured? Is there a free tier? Is there a comparison table?
- **CTAs**: What's the primary call-to-action? Where is it placed? What does it say?
- **Feature gating**: Is anything locked behind signup, payment, or usage limits?
- **Social proof**: Testimonials, logos, metrics, case studies?
- **Trust signals**: Privacy policy, security badges, data handling transparency?

Note what is **present** and what is **conspicuously absent**. Absence is often more revealing than presence.

### Step 5: Check for Live App (Optional)

1. Check for a running dev server: `lsof -i :3000,5173,8080,4321,3001,8000`
2. If a dev server is detected, ask the user:

   > "Dev server found at `localhost:PORT`. Want me to screenshot key pages to ground the analysis in what users actually see? This helps me form more specific hypotheses."

3. If the user says yes:
   - Navigate to key routes using your browser tool (Claude Code: Chrome MCP `mcp__claude-in-chrome__navigate`); if you have no browser tool, skip screenshots and proceed with code-only context
   - Take screenshots of pages relevant to the critical path
   - Note the visual state: what's polished, what's rough, what's missing
4. If the user says no, or no dev server is running: skip, proceed with code-only context.

---

## Phase 2 -- User Interview

You are an interviewer gathering intel, not an auditor checking boxes. Ask only what the code cannot tell you. Ask with concrete options wherever possible -- use your structured-question tool (e.g. `AskUserQuestion`) if you have one, otherwise ask in plain prose.

### Step 6: Present Discovery Summary

Show the user what you found:

1. **Product summary** -- one paragraph, your understanding of what this product does and for whom
2. **Core flows detected** -- bulleted list of routes/pages with inferred purpose
3. **Stage assessment** -- MVP / Growth / Mature, with 2-3 bullet points of reasoning
4. **Knowledge gaps** -- explicitly state what you could NOT determine from the codebase

Ask the user to confirm or correct the summary. Do not proceed until they do.

### Step 7: Round 1 -- Strategic Questions

Ask 3-5 questions targeting information that CANNOT be inferred from code. Skip any question the codebase already answers.

| Category | Example question |
|---|---|
| **Target user** | "Who is your primary user?" with options inferred from the codebase (e.g., "developers", "small business owners", "content creators") |
| **Problem severity** | "How painful is the problem you solve?" with options: "Hair-on-fire / Important but not urgent / Nice-to-have" |
| **Competitive landscape** | "What do users use today instead of your product?" with options: "Spreadsheets / Competitor X / Nothing / Manual process" |
| **Current validation** | "Have real users used this product?" with options: "Yes, paying customers / Yes, beta users / Not yet" |
| **Key concern** | "What are you most uncertain about?" with options: "Whether users want this / Whether they can use it / Whether they'll come back / Whether they'll pay" |

Between rounds, briefly summarize what was resolved and what questions remain. Do not re-ask questions the user already answered.

### Step 8: Round 2 -- Tactical Questions

Based on Round 1 answers, drill deeper into the user's area of uncertainty:

- If uncertain about **value prop**: "What is the single most important thing a user should accomplish in their first session?"
- If uncertain about **usability**: "Which flow do you think is most confusing right now?"
- If uncertain about **retention**: "What would bring a user back tomorrow? Next week?"
- If uncertain about **trust**: "What would make a new user hesitate to sign up?"
- If uncertain about **monetization**: "What would a user need to experience before they'd pay?"

### Step 9: Round 3

Only if Round 2 surfaced new ambiguity. Otherwise, move to Phase 3. If the user says "enough" or "let's move on" at any point, respect it and proceed.

---

## Phase 3 -- Hypothesis Formation

This is the analytical core. You are a skeptic, not a cheerleader.

### Step 10: Generate Hypotheses

Form hypotheses ranked by impact (most critical first). Count and focus are driven by project type (from Step 0b) and product stage (from Step 3):

| Project type | Hypothesis count | Focus |
|---|---|---|
| Landing page | 3-4 | First impression, value prop, CTA |
| Quick demo | 4-6 | Value prop, core flow usability, "should this exist" |
| Full product (MVP) | 3-5 | Existential questions |
| Full product (Growth) | 5-7 | Usability, retention, differentiation |
| Full product (Mature) | 6-8 | Full spectrum |

Draw from these categories as appropriate:

| Category | What it tests | When to prioritize |
|---|---|---|
| **Value Proposition** | Does the product solve a real, painful problem? | MVP |
| **First Impression** | Does the product communicate its value on first contact? | Always |
| **Usability** | Can users accomplish core tasks without help? | Growth |
| **Trust** | Do users feel safe using this product? | Products handling data/payments |
| **Willingness to Pay** | Is there real monetization potential? | Pre-monetization |
| **Retention** | Will users come back unprompted? | Growth / Mature |
| **Differentiation** | Why this over the alternatives? | Competitive markets |
| **Friction** | What blocks adoption or activation? | Complex signup/onboarding |
| **Feature Priority** | Are you building what users actually want? | Growth / Mature |
| **Emotional Response** | How does using the product feel? | Always |

**Brutal honesty rules:**

- **Include at least one hypothesis the user probably does NOT want tested.** If every hypothesis confirms their worldview, you failed.
- **For MVPs, include one about whether the product should exist at all.** Example: "Users experience the problem [product] solves frequently enough to seek a dedicated solution."
- **Frame everything as falsifiable.** "Users believe X" not "X is true." Every hypothesis must be testable by a Likert question.
- **Never design hypotheses to confirm.** Design them to challenge. The most valuable hypothesis is the one that, if falsified, changes the product direction.
- **Be brutally specific.** Don't say "the onboarding might be confusing." Say "You assume users understand what [product] does from the landing page hero copy, but the hero says '[actual copy from code]' which doesn't name the problem or the user." Cite files, pages, copy, missing elements.
- **Name the blind spot.** Each hypothesis should call out a specific assumption the founder is making, grounded in evidence from the codebase. "You assume X, but [evidence suggests otherwise]."

### Step 11: Present Hypotheses

Present each hypothesis as a detailed card, ranked by impact (most critical first):

```
## Hypothesis 1: [Short title]
**Category:** [Value Proposition / Usability / Trust / etc.]

**Statement:** [The falsifiable hypothesis in one sentence]

**Why it matters:** [What's at stake if this is wrong -- in one sentence]

**What it challenges:** [The specific blind spot, with codebase evidence.
E.g., "You assume users understand your pricing model, but the pricing
page (src/app/pricing/page.tsx) has no comparison table, no FAQ, and
the CTA says 'Get Started' without naming the price."]

**Impact rank:** [Why this hypothesis is positioned where it is --
what makes it more critical than the ones below it]
```

After presenting all hypotheses, ask the user to:
- Approve the list
- Remove any they don't want tested
- Add any they think are missing
- Reorder if they disagree with the ranking

Only proceed to Phase 4 after the user approves.

---

## Phase 4 -- Questionnaire Generation

### Step 12: Generate Likert-Scale Questions

**Scale:** 5-point by default. 7-point only if the user explicitly requests it.

```
1 = Strongly Disagree
2 = Disagree
3 = Neither Agree nor Disagree
4 = Agree
5 = Strongly Agree
```

**Per hypothesis: 2-3 questions:**
- One **direct** statement (e.g., "I understood what [product] does within the first 10 seconds.")
- One **reverse-coded** statement (e.g., "I found it difficult to understand the purpose of [product].")
- One **behavioral** statement (e.g., "I would use [product] again next week.")

**Total target: 15-20 Likert questions.** Never exceed 25. Survey fatigue destroys data quality.

**At least 25% of questions must be reverse-coded** to counter acquiescence bias (the tendency to agree with any statement). Reverse-coded means the statement is phrased in the **opposite direction** of the hypothesis, AND the score is **inverted** during analysis (score = 6 - response for 5-point). Example: if the hypothesis is "users find the product easy to use", a direct question is "I found [product] easy to use" and a reverse-coded question is "I struggled to complete basic tasks in [product]" (scored inversely).

**2-3 open-ended questions at the end:**
- "What was the most confusing part of using [product]?"
- "What would you change first?"
- "Is there anything you expected to find but didn't?"

**Question ordering rule:** Reorder questions by **emotional weight**, NOT by hypothesis grouping. Respondents should warm up before facing challenging questions:

1. First impressions and comprehension (low threat)
2. Usability and task completion (moderate)
3. Trust and emotional response (moderate-high)
4. Willingness to pay and retention intent (high)
5. "Should this exist" and differentiation (highest)

Never lead with the uncomfortable hypothesis.

### Anti-Patterns (enforce on every question)

| Anti-pattern | Rule | Bad | Good |
|---|---|---|---|
| **Leading** | No value-laden words | "How amazing was the onboarding?" | "The onboarding process was easy to follow." |
| **Double-barreled** | One concept per question | "The app is fast and easy to use." | Split into two separate questions |
| **Acquiescence bias** | Mix positive and negative framing | All positive statements | Include reverse-coded items throughout |
| **Jargon** | Use respondent language, not product language | "The API latency was acceptable." | "The app responded quickly when I performed actions." |
| **Absolutes** | Avoid always/never | "I always know where to click." | "I generally knew where to click next." |
| **Social desirability** | Test behavior, not loyalty | "I would recommend this to friends." | "I would use this product again next week." |
| **Generic placeholders** | Reference real product elements | "The feature was useful." | "The [specific feature name from codebase] helped me accomplish [specific task]." |
| **Ceiling/floor effect** | Avoid questions 90% of users will answer the same way | "I was able to open the app." | "I was able to complete [specific non-trivial task] without help." |
| **Recency bias** | Don't ask about overall experience right after a frustrating flow | Overall satisfaction after a confusing task | Place general satisfaction questions before task-specific ones |

**Self-check before output:** Read every generated question and verify it passes all nine anti-pattern checks. If any question fails, rewrite it before including it.

### Step 13: Output

**Check for a Notion integration** (e.g. Notion MCP) by attempting a Notion search tool or checking your available tools. If your environment has no Notion integration, skip straight to the Markdown fallback below.

#### Primary: Notion Page

If a Notion integration (e.g. Notion MCP) is connected:

**Step A: Choose parent page.** Always confirm with the user before creating.

1. Search Notion for previous reality check pages: `mcp__claude_ai_Notion__notion-search` with query "Reality Check".
2. Always ask (via your structured-question tool, e.g. `AskUserQuestion`), but tailor the options:
   - **If prior reality check pages found:** Recommend the same parent as the most recent one (mark as "Recommended"), plus 1-2 other options and workspace root.
   - **If no prior pages found (first run):** Suggest 2-3 relevant parent pages from a broader search, plus workspace root.
   - **If search returns 0 results at all:** Offer workspace root as the only option, let user specify via "Other".
3. Only create the page after the user confirms.

**Step B: Create the page.**

Content passed to `mcp__claude_ai_Notion__notion-create-pages` must be **Notion-flavored Markdown**, not standard Markdown. Pass `parent.page_id` to nest the page under the user's chosen location.

**Page title:** "[Product Name] Reality Check -- [Date]"

**Sections:**

1. **Product Context**
   - One-paragraph product summary
   - Stage assessment
   - Key findings from discovery

2. **Hypotheses**
   - Each hypothesis as a card (same format as Step 11)
   - Ranked by impact

3. **Questionnaire**
   - Introduction text (2-3 sentences explaining the purpose, emphasizing honesty, promising anonymity)
   - Numbered Likert questions ordered by emotional weight
   - Each question tagged with its hypothesis number and whether it's reverse-coded
   - Scale anchors displayed once at the top
   - Open-ended questions at the end

4. **Scoring Guide**
   - Table mapping each question to its hypothesis
   - Which questions are reverse-coded (score = 6 - response for 5-point scale)
   - How to calculate per-hypothesis average score
   - Overall product-market fit score (average of all hypothesis scores)

5. **Decision Framework**
   - For each hypothesis: "If average score is below 3.0, consider [specific action based on what the hypothesis tests]"
   - Traffic light summary: which hypotheses are most at risk based on the product's current state

**Step C: Handle failure.** If the Notion MCP call fails (error response, timeout, or partial creation), fall back to the markdown file output. Do not retry automatically — inform the user of the failure and offer the markdown alternative.

#### Fallback: Markdown File

If Notion MCP is not available or the Notion call failed, save as `realitycheck-[product-name]-[date].md` in the project root using this structure:

```markdown
# [Product Name] Reality Check -- [Date]

## Product Context
[One-paragraph summary, stage assessment, key findings]

## Hypotheses

### Hypothesis 1: [Title]
- **Category:** [...]
- **Statement:** [...]
- **Why it matters:** [...]
- **What it challenges:** [...]

[Repeat for each hypothesis]

## Questionnaire

**Scale:** 1 = Strongly Disagree, 2 = Disagree, 3 = Neither, 4 = Agree, 5 = Strongly Agree

| # | Question | Hypothesis | Reverse-coded? |
|---|----------|------------|----------------|
| 1 | [Question text] | H1 | No |
| 2 | [Question text] | H1 | Yes |
| ... | ... | ... | ... |

### Open-Ended
1. [Question]
2. [Question]

## Scoring Guide

| Hypothesis | Questions | Reverse-coded | Score formula |
|------------|-----------|---------------|---------------|
| H1: [Title] | Q1, Q2, Q3 | Q2 | Avg(Q1, (6-Q2), Q3) |
| ... | ... | ... | ... |

**Overall PMF score:** Average of all hypothesis scores

## Decision Framework

| Hypothesis | If avg < 3.0, consider... |
|------------|---------------------------|
| H1: [Title] | [Specific action] |
| ... | ... |
```

Tell the user: "Saved as markdown. Connect the Notion integration for richer output next time."

### Step 14: Verify Output

This step is mandatory. Do not skip it.

1. **If Notion:** Use `mcp__claude_ai_Notion__notion-fetch` with the created page ID to verify it exists and the content rendered correctly. Report the Notion page URL to the user.
2. **If markdown:** Read the generated file to confirm it was written correctly.
3. Only report done after verification passes.

---

## Rules

- **Hypotheses before questions.** Never generate questions without forming and presenting hypotheses first.
- **Never skip the interview.** Code alone cannot tell you who users are or what they care about.
- **At least one uncomfortable hypothesis.** If every hypothesis confirms the user's worldview, you failed.
- **Present hypotheses for approval** before generating questions. The user must approve what you're testing.
- **Respect the user's choices.** If they remove a hypothesis, don't sneak it back in through a question.
- **Don't ask what the codebase already answers.** If README names the target user, don't re-ask.
- **Be brutally specific.** Cite files, pages, copy, and missing elements. "You assume X, but [evidence]."
- **Match interview depth to project type.** Landing pages get 1 round; demos get 2; full products get up to 3. Respect "enough."
- **Enforce all nine anti-patterns** from the Anti-Patterns table on every question before output.
- **Never overwrite a previous reality check.** Create a new page/file with the date in the title.
- **Always confirm the Notion parent page** with the user before creating.
