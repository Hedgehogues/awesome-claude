<div align="center">

# awesome-claude

**Your engineering style in Claude Code.** Rules, skills, agents that turn Claude into a senior engineer on your team.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-blueviolet)](https://claude.ai/code)
[![Skills](https://img.shields.io/badge/skills-16-orange)](#-skills)
[![Rules](https://img.shields.io/badge/rules-15-green)](#-rules)

</div>

---

## ⚡ Install

Open Claude Code in your project and ask:

> **"Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"**

Everything loads automatically. That's it.

---

## Skills

Type `/namespace:skill` to activate. Each runs a full workflow — not just a prompt.

### `dev:` — Engineering & TDD

| Command | What It Does |
|---------|-------------|
| `/dev:tdd` | Full TDD cycle: test → red → green → refactor |
| `/dev:fix-bug` | Combines tracing (root cause) + TDD (test-first fix) |
| `/dev:tracing` | Traces bugs across all layers: frontend → API → DB |
| `/dev:fix-tests` | Fix failing tests by modifying logic, not tests |
| `/dev:dead-features` | Find implemented but unreachable code |
| `/dev:init-repo` | Scaffold full DDD monorepo: FastAPI + React |
| `/dev:commit` | Draft structured commit: What/Why/Details |
| `/dev:deploy` | Docker rebuild + migrations |
| `/dev:test-all` | Run all test suites across packages |

### `sdd:` — Spec-Driven Development (requires [OpenSpec CLI](https://openspec.dev))

| Command | What It Does |
|---------|-------------|
| `/sdd:propose` | Propose new change with design, specs, tasks |
| `/sdd:apply` | Implement tasks from `tasks.md` |
| `/sdd:archive` | Archive completed change |
| `/sdd:audit` | Audit manifest consistency |
| `/sdd:help` | Show workflow pipeline |

### `report:` — Summaries

| Command | What It Does |
|---------|-------------|
| `/report:describe` | One-paragraph product summary |
| `/report:session-report` | Summary from conversation context |

### `research:` — Problem Solving

| Command | What It Does |
|---------|-------------|
| `/research:triz` | TRIZ contradiction solver |

---

## Rules

Rules load automatically based on file paths. When you edit `src/domain/`, Claude sees DDD rules. When you edit `tests/`, it sees testing conventions.

**Architecture & DDD:** Contracts, state ownership, visual cohesion, service/view patterns

**Workflow:** Commit messages, testing, monorepo structure, UI library

**Quality:** LLM security, unit tests, break-stop (never fix broken tests silently)

See [docs/README_DETAILED.md](docs/README_DETAILED.md) for the complete rule list and rationale.

---

## How It Works

```
You ask Claude → .claude/ detected → Rules loaded (scoped by path)
                                   → Skills available (/tdd, /commit, ...)
                                   → Claude writes code following YOUR conventions
```

---

## Customization

**Project-specific instructions:** Edit `CLAUDE.md` in your project root (overrides awesome-claude rules)

**Adapt skills to your stack:** After install, edit `.claude/skills/dev/deploy.md`, `.claude/skills/dev/test-all.md` to match your infrastructure

**Add your own rules:** Create `.claude/rules/my-convention.md` with path scoping

---

## Philosophy

- **Tests are specs** — no red test, no requirement
- **Backend owns state** — frontend is stateless projection
- **Stop on red** — never silently fix broken tests
- **DDD layers** — domain → application → infrastructure → presentation
- **Commits tell a story** — What/Why/Details
- **Only project-specific rules** — generic knowledge is already in Claude's training

---

## FAQ

**Does this work with any project or just Python/React?**
Architecture rules are language-agnostic. Skills like `/dev:deploy` are project-specific — edit them for your stack.

**How do I update?**
Use slash commands: `/dev:bump-version`, `/sdd:bump-version`

**What if I have project-specific rules?**
Edit `CLAUDE.md` in your project root — it overrides awesome-claude rules.

---

## For Contributors

See [docs/README_DETAILED.md](docs/README_DETAILED.md) for full documentation on skills, rules, and architecture.

Test a skill: `/skill:test-skill dev:tdd`
Test all skills: `/skill:test-all`

---

## License

[MIT](LICENSE)
