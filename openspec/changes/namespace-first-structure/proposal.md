## Why

Сейчас репозиторий организован по типу артефакта (`skills/`, `commands/`, `rules/`, `docs/`), а не по namespace. Это означает, что установка конкретного namespace (`dev`, `sdd`) не включает соответствующие `rules/` и `docs/` — они устанавливаются только целиком или не устанавливаются вовсе. Нельзя поставить `dev` и получить всё что нужно для работы именно с `dev`.

## What Changes

- Репозиторий переструктурируется: namespace становится первичной осью группировки (`dev/skills/`, `dev/commands/`, `dev/rules/`, `dev/docs/`)
- Добавляется `shared/` namespace для артефактов, нужных всем namespace-ам
- `install.sh` обновляется: при установке namespace копирует все его артефакты в правильные пути `.claude/`
- Claude может установить namespace самостоятельно без знания `install.sh` — достаточно изучить структуру директории
- Связан с `skill-auto-deps`: та же механика "разобраться по структуре" применима при авто-установке зависимостей

## Capabilities

### New Capabilities

- `namespace-package`: namespace как самодостаточный пакет — директория с `skills/`, `commands/`, `rules/`, `docs/` подпапками, устанавливаемая целиком

### Modified Capabilities

<!-- нет изменений в существующих спеках -->

## Impact

- Структура репозитория: перенести `skills/<ns>/` → `<ns>/skills/`, `commands/<ns>/` → `<ns>/commands/`, создать `<ns>/rules/` и `<ns>/docs/`
- `shared/` — новая директория для общих артефактов
- `scripts/install.sh` — обновить `install_namespace` для новой структуры
- `scripts/bump-namespace.sh` — обновить пути
- `docs/REPO_ORGANIZATION.md` — переписать под новую структуру

See `.sdd.yaml` for capability declarations.
