#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const GREEN = "\x1b[38;2;0;255;65m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const art = `
${GREEN}                ░░░▓▓▓▓░░░
              ▒▓▓▓▓▓▓▓▓▓▓▓▓▒
            ▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒
           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
         ▒▓▓▓▓▓▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒
         ▓▓▒░▓▓░ ▒▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓
        ░▓▓  ▓▓░ ░▓▓▓▓▓░  ░▓▓▓▓▓▓░
        ░▓▓░ ░▓▓  ▒▓▓███▒ ░▓▓▓▓▓▓░
        ░▓▓▓░ ▒▓▓▒▓▓░░▒▒  ▒▓▓▓▓▓▓░
        ░▓▓▓▓▓▓▓▓▓▒      ░▓▓▓▓▓▓▓░
        ░▓▓▓▓▓▓▓        ▒▓▓▓▓▓▓▓▓░
        ░▓▓▓▓▓▓░      ▒▓▓▓▓▓▓▓▓▓▓░
         ▓▓▓▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓
          ░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░${RESET}
`;

const title = `${GREEN}${BOLD}                B E N C H${RESET}`;

const pkgRoot = path.join(__dirname, "..");
const home = os.homedir();

const VERSION = require(path.join(pkgRoot, "package.json")).version;
const MANIFEST_NAME = ".bench-install.json";

// --- Targets ---
// Each supported agent reads skills from a per-user "skills" root, where every
// skill is a directory containing a SKILL.md. Cursor, Claude Code, and Codex
// all share this shape; only the root path and per-agent frontmatter differ.
const TARGETS = {
  cursor: {
    label: "Cursor",
    root: path.join(home, ".cursor", "skills"),
    shortRoot: "~/.cursor/skills",
    detect: [path.join(home, ".cursor")],
  },
  claude: {
    label: "Claude Code",
    root: path.join(home, ".claude", "skills"),
    shortRoot: "~/.claude/skills",
    detect: [path.join(home, ".claude")],
  },
  codex: {
    label: "Codex",
    root: path.join(home, ".agents", "skills"),
    shortRoot: "~/.agents/skills",
    detect: [path.join(home, ".agents"), path.join(home, ".codex")],
  },
};

// --- Target selection ---

const args = process.argv.slice(2);
const forced = Object.keys(TARGETS).filter((id) => args.includes(`--${id}`));

let selected;
if (forced.length) {
  selected = forced;
} else {
  // Auto-detect: install to whichever agents are present on this machine.
  selected = Object.keys(TARGETS).filter((id) =>
    TARGETS[id].detect.some((p) => fs.existsSync(p))
  );
  // If none detected, default to all.
  if (selected.length === 0) selected = Object.keys(TARGETS);
}

// --- Content transformation ---
// Source files carry per-agent blocks. Canonical syntax:
//   <!-- only:claude,cursor --> ... <!-- /only -->
// A block is kept (markers stripped) iff `target` is in its comma-separated
// agent list; otherwise the whole block is removed. The legacy single-agent
// syntax `<!-- cursor-only --> ... <!-- /cursor-only -->` is still honored.
function transformContent(content, target) {
  // Generic multi-target blocks.
  content = content.replace(
    /<!-- only:([a-z0-9,\s]+) -->\n?([\s\S]*?)<!-- \/only -->\n?/g,
    (_m, list, inner) => {
      const ids = list
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return ids.includes(target) ? inner : "";
    }
  );

  // Legacy single-agent blocks (transitional).
  for (const id of Object.keys(TARGETS)) {
    const re = new RegExp(
      `<!-- ${id}-only -->\\n?([\\s\\S]*?)<!-- \\/${id}-only -->\\n?`,
      "g"
    );
    content = content.replace(re, id === target ? "$1" : "");
  }

  return content;
}

// --- Skills definition ---
// implicitInvocation: may the agent trigger this skill on its own (vs. only
// when the user explicitly invokes it). Drives Codex's agents/openai.yaml.
const skills = [
  {
    name: "writereport",
    files: [
      { src: "WRITEREPORT.md", dest: "SKILL.md" },
      { src: "docs/DESIGN.md", dest: "DESIGN.md" },
      { src: "reference/demo.md", dest: "DEMO.md" },
      // Bundled font (binary; copied verbatim). Optional so the pack installs
      // even before the font is added (the skill degrades when it is missing).
      { src: "fonts/Satoshi-Variable.woff2", dest: "fonts/Satoshi-Variable.woff2", binary: true, optional: true },
    ],
    implicitInvocation: false,
  },
  { name: "xray", files: [{ src: "XRAY.md", dest: "SKILL.md" }], implicitInvocation: false },
  { name: "drill", files: [{ src: "DRILL.md", dest: "SKILL.md" }], implicitInvocation: false },
  { name: "realitycheck", files: [{ src: "REALITYCHECK.md", dest: "SKILL.md" }], implicitInvocation: true },
  { name: "lore", files: [{ src: "LORE.md", dest: "SKILL.md" }], implicitInvocation: true },
  {
    name: "grid",
    files: [
      { src: "GRID.md", dest: "SKILL.md" },
      { src: "grid/references/method.md", dest: "references/method.md" },
      { src: "grid/references/overlay-api.md", dest: "references/overlay-api.md" },
      { src: "grid/assets/grid.css", dest: "assets/grid.css" },
      { src: "grid/assets/grid-overlay.js", dest: "assets/grid-overlay.js" },
      { src: "grid/assets/grid-debug.js", dest: "assets/grid-debug.js" },
      { src: "grid/assets/GridOverlay.jsx", dest: "assets/GridOverlay.jsx" },
      { src: "grid/assets/grid-optical.js", dest: "assets/grid-optical.js" },
      { src: "grid/assets/verify-grid.js", dest: "assets/verify-grid.js" },
    ],
    implicitInvocation: false,
  },
];

// Codex reads optional per-skill metadata from agents/openai.yaml. We only need
// it to opt a user-only skill out of implicit (model-chosen) invocation;
// Claude/Cursor express the same intent via SKILL.md frontmatter.
function codexMeta(skill) {
  if (skill.implicitInvocation) return null;
  return "allow_implicit_invocation: false\n";
}

// --- Upgrade manifest ---
// Each install records what it placed at a target root, so a later run can
// precisely remove files this installer previously wrote that are no longer
// shipped -- without ever touching files the user added themselves.

function readManifest(root) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, MANIFEST_NAME), "utf-8"));
  } catch {
    return null;
  }
}

function writeManifest(root, now) {
  fs.writeFileSync(
    path.join(root, MANIFEST_NAME),
    JSON.stringify({ version: VERSION, skills: now }, null, 2) + "\n",
    "utf-8"
  );
}

// Remove files listed in the previous manifest that this run no longer ships.
// Returns removed "<skill>/<file>" paths. Only deletes paths recorded in `prev`.
function pruneOrphans(root, prev, now, currentNames) {
  const removed = [];
  if (!prev || !prev.skills) return removed;

  for (const [name, files] of Object.entries(prev.skills)) {
    // In the catalog but missing from `now` => it failed this run; skip pruning
    // so a transient write error never deletes a working skill.
    if (!(name in now) && currentNames.has(name)) continue;

    const skillDir = path.join(root, name);
    const keep = new Set(now[name] || []);
    for (const rel of files) {
      if (keep.has(rel)) continue;
      const fp = path.join(skillDir, rel);
      if (fs.existsSync(fp)) {
        fs.rmSync(fp, { force: true });
        removed.push(`${name}/${rel}`);
      }
      const parent = path.dirname(fp); // tidy an emptied nested dir (e.g. agents/)
      if (parent !== skillDir) {
        try {
          if (fs.readdirSync(parent).length === 0) fs.rmdirSync(parent);
        } catch {}
      }
    }
    // Skill dropped from the catalog entirely: remove its dir if we emptied it.
    if (!currentNames.has(name)) {
      try {
        if (fs.readdirSync(skillDir).length === 0) fs.rmdirSync(skillDir);
      } catch {}
    }
  }
  return removed;
}

// --- Install ---

console.log(art);
console.log(title);
console.log();

const currentNames = new Set(skills.map((s) => s.name));
let failed = false;

for (const target of selected) {
  const t = TARGETS[target];
  const prev = readManifest(t.root);
  const now = {};
  console.log(`${DIM}  Installing for ${t.label}...${RESET}`);
  console.log();

  for (const skill of skills) {
    const skillDir = path.join(t.root, skill.name);
    process.stdout.write(`${DIM}    Installing ${skill.name} skill...${RESET}`);
    try {
      fs.mkdirSync(skillDir, { recursive: true });
      const written = [];
      for (const f of skill.files) {
        const srcPath = path.join(pkgRoot, f.src);
        if (f.optional && !fs.existsSync(srcPath)) continue; // not provided yet
        const destPath = path.join(skillDir, f.dest);
        fs.mkdirSync(path.dirname(destPath), { recursive: true }); // nested dests (fonts/…)
        if (f.binary) {
          fs.copyFileSync(srcPath, destPath); // verbatim — never utf-8 transform a binary
        } else {
          const content = fs.readFileSync(srcPath, "utf-8");
          fs.writeFileSync(destPath, transformContent(content, target), "utf-8");
        }
        written.push(f.dest);
      }

      // Codex-only: emit agents/openai.yaml for user-only skills.
      if (target === "codex") {
        const meta = codexMeta(skill);
        if (meta) {
          const metaDir = path.join(skillDir, "agents");
          fs.mkdirSync(metaDir, { recursive: true });
          fs.writeFileSync(path.join(metaDir, "openai.yaml"), meta, "utf-8");
          written.push("agents/openai.yaml");
        }
      }

      now[skill.name] = written;
      console.log(
        `\r${GREEN}    ✓${RESET} ${skill.name} skill installed to ${DIM}${t.shortRoot}/${skill.name}/${RESET}`
      );
      console.log(`${DIM}      ${written.join(" + ")}${RESET}`);
    } catch (err) {
      console.error(
        `\n\x1b[31m    ✗ Failed to install ${skill.name}: ${err.message}${RESET}`
      );
      failed = true;
    }
  }

  // --- Upgrade: prune orphans, record manifest ---
  const removed = pruneOrphans(t.root, prev, now, currentNames);

  writeManifest(t.root, now);

  // Upgrade summary -- only when an existing install was detected.
  if (prev) {
    console.log();
    if (prev.version === VERSION && removed.length === 0) {
      console.log(`${DIM}  ${t.label}: already up to date (${VERSION})${RESET}`);
    } else {
      console.log(`${GREEN}  Upgrading ${t.label}: ${RESET}${DIM}${prev.version} → ${VERSION}${RESET}`);
      for (const r of removed) {
        console.log(`${GREEN}    ✓${RESET} removed stale ${DIM}${r}${RESET}`);
      }
    }
  }

  console.log();
}

if (failed) {
  process.exit(1);
}
