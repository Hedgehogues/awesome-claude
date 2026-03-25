---
paths:
  - ".claude/rules/**"
---

# Meta-Rules: How to Write and Maintain Rules

## Structure of a Rule File

Every rule file in `.claude/rules/` MUST have YAML frontmatter with `paths`:

```markdown
---
paths:
  - "src/domain/**"
  - "src/application/**"
---

# Rule Title

Rule content...
```

The ONLY exception is `arch/README.md` — a small index file loaded always.

## Paths Scoping

Choose the narrowest paths that still cover all relevant files:

| Rule topic | Paths |
|-----------|-------|
| Domain logic | `src/domain/**`, `src/application/**` |
| Database | `src/infrastructure/db/**`, `migrations/**` |
| Infrastructure/config | `src/config.py`, `src/main.py`, `docker-compose*`, `Dockerfile*` |
| General Python code | `src/**/*.py` |
| Any file | `**/*` |
| Tests | `tests/**` |
| Rules themselves | `.claude/rules/**` |

## File Organization

- One topic per file, keep files focused
- Group related files in subdirectories: `rules/arch/db/`, `rules/arch/components/`
- File names: UPPER_CASE.md for rule files, lowercase for meta/config

## When to Propose New Rules

IMPORTANT: Proactively suggest adding a new rule when:

- User establishes a convention or preference (e.g., "always use X", "never do Y")
- A pattern repeats across 2+ sessions (coding style, naming, structure)
- User corrects my behavior — the correction should become a rule
- A non-obvious project decision is made that future sessions should know
- User shares architectural or process guidelines

Propose like this: "Хотите, добавлю это как правило в `.claude/rules/`? Тогда я буду помнить это всегда."

## Universality

Rules MUST be project-agnostic and reusable across any codebase:

- No specific task/ticket IDs (use `[TASK-ID]` placeholder)
- No references to files or directories that exist only in a particular project
- No personal information (names, emails, API keys)
- No project-specific business logic or domain details
- Examples should illustrate the pattern, not describe a real task

If a rule needs project context, it belongs in `CLAUDE.md`, not in `.claude/rules/`.

## When NOT to Add Rules

- One-off decisions that won't repeat
- Information already in CLAUDE.md
- Temporary workarounds
