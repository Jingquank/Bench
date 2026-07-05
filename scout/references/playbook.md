# The Scout Playbook -- how to run each technique

One section per technique. Each follows the same shape: **Targets** (which
quadrant it addresses, per `taxonomy.md`) · **Reach for it when** · **Gather
first** · **Procedure** · **Output** · **Hand off / anti-patterns** · **Example
prompts** (the kind of ask that should land here).

Shared conventions:

- Visual outputs build on `assets/scout-artifact.html` -- copy the shell,
  replace the `<main>` content, keep the token block and theme toggle intact.
  Write to `docs/scout/<technique>-<topic>.html`.
- Every artifact ends with a footer noting what it fed (log entries appended,
  suggested next move).
- Log durable learnings per SKILL.md Phase 4 after every technique.

---

## 1. Blind Spot Pass

**Targets:** unknown unknowns.

**Reach for it when** the user is entering a new domain or an unfamiliar part
of the codebase, can't say what "good" looks like, or literally asks "what am
I missing?" / "blindspot pass".

**Gather first:** who the user is and what they already know (Phase 1 covers
this); the domain or code area in question; how deep they want to go
(orientation vs. mastery).

**Procedure:**

1. Sweep the territory: search the relevant code area, its history (past
   approaches, reverted attempts), its tests, and -- when the domain is
   general knowledge (e.g. color grading, auth flows) -- the web.
2. Build the blind spot inventory. For each item: what it is, why the user
   couldn't have known to ask about it, and what it changes about their task.
   Prioritize by impact on the stated problem.
3. Teach, don't just list. For each blind spot give the minimum concept needed
   to reason about it, grounded in this project's files.
4. Convert: end with the questions the user should now be asking -- their new
   known unknowns -- and which technique handles each.

**Output:** a blindspot report artifact -- inventory ordered by impact, a
"what good looks like" section for the domain, and the converted question
list. Small passes can stay in chat.

**Hand off / anti-patterns:** don't run this on a domain the user knows well
-- it produces a lecture, not discovery. If the pass surfaces mostly taste
questions, route to Brainstorm next. Don't fabricate blind spots to fill a
report; three real ones beat ten padded ones.

**Example prompts:**

- "I'm adding a new auth provider but know nothing about the auth modules in
  this codebase. Do a blindspot pass so I can prompt you better."
- "I don't know what color grading is but I need to grade this video. Teach me
  my unknown unknowns so I can prompt better."

---

## 2. Brainstorm & Prototype

**Targets:** unknown knowns -- criteria the user only recognizes on sight.

**Reach for it when** taste is involved (visual design, UX, tone), the user
says "I'll know it when I see it", or scope is unsettled and reacting to
options beats specifying up front. Also the default opener for a new project:
a brainstorm sets scope with intent, preventing both too-narrow and too-wide.

**Gather first:** the rough problem; any references they already like; hard
constraints (brand, stack, budget); how divergent to go.

**Procedure:**

1. Generate genuinely different directions -- 3 to 5 that differ in kind, not
   in shade. For visual work, wildly different designs; for approaches, range
   from cheapest to most ambitious.
2. Prototype before wiring: mock with fake data, no backend, no state -- the
   point is reacting to the shape, not building it. One artifact showing all
   directions side by side (or one section per direction).
3. Collect reactions direction by direction: what pulls, what repels, and --
   most valuable -- *why*. The "why" verbalizes the unknown known; write it
   down in the user's words.
4. Synthesize: restate the discovered criteria as explicit requirements the
   user can now prompt with.

**Output:** a directions artifact plus the verbalized criteria list (chat or
log). The criteria are the real deliverable; the mocks are scaffolding.

**Hand off / anti-patterns:** don't polish prototypes -- fidelity beyond
"reactable" is waste. Don't converge after one round if reactions were mixed;
iterate on the pulled direction. When criteria are verbalized, hand to
Interview or Implementation Plan.

**Example prompts:**

- "I want a dashboard for this data but no visual taste -- make me an HTML
  page with 4 wildly different design directions so I can react."
- "Before wiring anything up, mock the new editor toolbar with fake data in a
  single HTML file. I want to react to the layout before you touch the real
  app."
- "Users churn after onboarding. Search the codebase and brainstorm 10 places
  we could intervene, cheapest to most ambitious. I'll tell you which ones
  resonate."

---

## 3. Interview

**Targets:** known unknowns -- the questions the user knows to ask but hasn't
answered.

**Reach for it when** brainstorming (or a blindspot pass) is done and
ambiguity remains; the user has a rough spec with open decisions; or they ask
to be interviewed.

**Gather first:** the current state of the spec/plan; what previous
techniques already resolved (check the log); the codebase context that makes
questions concrete.

**Procedure:**

1. List the ambiguities you can find -- in the spec, in the conversation, in
   the gap between the spec and the code that exists.
2. Ask one question at a time, prioritizing questions whose answer would
   change the architecture. Concrete options over freeform wherever the
   answer set is finite.
3. Ground every question in something real -- a file, a pattern the project
   already uses, a constraint from the log.
4. Stop when answers stop changing the plan, or the user calls it.

**Output:** resolved decisions folded back into the spec/plan; log entries
for the ones with lasting consequences.

**Hand off / anti-patterns:** when the user has a *complete plan* needing a
rigorous line-by-line audit with confidence labels, hand off to **`/drill`**
-- that's its job. Don't interrogate past the point of usefulness; don't ask
what the codebase can answer (go read it instead).

**Example prompts:**

- "Interview me one question at a time about anything ambiguous -- prioritize
  questions where my answer would change the architecture."

---

## 4. References

**Targets:** known unknowns the user can point at but not describe; unknown
knowns embodied in things they already like.

**Reach for it when** the user says "like X", names a library/site/component
whose behavior they want, or describing the requirement would take longer
than pointing at it.

**Gather first:** the reference itself (folder, repo, URL, file); what
specifically to look for in it (behavior, structure, look); the target
context it must translate into.

**Procedure:**

1. Read the source, not the surface. For code references, read the actual
   implementation -- even in a different language. For websites, read the
   underlying markup and code, not just a screenshot.
2. Extract the semantics the user wants: the behavior, the structure, the
   contract -- separate from the incidental details of the reference's stack.
3. Restate what you extracted and confirm it's the part they meant before
   reimplementing.
4. Translate into the project's own idiom, citing the reference in the plan
   or log.

**Output:** an extracted-semantics summary (chat), then the translation
plan/implementation notes. Log the adopted reference.

**Hand off / anti-patterns:** don't copy-paste across stacks -- reimplement
semantics. Don't accept "make it like X" without step 3; the user usually
means one aspect of X, not all of it.

**Example prompts:**

- "This Rust crate in `vendor/rate-limiter` implements the exact backoff
  behavior I want. Read it and reimplement the same semantics in our
  TypeScript API client."
- "I love this site's pricing table -- read how it's actually built and do
  ours with the same structure."

---

## 5. Implementation Plan

**Targets:** consolidates all quadrants into a reviewable map before code.

**Reach for it when** discovery feels done and the user is ready to
implement; or as the capture step when they arrive with everything already
decided (known knowns only).

**Gather first:** all prior technique outputs (criteria, decisions,
references, blindspot conversions); the log; the code areas the plan will
touch.

**Procedure:**

1. Draft the plan **decisions-first**: lead with what the user is most likely
   to tweak -- data model changes, new type interfaces, anything user-facing.
   Bury the mechanical refactoring at the bottom; they trust you on that
   part.
2. For each leading decision, show the choice made, the alternative, and what
   flips it -- this is where remaining unknowns surface.
3. Render as an artifact for review when the plan is big; chat for small
   ones.
4. Revise on reaction. When it settles, tell the user to start the
   implementation in a fresh session, passing the plan (and any prototype)
   as the prompt.

**Output:** the plan artifact/document -- the new map. Suggest pairing with
Implementation Notes during the build.

**Hand off / anti-patterns:** for a rigorous audit of the finished plan,
hand to **`/drill`**. Don't order the plan by execution sequence -- order by
likelihood-of-tweak; execution order is the agent's problem.

**Example prompts:**

- "Write an implementation plan but lead with the decisions I'm most likely
  to tweak: data model changes, new type interfaces, anything user-facing.
  Bury the mechanical refactoring at the bottom -- I trust you on that part."

---

## 6. Implementation Notes

**Targets:** the unknown unknowns that only surface once real code meets the
real territory.

**Reach for it when** implementation is starting from a scout plan; or
mid-build when the agent keeps hitting surprises worth remembering.

**Gather first:** the plan being implemented; the conservative-default policy
(what to do at an unplanned fork: pick the conservative option, log it, keep
going).

**Procedure:**

1. At implementation kickoff, create `implementation-notes.md` at the project
   root with sections: `Plan`, `Deviations`, `Discoveries`, `Follow-ups`.
2. During the build, when an edge case forces a deviation from the plan: pick
   the conservative option, log it under `Deviations` with the why, and keep
   going -- don't stop to renegotiate every fork.
3. Log `Discoveries` (things about the territory the plan didn't know) even
   when they don't force a deviation.
4. At the end, distill: which deviations should feed the scout log (lasting
   lessons) versus which were one-off.

**Output:** `implementation-notes.md` -- input for the Quiz, the Pitch, and
next attempt's plan.

**Hand off / anti-patterns:** notes are for *deviations and discoveries*, not
a build diary -- don't log routine progress. If deviations pile up fast, the
plan was wrong: stop and return to Interview or Plan instead of deviating the
plan away.

**Example prompts:**

- "Keep an implementation-notes.md file. If you hit an edge case that forces
  you to deviate from the plan, pick the conservative option, log it under
  'Deviations', and keep going."

---

## 7. Pitch & Explainer

**Targets:** the *reviewers'* unknowns -- they start with the same ones the
user did.

**Reach for it when** the work needs buy-in or approval; the user asks to
package the work for Slack, a PR description, or a design review.

**Gather first:** the prototype, the spec/plan, the implementation notes;
who the audience is (novices need the unknowns explained; experts need them
*accounted for*); the demo asset if one exists.

**Procedure:**

1. Lead with the demo -- the artifact opens with the thing itself (GIF,
   screenshot, live mock), not the preamble.
2. Retrace the unknowns journey: what looked unclear at the start, what was
   discovered, what was decided and why. Reviewers relive the discovery in
   minutes instead of re-deriving it in days.
3. Answer the experts up front: a section addressing the failure points a
   domain expert would probe -- pulled straight from the blindspot pass and
   the deviations log.
4. Package as **one doc** -- self-contained artifact the user can drop in a
   channel.

**Output:** the pitch artifact.

**Hand off / anti-patterns:** don't structure it as a chronology of work done
-- structure it as the reviewer's unknowns, answered in order. For a
publication-grade editorial document, suggest **`/writereport`**.

**Example prompts:**

- "Package the prototype, the spec, and the implementation notes into a
  single doc I can drop in Slack to get buy-in. Lead with the demo GIF."

---

## 8. Quiz

**Targets:** the user's unknown unknowns *about their own change* -- a long
session accomplishes more than the diff alone can show, since behavior
depends on existing code paths.

**Reach for it when** a large or long-running change is done and the user is
about to merge; or the user asks "make sure I understand what happened".

**Gather first:** the full diff; the implementation notes (deviations are
prime quiz material); the existing code paths the change interacts with.

**Procedure:**

1. Build the context report first: what was done, why, and the intuition --
   organized by behavior, not by file. Include the code paths the change
   *depends on* but didn't touch.
2. Write the quiz: questions targeting what the diff alone wouldn't teach --
   interactions with existing behavior, the deviations, the edge cases.
   Multiple choice with plausible distractors, plus one or two "what happens
   if..." scenario questions.
3. Render as a single artifact: report on top, quiz at the bottom, live
   scoring with a PASS / RETRY verdict (the shell's quiz block provides
   this).
4. Soft gate: recommend merging only after a clean pass -- but the gate is
   advisory; scout never blocks. On a miss, explain the answer against the
   actual code and log the miss (misses are the user's freshest map).

**Output:** the quiz artifact; log entries for missed questions.

**Hand off / anti-patterns:** don't quiz on trivia (file names, line counts)
-- quiz on behavior and consequences. Don't skip the report; the quiz without
context is a gotcha, not a teaching pass.

**Example prompts:**

- "I want to make sure I understand everything that's happened in this
  change. Give me an HTML report on the changes -- context, intuition, what
  was done -- with a quiz at the bottom that I must pass."
