# awesome-claude

Curated rules, skills, and agents for [Claude Code](https://claude.ai/code) — clone into `.claude/` and go.

## Quick Start

```bash
# In your project root
git clone git@github.com:Hedgehogues/awesome-claude.git .claude

# Add to your project's .gitignore
echo ".claude/" >> .gitignore
```

That's it. Claude Code picks up everything from `.claude/` automatically.

## What's Inside

### Rules (`.claude/rules/`)

Architecture and coding conventions loaded as context when Claude works with matching files.

| Category | What it covers |
|----------|---------------|
| `arch/components/` | DDD building blocks: aggregates, commands, events, queries, domain |
| `arch/db/` | Database design: migrations, indexes, constraints, normal forms, transactions |
| `arch/environment/` | 12-factor app principles: config, dependencies, backing services |
| `arch/functions/` | Refactoring practices: code smells, simplification techniques |
| `break-stop.md` | Stop-on-red protocol — halt and ask when tests break |
| `git.md` | Commit message format with What/Why/Details sections |
| `meta-rules.md` | How to write and maintain rules themselves |
| `frontend-testing.md` | Vitest + Testing Library + Playwright conventions |
| `frontend-design.md` | UI principles: icons-first, accessibility, component patterns |
| `makefile.md` | Makefile hierarchy and delegation patterns |
| `monorepo-structure.md` | Monorepo layout conventions |
| `ui-library.md` | 4-layer component architecture: tokens → primitives → shared → domain |

### Skills (`.claude/skills/`)

Invoked via `/skill-name` in Claude Code.

| Skill | What it does |
|-------|-------------|
| `/tdd` | Full TDD workflow: PlantUML diagrams → test plan → red → green → refactor |
| `/commit` | Structured git commits with What/Why/Details format |
| `/session-report` | Product-focused changelog from uncommitted changes |
| `/deploy` | Docker rebuild + migrate (project-specific, adapt to your stack) |
| `/describe` | Quick project overview without running commands |
| `/test-all` | Run all test suites with detailed statistics report |
| `/tracing` | Trace bugs across layers with sequence diagrams |
| `/ui` | TDD-driven UI component design and implementation |

### Agents (`.claude/agents/`)

Specialized sub-agents spawned automatically by Claude Code.

| Agent | Role |
|-------|------|
| `planner.md` | Requirement analysis and implementation planning |
| `code-review-sentinel.md` | Post-implementation code review with risk assessment |
| `ui-ux-engineer.md` | Senior UI/UX engineer for TDD-driven component work |

## Customization

- **Project-specific rules** → put in your project's `CLAUDE.md` (not tracked by this repo)
- **Project-specific skills** (deploy, describe) → edit them in place after cloning
- **Add new rules** → create `.md` files in `rules/` with YAML frontmatter `paths:` scoping

## Updating

```bash
cd .claude && git pull
```

## License

MIT
