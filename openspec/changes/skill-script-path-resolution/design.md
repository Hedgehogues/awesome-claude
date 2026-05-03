## Context

см. `proposal.md` → ## Why.

Затронуты 7 скиллов и их зеркала в `.claude/skills/`. Обновляется `docs/SKILL_DESIGN.md` и спека `contradiction-script-location`. Изменения только в skill.md и документации — Python-скрипты не трогаются.

## Goals / Non-Goals

**Goals:**
- Заменить все 28 вхождений `${CLAUDE_SKILL_DIR}` в телах скиллов на git-based паттерн
- Исправить спеку `contradiction-script-location`
- Обновить документацию в `SKILL_DESIGN.md`
- Синхронизировать источники `skills/` и зеркала `.claude/skills/`

**Non-Goals:**
- Не трогать Python-скрипты (только пути к ним в skill.md)
- Не убирать `${CLAUDE_SKILL_DIR}` из документации hook-секций — там он работает корректно
- Не менять hook-команды в `settings.json`

## Decisions

### D1: git rev-parse как якорная точка

```bash
REPO=$(git rev-parse --show-toplevel)
```

Всегда возвращает корень репозитория независимо от `cwd` Claude. Работает в любом git-репозитории. Не требует ENV-переменных.

### D2: Два паттерна пути

**Shared-скрипты** (общие для всего sdd/ неймспейса, живут в `sdd/scripts/`):
```bash
REPO=$(git rev-parse --show-toplevel)
python3 "$REPO/.claude/skills/sdd/scripts/identity.py"
```

**Skill-specific скрипты** (живут рядом со скиллом, в `<skill>/scripts/`):
```bash
REPO=$(git rev-parse --show-toplevel)
python3 "$REPO/.claude/skills/sdd/propose/scripts/check-design.py"
```

### D3: Всегда использовать .claude/skills/ зеркало, не skills/ источник

Bash-команды в skill.md ссылаются на `.claude/skills/sdd/scripts/` — это runtime-путь. Источник `skills/sdd/scripts/` — для версионирования и установки. Во время выполнения скилла Claude Code загружает из `.claude/`.

### D4: Подставлять REPO инлайн, не выносить в отдельную команду

Для каждого отдельного вызова скрипта:
```bash
# Предпочтительно — читабельно, атомарно:
python3 "$(git rev-parse --show-toplevel)/.claude/skills/sdd/scripts/identity.py"

# Или если несколько вызовов подряд — однократно задать переменную:
REPO=$(git rev-parse --show-toplevel)
python3 "$REPO/.claude/skills/sdd/scripts/state.py" update ...
python3 "$REPO/.claude/skills/sdd/scripts/state.py" update ...
```

### D5: Обновление SKILL_DESIGN.md

Убрать строку `| ${CLAUDE_SKILL_DIR} | Absolute path to this skill's directory |` из таблицы Variable Substitutions или добавить примечание: «Доступна только в hook-командах settings.json, не в теле skill.md».

Добавить раздел «Script references in skill body» с паттерном D2.

### D6: Обновление contradiction-script-location spec

Требование «`skills/sdd/contradiction.md` SHALL reference the script via `${CLAUDE_SKILL_DIR}/scripts/contradiction.py`» заменить на:
«`skills/sdd/contradiction.md` SHALL reference the script via `$(git rev-parse --show-toplevel)/.claude/skills/sdd/contradiction/scripts/contradiction.py`»

Canonical path для `contradiction.py` — skill-specific (`contradiction/scripts/`), не shared (`sdd/scripts/`). Существующая спека `contradiction-script-location` содержит внутреннее противоречие: Requirement называет `skills/sdd/scripts/contradiction.py` (shared), Scenario использует `${CLAUDE_SKILL_DIR}/scripts/contradiction.py` (→ `skills/sdd/contradiction/scripts/`). При merge-into привести к skill-specific варианту.

## Risks / Trade-offs

[git rev-parse --show-toplevel медленнее переменной] → разница в единицы миллисекунд; несущественно для CLI-контекста.

[Жёсткая привязка к .claude/skills/sdd/ в путях] → путь содержит `.claude/`, что нормально для runtime. При переименовании неймспейса нужно обновлять пути вручную — но это уже существующее ограничение архитектуры.

[28 мест для изменения — риск пропустить] → grep перед tasks + lint-pass в конце apply.
