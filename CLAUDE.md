# Version Check Before Push

The version in `package.json` is **pack-wide**: it covers all skills in this
repo (xray, drill, realitycheck, lore). Any skill change may warrant a bump —
e.g. if the `xray` skill is updated, bumping the shared version is valid.

Before running `git push` (or any command that pushes commits to a remote), you MUST:

1. Read the current version from `package.json` (`"version"` field).
2. Ask the user to confirm the version is correct using the AskUserQuestion tool:
   - Show the current version (e.g. "The current pack version is **1.4.0**.")
   - Offer options: "Looks good — push", "I want to change the version first"
3. Only proceed with the push if the user confirms.

If the user wants to change the version, update it in `package.json` before pushing.
