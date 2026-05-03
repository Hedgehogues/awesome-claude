## Why

`sdd:help` не инкапсулирует никакой логики, недоступной Claude нативно: он запускает несколько git-команд, читает frontmatter из файлов скиллов и форматирует вывод — всё это Claude делает без промптинга. Поддержка отдельного скилла, кейсов и тестов создаёт накладные расходы без добавления ценности.

## What Changes

- Удалить `.claude/skills/sdd/help/skill.md`
- Удалить `.claude/skills/sdd/help/cases/help.md` и директорию `cases/`
- Удалить `.claude/commands/sdd/help.md`
- Удалить `skills/sdd/help/` (зеркальная копия в корне репозитория)
- Удалить `commands/sdd/help.md` (зеркальная копия в корне репозитория)
- Обновить `.claude/skills/sdd/propose/skill.md` — убрать упоминание `workflow_step: 1` / `sdd:help` из комментариев или ссылок, если есть
- Обновить любой `README.md` или документацию, ссылающуюся на `/sdd:help`

## Capabilities

### New Capabilities
<!-- нет новых capabilities — это удаление -->

### Modified Capabilities
- `sdd-ownership`: удаление `sdd:help` изменяет состав SDD workflow (один скилл меньше в pipeline); требуется delta-spec если `sdd-ownership` описывает полный список скиллов

## Impact

- Пользователи, вызывающие `/sdd:help` вручную, получат ответ от Claude напрямую без потери функциональности — Claude уже умеет выполнять эти команды
- Тестовый стаб `help` можно удалить без замены
- Нет breaking changes для downstream пользователей (скилл не используется другими скиллами как зависимость)

See `.sdd.yaml` for capability declarations.
