## Why

Механизм bump-version работает для всех неймспейсов, но имеет несколько системных проблем:

1. `bump-namespace.sh` умеет обновляться только по тегу — контрибьютор не может протестировать изменения с ветки до релиза.
2. Скрипт копирует только `skills/<namespace>/` — рулы, скрипты и другие файлы неймспейса пользователь не получает.
3. У пользователя нет точки входа: Claude не знает что установлено и где искать.

## What Changes

- `bump-namespace.sh` получает флаг `--ref <tag|branch|sha>` для установки с любого ref
- Формат `.versions` меняется на `type:label@sha` — одно сравнение для всех типов ref
- `.manifest` каждого неймспейса расширяется полем `namespaces:` — список всех папок неймспейса; bump копирует все из них
- `bump-namespace.sh` при первой установке прописывает в `CLAUDE.md` пользователя ссылку на `.claude/awesome-claude/index.md` — точку входа для Claude

## Capabilities

### New Capabilities

- `bump-ref-support`: установка неймспейса с произвольного ref (тег, ветка, SHA).
- `bump-full-namespace`: bump копирует все файлы неймспейса согласно `.manifest`, не только скиллы.
- `claude-entry-point`: точка входа для Claude через `index.md` в `.claude/` пользователя.

### Modified Capabilities

- `bump-namespace`: расширение `.versions` формата и поддержка `namespaces:` в `.manifest`.

## Impact

- Изменение: `.claude/scripts/bump-namespace.sh`
- Изменение: `.manifest` во всех неймспейсах (`dev`, `sdd`, `report`, `research`, `skill`)

See `.sdd.yaml` for capability declarations.
