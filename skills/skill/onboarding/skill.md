---
name: skill:onboarding
description: >
  Guided entry point для контрибьютора awesome-claude. Показывает полный contributor
  workflow и текущий следующий шаг по состоянию репы. НЕ запускает другие скиллы
  автоматически — только показывает, что вызвать дальше.
model: sonnet
allowed-tools: Bash, Read
---

# skill:onboarding — guided workflow

## Шаги

### 1. Determine state

Через Bash проверь:

```bash
# Есть ли симлинк .claude/skills?
if [ -L .claude/skills ] && [ "$(readlink .claude/skills)" = "$(pwd)/skills" ]; then
  setup_done=yes
else
  setup_done=no
fi

# Есть ли активные ченжи?
if [ -d openspec/changes ] && [ "$(ls -A openspec/changes 2>/dev/null)" ]; then
  active_changes=$(ls openspec/changes)
else
  active_changes=""
fi
```

### 2. Print full workflow

```
=== awesome-claude contributor workflow ===

  1. /skill:setup        — symlinks skills/, commands/, rules/ → .claude/
  2. /skill:deps         — install CLI tools and submodules from manifest.yaml
  3. /sdd:explore        — think through a problem before proposing
  4. /sdd:propose <name> — create change directory with proposal/design/specs/tasks
  5. /sdd:contradiction <name> — verify change for internal consistency
  6. /sdd:apply <name>   — implement tasks with L1/L2/L3 verification
  7. /skill:test-skill <ns>:<skill> — run skill tests
  8. /sdd:archive <name> — finalize and merge specs into openspec/specs/
  9. /skill:release      — bump version in manifest.yaml, commit, tag

For full picture: /skill:test-all (everything), /sdd:audit (consistency), /sdd:repo (submodules).
```

### 3. Highlight next step based on state

```
=== Next recommended step ===
```

Логика:
- `setup_done == no` → выделить шаг 1: `Run /skill:setup to link repo files into .claude/`
- `setup_done == yes && active_changes пуст` → выделить шаг 4: `Run /sdd:propose <name> to start a new change`
- `active_changes непуст` → перечислить все имена и выделить шаг 6/7: `Active changes: <list>. Run /sdd:apply <name> to implement, or /skill:test-skill to test`

### 4. Final hint

```
This skill only shows guidance — it does NOT auto-invoke other skills.
Pick the next command yourself based on the recommendation above.
```

## Что скилл НЕ делает

- НЕ запускает `/skill:setup`, `/sdd:propose` или какие-либо другие скиллы автоматически.
- НЕ модифицирует диск (только читает).
- НЕ изменяет `.sdd-state.yaml` ни одного change'а.
