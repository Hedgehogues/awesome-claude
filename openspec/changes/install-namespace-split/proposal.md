## Why

Сейчас пользователь должен сам разобраться, что содержит репо awesome-claude, и вручную указать что установить. Claude не исследует репо автономно. Сценарий "дал ссылку — получил предложение" не реализован: пользователь обязан знать структуру заранее.

Дополнительная проблема: rules не разбиты по неймспейсам — нельзя поставить только правила, относящиеся к выбранному набору скиллов.

## What Changes

- Реструктурировать `rules/`: универсальные правила остаются в `rules/` (claude-way, break-stop, git, meta-rules), namespace-специфичные переезжают в `rules/<ns>/` (например, `rules/dev/`, `rules/sdd/`, `rules/skill/`)
- Добавить скилл `dev:install` с pipeline: **clone → explore → propose → confirm → install**
  - **explore**: читает `skills/` и `rules/` из клонированного репо — динамически обнаруживает неймспейсы и их содержимое, не хардкодит список
  - **propose**: формирует предложение с описанием каждого неймспейса (скиллы + правила), задаёт вопрос через AskUserQuestion
  - **install**: устанавливает выбранные неймспейсы; `rules/` (корневые) + `.claude/CLAUDE.md` устанавливаются всегда; для каждого выбранного `<ns>`: `skills/<ns>/` + `commands/<ns>/` + `rules/<ns>/` → соответствующие `.claude/` пути
- Pipeline обязателен — нельзя пропустить propose и перейти напрямую к install
- Обновить `README.md`: Quick Start — "скажи Claude URL репозитория, он предложит что установить"

## Capabilities

See `.sdd.yaml` for machine-readable capability declarations.

### New Capabilities

- `namespace-install`: скилл `dev:install` реализует pipeline clone → explore → propose → confirm → install; explore динамически читает структуру репо; per-namespace install включает skills + rules + commands неймспейса; корневые rules устанавливаются всегда
- `namespace-rules`: структура `rules/<ns>/` — правила организованы по неймспейсам; корневые `rules/` содержат только универсальные правила

### Modified Capabilities

- `install-modes`: расширить описание user mode — добавить autonomous-propose фазу и namespace-rules структуру

## Impact

- `rules/dev/`, `rules/sdd/`, `rules/skill/` и др. — новые директории (реструктуризация)
- `skills/dev/install/skill.md` — новый скилл
- `skills/dev/install/cases/install.md` — test-кейсы
- `commands/dev/install.md` — команда
- `.claude/skills/dev/install/skill.md` — зеркало
- `.claude/commands/dev/install.md` — зеркало
- `README.md` — обновить Quick Start
