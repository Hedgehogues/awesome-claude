<div align="center">

# awesome-claude

**Drop-in rules, skills, and agents that make Claude Code a senior engineer on your team.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-blueviolet)](https://claude.ai/code)
[![Rules](https://img.shields.io/badge/rules-60%2B-green)](#-rules)
[![Skills](https://img.shields.io/badge/skills-8-orange)](#-skills)
[![Agents](https://img.shields.io/badge/agents-3-red)](#-agents)

<br>

```
git clone git@github.com:Hedgehogues/awesome-claude.git .claude
```

Two seconds. Zero config. Your AI pair programmer just got 10x better.

</div>

---

## The Problem

Out of the box, Claude Code is powerful but generic. It doesn't know your architecture conventions, commit style, testing philosophy, or how your team works.

**You end up repeating the same instructions every session:**
- "Write tests first, then implementation"
- "Use DDD layers: domain → application → infrastructure → presentation"
- "Stop and ask me if tests break — don't try to fix them yourself"
- "Commit messages must have What/Why/Details sections"

## The Solution

**awesome-claude** is a curated collection of `.claude/` configuration files that teach Claude Code to work like a seasoned engineer. Clone it once — Claude remembers forever.

```
.claude/
├── rules/      # 60+ architecture & coding conventions
├── skills/     # 8 slash commands (/tdd, /commit, /deploy...)
└── agents/     # 3 specialized sub-agents (planner, reviewer, UI engineer)
```

---

## Quick Start

```bash
# 1. Clone into any project
git clone git@github.com:Hedgehogues/awesome-claude.git .claude

# 2. Exclude from your project's git
echo ".claude/" >> .gitignore

# 3. Start Claude Code — everything loads automatically
claude
```

> **Updating:** `cd .claude && git pull` — that's it.

---

## What You Get

### 📐 Rules

Architecture and coding conventions that load automatically based on file paths. Claude sees only the rules relevant to what it's editing.

<details>
<summary><b>Architecture — DDD & Clean Architecture</b></summary>

| Rule | What it enforces |
|------|-----------------|
| `AGREGATES.md` | Aggregate design: identity, invariants, consistency boundary |
| `AGGREGATE_STRUCTURE.md` | Standard aggregate file layout |
| `COMMANDS.md` | Command pattern: validation, execution, idempotency |
| `EVENTS.md` | Domain events: naming, payload, ordering |
| `QURIES.md` | Query separation: read models, projections |
| `DOMAIN.md` | Pure domain layer: no infrastructure imports |
| `ONE_AGGREGATE_ONE_REPO.md` | Repository-per-aggregate rule |
| `SHARED_KERNEL.md` | Shared kernel boundaries and contracts |
| `SERVICES.md` | Application service orchestration rules |
| `VIEWS.md` | Presentation layer contracts |
| `STATE_OWNERSHIP.md` | Backend is the single source of truth |

</details>

<details>
<summary><b>Database Design</b></summary>

| Rule | What it enforces |
|------|-----------------|
| `MIGRATIONS.md` | Safe migration practices: reversible, no data loss |
| `INDEXES.md` | Index strategy: when to add, naming, composite indexes |
| `CONSTRAINTS.md` | DB-level constraints: NOT NULL, CHECK, UNIQUE, FK |
| `NORMAL_FORMS.md` | Normalization rules and when to denormalize |
| `TRANSACTIONS.md` | Transaction boundaries and isolation levels |
| `VERSIONING.md` | Schema versioning strategy |
| `READ_MODEL.md` | Read-optimized projections |
| `WRITE_MODEL.md` | Write model design |
| `PERFORMANCE.md` | Query optimization, N+1 prevention |
| `RETENTION.md` | Data retention and cleanup policies |
| `SECURITY.md` | DB security: least privilege, parameterized queries |
| `SEEDS_FIXTURES.md` | Test data management |

</details>

<details>
<summary><b>12-Factor App</b></summary>

| Rule | What it enforces |
|------|-----------------|
| `CODEBASE.md` | One codebase, many deploys |
| `DEPENDENCIES.md` | Explicit dependency declaration |
| `CONFIG.md` | Config in environment variables |
| `BACKING_SERVICES.md` | Treat backing services as attached resources |
| `BUILD_RELEASE_RUN.md` | Strict separation of build and run stages |
| `PROCESS.md` | Stateless processes |
| `PORT_BINDING.md` | Export services via port binding |
| `CONCURRENCY.md` | Scale out via the process model |
| `DISPOSABILITY.md` | Fast startup, graceful shutdown |
| `DEV_PROD_PARITY.md` | Keep dev, staging, and prod similar |
| `ADMIN_PROCESSES.md` | Run admin tasks as one-off processes |
| `MAKEFILE.md` | Makefile as the universal entry point |

</details>

<details>
<summary><b>Code Quality & Refactoring</b></summary>

| Rule | What it enforces |
|------|-----------------|
| `CHANGE_BREAKERS.md` | Patterns that make code hard to change |
| `INFLATORS.md` | Code bloat detection and prevention |
| `TRASHERS.md` | Dead code, unused imports, stale comments |
| `DEPS.md` | Dependency management and coupling |
| `OOP_DESIGN.md` | SOLID principles, composition over inheritance |
| `CONDITIONS.md` | Simplifying conditional logic |
| `DATA.md` | Data structure organization |
| `FUNCTIONS.md` | Function design: SRP, pure functions |
| `GENERALIZATIONS.md` | When and how to generalize |
| `METHODS.md` | Method extraction and composition |
| `SIMPLIFY.md` | Simplification techniques |

</details>

<details>
<summary><b>Workflow & Conventions</b></summary>

| Rule | What it enforces |
|------|-----------------|
| `break-stop.md` | 🔴 **Hard stop** when tests break — ask before fixing |
| `git.md` | Commit messages with What / Why / Details sections |
| `meta-rules.md` | How to write and maintain rules themselves |
| `frontend-testing.md` | Vitest + Testing Library + Playwright patterns |
| `frontend-design.md` | Icons-first UI, accessibility, component patterns |
| `makefile.md` | Makefile hierarchy and delegation |
| `monorepo-structure.md` | Monorepo layout conventions |
| `ui-library.md` | 4-layer component architecture |
| `LLM_SECURITY.md` | Prompt injection prevention, output validation |
| `UNIT_TESTS.md` | Test contracts, not values; no shared mutable state |
| `LOGS.md` | Structured logging format and conventions |
| `MONITORING.md` | Metrics, alerts, and observability |
| `ARCH_TESTS.md` | Automated DDD contract validation (R1–R5) |

</details>

---

### ⚡ Skills

Slash commands you invoke directly in Claude Code. Type `/tdd` and watch it work.

| Command | What happens |
|---------|-------------|
| `/tdd <task>` | Full TDD cycle: PlantUML diagrams → test plan → red tests → green implementation → refactor. Works as a 20-year QA veteran. |
| `/commit` | Analyzes all changes, drafts a structured commit message (What/Why/Details), shows you the plan, waits for approval. |
| `/session-report` | Generates a product-focused summary of uncommitted changes — grouped by user-facing features, not files. |
| `/test-all` | Runs **every** test suite across all packages (unit, state, security, integration, e2e) with a detailed statistics table. |
| `/tracing <bug>` | Traces a bug across all layers (frontend → API → backend → DB), generates PlantUML sequence diagrams showing the failure path. |
| `/ui <component>` | Senior UI/UX engineer mode: designs and implements React components with TDD, accessibility, and responsive design. |
| `/deploy` | Docker rebuild + restart + migrations. Adapt to your stack after cloning. |
| `/describe` | Quick project overview without running any commands. |

---

### 🤖 Agents

Specialized sub-agents that Claude Code spawns automatically when the task matches.

| Agent | When it activates | What it does |
|-------|-------------------|-------------|
| **Planner** | New features, complex tasks | Analyzes requirements, identifies affected files, produces step-by-step implementation plan with verification steps |
| **Code Review Sentinel** | After writing code | Reviews against project rules, checks test quality, detects trivial tests, identifies security vulnerabilities and risks |
| **UI/UX Engineer** | Frontend components | Designs and implements with TDD — writes Vitest/RTL tests first, then builds accessible, responsive components |

---

## How It Works

Claude Code automatically loads configuration from the `.claude/` directory:

```
Your project/
├── .claude/          ← this repo (its own git)
│   ├── rules/        ← loaded based on file path matching
│   ├── skills/       ← available as /slash-commands
│   └── agents/       ← spawned as specialized sub-agents
├── .gitignore        ← contains ".claude/"
├── CLAUDE.md         ← YOUR project-specific instructions
└── src/              ← your code
```

**Rules** use YAML frontmatter to scope when they activate:

```yaml
---
paths:
  - "src/domain/**"        # only loads when editing domain files
  - "src/application/**"
---
```

This means Claude doesn't get overwhelmed with 60+ rules at once — it only sees what's relevant.

---

## Customization

| What | Where | Tracked by |
|------|-------|-----------|
| Universal rules, skills, agents | `.claude/` | awesome-claude repo |
| Project-specific instructions | `CLAUDE.md` in project root | your project's repo |
| Project-specific skills (deploy, test-all) | edit in `.claude/skills/` after cloning | awesome-claude repo (local changes) |
| Personal preferences | `~/.claude/CLAUDE.md` | not tracked |

### Adding Your Own Rules

```markdown
<!-- .claude/rules/my-rule.md -->
---
paths:
  - "src/**/*.py"
---

# My Custom Rule

Your convention here...
```

---

## Philosophy

This collection is opinionated. It encodes a specific engineering philosophy:

- **Tests are specifications** — no red test, no requirement
- **Backend owns all state** — frontend is a stateless projection
- **Stop on red** — never silently fix broken tests, always ask
- **DDD layers** — domain → application → infrastructure → presentation
- **Commits tell a story** — What changed, Why, and Details
- **12-factor app** — config in env, stateless processes, explicit deps

If this matches how you work — clone and go. If not — fork and make it yours.

---

## License

[MIT](LICENSE) — use it, fork it, share it.
