## Why

Сейчас логи выполнения скиллов кладутся только в `sdd:contradiction` и только в `openspec/changes/<name>/.log/` — в поддиректорию внутри каждого change. Это создаёт два проблемы:

1. **Неполное покрытие**: `sdd:apply`, `sdd:propose`, `sdd:archive` вообще не пишут логи, хотя описывают их в шагах proposal.
2. **Разрозненное хранение**: логи разбросаны по change-директориям, нет единой точки просмотра всех runs.

Переход к единой директории `.logs/` в корне репозитория даёт centralized хранилище всех skill-runs и упрощает диагностику.

См. `.sdd.yaml` для capability declarations.

## What Changes

- Изменить путь записи логов в `skills/sdd/contradiction/skill.md`: с `openspec/changes/<name>/.log/contradiction-<TS>.md` на `.logs/<name>/contradiction-<TS>.md`
- Добавить шаг записи лога в `skills/sdd/apply/skill.md`: `.logs/<name>/apply-<TS>.md`
- Изменить путь в `skills/sdd/propose/skill.md` (шаг 12): с `openspec/changes/<name>/.log/propose-<TS>.md` на `.logs/<name>/propose-<TS>.md`
- Добавить шаг записи лога в `skills/sdd/archive/skill.md`: `.logs/<name>/archive-<TS>.md`
- Обновить `.gitignore`: убрать `**/.log/`, добавить `.logs/`
- Обновить `openspec/specs/skill-run-log-archiving/spec.md`: новый путь, расширить на все 4 скилла

## Capabilities

### New Capabilities

### Modified Capabilities

- `skill-run-log-archiving`: логи всех SDD-скиллов переносятся в `.logs/<change-name>/` в корне репозитория; покрытие расширяется на apply, propose, archive

## Impact

- `skills/sdd/contradiction/skill.md` — изменить путь mkdir/cat в шаге записи лога
- `skills/sdd/propose/skill.md` — изменить путь в шаге 12
- `skills/sdd/apply/skill.md` — добавить финальный шаг записи лога
- `skills/sdd/archive/skill.md` — добавить финальный шаг записи лога
- `.gitignore` — заменить `**/.log/` на `.logs/`
- `openspec/specs/skill-run-log-archiving/spec.md` — обновить требования (путь + 4 скилла)
