<!-- only:cursor -->
---
name: huh
description: "Say that again, plainly: add the context I was missing."
---
<!-- /only -->
<!-- only:claude -->
---
name: huh
description: "Say that again, plainly: add the context I was missing."
user-invocable: true
disable-model-invocation: true
argument-hint: [thing to explain]
---
<!-- /only -->
<!-- only:codex -->
---
name: huh
description: "Say that again, plainly: add the context I was missing."
---
<!-- /only -->

# /huh -- Plain-Language Explainer

The user stopped following. Re-pitch where the conversation has got to: add the context they were
missing, then say it in **ASD-STE100 Simplified Technical English**, with the project's own names,
in English and the user's language together.

STE is the controlled English of aircraft maintenance manuals: one word per meaning, short
sentences, active voice, no idiom.

`/huh` explains, then gives control back. It never edits a file, runs a command, installs anything,
or continues the task it interrupted. The user decides what happens next.

---

## Fast path

Latency *is* the feature. The user ran `/huh` because they were stuck, and every second of silence
is a second of being stuck. These rules come first, in order of how much they save:

1. **Answer from context.** Everything needed is already in the conversation and the output format
   is fixed, so there is nothing to gather before writing.
2. **Zero tool calls.** The material is already in context. One targeted lookup is allowed only when
   the user's argument names something genuinely absent from context. Say so in one line before
   doing it.
3. **The first token is the answer.** The bold headline is the first thing on screen, readable about
   a second in, while the rest still streams. Preamble and a restated question push it down.
4. **Point at what is already on screen** -- ``the `pruneOrphans` block above`` -- instead of
   quoting it back.
5. **Keep the per-line language pairing** from Step 3, so the reader's own language arrives with
   each line rather than after the whole English body.

---

## Delivery

The Fast path decides *when* the answer lands. This decides *what shape it lands in*. Assume the
reader is stuck, impatient, and looking at a narrow screen. Every rule below takes work off them.

- **Consequence before definition.** Open with what happened, or with what it means for the reader.
  "Lint found 4 problems. None are yours" -- rather than "Lint is a tool that checks source code".
  A definition, if still needed, goes in the glossary.
- **Add the missing premise.** Name the thing the earlier message assumed the reader knew. A
  re-pitch that only deletes words has failed.
- **One idea per line.** If a bullet joins two ideas with "and", split it into two bullets.
- **Bold the word that carries the line.** One phrase per bullet at most.
- **One flat list.** A flat list costs the reader nothing to track.
- **Two short sentences beat one with a clause.** A parenthesis or a subordinate clause forces a
  re-read.
- **Front-load every line.** The point goes in the first few words. Detail comes after, or not at all.
- **State a negative plainly.** "None are yours", rather than "these are not all attributable to
  your changes".
- **Name the one thing it depends on**, then stop. "It depends" on its own is a non-answer.
- **Close with the next action** -- something the reader can say or run. See Step 4.

Where this section and Step 2 disagree, **Step 2 governs word choice and this section governs order
and shape.**

---

## Affordable-model delegation

**Stay inline.** The material is already in context, so a subagent buys nothing: startup costs more
than the faster tokens save, it cannot check a claim it cannot see, and its output does not stream.
The user would watch a spinner instead of reading the headline one second in.

Delegate the STE-rewrite-and-translate pass to one fast, affordable model only when the target is
**not already in context** and reading it is real work: a plan from an earlier session, a document
the user names by path, a multi-file walkthrough. Context, not length, is the trigger. **Claude Code
prefers the `sonnet` model alias**; other coding agents choose the closest equivalent with strong writing and
multilingual ability, without asking the user. Say in one line what is being read before starting,
so the pause reads as work rather than a hang.

The **primary agent always** decides what to explain, owns every factual claim, sets the level, and
delivers the answer. A subagent only reads and drafts. If a delegated result is incomplete, wrong,
or breaks the format, repair it in the primary agent rather than sending it on.

---

## Step 0: Language for this session

On the **first** `/huh` of a session, ask which language to explain in. Ask once, with no preamble.

- Offer **English** and **简体中文** as the standing choices. If the user has written in some other
  language in this conversation, offer that language instead of 简体中文 as the second choice.
  Always allow a free-text answer for any other language.
- **Skip the question** when the invocation already names a language -- `/huh in Japanese`,
  `/huh 用中文` -- and use that.
- Reuse the answer silently for every later `/huh` in the session. One question per session.

<!-- only:claude -->
Ask with the question tool, one question, the two choices plus free text.
<!-- /only -->
<!-- only:cursor,codex -->
Ask as a single short line in chat, listing the choices inline.
<!-- /only -->

**Session memory only.** `/writereport` persists its language pair to `docs/.writereport.json`;
`/huh` keeps the answer in the conversation. There is no config file, no home-directory state, and
nothing in `git status` afterwards. A new session asks again. That is the intended trade.

If the answer is **English**, the output is single-language STE. There is no pair to make, and the
italic second line in Step 3 is simply omitted.

---

## Dispatch

Resolve what to explain, in this order. Stop at the first match.

1. **`$ARGUMENTS` is present** -- explain that. It may be a term (`/huh what is ASD-STE100`), a
   quoted line, a file path, or a question. If the argument is a path to a plan file, use
   **Explaining a plan** below.
2. **The previous assistant turn posed a question with options** -- explain each option, then
   **re-present the question verbatim** so the user can still answer it. See Step 3 for the option
   format.
3. **A plan is on the table** -- the previous assistant turn presented a plan for approval, or plan
   mode is active and a plan file has been written. Use **Explaining a plan** below.
4. **Otherwise** -- re-pitch the previous assistant response. When that response rests on something
   the user never saw, start from there and say so in the headline.
5. **Nothing to explain** (no prior assistant turn) -- say so in one line and ask what to explain.

<!-- only:claude -->
### Using it during a question

A question picker accepts only an option or free text, so `/huh` typed into **Other** arrives as an
*answer*, not as a command -- nothing fires. The move is: press **Esc** to dismiss the picker, then
type `/huh`. Case 2 above then explains the options and re-asks the question. If the user has
clearly typed "huh" into an Other box and the run continues, treat it as case 2 anyway.
<!-- /only -->

---

## Step 1: Choose the level

Each consecutive `/huh` on the **same** target goes one level simpler. Simpler means fewer
assumptions, not fewer words. The counter resets to level 1 whenever the target changes -- a new
response, a new question, a new argument.

| Level | When | What changes |
|-------|------|--------------|
| **1** | first `/huh` | Re-pitch the target. Add the premise it assumed. Headline, bullets, glossary only if real jargon appeared. |
| **2** | second `/huh`, same target | Start further back, from the last point the user clearly followed. Plain words only, plus one everyday analogy, named as an analogy. |
| **3** | third and after | The one thing to know, then the next action. A new analogy each time. |

The only length rule: **shorter than the thing it explains.** Going long defeats the skill; going
terse defeats the reader. When the answer runs long, cut detail and assumptions, and keep the
premise.

Plans use a different ladder. See **Explaining a plan**.

---

## Step 2: Write it under STE

The writing rules that carry the standard:

- **One word, one meaning.** Choose one term per concept and repeat it, even where a stylist would
  vary it.
- **Use the project's own names.** Take them from `CLAUDE.md`, `CONTEXT.md`, `LORE.md`, or the code,
  when they are already in context. A real name stays as it is and goes in the glossary, because the
  user needs the searchable word. A friendlier synonym would take that word away.
- **Short sentences.** Twenty words maximum for a step or instruction, twenty-five for description.
- **One instruction per sentence.** Split a compound instruction into two sentences.
- **Active voice, present tense.** "The installer copies the file", rather than "the file is copied".
- **Keep the articles.** Write "the manifest", rather than "manifest".
- **Noun clusters of three words at most.** Unpack the longer ones: "skill install manifest file"
  becomes "the file that lists the installed skills".
- **Literal language.** Idiom, slang, metaphor, and jokes stay out. **Level 2 is the single
  exception:** exactly one analogy, explicitly marked as an analogy, with every other rule still in
  force.
- **Say what a pronoun refers to** whenever "it" or "this" could point at two things.
- **Quote code verbatim** -- identifiers, paths, flags, commands -- as `` `code` `` and explain
  around it. Code reads the same in both languages.

Accuracy outranks simplicity. If simplifying a point would make it wrong, keep the hard word and
define it. If the thing being explained was **wrong** rather than unclear, say that plainly instead
of producing a simpler version of a false statement.

---

## Step 3: Format the answer

English leads, upright and bold. The user's language follows in italics on the next line, so the eye
can run down one language and skip the other. Jargon appears inline as `` `code` ``.

```md
**The installer copies files to your machine.**
*安装器把文件复制到你的电脑上。*

- It finds which agents you have.
  *它找出你装了哪些 agent。*
- It writes one folder for each skill.
  *它为每个技能写一个文件夹。*

| Word | Simple meaning | 简单意思 |
|------|----------------|---------|
| `manifest` | a list of what it put there | 它放了哪些文件的清单 |
| `prune` | delete the leftovers | 删掉多余的旧文件 |
```

- The **headline** is one sentence that answers the question on its own. Someone who reads only that
  line should still get the point. It states a consequence or an outcome, and carries exactly one
  bolded hook.
- The **glossary appears only when a real technical term showed up.** Every term carries its plain
  meaning in **both** languages. An empty glossary is omitted, not padded.
- **Options** (dispatch case 2) get one line each: what happens if the user picks it, and who it
  suits. Describe each one, then re-print the original question verbatim. **Choosing is the user's
  job**, so every option gets the same neutral treatment.

```md
**Home-level** -- saves the setting in your home folder. Pick this if you want to answer once.
*保存在你的用户目录里。只想回答一次就选这个。*
```

---

## Step 4: Hand control back

Close with one short line naming the **next action** -- something the user can say or run verbatim,
like ``say **run the build**`` -- or the re-asked question. One line only. That line replaces a
summary, and the work waits for the user's word.

---

## Explaining a plan

A plan is an ordered sequence, not a paragraph. This section overrides Step 1 and Step 3 for that
one target. Everything else -- the language pair, the Delivery rules, the STE rules -- still applies.

### Find the plan

- **Already in context**, because it was just presented: use that, with zero tool calls.
<!-- only:cursor -->
- Otherwise look in `.cursor/plans/` for `.plan.md` files and take the most recently modified one.
<!-- /only -->
<!-- only:claude,codex -->
- Otherwise use the `$ARGUMENTS` path if one was given. Failing that, look in your environment's
  plans location (Claude Code: `~/.claude/plans/`) and take the most recently modified file.
<!-- /only -->
- If no plan exists at all, say so in one line and stop.

A plan that is not in context is the one lookup the Fast path allows, and the one case for
**Affordable-model delegation** above. Check the returned walkthrough against the plan before
showing it.

### Shape -- one line per step

- The **headline** states what the plan produces, as a consequence, like any other headline.
- Then a numbered list: one line per plan step, in the plan's own order, keeping the plan's own
  numbering.
- **Level 1 maps one to one with the plan**: same steps, same order, same numbers, so any line
  traces back to the step it came from.
- The budget scales with the step count. Each line still obeys the STE sentence limit.
- Glossary rules from Step 3 are unchanged.

### The ladder for plans

| Level | Shape |
|-------|-------|
| **1** | One line per step, plan order, one to one with the plan. |
| **2** | Steps grouped into two or three named phases. Each phase names the step numbers it covers. |
| **3** | One sentence on what the whole plan produces. |

**Grouping replaces the analogy for plans.** A multi-step sequence has no single comparison that
keeps the order intact.

### The plan is the artifact

- The explanation is **disposable**. The plan file is what gets approved and what gets executed.
- Hand the real plan back through the normal approval path, unchanged. Approval goes to the plan
  file; the explanation is a reading aid.
- A "yes", "looks good", or "go" after a plan `/huh` approves **the plan as written**. Execute the
  plan, not the summary.
- If the explanation and the plan disagree, **the plan wins**. The explanation was the error. Repair
  the explanation and leave the plan as it is.
- `/huh` explains a plan. **`/drill` is the skill that changes one.**

Hand back with one line, such as: *"That was a summary. The plan itself is unchanged -- approve it to
continue."*
