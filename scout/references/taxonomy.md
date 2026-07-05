# The Unknowns Taxonomy -- scout's diagnostic model

Scout routes by **where the unknowns hide**, not by what the user asked for.
This file defines the four quadrants, the signals that reveal each one, and
the routing table from quadrant + lifecycle stage to technique.

## Why unknowns are the bottleneck

The map (prompt, plan, context) never fully matches the territory (the
codebase, the domain, the real constraints). Every mismatch is an unknown the
agent resolves by guessing what the user wants. A few guesses are fine; on
long-horizon work they compound. The iceberg picture: before scouting, most of
the mass sits below the waterline. Each technique is a cheap way to pull mass
above it -- cheap now versus expensive mid-implementation, when small spec
changes force drastically different code and reverts get hard.

Two failure modes when unknowns go unaccounted:

- **Too specific**: the agent follows instructions off a cliff when a pivot
  was the right move -- the user didn't know the path was blocked.
- **Too vague**: the agent fills gaps with industry-average defaults that
  don't fit -- the user didn't know where they wanted it to veer.

## The four quadrants

| Quadrant | One-liner | Sounds like | Risk if ignored |
|---|---|---|---|
| **Known knowns** | What's in the prompt | "I want X, built like Y" | Low -- just capture it faithfully |
| **Known unknowns** | Questions the user knows to ask | "I haven't decided how auth tokens refresh" | Medium -- decisions get made by default instead of on purpose |
| **Unknown knowns** | "I'll know it when I see it" | "Make it feel snappier" · vague design/UX language | High -- taste discovered mid-build forces expensive rework |
| **Unknown unknowns** | Never considered at all | Silence -- new domain, new codebase area, "how good can this even be?" | Highest -- the pothole the user didn't know the road could have |

### Diagnostic signals

Classify from Phase 1 answers and project state:

- **Known unknowns dominate** when the user can list open questions, names
  undecided trade-offs, or the plan has TODO/TBD markers.
- **Unknown knowns dominate** when the request uses taste words ("clean",
  "modern", "feels right"), the work is visual/UX, or the user says they can't
  describe what they want but would recognize it.
- **Unknown unknowns dominate** when the user is new to the domain or that
  part of the codebase, can't say what "good" looks like, doesn't know what
  questions to ask, or asks "what am I missing?".
- **Mixed** is normal. Route to the dominant quadrant first; note the rest as
  the natural next move (Phase 4).

## Routing table

| Dominant quadrant | Primary technique | Secondary |
|---|---|---|
| Known knowns only | Implementation Plan (capture + confirm) | -- |
| Known unknowns | **Interview** | References (when the answer exists as code) |
| Unknown knowns | **Brainstorm & Prototype** (react-to-options) | References (steal a look/behavior they already like) |
| Unknown unknowns | **Blind Spot Pass** | then re-diagnose -- the pass usually converts them into known unknowns |

## Lifecycle overlay

The quadrant says *which* technique; the stage says *which are even
applicable*. What you learn at the end loops back to the start: the log, the
notes, and the quiz misses are next project's map.

| Stage | Signals | Applicable techniques |
|---|---|---|
| **Before implementation** | no diff yet, plan being formed, "about to start" | Blind Spot Pass · Brainstorm & Prototype · Interview · References · Implementation Plan |
| **During implementation** | active diff, plan exists, edge cases surfacing | Implementation Notes (log deviations, keep going) |
| **After implementation** | large diff done, review/merge/hand-off pending | Pitch & Explainer · Quiz (merge only when you pass) |

Stage conflicts beat quadrant matches: a user full of unknown unknowns about a
diff that is already written needs a **quiz**, not a blindspot pass -- the
quiz reveals the same blind spots against the code that actually exists.

## Sequencing heuristics

- Blind Spot Pass first when the domain is new -- it converts unknown unknowns
  into known unknowns that the other techniques can then work through.
- Brainstorm before Interview when taste is involved: reacting to options
  surfaces unknown knowns that no direct question would.
- Interview last before the plan -- it sweeps whatever the other techniques
  left ambiguous.
- References any time the user says "like X" -- source code is the richest
  reference there is; docs and screenshots are fallbacks.
- Every technique's output feeds the plan; the plan feeds implementation with
  notes; the notes feed the quiz and pitch; misses feed the log.
