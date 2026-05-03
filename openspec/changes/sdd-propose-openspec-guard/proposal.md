## Why

`sdd:propose` вызывает несуществующий скилл `openspec-propose` и ссылается на `.openspec-version`, которого нет. В результате скилл падает на первом же шаге, не давая пользователю понятной ошибки.

## What Changes

- Удалить вызов `openspec-propose` через Skill tool из `sdd:propose/skill.md`
- Удалить упоминание `.openspec-version` и фразу "OpenSpec CLI устанавливается автоматически"
- Добавить guard: проверка `which openspec` в начале скилла; если не установлен — остановиться с сообщением `openspec not found. Run /dev:install`
- Заменить шаг 1 на прямой вызов `openspec new change "<name>"` через Bash tool

## Capabilities

### New Capabilities

- `sdd-propose-openspec-guard`: `sdd:propose` проверяет наличие `openspec` бинаря и корректно завершается с ошибкой если он не установлен

### Modified Capabilities

- `sdd-propose`: шаг 1 переписан — убран вызов несуществующего скилла, добавлена проверка бинаря

## Impact

- `skills/sdd/propose/skill.md` — изменение шага 1 и frontmatter description
- Пользователь получает понятную ошибку вместо `Unknown skill: openspec-propose`

See `.sdd.yaml` for capability declarations.
