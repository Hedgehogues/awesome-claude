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

## Init

> **Instructions for Claude (read this first when invoked in any directory).**
>
> awesome-claude operates in two modes — pick one based on the current directory:
>
> 1. **dev mode** — directory contains `skills/`, `commands/`, `manifest.yaml` (or `.openspec.yaml`): you are inside the awesome-claude repo itself. The contributor wants to edit skills/rules. Suggest dev mode and run `skill:setup` (or read `skills/skill/setup/skill.md` directly on first bootstrap when symlinks don't exist yet) to symlink `skills/`, `commands/`, `rules/` into `.claude/`.
> 2. **user mode** — any other directory: the user wants to install awesome-claude into their project. Ask which namespaces to install (or all by default), `git clone https://github.com/Hedgehogues/awesome-claude` to a temp directory, copy selected namespaces into `.claude/`, remove the temp directory.
>
> Briefly describe both options to the user (1–2 sentences each), ask them to confirm, then perform setup directly — no `curl | bash`, no `make`, no manual commands.

---

## Quick Start (user mode)

Open Claude Code in your project directory and ask:

> "Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"

Claude clones the repo, copies the selected skills/rules into `.claude/`, and your project is ready.

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
- `/sdd:contradiction` — Check design for contradictions
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

## Contributing (dev mode)

Inside the awesome-claude repo:

1. `/skill:setup` — symlinks `skills/`, `commands/`, `rules/` into `.claude/`. After this, every edit under `skills/` is visible to Claude Code immediately, no manual copying.
2. `/skill:deps` — installs CLI dependencies (`openspec` etc.) and submodules from `manifest.yaml`.
3. `/skill:onboarding` — guided walkthrough of the contributor workflow (next step depends on current state: setup → deps → propose → apply → test).
4. Standard SDD flow: `/sdd:propose` → `/sdd:contradiction` → `/sdd:apply` → `/sdd:archive`.
5. `/skill:test-skill <ns>:<skill>` to run skill tests; `/skill:test-all` to run everything.
6. `/skill:release` when ready to cut a new version.

---

## Details

Full documentation: [docs/README_DETAILED.md](docs/README_DETAILED.md)

Installation guide (for Claude): [CLAUDE_INSTALL.md](CLAUDE_INSTALL.md)

---

[MIT](LICENSE)
