<!-- only:cursor -->
---
name: huh
description: Re-explain the last thing that happened in plain language, using ASD-STE100 Simplified Technical English, shown in English and the user's language together. Use when the user says "huh", "huh?", "explain that simply", "in plain English", "what does that mean", or "I don't get it". Explains the previous answer, the options in a question, or anything typed after the command.
---
<!-- /only -->
<!-- only:claude -->
---
name: huh
description: Re-explain the last thing that happened in plain language, using ASD-STE100 Simplified Technical English, shown in English and the user's language together. Use when the user says "huh", "huh?", "explain that simply", "in plain English", "what does that mean", or "I don't get it". Explains the previous answer, the options in a question, or anything typed after the command.
user-invocable: true
disable-model-invocation: true
argument-hint: [thing to explain]
---
<!-- /only -->
<!-- only:codex -->
---
name: huh
description: Re-explain the last thing that happened in plain language, using ASD-STE100 Simplified Technical English, shown in English and the user's language together. Use when the user says "huh", "huh?", "explain that simply", "in plain English", "what does that mean", or "I don't get it". Explains the previous answer, the options in a question, or anything typed after the command.
---
<!-- /only -->

# /huh -- Plain-Language Explainer

Say again, in words a non-expert can read. `/huh` rewrites the last thing that happened under
**ASD-STE100 Simplified Technical English** -- the controlled English of aircraft maintenance
manuals: one word per meaning, short sentences, active voice, no idiom -- and shows it in English
and the user's language together.

`/huh` explains, then gives control back. It never edits a file, runs a command, installs anything,
or continues the task it interrupted. The user decides what happens next.

---

## Fast path

Latency *is* the feature here. A `/huh` that arrives late has already failed -- the user ran it
because they were stuck, and every second of silence is a second of being stuck. These rules come
first, in order of how much they save:

1. **Do not deliberate.** Everything needed is already in the conversation and the output format is
   fixed. Compose the answer directly. A planning pass on a five-bullet explanation costs more than
   the explanation.
2. **Zero tool calls.** Never re-read a file, re-run a search, or re-open a document to explain
   something already present in the conversation. One targeted lookup is allowed *only* when the
   user's argument names something genuinely absent from context -- and then say so in one line
   before doing it.
3. **The first token is the answer.** No preamble, no "let me break this down simply", no restating
   the question. The bold headline is the first thing on screen, readable about a second in, while
   the rest still streams.
4. **Never re-paste what is already on screen.** Point at it -- ``the `pruneOrphans` block above`` --
   instead of quoting it back.
5. **Keep the per-line language pairing** from Step 3. Stacked single-language blocks would make the
   reader wait for the whole English body before their own language appears.
6. **Respect the word budget for the level.** Short first, deeper only on demand. The ladder in
   Step 1 is a speed feature as much as a comprehension one.

---

## Delivery

The Fast path decides *when* the answer lands. This decides *what shape it lands in*. Assume the
reader is stuck, impatient, and looking at a narrow screen. Every rule below takes work off them.

- **Consequence before definition.** Open with what happened, or with what it means for the reader.
  Never open with what a thing is. "Lint found 4 problems. None are yours" -- not "Lint is a tool
  that checks source code". A definition, if it is still needed, goes in the glossary.
- **One idea per line.** If a bullet joins two ideas with "and", split it into two bullets.
- **Bold the word that carries the line.** One phrase per bullet at most. Bold everything and
  nothing is bold.
- **No nested bullets.** A flat list costs the reader nothing to track. An indented one asks them to
  hold their place while they read.
- **No mid-sentence parentheses, no subordinate clauses.** They force a re-read. Write two sentences.
- **Front-load every line.** The point goes in the first few words. Detail comes after, or not at all.
- **Never bury a negative.** "None are yours", not "these are not all attributable to your changes".
- **No "it depends".** If it does depend, name the one thing it depends on, then stop.
- **Close with the next action** -- something the reader can say or run. Not a summary. See Step 4.

Never open with background, a restatement of the question, or "let me explain". The first line is
the answer. See Fast path rule 3.

Where this section and Step 2 disagree, **Step 2 governs word choice and this section governs order
and shape.**

---

## Affordable-model delegation

The material is already in context, so a subagent buys nothing on a short answer. Startup costs more
than the faster tokens save, a subagent cannot check a claim it cannot see, and -- decisively -- its
output does not stream: the user watches a spinner instead of reading the headline one second in.
**Stay inline.**

Delegate the STE-rewrite-and-translate pass to one fast, affordable model only when the target is
genuinely bulky: a long plan, a whole document, a multi-file walkthrough -- work where the wait is
unavoidable anyway. When model-selectable subagents are available, **Claude Code prefers Sonnet 5**
and other coding agents choose the closest available equivalent with strong writing and multilingual
ability. Do not prompt the user to choose a model. In that case, say in one line what is being read
before starting, so the pause reads as work rather than a hang.

The **primary agent always** decides what to explain, owns every factual claim, sets the level, and
delivers the answer. A subagent must never edit files, run commands, or continue the interrupted
task. If a delegated result is incomplete, wrong, or breaks the format, repair it in the primary
agent rather than sending it on.

---

## Step 0: Language for this session

On the **first** `/huh` of a session, ask which language to explain in. Ask once, with no preamble.

- Offer **English** and **简体中文** as the standing choices. If the user has written in some other
  language in this conversation, offer that language instead of 简体中文 as the second choice.
  Always allow a free-text answer for any other language.
- **Skip the question entirely** when the invocation already names a language -- `/huh in Japanese`,
  `/huh 用中文` -- and use that.
- Reuse the answer silently for every later `/huh` in the session. Never ask twice.

<!-- only:claude -->
Ask with the question tool, one question, three options plus free text.
<!-- /only -->
<!-- only:cursor,codex -->
Ask as a single short line in chat, listing the choices inline.
<!-- /only -->

**Never write a file.** `/writereport` persists its language pair to `docs/.writereport.json`;
`/huh` deliberately does not. There is no config file, no home-directory state, and nothing in
`git status` afterwards. A new session asks again -- that is the intended trade.

If the answer is **English**, the output is single-language STE. There is no pair to make, and the
italic second line in Step 3 is simply omitted.

---

## Dispatch

Resolve what to explain, in this order. Stop at the first match.

1. **`$ARGUMENTS` is present** -- explain that. It may be a term (`/huh what is ASD-STE100`), a
   quoted line, a file path, or a question.
2. **The previous assistant turn posed a question with options** -- explain each option, then
   **re-present the question verbatim** so the user can still answer it. See Step 3 for the option
   format.
3. **Otherwise** -- explain the previous assistant response.
4. **Nothing to explain** (no prior assistant turn) -- say so in one line and ask what to explain.

<!-- only:claude -->
### Using it during a question

A question picker accepts only an option or free text, so `/huh` typed into **Other** arrives as an
*answer*, not as a command -- nothing fires. The move is: press **Esc** to dismiss the picker, then
type `/huh`. Case 2 above then explains the options and re-asks the question. If the user has
clearly typed "huh" into an Other box and the run continues, treat it as case 2 anyway.
<!-- /only -->

---

## Step 1: Choose the level

Each consecutive `/huh` on the **same** target goes one level simpler. The counter resets to level 1
whenever the target changes -- a new response, a new question, a new argument.

| Level | When | Shape | Budget |
|-------|------|-------|--------|
| **1** | first `/huh` | Plain STE, consequence first. Headline, three to five bullets, glossary only if real jargon appeared. | ~120 words per language |
| **2** | second `/huh`, same target | No jargon at all. Led by one everyday analogy, named as an analogy. | ~80 words per language |
| **3** | third and after | Shortest useful form: what it is, why it matters. No glossary, no bullets. | ~40 words per language |

At level 3 and beyond, stay at level 3 but change the analogy rather than repeating it.

---

## Step 2: Write it under STE

The writing rules that carry the standard:

- **One word, one meaning.** Choose one term per concept and repeat it. Never vary a term for style.
- **Short sentences.** Twenty words maximum for a step or instruction, twenty-five for description.
- **One instruction per sentence.** Split a compound instruction into two sentences.
- **Active voice, present tense.** "The installer copies the file", not "the file is copied".
- **Keep the articles.** Write "the manifest", not "manifest".
- **No noun cluster longer than three words.** Unpack it: "skill install manifest file" becomes
  "the file that lists the installed skills".
- **No idiom, slang, metaphor, or jokes.** **Level 2 is the single exception:** exactly one analogy,
  explicitly marked as an analogy, with every other rule still in force.
- **Say what a pronoun refers to** whenever "it" or "this" could point at two things.
- **A term with no simple substitute stays as it is** and goes in the glossary. Do not invent a
  friendly synonym for a real technical name -- the user needs the searchable word.
- **Never translate or paraphrase code**, identifiers, paths, flags, or commands. Quote them
  verbatim as `` `code` `` and explain around them.

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
  line should still get the point. It states a consequence or an outcome, never a definition, and
  carries exactly one bolded hook.
- The **glossary appears only when a real technical term showed up.** Never invent an entry to fill
  the table. Every term carries its plain meaning in **both** languages.
- **Options** (dispatch case 2) get one line each: what happens if the user picks it, and who it
  suits. **Never recommend one.** Describe what each does, then re-print the original question
  verbatim. Choosing is the user's job.

```md
**Home-level** -- saves the setting in your home folder. Pick this if you want to answer once.
*保存在你的用户目录里。只想回答一次就选这个。*
```

---

## Step 4: Hand control back

Close with one short line naming the **next action** -- something the user can say or run verbatim,
like ``say **run the build**`` -- or the re-asked question. One line only. Never close with a
summary, and never start doing the work.

---

## Rules

- **Explain, never execute.** No file edits, no commands, no continuing the interrupted task, no
  "while I was at it".
- **Consequence before definition.** Never open with what a thing is.
- **Neutral on options.** Explain what each does and who it suits. Never recommend one.
- **Never persist the language.** Session memory only -- no config file, no home-directory state.
- **Zero tool calls on the normal path.** The material is already in context.
- **The level counter resets** when the target changes.
- **Code is quoted, never translated.**
- **Stay inside the word budget.** Going long defeats the skill; escalate to a simpler level instead
  of writing more.
- **Accuracy first.** Never simplify a statement into a false one. Flag an error as an error.
- **Keep judgment in the primary agent.** Delegation is a writing pass on bulky material and nothing
  more.
