# Aurora Field Notes — Q2 Review

A short sample document for `/writereport demo`. It mixes prose, a data table, and a
code snippet so the editorial reflow, styled tables, inline charts, and code framing
all get exercised in one pass.

## The quarter in one line

Aurora went from a weekend prototype to a tool people open on Monday morning. Usage
grew steadily, churn fell, and the team shipped the first paid plan.

## Growth

Weekly active users climbed every month, with the steepest jump after the April
onboarding rewrite.

| Month | Weekly active users | Paying teams |
|-------|--------------------:|-------------:|
| Jan   | 1,200               | 0            |
| Feb   | 1,850               | 0            |
| Mar   | 2,600               | 4            |
| Apr   | 4,300               | 11           |
| May   | 6,100               | 23           |
| Jun   | 8,400               | 38           |

The April inflection lines up with the onboarding change — a reminder that activation,
not acquisition, was the real bottleneck.

## What users said

> "It's the first tool that didn't make me read a manual before it was useful."

Three themes recurred in interviews: speed, clarity, and the feeling that the product
"got out of the way." The losses we heard about were almost always about missing
integrations, not the core experience.

## A snippet from the activation experiment

```js
// Activation: show value before asking for a signup.
function firstRunFlow(user) {
  const sample = loadSampleProject()       // no account required
  if (user.completed(sample)) {
    return promptToSave(sample)             // convert at the moment of value
  }
  return keepExploring(sample)
}
```

## Next quarter

- Ship the integrations users keep asking for.
- Hold activation above 60% as top-of-funnel grows.
- Turn the strongest interview quotes into a public case study.
