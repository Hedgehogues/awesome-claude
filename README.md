<div align="center">

# awesome-claude

**Engineering rules & skills for Claude Code.**

Battle-tested conventions that turn Claude into a senior engineer on your team.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-blueviolet)](https://claude.ai/code)
[![Skills](https://img.shields.io/badge/skills-16-orange)](#skills)
[![Rules](https://img.shields.io/badge/rules-15-green)](#rules)

</div>

---

## Install

Open Claude Code and ask:

> "Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"

Everything loads automatically.

---

## How It Works

```
You ask Claude → .claude/ detected → Rules loaded (by file path)
                                   → Skills available (/tdd, /commit, ...)
                                   → Claude writes code following YOUR conventions
```

---

## Skills

16 slash commands that run full workflows — not just prompts.

**Write code the right way:**
- `/dev:tdd` — Red → green → refactor
- `/dev:fix-bug` — Trace root cause, then fix
- `/dev:commit` — Structured commit: What/Why/Details

**Manage changes:**
- `/sdd:propose` — Design + specs + tasks in one step
- `/sdd:apply` — Implement checklist
- `/sdd:archive` — Archive and verify

**Get clarity:**
- `/report:describe` — One-paragraph summary
- `/research:triz` — Solve contradictions

Full list: [docs/README_DETAILED.md](docs/README_DETAILED.md)

---

## Rules

Automatically load based on file paths:
- **Architecture:** DDD contracts, state ownership, visual cohesion
- **Workflow:** Git discipline, testing conventions, monorepo structure
- **Quality:** Security, unit tests, never silently fix broken tests

---

## Philosophy

- **Tests are specs** — no red test, no requirement
- **Backend owns state** — frontend is stateless projection  
- **Stop on red** — never silently fix broken tests
- **DDD layers** — domain → application → infrastructure → presentation
- **Commits tell a story** — What / Why / Details

---

## Customize

Edit `CLAUDE.md` in your project root to override awesome-claude rules.

Adapt skills to your stack by editing `.claude/skills/dev/deploy.md`, `.claude/skills/dev/test-all.md` after install.

---

## Details

Full documentation: [docs/README_DETAILED.md](docs/README_DETAILED.md)

Installation guide (for Claude): [CLAUDE_INSTALL.md](CLAUDE_INSTALL.md)

---

[MIT](LICENSE)
