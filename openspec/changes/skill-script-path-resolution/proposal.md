## Why

Все скиллы, вызывающие Python-скрипты, используют паттерн:

```bash
python3 "${CLAUDE_SKILL_DIR}/../scripts/identity.py"
```

`${CLAUDE_SKILL_DIR}` задокументирован в `docs/SKILL_DESIGN.md` как переменная подстановки, которую делает Claude Code harness. На практике она подставляется **только в hook-командах** `settings.json` — не в теле skill.md, которое Claude получает как текст-промпт и выполняет через Bash tool. В Bash-окружении переменная не установлена → раскрывается в пустую строку → путь вида `/../scripts/identity.py` → `FileNotFoundError`.

Затронуты 28 вхождений в 7 скиллах: `sdd:propose`, `sdd:apply`, `sdd:archive`, `sdd:contradiction`, `sdd:bump-version`, `dev:bump-version`, `report:bump-version`, `research:bump-version`. Все скрипты физически присутствуют в нужных местах; проблема только в разыменовании пути.

## What Changes

- Заменить все вхождения `${CLAUDE_SKILL_DIR}` в телах skill.md на конструкцию на основе `git rev-parse --show-toplevel`
- Паттерн для shared-скриптов (`sdd/scripts/`):
  ```bash
  REPO=$(git rev-parse --show-toplevel)
  python3 "$REPO/.claude/skills/sdd/scripts/identity.py"
  ```
- Паттерн для skill-specific скриптов (например, `propose/scripts/check-design.py`):
  ```bash
  REPO=$(git rev-parse --show-toplevel)
  python3 "$REPO/.claude/skills/sdd/propose/scripts/check-design.py"
  ```
- Обновить спеку `contradiction-script-location`: убрать требование использовать `${CLAUDE_SKILL_DIR}` — заменить на git-based паттерн
- Обновить `docs/SKILL_DESIGN.md`: исправить документацию `${CLAUDE_SKILL_DIR}` — объяснить, что в теле скилла переменная недоступна; задокументировать правильный паттерн
- Обновить зеркала в `.claude/skills/` синхронно с источниками в `skills/`

## Capabilities

### New Capabilities

- `skill-script-path-resolution`: стандартный паттерн ссылки на скрипты из тела skill.md через `$(git rev-parse --show-toplevel)` вместо `${CLAUDE_SKILL_DIR}`

### Modified Capabilities

- `contradiction-script-location`: убрать мандат на `${CLAUDE_SKILL_DIR}` в пути к `contradiction.py`; заменить на git-based паттерн

## Impact

- Все 7 скиллов начнут корректно резолвить пути к скриптам без ручных обходных путей
- Изменение обратно совместимо: `git rev-parse --show-toplevel` работает в любом git-репозитории
- Один чёткий паттерн вместо переменной с неявным lifecycle
- Документация в `SKILL_DESIGN.md` станет соответствовать реальному поведению

See `.sdd.yaml` for capability declarations.
