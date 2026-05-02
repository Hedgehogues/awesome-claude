# Proposal: Fix Input Guards in dev:* Skills and Test Spec Errors

## Why

Прогон `skill:test-all` выявил 9 провалившихся кейсов. Шесть — баги в скиллах:
скиллы либо не проверяют обязательные предусловия, либо не спрашивают пользователя
при пустом `$ARGUMENTS`. Ещё три — ошибки в тест-спеке и стабах, не позволяющие
корректно протестировать поведение.

Без этих исправлений:
- `dev:bump-version` молча модифицирует `.claude/skills/` без `.versions`
- `dev:commit`, `dev:tdd`, `dev:fix-bug`, `dev:tracing` запускают работу без цели
- `dev:init-repo` не знает текущую ветку
- Два кейса `sdd:change-verify` никогда не могут пройти из-за пустого стаба

## What Changes

### Скиллы (6 файлов)

- `skills/dev/bump-version/skill.md` — добавить проверку `.versions` перед запуском скрипта; если отсутствует — стоп с сообщением
- `skills/dev/commit/skill.md` — добавить early-exit: если `git status --short` показывает только untracked или пусто — сообщить "nothing to commit" и завершить
- `skills/dev/fix-bug/skill.md` — добавить guard: если `$ARGUMENTS` пустой — спросить пользователя перед запуском агентов
- `skills/dev/init-repo/skill.md` — добавить `!git branch --show-current` в pre-computed context
- `skills/dev/tdd/skill.md` — добавить guard: если `$ARGUMENTS` пустой — спросить описание фичи
- `skills/dev/tracing/skill.md` — добавить guard: если `$ARGUMENTS` пустой — спросить цель трассировки (не дефолтить в Feature tracing)

### Тест-спеки и стабы (3 файла)

- `skills/sdd/archive/cases/archive.md` — удалить кейс `index-yaml-update` (принадлежит `sdd:apply`)
- `skills/sdd/apply/cases/apply.md` — добавить кейс `index-yaml-update` (перенести из archive)
- `skills/skill/test-skill/stubs/change-with-sdd-yaml.md` — добавить в `tasks.md` реальные задачи с артефактами, чтобы кейсы `missing-artifact-gaps-found` и `human-needed-task` могли сработать

### New Capabilities

- `dev-skill-input-guards`: input validation and early-exit guards for dev namespace skills

See `.sdd.yaml` for capability declarations.
